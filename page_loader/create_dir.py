# file <create_dir.py>


import logging
import os
import re
import sys


def create_dir(path, url):
    r = re.split(r'/\/|http:|https:|\.|\/', url)
    format_url = '-'.join(r) + '_files'
    path2 = os.path.join(path, format_url[2:])
    try:
        os.mkdir(path2)
    except PermissionError as err:
        logging.CRITICAL(err)
        sys.exit(err)
    except IsADirectoryError as err:
        logging.CRITICAL(err)
        sys.exit(err)
    return path2
