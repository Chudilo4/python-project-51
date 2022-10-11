# file <main.py>
import sys

from page_loader.page_loader import download
from page_loader.pars import parser
import logging


def main():
    logger = logging.getLogger()
    logger.setLevel('ERROR')
    try:
        url, o = parser()
        print(download(url, o))
    except BaseException as e:
        logger.info(e)
        sys.exit(1)
    sys.exit(0)


if __name__ == '__main__':
    main()
