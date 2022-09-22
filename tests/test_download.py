# file <test_download.py>
import os

from page_loader.page_loader import download
import requests_mock
import tempfile


def test_download():
    with tempfile.TemporaryDirectory() as rood:  # Создаём временную директорию
        m = requests_mock.Mocker()
        corr = open('tests/fixtures/job_in_image.html').read()
        with m as m2:  # Создаём объект mock через менеджер контекстов
            m2.get('https://example.com', text=corr)
            img = open('tests/fixtures/1.png', 'br').read()
            m2.get('https://example.com/1.png', content=img)
            css = open('tests/fixtures/menu.css', 'r').read()
            m2.get('https://example.com/menu.css', text=css)
            html = open('tests/fixtures/job.html', 'r').read()
            m2.get('https://example.com/job.html', text=html)
            js = open('tests/fixtures/hello.js', 'r').read()
            m2.get('https://example.com/hello.js', text=js)
            download('https://example.com', rood)
            assert len(os.listdir(os.path.join(rood, 'example-com_files'))) == 4
            assert len(os.listdir(rood)) == 2
