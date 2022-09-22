# file <create_dir.py>


import os
import shutil
import re


def create_dir(path, url):
    r = re.split(r'/\/|http:|https:|\.|\/', url)
    format_url = '_'.join(r) + '_files'
    path2 = os.path.join(path, format_url)
    try:
        os.mkdir(path2)
    except FileExistsError:
        shutil.rmtree(path2)
        os.mkdir(path2)
    return path2
