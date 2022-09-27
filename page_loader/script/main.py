# file <main.py>


from page_loader.pars import parser
from page_loader.page_loader import download
import logging
import sys


def main():
    try:
        url, o = parser()
        print(download(url, o))
    except SystemExit as e:
        logging.CRITICAL(e)
        sys.exit(e.args)


if __name__ == '__main__':
    main()
