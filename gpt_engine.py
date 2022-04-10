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

    def gpt_args(self):
        keys = ['engine', 'temperature', 'top_p', 'max_tokens', 'stop', 'suffix', 'presence_penalty', 'frequency_penalty']
        args = {k: v for k, v in self.context.items() if k in keys}
        args['prompt'] = self.context['prompt']
        return args


class Chat:
    def __init__(self):
        self.context = Context('context.yml')

    def complete(self):
        with open('debug.txt', 'w') as f:
            f.write(self.context.get('prompt'))

        args = self.context.gpt_args()
        return openai.Completion.create(**args).choices[0].text

    def speak(self):
        self.context.load()
        self.context.append(source='restart_text')
        self.context.append(source='input')
        self.context.append(source='inject_prompt')
        self.context.append(source='start_text')
        response = self.format_response(self.complete())
        self.context.load()
        self.context.append(source='restart_text')
        self.context.append(source='input')
        self.context.append(source='start_text')
        self.context.append(response)
        self.context.set(None, dest='input')
        self.context.save()
        return response

    def format_response(self, text):
        return " " + " ".join(text.split())


if '__main__' == __name__:
    chat = Chat()
    if chat.context.get('input'):
        chat.speak()
    else:
        response = chat.complete()
        print(response)
        chat.context.append(response)
        chat.context.save()
