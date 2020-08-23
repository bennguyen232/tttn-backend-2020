import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, UserRole, Project, Issue} from '../models';
import {UserRoleRepository} from './user-role.repository';
import {ProjectMemberRepository} from './project-member.repository';
import {ProjectRepository} from './project.repository';
import {IssueRepository} from './issue.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.Id,
  UserRelations
> {
  public readonly UserRoles: HasManyRepositoryFactory<
    UserRole,
    typeof User.prototype.Id
  >;

  public readonly ProjectCreators: HasManyRepositoryFactory<Project, typeof User.prototype.Id>;

  public readonly IssueCreators: HasManyRepositoryFactory<Issue, typeof User.prototype.Id>;

  public readonly IssueAssignees: HasManyRepositoryFactory<Issue, typeof User.prototype.Id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRoleRepository')
    protected userRoleRepositoryGetter: Getter<UserRoleRepository>,
    @repository.getter('ProjectMemberRepository')
    protected projectMemberRepositoryGetter: Getter<ProjectMemberRepository>, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('IssueRepository') protected issueRepositoryGetter: Getter<IssueRepository>,
  ) {
    super(User, dataSource);
    this.IssueAssignees = this.createHasManyRepositoryFactoryFor('IssueAssignees', issueRepositoryGetter,);
    this.registerInclusionResolver('IssueAssignees', this.IssueAssignees.inclusionResolver);
    this.IssueCreators = this.createHasManyRepositoryFactoryFor('IssueCreators', issueRepositoryGetter,);
    this.registerInclusionResolver('IssueCreators', this.IssueCreators.inclusionResolver);
    this.ProjectCreators = this.createHasManyRepositoryFactoryFor('ProjectCreators', projectRepositoryGetter,);
    this.registerInclusionResolver('ProjectCreators', this.ProjectCreators.inclusionResolver);
    this.UserRoles = this.createHasManyRepositoryFactoryFor(
      'UserRoles',
      userRoleRepositoryGetter,
    );
    this.registerInclusionResolver(
      'UserRoles',
      this.UserRoles.inclusionResolver,
    );
  }
}
