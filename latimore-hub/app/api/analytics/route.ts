export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Total inquiries in date range
    const totalInquiries = await prisma.inquiry.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })

    // Conversion rate (booked / total)
    const bookedInquiries = await prisma.inquiry.count({
      where: {
        createdAt: { gte: startDate },
        status: { in: ['Booked', 'Closed_Won'] }
      }
    })
    
    const conversionRate = totalInquiries > 0 ? (bookedInquiries / totalInquiries) * 100 : 0

    // Top sources
    const topSources = await prisma.inquiry.groupBy({
      by: ['source'],
      where: {
        createdAt: { gte: startDate }
      },
      _count: {
        source: true
      },
      orderBy: {
        _count: {
          source: 'desc'
        }
      },
      take: 5
    })

    // Inquiries by type
    const inquiriesByType = await prisma.inquiry.groupBy({
      by: ['interestType'],
      where: {
        createdAt: { gte: startDate }
      },
      _count: {
        interestType: true
      },
      orderBy: {
        _count: {
          interestType: 'desc'
        }
      }
    })

    // Inquiries by county
    const inquiriesByCounty = await prisma.contact.groupBy({
      by: ['county'],
      where: {
        inquiries: {
          some: {
            createdAt: { gte: startDate }
          }
        }
      },
      _count: {
        county: true
      },
      orderBy: {
        _count: {
          county: 'desc'
        }
      },
      take: 5
    })

    // Recent trends (daily counts for last 14 days)
    const recentTrends = []
    for (let i = 13; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const count = await prisma.inquiry.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      })
      
      recentTrends.push({
        date: date.toISOString().split('T')[0],
        count
      })
    }

    const analyticsData = {
      totalInquiries,
      conversionRate,
      topSources: topSources.map((s: any) => ({
        source: s.source || 'Direct',
        count: s._count.source
      })),
      inquiriesByType: inquiriesByType.map((t: any) => ({
        type: t.interestType,
        count: t._count.interestType
      })),
      inquiriesByCounty: inquiriesByCounty.map((c: any) => ({
        county: c.county || 'Unknown',
        count: c._count.county
      })),
      recentTrends
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ 
      totalInquiries: 0,
      conversionRate: 0,
      topSources: [],
      inquiriesByType: [],
      inquiriesByCounty: [],
      recentTrends: []
    })
  }
}