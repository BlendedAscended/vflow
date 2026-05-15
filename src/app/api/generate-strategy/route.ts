import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServices } from '../../../lib/knowledge-base';
import { Resend } from 'resend';

function normalizePlan(raw: any) {
    // Already correct shape
    if (Array.isArray(raw.phases)) {
        return {
            executive_summary: raw.executive_summary || raw.strategic_outlook || '',
            phases: raw.phases.map((p: any) => ({
                title: p.title || 'Phase',
                duration: p.duration || 'TBD',
                actions: Array.isArray(p.actions) ? p.actions : [String(p.actions || '')],
            })),
            recommended_services: Array.isArray(raw.recommended_services)
                ? raw.recommended_services.map((s: any) => (typeof s === 'string' ? s : s.name || String(s)))
                : [],
            estimated_investment: typeof raw.estimated_investment === 'string'
            ? raw.estimated_investment
            : raw.estimated_investment?.initial_setup_range
                ? `${raw.estimated_investment.initial_setup_range}${raw.estimated_investment.monthly_growth_retainer ? ' + ' + raw.estimated_investment.monthly_growth_retainer + '/mo' : ''}`
                : 'Contact for quote',
            wireframe_url: raw.wireframe_url,
            tech_stack: raw.tech_stack,
        };
    }

    // Gemini 3.x shape: action_plan object with string values
    const ap = raw.action_plan || {};
    const phases: { title: string; duration: string; actions: string[] }[] = [];

    const phaseMap: Record<string, { title: string; duration: string }> = {
        phase_1_immediate_wins: { title: 'Phase 1: Immediate Wins', duration: 'Days 1-30' },
        phase_2_strategic_growth: { title: 'Phase 2: Strategic Growth', duration: 'Days 31-90' },
        phase_3_scaling_and_automation: { title: 'Phase 3: Scale & Automate', duration: 'Days 91-180' },
        phase_3_scaling_automation: { title: 'Phase 3: Scale & Automate', duration: 'Days 91-180' },
        phase_3_automation: { title: 'Phase 3: Scale & Automate', duration: 'Days 91-180' },
    };

    for (const [key, meta] of Object.entries(ap)) {
        if (typeof key !== 'string' || !phaseMap[key]) {
            // Fuzzy match: if key starts with phase_1/2/3
            const phaseNum = key.match(/^phase_(\d)/)?.[1];
            if (phaseNum && !phaseMap[key]) {
                const fallback = phaseNum === '1' ? 'phase_1_immediate_wins' : phaseNum === '2' ? 'phase_2_strategic_growth' : 'phase_3_scaling_and_automation';
                const text = ap[key];
                if (text && typeof text === 'string') {
                    const actions = text.split(/\.(?!\d)/).map((s: string) => s.trim()).filter(Boolean);
                    phases.push({ title: phaseMap[fallback].title, duration: phaseMap[fallback].duration, actions: actions.length > 0 ? actions : [text] });
                }
            }
            continue;
        }
        const text = ap[key];
        if (text && typeof text === 'string') {
            // Split sentences into actions
            const actions = text.split(/\.(?!\d)/).map((s: string) => s.trim()).filter(Boolean);
            phases.push({
                title: meta.title,
                duration: meta.duration,
                actions: actions.length > 0 ? actions : [text],
            });
        }
    }

    // recommended_services may be nested objects
    const services = Array.isArray(raw.recommended_services)
        ? raw.recommended_services.map((s: any) => {
            if (typeof s === 'string') return s;
            if (s && typeof s === 'object') return s.name || s.strategic_value || s.id || String(s);
            return String(s);
        })
        : [];

    return {
        executive_summary: raw.executive_summary || raw.strategic_outlook || '',
        phases: phases.length > 0 ? phases : [
            { title: 'Phase 1', duration: 'TBD', actions: ['See executive summary for details'] }
        ],
        recommended_services: services,
        estimated_investment: typeof raw.estimated_investment === 'string'
            ? raw.estimated_investment
            : raw.estimated_investment?.initial_setup_range
                ? `${raw.estimated_investment.initial_setup_range}${raw.estimated_investment.monthly_growth_retainer ? ' + ' + raw.estimated_investment.monthly_growth_retainer + '/mo' : ''}`
                : 'Contact for quote',
        wireframe_url: raw.wireframe_url,
        tech_stack: raw.tech_stack,
    };
}

export async function POST(request: Request) {
    console.log('=== API Route /api/generate-strategy called ===');
    try {
        const body = await request.json();
        console.log('✓ Request body parsed:', JSON.stringify(body, null, 2));

        let verbaflowServices;
        try {
            verbaflowServices = await getServices();
            console.log(`✓ Fetched ${verbaflowServices?.length || 0} services from Supabase`);
        } catch (dbError) {
            console.error('✗ Error fetching services from Supabase:', dbError);
            verbaflowServices = null;
        }

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

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        console.log('→ Checking Gemini API Key... Present:', !!apiKey);

        if (!apiKey) {
            console.error('✗ Missing GEMINI_API_KEY - Using MOCK response for testing');
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

        console.log('→ Initializing Gemini AI client...');
        const genAI = new GoogleGenerativeAI(apiKey);

        const serviceKnowledgeBase = verbaflowServices;
        const { industry, stage, challenges, goals, teamSize, budget, timeline, name, email, subNiches } = body;

        const systemInstruction = `
You are an expert business growth strategist at Verbaflow, a digital agency.
Your goal is to create a tactical, actionable growth plan based on the user's inputs.

Use the following knowledge base of Verbaflow's services to recommend the most relevant solutions:
${JSON.stringify(serviceKnowledgeBase, null, 2)}

Guidelines:
- Be specific and prescriptive. Avoid generic advice.
- The "Executive Summary" should be a high-level strategic overview.
- The "Action Plan" should be broken down into 3 distinct phases (e.g., "Immediate Wins", "Strategic Growth", "Scaling & Automation").
- "Recommended Services" MUST be selected ONLY from the provided knowledge base.
- "Estimated Investment" should be a realistic project investment range based on the services and the user's stated budget.
- Tone: Professional, encouraging, and authoritative.
`;

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
        const modelPriority = [
            "gemini-3-flash-preview",
            "gemini-3.1-flash-lite",
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite",
            "gemma-4-31b-it",
            "gemma-4-26b-a4b-it",
        ];

        let plan;
        let lastError: any = null;

        for (const modelName of modelPriority) {
            try {
                console.log(`→ Trying model: ${modelName}...`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction,
                    generationConfig: {
                        temperature: 0.2,
                        responseMimeType: "application/json",
                    },
                });

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();
                console.log(`✓ ${modelName} response received, length:`, text.length);
                
                // Strip markdown code fences if present
                text = text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```$/m, '').trim();
                
                plan = JSON.parse(text);
                console.log(`✓ Plan generated by ${modelName}`);
                break;
            } catch (err: any) {
                console.error(`✗ ${modelName} failed:`, err?.message || err);
                lastError = err;
            }
        }

        if (!plan) {
            console.error('✗ All Gemini models failed. Falling back to MOCK plan for testing...');
            console.error('Last error:', lastError?.message || lastError);
            plan = {
                executive_summary: `Growth plan for ${name}'s ${industry} business focusing on ${subNiches?.join(', ') || 'core services'}. The strategy addresses ${challenges.join(', ')} through targeted automation and digital infrastructure.`,
                phases: [
                    {
                        title: "Phase 1: Immediate Wins",
                        duration: "Days 1-30",
                        actions: [
                            `Audit current ${industry} workflows and identify automation opportunities`,
                            `Set up lead capture system for ${challenges[0] || 'primary challenge'}`,
                            `Deploy analytics dashboard to track baseline metrics`,
                            `Train team on new tools and processes`
                        ]
                    },
                    {
                        title: "Phase 2: Strategic Growth",
                        duration: "Days 31-90",
                        actions: [
                            `Launch targeted marketing campaigns for ${subNiches?.[0] || 'core audience'}`,
                            `Implement CRM integration and pipeline automation`,
                            `Build custom reporting for stakeholder reviews`,
                            `Optimize conversion funnels based on initial data`
                        ]
                    },
                    {
                        title: "Phase 3: Scale & Automate",
                        duration: "Days 91-180",
                        actions: [
                            `Deploy AI-powered customer engagement tools`,
                            `Expand service offerings based on demand signals`,
                            `Automate routine operational tasks`,
                            `Establish quarterly growth review cadence`
                        ]
                    }
                ],
                recommended_services: verbaflowServices.slice(0, 3).map((s: any) => s.name),
                estimated_investment: budget === 'low' ? '$1,000 - $2,995' : budget === 'medium' ? '$3,000 - $7,995' : '$8,000 - $14,995',
                wireframe_url: undefined,
                tech_stack: [
                    { layer: "Frontend", tools: ["Next.js 15", "Tailwind v4", "Framer Motion"] },
                    { layer: "Backend", tools: ["FastAPI", "PostgreSQL", "Redis"] },
                    { layer: "AI / Agents", tools: ["DeepSeek V3", "OpenClaw", "Gemini 3.1"] },
                    { layer: "Integrations", tools: ["Resend", "Stripe", "Calendly"] }
                ]
            };
        }

        // Normalize Gemini 3.x response shape to match frontend expectations
        const normalizedPlan = normalizePlan(plan);
        console.log('→ Normalized plan keys:', Object.keys(normalizedPlan));
        console.log('→ Raw plan keys:', Object.keys(plan));
        console.log('→ Raw phases?', Array.isArray(plan.phases));
        console.log('→ Raw action_plan keys:', plan.action_plan ? Object.keys(plan.action_plan) : 'none');
        console.log('→ Raw recommended_services type:', typeof plan.recommended_services, Array.isArray(plan.recommended_services) ? 'array' : 'not-array');

        // --- Save GrowthPlan + trigger Hermes pipeline ---
        try {
            const { prisma } = await import('../../../lib/prisma');
            const growthPlan = await prisma.growthPlan.create({
                data: {
                    email: email || body.email || 'unknown',
                    status: 'queued',
                    wizardData: {
                        name, email, industry, stage, challenges, goals,
                        teamSize, budget, timeline,
                        subNiches: subNiches || [],
                        currentStack: body.currentStack || [],
                        legacyPain: body.legacyPain || null,
                        gbpPlaceId: body.gbpPlaceId || null,
                        gbpName: body.gbpName || null,
                        gbpAddress: body.gbpAddress || null,
                        gbpCategories: body.gbpCategories || [],
                        gbpData: body.gbpData || null,
                    },
                    gbpPlaceId: body.gbpPlaceId || null,
                    gbpName: body.gbpName || null,
                    gbpAddress: body.gbpAddress || null,
                    gbpCategories: body.gbpCategories || [],
                    gbpData: body.gbpData ? (typeof body.gbpData === 'string' ? body.gbpData : JSON.stringify(body.gbpData)) : null,
                },
            });
            console.log('✓ GrowthPlan created:', growthPlan.id);

            // Trigger Hermes webhook for pipeline
            const webhookUrl = process.env.HERMES_WEBHOOK_URL;
            const hermesToken = process.env.VFLOW_HERMES_TOKEN;
            if (webhookUrl && hermesToken) {
                try {
                    const payload = JSON.stringify({
                        plan_id: growthPlan.id,
                        pipeline: 'cybergrowth-wireframe',
                        input: {
                            name, email, industry, stage, challenges, goals,
                            teamSize, budget, timeline, subNiches,
                            gbp_data: body.gbpData || null,
                        },
                    });
                    const encoder = new TextEncoder();
                    const keyData = encoder.encode(hermesToken);
                    const payloadData = encoder.encode(payload);
                    const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
                    const sigBuf = await crypto.subtle.sign('HMAC', cryptoKey, payloadData);
                    const signature = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
                    await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': signature },
                        body: payload,
                    });
                    console.log('✓ Hermes webhook triggered for plan:', growthPlan.id);
                } catch (webhookErr) {
                    console.error('[HERMES_WEBHOOK] Failed:', webhookErr);
                }
            } else {
                console.log('⚠ HERMES_WEBHOOK_URL or VFLOW_HERMES_TOKEN not set — skipping pipeline trigger');
            }
        } catch (dbErr: any) {
            console.error('✗ Error creating GrowthPlan:', dbErr?.message || dbErr);
        }

        // --- Save to Supabase (Leads) ---
        try {
            const { supabase } = await import('../../../lib/supabase');
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
                growth_plan_data: plan,
                created_at: new Date().toISOString()
            });

            if (dbError) {
                console.error('Supabase DB Error:', dbError);
            } else {
                console.log('Lead saved to Supabase successfully');
            }
        } catch (dbErr) {
            console.error('Error saving to Supabase:', dbErr);
        }

        // --- Email Sending Logic (Resend) ---
        const resendApiKey = process.env.RESEND_API_KEY;
        console.log('→ Checking Resend API Key... Present:', !!resendApiKey, 'Email:', email);

        if (resendApiKey && email) {
            try {
                const resend = new Resend(resendApiKey);
                console.log(`→ Attempting to send email to ${email}...`);

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
                        ${normalizedPlan.phases.map((phase: { title: string; duration: string; actions: string[] }) => `
                            <div style="margin-bottom: 20px;">
                                <h3 style="color: #333;">${phase.title} (${phase.duration})</h3>
                                <ul>
                                    ${phase.actions.map((action: string) => `<li>${action}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}

                        <div style="margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 20px;">
                            <h3>Recommended Services</h3>
                            <p>${normalizedPlan.recommended_services.join(', ')}</p>
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

        return NextResponse.json({ plan: normalizedPlan });
    } catch (error) {
        console.error('✗✗✗ FATAL ERROR in generate-strategy:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return NextResponse.json(
            { error: 'Failed to generate strategy' },
            { status: 500 }
        );
    }
}
