import fs from "fs";

const fixDbPermissions = () => {
  fs.stat("/app/upload/products.db", (err, stats) => {
    if (err)
      return console.log(
        "File: 'products.db' does not exist yet.\nSkipping file permissions"
      );

    console.log("[DEBUG]  Setting current updatedAt value...");
    global.productsDbUpdatedAtTime = stats.mtime.toISOString();

    console.log(
      "[DEBUG]  Set global.productsDbUpdatedAtTime to: ",
      productsDbUpdatedAtTime
    );
    console.log("[DEBUG]  Checking for file permissions...");

    const groupId = stats.uid;
    console.log("[DEBUG]  Group id is: ", groupId);
    if (groupId === 0) {
      fs.chown("/app/upload/products.db", 1001, 0, (err) => {
        if (err) console.log(err);

        console.log("[DEBUG]  File permissions updated successfully");
        console.log("[DEBUG]  Group id is now: ", 1001);
      });
    }
  });
};

export { fixDbPermissions };
