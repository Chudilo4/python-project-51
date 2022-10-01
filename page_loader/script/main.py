# file <main.py>


from page_loader.pars import parser
from page_loader.page_loader import download
import sys
import logging


def main():
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger()
    try:
        url, o = parser()
        print(download(url, o))
    except SystemExit as e:
        logger.error(str(e))
        sys.exit(e)
    sys.exit(0)


if __name__ == '__main__':
    main()
