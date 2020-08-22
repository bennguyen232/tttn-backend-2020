import {DefaultCrudRepository} from '@loopback/repository';
import {Sprint, SprintRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SprintRepository extends DefaultCrudRepository<
  Sprint,
  typeof Sprint.prototype.Id,
  SprintRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Sprint, dataSource);
  }
}
