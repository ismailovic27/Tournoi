import axios from 'axios';

// Configure the base URL for your Next.js API
const BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'DRAW_PHASE' | 'GROUP_PHASE' | 'KNOCKOUT_PHASE' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  teams: Team[];
  groups: Group[];
  matches: Match[];
}

export interface Team {
  id: string;
  name: string;
  pot?: number;
  tournamentId: string;
  groupId?: string;
}

export interface Group {
  id: string;
  name: string;
  tournamentId: string;
  teams: Team[];
  matches: Match[];
}

export interface Match {
  id: string;
  tournamentId: string;
  groupId?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'POSTPONED' | 'CANCELLED';
  matchday?: number;
  playedAt?: string;
  createdAt: string;
  updatedAt: string;
  homeTeam: Team;
  awayTeam: Team;
  group?: Group;
}

export interface GroupStanding {
  teamId: string;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export const apiService = {
  // Tournament endpoints
  getTournaments: async (): Promise<Tournament[]> => {
    const response = await api.get('/tournaments');
    return response.data;
  },

  getTournament: async (id: string): Promise<Tournament> => {
    const response = await api.get(`/tournaments/${id}`);
    return response.data;
  },

  createTournament: async (data: { name: string; description?: string }): Promise<Tournament> => {
    const response = await api.post('/tournaments', data);
    return response.data;
  },

  completeDraw: async (tournamentId: string, data: { teams: unknown[]; groups: unknown[] }) => {
    const response = await api.post(`/tournaments/${tournamentId}/complete-draw`, data);
    return response.data;
  },

  // Match endpoints
  getMatches: async (): Promise<Match[]> => {
    const response = await api.get('/matches');
    return response.data;
  },

  updateMatch: async (id: string, data: { homeScore?: number; awayScore?: number; status?: string }): Promise<Match> => {
    const response = await api.put(`/matches/${id}`, data);
    return response.data;
  },

  // Group standings
  getGroupStandings: async (groupId: string): Promise<{ group: Group; standings: GroupStanding[] }> => {
    const response = await api.get(`/groups/${groupId}/standings`);
    return response.data;
  },
};

export default apiService;