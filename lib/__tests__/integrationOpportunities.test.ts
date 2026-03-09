import { describe, it, expect } from 'vitest'
import { getIntegrationOpportunities } from '../integrationOpportunities'
import type { AssessmentFormData } from '@/types/assessment'

function makeData(tools: string[]): AssessmentFormData {
  return {
    business_name: 'Test Co',
    contact_name: 'Jane',
    email: 'jane@test.co.za',
    phone: '',
    industry: 'Technology',
    team_size: '6–20',
    pain_points: [],
    current_tools: tools,
    time_drains: '',
    desired_outcomes: '',
    revenue_range: 'R1M – R5M/year',
    budget_range: 'R3,000 – R8,000/month',
    timeline: 'Within 1–3 months',
    additional_notes: '',
  }
}

describe('getIntegrationOpportunities', () => {
  it('returns fallback for no matching tools', () => {
    const result = getIntegrationOpportunities(makeData(['Trello / Asana / Monday']))
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Custom Integration Assessment')
  })

  it('returns fallback for empty tools list', () => {
    const result = getIntegrationOpportunities(makeData([]))
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Custom Integration Assessment')
  })

  it('detects Shopify + Xero accounting sync', () => {
    const result = getIntegrationOpportunities(makeData(['Shopify', 'Xero']))
    const titles = result.map((o) => o.title)
    expect(titles).toContain('Shopify → Accounting Auto-Sync')
  })

  it('detects Shopify + QuickBooks accounting sync', () => {
    const result = getIntegrationOpportunities(makeData(['Shopify', 'QuickBooks']))
    const titles = result.map((o) => o.title)
    expect(titles).toContain('Shopify → Accounting Auto-Sync')
  })

  it('does not add accounting sync for Shopify without accounting tool', () => {
    const result = getIntegrationOpportunities(makeData(['Shopify']))
    const titles = result.map((o) => o.title)
    expect(titles).not.toContain('Shopify → Accounting Auto-Sync')
  })

  it('detects Shopify + Salesforce CRM sync', () => {
    const result = getIntegrationOpportunities(makeData(['Shopify', 'Salesforce']))
    const titles = result.map((o) => o.title)
    expect(titles).toContain('E-commerce → CRM Lead Sync')
  })

  it('detects Shopify + HubSpot CRM sync', () => {
    const result = getIntegrationOpportunities(makeData(['Shopify', 'HubSpot']))
    const titles = result.map((o) => o.title)
    expect(titles).toContain('E-commerce → CRM Lead Sync')
  })

  it('detects Shopify + Zoho CRM sync', () => {
    const result = getIntegrationOpportunities(makeData(['Shopify', 'Zoho CRM']))
    const titles = result.map((o) => o.title)
    expect(titles).toContain('E-commerce → CRM Lead Sync')
  })

  it('detects WhatsApp + HubSpot CRM integration', () => {
    const result = getIntegrationOpportunities(makeData(['WhatsApp', 'HubSpot']))
    const titles = result.map((o) => o.title)
    expect(titles).toContain('WhatsApp → CRM Integration')
  })

  it('detects WhatsApp + Salesforce CRM integration', () => {
    const result = getIntegrationOpportunities(makeData(['WhatsApp', 'Salesforce']))
    const titles = result.map((o) => o.title)
    expect(titles).toContain('WhatsApp → CRM Integration')
  })

  it('does not add WhatsApp integration without a CRM tool', () => {
    const result = getIntegrationOpportunities(makeData(['WhatsApp']))
    const titles = result.map((o) => o.title)
    expect(titles).not.toContain('WhatsApp → CRM Integration')
  })

  it('detects Gmail email-triggered workflows', () => {
    const result = getIntegrationOpportunities(makeData(['Gmail / Google Workspace']))
    const titles = result.map((o) => o.title)
    expect(titles).toContain('Email-Triggered Workflows')
  })

  it('detects Microsoft 365 email-triggered workflows', () => {
    const result = getIntegrationOpportunities(makeData(['Microsoft 365']))
    const titles = result.map((o) => o.title)
    expect(titles).toContain('Email-Triggered Workflows')
  })

  it('detects Slack notification hub', () => {
    const result = getIntegrationOpportunities(makeData(['Slack']))
    const titles = result.map((o) => o.title)
    expect(titles).toContain('Team Notification Hub')
  })

  it('returns multiple opportunities for a full stack', () => {
    const result = getIntegrationOpportunities(
      makeData(['Shopify', 'Xero', 'HubSpot', 'WhatsApp', 'Slack', 'Gmail / Google Workspace'])
    )
    const titles = result.map((o) => o.title)
    expect(titles).toContain('Shopify → Accounting Auto-Sync')
    expect(titles).toContain('E-commerce → CRM Lead Sync')
    expect(titles).toContain('WhatsApp → CRM Integration')
    expect(titles).toContain('Email-Triggered Workflows')
    expect(titles).toContain('Team Notification Hub')
    expect(titles).not.toContain('Custom Integration Assessment')
  })

  it('does not include fallback when real opportunities exist', () => {
    const result = getIntegrationOpportunities(makeData(['Slack']))
    expect(result.some((o) => o.title === 'Custom Integration Assessment')).toBe(false)
  })

  it('handles undefined current_tools gracefully', () => {
    const data = makeData([])
    // @ts-expect-error — simulating incomplete data from DB
    data.current_tools = undefined
    const result = getIntegrationOpportunities(data)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Custom Integration Assessment')
  })
})
