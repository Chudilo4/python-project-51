# file <main.py>

from page_loader.page_loader import download
from page_loader.pars import parser


def main():
    try:
        url, o = parser()
        print(download(url, o))
    except Exception:
        raise SystemExit


if __name__ == '__main__':
    main()
