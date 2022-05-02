import json

from flask import Flask, request, render_template

from .agent import Agent
from .context import Context
from .constants import INPUT_FIELDS

app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', input_fields=INPUT_FIELDS)


@app.route('/api', methods=['POST'])
def run():
    try:
        context = Context(request.json)
        Agent(context).run()
        return context.export_json()
    except Exception as e:
        return json.dumps({"error": str(e)}), 400
