import sqlite3 from "sqlite3";
import { open } from "sqlite";

const SFTP_USERNAME = process.env.SFTP_USERNAME;
const filename = SFTP_USERNAME ? `/app/upload/products.db` : "products.db";

class DatabaseConnection {
  static async update() {
    DatabaseConnection.connection = await open({
      filename: filename,
      driver: sqlite3.Database,
    });
  }

  static async get() {
    if (!DatabaseConnection.connection) {
      DatabaseConnection.connection = await open({
        filename: filename,
        driver: sqlite3.Database,
      });
    }
    return DatabaseConnection.connection;
  }
}

export { DatabaseConnection };
