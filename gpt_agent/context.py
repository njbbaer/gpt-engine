import json
from ruamel.yaml import YAML

yaml = YAML()
yaml.width = float('inf')


class Context:
    DEFAULTS = {
        'engine': 'text-davinci-002',
        'max_tokens': 256,
        'seperator': ': '
    }

    def __init__(self, context):
        self.context = context

    def __getitem__(self, key):
        value = self.context.get(key)
        if value is None:
            return self.DEFAULTS.get(key) or ''
        else:
            return value

    def __setitem__(self, key, value):
        self.context[key] = value

    def validate_keys(self, required_keys, permitted_keys):
        missing_keys = list(set(required_keys) - set(self.context.keys()))
        invalid_keys = list(set(self.context.keys()) - set(permitted_keys))
        if missing_keys and invalid_keys:
            raise Exception(f'Missing key(s): {missing_keys}, Invalid key(s): {invalid_keys}')
        elif missing_keys:
            raise Exception(f'Missing key(s): {missing_keys}')
        elif invalid_keys:
            raise Exception(f'Invalid key(s): {invalid_keys}')

    def gpt_params(self):
        keys = ['prompt', 'engine', 'temperature', 'top_p', 'max_tokens', 'stop', 'suffix', 'presence_penalty', 'frequency_penalty']
        params = {k: v for k, v in self.context.items() if k in keys}
        return {**self.DEFAULTS, **params}

    def export_json(self):
        return json.dumps(self.context)


class FileContext(Context):
    def __init__(self, sourcepath):
        self.load(sourcepath)
        self.save()

    def load(self, filepath=None):
        filepath = filepath or 'context.yml'
        with open(filepath, 'r') as f:
            self.context = yaml.load(f)

    def save(self):
        with open('context.yml', 'w') as f:
            yaml.dump(self.context, f)
