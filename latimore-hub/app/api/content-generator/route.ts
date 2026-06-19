export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

const COMPLIANCE_FOOTER = 'Jackson M. Latimore Sr., Independent Insurance Consultant, PA License #1268820 | NIPR #21638507. Educational content only.'

const BRAND_CONFIG = {
  brand_name: 'Latimore Life & Legacy LLC',
  service_regions: 'Schuylkill, Luzerne, and Northumberland Counties in Pennsylvania',
  local_focus: 'Schuylkill County and surrounding Coal Region communities',
  core_message: 'Protecting Today. Securing Tomorrow.',
  tagline: '#TheBeatGoesOn',
  tone: 'Authoritative, calm, community-focused, preparation over fear',
  compliance_footer: COMPLIANCE_FOOTER,
}

const POST_TEMPLATES: Record<string, Record<string, string[]>> = {
  Monday: {
    education: [
      `Did you know that most life insurance policies only pay out when you pass away?\n\nBut here in {local_focus}, families are dealing with something just as financially devastating — a serious illness that keeps you from working.\n\nThat's why Living Benefits matter. With the right policy, you may be able to access a portion of your death benefit while you're still alive — if you're diagnosed with a critical, chronic, or terminal illness.\n\nFor {audience}, this isn't hypothetical. It's preparation.\n\nWant to learn more? Drop a comment or send me a message. I'm here to help — no pressure, just education.\n\n{compliance_footer}`,
      `Here's something most people in {service_regions} don't know about their 401(k):\n\nIf you try to access it before age 59½, you'll pay a 10% penalty PLUS state and federal taxes. That can mean losing 40–50% of your savings.\n\nAnd if you wait too long (past age 73), you'll face Required Minimum Distribution penalties.\n\nThere's a reason so many {audience} are exploring tax-advantaged alternatives. The goal is to grow your money AND keep more of it at retirement.\n\nCurious about your options? Let's talk — no obligation, just clarity.\n\n{compliance_footer}`,
    ],
  },
  Tuesday: {
    faq: [
      `FAQ: "Do I really need life insurance if I'm young and healthy?"\n\nGreat question — and one I hear often from {audience} right here in {local_focus}.\n\nHere's the honest answer: The best time to get life insurance is when you're young and healthy. Rates are lowest, and you lock in your insurability before any health changes.\n\nWaiting until you "need it" often means paying significantly more — or not qualifying at all.\n\nLife insurance isn't about expecting the worst. It's about preparing for it — so your family doesn't have to.\n\nHave a question? Drop it in the comments. I answer every one.\n\n{compliance_footer}`,
      `FAQ: "What's the difference between term and permanent life insurance?"\n\nFor {audience}, this is one of the most important questions to understand.\n\nTerm insurance: Coverage for a set period (10, 20, 30 years). Lower premiums. No cash value. Great for mortgage protection and income replacement.\n\nPermanent insurance (IUL, Whole Life): Coverage for life. Builds cash value. May include Living Benefits. Can serve as a tax-advantaged savings vehicle.\n\nNeither is "better" — the right choice depends on your situation, goals, and budget.\n\nWant a free 15-minute conversation to figure out what may fit your situation? Link in bio.\n\n{compliance_footer}`,
    ],
  },
  Wednesday: {
    authority: [
      `In 2010, I was 22 years old and playing basketball at East Stroudsburg University when my heart stopped.\n\nAn AED — placed in that gym because of the Gregory W. Moyer Defibrillator Fund — saved my life.\n\nThat moment is why I do what I do.\n\nI serve {audience} right here in {local_focus} because I know firsthand what it means when preparation is — or isn't — in place.\n\nI'm not a 1-800 number. I'm your neighbor. And I'm here to make sure your family is protected before they ever need it.\n\n#TheBeatGoesOn\n\n{compliance_footer}`,
      `When I started Latimore Life & Legacy LLC, I made a promise:\n\nNo fear-based sales. No pressure. Just education and preparation.\n\nBecause the families I serve in {service_regions} deserve an advisor who leads with their best interest — not a product quota.\n\nAs an independent consultant, I can shop multiple A-rated carriers to find what may actually fit your situation. Not what's easiest for me to sell.\n\nThat's the difference. And that's the standard I hold myself to every single day.\n\nProtecting Today. Securing Tomorrow. #TheBeatGoesOn\n\n{compliance_footer}`,
    ],
  },
  Thursday: {
    objection: [
      `"I already have life insurance through work — I'm covered."\n\nI hear this often from {audience} in {local_focus}. And I understand why it feels like enough.\n\nBut here's what most people don't realize:\n\n• Group coverage typically ends when you leave your job\n• It's usually sized to your employer's budget, not your family's needs\n• Most group plans don't include Living Benefits\n\nWork coverage is a great start. But it's rarely a complete plan.\n\nWould it be worth a quick 15-minute review to see if there are any gaps? No obligation — just clarity.\n\n{compliance_footer}`,
      `"Life insurance is too expensive."\n\nThis is one of the most common objections I hear — and one of the most important to address.\n\nFor a healthy person in {local_focus}, $500,000 in term coverage can cost less than a pizza night with the family.\n\nLess than $1 a day.\n\nThe question isn't whether you can afford life insurance. It's whether your family can afford not to have it.\n\nRates increase every birthday. The best time to lock in your rate is today.\n\nSend me a message to see your options — no commitment required.\n\n{compliance_footer}`,
    ],
  },
  Friday: {
    cta: [
      `This week, I've been thinking about the families in {local_focus} who are one unexpected event away from a financial crisis.\n\nNot because they're irresponsible. But because life moves fast — and protection planning often gets pushed to "someday."\n\nIf you've been meaning to review your coverage, explore your options, or just ask a question — today is a good day to start.\n\nNo pressure. No sales pitch. Just a free 15-minute conversation to see where you stand.\n\n👉 Book your free assessment: [BOOKING LINK]\n\nProtecting Today. Securing Tomorrow. #TheBeatGoesOn\n\n{compliance_footer}`,
      `Happy Friday, {local_focus}! 🏡\n\nAs you head into the weekend, here's one question worth sitting with:\n\n"If something happened to me tomorrow, would my family be okay financially?"\n\nIf the answer isn't a confident yes — let's change that.\n\nI work with {audience} across {service_regions} to build protection strategies that fit real budgets and real lives.\n\nTake 2 minutes this weekend to explore your options. No commitment required.\n\n👉 Get your free quote: [BOOKING LINK]\n\n#TheBeatGoesOn\n\n{compliance_footer}`,
    ],
  },
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] || `{${key}}`)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      audience = 'Young families in Schuylkill County',
      platform = 'Facebook & LinkedIn',
      week_start_date = new Date().toISOString().split('T')[0],
      days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    } = body

    const vars = {
      ...BRAND_CONFIG,
      audience,
      platform,
      week_start_date,
    }

    const posts: Record<string, { day: string; type: string; platform: string; audience: string; post_copy: string; scheduled_date: string }> = {}

    const dayTypes: Record<string, string> = {
      Monday: 'education',
      Tuesday: 'faq',
      Wednesday: 'authority',
      Thursday: 'objection',
      Friday: 'cta',
    }

    const startDate = new Date(week_start_date)

    days.forEach((day: string, index: number) => {
      const templates = POST_TEMPLATES[day]?.[dayTypes[day]] || POST_TEMPLATES['Monday']['education']
      const template = templates[Math.floor(Math.random() * templates.length)]
      const postCopy = fillTemplate(template, vars)

      const scheduledDate = new Date(startDate)
      scheduledDate.setDate(startDate.getDate() + index)

      posts[day] = {
        day,
        type: dayTypes[day] || 'education',
        platform,
        audience,
        post_copy: postCopy,
        scheduled_date: scheduledDate.toISOString().split('T')[0],
      }
    })

    return NextResponse.json({
      ok: true,
      week_start_date,
      audience,
      platform,
      posts,
      brand_config: {
        brand_name: BRAND_CONFIG.brand_name,
        core_message: BRAND_CONFIG.core_message,
        tagline: BRAND_CONFIG.tagline,
        compliance_footer: BRAND_CONFIG.compliance_footer,
      },
    })
  } catch (error) {
    console.error('Content generator error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to generate content' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    description: 'Latimore AI Social Content Generator API',
    endpoints: {
      POST: '/api/content-generator',
      body: {
        audience: 'string (optional) — target audience segment',
        platform: 'string (optional) — publishing platform',
        week_start_date: 'string (optional) — YYYY-MM-DD format',
        days: 'string[] (optional) — days to generate posts for',
      },
    },
    available_audiences: [
      'Young families in Schuylkill County',
      'Pre-retirees approaching retirement',
      'Manufacturing/Logistics employees',
      'Sandwich Generation (Working-Age Adults)',
      'Emerging Hispanic Community (Young Families)',
      'Small Business Owners',
      'School District & Municipal Employees',
    ],
  })
}