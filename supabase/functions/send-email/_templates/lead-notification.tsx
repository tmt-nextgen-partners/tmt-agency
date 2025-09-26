import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from 'https://esm.sh/@react-email/components@0.0.22';
import React from 'https://esm.sh/react@18.3.1';

interface LeadNotificationEmailProps {
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  phone: string;
  monthly_budget: string;
  business_goals: string;
  challenges: string;
  score: string;
  source_name: string;
  created_at: string;
  admin_url: string;
}

export const LeadNotificationEmail = ({
  first_name = '',
  last_name = '',
  email = '',
  company_name = '',
  phone = '',
  monthly_budget = '',
  business_goals = '',
  challenges = '',
  score = '0',
  source_name = '',
  created_at = '',
  admin_url = '',
}: LeadNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>New lead received: {first_name} {last_name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>🎯 New Lead Alert!</Heading>
          <Text style={subtitle}>A new consultation request has been received</Text>
        </Section>

        <Section style={leadInfoSection}>
          <Heading style={h2}>Lead Information</Heading>
          
          <Row style={infoRow}>
            <Column style={labelColumn}>
              <Text style={label}>Name:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{first_name} {last_name}</Text>
            </Column>
          </Row>

          <Row style={infoRow}>
            <Column style={labelColumn}>
              <Text style={label}>Email:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{email}</Text>
            </Column>
          </Row>

          {company_name && (
            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Company:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{company_name}</Text>
              </Column>
            </Row>
          )}

          {phone && (
            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Phone:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{phone}</Text>
              </Column>
            </Row>
          )}

          {monthly_budget && (
            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Budget:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{monthly_budget}</Text>
              </Column>
            </Row>
          )}

          <Row style={infoRow}>
            <Column style={labelColumn}>
              <Text style={label}>Lead Score:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={{...value, ...scoreStyle}}>{score}</Text>
            </Column>
          </Row>

          <Row style={infoRow}>
            <Column style={labelColumn}>
              <Text style={label}>Source:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{source_name}</Text>
            </Column>
          </Row>

          <Row style={infoRow}>
            <Column style={labelColumn}>
              <Text style={label}>Submitted:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{created_at}</Text>
            </Column>
          </Row>
        </Section>

        {business_goals && (
          <Section style={detailsSection}>
            <Heading style={h3}>Business Goals</Heading>
            <Text style={details}>{business_goals}</Text>
          </Section>
        )}

        {challenges && (
          <Section style={detailsSection}>
            <Heading style={h3}>Current Challenges</Heading>
            <Text style={details}>{challenges}</Text>
          </Section>
        )}

        <Section style={actionSection}>
          <Link href={admin_url} style={button}>
            View in Admin Dashboard
          </Link>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            This is an automated notification. Please respond to this lead within 24 hours for best conversion rates.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '32px 24px',
  textAlign: 'center' as const,
  backgroundColor: '#1f2937',
  borderRadius: '8px 8px 0 0',
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const subtitle = {
  color: '#d1d5db',
  fontSize: '16px',
  margin: '0',
};

const leadInfoSection = {
  padding: '24px',
  borderBottom: '1px solid #e5e7eb',
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const h3 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const infoRow = {
  marginBottom: '12px',
};

const labelColumn = {
  width: '140px',
  verticalAlign: 'top' as const,
};

const valueColumn = {
  verticalAlign: 'top' as const,
};

const label = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const value = {
  color: '#1f2937',
  fontSize: '14px',
  margin: '0',
};

const scoreStyle = {
  backgroundColor: '#10b981',
  color: '#ffffff',
  padding: '4px 8px',
  borderRadius: '4px',
  fontWeight: 'bold',
  display: 'inline-block',
};

const detailsSection = {
  padding: '24px',
  borderBottom: '1px solid #e5e7eb',
};

const details = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  padding: '12px',
  backgroundColor: '#f9fafb',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
};

const actionSection = {
  padding: '32px 24px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const footer = {
  padding: '24px',
  backgroundColor: '#f9fafb',
  borderRadius: '0 0 8px 8px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0',
};

export default LeadNotificationEmail;