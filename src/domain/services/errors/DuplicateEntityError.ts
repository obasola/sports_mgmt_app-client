import { DomainError } from "./DomainError";

/**
   * Error thrown when a duplicate entity is detected
   */
  export class DuplicateEntityError extends DomainError {
    constructor(
      message: string,
      public readonly entityType: string,
      public readonly existingId?: number
    ) {
      super(message);
    }
  }