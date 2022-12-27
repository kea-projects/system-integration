import { DatabaseConnection } from "./connection.js"

const SFTP_USERNAME = process.env.SFTP_USERNAME;
const filename = SFTP_USERNAME ? `/app/upload/products.db` : "products.db";

console.log(`[INFO]   Using the db file: ${filename}`);

export async function initDatabase() {
  const database = await DatabaseConnection.get();
  console.log("[TRACE]  Creating table if it does not exist: Products");
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
  console.log("[TRACE]  Creating table if it does not exist: ProductImages");
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
  console.log("[TRACE]  Creating table if it does not exist: ProductAdditionalInfos");
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
  const database = await DatabaseConnection.get();
  const args = {
    product_name: "replaced1",
    product_sub_title: "replaced1",
    product_description: "replaced1",
    main_category: "replaced1",
    sub_category: "replaced1",
    price: 123,
    link: "replaced1",
    overall_rating: "replaced1",
  };
  const argsOne = {
    product_name: "replaced2",
    product_sub_title: "replaced2",
    product_description: "replaced2",
    main_category: "replaced2",
    sub_category: "replaced2",
    price: 123,
    link: "replaced2",
    overall_rating: "replaced2",
  };
  const argsTwo = {
    product_name: "replaced3",
    product_sub_title: "replaced3",
    product_description: "replaced3",
    main_category: "replaced3",
    sub_category: "replaced3",
    price: 123,
    link: "replaced3",
    overall_rating: "replaced3",
  };
  console.log("[TRACE]  Adding seeding data to Products 1/3...");
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
  console.log("[TRACE]  Adding seeding data to Products 2/3...");
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
  console.log("[TRACE]  Adding seeding data to Products 3/3...");
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

  console.log("[TRACE]  Adding seeding data to ProductsImages 1/3...");
  const result3 = await database.run(
    `INSERT INTO ProductImages (product_id, image_url, alt_text, additional_info) VALUES (?,?,?,?)`,
    ["1", "imgArgs.image_url", "imgArgs.alt_text", "imgArgs.additional_info"]
  );
  console.log("[TRACE]  Adding seeding data to ProductsImages 2/3...");
  const result4 = await database.run(
    `INSERT INTO ProductImages (product_id, image_url, alt_text, additional_info) VALUES (?,?,?,?)`,
    ["2", "imgArgs.image_url2", "imgArgs.alt_text2", "imgArgs.additional_info2"]
  );
  console.log("[TRACE]  Adding seeding data to ProductsImages 3/3...");
  const result5 = await database.run(
    `INSERT INTO ProductImages (product_id, image_url, alt_text, additional_info) VALUES (?,?,?,?)`,
    ["3", "imgArgs.image_url3", "imgArgs.alt_text3", "imgArgs.additional_info3"]
  );
  console.log(result3, result4, result5);

  console.log("[TRACE]  Adding seeding data to ProductAdditionalInfos 1/3...");
  const result6 = await database.run(
    `INSERT INTO ProductAdditionalInfos (product_id, choices, additional_info) VALUES (?,?,?)`,
    ["1", "choices", "additional info stuff"]
  );
  console.log("[TRACE]  Adding seeding data to ProductAdditionalInfos 2/3...");
  const result7 = await database.run(
    `INSERT INTO ProductAdditionalInfos (product_id, choices, additional_info) VALUES (?,?,?)`,
    ["2", "choices2", "additional info stuff2"]
  );
  console.log("[TRACE]  Adding seeding data to ProductAdditionalInfos 3/3...");
  const result8 = await database.run(
    `INSERT INTO ProductAdditionalInfos (product_id, choices, additional_info) VALUES (?,?,?)`,
    ["3", "choices3", "additional info stuff3"]
  );
  console.log(result6, result7, result8);
}

export async function dropAllTables() {
  const database = await DatabaseConnection.get();
  console.log("[WARN] Dropping ALL TABLES from product.db");
  await database.exec(`DROP TABLE ProductAdditionalInfos;`);
  await database.exec(`DROP TABLE ProductImages;`);
  await database.exec(`DROP TABLE Products;`);
}
