# file <main.py>


from page_loader.pars import parser
from page_loader.page_loader import download
import sys


def main():
    url, o = parser()
    print(download(url, o))


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(2)
    except OSError:
        sys.exit(3)
    except Exception:
        sys.exit(1)