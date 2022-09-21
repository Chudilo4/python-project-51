# file <pars.py>


import argparse
import os


def parser():
    pars = argparse.ArgumentParser(
        description='Compares two configuration files and shows a difference.'
    )
    pars.add_argument('url',
                      metavar='URL',
                      type=str)
    pars.add_argument('-o', '--output',
                      default=os.getcwd(),
                      help='set format of output', )
    args = pars.parse_args()
    return args.url, args.output
