# file <download_img.py>


import requests


def download_img(url, path_to_file):
    url_img = requests.get(url)
    a = url_img.content
    with open(path_to_file, 'bw') as file:
        file.write(a)
        file.close()
