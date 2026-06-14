import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, notes } = await req.json()
    
    if (!status) {
      return NextResponse.json({ ok: false, error: 'status required' }, { status: 400 })
    }

    const allowedStatuses = ['New_Inquiry', 'Qualified', 'Booked', 'Closed_Won', 'Closed_Lost']
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ ok: false, error: 'invalid status' }, { status: 400 })
    }

    const inquiry = await prisma.inquiry.update({
      where: { id: params.id },
      data: {
        status,
        notes: notes || undefined,
        updatedAt: new Date()
      },
      include: {
        contact: true
      }
    })

    return NextResponse.json({ ok: true, inquiry })
  } catch (error) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json({ ok: false, error: 'Failed to update inquiry' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: params.id },
      include: {
        contact: true,
        appointments: true
      }
    })

    if (!inquiry) {
      return NextResponse.json({ ok: false, error: 'Inquiry not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, inquiry })
  } catch (error) {
    console.error('Error fetching inquiry:', error)
    return NextResponse.json({ ok: false, error: 'Failed to fetch inquiry' }, { status: 500 })
  }
}