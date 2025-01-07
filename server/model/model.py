from ultralytics import YOLO
from PIL import Image
import cv2
import numpy as np
import os

# Load the YOLO model (make sure to update the path to your trained model)
model_path = "model/best.pt"
model = YOLO(model=model_path)

def predict_image(img_file):
    img = Image.open(img_file)

    # Perform inference with the YOLO model
    results = model.predict(img, save=True)  # Inference

    # Since 'results' is a list of Result objects, we access the first object
    result = results[0]  # Get the first result object
    
    # Bounding boxes (xyxy format) and class labels
    boxes = result.boxes.xyxy
    classes = result.boxes.cls
    confidences = result.boxes.conf
    path = os.path.join(result.save_dir, result.path)
    print(boxes, classes, confidences, path)

    # Return the path to the saved image
    return path
