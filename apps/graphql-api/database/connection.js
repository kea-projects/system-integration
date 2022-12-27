import sqlite3 from "sqlite3";
import { open } from "sqlite";

const SFTP_USERNAME = process.env.SFTP_USERNAME;
const filename = SFTP_USERNAME ? `/app/upload/products.db` : "products.db";

/** Class to manage the DB connection in a singleton like  manner */
class DatabaseConnection {
  /**
   * Constructor throws errors when called to prevent new instances of DatabaseConnection being created.
   */
  constructor() {
    throw new Error("Use DatabaseConnection.get()");
  }

  /**
   * Creates a new connection with the file from disk, and sets that connection to the class' connection attribute.
   */
  static async update() {
    DatabaseConnection.connection = await open({
      filename: filename,
      driver: sqlite3.Database,
    });
  }

  /**
   * Returns a database connection instance.
   *
   * If the instance does not exist, it creates it. If it does exist, it retrieves it instead.
   * Ensures that there is only ever one instance of the connection.
   * @returns {Promise<Database>} Database connection object
   */
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
