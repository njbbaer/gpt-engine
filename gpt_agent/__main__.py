import argparse

from ruamel.yaml import YAML

from .agent import Agent

yaml = YAML()

parser = argparse.ArgumentParser()
parser.add_argument("-c", "--context", type=str)
parser.add_argument("-i", "--input", type=str)
args = parser.parse_args()

prompt_file = args.context or 'context.yml'

with open(prompt_file, 'r') as f:
    context = yaml.load(f)

context['input'] = args.input

context = Agent.create(context).run()
print(context['output'].lstrip())

with open('context.yml', 'w') as f:
    yaml.dump(context, f)
