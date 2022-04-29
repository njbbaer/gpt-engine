import pytest

from types import SimpleNamespace

from gpt_agent.agent import Agent
from gpt_agent.context import Context


@pytest.fixture
def mock_completion(mocker):
    completion = SimpleNamespace(choices=[SimpleNamespace(text=' foo')])
    return mocker.patch('openai.Completion.create', return_value=completion)


def test_agent_basic(mock_completion):
    context = Context({'prompt': ''})
    new_context = Agent(context).run()
    mock_completion.assert_called_with(
        prompt='',
        engine='text-davinci-002',
        stop=[]
    )
    assert new_context['prompt'] == 'foo'


def test_agent_basic(mock_completion):
    context = Context({'prompt': ''})
    new_context = Agent(context).run()
    mock_completion.assert_called_with(
        prompt='',
        engine='text-davinci-002',
        stop=[]
    )
    assert new_context['prompt'] == 'foo'


def test_agent_chat(mock_completion):
    context = Context({
        'prompt': 'Conversation',
        'input_prefix': '\nHuman: ',
        'output_prefix': '\nAI: ',
        'input': 'Hello',
    })
    new_context = Agent(context).run()
    mock_completion.assert_called_with(
        prompt='Conversation\nHuman: Hello\nAI:',
        engine='text-davinci-002',
        stop=['Human:']
    )
    assert new_context['prompt'] == 'Conversation\nHuman: Hello\nAI: foo'


def test_agent_bash(mock_completion):
    context = Context({
        'prompt': 'BASH shell',
        'input_prefix': '\n$ ',
        'output_prefix': '\n',
        'input': 'pwd',
    })
    new_context = Agent(context).run()
    mock_completion.assert_called_with(
        prompt='BASH shell\n$ pwd',
        engine='text-davinci-002',
        stop=['$']
    )
    assert new_context['prompt'] == 'BASH shell\n$ pwd\nfoo'


def test_missing_key():
    with pytest.raises(Exception) as exc_info:
        Agent(Context({})).run()
    assert 'missing key' in str(exc_info.value).lower()


def test_invalid_key():
    with pytest.raises(Exception) as exc_info:
        Agent(Context({'foo': 'bar'})).run()
    assert 'invalid key' in str(exc_info.value).lower()
