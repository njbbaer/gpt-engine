import argparse

from ruamel.yaml import YAML

from .agent import Agent
from .context import FileContext

yaml = YAML()


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("-c", "--context", type=str)
    parser.add_argument("-i", "--input", type=str)
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()
    context = FileContext(args.context)
    agent = Agent.create(context)
    agent.run_cli(args)
