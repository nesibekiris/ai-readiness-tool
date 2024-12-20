import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Flask app setup
app = Flask(__name__)
CORS(app)

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/create_assistant", methods=["POST"])
def create_assistant():
    """Create a custom assistant with tools and instructions."""
    try:
        data = request.json
        response = openai.Assistant.create(
            model=data.get("model", "gpt-4o"),
            name=data.get("name", "Custom Assistant"),
            instructions=data.get(
                "instructions",
                "You are an assistant designed to provide insights and handle requests."
            ),
            tools=data.get("tools", []),
            temperature=data.get("temperature", 0.7)
        )
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/retrieve_assistant/<assistant_id>", methods=["GET"])
def retrieve_assistant(assistant_id):
    """Retrieve assistant details by ID."""
    try:
        response = openai.Assistant.retrieve(assistant_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/modify_assistant/<assistant_id>", methods=["POST"])
def modify_assistant(assistant_id):
    """Modify an existing assistant's configuration."""
    try:
        data = request.json
        response = openai.Assistant.modify(
            assistant_id,
            instructions=data.get("instructions"),
            tools=data.get("tools", []),
            temperature=data.get("temperature", 0.7)
        )
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/delete_assistant/<assistant_id>", methods=["DELETE"])
def delete_assistant(assistant_id):
    """Delete an assistant by ID."""
    try:
        response = openai.Assistant.delete(assistant_id)
        return jsonify({"message": "Assistant deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/chat/<assistant_id>", methods=["POST"])
def chat_with_assistant(assistant_id):
    """Chat with an assistant using its ID."""
    try:
        data = request.json
        query = data.get("query", "")
        if not query:
            return jsonify({"error": "No query provided"}), 400

        response = openai.Completion.create(
            model="gpt-4o",
            prompt=f"Assistant {assistant_id} received the query: {query}",
            temperature=0.7,
            max_tokens=150
        )
        return jsonify({"response": response.choices[0].text.strip()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Run the Flask app
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
