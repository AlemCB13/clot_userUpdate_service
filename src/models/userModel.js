const mysql = require("mysql2/promise");

class Database {
  constructor() {
    if (!Database.instance) {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      Database.instance = this;
    }
    return Database.instance;
  }

  async updateUser(id, name, email, password) {
    const [result] = await this.pool.query(
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, password, id]
    );
    return result;
  }
}

const dbInstance = new Database();

module.exports = {
  updateUserDB: (id, name, email, password) => dbInstance.updateUser(id, name, email, password),
};