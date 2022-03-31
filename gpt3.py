from ruamel.yaml import YAML
import openai
import os

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

    def get_config(self, key):
        return self.context['config'].get(key)

    def append(self, text=None, key=None):
        if text:
            self.context['prompt'] += text
        if key:
            self.context['prompt'] += self.get_config(key)

    def remove_last_line(self):
        prompt = self.context['prompt']
        self.context['prompt'] = prompt[:prompt.rfind('\n')]

    def complete(self):
        keys = ['engine', 'temperature', 'top_p', 'max_tokens', 'stop', 'suffix', 'presence_penalty', 'frequency_penalty']
        args = {k: v for k, v in self.context['config'].items() if k in keys}
        args['prompt'] = self.context['prompt']
        return openai.Completion.create(**args).choices[0].text


class Chat:
    def __init__(self):
        self.context = Context('context.yml')

    def speak(self, message):
        self.context.load()
        self.context.append(message, key='start_text')
        response = self.format_response(self.context.complete())
        self.context.append(response, key='restart_text')
        self.context.save()
        return response

    def summarize(self):
        self.context.load()
        self.context.remove_last_line()
        self.context.append(key='summarize_prompt')
        response = self.context.complete()
        self.context.append(response)
        self.context.save()

    def converse(self):
        while True:
            message = input('> ')
            response = self.speak(message)
            print(response)

    def format_response(self, text):
        return " " + " ".join(text.split())


if '__main__' == __name__:
    chat = Chat()
    chat.converse()
    # chat.summarize()
