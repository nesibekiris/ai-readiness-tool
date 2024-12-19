from flask import Flask, render_template, request, jsonify
import openai
import os

# Initialize Flask app
app = Flask(__name__)

# Set OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY") or "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"

@app.route('/')
def index():
    """
    Serve the main HTML page.
    """
    return render_template('index.html')

@app.route('/enhance', methods=['POST'])
def enhance():
    """
    Process the submitted checklist scores and fetch suggestions from OpenAI API.
    """
    try:
        # Get scores from the request
        data = request.get_json()
        prompt = (
            f"You are an AI readiness advisor. Based on the following scores: {data}, "
            "provide actionable suggestions to improve readiness in each category."
        )

        # Call OpenAI API
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=200,
            temperature=0.7
        )

        # Extract and return the message
        message = response.choices[0].text.strip()
        return jsonify({'message': message})

    except Exception as e:
        # Handle errors
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the app on the specified port (use 0.0.0.0 to make it externally accessible)
    app.run(host='0.0.0.0', port=5000, debug=True)
