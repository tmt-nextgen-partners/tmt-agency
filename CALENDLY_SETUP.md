# Calendly Integration Setup Guide

This guide will help you complete the Calendly integration for your TMT NextGen Partners website.

## 🎯 Overview

The Calendly integration implements a two-step consultation booking flow:
1. **Step 1**: User fills out consultation form (collects lead information)
2. **Step 2**: User schedules meeting via embedded Calendly widget

## ✅ What's Already Implemented

- ✅ React Calendly package installed
- ✅ CalendlyWidget and CalendlyButton components created
- ✅ Two-step modal flow with form → scheduling
- ✅ Database schema updated with Calendly fields
- ✅ Webhook edge function (`calendly-webhook`) created
- ✅ Lead data pre-fills into Calendly widget
- ✅ "Skip for now" option for users who don't want to schedule immediately

## 🔧 Required Configuration Steps

### 1. Get Your Calendly URL

1. Log into your Calendly account at https://calendly.com
2. Go to your Event Types: https://calendly.com/event_types/user/me
3. Create or select a "Consultation" event type
4. Copy the scheduling link (e.g., `https://calendly.com/your-username/consultation`)

### 2. Update the Code with Your Calendly URL

Open `src/components/organisms/ConsultationModal.tsx` and replace:

```typescript
const CALENDLY_URL = 'https://calendly.com/your-calendly-username/consultation';
```

With your actual Calendly URL:

```typescript
const CALENDLY_URL = 'https://calendly.com/yourname/free-consultation';
```

### 3. Configure Calendly Webhook (Important!)

To automatically update leads when meetings are scheduled:

1. Log into Calendly
2. Go to **Integrations** → **Webhooks** → **Add Webhook**
   - Or direct link: https://calendly.com/integrations/webhooks
3. Enter your webhook URL:
   ```
   https://nxyunvvkchhhzgspiflq.supabase.co/functions/v1/calendly-webhook
   ```
4. Subscribe to these events:
   - ✅ `invitee.created` (when someone books)
   - ✅ `invitee.canceled` (when someone cancels)
5. Save the webhook

### 4. Customize Calendly Event Questions (Optional but Recommended)

To capture additional context during booking:

1. Edit your Calendly event type
2. Add custom questions:
   - **Company Name** (text)
   - **Monthly Budget** (multiple choice)
   - **Business Goals** (paragraph)
   - **Current Challenges** (paragraph)

These will be pre-filled from the consultation form!

### 5. Brand Your Calendly Page (Recommended)

Make your Calendly booking page match your website:

1. Go to **Account Settings** → **Branding**
2. Upload your TMT NextGen Partners logo
3. Set brand color to match your primary blue: `#2563eb`
4. Customize confirmation page with next steps

**Note**: Custom branding requires Calendly Essentials plan or higher ($10/month)

## 🚀 Testing the Integration

### Test the Form → Scheduling Flow

1. Click "Get Free Process Audit" button on your website
2. Fill out the consultation form
3. Submit the form
4. Verify you're taken to the Calendly scheduling step
5. Select a time slot and complete booking
6. Check your database to confirm:
   - Lead status updated to `meeting_scheduled`
   - `calendly_event_id` field populated
   - `meeting_scheduled_at` timestamp set

### Test the Webhook

1. Book a test consultation
2. Check the Supabase logs for the `calendly-webhook` function
3. Verify lead status was updated in the database
4. Test canceling a meeting and verify status reverts

## 📊 Admin Dashboard Access

View scheduled consultations:

1. Go to Admin Dashboard: `/admin`
2. View leads with status `meeting_scheduled`
3. See `meeting_scheduled_at` timestamp
4. Access Calendly event ID for reference

## 🔒 Security Best Practices

### Webhook Security (Optional Enhancement)

For production, you should verify webhook signatures:

1. Get your Calendly webhook signing key from webhook settings
2. Add it to Supabase secrets:
   ```bash
   # In Supabase Dashboard → Project Settings → Edge Functions
   CALENDLY_WEBHOOK_SECRET=your_webhook_signing_key
   ```
3. Update `calendly-webhook/index.ts` to verify signatures

### RLS Policies

The database migration already set up proper Row Level Security:
- Only admins can view/manage leads
- Webhook uses service role to bypass RLS when updating leads

## 🎨 Customization Options

### Change Button Text

In `ConsultationModal.tsx`, customize the skip button:

```typescript
<Button variant="outline" onClick={handleClose}>
  I'll schedule via email instead
</Button>
```

### Adjust Widget Height

In `CalendlyWidget.tsx`, modify the height:

```typescript
styles={{
  height: '800px', // Increase for more content
  width: '100%',
}}
```

### Add Direct Booking Buttons

Use the `CalendlyButton` component anywhere:

```tsx
import { CalendlyButton } from '@/components/molecules/CalendlyButton';

<CalendlyButton
  calendlyUrl={CALENDLY_URL}
  buttonText="Schedule Now"
  variant="primary"
/>
```

## 📈 Analytics & Tracking

The integration tracks:
- UTM parameters: `utm_source=tmt-website&utm_medium=consultation-form`
- Form submission → scheduling conversion rate
- Lead status transitions

Monitor in:
- Calendly Analytics Dashboard
- Your website analytics (via UTM params)
- Supabase `lead_activities` table

## 🐛 Troubleshooting

### "Please configure your Calendly URL" message shows

- You haven't updated `CALENDLY_URL` in `ConsultationModal.tsx`
- Make sure to replace the placeholder with your actual URL

### Webhook not updating leads

- Check Calendly webhook settings are correct
- View logs in Supabase Dashboard → Edge Functions → calendly-webhook
- Verify webhook URL is publicly accessible
- Confirm events are subscribed: `invitee.created` and `invitee.canceled`

### Lead data not pre-filling

- Check that form submission successfully saves lead data
- Verify `setLeadData()` is called in `ConsultationForm.tsx`
- Console log `leadData` in `ConsultationModal.tsx` to debug

### Calendly widget not loading

- Check browser console for errors
- Verify `react-calendly` package is installed
- Ensure Calendly URL is valid and accessible

## 📚 Additional Resources

- [Calendly API Documentation](https://developer.calendly.com/)
- [Calendly Webhook Guide](https://developer.calendly.com/api-docs/webhooks)
- [React Calendly Package](https://github.com/tcampb/react-calendly)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## 🎯 Next Steps (Optional Enhancements)

1. **Email Notifications**: Send custom confirmation emails via Resend when meeting scheduled
2. **SMS Reminders**: Add Twilio integration for SMS reminders
3. **Round Robin**: Distribute consultations among team members (requires Calendly Teams plan)
4. **Calendar Sync**: Sync scheduled meetings to Google Calendar/Outlook
5. **Meeting Recordings**: Auto-record consultations via Zoom/Google Meet integration
6. **Post-Meeting Workflow**: Trigger follow-up email sequences after consultation

## 💬 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase edge function logs
3. Test webhook with Calendly's webhook testing tool
4. Verify all configuration steps completed

---

**Status**: ⚠️ Requires configuration before use
**Priority**: Replace `CALENDLY_URL` placeholder with your actual Calendly link
