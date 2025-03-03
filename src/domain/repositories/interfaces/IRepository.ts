
// src/core/domain/interfaces/IRepository.ts
export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: number, entity: T): Promise<T>;
  delete(id: number): Promise<boolean>;
}
