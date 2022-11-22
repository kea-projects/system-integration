import db from './connection.js'

db.exec(`
    CREATE TABLE Products (
        product_id VARCHAR(255) NOT NULL PRIMARY KEY,
        product_name VARCHAR(255),
        product_sub_title VARCHAR(255),
        product_description VARCHAR(255),
        main_category VARCHAR(255),
        sub_category VARCHAR(255),
        price INT,
        link VARCHAR(255),
        overall_rating VARCHAR(255),
    )
`)

db.exec(`
    CREATE TABLE ProductAdditionalInfo (
        product_additional_info_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        choices VARCHAR(255),
        additional_info VARCHAR(255),
        FOREIGN KEY (product_id) REFERENCES Products(product_id),
    )
`)

db.exec(`
    CREATE TABLE ProductImage (
        product_image_id VARCHAR(255) NOT NULL PRIMARY KEY,
        product_id VARCHAR(255) NOT NULL FOREIGN KEY REFERENCES Products(product_id),
        image_url VARCHAR(255),
        alt_text VARCHAR(255),
        additional_info VARCHAR(255),
    )
`)