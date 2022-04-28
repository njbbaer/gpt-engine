import argparse

from ruamel.yaml import YAML

from .agent import Agent
from .context import FileContext

yaml = YAML()


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("-c", "--context", type=str)
    parser.add_argument("-i", "--input", type=str)
    parser.add_argument("-l", "--loop")
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()
    context = FileContext(args.context)
    agent = Agent(context)
    if args.loop:
        agent.run_cli_loop(args)
    else:
        agent.run_cli(args)
