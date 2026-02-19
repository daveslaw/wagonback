import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import { AssessmentFormData } from '@/types/assessment'

// Use built-in Helvetica — no font registration needed for deployment
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0d0d0d',
    color: '#f5f5f5',
    fontFamily: 'Helvetica',
    padding: 48,
  },
  // Cover page
  coverPage: {
    backgroundColor: '#0d0d0d',
    padding: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  accentLine: {
    width: 32,
    height: 1,
    backgroundColor: '#00c8ff',
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 10,
    letterSpacing: 3,
    color: '#f5f5f5',
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
  },
  brandAccent: {
    fontSize: 10,
    letterSpacing: 3,
    color: '#00c8ff',
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: 'Helvetica',
    color: '#f5f5f5',
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: 1.3,
    marginBottom: 16,
  },
  coverSubtitle: {
    fontSize: 11,
    color: '#888',
    lineHeight: 1.6,
    maxWidth: 360,
  },
  coverClient: {
    fontSize: 14,
    color: '#00c8ff',
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold',
  },
  coverDate: {
    fontSize: 9,
    color: '#555',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Content page
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 3,
    color: '#00c8ff',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#f5f5f5',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  body: {
    fontSize: 10,
    color: '#aaa',
    lineHeight: 1.7,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#161616',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    borderLeft: '2px solid #00c8ff',
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#f5f5f5',
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 9,
    color: '#888',
    lineHeight: 1.6,
  },
  divider: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 20,
  },
  badge: {
    backgroundColor: '#00c8ff1a',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 8,
    color: '#00c8ff',
    letterSpacing: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#444',
    letterSpacing: 1,
  },
})

function getRecommendedTool(data: AssessmentFormData): string {
  const budget = data.budget_range
  if (budget?.includes('R20,000') || budget?.includes('Over')) return 'Workato'
  if (budget?.includes('R8,000') || budget?.includes('R3,000')) return 'Make.com'
  return 'n8n'
}

function getROIEstimate(data: AssessmentFormData): string {
  const size = data.team_size
  if (size === '100+' || size === '51–100') return '20–40 hours/week across your team'
  if (size === '21–50') return '10–20 hours/week across your team'
  if (size === '6–20') return '5–15 hours/week across your team'
  return '3–10 hours/week'
}

export function generateProposalDocument(data: AssessmentFormData) {
  const tool = getRecommendedTool(data)
  const roi = getROIEstimate(data)
  const date = new Date().toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const integrationOpportunities = getIntegrationOpportunities(data)

  return (
    <Document>
      {/* ── Cover Page ── */}
      <Page size="A4" style={styles.coverPage}>
        <View>
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>Wagon Back</Text>
            <Text style={{ color: '#00c8ff', fontSize: 10 }}> · </Text>
            <Text style={styles.brandAccent}>Solutions</Text>
          </View>
        </View>

        <View>
          <View style={styles.accentLine} />
          <Text style={styles.coverTitle}>
            Automation{'\n'}Proposal
          </Text>
          <Text style={styles.coverSubtitle}>
            A custom integration and AI automation plan prepared specifically for your business.
          </Text>
        </View>

        <View>
          <Text style={styles.coverClient}>{data.business_name}</Text>
          <Text style={{ fontSize: 9, color: '#555', marginBottom: 4 }}>
            Prepared for: {data.contact_name}
          </Text>
          <Text style={styles.coverDate}>{date}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>WAGON BACK SOLUTIONS</Text>
          <Text style={styles.footerText}>CONFIDENTIAL</Text>
        </View>
      </Page>

      {/* ── Executive Summary ── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionLabel}>01 — Executive Summary</Text>
        <Text style={styles.sectionTitle}>The Opportunity</Text>
        <Text style={styles.body}>
          Based on your assessment, {data.business_name} has significant opportunities to reduce
          manual work and improve operational efficiency through targeted AI automation and platform
          integration. Your team of {data.team_size} people, operating in the {data.industry} sector,
          stands to reclaim an estimated {roi} — time that can be redirected toward revenue-generating activities.
        </Text>

        {data.desired_outcomes ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Stated Goals</Text>
            <Text style={styles.cardBody}>{data.desired_outcomes}</Text>
          </View>
        ) : null}

        {data.time_drains ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Identified Time Drains</Text>
            <Text style={styles.cardBody}>{data.time_drains}</Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Pain Points Identified</Text>
        {(data.pain_points ?? []).map((pt, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
            <Text style={{ color: '#00c8ff', fontSize: 10, marginRight: 8, marginTop: 1 }}>→</Text>
            <Text style={{ ...styles.body, marginBottom: 0, flex: 1 }}>{pt}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>WAGON BACK SOLUTIONS — CONFIDENTIAL</Text>
          <Text style={styles.footerText}>PAGE 2</Text>
        </View>
      </Page>

      {/* ── Integration Opportunities ── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionLabel}>02 — Integration Opportunities</Text>
        <Text style={styles.sectionTitle}>Where We Can Help</Text>
        <Text style={styles.body}>
          Based on the platforms your business uses, here are the integration workflows we recommend:
        </Text>

        {integrationOpportunities.map((opp, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardTitle}>{opp.title}</Text>
            <Text style={styles.cardBody}>{opp.description}</Text>
          </View>
        ))}

        <Text style={{ ...styles.sectionLabel, marginTop: 16 }}>Current Tools</Text>
        <View style={styles.badgeRow}>
          {(data.current_tools ?? []).map((tool, i) => (
            <View key={i} style={styles.badge}>
              <Text style={styles.badgeText}>{tool}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>WAGON BACK SOLUTIONS — CONFIDENTIAL</Text>
          <Text style={styles.footerText}>PAGE 3</Text>
        </View>
      </Page>

      {/* ── Recommended Solution ── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionLabel}>03 — Recommended Solution</Text>
        <Text style={styles.sectionTitle}>Our Approach</Text>
        <Text style={styles.body}>
          Based on your team size, budget range ({data.budget_range}), and complexity requirements,
          we recommend building your automation stack on{' '}
          <Text style={{ color: '#00c8ff' }}>{tool}</Text> — the right tool for your scale and needs.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{tool}</Text>
          <Text style={styles.cardBody}>
            {tool === 'Workato'
              ? 'Enterprise-grade automation platform with the most powerful integration capabilities, audit logging, and enterprise security. Best for complex, multi-system workflows at scale.'
              : tool === 'Make.com'
              ? 'Highly flexible visual automation platform supporting 1,500+ apps. Excellent balance of power and cost-efficiency for growing SMEs needing fast time-to-value.'
              : 'Open-source, AI-native automation platform. Ideal for businesses that value data privacy, want self-hosted control, and need deep AI agent capabilities.'}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Estimated ROI</Text>
        <Text style={styles.sectionTitle}>What To Expect</Text>
        <Text style={styles.body}>
          Conservative estimate: <Text style={{ color: '#00c8ff' }}>{roi}</Text> saved through automation.
        </Text>
        <Text style={styles.body}>
          Most clients see full ROI within 60–90 days of deployment. Beyond time savings, common
          outcomes include faster invoice processing, higher lead conversion rates through instant
          follow-up, and fewer errors from manual data entry.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>WAGON BACK SOLUTIONS — CONFIDENTIAL</Text>
          <Text style={styles.footerText}>PAGE 4</Text>
        </View>
      </Page>

      {/* ── Next Steps ── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionLabel}>04 — Next Steps</Text>
        <Text style={styles.sectionTitle}>Let&#39;s Get Started</Text>
        <Text style={styles.body}>
          We&#39;re excited about the opportunity to work with {data.business_name}. Here&#39;s how to move forward:
        </Text>

        {[
          { step: '01', title: 'Book a Discovery Call', desc: 'A 30-minute call to walk through this proposal, answer your questions, and refine the scope. No obligation.' },
          { step: '02', title: 'Scoping & Proposal', desc: 'We produce a detailed technical scope, timeline, and fixed-price quote within 5 business days.' },
          { step: '03', title: 'Build & Launch', desc: 'We build, test, and deploy your automation stack — typically within 2–6 weeks depending on scope.' },
          { step: '04', title: 'Ongoing Support', desc: 'Monthly retainer for monitoring, optimisation, and expanding your automation as your business grows.' },
        ].map((item) => (
          <View key={item.step} style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <Text style={{ color: '#00c8ff', fontSize: 16, fontFamily: 'Helvetica', letterSpacing: 1, minWidth: 28 }}>
                {item.step}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody}>{item.desc}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ ...styles.card, borderLeft: '2px solid #00c8ff', marginTop: 20 }}>
          <Text style={styles.cardTitle}>Book Your Discovery Call</Text>
          <Text style={styles.cardBody}>
            {process.env.NEXT_PUBLIC_CALENDLY_URL || 'Please contact us at hello@wagonback.co.za to schedule your call.'}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>WAGON BACK SOLUTIONS · hello@wagonback.co.za</Text>
          <Text style={styles.footerText}>PAGE 5</Text>
        </View>
      </Page>
    </Document>
  )
}

function getIntegrationOpportunities(data: AssessmentFormData) {
  const tools = data.current_tools ?? []
  const opps = []

  if (tools.includes('Shopify') && (tools.includes('Xero') || tools.includes('QuickBooks'))) {
    opps.push({
      title: 'Shopify → Accounting Auto-Sync',
      description: 'Automatically create invoices and reconcile payments in your accounting platform every time an order is placed or fulfilled on Shopify. Eliminates manual data entry entirely.',
    })
  }
  if (tools.includes('Shopify') && (tools.includes('Salesforce') || tools.includes('HubSpot') || tools.includes('Zoho CRM'))) {
    opps.push({
      title: 'E-commerce → CRM Lead Sync',
      description: 'Push every new Shopify customer into your CRM automatically, trigger follow-up sequences, and track lifetime value without any manual work.',
    })
  }
  if (tools.includes('WhatsApp') && (tools.includes('Salesforce') || tools.includes('HubSpot') || tools.includes('Zoho CRM'))) {
    opps.push({
      title: 'WhatsApp → CRM Integration',
      description: 'Log WhatsApp conversations, create contacts, and trigger follow-up tasks in your CRM automatically — making every customer interaction traceable.',
    })
  }
  if (tools.includes('Gmail / Google Workspace') || tools.includes('Microsoft 365')) {
    opps.push({
      title: 'Email-Triggered Workflows',
      description: 'Turn incoming emails into automated actions: create tasks, update CRM records, send notifications to Slack, or trigger approval workflows — without lifting a finger.',
    })
  }
  if (tools.includes('Slack')) {
    opps.push({
      title: 'Team Notification Hub',
      description: 'Route critical business events (new leads, payment received, support tickets) directly to the right Slack channels — so your team stays informed in real time.',
    })
  }

  if (opps.length === 0) {
    opps.push({
      title: 'Custom Integration Assessment',
      description: 'Based on your current tool stack, we will map out the highest-value integration points during our discovery call and present a custom workflow design.',
    })
  }

  return opps
}
