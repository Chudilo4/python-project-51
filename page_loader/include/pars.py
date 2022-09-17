# file <pars.py>


import argparse


def parser():
    pars = argparse.ArgumentParser(
        description='Compares two configuration files and shows a difference.'
    )
    pars.add_argument('url',
                      metavar='first_argument',
                      type=str)
    pars.add_argument('path_os',
                      metavar='second_argument',
                      type=str)
    pars.add_argument('-o', '--output',
                      action='store_true',
                      help='set format of output', )
    args = pars.parse_args()
    return args.url, args.path_os, args.output
