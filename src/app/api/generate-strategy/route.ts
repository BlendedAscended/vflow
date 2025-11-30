import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import { verbaflowServices } from '../../../lib/knowledge-base';
import { Resend } from 'resend';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../../../sanity/env';

// Initialize Gemini client inside the handler

// Define the schema for the structured output
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
                enum: verbaflowServices.map(s => s.name) // Constrain to actual services
            }
        },
        estimated_investment: {
            type: SchemaType.STRING,
            description: "A rough estimated monthly investment range based on the recommended services."
        }
    },
    required: ["executive_summary", "phases", "recommended_services", "estimated_investment"]
};

export async function POST(request: Request) {
    console.log('API Route /api/generate-strategy called');
    try {
        const body = await request.json();
        console.log('Request body:', JSON.stringify(body, null, 2));

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        console.log('API Key present:', !!apiKey);

        if (!apiKey) {
            console.error('Missing GEMINI_API_KEY - Using MOCK response for testing');
            const mockPlan = {
                executive_summary: "This is a MOCK executive summary. The API key is missing, so we are simulating a successful response to test the frontend display. Your business is in the [Industry] industry and is currently in the [Stage] stage.",
                phases: [
                    {
                        title: "Phase 1: Immediate Wins",
                        duration: "Days 1-30",
                        actions: ["Action 1: Optimize website", "Action 2: Set up analytics", "Action 3: Claim social profiles"]
                    },
                    {
                        title: "Phase 2: Strategic Growth",
                        duration: "Months 2-6",
                        actions: ["Action 1: Launch content marketing", "Action 2: Start email campaigns", "Action 3: Run paid ads"]
                    },
                    {
                        title: "Phase 3: Scaling",
                        duration: "Months 6+",
                        actions: ["Action 1: Hire sales team", "Action 2: Automate workflows", "Action 3: Expand to new markets"]
                    }
                ],
                recommended_services: ["Digital Marketing", "Website Development", "SEO Optimization"],
                estimated_investment: "$2,000 - $4,000 / month"
            };
            return NextResponse.json({ plan: mockPlan });
        }

        // Initialize Gemini client inside the function
        const genAI = new GoogleGenerativeAI(apiKey);

        // Use verbaflowServices as serviceKnowledgeBase
        const serviceKnowledgeBase = verbaflowServices;

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

        const { industry, stage, challenges, goals, teamSize, budget, timeline, email, name, subNiches } = body;

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

        console.log('Sending prompt to Gemini...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Gemini response received:', text);

        const plan = JSON.parse(text);

        // --- Save to Sanity ---
        try {
            const token = process.env.SANITY_API_TOKEN;
            if (token) {
                const client = createClient({
                    projectId,
                    dataset,
                    apiVersion,
                    token,
                    useCdn: false,
                });

                await client.create({
                    _type: 'contact',
                    name,
                    email,
                    subject: 'Growth Plan Generation',
                    message: `Growth Plan generated for ${industry} industry, ${stage} stage.`,
                    source: 'Growth Plan',
                    industry,
                    stage,
                    challenges,
                    goals,
                    teamSize,
                    budget,
                    timeline,
                    status: 'new',
                    submittedAt: new Date().toISOString(),
                });
                console.log('Saved to Sanity successfully');
            } else {
                console.warn('Skipping Sanity save: Missing SANITY_API_TOKEN');
            }
        } catch (sanityError) {
            console.error('Error saving to Sanity:', sanityError);
        }
        // ----------------------

        // --- Email Sending Logic (Resend) ---
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey && email) {
            try {
                const resend = new Resend(resendApiKey);
                console.log(`Attempting to send email to ${email}...`);

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
                    from: 'Verbaflow <onboarding@resend.dev>', // Use default Resend domain for testing if not configured
                    to: [email],
                    subject: 'Your Custom Growth Strategy Plan - Verbaflow',
                    html: emailHtml,
                });

                if (error) {
                    console.error('Resend API Error:', error);
                } else {
                    console.log('Email sent successfully:', data);
                }
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }
        } else {
            console.log('Skipping email: Missing RESEND_API_KEY or user email.');
        }
        // ------------------------------------

        return NextResponse.json({ plan });
    } catch (error) {
        console.error('Error generating strategy:', error);
        return NextResponse.json(
            { error: 'Failed to generate strategy' },
            { status: 500 }
        );
    }
}
