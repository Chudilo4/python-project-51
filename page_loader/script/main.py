# file <main.py>


from page_loader.pars import parser
from page_loader.page_loader import download
import sys
import logging
import errno


def main():
    logger = logging.getLogger()

    try:
        url, o = parser()
        print(download(url, o))
    except PermissionError as error:
        logger.error(error)
        sys.exit(errno.EPERM)
    except FileNotFoundError as error:
        logger.error(error)
        sys.exit(errno.ENOENT)
    except ConnectionError as error:
        logger.error(error)
        sys.exit(errno.ECONNREFUSED)


if __name__ == '__main__':
    main()
