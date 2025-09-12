import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        teams: true,
        groups: {
          include: {
            teams: true
          }
        },
        matches: {
          include: {
            homeTeam: true,
            awayTeam: true,
            group: true
          }
        }
      }
    })
    return NextResponse.json(tournaments)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body
    
    const tournament = await prisma.tournament.create({
      data: {
        name,
        description
      }
    })
    
    return NextResponse.json(tournament)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 })
  }
}