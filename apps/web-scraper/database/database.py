import sqlite3
import uuid

class Product():
    def __init__(
        self,
        price="",
        name="",
        sub_title="",
        description="",
        category="",
        sub_category="",
        link="",
        overall_rank=""
    ):
        self.name = name
        self.sub_title = sub_title
        self.description = description
        self.category = category
        self.sub_category = sub_category
        self.price = float(price.replace("\xa0kr.", ""))
        self.link = link
        self.overall_rank = float(overall_rank.replace(",", "."))

    def __repr__(self):
        return f'''
        < Name: {self.name}
          Subtitle: {self.sub_title}
          Description: {self.description}
          Category: {self.category}
          Subcategory: {self.sub_category}
          Price: {self.price}
          Link: {self.link}
          Overall Rank: {self.overall_rank} 
        >'''


TABLE_NAME = "products.db"


def generate_db(do_reset=True):
    connection = sqlite3.connect(TABLE_NAME)

    if do_reset:
        connection.execute('''
                           DROP TABLE IF EXISTS products
                           ''')

    connection.execute('''
                       CREATE TABLE IF NOT EXISTS products (
                         id VARCHAR(500) PRIMARY KEY,
                         name TEXT,
                         sub_title TEXT,
                         description TEXT,
                         category TEXT,
                         sub_category TEXT,
                         price FLOAT,
                         link TEXT,
                         overall_rank FLOAT
                       )
                       ''')

    connection.close()


def insert_product(product: Product):
    connection = sqlite3.connect(TABLE_NAME)

    connection.execute('''
                     INSERT INTO products (
                        id,
                        name,
                        sub_title,
                        description,
                        category,
                        sub_category,
                        price,
                        link,
                        overall_rank
                     )
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                     ''', (
                       str(uuid.uuid4()),
                       product.name,
                       product.sub_title,
                       product.description,
                       product.category,
                       product.sub_category,
                       product.price,
                       product.link,
                       product.overall_rank
                       ))
    connection.commit()

    connection.close()


def get_all_products():
    connection = sqlite3.connect(TABLE_NAME)

    result = connection.execute('''
                     SELECT * FROM products
                     ''').fetchall()

    connection.close()

    return result
