from .context import Context
from .helpers import execute

context = Context('context.yml')
output = execute(context)
print(output)
