# file <test_download.py>
import os

from page_loader.page_loader import download
import requests_mock
import tempfile


def test_download():
    with tempfile.TemporaryDirectory() as rood:  # Создаём временную директорию
        m = requests_mock.Mocker()
        with m as m2:  # Создаём объект mock через менеджер контекстов
            img = open('tests/fixtures/expected/localhost-blog-about_files/localhost-photos-me.jpg', 'br').read()
            m2.get('https://site.com/photos/me.jpg', content=img)
            css = open('tests/fixtures/expected/localhost-blog-about_files/localhost-blog-about-assets-styles.css', 'r').read()
            m2.get('https://site.com/blog/about/assets/styles.css', text=css)
            js = open('tests/fixtures/expected/localhost-blog-about_files/localhost-assets-scripts.js').read()
            m2.get('https://site.com/assets/scripts.js', text=js)
            html_about = open('tests/fixtures/expected/localhost-blog-about_files/localhost-blog-about.html').read()
            m2.get('https://site.com/blog/about', text=html_about)
            r = download('https://site.com/blog/about', rood)
            excepted = open('tests/fixtures/expected/site-com-blog-about.html').read()
            w = open(r, 'r').read()
            print(os.listdir(rood))
            assert len(os.listdir(os.path.join(rood, 'site-com-blog-about_files'))) == 4
            assert len(os.listdir(rood)) == 2
            assert excepted == w
