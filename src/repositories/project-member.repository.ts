import {DefaultCrudRepository} from '@loopback/repository';
import {ProjectMember, ProjectMemberRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProjectMemberRepository extends DefaultCrudRepository<
  ProjectMember,
  typeof ProjectMember.prototype.Id,
  ProjectMemberRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ProjectMember, dataSource);
  }
}
