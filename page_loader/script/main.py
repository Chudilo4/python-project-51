# file <main.py>
import sys

from page_loader.page_loader import download
from page_loader.pars import parser


def main():
    try:
        url, o = parser()
        print(download(url, o))
    except Exception as e:
        sys.exit(e)
    sys.exit(0)


if __name__ == '__main__':
    main()
