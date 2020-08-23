import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {ContentTypeDetail, ContentTypeDetailRelations, ContentType, Project, IssueType} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ContentTypeRepository} from './content-type.repository';
import {ProjectRepository} from './project.repository';
import {IssueTypeRepository} from './issue-type.repository';

export class ContentTypeDetailRepository extends DefaultCrudRepository<
  ContentTypeDetail,
  typeof ContentTypeDetail.prototype.Id,
  ContentTypeDetailRelations
> {

  public readonly ContentType: BelongsToAccessor<ContentType, typeof ContentTypeDetail.prototype.Id>;

  public readonly Project: BelongsToAccessor<Project, typeof ContentTypeDetail.prototype.Id>;

  public readonly IssueTypes: HasManyRepositoryFactory<IssueType, typeof ContentTypeDetail.prototype.Id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ContentTypeRepository') protected contentTypeRepositoryGetter: Getter<ContentTypeRepository>, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('IssueTypeRepository') protected issueTypeRepositoryGetter: Getter<IssueTypeRepository>,
  ) {
    super(ContentTypeDetail, dataSource);
    this.IssueTypes = this.createHasManyRepositoryFactoryFor('IssueTypes', issueTypeRepositoryGetter,);
    this.registerInclusionResolver('IssueTypes', this.IssueTypes.inclusionResolver);
    this.Project = this.createBelongsToAccessorFor('Project', projectRepositoryGetter,);
    this.registerInclusionResolver('Project', this.Project.inclusionResolver);
    this.ContentType = this.createBelongsToAccessorFor('ContentType', contentTypeRepositoryGetter,);
    this.registerInclusionResolver('ContentType', this.ContentType.inclusionResolver);
  }
}
