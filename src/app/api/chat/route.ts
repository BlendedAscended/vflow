import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verbaflowServices, industryContext } from '../../../lib/knowledge-base';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../../../sanity/env';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { messages, sessionId } = body;

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        // --- Fetch System Context from Sanity ---
        let systemContext = "";
        try {
            const client = createClient({
                projectId,
                dataset,
                apiVersion,
                useCdn: false, // Always fetch fresh data
            });

            const contextDoc = await client.fetch(`*[_type == "systemContext" && active == true][0]`);
            if (contextDoc && contextDoc.context) {
                systemContext = contextDoc.context;
            }
        } catch (error) {
            console.error('Error fetching system context:', error);
        }
        // ----------------------------------------

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `
                You are an expert business consultant and AI assistant for Verbaflow, a premium digital agency.
                
                Your goal is to assist users by answering questions about Verbaflow's services and providing strategic advice based on their industry.

                Here is Verbaflow's Service Knowledge Base:
                ${JSON.stringify(verbaflowServices, null, 2)}

                Here is the Industry Context Guide:
                ${JSON.stringify(industryContext, null, 2)}

                Additional System Instructions (LEARNED CONTEXT):
                ${systemContext}

                Guidelines:
                - Be professional, concise, and helpful.
                - Use the knowledge base to recommend specific Verbaflow services when relevant.
                - If the user mentions their industry, use the Industry Context Guide to tailor your advice.
                - Do not make up services that are not in the knowledge base.
                - If you don't know the answer, politely offer to connect them with a human expert via the contact form.
                - Keep responses short and conversational (under 3-4 sentences unless a detailed explanation is requested).

                CRITICAL INSTRUCTION FOR TRADE SERVICES:
                - We have a vetted network of 500+ specialized trade businesses in Virginia, DC, and Maryland.
                - If a user asks for ANY trade or home service (e.g., Bathroom, Kitchen, HVAC, Plumbing, Roofing, Renovation, etc.), ALWAYS say YES, we can facilitate this through our network.
                - Quote "Market Price" for these services.
                - Never say we don't do it if it falls under trade/home services.
            `
        });

        const chat = model.startChat({
            history: messages.slice(0, -1).map((m: { role: string; content: string }) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }],
            })),
        });

        const lastMessage = messages[messages.length - 1];
        const result = await chat.sendMessage(lastMessage.content);
        const response = await result.response;
        const text = response.text();

        // --- Save Chat Log to Sanity ---
        if (sessionId) {
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

                    // Check if a log exists for this session
                    const existingLog = await client.fetch(`*[_type == "chatLog" && sessionId == $sessionId][0]`, { sessionId });

                    const newMessages = [
                        {
                            role: 'user',
                            content: lastMessage.content,
                            timestamp: new Date().toISOString()
                        },
                        {
                            role: 'model',
                            content: text,
                            timestamp: new Date().toISOString()
                        }
                    ];

                    if (existingLog) {
                        await client
                            .patch(existingLog._id)
                            .setIfMissing({ messages: [] })
                            .append('messages', newMessages)
                            .commit();
                    } else {
                        await client.create({
                            _type: 'chatLog',
                            sessionId,
                            messages: newMessages,
                            createdAt: new Date().toISOString(),
                        });
                    }
                }
            } catch (error) {
                console.error('Error saving chat log:', error);
            }
        }
        // -------------------------------

        return NextResponse.json({ response: text });

    } catch (error) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            { error: 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
