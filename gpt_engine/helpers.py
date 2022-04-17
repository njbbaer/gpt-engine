from .engine import Chat, Engine


def execute(context):
    schema = context.get('schema')
    if schema == 'chat':
        engine = Chat
    else:
        engine = Engine
    return engine(context).run()
