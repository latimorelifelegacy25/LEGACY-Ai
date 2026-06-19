export const dynamic = 'force-dynamic'

import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncInquiryToUnifiedSchema } from '@/lib/unified-sync'

function verifyFilloutSignature(rawBody: string, signature: string | null) {
  if (!signature) return false
  const secret = process.env.FILLOUT_SECRET || ''
  const hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  const sig = req.headers.get('x-webhook-signature')
  
  if (!verifyFilloutSignature(raw, sig)) {
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 })
  }

  const body = JSON.parse(raw)
  // Adjust mapping to match your Fillout field keys
  const f = body.answers || body

  const email = f.email?.trim().toLowerCase()
  if (!email) return NextResponse.json({ ok: false, error: 'email required' }, { status: 400 })

  const contact = await prisma.contact.upsert({
    where: { email },
    update: {
      firstName: f.first_name ?? f.firstName,
      lastName: f.last_name ?? f.lastName,
      phone: f.phone,
      county: f.county,
      leadSessionId: f.lead_session_id,
      utmSource: f.utm_source,
      utmMedium: f.utm_medium,
      utmCampaign: f.utm_campaign,
      utmTerm: f.utm_term,
      utmContent: f.utm_content,
      referrer: f.referrer
    },
    create: {
      email,
      firstName: f.first_name ?? f.firstName,
      lastName: f.last_name ?? f.lastName,
      phone: f.phone,
      county: f.county,
      leadSessionId: f.lead_session_id,
      utmSource: f.utm_source,
      utmMedium: f.utm_medium,
      utmCampaign: f.utm_campaign,
      utmTerm: f.utm_term,
      utmContent: f.utm_content,
      referrer: f.referrer
    }
  })

  const interestType = (f.interest_type ?? 'Velocity') as string

  const inquiry = await prisma.inquiry.create({
    data: {
      contactId: contact.id,
      interestType: interestType as any,
      status: 'New_Inquiry',
      source: 'Fillout',
      leadSessionId: f.lead_session_id
    }
  })

  await syncInquiryToUnifiedSchema({
    inquiryId: inquiry.id,
    contact,
    interestType,
    status: 'New_Inquiry',
    source: 'Fillout'
  })

  return NextResponse.json({ ok: true, inquiryId: inquiry.id })
}