# file <download.py>


import requests
from page_loader.include.format_file import format_file, format_img
import os
from bs4 import BeautifulSoup
from page_loader.include.download_img import download_img
from page_loader.include.create_dir import create_dir


def download(url, path_os):
    html = requests.get(url)
    format_url = format_file(url, '.html')
    path_html = os.path.join(path_os, format_url)
    a = html.text
    soup = BeautifulSoup(a, 'html.parser')
    path_dir_filers = create_dir(path_os)
    for link in soup.select("img"):
        url_img = link.get('src')
        form_img = format_img(url_img)
        path_img = os.path.join(path_dir_filers, form_img)
        download_img(url_img, path_img)
        link['src'] = path_img
    b = soup.prettify(formatter="html5")
    with open(path_html, 'w') as file:
        file.write(b)
        file.close()
    return path_html
