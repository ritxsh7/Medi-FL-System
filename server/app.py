from flask import Flask, request, jsonify, send_file
from model.model import predict_image
import os
import shutil

app = Flask(__name__)

# Ensure the output directory exists
if not os.path.exists('static'):
    os.makedirs('static')

@app.route('/predict', methods=['POST'])
def predict():
    # Check if an image is part of the request
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    img_file = request.files['image']

    # Perform inference on the uploaded image
    path = predict_image(img_file)

    json_data = {
        'image_url': f"/static/{path}"  
    }

    try:
        shutil.rmtree(os.path.dirname(path))
        print("Deleted the runs folder after serving the image.")
    except Exception as e:
        print(f"Error deleting the folder: {e}")

    return jsonify(json_data)

@app.route('/static/<filename>')
def serve_image(filepath):
    # Serve the saved image when requested from the 'static' folder
    return send_file(filepath, mimetype='image/jpg')

if __name__ == "__main__":
    app.run(debug=True)
