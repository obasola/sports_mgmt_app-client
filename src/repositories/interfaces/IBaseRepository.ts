// src/domain/repositories/interfaces/IBaseRepository.ts
/**
 * Base repository interface that defines common CRUD operations
 */
export interface IBaseRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T>;
  create(item: T): Promise<T>;
  update(id: number, item: T): Promise<T>;
  delete(id: number): Promise<void>;
}

