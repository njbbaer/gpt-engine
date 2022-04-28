import json

from flask import Flask, request

from .agent import Agent
from .context import Context

app = Flask(__name__)


@app.route("/api/run", methods=["POST"])
def run():
    try:
        context = Context(request.json)
        Agent(context).run()
        return context.export_json()
    except Exception as e:
        return json.dumps({"error": str(e)}), 400
