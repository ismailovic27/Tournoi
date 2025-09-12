import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true,
        group: true,
        tournament: true
      },
      orderBy: [
        { matchday: 'asc' },
        { createdAt: 'asc' }
      ]
    })
    return NextResponse.json(matches)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tournamentId, homeTeamId, awayTeamId, groupId, matchday } = body
    
    const match = await prisma.match.create({
      data: {
        tournamentId,
        homeTeamId,
        awayTeamId,
        groupId,
        matchday,
        status: 'SCHEDULED'
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        group: true
      }
    })
    
    return NextResponse.json(match)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 })
  }
}