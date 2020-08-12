import {
  Entity,
  DefaultCrudRepository,
  DataObject,
  Options,
  juggler,
  Where,
  Count,
} from '@loopback/repository';
import {TimestampEntity} from '../../../domain/mixin/timestamp.mixin';

export class TimestampRepository<
  T extends TimestampEntity,
  ID,
  Relation extends Object = {}
> extends DefaultCrudRepository<T, ID, Relation> {
  constructor(
    public entityClass: typeof Entity & {prototype: T},
    public dataSource: juggler.DataSource,
  ) {
    super(entityClass, dataSource);
  }

  async create(entity: DataObject<T>, options?: Options): Promise<T> {
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    return super.create(entity, options);
  }

  async updateAll(
    data: DataObject<T>,
    where?: Where<T>,
    options?: Options,
  ): Promise<Count> {
    data.updatedAt = new Date();
    return super.updateAll(data, where, options);
  }

  async updateById(
    id: ID,
    data: DataObject<T>,
    options?: Options,
  ): Promise<void> {
    data.updatedAt = new Date();
    return super.updateById(id, data, options);
  }

  async replaceById(
    id: ID,
    data: DataObject<T>,
    options?: Options,
  ): Promise<void> {
    data.updatedAt = new Date();
    return super.replaceById(id, data, options);
  }
}
