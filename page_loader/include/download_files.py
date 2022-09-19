# file <download_files.py>


import requests


def download_files(url, path_to_file):
    url_img = requests.get(url)
    a = url_img.content
    with open(path_to_file, 'w') as file:
        file.write(a)
        file.close()
