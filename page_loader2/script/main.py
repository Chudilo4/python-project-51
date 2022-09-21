# file <main.py>


from page_loader2.script.pars import parser
from page_loader2.page_loader import download


def main():
    url, o = parser()
    print(download(url, o))


if __name__ == '__main__':
    main()
