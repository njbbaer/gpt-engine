
import unittest
from unittest.mock import patch, mock_open
from types import SimpleNamespace

from gpt_agent.agent import Agent

mock_completion = SimpleNamespace(choices=[SimpleNamespace(text=' foo')])


@patch('openai.Completion.create', return_value=mock_completion)
@patch('builtins.open', new_callable=mock_open())
class TestAgent(unittest.TestCase):
    def test_agent(self, mock_completion, mock_open):
        context = {
            'prompt': 'foo'
        }
        new_context = Agent.create(context).run()
        self.assertEqual(new_context['prompt'], 'foo foo')

    def test_chat(self, mock_completion, mock_open):
        context = {
            'agent': 'chat',
            'prompt': 'A conversation',
            'input_name': 'Human',
            'output_name': 'AI',
            'input': 'Hello',
        }
        new_context = Agent.create(context).run()
        self.assertEqual(new_context['prompt'], 'A conversation\nHuman: Hello\nAI: foo')
