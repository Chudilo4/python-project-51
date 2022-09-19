# file <download.py>


import requests
from page_loader.include.format_file import format_files
import os
from bs4 import BeautifulSoup
from page_loader.include.download_img import download_files
from page_loader.include.create_dir import create_dir


def download(url, path_os):
    html = requests.get(url)
    format_url = format_files(url)
    path_html = os.path.join(path_os, format_url)
    a = html.text
    soup = BeautifulSoup(a, 'html.parser')
    path_dir_filers = create_dir(path_os)
    for link in soup.select("img"):
        url_img = link.get('src')
        form_img = format_files(url_img)
        path_img = os.path.join(path_dir_filers, form_img)
        download_files(url_img, path_img)
        link['src'] = path_img
    for link in soup.select('link'):
        if link.get('href') is not None:
            url_files = link.get('href')
            form_files = format_files(url_files)
            path_files = os.path.join(path_dir_filers, form_files)
            download_files(url_files, path_files)
            link['href'] = path_files
    b = soup.prettify(formatter='html5')
    with open(path_html, 'w') as file:
        file.write(b)
        file.close()
    return path_html
