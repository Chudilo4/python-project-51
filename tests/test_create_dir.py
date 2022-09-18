# file <test_create_dir.py>


import os
from page_loader.include.create_dir import create_dir
import tempfile


def test_create_dir():
    with tempfile.TemporaryDirectory() as rood:
        r = create_dir(rood)
        assert os.path.exists(r)
