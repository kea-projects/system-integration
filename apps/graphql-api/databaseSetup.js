import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

const SFTP_USERNAME = process.env.SFTP_USERNAME;
const filename = SFTP_USERNAME ? `/app/upload/products.db` : "products.db";

console.log(`Using the db file: ${filename}`);

export const database = await open({
  filename: filename,
  driver: sqlite3.Database,
});

fs.stat("/app/upload/products.db", (err, stats) => {
  if (err) console.log(err);
  console.log("Checking for file permissions...");
  const groupId = stats.uid
  console.log("Group id is: ", groupId);
  if (groupId === 0) {
    fs.chown( "/app/upload/products.db", 1001, 0, (err) => {
      if (err) console.log(err);
    
      console.log("File permissions updated successfully");
    } )
  }
})


export async function initDatabase() {
  database.exec(`
        CREATE TABLE IF NOT EXISTS Products (
            product_id integer PRIMARY KEY,
            product_name text,
            product_sub_title text,
            product_description text,
            main_category text,
            sub_category text,
            price integer,
            link text,
            overall_rating text
        );
    `);
  database.exec(`
        CREATE TABLE IF NOT EXISTS ProductImages (
            product_image_id integer PRIMARY KEY,
            product_id integer,
            image_url text,
            alt_text text,
            additional_info text,
            FOREIGN KEY (product_id) REFERENCES Products(product_id)
        );
    `);
  database.exec(`
        CREATE TABLE IF NOT EXISTS ProductAdditionalInfos (
            product_additional_info_id integer PRIMARY KEY,
            product_id integer,
            choices text,
            additional_info text,
            FOREIGN KEY (product_id) REFERENCES Products(product_id)
        );
    `);
}

export async function addDataToDatabase() {
  const args = {
    product_name: "test1",
    product_sub_title: "test1",
    product_description: "test1",
    main_category: "test1",
    sub_category: "test1",
    price: 123,
    link: "test1",
    overall_rating: "test1",
  };
  const argsOne = {
    product_name: "test2",
    product_sub_title: "test2",
    product_description: "test2",
    main_category: "test2",
    sub_category: "test2",
    price: 123,
    link: "test2",
    overall_rating: "test2",
  };
  const argsTwo = {
    product_name: "test3",
    product_sub_title: "test3",
    product_description: "test3",
    main_category: "test3",
    sub_category: "test3",
    price: 123,
    link: "test3",
    overall_rating: "test3",
  };

  const result = await database.run(
    `INSERT INTO Products (product_name, product_sub_title, product_description, main_category, sub_category, price, link, overall_rating) VALUES (?,?,?,?,?,?,?,?)`,
    [
      args.product_name,
      args.product_sub_title,
      args.product_description,
      args.main_category,
      args.sub_category,
      args.price,
      args.link,
      args.overall_rating,
    ]
  );
  const result1 = await database.run(
    `INSERT INTO Products (product_name, product_sub_title, product_description, main_category, sub_category, price, link, overall_rating) VALUES (?,?,?,?,?,?,?,?)`,
    [
      argsOne.product_name,
      argsOne.product_sub_title,
      argsOne.product_description,
      args.main_category,
      argsOne.sub_category,
      argsOne.price,
      argsOne.link,
      argsOne.overall_rating,
    ]
  );
  const result2 = await database.run(
    `INSERT INTO Products (product_name, product_sub_title, product_description, main_category, sub_category, price, link, overall_rating) VALUES (?,?,?,?,?,?,?,?)`,
    [
      argsTwo.product_name,
      argsTwo.product_sub_title,
      argsTwo.product_description,
      argsTwo.main_category,
      argsTwo.sub_category,
      args.price,
      args.link,
      argsTwo.overall_rating,
    ]
  );
  console.log(result, result1, result2);

  const result3 = await database.run(
    `INSERT INTO ProductImages (product_id, image_url, alt_text, additional_info) VALUES (?,?,?,?)`,
    ["1", "imgArgs.image_url", "imgArgs.alt_text", "imgArgs.additional_info"]
  );
  const result4 = await database.run(
    `INSERT INTO ProductImages (product_id, image_url, alt_text, additional_info) VALUES (?,?,?,?)`,
    ["2", "imgArgs.image_url2", "imgArgs.alt_text2", "imgArgs.additional_info2"]
  );
  const result5 = await database.run(
    `INSERT INTO ProductImages (product_id, image_url, alt_text, additional_info) VALUES (?,?,?,?)`,
    ["3", "imgArgs.image_url3", "imgArgs.alt_text3", "imgArgs.additional_info3"]
  );
  console.log(result3, result4, result5);

  const result6 = await database.run(
    `INSERT INTO ProductAdditionalInfos (product_id, choices, additional_info) VALUES (?,?,?)`,
    ["1", "choices", "additional info stuff"]
  );
  const result7 = await database.run(
    `INSERT INTO ProductAdditionalInfos (product_id, choices, additional_info) VALUES (?,?,?)`,
    ["2", "choices2", "additional info stuff2"]
  );
  const result8 = await database.run(
    `INSERT INTO ProductAdditionalInfos (product_id, choices, additional_info) VALUES (?,?,?)`,
    ["3", "choices3", "additional info stuff3"]
  );
  console.log(result6, result7, result8);
}

export async function dropAllTables() {
  await database.exec(`DROP TABLE ProductAdditionalInfos;`);
  await database.exec(`DROP TABLE ProductImages;`);
  await database.exec(`DROP TABLE Products;`);
}
