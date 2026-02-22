import { AssessmentFormData } from '@/types/assessment'

export function getIntegrationOpportunities(data: AssessmentFormData) {
  const tools = data.current_tools ?? []
  const opps = []

  if (tools.includes('Shopify') && (tools.includes('Xero') || tools.includes('QuickBooks'))) {
    opps.push({
      title: 'Shopify → Accounting Auto-Sync',
      description:
        'Automatically create invoices and reconcile payments in your accounting platform every time an order is placed or fulfilled on Shopify. Eliminates manual data entry entirely.',
    })
  }
  if (
    tools.includes('Shopify') &&
    (tools.includes('Salesforce') || tools.includes('HubSpot') || tools.includes('Zoho CRM'))
  ) {
    opps.push({
      title: 'E-commerce → CRM Lead Sync',
      description:
        'Push every new Shopify customer into your CRM automatically, trigger follow-up sequences, and track lifetime value without any manual work.',
    })
  }
  if (
    tools.includes('WhatsApp') &&
    (tools.includes('Salesforce') || tools.includes('HubSpot') || tools.includes('Zoho CRM'))
  ) {
    opps.push({
      title: 'WhatsApp → CRM Integration',
      description:
        'Log WhatsApp conversations, create contacts, and trigger follow-up tasks in your CRM automatically — making every customer interaction traceable.',
    })
  }
  if (tools.includes('Gmail / Google Workspace') || tools.includes('Microsoft 365')) {
    opps.push({
      title: 'Email-Triggered Workflows',
      description:
        'Turn incoming emails into automated actions: create tasks, update CRM records, send notifications to Slack, or trigger approval workflows — without lifting a finger.',
    })
  }
  if (tools.includes('Slack')) {
    opps.push({
      title: 'Team Notification Hub',
      description:
        'Route critical business events (new leads, payment received, support tickets) directly to the right Slack channels — so your team stays informed in real time.',
    })
  }

  if (opps.length === 0) {
    opps.push({
      title: 'Custom Integration Assessment',
      description:
        'Based on your current tool stack, we will map out the highest-value integration points during our discovery call and present a custom workflow design.',
    })
  }

  return opps
}
