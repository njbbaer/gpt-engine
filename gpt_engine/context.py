import io
from ruamel.yaml import YAML

yaml = YAML()
yaml.width = float('inf')


class Context:
    def __init__(self, yaml_string):
        self.context = yaml.load(yaml_string)
        self.replica = yaml.load(yaml_string)

    def export(self):
        buf = io.BytesIO()
        yaml.dump(self.replica, buf)
        return buf.getvalue().decode('utf-8')

    def get(self, key):
        return self.context.get(key)

    def keys(self):
        return self.context.keys()

    def set(self, text=None, source=None, dest='prompt', blind=False):
        text = text or self.get(source)
        self.context[dest] = text
        if not blind:
            self.replica[dest] = text

    def append(self, text=None, source=None, dest='prompt', blind=False):
        text = text or self.get(source)
        self.context[dest] += text or ''
        if not blind:
            self.replica[dest] += text or ''

    def gpt_params(self):
        keys = ['engine', 'temperature', 'top_p', 'max_tokens', 'stop', 'suffix', 'presence_penalty', 'frequency_penalty']
        params = {k: v for k, v in self.context.items() if k in keys}
        params['prompt'] = self.context['prompt']
        return params
