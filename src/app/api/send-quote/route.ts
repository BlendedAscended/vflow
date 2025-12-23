import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, quoteDetails, totalEstimate } = body;

        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            console.error('RESEND_API_KEY is missing');
            return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
        }

        const resend = new Resend(resendApiKey);

        const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1>Your Instant Quote from Verbaflow</h1>
                <p>Hi ${name || 'there'},</p>
                <p>Based on your selected needs, here is your estimated quote:</p>
                
                <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #2563eb; margin-top: 0;">Estimated Total: ${totalEstimate}</h2>
                    <p style="font-size: 14px; color: #666;">*This is a preliminary estimate based on standard pricing.</p>
                </div>

                <h3>Selected Services:</h3>
                <ul>
                    ${quoteDetails.map((item: string) => `<li>${item}</li>`).join('')}
                </ul>

                <p>We specialize in serving clients within 50 miles of your location, ensuring personalized, local support.</p>

                <div style="margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 20px;">
                    <p>Ready to get started? <a href="https://verbaflow.com/growth-plan">Get your full Growth Strategy</a></p>
                </div>
            </div>
        `;

        const { data, error } = await resend.emails.send({
            from: 'Verbaflow Quote <noreply@mail.verbaflowllc.com>',
            to: [email],
            subject: 'Your Verbaflow Instant Quote',
            html: emailHtml,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('Error sending quote email:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
