

// src/domain/models/Team.ts
export interface Team {
  id?: number
  name: string // This can be a concatenation of firstName and lastName
  city: string
  state: string
  conference: string
  division: string
  stadium: string
  country: string
  scheduleId: number
}

