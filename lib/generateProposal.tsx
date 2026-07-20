import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { AssessmentFormData } from '@/types/assessment'
import { ProposalCopy } from '@/lib/generateProposalCopy'
import { getRecommendedServices, getHeadlineTotal } from '@/lib/recommendedServices'
import { ServiceIcon } from '@/lib/pdfServiceIcons'

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
  brandSeparator: {
    color: '#00c8ff',
    fontSize: 10,
  },
  submittedOn: {
    fontSize: 9,
    color: '#555',
    marginBottom: 4,
  },
  painPointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  painPointArrow: {
    color: '#00c8ff',
    fontSize: 10,
    marginRight: 8,
    marginTop: 1,
  },
  nextStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  nextStepNumber: {
    color: '#00c8ff',
    fontSize: 16,
    fontFamily: 'Helvetica',
    letterSpacing: 1,
    minWidth: 28,
  },
  nextStepContent: {
    flex: 1,
  },
  // Recommended Services page
  headlineStat: {
    backgroundColor: '#161616',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  headlineStatLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  headlineStatValue: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#00c8ff',
  },
  primaryCard: {
    backgroundColor: '#161616',
    borderRadius: 10,
    padding: 18,
    marginBottom: 12,
    borderLeft: '3px solid #00c8ff',
  },
  secondaryCard: {
    backgroundColor: '#141414',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeft: '2px solid #333',
  },
  serviceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#00c8ff1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBadge: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: '#00c8ff',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  serviceTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#f5f5f5',
  },
  serviceRoi: {
    fontSize: 9,
    color: '#00c8ff',
    marginTop: 8,
    marginBottom: 6,
  },
  toolPairBullet: {
    fontSize: 8,
    color: '#777',
    marginBottom: 3,
  },
})

// Extended styles that spread base entries (react-pdf requires plain objects for spread)
const extendedStyles = {
  toolsLabel: { ...styles.sectionLabel, marginTop: 16 },
  ctaCard: { ...styles.card, marginTop: 20 },
}

function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](\s|$)/)
  return match ? match[0].trim() : text
}

export function generateProposalDocument(data: AssessmentFormData, copy: ProposalCopy) {
  const date = new Date().toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const recommended = getRecommendedServices(data)
  const headlineTotal = getHeadlineTotal(recommended)
  const primary = recommended.find((s) => s.isPrimary) ?? recommended[0]
  const secondary = recommended.filter((s) => !s.isPrimary)

  return (
    <Document>
      {/* ── Cover Page ── */}
      <Page size="A4" style={styles.coverPage}>
        <View>
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>Wagon Back</Text>
            <Text style={styles.brandSeparator}> · </Text>
            <Text style={styles.brandAccent}>Solutions</Text>
          </View>
        </View>

        <View>
          <View style={styles.accentLine} />
          <Text style={styles.coverTitle}>Automation{'\n'}Proposal</Text>
          <Text style={styles.coverSubtitle}>{copy.cover_subtitle}</Text>
        </View>

        <View>
          <Text style={styles.coverClient}>{data.business_name}</Text>
          <Text style={styles.submittedOn}>Prepared for: {data.contact_name}</Text>
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

        {copy.exec_intro.split('\n\n').map((para, i) => (
          <Text key={i} style={styles.body}>
            {para}
          </Text>
        ))}

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
          <View key={i} style={styles.painPointRow}>
            <Text style={styles.painPointArrow}>→</Text>
            <Text style={{ ...styles.body, marginBottom: 0, flex: 1 }}>{pt}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>WAGON BACK SOLUTIONS — CONFIDENTIAL</Text>
          <Text style={styles.footerText}>PAGE 2</Text>
        </View>
      </Page>

      {/* ── Recommended Services ── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionLabel}>02 — Recommended Services</Text>
        <Text style={styles.sectionTitle}>Where We Can Help</Text>
        <Text style={styles.body}>{copy.services_intro}</Text>

        <View style={styles.headlineStat}>
          <Text style={styles.headlineStatLabel}>Estimated Combined Time Savings</Text>
          <Text style={styles.headlineStatValue}>
            {headlineTotal.low}–{headlineTotal.high} hrs/week
          </Text>
        </View>

        {/* Primary service — full detail */}
        <View style={styles.primaryCard}>
          <View style={styles.serviceHeaderRow}>
            <View style={styles.iconWrap}>
              <ServiceIcon service={primary.name} />
            </View>
            <View>
              <Text style={styles.primaryBadge}>Primary Recommendation</Text>
              <Text style={styles.serviceTitle}>{primary.name}</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>{copy.service_narratives[primary.name]}</Text>
          <Text style={styles.serviceRoi}>
            Estimated {primary.roiRange.low}–{primary.roiRange.high} hrs/week saved
          </Text>
          {primary.toolPairOpportunities.map((opp, i) => (
            <Text key={i} style={styles.toolPairBullet}>
              → {opp.title}
            </Text>
          ))}
        </View>

        {/* Secondary services — compact */}
        {secondary.map((service) => (
          <View key={service.name} style={styles.secondaryCard}>
            <View style={styles.serviceHeaderRow}>
              <View style={styles.iconWrap}>
                <ServiceIcon service={service.name} size={14} color="#666" />
              </View>
              <Text style={styles.serviceTitle}>{service.name}</Text>
            </View>
            <Text style={styles.cardBody}>
              {firstSentence(copy.service_narratives[service.name] ?? '')}
            </Text>
            <Text style={styles.serviceRoi}>
              Estimated {service.roiRange.low}–{service.roiRange.high} hrs/week saved
            </Text>
          </View>
        ))}

        <Text style={extendedStyles.toolsLabel}>Current Tools</Text>
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

      {/* ── Next Steps ── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionLabel}>03 — Next Steps</Text>
        <Text style={styles.sectionTitle}>Let&#39;s Get Started</Text>
        <Text style={styles.body}>{copy.next_steps_intro}</Text>

        {[
          {
            step: '01',
            title: 'Book a Discovery Call',
            desc: 'A 30-minute call to walk through this proposal, answer your questions, and refine the scope. No obligation.',
          },
          {
            step: '02',
            title: 'Scoping & Proposal',
            desc: 'We produce a detailed technical scope, timeline, and fixed-price quote within 5 business days.',
          },
          {
            step: '03',
            title: 'Build & Launch',
            desc: 'We build, test, and deploy your automation stack — typically within 2–6 weeks depending on scope.',
          },
          {
            step: '04',
            title: 'Ongoing Support',
            desc: 'Monthly retainer for monitoring, optimisation, and expanding your automation as your business grows.',
          },
        ].map((item) => (
          <View key={item.step} style={styles.card}>
            <View style={styles.nextStepRow}>
              <Text style={styles.nextStepNumber}>{item.step}</Text>
              <View style={styles.nextStepContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody}>{item.desc}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={extendedStyles.ctaCard}>
          <Text style={styles.cardTitle}>Book Your Discovery Call</Text>
          <Text style={styles.cardBody}>
            {process.env.NEXT_PUBLIC_BOOKING_URL ||
              'Please contact us at hello@wagonback.com to schedule your call.'}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>WAGON BACK SOLUTIONS · hello@wagonback.com</Text>
          <Text style={styles.footerText}>PAGE 4</Text>
        </View>
      </Page>
    </Document>
  )
}
