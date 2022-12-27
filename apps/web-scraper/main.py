import requests
from pprint import pprint as print
from bs4 import BeautifulSoup

response = requests.get(
    "https://www.pricerunner.dk/"
)
html = response.content
soup = BeautifulSoup(html, features="lxml")

content = soup.find(
    "div",
    {
        "class": "CJZf1fpXsh"
    }
)

print(content)