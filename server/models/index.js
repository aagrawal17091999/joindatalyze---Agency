import Sequelize from 'sequelize';
import User from './User.js';
import Contact from './Contact.js';

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
        logging: process.env.NODE_ENV === 'development' ? false : false,
        pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
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
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  };
}

const config = getSequelizeConfig();
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: config.logging,
  pool: config.pool,
  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const db = {
  User: User(sequelize, Sequelize.DataTypes),
  Contact: Contact(sequelize, Sequelize.DataTypes),
  sequelize,
};

db.Contact.belongsTo(db.User, { foreignKey: 'user_id' });
db.User.hasMany(db.Contact, { foreignKey: 'user_id' });

export default db;
export { sequelize };
