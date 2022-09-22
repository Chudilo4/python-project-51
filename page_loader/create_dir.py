# file <create_dir.py>


import os
import shutil
import logging


def create_dir(path):
    logger = logging.getLogger()
    logging.basicConfig(level='ERROR')
    path2 = os.path.join(path, '_files')
    try:
        os.mkdir(path2)
    except Exception as err:
        logger.error(f'Not {err}')
        raise SystemExit(err)
    except FileExistsError:
        shutil.rmtree(path2)
        os.mkdir(path2)
    return path2
