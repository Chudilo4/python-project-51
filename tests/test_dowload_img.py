# file <test_dowload_img.py>


from page_loader.download_img import download_files
import tempfile
import requests_mock
import os


def test_download_files():
    with tempfile.TemporaryDirectory() as rood:  # Создаём временную директорию
        m = requests_mock.Mocker()
        url = 'https://example.com/menu.css'
        url2 = 'https://example.com/'
        with open('tests/fixtures/menu.css', 'r') as file:
            img = file.read()
            with m as m2:  # Создаём объект mock через менеджер контекстов
                m2.get('https://example.com/menu.css', text=img)
                r = download_files(url, url2, rood)
                cor = open(f'{rood}/example-com--example-com-menu.css', 'r').read()
                pat = os.path.split(rood)
                assert cor == img
                assert r == f'{pat[-1]}/example-com--example-com-menu.css'
