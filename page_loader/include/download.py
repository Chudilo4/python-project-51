# file <download.py>


import requests
from page_loader.include.format_file import format_file
import os


def download(url, path_os):
    html = requests.get(url)
    format_url = format_file(url, '.html')
    path_file = os.path.join(path_os, format_url)
    a = html.text
    with open(path_file, 'w') as file:
        file.write(a)
        file.close()
    return path_file
