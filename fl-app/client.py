import tensorflow as tf
import flwr as fl
import numpy as np
import logging
from tensorflow.keras.optimizers import Adamax
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from utils import create_model, load_train_data,load_test_data
import sys
import io
import logging
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--client_id", type=int, required=True, help="Unique ID for the client")
args = parser.parse_args()
client_id = args.client_id

# Set UTF-8 as the default encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s]: %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
    ],
    encoding='utf-8',
)

# Create the logger
fl_logger = logging.getLogger("flwr")
fl_logger.setLevel(logging.INFO)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

class NoWarningsFilter(logging.Filter):
    def filter(self, record):
        return record.levelno < logging.WARNING
    
console_handler.addFilter(NoWarningsFilter())
fl_logger.addHandler(console_handler)


# Create data generators
datagen = ImageDataGenerator(rescale=1.0/255.0)

# Load train data
client1_train = load_train_data()
client1_test = load_test_data()

count = client1_train['labels'].value_counts()

client1_train_gen = datagen.flow_from_dataframe(
    client1_train,
    x_col = "filepaths",
    y_col = "labels",
    target_size = (244,244),
    color_mode = "rgb",
    class_mode="categorical",
    batch_size = 32
)

client1_test_gen = datagen.flow_from_dataframe(
    client1_test,
    x_col = "filepaths",
    y_col = "labels",
    target_size = (244,244),
    color_mode = "rgb",
    class_mode="categorical",
    batch_size = 32
)


results_list = []

class FlwrClient(fl.client.NumPyClient):
    def __init__(self, model, train_gen, test_gen):
        self.model = model
        self.train_gen = train_gen
        self.test_gen = test_gen

    def get_parameters(self, config):
        return self.model.get_weights()

    def fit(self, parameters, config):
        self.model.set_weights(parameters)
        history = self.model.fit(self.train_gen, epochs = 1)
        results = {"loss": history.history["loss"][0], "accuracy": history.history["accuracy"][0]}
        print("Training Metrics, Accuracy = {}, Loss = {}".format(results['accuracy'], results['loss']))
        results_list.append(results)
        return self.model.get_weights(), len(self.train_gen),results

    def evaluate(self, parameters, config):
        self.model.set_weights(parameters)
        loss, accuracy = self.model.evaluate(self.test_gen)
        print("Validation Metrics, Accuracy = {}, Loss = {}".format(accuracy, loss))
        num_examples_test = len(self.test_gen)
        return loss, num_examples_test, {"accuracy": accuracy}
    

model = create_model()
model.compile(optimizer="adam", loss='categorical_crossentropy', metrics=['accuracy'])

client = FlwrClient(model, client1_train_gen, client1_test_gen)

# Start the Flower client to connect to the Flower server
fl.client.start_numpy_client(server_address="127.0.0.1:8080", client=client)
