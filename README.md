# GPT Engine

GPT Engine is a prompt-based file format and execution engine for the natural language model GPT-3 by OpenAI.

Prompts are defined in YAML files called contexts:

```yaml
config:
  temperature: 0.9
  max_tokens: 128
  stop: "\n"
  start_text: "\nAI:"
  restart_text: "\nHuman: "
  continuous: True
prompt: |-
  The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.

  Human: Hello, who are you?
  AI: I am an AI created by OpenAI. How can I help you today?
  Human: 
```
