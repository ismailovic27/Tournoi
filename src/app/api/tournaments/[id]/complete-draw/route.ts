import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { teams, groups } = body
    
    // Create groups
    const createdGroups = await Promise.all(
      groups.map((group: any) =>
        prisma.group.create({
          data: {
            name: group.name,
            tournamentId: params.id
          }
        })
      )
    )
    
    // Create teams and assign to groups
    await Promise.all(
      teams.map((team: any, teamIndex: number) =>
        prisma.team.create({
          data: {
            name: team.name,
            pot: team.pot,
            tournamentId: params.id,
            groupId: createdGroups[team.groupIndex]?.id
          }
        })
      )
    )
    
    // Generate group stage matches
    for (const group of createdGroups) {
      const groupTeams = await prisma.team.findMany({
        where: { groupId: group.id }
      })
      
      // Create matches for each pair of teams in the group
      for (let i = 0; i < groupTeams.length; i++) {
        for (let j = i + 1; j < groupTeams.length; j++) {
          await prisma.match.create({
            data: {
              tournamentId: params.id,
              groupId: group.id,
              homeTeamId: groupTeams[i].id,
              awayTeamId: groupTeams[j].id,
              matchday: 1, // You can implement proper matchday calculation
              status: 'SCHEDULED'
            }
          })
        }
      }
    }
    
    // Update tournament status
    await prisma.tournament.update({
      where: { id: params.id },
      data: { status: 'GROUP_PHASE' }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Draw completion error:', error)
    return NextResponse.json({ error: 'Failed to complete draw' }, { status: 500 })
  }
}