export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { posts, audience, weekStart } = await req.json()
    
    if (!posts || !Array.isArray(posts)) {
      return NextResponse.json({ ok: false, error: 'posts array required' }, { status: 400 })
    }

    const contentPieces = await Promise.all(
      posts.map(async (post: any) => {
        return prisma.contentPiece.create({
          data: {
            title: `${post.day} - ${post.pillar}`,
            content: post.postCopy,
            contentType: 'post',
            platform: post.platform,
            audience: post.audienceSegment,
            pillar: post.pillar,
            status: 'draft',
            ctaType: post.ctaType,
            scheduledDate: new Date(weekStart)
          }
        })
      })
    )

    return NextResponse.json({ 
      ok: true, 
      created: contentPieces.length,
      ids: contentPieces.map((cp: { id: string }) => cp.id)
    })
  } catch (error) {
    console.error('Error saving social content:', error)
    return NextResponse.json({ ok: false, error: 'Failed to save content' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'draft'
    const platform = searchParams.get('platform')
    const audience = searchParams.get('audience')

    const where: any = { status }
    if (platform) where.platform = { contains: platform }
    if (audience) where.audience = { contains: audience }

    const contentPieces = await prisma.contentPiece.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ ok: true, items: contentPieces })
  } catch (error) {
    console.error('Error fetching social content:', error)
    return NextResponse.json({ ok: false, error: 'Failed to fetch content' }, { status: 500 })
  }
}