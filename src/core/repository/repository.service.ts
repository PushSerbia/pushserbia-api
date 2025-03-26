import {
  DeepPartial,
  FindOptionsWhere,
  InsertResult,
  Repository,
} from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class RepositoryService<T extends { id: string | number }> {
  protected abstract get repository(): Repository<T>;

  async create(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity).catch((error) => {
      if (error.code === '23505') {
        throw new BadRequestException({ message: [error.detail] });
      }
      throw error;
    });
  }

  async createMany(
    entities: QueryDeepPartialEntity<T>[],
  ): Promise<InsertResult> {
    return this.repository.insert(entities);
  }

  async findAll(options?: any): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOne(id: string | number): Promise<T> {
    const entity = await this.repository.findOneBy({
      id,
    } as FindOptionsWhere<T>);
    if (!entity) {
      throw new BadRequestException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async findOneBy(query: Partial<T>): Promise<T | null> {
    return this.repository.findOneBy(query as FindOptionsWhere<T>);
  }

  async update(
    criteria: string | number | Partial<T>,
    entity: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    await this.repository.update(
      criteria as string | number | FindOptionsWhere<T>,
      entity,
    );
    return typeof criteria === 'string' || typeof criteria === 'number'
      ? this.findOne(criteria)
      : this.repository
          .findOneBy(criteria as FindOptionsWhere<T>)
          .then((result) => {
            if (!result) {
              throw new BadRequestException(`Entity not found`);
            }
            return result;
          });
  }

  async remove(criteria: string | number | Partial<T>): Promise<void> {
    if (typeof criteria === 'string' || typeof criteria === 'number') {
      await this.repository.delete(criteria);
    } else {
      await this.repository.delete(criteria as FindOptionsWhere<T>);
    }
  }
}
