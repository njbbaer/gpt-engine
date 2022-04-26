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
        'output',
        'output_name',
        'presence_penalty',
        'prompt',
        'agent',
        'start_text',
        'stop',
        'suffix',
        'temperature',
        'top_p',
    ]

    @staticmethod
    def create(context):
        agent = context['agent']
        if agent == 'chat':
            agent_class = Chat
        elif not agent:
            agent_class = Agent
        else:
            raise Exception(f'Invalid agent: {agent}')
        return agent_class(context)

    def __init__(self, context):
        self.context = context
        self.context.validate_keys(self.REQUIRED_KEYS, self.PERMITTED_KEYS)

    def run(self):
        self.context['prompt'] += self.context['input']
        self.context['prompt'] += self.context['start_text']
        output = self._complete()
        self.context['prompt'] += output + self.context['restart_text']
        return self.context

    def run_cli(self, args):
        self.context['input'] = args.input
        self.run()
        print(self.context['output'])
        self.context.save()

    def _complete(self, override={}):
        args = {**self.DEFAULTS, **self.context.gpt_params(), **override}
        output = openai.Completion.create(**args).choices[0].text
        self.context['output'] = output.lstrip()
        self._write_log(args['prompt'])
        return output

    def _write_log(self, prompt):
        output = self.context['output']
        entry = [{
            'timestamp': datetime.now(),
            'prompt': LiteralScalarString(prompt),
            'output': LiteralScalarString(output),
        }]
        with open('log.yml', 'a') as f:
            yaml.dump(entry, f)


class Chat(Agent):
    REQUIRED_KEYS = ['prompt', 'input_name', 'output_name']

    def run(self):
        temp_prompt = self.context['prompt'] + \
            self._input_prompt() + \
            self.context['blind_prompt'] + \
            self._response_prompt()
        raw_response = self._complete({
            'prompt': temp_prompt,
            'stop': f'{self.context["input_name"]}:'
        })
        response = self._format_response(raw_response)
        self.context['prompt'] += self._input_prompt() + self._response_prompt() + response
        self.context['input'] = None
        return self.context

    def run_cli(self, args):
        input_arg = args.input
        while True:
            input_text = input_arg or input(f'{self.context["input_name"]}: ')
            input_arg = None
            self.context.load()
            self.context['input'] = input_text
            self.run()
            print(f'{self.context["output_name"]}: {self.context["output"]}')
            self.context.save()

    def _format_response(self, text):
        return " " + " ".join(text.split())

    def _input_prompt(self):
        if self.context['input']:
            return f'\n{self.context["input_name"]}: {self.context["input"]}'
        else:
            return ''

    def _response_prompt(self):
        return f'\n{self.context["output_name"]}:'
