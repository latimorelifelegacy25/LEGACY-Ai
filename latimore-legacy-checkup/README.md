# Latimore Legacy Checkup

Mobile-first interactive education funnel for Latimore Life & Legacy LLC.

Route:

```txt
/education
```

Brand:

```txt
Latimore Life & Legacy LLC
Protecting Today. Securing Tomorrow.
#TheBeatGoesOn
```

## Features

- One-question-at-a-time funnel
- Progress bar
- Contact capture
- Priority path segmentation
- Family, income, debt, retirement, and protection questions
- Rule of 72 interactive calculator
- DIME protection gap question
- Living benefits education
- Retirement income / GRIPP-style education
- Tax bucket education
- 401(k) vs. properly structured life insurance education
- Estate planning add-on
- Legacy Readiness Score
- Branded PDF guide download CTA
- Resend email delivery for guides
- Completed-funnel email follow-up
- Advisor/internal notification emails
- Booking CTA
- Supabase lead capture
- Supabase activity logging

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```bash
cp .env.local.example .env.local
```

Add your Supabase service role key:

```txt
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Optional Resend email automation:

```txt
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL="Latimore Life & Legacy <noreply@yourdomain.com>"
RESEND_REPLY_TO=jackson@yourdomain.com
RESEND_INTERNAL_NOTIFY_TO=jackson@yourdomain.com
NEXT_PUBLIC_SITE_URL=https://latimorelifelegacy.com
```

Run the SQL in:

```txt
supabase/sql/latimore_legacy_checkup.sql
```

Start development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000/education
```

## Email Automation

The guide button now generates a branded PDF and attempts to email it to the lead using Resend.

Email behavior:

```txt
Completed Legacy Checkup -> client follow-up email + advisor notification
Send My Education Guide -> branded PDF download + PDF email attachment + advisor notification
```

If Resend environment variables are missing, the guide still downloads as a PDF and the page displays a setup notice.

Resend setup requirements:

```txt
1. Create a Resend API key.
2. Verify your sending domain.
3. Add RESEND_API_KEY and RESEND_FROM_EMAIL to .env.local.
```

## Booking CTA

```txt
Book 30 Minutes With Jackson
https://calendar.app.google/2ERTvJcQQTNF4DFJ9
```

## Required Supabase Events

The funnel logs:

```txt
Started Education Funnel
Completed Contact Capture
Selected Service Priority
Answered Retirement Question
Answered Life Insurance Question
Viewed Rule of 72
Viewed Tax Buckets
Viewed 401k vs IUL Education
Viewed GRIPP Module
Requested Education Guide
Downloaded Guide
Emailed Guide
Clicked Book With Jackson
Completed Legacy Checkup
```

## Security

The browser never receives the service role key. All database writes go through Next.js API routes.
