import {inject} from '@loopback/core';
import {DbDataSource} from '../datasources';
import {TimestampRepository} from './mixin/timestamp.mixin';
import {Task} from '../../domain/models/task.model';

export class TaskRepository extends TimestampRepository<
  Task,
  typeof Task.prototype.id
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Task, dataSource);
  }
}
