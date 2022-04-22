import openai
import os

from datetime import datetime
from dotenv import load_dotenv
from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import LiteralScalarString

openai.api_key = os.getenv('OPENAI_API_KEY')

yaml = YAML()
yaml.width = float('inf')

load_dotenv()


class Agent:
    DEFAULTS = {
        'engine': 'text-davinci-002',
        'max_tokens': 256,
    }

    REQUIRED_KEYS = ['prompt']
    PERMITTED_KEYS = [
        'blind_prompt',
        'engine',
        'frequency_penalty',
        'input',
        'input_name',
        'max_tokens',
        'output_name',
        'presence_penalty',
        'prompt',
        'agent',
        'stop',
        'suffix',
        'temperature',
        'top_p',
    ]

    @staticmethod
    def create(context):
        if context.get('agent') == 'chat':
            agent_class = Chat
        else:
            agent_class = Agent
        return agent_class(context)

    def __init__(self, context):
        self.context = context
        self._validate_keys()

    def run(self):
        self.context['prompt'] += self.context.get('start_text') or ''
        output = self._complete()
        self.context['prompt'] += output + (self.context.get('restart_text') or '')
        return self.context

    def _complete(self, override={}):
        keys = ['prompt', 'engine', 'temperature', 'top_p', 'max_tokens', 'stop', 'suffix', 'presence_penalty', 'frequency_penalty']
        params = {k: v for k, v in self.context.items() if k in keys}
        args = {**self.DEFAULTS, **params, **override}
        output = openai.Completion.create(**args).choices[0].text
        self._write_log(args['prompt'], output)
        return output

    def _write_log(self, prompt, output):
        entry = [{
            'timestamp': datetime.now(),
            'prompt': LiteralScalarString(prompt),
            'output': LiteralScalarString(output.lstrip()),
        }]
        with open('log.yml', 'a') as f:
            yaml.dump(entry, f)

    def _validate_keys(self):
        missing_keys = list(set(self.REQUIRED_KEYS) - set(self.context.keys()))
        invalid_keys = list(set(self.context.keys()) - set(self.PERMITTED_KEYS))
        if missing_keys and invalid_keys:
            raise Exception(f'Missing key(s): {missing_keys}, Invalid key(s): {invalid_keys}')
        elif missing_keys:
            raise Exception(f'Missing key(s): {missing_keys}')
        elif invalid_keys:
            raise Exception(f'Invalid key(s): {invalid_keys}')


class Chat(Agent):
    REQUIRED_KEYS = ['prompt', 'input_name', 'output_name']

    def run(self):
        temp_prompt = self.context['prompt'] + self._input_prompt() + (self.context.get('blind_prompt') or '') + self._response_prompt()
        raw_response = self._complete({'prompt': temp_prompt, 'stop': self._stop_text()})
        response = self._format_response(raw_response)
        self.context['prompt'] += self._input_prompt() + self._response_prompt() + response
        self.context['input'] = None
        return self.context

    def _format_response(self, text):
        return " " + " ".join(text.split())

    def _input_prompt(self):
        if self.context.get('input'):
            return f'\n{self.context["input_name"]}: {self.context["input"]}'
        else:
            return ''

    def _response_prompt(self):
        return f'\n{self.context["output_name"]}:'

    def _stop_text(self):
        return f'{self.context["input_name"]}:'
