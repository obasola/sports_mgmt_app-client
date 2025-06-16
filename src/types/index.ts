// src/types/index.ts
export interface Player {
  id?: number
  firstName: string
  lastName: string
  age: number
  height: number
  weight: number
  handSize: number
  armLength: number
  homeCity: string
  homeState: string
  university: string
  yearEnteredLeague: Date
  position: string
  team?: Team
  awards?: PlayerAward[]
  pick?: DraftPick
  combineScore?: CombineScore
}

export interface PlayerAward {
  id?: number | undefined
  playerId: number | undefined
  awardName: string
  awardYear: number
  awardDescription?: string
}

// src/types/playerTeam.ts
// Actual PlayerTeam interface from server
export interface PlayerTeam {
  id: number
  playerId: number
  teamId: number
  currentTeam: boolean
  startDate: Date 
  endDate: Date | undefined
}

// For create operations (omits id and handles optional endDate)
export interface CreatePlayerTeam {
  playerId: number
  teamId: number
  currentTeam: boolean
  startDate: Date
  endDate?: Date
}


export interface Prospect {
  id?: number
  firstName: string
  lastName: string
  position: string
  college: string
  height: number
  weight: number
  handSize?: number
  armLength?: number
  homeCity?: string
  homeState?: string
  fortyTime?: number
  tenYardSplit?: number
  verticalLeap?: number
  broadJump?: number
  threeCone?: number
  twentyYardShuttle?: number
  benchPress?: number
  drafted: boolean
  draftYear?: number
  teamId?: number
  draftPickId?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface Team {
  id?: number
  name: string
  city: string
  state: string
  conference: string
  division: string
  stadium: string
  country: string
  scheduleId?: number
}

export interface TeamNeed {
  id: number
  teamId: number
  draftYear: Date
  position: string
  priority: number
  createdDate: Date
  updatedAt: Date
}

export interface PostSeasonResult {
  id: number
  playoffYear: number
  lastRoundReached?: string
  winLose?: string
  opponentScore?: number
  teamScore?: number
  teamId?: number
}

export interface Schedule {
  id?: number
  teamId?: number
  seasonYear: string
  oppTeamId: number
  oppTeamConference?: string
  oppTeamDivision?: string
  scheduleWeek?: number
  gameDate?: Date
  gameCity?: string
  gameStateProvince?: string
  gameCountry?: string
  gameLocation?: string
  wonLostFlag?: string
  homeOrAway?: string
  oppTeamScore?: number
  teamScore: number
  result?: string
}

export interface DraftPick {
  id?: number
  draftYear: number
  round: number
  pickNumber: number
  playerId?: number
  teamId: number | undefined
  playerFirstName?: string
  playerLastName?: string
  pickFrom: number
  pickTo: number
  combineScore: number
}

export interface CombineScore {
  id?: number
  playerId: number
  fortyTime: number
  tenYardSplit: number
  verticalLeap: number
  broadJump: number
  threeCone: number
  twentyYardShuttle: number
  benchPress: number
}

export type CrudMode = 'read' | 'create' | 'edit' | 'delete'
