import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {CategoryType, CategoryTypeRelations, ContentType} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ContentTypeRepository} from './content-type.repository';

export class CategoryTypeRepository extends DefaultCrudRepository<
  CategoryType,
  typeof CategoryType.prototype.Id,
  CategoryTypeRelations
> {
  public readonly contentTypes: HasManyRepositoryFactory<
    ContentType,
    typeof CategoryType.prototype.Id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ContentTypeRepository')
    protected contentTypeRepositoryGetter: Getter<ContentTypeRepository>,
  ) {
    super(CategoryType, dataSource);
    this.contentTypes = this.createHasManyRepositoryFactoryFor(
      'contentTypes',
      contentTypeRepositoryGetter,
    );
    this.registerInclusionResolver(
      'contentTypes',
      this.contentTypes.inclusionResolver,
    );
  }
}
