import openai
import os
from ruamel.yaml import YAML
import argparse

from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')

yaml = YAML()


def read_context(context_filepath):
    with open(context_filepath, 'r') as file:
        return yaml.load(file)


def write_context(context_filepath, context):
    with open(context_filepath, 'w') as file:
        yaml.dump(context, file)


def complete(context):
    context['prompt'] += context['config'].get('start_text', '')
    completion_args = {
        'engine': 'text-davinci-002',
        'prompt': context['prompt'],
        'temperature': context['config'].get('temperature'),
        'top_p': context['config'].get('top_p'),
        'max_tokens': context['config'].get('max_tokens'),
        'stop': context['config'].get('stop'),
        'suffix': context['config'].get('suffix'),
        'presence_penalty': context['config'].get('presence_penalty', 0),
        'frequency_penalty': context['config'].get('frequency_penalty', 0),
    }
    new_text = openai.Completion.create(**completion_args).choices[0].text
    print(new_text.strip())
    context['prompt'] += new_text + context['config'].get('restart_text', '')
    return context


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('-s', '--source', type=str)
    parser.add_argument('-c', '--context', type=str, default='context.yml')
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()

    if args.source:
        context = read_context(args.source)
        write_context(args.context, context)

    while True:
        text_input = input('> ')
        context = read_context(args.context)
        context['prompt'] += text_input
        context = complete(context)
        write_context(args.context, context)

        if not context['config'].get('continuous'):
            break
