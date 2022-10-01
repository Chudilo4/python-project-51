# file <main.py>
import logging

from page_loader.pars import parser
from page_loader.page_loader import download
import sys


def main():
    logging.basicConfig(stream=sys.stderr)
    logger = logging.getLogger()
    try:
        url, o = parser()
        print(download(url, o))
    except Exception:
        logger.exception(sys.exit(1))
    logger.info(sys.exit(0))


if __name__ == '__main__':
    main()
