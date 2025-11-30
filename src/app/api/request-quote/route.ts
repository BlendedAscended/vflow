import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Log the data for now. This is where we would trigger the Make.com webhook.
        console.log('Quote Request Received:', data);

        // Placeholder for Make.com webhook integration
        // const webhookUrl = process.env.MAKE_WEBHOOK_URL;
        // if (webhookUrl) {
        //   await fetch(webhookUrl, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data),
        //   });
        // }

        return NextResponse.json({ success: true, message: 'Quote request received' });
    } catch (error) {
        console.error('Error processing quote request:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to process request' },
            { status: 500 }
        );
    }
}
