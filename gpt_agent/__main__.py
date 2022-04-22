import argparse

from .agent import Agent
from ruamel.yaml import YAML

yaml = YAML()

parser = argparse.ArgumentParser(description="Run your GPT-3 powered agent.")
parser.add_argument("-p", "--prompt", type=str, help="The location of your prompt file")
args = parser.parse_args()

prompt_file = args.prompt or 'context.yml'

with open(prompt_file, 'r') as f:
    context = yaml.load(f)

context = Agent.create(context).run()

with open(prompt_file, 'w') as f:
    yaml.dump(context, f)
