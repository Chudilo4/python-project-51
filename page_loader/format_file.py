# file<format_file.py>


import re
import sys


def format_files(url):
    r = re.split(r'/\/|https://|http://|\/|\.', url)
    r2 = re.findall(r'\.\w{2,3}\b', url)
    format_url = '-'.join(r)
    exc = ['.com', '.ru', '.en']
    try:
        if r2[-1] == [] or r2[-1] in exc:
            return format_url[:] + ".html"
        else:
            return format_url[:-4] + r2[-1]
    except IndexError:
        sys.exit(1)
