from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from datetime import datetime
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
model = os.getenv('LLM_MODEL', 'gpt-4')
openai_api_key = os.getenv('OPENAI_API_KEY')

if not openai_api_key:
    logger.error("OpenAI API key not found in environment variables!")

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400

        request_data = request.get_json()
        if not request_data:
            return jsonify({'error': 'Invalid JSON data'}), 400

        user_input = request_data.get('message')
        if not user_input:
            return jsonify({'error': 'No message provided'}), 400

        # Initialize chat history
        messages = request_data.get("messages", [])
        if not messages:
            messages.append(SystemMessage(content=f"The current date is: {datetime.now().date()}"))
        else:
            messages = [SystemMessage(content=msg) if isinstance(msg, str) else msg for msg in messages]

        # Add user message to chat history
        messages.append(HumanMessage(content=user_input))

        try:
            # Get response from the chatbot
            chatbot = ChatOpenAI(model=model, api_key=openai_api_key)
            response = chatbot(messages)

            # Add AI response to chat history
            messages.append(AIMessage(content=response.content))

            return jsonify({'response': response.content, 'messages': [msg.content for msg in messages]})
        
        except Exception as e:
            logger.error(f"Error calling OpenAI API: {str(e)}")
            return jsonify({'error': 'Failed to get response from AI service'}), 500

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == "__main__":
    # Add host parameter to make it accessible from other devices
    app.run(debug=True, host='0.0.0.0', port=5000)
