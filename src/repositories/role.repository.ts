import {
  DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Role, RoleRelations, UserRole} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRoleRepository} from './user-role.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.Id,
  RoleRelations
> {

  public readonly UserRoles: HasManyRepositoryFactory<UserRole, typeof Role.prototype.Id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRoleRepository') protected userRoleRepositoryGetter: Getter<UserRoleRepository>,
  ) {
    super(Role, dataSource);
    this.UserRoles = this.createHasManyRepositoryFactoryFor('UserRoles', userRoleRepositoryGetter,);
    this.registerInclusionResolver('UserRoles', this.UserRoles.inclusionResolver);
  }
}
