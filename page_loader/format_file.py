# file<format_file.py>


import re


def format_files(url):
    r = re.split(r'/\/|https://|http://|\/|\.', url)
    r2 = re.findall(r'\.\w{2,3}\b', url)
    format_url = '-'.join(r)
    exc = ['.com', '.ru', '.en']
    if r2[-1] != [] and r2[-1] not in exc:
        return format_url[:-4] + r2[-1]
    else:
        return format_url[:] + ".html"
