# file <download_img.py>


import requests
from urllib.parse import urljoin
import re
import os


def download_files(url, url2, path_dir):
    r = re.split(r'/\/|https://|http://|\/|\.', url)
    r2 = re.findall(r'\.\w{2,3}\b', url)
    format_url = '-'.join(r)
    if not r2:
        path_file = format_url[1:] + ".html"
    else:
        path_file = format_url[1:-4] + r2[-1]
    path_img = os.path.join(path_dir, path_file)
    exc = ['.js', '.html', 'css']
    url_full = urljoin(url2, url)
    a = requests.get(url_full)
    if r2 == [] or r2[-1] in exc:
        with open(path_img, 'w') as file1:
            a = a.text
            file1.write(a)
            file1.close()
            return path_img
    g = a.content
    with open(path_img, 'bw') as file2:
        file2.write(g)
        file2.close()
    return path_img
