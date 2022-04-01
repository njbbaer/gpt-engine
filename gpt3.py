from email.message import Message
from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import LiteralScalarString
import openai
import os
import textwrap

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

    def set(self, text, dest='prompt', replace=False):
        if replace:
            self.context[dest] = text
        else:
            self.context[dest] += text

    def copy(self, source, dest='prompt', replace=False):
        self.set(self.context[source], dest, replace)

    def remove_last_line(self):
        prompt = self.context['prompt']
        self.context['prompt'] = prompt[:prompt.rfind('\n')]

    def complete(self):
        keys = ['engine', 'temperature', 'top_p', 'max_tokens', 'stop', 'suffix', 'presence_penalty', 'frequency_penalty']
        args = {k: v for k, v in self.context.items() if k in keys}
        args['prompt'] = self.context['prompt']
        return openai.Completion.create(**args).choices[0].text


class Chat:
    def __init__(self):
        self.context = Context('context.yml')

    def speak(self, message):
        self.context.load()
        self.context.set(message)
        self.context.copy('start_text')
        response = self.format_response(self.context.complete())
        self.context.set(response)
        self.context.copy('restart_text')
        self.context.save()
        return response

    def summarize(self):
        self.context.load()
        self.context.remove_last_line()
        self.context.copy('summarize_prompt')
        response = self.format_response(self.context.complete())
        summary_yaml = LiteralScalarString(textwrap.dedent(response))
        self.context.load()
        self.context.set(summary_yaml, 'summary', replace=True)
        self.context.save()
        return response

    def converse(self):
        while True:
            message = input('> ')
            if message == '/summarize':
                response = self.summarize()
            else:
                response = self.speak(message)
            print(response)

    def format_response(self, text):
        return " " + " ".join(text.split())


if '__main__' == __name__:
    chat = Chat()
    chat.converse()
    # chat.summarize()
