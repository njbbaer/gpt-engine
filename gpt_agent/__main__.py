import argparse

from ruamel.yaml import YAML

from .agent import Agent

yaml = YAML()

parser = argparse.ArgumentParser()
parser.add_argument("-p", "--prompt", type=str)
args = parser.parse_args()

prompt_file = args.prompt or 'context.yml'

with open(prompt_file, 'r') as f:
    context = yaml.load(f)

context = Agent.create(context).run()

with open(prompt_file, 'w') as f:
    yaml.dump(context, f)
