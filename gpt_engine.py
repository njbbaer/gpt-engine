from email.message import Message
from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import LiteralScalarString
import openai
import os
import textwrap

from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')

yaml = YAML()


class Context:
    def __init__(self, filepath):
        self.filepath = filepath
        self.load()

    def load(self):
        with open(self.filepath, 'r') as f:
            self.context = yaml.load(f)

    def save(self):
        with open(self.filepath, 'w') as f:
            yaml.dump(self.context, f)

    def get(self, key):
        return self.context.get(key)

    def set(self, text, dest='prompt', append=False):
        if append:
            self.context[dest] += text or ''
        else:
            self.context[dest] = text

    def copy(self, source, dest='prompt', append=False):
        source_value = self.context.get(source)
        self.set(source_value, dest, append)

    def complete(self):
        with open('debug.txt', 'w') as f:
            f.write(self.context['prompt'])

        keys = ['engine', 'temperature', 'top_p', 'max_tokens', 'stop', 'suffix', 'presence_penalty', 'frequency_penalty']
        args = {k: v for k, v in self.context.items() if k in keys}
        args['prompt'] = self.context['prompt']
        return openai.Completion.create(**args).choices[0].text


class Chat:
    def __init__(self):
        self.context = Context('context.yml')

    def speak(self):
        self.context.load()
        self.context.copy('restart_text', append=True)
        self.context.copy('input', append=True)
        self.context.copy('inject_prompt', append=True)
        self.context.copy('start_text', append=True)
        response = self.format_response(self.context.complete())
        self.context.load()
        self.context.copy('restart_text', append=True)
        self.context.copy('input', append=True)
        self.context.copy('start_text', append=True)
        self.context.set(response, append=True)
        self.context.set(None, 'input')
        self.context.save()
        return response

    def format_response(self, text):
        return " " + " ".join(text.split())


if '__main__' == __name__:
    chat = Chat()
    chat.speak()
