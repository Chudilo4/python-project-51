# file <create_dir.py>


import os
import shutil


def create_dir(path, name):
    a = name + '_files'
    path2 = os.path.join(path, a)
    try:
        os.mkdir(path2)
    except FileExistsError:
        shutil.rmtree(path2)
        os.mkdir(path2)
    return path2
