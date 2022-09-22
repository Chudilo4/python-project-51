# file <create_dir.py>


import os
import shutil
import logging
import sys


def create_dir(path):
    logging.basicConfig(level='CRITICAL')
    logger = logging.getLogger()
    path2 = os.path.join(path, '_files')
    try:
        os.mkdir(path2)
    except FileNotFoundError as err:
        logger.critical('not found file', err)
        sys.exit()
    except FileExistsError:
        shutil.rmtree(path2)
        os.mkdir(path2)
    return path2
