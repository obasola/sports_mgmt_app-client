
  // src/domain/services/BaseService.ts

import { IBaseRepository } from "@/repositories/interfaces/IBaseRepository";

 
  /**
   * Base service that provides common CRUD operations
   */
  export abstract class BaseService<T, R extends IBaseRepository<T>> {
    constructor(protected repository: R) {}
  
    /**
     * Get all entities
     */
    async getAll(): Promise<T[]> {
      return this.repository.getAll();
    }
  
    /**
     * Get entity by ID
     */
    async getById(id: number): Promise<T> {
      return this.repository.getById(id);
    }
  
    /**
     * Create a new entity
     * This should be overridden by specific services to add validation and business rules
     */
    async create(item: T): Promise<T> {
      return this.repository.create(item);
    }
  
    /**
     * Update an existing entity
     * This should be overridden by specific services to add validation and business rules
     */
    async update(id: number, item: T): Promise<T> {
      return this.repository.update(id, item);
    }
  
    /**
     * Delete an entity
     */
    async delete(id: number): Promise<void> {
      return this.repository.delete(id);
    }
  }
  