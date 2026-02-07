/**
 * Sequelize CLI config (CommonJS). Reads from env.
 * Used by: npx sequelize-cli db:migrate
 */
require('dotenv').config();

function getSequelizeConfig() {
  const url = process.env.DATABASE_URL;
  if (url && url.startsWith('mysql')) {
    try {
      const u = new URL(url);
      return {
        username: u.username,
        password: u.password,
        database: u.pathname.replace(/^\//, '') || 'datalyze',
        host: u.hostname,
        port: parseInt(u.port || '3306', 10),
        dialect: 'mysql',
        logging: false,
      };
    } catch (_) {}
  }
  return {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'datalyze',
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    dialect: 'mysql',
    logging: false,
  };
}

const config = getSequelizeConfig();

module.exports = {
  development: config,
  test: { ...config, database: config.database + '_test' },
  production: config,
};
