# file <main.py>
import sys

from page_loader.page_loader import download
from page_loader.pars import parser
import logging


def main():
    logger = logging.getLogger()
    try:
        url, o = parser()
        print(download(url, o))
    except Exception as e:
        logger.critical(e)
        sys.exit(1)
    sys.exit()


if __name__ == '__main__':
    main()
