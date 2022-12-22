import fs from "fs";
import { DatabaseConnection } from "../database/connection.js";
import express from "express"
import { fixDbPermissions } from "../database/fixPermissions.js";

/**
 * Middleware to reload the DB connection if products.db has been modified.
 * 
 * The middleware compares the global updatedAt variable with the one from file
 * storage. If they do not match, a new connection is created to update it and 
 * the global variable is updated to the file's current modifiedAt time.
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const reloadOnFileChange = (req, res, next) => {
  console.log("[INFO]   Checking products.db's metadata...");
  fs.stat("/app/upload/products.db", async (err, stats) => {
    if (err) console.log(err);
    console.log("[TRACE]  File mtime:                   ", stats.mtime.toISOString());
    console.log("[TRACE]  productsDbUpdatedAtTime time: ", global.productsDbUpdatedAtTime);

    if (stats.mtime.toISOString() !== global.productsDbUpdatedAtTime) {
      console.log("[WARN]   The local file is out of date!");

      console.log("[TRACE]  Fixing file permissions, just in case...")
      fixDbPermissions();

      console.log("[WARN]   updating DB connection...");
      await DatabaseConnection.update();

      console.log("[INFO]   Updating 'productsDbUpdatedAtTime'");
      global.productsDbUpdatedAtTime = stats.mtime.toISOString();

      console.log("[TRACE]  'productsDbUpdatedAtTime' is now: ", global.productsDbUpdatedAtTime);

      console.log(("INFO]   Update complete, proceeding."));
      return next();
    }
    console.log("[INFO]   Local file is up to date, proceeding.");
    return next();
  });
};

export { reloadOnFileChange };
