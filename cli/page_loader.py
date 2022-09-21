# file <page_loader.py>


import requests
from cli.include.format_file import format_files
import os
from bs4 import BeautifulSoup
from cli.include.download_img import download_files
from cli.include.create_dir import create_dir
from urllib.parse import urlparse
import logging
from progress.bar import Bar


def download(url, path_os):
    logging.basicConfig(level='INFO')
    logger = logging.getLogger()
    logger.info(f'request url : {url}')
    logger.info(f'output path : {path_os}')
    html = requests.get(url)
    format_url = format_files(url)
    path_html = os.path.join(path_os, format_url)
    logger.info(f'write html file : {path_html}')
    a = html.text
    soup = BeautifulSoup(a, 'html.parser')
    path_dir_filers = create_dir(path_os)
    tag2 = {'img': 'src',
            'script': 'src',
            'link': 'href'
            }
    bar = Bar('Loading', fill='@', suffix='%(percent)d%%')
    for tag, ref in tag2.items():
        bar.next()
        for link in soup.select(tag):
            url_img = link.get(ref)
            url_img2 = urlparse(url_img)
            if url_img2.netloc == '':
                link['src'] = download_files(url_img, url, path_dir_filers)
                bar.next()
    bar.finish()
    b = soup.prettify(formatter='html5')
    with open(path_html, 'w') as file:
        file.write(b)
        file.close()
    return path_html
