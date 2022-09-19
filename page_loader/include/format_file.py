# file<format_file.py>


import re


def format_files(url):
    r = re.split(r'/\/|https:|\.|\/', url)
    r2 = re.findall(r'\.\D{2,3}$', url)
    format_url = '-'.join(r)
    if not r2:
        return format_url[2:-4] + ".html"
    return format_url[2:-4] + r2[0]
