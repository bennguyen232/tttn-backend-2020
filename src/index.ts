import {ApplicationConfig} from '@loopback/core';
import {Application} from './application';

export {Application};

export async function main(options: ApplicationConfig = {}) {
  const app = new Application(options);
  await app.boot();
  await app.start();

  const url = process.env.BASE_URL || 'http://127.0.0.1:3000';
  console.log(`Server is running at ${url}`);

  if (
    !options.rest.openApiSpec.disabled &&
    !options.rest.apiExplorer.disabled
  ) {
    console.log(`API explorer is running at ${url}/api/explorer`);
  }

  return app;
}
