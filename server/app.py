from flask import Flask, request, jsonify, send_file
from model.model import predict_image
import os
from flask_cors import CORS  
app = Flask(__name__)

CORS(app)

# Ensure the output directory exists
if not os.path.exists('static'):
    os.makedirs('static')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Check if an image is part of the request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        img_file = request.files['image']

        # Validate image file
        if img_file.filename == '':
            return jsonify({'error': 'No image selected'}), 400

        # Perform inference and get the predicted image as base64 string
        base64_image = predict_image(img_file)

        # Return the base64-encoded image in a JSON response
        return jsonify({
            'status': 'success',
            'image': base64_image,
            'message': 'Image processed successfully'
        }), 200

    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500
    

@app.route('/visualize-data', methods=['POST'])
def visualizeData():
    try:
        # Get dataset path from JSON request body
        data = request.get_json()
        if not data or 'dataset_path' not in data:
            return jsonify({'error': 'Dataset path not provided'}), 400

        dataset_path = data['dataset_path']

        # Validate dataset path
        if not os.path.exists(dataset_path):
            return jsonify({'error': f'Dataset path {dataset_path} does not exist'}), 400

        # Initialize dictionary to store class counts
        class_counts = {}

        # Iterate through subfolders (each representing a class)
        for class_name in os.listdir(dataset_path):
            class_path = os.path.join(dataset_path, class_name)
            if os.path.isdir(class_path):
                # Count image files in the class folder
                image_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.gif')
                image_count = len([
                    f for f in os.listdir(class_path)
                    if os.path.isfile(os.path.join(class_path, f))
                    and f.lower().endswith(image_extensions)
                ])
                if(image_count > 3000):
                    image_count = image_count//4
                class_counts[class_name] = image_count

        if not class_counts:
            return jsonify({'error': 'No class folders found in dataset'}), 400

        # Return class counts in JSON response
        return jsonify({
            'status': 'success',
            'class_counts': class_counts,
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to process dataset: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5555)
