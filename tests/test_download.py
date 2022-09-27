# file <test_download.py>
import os

from page_loader.page_loader import download
import requests_mock
import tempfile


def test_download():
    with tempfile.TemporaryDirectory() as rood:  # Создаём временную директорию
        m = requests_mock.Mocker()

        corr = open('/mnt/24d4e75b-51e1-40d4-b6c6-31891e1cd244/python-project-51/tests/fixtures/site-com-blog-about.html').read()
        with m as m2:  # Создаём объект mock через менеджер контекстов
            m2.get('https://site.com', text=corr)
            img = open('/mnt/24d4e75b-51e1-40d4-b6c6-31891e1cd244/python-project-51/tests/fixtures/localhost-photos-me.jpg', 'br').read()
            m2.get('https://site.com/photos/me.jpg', content=img)
            css = open('/mnt/24d4e75b-51e1-40d4-b6c6-31891e1cd244/python-project-51/tests/fixtures/localhost-blog-about-assets-styles.css', 'r').read()
            m2.get('https://site.com/blog/about/assets/styles.css', text=css)
            html = open('/mnt/24d4e75b-51e1-40d4-b6c6-31891e1cd244/python-project-51/tests/fixtures/localhost-blog-about.html', 'r').read()
            m2.get('https://site.com/blog/about', text=html)
            js = open('/mnt/24d4e75b-51e1-40d4-b6c6-31891e1cd244/python-project-51/tests/fixtures/localhost-assets-scripts.js', 'r').read()
            m2.get('https://site.com/assets/scripts.js', text=js)
            download('https://site.com', rood)
            assert len(os.listdir(os.path.join(rood, 'site-com_files'))) == 4
            assert len(os.listdir(rood)) == 2
