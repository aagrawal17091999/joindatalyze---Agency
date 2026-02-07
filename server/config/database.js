import db from '../models/index.js';

const { sequelize, User, Contact } = db;

/** @deprecated Use models (User, Contact) or sequelize. For compatibility, returns sequelize. */
export function getPool() {
  return sequelize;
}

export async function healthCheck() {
  try {
    await sequelize.authenticate();
    return true;
  } catch (_) {
    return false;
  }
}

export { sequelize, User, Contact };
