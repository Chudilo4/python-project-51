# file <main.py>


from page_loader.include.pars import parser
from page_loader.include.download import download


def main():
    url, path, o = parser()
    r = download(url, path)
    if o is True:
        print(r)


if __name__ == '__main__':
    main()
