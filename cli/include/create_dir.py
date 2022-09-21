# file <create_dir.py>


import os
import shutil


def create_dir(path):
    path2 = os.path.join(path, '_files')
    try:
        os.mkdir(path2)
    except FileExistsError:
        shutil.rmtree(path2)
        os.mkdir(path2)
    return path2
