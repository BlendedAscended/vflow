import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

interface WireframeReadyEmailParams {
  to: string;
  name: string;
  planId: string;
  wireframeUrl: string;
  industry?: string;
}

export async function sendWireframeReadyEmail({
  to,
  name,
  planId,
  wireframeUrl,
  industry,
}: WireframeReadyEmailParams) {
  const previewUrl = `${appUrl}/plan/${planId}/preview`;
  const trackingUrl = `${appUrl}/plan/${planId}`;

  const result = await resend.emails.send({
    from: 'VerbaFlow <hello@verbaflow.com>',
    to,
    subject: `Your custom Growth Plan wireframe is ready${industry ? ` — ${industry}` : ''}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; color: #1a1a2e; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #4CAF50, #2E7D32); padding: 32px 24px; text-align: center; }
          .header h1 { color: #fff; margin: 0; font-size: 24px; }
          .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
          .body { padding: 32px 24px; }
          .body p { margin: 0 0 16px; line-height: 1.6; font-size: 15px; }
          .preview-box { background: #f0f7f0; border: 1px solid #c8e6c9; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; }
          .preview-box img { max-width: 100%; border-radius: 6px; margin-bottom: 12px; }
          .btn { display: inline-block; padding: 14px 28px; background: #4CAF50; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 8px 4px; }
          .btn-secondary { background: transparent; color: #4CAF50; border: 2px solid #4CAF50; }
          .cta-section { text-align: center; margin: 32px 0; padding: 24px; background: #fafafa; border-radius: 8px; }
          .cta-section h3 { margin: 0 0 12px; font-size: 18px; }
          .cta-section p { margin: 0 0 16px; color: #666; font-size: 14px; }
          .footer { padding: 20px 24px; text-align: center; background: #fafafa; border-top: 1px solid #eee; }
          .footer p { margin: 0; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Growth Plan is Ready</h1>
            <p>Built by autonomous AI architects, tailored for ${industry || 'your business'}</p>
          </div>
          <div class="body">
            <p>Hi ${name || 'there'},</p>
            <p>
              Your custom wireframe and tech stack are complete. Our AI agents have analyzed your
              requirements and produced a working wireframe you can interact with right now.
            </p>

            <div class="preview-box">
              <p style="font-weight: 600; margin-bottom: 12px;">Preview your wireframe</p>
              <a href="${previewUrl}" class="btn">View Wireframe</a>
              <a href="${trackingUrl}" class="btn btn-secondary">Track Pipeline</a>
            </div>

            <div class="cta-section">
              <h3>Ready to move forward?</h3>
              <p>
                For just $19, unlock the full wireframe source code, deployment guide, and a
                personalized tech stack recommendation — or book a call with our team directly.
              </p>
              <a href="${appUrl}/plan/${planId}" class="btn">Move Forward — $19</a>
              <a href="https://calendly.com/verbaflow" class="btn btn-secondary">Book a Call</a>
            </div>

            <p style="color: #888; font-size: 13px;">
              Plan ID: ${planId}<br />
              If you have any questions, reply to this email or reach us on Telegram.
            </p>
          </div>
          <div class="footer">
            <p>VerbaFlow LLC — AI-powered growth infrastructure</p>
            <p style="margin-top: 4px;">You received this because you submitted a Growth Plan request.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  return result;
}
