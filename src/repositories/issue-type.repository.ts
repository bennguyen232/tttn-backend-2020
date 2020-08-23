import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {IssueType, IssueTypeRelations, ContentTypeDetail, Issue} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ContentTypeDetailRepository} from './content-type-detail.repository';
import {IssueRepository} from './issue.repository';

export class IssueTypeRepository extends DefaultCrudRepository<
  IssueType,
  typeof IssueType.prototype.Id,
  IssueTypeRelations
> {

  public readonly ContentTypeDetail: BelongsToAccessor<ContentTypeDetail, typeof IssueType.prototype.Id>;

  public readonly Issue: BelongsToAccessor<Issue, typeof IssueType.prototype.Id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ContentTypeDetailRepository') protected contentTypeDetailRepositoryGetter: Getter<ContentTypeDetailRepository>, @repository.getter('IssueRepository') protected issueRepositoryGetter: Getter<IssueRepository>,
  ) {
    super(IssueType, dataSource);
    this.Issue = this.createBelongsToAccessorFor('Issue', issueRepositoryGetter,);
    this.registerInclusionResolver('Issue', this.Issue.inclusionResolver);
    this.ContentTypeDetail = this.createBelongsToAccessorFor('ContentTypeDetail', contentTypeDetailRepositoryGetter,);
    this.registerInclusionResolver('ContentTypeDetail', this.ContentTypeDetail.inclusionResolver);
  }
}
