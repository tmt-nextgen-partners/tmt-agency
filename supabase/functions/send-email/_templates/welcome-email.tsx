import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'https://esm.sh/@react-email/components@0.0.22';
import React from 'https://esm.sh/react@18.3.1?deps=react@18.3.1';

interface WelcomeEmailProps {
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
}

export const WelcomeEmail = ({
  first_name = '',
  last_name = '',
  email = '',
  company_name = '',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome {first_name}! Your consultation request has been received</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Welcome, {first_name}! 👋</Heading>
          <Text style={subtitle}>Thank you for your consultation request</Text>
        </Section>

        <Section style={content}>
          <Text style={text}>
            We have received your consultation request and our team is excited to help you transform your business processes.
          </Text>

          <Heading style={h2}>What happens next:</Heading>
          
          <Section style={stepSection}>
            <div style={stepNumber}>1</div>
            <div style={stepContent}>
              <Text style={stepTitle}>Review & Analysis</Text>
              <Text style={stepDescription}>
                Our team will carefully review your information and business requirements
              </Text>
            </div>
          </Section>

          <Section style={stepSection}>
            <div style={stepNumber}>2</div>
            <div style={stepContent}>
              <Text style={stepTitle}>Consultation Preparation</Text>
              <Text style={stepDescription}>
                We will prepare a customized consultation agenda tailored to your specific needs
              </Text>
            </div>
          </Section>

          <Section style={stepSection}>
            <div style={stepNumber}>3</div>
            <div style={stepContent}>
              <Text style={stepTitle}>Schedule Your Session</Text>
              <Text style={stepDescription}>
                You will receive a calendar link to schedule your free consultation within 24 hours
              </Text>
            </div>
          </Section>

          <Section style={calloutSection}>
            <Text style={calloutText}>
              💡 <strong>Pro Tip:</strong> In the meantime, start documenting your current processes and pain points. This will help us provide even more targeted recommendations during your consultation.
            </Text>
          </Section>

          <Text style={text}>
            We are committed to helping you achieve your business goals and look forward to discussing how we can optimize your operations for maximum efficiency and growth.
          </Text>

          <Text style={text}>
            If you have any urgent questions before your consultation, feel free to reply to this email.
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={signature}>
            Best regards,<br />
            <strong>The Business Process Team</strong>
          </Text>
          
          <Text style={footerNote}>
            This email was sent to {email}. You are receiving this because you requested a consultation through our website.
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
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px',
  textAlign: 'center' as const,
  backgroundColor: '#3b82f6',
  borderRadius: '8px 8px 0 0',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const subtitle = {
  color: '#dbeafe',
  fontSize: '16px',
  margin: '0',
};

const content = {
  padding: '32px 24px',
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 16px 0',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const stepSection = {
  display: 'flex',
  alignItems: 'flex-start',
  margin: '16px 0',
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const stepNumber = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontWeight: 'bold',
  marginRight: '16px',
  flexShrink: 0,
};

const stepContent = {
  flex: 1,
};

const stepTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
};

const stepDescription = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.5',
};

const calloutSection = {
  margin: '24px 0',
  padding: '20px',
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  border: '1px solid #f59e0b',
};

const calloutText = {
  color: '#92400e',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.6',
};

const footer = {
  padding: '24px',
  backgroundColor: '#f9fafb',
  borderRadius: '0 0 8px 8px',
  borderTop: '1px solid #e5e7eb',
};

const signature = {
  color: '#1f2937',
  fontSize: '16px',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
};

const footerNote = {
  color: '#6b7280',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0',
  lineHeight: '1.5',
};

export default WelcomeEmail;