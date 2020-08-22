import {DefaultCrudRepository} from '@loopback/repository';
import {IssueType, IssueTypeRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class IssueTypeRepository extends DefaultCrudRepository<
  IssueType,
  typeof IssueType.prototype.Id,
  IssueTypeRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(IssueType, dataSource);
  }
}
