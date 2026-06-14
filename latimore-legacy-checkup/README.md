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
- Guide download CTA
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
Clicked Book With Jackson
Completed Legacy Checkup
```

## Security

The browser never receives the service role key. All database writes go through Next.js API routes.
