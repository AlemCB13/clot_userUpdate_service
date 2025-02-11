const mysql = require("mysql2/promise");

class Database {
  constructor() {
    if (!Database.instance) {
      this.pool = null;
      Database.instance = this;
    }
    return Database.instance;
  }

  async connectWithRetry(retries = 5, delay = 5000) {
    while (retries > 0) {
      try {
        this.pool = mysql.createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });
        console.log("Connected to MySQL");
        return;
      } catch (error) {
        console.error(`Error connecting to MySQL, retrying in ${delay / 1000} seconds...`);
        retries--;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error("Failed to connect to MySQL after multiple retries.");
  }

  async updateUser(id, name, email, password) {
    if (!this.pool) await this.connectWithRetry();
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
