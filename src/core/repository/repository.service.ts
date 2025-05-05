import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class RepositoryService<T extends { id: string }> {
  protected abstract repository: Repository<T>;

  async create(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
  }

  async findAll(options?: any): Promise<T[]> {
    return this.repository.find(options);
  }

  findById(id: string) {
    return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  findOneBy(query: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
    return this.repository.findOneBy(query);
  }

  async update(
    criteria: string | FindOptionsWhere<T>,
    entity: QueryDeepPartialEntity<T>,
  ) {
    const updated = await this.repository.update(criteria, entity);
    if (updated.affected === 0) {
      throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
    }
    return typeof criteria === 'string'
      ? this.findById(criteria)
      : this.findOneBy(criteria);
  }

  async remove(criteria: string | FindOptionsWhere<T>): Promise<void> {
    await this.repository.delete(criteria);
  }
}
