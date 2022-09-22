# file <test_create_dir.py>


import tempfile
from page_loader.create_dir import create_dir


def test_create_dir():
    with tempfile.TemporaryDirectory() as r:
        path = create_dir(r, 'https://example.com')
        assert path == f'{r}/example_com_files'
