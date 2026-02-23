import { Resend } from 'resend'
import { AssessmentFormData } from '@/types/assessment'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!)
}

export async function sendProposalEmail(data: AssessmentFormData, pdfBuffer: Buffer) {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '#'

  const resend = getResend()
  await resend.emails.send({
    from: 'Wagon Back Solutions <hello@wagonback.com>',
    to: data.email,
    subject: `Your Automation Proposal — ${data.business_name}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Automation Proposal</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;">
              <span style="font-size:11px;letter-spacing:3px;color:#f5f5f5;text-transform:uppercase;">Wagon Back</span>
              <span style="color:#00c8ff;font-size:11px;padding:0 6px;">·</span>
              <span style="font-size:11px;letter-spacing:3px;color:#00c8ff;text-transform:uppercase;">Solutions</span>
            </td>
          </tr>
          <!-- Accent line -->
          <tr><td style="height:1px;background-color:#00c8ff;width:32px;display:block;margin-bottom:24px;">&nbsp;</td></tr>
          <!-- Title -->
          <tr>
            <td style="padding-bottom:16px;">
              <h1 style="margin:0;font-size:28px;font-weight:300;color:#f5f5f5;letter-spacing:2px;text-transform:uppercase;line-height:1.3;">
                Your Automation<br/>Proposal Is Ready
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0 0 12px;font-size:14px;color:#888;line-height:1.7;">
                Hi ${data.contact_name},
              </p>
              <p style="margin:0 0 12px;font-size:14px;color:#888;line-height:1.7;">
                Thank you for completing your assessment. We've reviewed your responses and prepared a custom automation proposal for <strong style="color:#f5f5f5;">${data.business_name}</strong> — it's attached to this email as a PDF.
              </p>
              <p style="margin:0;font-size:14px;color:#888;line-height:1.7;">
                The proposal outlines the integration opportunities we've identified, our recommended automation platform, and estimated ROI for your team.
              </p>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding-bottom:32px;">
              <a href="${calendlyUrl}"
                 style="display:inline-block;background-color:#00c8ff;color:#0d0d0d;text-decoration:none;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;border-radius:100px;">
                Book Your Discovery Call →
              </a>
            </td>
          </tr>
          <!-- Divider -->
          <tr><td style="height:1px;background-color:#222;margin-bottom:24px;">&nbsp;</td></tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">
                Wagon Back Solutions · Johannesburg, South Africa<br/>
                <a href="mailto:hello@wagonback.com" style="color:#444;text-decoration:none;">hello@wagonback.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
    attachments: [
      {
        filename: `WagonBack-Proposal-${data.business_name.replace(/\s+/g, '-')}.pdf`,
        content: pdfBuffer,
      },
    ],
  })
}

export async function sendInternalNotification(data: AssessmentFormData, id: string) {
  const internalEmail = process.env.INTERNAL_NOTIFICATION_EMAIL
  if (!internalEmail) return

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wagonback.com'
  const token = process.env.ADMIN_TOKEN || ''
  const generateUrl = `${baseUrl}/api/generate-proposal?id=${id}&token=${encodeURIComponent(token)}`

  const resend = getResend()
  await resend.emails.send({
    from: 'Wagon Back Solutions <hello@wagonback.com>',
    to: internalEmail,
    subject: `New Assessment: ${data.business_name} — ${data.timeline}`,
    html: `
      <p><strong>New assessment submitted:</strong></p>
      <p>
        <a href="${generateUrl}"
           style="display:inline-block;background-color:#00c8ff;color:#0d0d0d;text-decoration:none;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:12px 24px;border-radius:100px;">
          Generate &amp; Send Proposal →
        </a>
      </p>
      <ul>
        <li><strong>Business:</strong> ${data.business_name}</li>
        <li><strong>Contact:</strong> ${data.contact_name} (${data.email}, ${data.phone || 'no phone'})</li>
        <li><strong>Industry:</strong> ${data.industry}</li>
        <li><strong>Team Size:</strong> ${data.team_size}</li>
        <li><strong>Revenue:</strong> ${data.revenue_range}</li>
        <li><strong>Budget:</strong> ${data.budget_range}</li>
        <li><strong>Timeline:</strong> ${data.timeline}</li>
        <li><strong>Pain Points:</strong> ${(data.pain_points ?? []).join(', ')}</li>
        <li><strong>Tools:</strong> ${(data.current_tools ?? []).join(', ')}</li>
      </ul>
      <p><strong>Desired Outcomes:</strong><br/>${data.desired_outcomes}</p>
      ${data.time_drains ? `<p><strong>Time Drains:</strong><br/>${data.time_drains}</p>` : ''}
      ${data.additional_notes ? `<p><strong>Notes:</strong><br/>${data.additional_notes}</p>` : ''}
    `,
  })
}
