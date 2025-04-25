// src/domain/services/errors/DomainError.ts
/**
 * Base class for domain-specific errors
 */
export class DomainError extends Error {
    constructor(message: string) {
      super(message);
      this.name = this.constructor.name;
    }
  }
  
  // src/domain/services/index.ts
  export * from '../BaseService';
  export * from '../PlayerService';
  export * from '../TeamService';
  export * from '../PlayerAwardService';
  export * from '../DraftPickService';
  export * from '../CombineScoreService';
  export * from '../ScheduleService';
  export * from '../errors/DomainError';