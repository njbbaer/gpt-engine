import openai
import os
from ruamel.yaml import YAML
import argparse

from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')

yaml = YAML()


class Context():
    def __init__(self, context_filepath):
        self.context_filepath = context_filepath

    def load(self):
        with open(self.context_filepath, 'r') as f:
            self.context = yaml.load(f)

    def save(self):
        with open(self.context_filepath, 'w') as f:
            yaml.dump(self.context, f)

    def append(self, text):
        self.context['prompt'] += text

    def append_start_text(self, type):
        self.append(self.get_config(type).get('start_text', ''))

    def append_restart_text(self, type):
        self.append(self.get_config(type).get('restart_text', ''))

    def remove_restart_text(self, type):
        config = self.get_config(type)
        if self.context['prompt'].endswith(config.get('restart_text')):
            self.context['prompt'] = self.context['prompt'][:-len(config['restart_text'])]

    def get_config(self, type):
        return {**self.context['config']['default'], **self.context['config'][type]}

    def get_args(self, type):
        config = self.get_config(type)
        return {
            'engine': 'text-davinci-002',
            'prompt': self.context['prompt'],
            'temperature': config.get('temperature'),
            'top_p': config.get('top_p'),
            'max_tokens': config.get('max_tokens'),
            'stop': config.get('stop'),
            'suffix': config.get('suffix'),
            'presence_penalty': config.get('presence_penalty', 0),
            'frequency_penalty': config.get('frequency_penalty', 0),
        }


def complete(context, type):
    config = context.get_config(type)
    if config.get('remove_restart_text'):
        context.remove_restart_text('chat')
    context.append_start_text(type)
    new_text = openai.Completion.create(**context.get_args(type)).choices[0].text
    context.append(new_text)
    context.append_restart_text(type)
    print(new_text.strip())


def parse_args():
    parser = argparse.ArgumentParser()
    # parser.add_argument('-s', '--source', type=str)
    parser.add_argument('-c', '--context', type=str, default='context.yml')
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()
    context = Context(args.context)

    while True:
        text_input = input('> ')
        context.load()
        if text_input == '/summarize':
            complete(context, 'summarize')
        else:
            context.append(text_input)
            complete(context, 'chat')
        context.save()
