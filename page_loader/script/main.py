# file <main.py>


from page_loader.pars import parser
from page_loader.page_loader import download
import sys
import logging


def main():
    try:
        logger = logging.getLogger()
        url, o = parser()
        print(download(url, o))
    except Exception:
        logger.debug(sys.exit(1))
    sys.exit(0)


if __name__ == '__main__':
    main()
