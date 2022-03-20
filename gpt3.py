import openai
import os
from ruamel.yaml import YAML

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
    new_text = openai.Completion.create(
        engine='text-davinci-002',
        prompt=context['prompt'],
        temperature=context['config']['temperature'],
        max_tokens=context['config']['max_tokens'],
        stop=context['config'].get('stop'),
    ).choices[0].text
    print(new_text.strip())
    context['prompt'] += new_text + context['config'].get('restart_text', '')
    return context


if __name__ == '__main__':
    if not os.path.isfile('context.yml'):
        context = read_context('prompts/summarize.yml')
        write_context('context.yml', context)

    while True:
        text_input = input('> ')
        context = read_context('context.yml')
        context['prompt'] += text_input
        context = complete(context)
        write_context('context.yml', context)

        if not context['config'].get('continuous', False):
            break
