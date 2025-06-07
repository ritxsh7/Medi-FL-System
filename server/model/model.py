from ultralytics import YOLO
from PIL import Image
import base64
import numpy as np
import os

# Load the YOLO model (make sure to update the path to your trained model)
model_path = "model/best_wt.pt"
model_path2 = "model/best_model.pt"
model = YOLO(model=model_path)
other_model = YOLO(model=model_path2)

def predict_image(img_file, session_id):
    try:
        print("Inside predict function")
        # print(session_id)


        # Open the image
        img = Image.open(img_file)

        # Perform inference with the YOLO model
        if(session_id == "WIFA"):
            results = model.predict(img, save=True)  # Inference
            
        else:
            results = other_model.predict(img, save=True)
            

        result = results[0]  # Get the first result object
        # Log prediction details for debugging
        boxes = result.boxes.xyxy
        classes = result.boxes.cls
        confidences = result.boxes.conf
        print(f"Boxes: {boxes}, Classes: {classes}, Confidences: {confidences}")

        # Get the path to the saved predicted image
        predicted_path = os.path.join(result.save_dir, os.path.basename(result.path))
        print(f"Predicted image path: {predicted_path}")

        # Open the predicted image and convert it to base64
        with open(predicted_path, 'rb') as image_file:
            # Read the image as bytes
            image_data = image_file.read()
            # Encode the image as base64
            base64_encoded = base64.b64encode(image_data).decode('utf-8')

        # Optional: Clean up the saved file to save disk space
        try:
            os.remove(predicted_path)
            print(f"Deleted predicted image file: {predicted_path}")
        except Exception as e:
            print(f"Error deleting predicted image file: {e}")

        return base64_encoded

    except Exception as e:
        raise Exception(f"Image prediction failed: {str(e)}")   