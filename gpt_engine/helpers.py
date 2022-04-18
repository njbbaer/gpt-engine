from .engine import Chat, Engine


def execute(context):
    schema = context.get('schema')
    if schema == 'chat':
        engine_class = Chat
    else:
        engine_class = Engine
    engine = engine_class(context)
    engine.validate_keys()
    return engine.run()
