import {inject} from '@loopback/core';
import {juggler, AnyObject} from '@loopback/repository';

const config = require('./datasource.config');

export class DbDataSource extends juggler.DataSource {
  static dataSourceName = 'db';

  constructor(
    @inject('datasources.config', {optional: true})
    dsConfig: AnyObject = config.mongo,
  ) {
    super(dsConfig);
  }
}
