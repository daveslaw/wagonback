import { renderToBuffer } from '@react-pdf/renderer'
import { generateProposalDocument } from '@/lib/generateProposal'
import { AssessmentFormData } from '@/types/assessment'

const SAMPLE: AssessmentFormData = {
  business_name: 'Cape Town Roastery (Pty) Ltd',
  contact_name: 'Sarah Botha',
  email: 'sarah@ctroastery.co.za',
  phone: '+27 82 555 0123',
  industry: 'Retail / E-commerce',
  team_size: '6–20',
  pain_points: [
    'Manual data entry across multiple systems',
    'Slow invoice or quote processing',
    'Inconsistent lead follow-up',
  ],
  current_tools: ['Shopify', 'Xero', 'WhatsApp', 'Gmail / Google Workspace'],
  time_drains:
    'Every day we manually copy Shopify orders into Xero for invoicing. We also follow up with wholesale leads manually via WhatsApp and often forget or duplicate messages. Reconciling payments at month-end takes about 2 days.',
  desired_outcomes:
    'Shopify orders should flow into Xero automatically. Wholesale lead follow-ups should happen without manual intervention. Month-end reconciliation should be automated.',
  revenue_range: 'R5M – R20M/year',
  budget_range: 'R3,000 – R8,000/month',
  timeline: 'Within 1–3 months',
  additional_notes: '',
}

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = generateProposalDocument(SAMPLE)
  const buffer = await renderToBuffer(doc)

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="proposal-preview.pdf"',
    },
  })
}
