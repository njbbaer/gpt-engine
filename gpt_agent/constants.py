INPUT_FIELDS = [
  {
    'key': 'engine',
    'label': 'Engine',
  },
  {
    'key': 'max_tokens',
    'label': 'Max Tokens',
  },
  {
    'key': 'temperature',
    'label': 'Temperature',
  },
  {
    'key': 'stop',
    'label': 'Stop Sequences',
  },
  {
    'key': 'input_prefix',
    'label': 'Input Prefix',
  },
  {
    'key': 'output_prefix',
    'label': 'Output Prefix',
  },
]

TEMPLATES = {
  'Chat': {
    'prompt': 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\\n\\nHuman: Hello, who are you?\\nAI: I am an AI created by OpenAI. How can I help you today?',
    'input_prefix': '\\\\nHuman: ',
    'output_prefix': '\\\\nAI:',
    'stop': 'Human:',
    'max_tokens': 128,
  },
}
