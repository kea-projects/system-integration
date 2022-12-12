import chalk from "chalk";
import "dotenv/config";
import pg from "pg";
import { v4 as uuidv4 } from "uuid";
import { getEnvVar } from "../utils/config.service.js";

let client;

export const initDatabase = async () => {
  // Setup PostgreSQL connection
  client = new pg.Client({
    host: getEnvVar("POSTGRES_HOST", true),
    port: getEnvVar("POSTGRES_PORT", true),
    user: getEnvVar("POSTGRES_USER", true),
    password: getEnvVar("POSTGRES_PASSWORD", true),
    database: getEnvVar("POSTGRES_DATABASE", true),
  });
  client.connect((err) => {
    if (err) {
      console.log(
        chalk.redBright(`[ERROR] Database connection error!`, err.stack)
      );
      console.error("connection error", err.stack);
    } else {
      console.log(
        chalk.greenBright(`[INFO] Connected to PostgreSQL database!`)
      );
    }
  });
  createTables();
};

const createTables = () => {
  client.query(`CREATE TABLE IF NOT EXISTS wishes (
        wish_id VARCHAR,
        product_name VARCHAR,
        user_id VARCHAR
    )`);
};

export const createWish = async (product_name, user_id) => {
  const id = uuidv4();
  await client
    .query(`INSERT INTO wishes VALUES ($1::text, $2::text, $3::text)`, [
      id,
      product_name,
      user_id,
    ])
    .catch((err) => {
      console.log(chalk.redBright(`[ERROR] Failed to create a wish`, err));
    });
  const result = await client
    .query(`SELECT * FROM wishes WHERE wish_id = $1::text`, [id])
    .catch((err) => {
      console.log(chalk.redBright(`[ERROR] Failed to get a created wish`, err));
    });
  return result.rows[0];
};

export const getWishes = async () => {
  const result = await client.query(`SELECT * FROM wishes`).catch((err) => {
    console.log(chalk.redBright(`[ERROR] Failed to fetch wishes`, err));
  });
  return result.rows;
};

export const deleteWish = async (product_name, user_id) => {
  const id = uuidv4();
  const result = await client
    .query(
      `DELETE FROM wishes WHERE product_name = $1::text AND user_id = $2::text`,
      [product_name, user_id]
    )
    .catch((err) => {
      console.log(chalk.redBright(`[ERROR] Failed to delete a wish`, err));
    });
  console.log("result");
  return result;
};
