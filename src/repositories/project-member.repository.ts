import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {ProjectMember, ProjectMemberRelations, Project, UserRole} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProjectRepository} from './project.repository';
import {UserRepository} from './user.repository';
import {UserRoleRepository} from './user-role.repository';

export class ProjectMemberRepository extends DefaultCrudRepository<
  ProjectMember,
  typeof ProjectMember.prototype.Id,
  ProjectMemberRelations
> {
  public readonly Project: BelongsToAccessor<
    Project,
    typeof ProjectMember.prototype.Id
  >;

  public readonly UserRole: BelongsToAccessor<UserRole, typeof ProjectMember.prototype.Id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProjectRepository')
    protected projectRepositoryGetter: Getter<ProjectRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('UserRoleRepository') protected userRoleRepositoryGetter: Getter<UserRoleRepository>,
  ) {
    super(ProjectMember, dataSource);
    this.UserRole = this.createBelongsToAccessorFor('UserRole', userRoleRepositoryGetter,);
    this.registerInclusionResolver('UserRole', this.UserRole.inclusionResolver);
    this.Project = this.createBelongsToAccessorFor(
      'Project',
      projectRepositoryGetter,
    );
    this.registerInclusionResolver('Project', this.Project.inclusionResolver);
  }
}
