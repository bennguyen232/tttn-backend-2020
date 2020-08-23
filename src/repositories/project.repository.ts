import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
  BelongsToAccessor,
} from '@loopback/repository';
import {
  Project,
  ProjectRelations,
  ProjectMember,
  ContentTypeDetail,
  User,
  Issue,
  UserRole,
} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProjectMemberRepository} from './project-member.repository';
import {ContentTypeDetailRepository} from './content-type-detail.repository';
import {UserRepository} from './user.repository';
import {IssueRepository} from './issue.repository';
import {UserRoleRepository} from './user-role.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.Id,
  ProjectRelations
> {
  public readonly ProjectMembers: HasManyRepositoryFactory<
    ProjectMember,
    typeof Project.prototype.Id
  >;

  public readonly ContentTypeDetails: HasManyRepositoryFactory<
    ContentTypeDetail,
    typeof Project.prototype.Id
  >;

  public readonly UserCreated: BelongsToAccessor<
    User,
    typeof Project.prototype.Id
  >;

  public readonly Issues: HasManyRepositoryFactory<
    Issue,
    typeof Project.prototype.Id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProjectMemberRepository')
    protected projectMemberRepositoryGetter: Getter<ProjectMemberRepository>,
    @repository.getter('ContentTypeDetailRepository')
    protected contentTypeDetailRepositoryGetter: Getter<
      ContentTypeDetailRepository
    >,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('IssueRepository')
    protected issueRepositoryGetter: Getter<IssueRepository>,
    @repository.getter('UserRoleRepository')
    protected userRoleRepositoryGetter: Getter<UserRoleRepository>,
  ) {
    super(Project, dataSource);
    this.Issues = this.createHasManyRepositoryFactoryFor(
      'Issues',
      issueRepositoryGetter,
    );
    this.registerInclusionResolver('Issues', this.Issues.inclusionResolver);
    this.UserCreated = this.createBelongsToAccessorFor(
      'UserCreated',
      userRepositoryGetter,
    );
    this.registerInclusionResolver(
      'UserCreated',
      this.UserCreated.inclusionResolver,
    );
    this.ContentTypeDetails = this.createHasManyRepositoryFactoryFor(
      'ContentTypeDetails',
      contentTypeDetailRepositoryGetter,
    );
    this.registerInclusionResolver(
      'ContentTypeDetails',
      this.ContentTypeDetails.inclusionResolver,
    );
    this.ProjectMembers = this.createHasManyRepositoryFactoryFor(
      'ProjectMembers',
      projectMemberRepositoryGetter,
    );
    this.registerInclusionResolver(
      'ProjectMembers',
      this.ProjectMembers.inclusionResolver,
    );
  }
}
