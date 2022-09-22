# file <create_dir.py>


import os
import shutil
import logging


def create_dir(path):
    logger = logging.getLogger()
    logging.basicConfig(level='CRITICAL')
    path2 = os.path.join(path, '_files')
    try:
        os.mkdir(path2)
    except PermissionError as err:
        logger.error("Permission error: {}".format(err))
        raise SystemExit(err) from None
    except FileNotFoundError as err:
        logger.critical('not found file', err)
        raise SystemExit(err) from None
    except FileExistsError:
        shutil.rmtree(path2)
        os.mkdir(path2)
    return path2
