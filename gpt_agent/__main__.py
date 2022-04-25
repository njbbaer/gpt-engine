import argparse

from ruamel.yaml import YAML

from .agent import Agent

yaml = YAML()


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("-c", "--context", type=str)
    parser.add_argument("-i", "--input", type=str)
    return parser.parse_args()


def load_context(prompt_file):
    with open(prompt_file, 'r') as f:
        return yaml.load(f)


def save_context():
    with open('context.yml', 'w') as f:
        yaml.dump(context, f)


def get_prompt_file(args):
    if args.context:
        return f'prompts/{args.context}.yml'
    else:
        return 'context.yml'


if __name__ == '__main__':
    args = parse_args()
    prompt_file = get_prompt_file(args)
    context = load_context(prompt_file)

    context['input'] = args.input
    if context.get('agent') == 'chat':
        while True:
            if context['input']:
                input_text = context['input']
            else:
                input_text = input(f'{context["input_name"]}: ')
            context = load_context(prompt_file)
            context['input'] = input_text
            context = Agent.create(context).run()
            print(f'{context["output_name"]}: {context["output"]}')
            save_context()
    else:
        context = Agent.create(context).run()
        print(context['output'])
        save_context()
