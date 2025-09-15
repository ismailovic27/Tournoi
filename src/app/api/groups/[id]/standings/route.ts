import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        teams: true,
        matches: {
          where: { status: 'COMPLETED' },
          include: {
            homeTeam: true,
            awayTeam: true
          }
        }
      }
    })
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }
    
    // Calculate standings
    const standings: Record<string, {
      teamId: string,
      team: string,
      played: number,
      won: number,
      drawn: number,
      lost: number,
      goalsFor: number,
      goalsAgainst: number,
      goalDifference: number,
      points: number
    }> = {}
    
    // Initialize standings
    group.teams.forEach((team: { id: string; name: string }) => {
      standings[team.id] = {
        teamId: team.id,
        team: team.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      }
    })
    
    // Calculate from completed matches
    group.matches.forEach((match: {
      homeTeamId: string;
      awayTeamId: string;
      homeScore: number | null;
      awayScore: number | null;
    }) => {
      if (match.homeScore !== null && match.awayScore !== null) {
        const homeTeamId = match.homeTeamId
        const awayTeamId = match.awayTeamId
        
        standings[homeTeamId].played++
        standings[awayTeamId].played++
        
        standings[homeTeamId].goalsFor += match.homeScore
        standings[homeTeamId].goalsAgainst += match.awayScore
        standings[awayTeamId].goalsFor += match.awayScore
        standings[awayTeamId].goalsAgainst += match.homeScore
        
        if (match.homeScore > match.awayScore) {
          standings[homeTeamId].won++
          standings[homeTeamId].points += 3
          standings[awayTeamId].lost++
        } else if (match.homeScore < match.awayScore) {
          standings[awayTeamId].won++
          standings[awayTeamId].points += 3
          standings[homeTeamId].lost++
        } else {
          standings[homeTeamId].drawn++
          standings[awayTeamId].drawn++
          standings[homeTeamId].points += 1
          standings[awayTeamId].points += 1
        }
        
        standings[homeTeamId].goalDifference = standings[homeTeamId].goalsFor - standings[homeTeamId].goalsAgainst
        standings[awayTeamId].goalDifference = standings[awayTeamId].goalsFor - standings[awayTeamId].goalsAgainst
      }
    })
    
    // Sort by points, then goal difference, then goals for
    const sortedStandings = Object.values(standings).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })
    
    return NextResponse.json({
      group,
      standings: sortedStandings
    })
  } catch (error) {
    console.error('Failed to fetch group standings:', error);
    return NextResponse.json({ error: 'Failed to fetch group standings' }, { status: 500 })
  }
}