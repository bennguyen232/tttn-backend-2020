import {DefaultCrudRepository} from '@loopback/repository';
import {inject} from '@loopback/core';
import {Configuration} from '../../domain/models/configuration.model';
import {DbDataSource} from '../datasources';

export class ConfigurationRepository extends DefaultCrudRepository<
  Configuration,
  typeof Configuration.prototype.id
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Configuration, dataSource);
  }
}
