import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {UserRole, UserRoleRelations, Role, User} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {RoleRepository} from './role.repository';
import {UserRepository} from './user.repository';

export class UserRoleRepository extends DefaultCrudRepository<
  UserRole,
  typeof UserRole.prototype.Id,
  UserRoleRelations
> {

  public readonly Role: BelongsToAccessor<Role, typeof UserRole.prototype.Id>;

  public readonly User: BelongsToAccessor<User, typeof UserRole.prototype.Id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserRole, dataSource);
    this.User = this.createBelongsToAccessorFor('User', userRepositoryGetter,);
    this.registerInclusionResolver('User', this.User.inclusionResolver);
    this.Role = this.createBelongsToAccessorFor('Role', roleRepositoryGetter,);
    this.registerInclusionResolver('Role', this.Role.inclusionResolver);
  }
}
