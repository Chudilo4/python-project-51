# file <test_download.py>


from page_loader2.page_loader import download
import requests
import requests_mock
import tempfile


def test_download():
    with tempfile.TemporaryDirectory() as rood:  # Создаём временную директорию
        m = requests_mock.Mocker()
        with m as m2:  # Создаём объект mock через менеджер контекстов
            m2.get('https://example.com', text="data\n")
            r = download('https://example.com', rood)
            a = requests.get('https://example.com').text
            with open(r, 'r') as file:
                c = file.read()
                assert a == c
