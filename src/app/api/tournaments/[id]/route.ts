import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tournament = await prisma.tournament.findUnique({
      where: { id },
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
    console.error('Failed to fetch tournament:', error);
    return NextResponse.json({ error: 'Failed to fetch tournament' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    const { name, description, status } = body
    
    const tournament = await prisma.tournament.update({
      where: { id },
      data: {
        name,
        description,
        status
      }
    })
    
    return NextResponse.json(tournament)
  } catch (error) {
    console.error('Failed to update tournament:', error);
    return NextResponse.json({ error: 'Failed to update tournament' }, { status: 500 })
  }
}