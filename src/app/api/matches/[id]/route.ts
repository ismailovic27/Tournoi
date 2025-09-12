import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { homeScore, awayScore, status } = body
    
    const match = await prisma.match.update({
      where: { id: params.id },
      data: {
        homeScore,
        awayScore,
        status,
        playedAt: status === 'COMPLETED' ? new Date() : null
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        group: true
      }
    })
    
    // If match is completed, update group standings
    if (status === 'COMPLETED' && match.groupId) {
      await updateGroupStandings(match.groupId)
    }
    
    return NextResponse.json(match)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update match' }, { status: 500 })
  }
}

async function updateGroupStandings(groupId: string) {
  // Get all completed matches in the group
  const matches = await prisma.match.findMany({
    where: {
      groupId,
      status: 'COMPLETED'
    },
    include: {
      homeTeam: true,
      awayTeam: true
    }
  })
  
  // Calculate standings (this is a simplified version)
  const standings: Record<string, {
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
  
  // Initialize standings for all teams in the group
  const teams = await prisma.team.findMany({ where: { groupId } })
  teams.forEach(team => {
    standings[team.id] = {
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
  
  // Calculate standings from matches
  matches.forEach(match => {
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
  
  // Here you could store standings in a separate table if needed
  // For now, we'll just return the calculated standings
  return standings
}