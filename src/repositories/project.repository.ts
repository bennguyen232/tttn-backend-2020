import {DefaultCrudRepository} from '@loopback/repository';
import {Project, ProjectRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.Id,
  ProjectRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Project, dataSource);
  }
}
