# file <create_dir.py>


import os
import shutil
import logging


def create_dir(path, name):
    logger = logging.getLogger()
    logging.basicConfig(level='ERROR')
    a = name + '_files'
    path2 = os.path.join(path, a)
    try:
        os.mkdir(path2)
    except Exception as err:
        logger.error(f'Not {err}')
        raise SystemExit(err)
    except FileExistsError:
        shutil.rmtree(path2)
        os.mkdir(path2)
    return path2
