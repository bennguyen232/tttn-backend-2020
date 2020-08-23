import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Sprint, SprintRelations, Issue} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {IssueRepository} from './issue.repository';

export class SprintRepository extends DefaultCrudRepository<
  Sprint,
  typeof Sprint.prototype.Id,
  SprintRelations
> {

  public readonly Issues: HasManyRepositoryFactory<Issue, typeof Sprint.prototype.Id>;

  constructor(@inject('datasources.db') dataSource: DbDataSource, @repository.getter('IssueRepository') protected issueRepositoryGetter: Getter<IssueRepository>,) {
    super(Sprint, dataSource);
    this.Issues = this.createHasManyRepositoryFactoryFor('Issues', issueRepositoryGetter,);
    this.registerInclusionResolver('Issues', this.Issues.inclusionResolver);
  }
}
