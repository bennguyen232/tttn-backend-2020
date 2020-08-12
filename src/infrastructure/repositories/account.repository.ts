import {
  juggler,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {inject} from '@loopback/core';
import {Account, AccountRelations} from '../../domain/models/account.model';
import {TimestampRepository} from './mixin/timestamp.mixin';
import {Getter} from '@loopback/context';

export type Credentials = {
  email: string;
  password: string;
};

export namespace UserError {
  export const EMAIL_EXISTED = 'EMAIL_EXISTED';
}

export class AccountRepository extends TimestampRepository<
  Account,
  typeof Account.prototype.id,
  AccountRelations
> {
  // public readonly mealProfiles: HasManyRepositoryFactory<
  //   MealProfile,
  //   typeof Account.prototype.id
  // >;

  constructor(
    @inject('datasources.db') protected datasource: juggler.DataSource,
    // @repository.getter('MealProfileRepository')
    // protected todoRepositoryGetter: Getter<MealProfileRepository>,
  ) {
    super(Account, datasource);

    // this.mealProfiles = this.createHasManyRepositoryFactoryFor(
    //   'mealProfiles',
    //   todoRepositoryGetter,
    // );
    // this.registerInclusionResolver(
    //   'mealProfiles',
    //   this.mealProfiles.inclusionResolver,
    // );
  }
}
