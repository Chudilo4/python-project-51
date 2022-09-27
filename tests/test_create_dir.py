# file <test_create_dir.py>


import tempfile
from page_loader.create_dir import create_dir
from urllib.parse import urlparse

def test_create_dir():
    with tempfile.TemporaryDirectory() as r:
        a = urlparse('https://example.com')
        path = create_dir(r, a.netloc)
        assert path == f'{r}/example-com_files'
