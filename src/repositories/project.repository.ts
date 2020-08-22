import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Project, ProjectRelations, ProjectMember} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProjectMemberRepository} from './project-member.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.Id,
  ProjectRelations
> {

  public readonly ProjectMembers: HasManyRepositoryFactory<ProjectMember, typeof Project.prototype.Id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProjectMemberRepository') protected projectMemberRepositoryGetter: Getter<ProjectMemberRepository>,
  ) {
    super(Project, dataSource);
    this.ProjectMembers = this.createHasManyRepositoryFactoryFor('ProjectMembers', projectMemberRepositoryGetter,);
    this.registerInclusionResolver('ProjectMembers', this.ProjectMembers.inclusionResolver);
  }
}
