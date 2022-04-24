# GPT Agent

GPT Agent is Python application to execute prompts for the language model GPT-3 by OpenAI.

Prompts are described in either JSON or YAML:

```yaml
agent: chat
output_name: AI
input_name: Human
prompt: |-
  The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.

  Human: Hello, who are you?
  AI: I am an AI created by OpenAI. How can I help you today?
  Human: Hi
  AI: Hello! How can I help you today?
input:
```
