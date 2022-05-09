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
    'max_tokens': 256,
    'input_prefix': '\\\\nHuman: ',
    'output_prefix': '\\\\nAI:',
    'stop': 'Human:',
  },
  'Stack Overflow': {
    'prompt': 'Stack Overflow is a website for professional programmers that features questions and answers on a wide range of topics in computer programming. The following question was answered with a thorough, well-written, and researched response.',
    'temperature': 0,
    'max_tokens': 512,
    'input_prefix': '\\\\n\\\\nQuestion:\\\\n\\\\n',
    'output_prefix': '\\\\n\\\\nBest Answer:',
    'stop': 'Question:',
  },
}
