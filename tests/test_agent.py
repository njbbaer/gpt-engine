import pytest

from types import SimpleNamespace

from gpt_agent.agent import Agent
from gpt_agent.context import Context


@pytest.fixture
def mock_completion(mocker):
    completion = SimpleNamespace(choices=[SimpleNamespace(text=' foo')])
    mocker.patch('openai.Completion.create', return_value=completion)
    mocker.patch("builtins.open", mocker.mock_open())


def test_agent_1(mock_completion):
    context = Context({
        'agent': 'chat',
        'prompt': 'bar',
    })
    new_context = Agent(context).run()
    assert new_context['prompt'] == 'barfoo'


def test_agent_2(mock_completion):
    context = Context({
        'prompt': 'A conversation',
        'input_prefix': '\nHuman: ',
        'output_prefix': '\nAI: ',
        'input': 'Hello',
    })
    new_context = Agent(context).run()
    assert new_context['prompt'] == 'A conversation\nHuman: Hello\nAI: foo'


def test_agent_3(mock_completion):
    context = Context({
        'prompt': 'BASH shell',
        'input_prefix': '\n$ ',
        'output_prefix': '\n',
        'input': 'pwd',
    })
    new_context = Agent(context).run()
    assert new_context['prompt'] == 'BASH shell\n$ pwd\nfoo'


def test_missing_key():
    with pytest.raises(Exception) as exc_info:
        Agent(Context({})).run()
    assert 'missing key' in str(exc_info.value).lower()


def test_invalid_key():
    with pytest.raises(Exception) as exc_info:
        Agent(Context({'foo': 'bar'})).run()
    assert 'invalid key' in str(exc_info.value).lower()
