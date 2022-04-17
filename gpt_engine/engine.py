import openai
import os

from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')


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
