import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { industry, subNiches, businessName, executiveSummary, phases, services } = body;

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-3-flash-preview',
            systemInstruction: 'You are a web design expert. Generate wireframe HTML for business websites. Always respond with valid JSON.',
        });

        const prompt = `Generate a professional wireframe HTML page for a ${industry} business called "${businessName}"${subNiches?.length ? ` specializing in ${subNiches.join(', ')}` : ''}.

Business context:
- Executive Summary: ${executiveSummary || 'N/A'}
- Growth phases: ${phases?.map((p: any) => p.title).join(', ') || 'N/A'}
- Services: ${services?.join(', ') || 'N/A'}

Create a single-page HTML wireframe with:
1. Navigation bar with logo and menu items
2. Hero section with headline, subheadline, and CTA button
3. Services section with 3-4 service cards
4. About/Why Us section
5. Testimonials section with 2-3 reviews
6. Contact/CTA section
7. Footer

Use inline CSS with a modern, clean design. Use placeholder images from https://placehold.co/800x400/1a1a2e/eee?text=Hero+Image style URLs.
Use colors: primary #0ea5e9 (sky blue), secondary #1e293b (dark slate), accent #f59e0b (amber), background #f8fafc, text #1e293b.

Respond with JSON: { "html": "<html string>", "wireframe_url": "data:text/html;base64,..." }
The html field should contain the complete HTML document.`;

        const modelPriority = [
            'gemini-3-flash-preview',
            'gemini-3.1-flash-lite',
            'gemini-2.5-flash',
        ];

        let result;
        for (const modelName of modelPriority) {
            try {
                const m = genAI.getGenerativeModel({ model: modelName });
                const r = await m.generateContent(prompt);
                const text = r.response.text();
                result = JSON.parse(text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```$/m, '').trim());
                break;
            } catch {
                continue;
            }
        }

        if (!result || !result.html) {
            return NextResponse.json({ error: 'Failed to generate wireframe' }, { status: 500 });
        }

        // Create a data URL for the HTML wireframe
        const base64Html = Buffer.from(result.html).toString('base64');
        const wireframeUrl = `data:text/html;base64,${base64Html}`;

        // Push to Stitch if configured
        let stitchScreenId = null;
        const stitchApiKey = process.env.STITCH_API_KEY;
        const stitchProjectId = process.env.STITCH_PROJECT_ID;
        if (stitchApiKey && stitchProjectId) {
            try {
                const stitchRes = await fetch(
                    `https://stitch.googleapis.com/v1/projects/${stitchProjectId}/screens`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${stitchApiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: `${businessName} - ${industry} Wireframe`,
                            htmlCode: { content: result.html },
                        }),
                    }
                );
                if (stitchRes.ok) {
                    const stitchData = await stitchRes.json();
                    stitchScreenId = stitchData.id;
                    console.log('✓ Wireframe pushed to Stitch:', stitchScreenId);
                } else {
                    console.log('⚠ Stitch push failed:', stitchRes.status);
                }
            } catch (e) {
                console.log('⚠ Stitch push error:', e);
            }
        }

        return NextResponse.json({
            wireframe_url: wireframeUrl,
            html: result.html,
            stitch_screen_id: stitchScreenId,
        });
    } catch (error: any) {
        console.error('Wireframe generation error:', error);
        return NextResponse.json({ error: error?.message || 'Wireframe generation failed' }, { status: 500 });
    }
}