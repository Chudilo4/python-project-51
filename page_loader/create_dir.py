# file <create_dir.py>


import os
import re


def create_dir(path, url):
    r = re.split(r'/\/|http:|https:|\.|\/', url)
    format_url = '-'.join(r) + '_files'
    path2 = os.path.join(path, format_url)
    try:
        os.mkdir(path2)
    except PermissionError as err:
        assert err
    except IsADirectoryError as err:
        assert err
    return path2
