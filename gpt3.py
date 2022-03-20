import openai
import os
import yaml

from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def read_config(config_filepath):
    with open(config_filepath, 'r') as file:
        return yaml.safe_load(file)


def read_context(context_filepath):
    if os.path.isfile(context_filepath):
        with open(context_filepath, "r") as file:
            return file.read()


def write_context(context_filepath, context):
    with open(context_filepath, "w") as file:
        file.write(context)


def complete(config, context):
    context += config["start_text"]
    new_text = openai.Completion.create(
        engine="text-davinci-002",
        prompt=context,
        temperature=config["temperature"],
        max_tokens=config["max_tokens"],
        stop=config["stop"],
    ).choices[0].text
    print(f'Generated {int(len(new_text) / 4)} tokens')
    context += new_text + config["restart_text"]

    return context


if __name__ == "__main__":
    config = read_config('chat.yml')
    context = read_context('context.txt')
    if context:
        context = complete(config, context)
    else:
        context = config['prompt']
    write_context('context.txt', context)
