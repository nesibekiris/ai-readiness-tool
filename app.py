import os
from flask import Flask, request, jsonify, render_template
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

@app.route("/")
def index():
    """Render the main page."""
    return render_template("index.html")

@app.route("/enhance", methods=["POST"])
def enhance():
    """Provide detailed suggestions for AI readiness improvement."""
    try:
        # Extract data from the request
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Format scores into a readable message for the AI
        formatted_scores = "\n".join([f"{key}: {value}" for key, value in data.items()])

        # Create a prompt for actionable insights
        prompt = (
            f"You are an AI readiness advisor. Based on the following scores:\n"
            f"{formatted_scores}\n\n"
            f"Provide detailed suggestions to improve readiness in each category. "
            f"Also, be prepared to answer any related follow-up questions from the user."
        )

        # Call OpenAI API for a response
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.7,
            max_tokens=1000,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
        )

        suggestions = response.choices[0].text.strip()
        return jsonify({"message": suggestions}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route("/chat", methods=["POST"])
def chat():
    """Chatbox endpoint for user queries."""
    try:
        # Extract the user's question from the request
        user_query = request.get_json().get("query")
        if not user_query:
            return jsonify({"error": "No query provided"}), 400

        # Create a tailored prompt for the chat functionality
        prompt = (
            f"You are an AI readiness advisor. A user has asked the following question:\n\n"
            f"{user_query}\n\n"
            f"Provide a detailed and actionable response that aligns with best practices in AI policy readiness. "
            f"If possible, include examples and links to relevant resources."
        )

        # Call OpenAI API to generate a response
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.7,
            max_tokens=1000,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
        )

        answer = response.choices[0].text.strip()
        return jsonify({"message": answer}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
