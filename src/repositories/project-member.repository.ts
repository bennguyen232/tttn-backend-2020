import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {ProjectMember, ProjectMemberRelations, Project, User} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProjectRepository} from './project.repository';
import {UserRepository} from './user.repository';

export class ProjectMemberRepository extends DefaultCrudRepository<
  ProjectMember,
  typeof ProjectMember.prototype.Id,
  ProjectMemberRelations
> {

  public readonly Project: BelongsToAccessor<Project, typeof ProjectMember.prototype.Id>;

  public readonly User: BelongsToAccessor<User, typeof ProjectMember.prototype.Id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(ProjectMember, dataSource);
    this.User = this.createBelongsToAccessorFor('User', userRepositoryGetter,);
    this.registerInclusionResolver('User', this.User.inclusionResolver);
    this.Project = this.createBelongsToAccessorFor('Project', projectRepositoryGetter,);
    this.registerInclusionResolver('Project', this.Project.inclusionResolver);
  }
}
