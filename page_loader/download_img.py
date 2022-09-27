# file <download_img.py>


import requests
from urllib.parse import urljoin, urlparse
import re
import os
from page_loader.format_file import format_files


def download_files(url, url2, path_dir):
    r = re.split(r'/\/|https://|http://|\/|\.', url)
    r2 = re.findall(r'\.\w{2,3}\b', url)
    path_dir_files = os.path.split(path_dir)
    format_url = '-'.join(r)
    if not r2:
        path_f = format_url[1:] + ".html"
    else:
        path_f = format_url[1:-4] + r2[-1]
    g = urlparse(url2)
    url1 = format_files(g.netloc)
    path_file = url1[:-5] + '-' + path_f
    path_img = os.path.join(path_dir, path_file)
    cc = path_dir_files[-1] + '/' + path_file
    exc = ['.js', '.html', 'css']
    url_full = urljoin(url2, url)
    a = requests.get(url_full)
    if r2 == [] or r2[-1] in exc:
        with open(path_img, 'w') as file1:
            a = a.text
            file1.write(a)
            file1.close()
            return cc
    g = a.content
    with open(path_img, 'bw') as file2:
        file2.write(g)
        file2.close()
    return cc
