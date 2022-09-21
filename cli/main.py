# file <main.py>


from cli.include.pars import parser
from cli.page_loader import download


def main():
    url, o = parser()
    print(download(url, o))


if __name__ == '__main__':
    main()
