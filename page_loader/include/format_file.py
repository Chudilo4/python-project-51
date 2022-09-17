# file<format_file.py>


import re


def format_file(url, ext):
    r = re.split(r'/\/|https:|\.|\/', url)
    format_url = '-'.join(r)
    return format_url[2::] + ext
