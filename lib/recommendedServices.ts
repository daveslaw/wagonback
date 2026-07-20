import { AssessmentFormData, PAIN_POINTS, TOOL_OPTIONS } from '@/types/assessment'
import { getIntegrationOpportunities } from '@/lib/integrationOpportunities'

type PainPoint = (typeof PAIN_POINTS)[number]
type ToolOption = (typeof TOOL_OPTIONS)[number]

export type ServiceName =
  | 'Process Redesign & Optimisation'
  | '"Quick-Win" Automations'
  | 'AI Knowledge Systems'
  | 'Custom Workflows & AI Skills'
  | 'Full Ecosystem Sync'

export interface ServiceDefinition {
  name: ServiceName
  description: string
  roiRange: { low: number; high: number }
  // Pain points that both make this service a candidate and scale its ROI range.
  // Empty for services whose candidacy comes from budget/team size/tool count instead.
  triggerPainPoints: readonly PainPoint[]
}

export interface RecommendedService {
  name: ServiceName
  description: string
  roiRange: { low: number; high: number }
  matchedPainPoints: string[]
  toolPairOpportunities: { title: string; description: string }[]
  isPrimary: boolean
}

const INTEGRATION_TOOLS: readonly ToolOption[] = [
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
]

const KNOWLEDGE_HEAVY_INDUSTRIES = ['Professional Services', 'Financial Services', 'Healthcare']

export const SERVICES: ServiceDefinition[] = [
  {
    name: 'Process Redesign & Optimisation',
    description:
      'We map your workflows and strip out the admin fat before writing any code — so automation actually holds.',
    roiRange: { low: 2, high: 6 },
    triggerPainPoints: [
      'Repetitive reporting and admin tasks',
      'Time-consuming HR and onboarding processes',
    ],
  },
  {
    name: '"Quick-Win" Automations',
    description:
      'We connect Xero, Shopify, WhatsApp and more — killing repetitive copy-paste and data entry for good.',
    roiRange: { low: 5, high: 10 },
    triggerPainPoints: [
      'Manual data entry across multiple systems',
      'Slow invoice or quote processing',
      'Delayed order fulfillment',
    ],
  },
  {
    name: 'AI Knowledge Systems',
    description:
      'Custom AI trained on your internal databases, SOPs, or catalogues — instant answers, 24/7.',
    roiRange: { low: 3, high: 8 },
    triggerPainPoints: [
      'Disconnected customer communication',
      'Repeatedly answering the same customer or staff questions',
    ],
  },
  {
    name: 'Custom Workflows & AI Skills',
    description:
      'Intelligent pipelines for judgment-heavy work — lead qualification, proposals, multi-step data tasks.',
    roiRange: { low: 4, high: 10 },
    triggerPainPoints: ['Poor visibility into sales pipeline', 'Inconsistent lead follow-up'],
  },
  {
    name: 'Full Ecosystem Sync',
    description: 'Enterprise-grade integration across Salesforce, Zoho, Xero, Shopify, and more.',
    roiRange: { low: 8, high: 20 },
    triggerPainPoints: [],
  },
]

// Which recommended service each of the existing tool-pair rules is concrete evidence for.
const TOOL_PAIR_SERVICE: Record<string, ServiceName> = {
  'Shopify → Accounting Auto-Sync': '"Quick-Win" Automations',
  'E-commerce → CRM Lead Sync': 'Custom Workflows & AI Skills',
  'WhatsApp → CRM Integration': 'Custom Workflows & AI Skills',
  'Email-Triggered Workflows': '"Quick-Win" Automations',
  'Team Notification Hub': 'Full Ecosystem Sync',
}

function isCandidate(service: ServiceDefinition, data: AssessmentFormData): boolean {
  const painPoints = data.pain_points ?? []
  const tools = data.current_tools ?? []
  const hasTrigger = service.triggerPainPoints.some((p) => painPoints.includes(p))

  switch (service.name) {
    case 'Process Redesign & Optimisation':
      return hasTrigger || tools.length <= 1
    case '"Quick-Win" Automations':
      return hasTrigger && tools.some((t) => (INTEGRATION_TOOLS as readonly string[]).includes(t))
    case 'AI Knowledge Systems':
      return hasTrigger || KNOWLEDGE_HEAVY_INDUSTRIES.includes(data.industry)
    case 'Custom Workflows & AI Skills':
      return hasTrigger
    case 'Full Ecosystem Sync':
      return (
        data.budget_range === 'Over R20,000/month' ||
        ['51–100', '100+'].includes(data.team_size) ||
        tools.length >= 4
      )
  }
}

function computeROIRange(
  service: ServiceDefinition,
  matchedPainPoints: string[]
): { low: number; high: number } {
  const { low, high } = service.roiRange
  const span = high - low
  // A service can become a candidate via a non-pain-point signal (industry, tool count,
  // budget, team size) with zero matched pain points — that case should center on the
  // midpoint just like Full Ecosystem Sync, not collapse to the low end.
  const ratio =
    matchedPainPoints.length === 0
      ? 0.5
      : matchedPainPoints.length / service.triggerPainPoints.length

  const windowLow = low + ratio * span * 0.5
  const windowHigh = low + (ratio * 0.5 + 0.5) * span

  return { low: Math.round(windowLow), high: Math.round(windowHigh) }
}

export function getRecommendedServices(data: AssessmentFormData): RecommendedService[] {
  const painPoints = data.pain_points ?? []
  const allToolPairOpportunities = getIntegrationOpportunities(data).filter(
    (o) => o.title in TOOL_PAIR_SERVICE
  )

  let candidates = SERVICES.filter((service) => isCandidate(service, data))

  if (candidates.length === 0) {
    candidates = [SERVICES.find((s) => s.name === 'Process Redesign & Optimisation')!]
  }

  const recommended: Omit<RecommendedService, 'isPrimary'>[] = candidates.map((service) => {
    const matchedPainPoints = service.triggerPainPoints.filter((p) => painPoints.includes(p))
    return {
      name: service.name,
      description: service.description,
      roiRange: computeROIRange(service, matchedPainPoints),
      matchedPainPoints,
      toolPairOpportunities: allToolPairOpportunities.filter(
        (o) => TOOL_PAIR_SERVICE[o.title] === service.name
      ),
    }
  })

  const primaryIndex = recommended.reduce((bestIndex, current, index) => {
    const currentAvg = (current.roiRange.low + current.roiRange.high) / 2
    const bestAvg = (recommended[bestIndex].roiRange.low + recommended[bestIndex].roiRange.high) / 2
    return currentAvg > bestAvg ? index : bestIndex
  }, 0)

  return recommended.map((service, index) => ({ ...service, isPrimary: index === primaryIndex }))
}

export function getHeadlineTotal(services: RecommendedService[]): { low: number; high: number } {
  return services.reduce(
    (total, service) => ({
      low: total.low + service.roiRange.low,
      high: total.high + service.roiRange.high,
    }),
    { low: 0, high: 0 }
  )
}
