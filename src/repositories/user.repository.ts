import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, UserRole} from '../models';
import {UserRoleRepository} from './user-role.repository';
import {ProjectMemberRepository} from './project-member.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.Id,
  UserRelations
> {
  public readonly UserRoles: HasManyRepositoryFactory<
    UserRole,
    typeof User.prototype.Id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRoleRepository')
    protected userRoleRepositoryGetter: Getter<UserRoleRepository>,
    @repository.getter('ProjectMemberRepository')
    protected projectMemberRepositoryGetter: Getter<ProjectMemberRepository>,
  ) {
    super(User, dataSource);
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
