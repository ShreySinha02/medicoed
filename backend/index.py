from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import PyPDF2
from openai import OpenAI
import os
import json
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI API key

client = OpenAI(
	base_url="https://api-inference.huggingface.co/v1/",
	api_key=os.environ.get("OPENAI_API_KEY")
)
# client = OpenAI(
#     api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
# )
# In-memory storage for processed PDFs
pdf_contents = {}

@app.route('/api/upload-and-chat', methods=['POST'])
def upload_and_chat():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and file.filename.endswith('.pdf'):
        # Process PDF
        pdf_reader = PyPDF2.PdfReader(file)
        content = ""
        for page in pdf_reader.pages:
            content += page.extract_text() + "\n"
        
        # Store processed content
        pdf_contents[file.filename] = content
        
        return jsonify({"message": "PDF uploaded and processed successfully"}), 200
    
    return jsonify({"error": "Invalid file format"}), 400

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    if 'filename' not in data or 'message' not in data:
        return jsonify({"error": "Missing filename or message"}), 400
    
    filename = data['filename']
    user_message = data['message']
    
    if filename not in pdf_contents:
        return jsonify({"error": "PDF not found"}), 404
    
    
    def generate():
        try:
            response = client.chat.completions.create(
            model="meta-llama/Llama-3.2-3B-Instruct",  # Use the appropriate model
            messages=[
                {"role": "user", "content": f"Based on the following PDF content:\n\n{pdf_contents[filename][:2000]}\n\nUser: {user_message}\nAI:"}
            ],
            max_tokens=500,
            )
            message_content = response.choices[0].message.content
            print(message_content)
            if message_content:
                yield json.dumps({"type":"server","message": message_content}) 
            else:
                yield json.dumps({"error": "No content found in response."}) + "\n"

        except Exception as e:
            yield json.dumps({"error": str(e)}) + "\n"

    return Response(stream_with_context(generate()), content_type='application/json')

if __name__ == '__main__':
    app.run(debug=True)