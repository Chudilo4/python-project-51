# file <main.py>


from page_loader.pars import parser
from page_loader.page_loader import download
import sys
import os


def main():
    try:
        url, o = parser()
        print(download(url, o))
    except Exception:
        sys.exit(os.EX_CONFIG)
    sys.exit(os.EX_CONFIG)


if __name__ == '__main__':
    main()
