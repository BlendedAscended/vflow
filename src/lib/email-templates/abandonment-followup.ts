export interface AbandonmentVars {
  name: string;
  industry: string;
  stepReached: number;
  resumeUrl: string;
}

export function abandonmentFollowupEmail(vars: AbandonmentVars) {
  const { name, industry, stepReached, resumeUrl } = vars;
  return {
    subject: `${name}, your ${industry} growth plan is still waiting`,
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Inter',system-ui,sans-serif;background:#f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="padding:32px 24px;background:#0F1923;text-align:center;">
        <h1 style="color:#ffffff;font-size:22px;margin:0;">Pick Up Where You Left Off</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;background:#ffffff;">
        <p style="font-size:16px;color:#333;">Hi ${name},</p>
        <p style="font-size:16px;color:#333;">You started a growth plan for your ${industry} business but stopped at step ${stepReached} of 8. No problem — your answers are saved.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="background:#A5D6A7;border-radius:8px;margin:24px auto;">
          <tr>
            <td style="padding:14px 28px;text-align:center;">
              <a href="${resumeUrl}" style="color:#0F1923;font-size:15px;font-weight:600;text-decoration:none;">Resume My Plan</a>
            </td>
          </tr>
        </table>
        <p style="font-size:14px;color:#666;">Questions? Reply to this email or book a call at <a href="https://calendly.com/verbaflow" style="color:#0F1923;text-decoration:underline;">calendly.com/verbaflow</a>.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;text-align:center;font-size:13px;color:#999;border-top:1px solid #e0e0e0;">
        <p>VerbaFlow LLC</p>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}
