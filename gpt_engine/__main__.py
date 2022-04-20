from .context import Context
from .engine import Chat, Engine

with open('context.yml', 'r') as f:
    yaml_string = f.read()

context = Context(yaml_string)
output = Engine.create(context).run()
print(output)

with open('context.yml', 'w') as f:
    f.write(context.export())
