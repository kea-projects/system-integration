#!/bin/env python3

import requests
from pprint import pprint as print
from utils.database import (Product, insert_product,
                            generate_db)
from utils.config import validate_envs
from bs4 import BeautifulSoup, Tag

BASE_URL = "https://www.pricerunner.dk"
PRODUCT_COUNTER = 0


def scrape_page(url: str):
    response = requests.get(url)
    html = response.content
    soup = BeautifulSoup(html, features="lxml")

    content = soup.find(
        "div",
        {
            "class": "CEV16XW373"
        }
    )

    product_category = content.find(
        "li", {
            "class": "geBRL9rVs9 RDtQlzuoUs"
        }
    ).find(
        "a", {
            "class": "Jollu6fRvA"
        }
    )

    product_sub_category = content.find(
        "li", {
            "class": "geBRL9rVs9 xUmGh5edPN EPWAquFnpU"
        }
    ).find(
        "a", {
            "class": "Jollu6fRvA"
        }
    )

    # Get item grid
    grid = content.find(
        "div",
        {
            "class": "mIkxpLfxgo pr-awu2ev"
        }
    )

    item_cards: list[Tag] = grid.find_all("div", {
        "class": "k6oEmfY83J pr-1k8dg1g"
    })

    for item_card in item_cards:
        product_price = item_card.find("span", {
            "class": "pr-be5x0o"
        })

        product_name = item_card.find("h3", {
            "class": "pr-7iigu3"
        })

        product_sub_title = item_card.find("p", {
            "class": "pr-13b83wt"
        })

        product_overall_rank = item_card.find("p", {
            "class": "pr-1ob9nd8"
        })

        product_link = item_card.find("a")

        product_description = None
        if product_link is not None:
            product_link = f"{BASE_URL}{product_link.attrs['href']}"
            product_response = requests.get(product_link)
            product_html = product_response.content
            product_soup = BeautifulSoup(product_html, features="lxml")

            product_description = product_soup.find("p", {
                "class": "pr-sslp0w"
            })

        if product_price and product_name:
            product = Product(
                price=product_price.text,
                name=product_name.text,
                sub_title=product_sub_title.text if (
                    product_sub_title is not None
                ) else "",
                description=product_description.text if (
                    product_description is not None
                ) else "",
                category=product_category.text if (
                    product_category is not None
                ) else "",
                sub_category=product_sub_category.text if (
                    product_sub_category is not None
                ) else "",
                link=product_link or "",
                overall_rank=product_overall_rank.text if (
                    product_overall_rank is not None
                ) else "0.0",
            )
            insert_product(product)

            global PRODUCT_COUNTER
            PRODUCT_COUNTER += 1


validate_envs()
generate_db()
pages = [
    "/cl/460/Belysning?attr_56944320=56944322",
    "/cl/1298/Mark-Mursten-Moertel?attr_100005472=100017070",
    "/cl/280/Kameratasker?attr_60537286=60537353",
    "/cl/117/Netvaerkskort-Bluetooth-adaptere?attr_2001047=2006865",
    "/cl/1298/Mark-Mursten-Moertel?attr_60430979=60521119",
    "/cl/75/Massage-Afslapningsprodukter?attr_57562681=57562687",
    "/cl/1298/Mark-Mursten-Moertel?attr_60430979=60521439",
    "/cl/1342/Hobbyartikler?attr_57603579=57603584"
]
for page in pages:
    scrape_page(f"{BASE_URL}{page}")

print(f"Products scraped: {PRODUCT_COUNTER}")
