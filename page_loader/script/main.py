# file <main.py>


from page_loader.pars import parser
from page_loader.page_loader import download
import sys


def main():
    try:
        url, o = parser()
        print(download(url, o))
    except SystemExit:
        sys.exit(1)


if __name__ == '__main__':
    main()
