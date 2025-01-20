import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from tensorflow.keras.layers import  GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Sequential

import numpy as np
import os


IMG_SIZE = (64, 64)
BATCH_SIZE = 32
NUM_CLASSES = 5 

def create_model():
    
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMG_SIZE[0], IMG_SIZE[0], 3))

    base_model.trainable = False

    model = Sequential([
        base_model,
        GlobalAveragePooling2D(),
        Dense(128, activation='relu'),
        Dropout(0.5),
        Dense(NUM_CLASSES, activation='softmax')
    ])
    return model


def load_data(dir, split):

    filepaths = []
    labels = []

    dir = os.path.join(dir, split)

    if not os.path.exists(dir):
        raise FileNotFoundError(f"Directory not found: {dir}")
    
    folds = os.listdir(dir)
    for fold in folds:
        foldpath = os.path.join(dir, fold)
        
        # List all files in the class folder
        if os.path.isdir(foldpath):
            files = os.listdir(foldpath)
            for f in files:
                fpath = os.path.join(foldpath, f)
                
                # Add file path and label
                filepaths.append(fpath)
                labels.append(fold)

    # Create and return a DataFrame
    return pd.DataFrame(data={"filepaths": filepaths, "labels": labels})
