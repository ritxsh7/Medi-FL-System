from PIL import Image

def preprocess_image(img_file):
    img = Image.open(img_file)
    img = img.resize((640, 640))  # Resize image to match YOLO's input size
    return img
