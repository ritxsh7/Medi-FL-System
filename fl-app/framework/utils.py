import tensorflow as tf
import os
import pandas as pd
import numpy as np


def create_model():
    model = tf.keras.models.Sequential([
        tf.keras.layers.Conv2D(32, (3, 3), activation="relu", input_shape=(244, 244, 3)),  # Adjust input shape here
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(64, activation="relu"),
        tf.keras.layers.Dense(4, activation="softmax")  # 4 classes
    ])
    return model

script_dir = os.path.dirname(os.path.abspath(__file__))

train_dir = os.path.abspath(os.path.join(script_dir, "../data/Training"))
test_dir = os.path.abspath(os.path.join(script_dir, "../data/Testing"))


def load_data(dir):
    filepaths = []
    labels = []


    folds = os.listdir(dir)

    for fold in folds:
        foldpath = os.path.join(dir, fold)
        
        files = os.listdir(foldpath)
        for f in files:
            fpath = os.path.join(foldpath, f)
            
            filepaths.append(fpath)
            labels.append(fold)

    return pd.DataFrame(data={'filepaths':filepaths, 'labels':labels})


def load_train_data():
    client_data = load_data(train_dir)
    return client_data.sample(frac=0.5, random_state=np.random.randint(1, 100))
    

def load_test_data():
    return load_data(test_dir)