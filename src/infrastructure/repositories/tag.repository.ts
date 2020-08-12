import {inject} from '@loopback/core';
import {DbDataSource} from '../datasources';
import {TimestampRepository} from './mixin/timestamp.mixin';
import {Tag} from '../../domain/models';

export class TagRepository extends TimestampRepository<
  Tag,
  typeof Tag.prototype.id
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Tag, dataSource);
  }
}
