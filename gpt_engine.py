from ruamel.yaml import YAML
import openai
import os

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

    def set(self, text=None, source=None, dest='prompt'):
        text = text or self.get(source)
        self.context[dest] = text

    def append(self, text=None, source=None, dest='prompt'):
        text = text or self.get(source)
        self.context[dest] += text or ''

    def gpt_params(self):
        params = self.context.get('gpt_params')
        params['prompt'] = self.context['prompt']
        return params


class Engine:
    def __init__(self, context):
        self.context = context

    def run(self):
        response = self.complete()
        self.context.append(response)
        self.context.save()
        return response

    def complete(self, custom_args={}):
        with open('debug.txt', 'w') as f:
            f.write(self.context.get('prompt'))

        args = {**self.context.gpt_params(), **custom_args}
        return openai.Completion.create(**args).choices[0].text


class Chat(Engine):
    def run(self):
        self.context.load()
        self.context.append(self.input_prompt())
        self.context.append(source='blind_prompt')
        self.context.append(self.response_prompt())
        raw_response = self.complete({'stop': self.stop_text()})
        response = self.format_response(raw_response)
        self.context.load()
        self.context.append(self.input_prompt())
        self.context.append(self.response_prompt())
        self.context.append(response)
        self.context.set(None, dest='input')
        self.context.save()
        return response

    def format_response(self, text):
        return " " + " ".join(text.split())

    def input_prompt(self):
        if self.context.get("input"):
            return f'\n{self.context.get("input_name")}: {self.context.get("input")}'
        else:
            return ''

    def response_prompt(self):
        return f'\n{self.context.get("response_name")}:'

    def stop_text(self):
        return f'{self.context.get("input_name")}:'


class GPTEngine:
    def __init__(self, filepath):
        self.context = Context(filepath)

    def run(self):
        if self.context.get('engine') == 'chat':
            return Chat(self.context).run()
        else:
            return Engine(self.context).run()


if '__main__' == __name__:
    gpt_engine = GPTEngine('context.yml')
    print(gpt_engine.run())
