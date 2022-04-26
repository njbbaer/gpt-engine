import pytest

from types import SimpleNamespace

from gpt_agent.agent import Agent
from gpt_agent.context import Context


@pytest.fixture
def mock_completion(mocker):
    completion = SimpleNamespace(choices=[SimpleNamespace(text=' foo')])
    mocker.patch('openai.Completion.create', return_value=completion)
    mocker.patch("builtins.open", mocker.mock_open())


def test_agent(mock_completion):
    context = Context({
        'prompt': 'foo'
    })
    new_context = Agent.create(context).run()
    assert new_context['prompt'] == 'foo foo'


def test_chat(mock_completion):
    context = Context({
        'agent': 'chat',
        'prompt': 'A conversation',
        'input_name': 'Human',
        'output_name': 'AI',
        'input': 'Hello',
    })
    new_context = Agent.create(context).run()
    assert new_context['prompt'] == 'A conversation\nHuman: Hello\nAI: foo'


def test_missing_key():
    with pytest.raises(Exception) as exc_info:
        Agent.create(Context({})).run()
    assert 'missing key' in str(exc_info.value).lower()


def test_invalid_key():
    with pytest.raises(Exception) as exc_info:
        Agent.create(Context({'foo': 'bar'})).run()
    assert 'invalid key' in str(exc_info.value).lower()
