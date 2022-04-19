import openai
import os
from ruamel.yaml import YAML
from dotenv import load_dotenv
from datetime import datetime

yaml = YAML()

load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')


class Engine:
    REQUIRED_KEYS = ['engine', 'prompt']
    PERMITTED_KEYS = [
        'blind_prompt',
        'engine',
        'frequency_penalty',
        'input',
        'input_name',
        'max_tokens',
        'presence_penalty',
        'prompt',
        'response_name',
        'schema',
        'stop',
        'suffix',
        'temperature',
        'top_p',
        'total_cost',
    ]

    def __init__(self, context):
        self.context = context

    def run(self):
        response = self._complete()
        self.context.append(response)
        self.context.save()
        return response

    def validate_keys(self):
        self._validate_required_keys()
        self._validate_permitted_keys()

    def _complete(self, custom_args={}):
        args = {**self.context.gpt_params(), **custom_args}
        output = openai.Completion.create(**args).choices[0].text
        self._write_to_log(args, output)
        return output

    def _validate_permitted_keys(self):
        invalid_keys = list(set(self.context.keys()) - set(self.PERMITTED_KEYS))
        if invalid_keys:
            raise Exception(f'Invalid keys: {invalid_keys}')

    def _validate_required_keys(self):
        missing_keys = list(set(self.REQUIRED_KEYS) - set(self.context.keys()))
        if missing_keys:
            raise Exception(f'Missing keys: {missing_keys}')

    def _write_to_log(self, args, output):
        entry = [{
            'timestamp': datetime.now(),
            'input': args,
            'output': output,
        }]
        with open('log.yml', 'a') as f:
            yaml.dump(entry, f)


class Chat(Engine):
    REQUIRED_KEYS = ['engine', 'input_name', 'prompt', 'response_name']

    def run(self):
        self.context.load()
        self.context.append(self._input_prompt())
        self.context.append(source='blind_prompt')
        self.context.append(self._response_prompt())
        raw_response = self._complete({'stop': self._stop_text()})
        response = self._format_response(raw_response)
        self.context.load()
        self.context.append(self._input_prompt())
        self.context.append(self._response_prompt())
        self.context.append(response)
        self.context.set(None, dest='input')
        self.context.save()
        return response

    def _format_response(self, text):
        return " " + " ".join(text.split())

    def _input_prompt(self):
        if self.context.get("input"):
            return f'\n{self.context.get("input_name")}: {self.context.get("input")}'
        else:
            return ''

    def _response_prompt(self):
        return f'\n{self.context.get("response_name")}:'

    def _stop_text(self):
        return f'{self.context.get("input_name")}:'
