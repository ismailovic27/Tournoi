import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
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
    
    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
    }
    
    return NextResponse.json(tournament)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tournament' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, status } = body
    
    const tournament = await prisma.tournament.update({
      where: { id: params.id },
      data: {
        name,
        description,
        status
      }
    })
    
    return NextResponse.json(tournament)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tournament' }, { status: 500 })
  }
}