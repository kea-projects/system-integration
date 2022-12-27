import requests
from pprint import pprint as print
from bs4 import BeautifulSoup


class Product():
    def __init__(self, price="", rating="", name=""):
        self.price = price
        self.rating = rating
        self.name = name

    def __repr__(self):
        return f"| Price: {self.price}, Rating: {self.rating}, Name: {self.name} |"


response = requests.get(
    "https://www.pricerunner.dk/"
)
html = response.content
soup = BeautifulSoup(html, features="lxml")
products = []

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
                rating=product_rating.text
            )
            products.append(product)

print(products)
