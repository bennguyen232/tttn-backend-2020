require('dotenv').config();
const application = require('./dist');

module.exports = application;

if (require.main === module) {
  const enableApiExplorer = process.env.ENABLE_API_EXPLORER === 'true';
  const config = {
    rest: {
      port: +process.env.PORT,
      host: process.env.HOST,
      basePath: '/api',
      openApiSpec: {
        disabled: !enableApiExplorer,
        setServersFromRequest: false,
      },
      apiExplorer: {
        disabled: !enableApiExplorer,
        url: `${process.env.BASE_URL}/api`,
      },
    },
  };
  application.main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
