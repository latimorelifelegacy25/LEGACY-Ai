import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncInquiryToUnifiedSchema } from '@/lib/unified-sync'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const interestType = searchParams.get('interestType')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    if (status) {
      where.status = status.replace(' ', '_')
    }
    if (interestType) {
      where.interestType = interestType
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        contact: true,
        appointments: true
      }
    })

    return NextResponse.json({ 
      ok: true, 
      items: inquiries,
      count: inquiries.length
    })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json({ ok: false, error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { contactId, interestType, notes, source } = await req.json()
    
    if (!contactId || !interestType) {
      return NextResponse.json({ ok: false, error: 'contactId and interestType required' }, { status: 400 })
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        contactId,
        interestType,
        status: 'New_Inquiry',
        notes,
        source: source || 'Manual'
      },
      include: {
        contact: true
      }
    })

    await syncInquiryToUnifiedSchema({
      inquiryId: inquiry.id,
      contact: inquiry.contact,
      interestType,
      status: 'New_Inquiry',
      source: source || 'Manual'
    })

    return NextResponse.json({ ok: true, inquiry })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json({ ok: false, error: 'Failed to create inquiry' }, { status: 500 })
  }
}