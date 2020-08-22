import {DefaultCrudRepository} from '@loopback/repository';
import {ContentTypeDetail, ContentTypeDetailRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ContentTypeDetailRepository extends DefaultCrudRepository<
  ContentTypeDetail,
  typeof ContentTypeDetail.prototype.Id,
  ContentTypeDetailRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ContentTypeDetail, dataSource);
  }
}
