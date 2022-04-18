from ruamel.yaml import YAML

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

    def keys(self):
        return self.context.keys()

    def set(self, text=None, source=None, dest='prompt'):
        text = text or self.get(source)
        self.context[dest] = text

    def append(self, text=None, source=None, dest='prompt'):
        text = text or self.get(source)
        self.context[dest] += text or ''

    def gpt_params(self):
        keys = ['engine', 'temperature', 'top_p', 'max_tokens', 'stop', 'suffix', 'presence_penalty', 'frequency_penalty']
        params = {k: v for k, v in self.context.items() if k in keys}
        params['prompt'] = self.context['prompt']
        return params
