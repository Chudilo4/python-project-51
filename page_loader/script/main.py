# file <main.py>
import logging

from page_loader.pars import parser
from page_loader.page_loader import download
import sys


def main():
    logging.basicConfig(stream=sys.stdout)
    logger = logging.getLogger()
    try:
        url, o = parser()
        print(f'{download(url, o)} hello')
    except Exception:
        logger.exception(sys.exit(1))
    logger.info(sys.exit(0))


if __name__ == '__main__':
    main()
