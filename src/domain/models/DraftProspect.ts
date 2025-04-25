export interface DraftProspect {
  id: number;
  name: string;
  position: string;
  college: string;
  height: string;
  weight: number;
  forty: number;
  bench: number;
  vertical: number;
  broad: number;
  cone: number;
  shuttle: number;
  drafted: boolean;
  round?: number;
  pick?: number;
  teamId?: number;
  }