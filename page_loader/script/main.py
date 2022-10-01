# file <main.py>
import logging

from page_loader.pars import parser
from page_loader.page_loader import download
import sys


def main():
    url, o = parser()
    print(download(url, o))
    sys.exit(str(0))


if __name__ == '__main__':
    main()
