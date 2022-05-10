import json
import openai
import os

from flask import Flask, request, render_template

from .constants import INPUT_FIELDS, TEMPLATES

openai.api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html', param_fields=INPUT_FIELDS, templates=TEMPLATES)


@app.route('/api', methods=['POST'])
def run():
    try:
        return openai.Completion.create(**request.json)
    except Exception as e:
        return json.dumps({"error": str(e)}), 400
