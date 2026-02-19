export interface AssessmentFormData {
  // Step 1: About Your Business
  business_name: string
  contact_name: string
  email: string
  phone: string
  industry: string
  team_size: string

  // Step 2: Current Challenges
  pain_points: string[]
  current_tools: string[]
  time_drains: string

  // Step 3: Goals & Budget
  desired_outcomes: string
  revenue_range: string
  budget_range: string
  timeline: string
  additional_notes: string
}

export const PAIN_POINTS = [
  'Manual data entry across multiple systems',
  'Slow invoice or quote processing',
  'Poor visibility into sales pipeline',
  'Disconnected customer communication',
  'Repetitive reporting and admin tasks',
  'Delayed order fulfillment',
  'Inconsistent lead follow-up',
  'Time-consuming HR and onboarding processes',
] as const

export const TOOL_OPTIONS = [
  'Salesforce',
  'HubSpot',
  'Zoho CRM',
  'Xero',
  'QuickBooks',
  'Shopify',
  'WooCommerce',
  'WhatsApp',
  'Gmail / Google Workspace',
  'Microsoft 365',
  'Slack',
  'Trello / Asana / Monday',
  'Custom ERP',
  'Other',
] as const

export const TEAM_SIZES = ['1–5', '6–20', '21–50', '51–100', '100+'] as const

export const REVENUE_RANGES = [
  'Under R1M/year',
  'R1M – R5M/year',
  'R5M – R20M/year',
  'R20M – R50M/year',
  'Over R50M/year',
] as const

export const BUDGET_RANGES = [
  'Under R3,000/month',
  'R3,000 – R8,000/month',
  'R8,000 – R20,000/month',
  'Over R20,000/month',
  'Not sure yet',
] as const

export const TIMELINES = [
  'ASAP – we have an urgent problem',
  'Within 1–3 months',
  'Within 3–6 months',
  'Just exploring options',
] as const

export const INDUSTRIES = [
  'Retail / E-commerce',
  'Professional Services',
  'Financial Services',
  'Healthcare',
  'Logistics / Supply Chain',
  'Manufacturing',
  'Real Estate',
  'Marketing / Agency',
  'Technology',
  'Other',
] as const
