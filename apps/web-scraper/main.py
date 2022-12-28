#!/bin/env python3

import requests
from utils.database import (Product, insert_product,
                            generate_db)
from utils.config import validate_envs
from bs4 import BeautifulSoup


def scrape_main_page():
    response = requests.get(
        "https://www.pricerunner.dk/"
    )
    html = response.content
    soup = BeautifulSoup(html, features="lxml")

    content = soup.find(
        "div",
        {
            "class": "R39C8j5r93"
        }
    )

    sections = content.find_all("div", {
        "class": "CEV16XW373"
    })

    for section in sections:
        product_list = section.find_all("div", {
            "class": "al5wsmjlcK"
        })

        for product_item in product_list:
            product_price = product_item.find("span", {
                "class": "pr-be5x0o"
            })

            product_rating = product_item.find("p", {
                "class": "pr-1ob9nd8"
            })

            product_name = product_item.find("h3", {
                "class": "pr-7iigu3"
            })
            if product_price and product_name and product_rating:
                product = Product(
                    price=product_price.text,
                    name=product_name.text,
                    overall_rank=product_rating.text
                )
                insert_product(product)


def scrape_phone_page():
    pass


validate_envs()

generate_db()
scrape_main_page()
scrape_phone_page()
