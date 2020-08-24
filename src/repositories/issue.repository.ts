import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
  BelongsToAccessor,
} from '@loopback/repository';
import {Issue, IssueRelations, IssueType, Project, User} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {IssueTypeRepository} from './issue-type.repository';
import {ProjectRepository} from './project.repository';
import {UserRepository} from './user.repository';

export class IssueRepository extends DefaultCrudRepository<
  Issue,
  typeof Issue.prototype.Id,
  IssueRelations
> {
  public readonly IssueTypes: HasManyRepositoryFactory<
    IssueType,
    typeof Issue.prototype.Id
  >;

  public readonly IssueParent: BelongsToAccessor<
    Issue,
    typeof Issue.prototype.Id
  >;

  public readonly Project: BelongsToAccessor<
    Project,
    typeof Issue.prototype.Id
  >;

  public readonly UserCreated: BelongsToAccessor<
    User,
    typeof Issue.prototype.Id
  >;

  public readonly Assignee: BelongsToAccessor<User, typeof Issue.prototype.Id>;

  public readonly IssuesChildren: HasManyRepositoryFactory<
    Issue,
    typeof Issue.prototype.Id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('IssueTypeRepository')
    protected issueTypeRepositoryGetter: Getter<IssueTypeRepository>,
    @repository.getter('IssueRepository')
    protected issueRepositoryGetter: Getter<IssueRepository>,
    @repository.getter('ProjectRepository')
    protected projectRepositoryGetter: Getter<ProjectRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Issue, dataSource);
    this.IssuesChildren = this.createHasManyRepositoryFactoryFor(
      'IssuesChildren',
      issueRepositoryGetter,
    );
    this.registerInclusionResolver(
      'IssuesChildren',
      this.IssuesChildren.inclusionResolver,
    );
    this.Assignee = this.createBelongsToAccessorFor(
      'Assignee',
      userRepositoryGetter,
    );
    this.registerInclusionResolver('Assignee', this.Assignee.inclusionResolver);
    this.UserCreated = this.createBelongsToAccessorFor(
      'UserCreated',
      userRepositoryGetter,
    );
    this.registerInclusionResolver(
      'UserCreated',
      this.UserCreated.inclusionResolver,
    );
    this.Project = this.createBelongsToAccessorFor(
      'Project',
      projectRepositoryGetter,
    );
    this.registerInclusionResolver('Project', this.Project.inclusionResolver);
    this.IssueParent = this.createBelongsToAccessorFor(
      'IssueParent',
      issueRepositoryGetter,
    );
    this.registerInclusionResolver(
      'IssueParent',
      this.IssueParent.inclusionResolver,
    );
    this.IssueTypes = this.createHasManyRepositoryFactoryFor(
      'IssueTypes',
      issueTypeRepositoryGetter,
    );
    this.registerInclusionResolver(
      'IssueTypes',
      this.IssueTypes.inclusionResolver,
    );
  }
}
