import json

from flask import Flask, request

from .agent import Agent

app = Flask(__name__)


@app.route("/api/run", methods=["POST"])
def run():
    try:
        context = Agent.create(request.json).run()
        return json.dumps(context)
    except Exception as e:
        return json.dumps({"error": str(e)}), 400
