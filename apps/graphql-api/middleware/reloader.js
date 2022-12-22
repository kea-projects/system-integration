import fs from "fs";
import { DatabaseConnection } from "../database/connection.js";
import {Request, Response, NextFunction} from "express"

/**
 * Middleware to reload the DB connection if products.db has been modified.
 * 
 * The middleware compares the global updatedAt variable with the one from file
 * storage. If they do not match, a new connection is created to update it and 
 * the global variable is updated to the file's current modifiedAt time.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
const reloadOnFileChange = (req, res, next) => {
  console.log("[INFO]   Checking products.db's metadata...");
  fs.stat("/app/upload/products.db", async (err, stats) => {
    if (err) console.log(err);

    console.log("[TRACE]  Local update time:  ", stats.mtime.toISOString());
    console.log("[TRACE]  Stored update time: ", global.productsDbUpdatedAtTime);

    if (stats.mtime.toISOString() !== global.productsDbUpdatedAtTime) {
      console.log("[WARN]   The local file is out of date!");
      console.log("[WARN]   updating DB connection...");
      await DatabaseConnection.update();
      console.log("[INFO]   DB connection updated");

      global.productsDbUpdatedAtTime = stats.mtime.toISOString();
      console.log("[INFO]   Stored update time updated");

      console.log("[TRACE]  Stored update is now: ", global.productsDbUpdatedAtTime);
      
      return next();
    }
    console.log("[INFO]   Local file is up to date, proceeding.");
    return next();
  });
};

export { reloadOnFileChange };