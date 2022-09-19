# file <download_img.py>


import requests


def download_files(url, path_to_file):
    url_files = requests.get(url)
    if '.html' in url or '.css' in url:
        with open(path_to_file, 'w') as file:
            a = url_files.text
            file.write(a)
            file.close()
    a = url_files.content
    with open(path_to_file, 'bw') as file:
        file.write(a)
        file.close()
