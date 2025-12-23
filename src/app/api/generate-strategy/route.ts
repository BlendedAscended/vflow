import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import { getServices } from '../../../lib/knowledge-base';
import { Resend } from 'resend';

// Initialize Gemini client inside the handler

export async function POST(request: Request) {
    console.log('=== API Route /api/generate-strategy called ===');
    try {
        const body = await request.json();
        console.log('✓ Request body parsed:', JSON.stringify(body, null, 2));

        // 1. Fetch Dynamic Data from Supabase
        console.log('→ Fetching services from Supabase...');
        let verbaflowServices;
        try {
            verbaflowServices = await getServices();
            console.log(`✓ Fetched ${verbaflowServices?.length || 0} services from Supabase`);
        } catch (dbError) {
            console.error('✗ Error fetching services from Supabase:', dbError);
            verbaflowServices = null;
        }

        // Fallback if DB fetch fails or returns empty, to prevent Gemini Schema error (empty enum)
        if (!verbaflowServices || verbaflowServices.length === 0) {
            console.warn('⚠ Warning: No services fetched from DB. Using fallback defaults.');
            verbaflowServices = [
                { name: "Website Development", id: "web", description: "", price_range: "" },
                { name: "Digital Marketing", id: "marketing", description: "", price_range: "" },
                { name: "AI Automation", id: "ai", description: "", price_range: "" },
                { name: "Cloud Solutions", id: "cloud", description: "", price_range: "" },
                { name: "Trade & Home Services", id: "trade", description: "", price_range: "" }
            ];
        }

        // 2. Define Schema with Dynamic Enums
        const planSchema: Schema = {
            description: "A comprehensive growth strategy plan",
            type: SchemaType.OBJECT,
            properties: {
                executive_summary: {
                    type: SchemaType.STRING,
                    description: "A high-level summary of the strategy tailored to the client's industry and stage.",
                    nullable: false,
                },
                phases: {
                    type: SchemaType.ARRAY,
                    description: "Three distinct phases of growth (Immediate, Strategic, Scale).",
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            title: { type: SchemaType.STRING, description: "Title of the phase (e.g., Phase 1: Immediate Wins)" },
                            duration: { type: SchemaType.STRING, description: "Estimated duration (e.g., Days 1-30)" },
                            actions: {
                                type: SchemaType.ARRAY,
                                items: { type: SchemaType.STRING },
                                description: "List of specific actionable steps."
                            }
                        },
                        required: ["title", "duration", "actions"]
                    }
                },
                recommended_services: {
                    type: SchemaType.ARRAY,
                    description: "List of Verbaflow services that would help execute this plan.",
                    items: {
                        type: SchemaType.STRING,
                        format: 'enum',
                        enum: verbaflowServices.map(s => s.name) // Dynamic from DB (or fallback)
                    }
                },
                estimated_investment: {
                    type: SchemaType.STRING,
                    description: "A rough estimated monthly investment range based on the recommended services."
                }
            },
            required: ["executive_summary", "phases", "recommended_services", "estimated_investment"]
        };

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        console.log('→ Checking Gemini API Key... Present:', !!apiKey);

        if (!apiKey) {
            console.error('✗ Missing GEMINI_API_KEY - Using MOCK response for testing');
            // ... (Mock response handling)
            // For mock, we can just return what we had before, or use the first few services from DB
            const mockPlan = {
                executive_summary: "This is a MOCK executive summary. The API key is missing...",
                phases: [
                    { title: "Phase 1", duration: "1mo", actions: ["Mock Action"] }
                ],
                recommended_services: [verbaflowServices[0]?.name || "Web Design"],
                estimated_investment: "$2,000 - $4,000"
            };
            return NextResponse.json({ plan: mockPlan });
        }

        // Initialize Gemini client inside the function
        console.log('→ Initializing Gemini AI client...');
        const genAI = new GoogleGenerativeAI(apiKey);

        // Use verbaflowServices as serviceKnowledgeBase
        const serviceKnowledgeBase = verbaflowServices;

        console.log('→ Creating Gemini model with schema...');
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `
        You are an expert business growth strategist at Verbaflow, a digital agency.
        Your goal is to create a tactical, actionable growth plan based on the user's inputs.
        
        Use the following knowledge base of Verbaflow's services to recommend the most relevant solutions:
        ${JSON.stringify(serviceKnowledgeBase, null, 2)}

        Guidelines:
        - Be specific and prescriptive. Avoid generic advice.
        - The "Executive Summary" should be a high-level strategic overview.
        - The "Action Plan" should be broken down into 3 distinct phases (e.g., "Immediate Wins", "Strategic Growth", "Scaling & Automation").
        - "Recommended Services" MUST be selected ONLY from the provided knowledge base.
        - "Estimated Investment" should be a realistic monthly range based on the services and the user's stated budget.
        - Tone: Professional, encouraging, and authoritative.
      `,
            generationConfig: {
                temperature: 0,
                responseMimeType: "application/json",
                responseSchema: planSchema,
            },
        });

        const { industry, stage, challenges, goals, teamSize, budget, timeline, name, email, subNiches } = body;

        const prompt = `
      Create a growth plan for a client with the following profile:
      - Industry: ${industry}
      - Specific Focus/Services: ${subNiches ? subNiches.join(', ') : 'Not specified'}
      - Stage: ${stage}
      - Challenges: ${challenges.join(', ')}
      - Goals: ${goals.join(', ')}
      - Team Size: ${teamSize}
      - Budget: ${budget}
      - Timeline: ${timeline}
      - Name: ${name}
    `;

        console.log('→ Calling Gemini API to generate content...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('✓ Gemini response received, length:', text.length);

        const plan = JSON.parse(text);
        console.log('✓ Plan parsed successfully');

        // --- Save to Supabase (Leads) ---
        try {
            // Use the SERVICE_ROLE_KEY if available for admin privileges (bypassing RLS if needed),
            // otherwise fall back to common client. 
            // Note: For server-side operations, strictly better to use a service client if RLS is tight.
            // We will import the shared client for now, but assume RLS allows insert or we use admin client.
            const { supabase } = await import('../../../lib/supabase');

            // To properly use the service role key for admin access (if needed):
            // const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

            const { error: dbError } = await supabase.from('leads').insert({
                name,
                email,
                industry,
                stage,
                team_size: teamSize,
                budget,
                timeline,
                challenges,
                goals,
                sub_niches: subNiches,
                growth_plan_data: plan, // Storing the full generated JSON
                created_at: new Date().toISOString()
            });

            if (dbError) {
                console.error('Supabase DB Error:', dbError);
                // Don't fail the request, just log it. 
                // In production, you might want to alert someone.
            } else {
                console.log('Lead saved to Supabase successfully');
            }
        } catch (dbErr) {
            console.error('Error saving to Supabase:', dbErr);
        }
        // ----------------------

        // --- Email Sending Logic (Resend) ---
        const resendApiKey = process.env.RESEND_API_KEY;
        console.log('→ Checking Resend API Key... Present:', !!resendApiKey, 'Email:', email);

        if (resendApiKey && email) {
            try {
                const resend = new Resend(resendApiKey);
                console.log(`→ Attempting to send email to ${email}...`);

                // Use your verified domain
                const fromEmail = 'Verbaflow Growth Plan <noreply@mail.verbaflowllc.com>';

                const emailHtml = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1>Your Growth Strategy Plan</h1>
                        <p>Hi ${name},</p>
                        <p>Here is the growth plan we generated for you based on your business profile.</p>
                        
                        <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h2>Executive Summary</h2>
                            <p>${plan.executive_summary}</p>
                        </div>

                        <h2>Action Plan</h2>
                        ${plan.phases.map((phase: { title: string; duration: string; actions: string[] }) => `
                            <div style="margin-bottom: 20px;">
                                <h3 style="color: #333;">${phase.title} (${phase.duration})</h3>
                                <ul>
                                    ${phase.actions.map((action: string) => `<li>${action}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}

                        <div style="margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 20px;">
                            <h3>Recommended Services</h3>
                            <p>${plan.recommended_services.join(', ')}</p>
                            <h3>Estimated Investment</h3>
                            <p><strong>${plan.estimated_investment}</strong></p>
                        </div>

                        <p style="margin-top: 40px; font-size: 12px; color: #888;">
                            Generated by Verbaflow AI
                        </p>
                    </div>
                `;

                const { data, error } = await resend.emails.send({
                    from: fromEmail,
                    to: [email],
                    subject: 'Your Custom Growth Strategy Plan - Verbaflow',
                    html: emailHtml,
                });

                if (error) {
                    console.error('✗ Resend API Error:', error);
                } else {
                    console.log('✓ Email sent successfully:', data);
                }
            } catch (emailError) {
                console.error('✗ Error sending email:', emailError);
            }
        } else {
            console.log('⚠ Skipping email: Missing RESEND_API_KEY or user email.');
        }

        console.log('✓ Returning plan to client...');
        return NextResponse.json({ plan });
    } catch (error) {
        console.error('✗✗✗ FATAL ERROR in generate-strategy:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return NextResponse.json(
            { error: 'Failed to generate strategy' },
            { status: 500 }
        );
    }
}
