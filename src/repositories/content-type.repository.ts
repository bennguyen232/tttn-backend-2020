import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {ContentType, ContentTypeRelations, CategoryType} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CategoryTypeRepository} from './category-type.repository';

export class ContentTypeRepository extends DefaultCrudRepository<
  ContentType,
  typeof ContentType.prototype.Id,
  ContentTypeRelations
> {
  public readonly CategoryType: BelongsToAccessor<CategoryType, typeof ContentType.prototype.Id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CategoryTypeRepository') protected categoryTypeRepositoryGetter: Getter<CategoryTypeRepository>,
  ) {
    super(ContentType, dataSource);
    this.CategoryType = this.createBelongsToAccessorFor('CategoryType', categoryTypeRepositoryGetter,);
    this.registerInclusionResolver('CategoryType', this.CategoryType.inclusionResolver);
  }
}
