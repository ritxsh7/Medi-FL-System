import flwr as fl
import argparse
from tensorflow.keras.optimizers import Adamax
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from utils import create_model, load_data
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

import io
import logging
import sys

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

# Parse arguments
parser = argparse.ArgumentParser(description="Federated Learning Client")
parser.add_argument("--dir", type=str, required=True, help="Specify the data directory")
args = parser.parse_args()

dir = args.dir

IMG_SIZE = (64, 64)
BATCH_SIZE = 32

# Create data generators
datagen = ImageDataGenerator(rescale=1.0/255.0)

# Load train data
client_train = load_data(dir, split='train')
client_valid = load_data(dir, split='valid')

count = client_train['labels'].value_counts()

client_train_gen = datagen.flow_from_dataframe(
    client_train,
    x_col = "filepaths",
    y_col = "labels",
    target_size = IMG_SIZE,
    color_mode = "rgb",
    class_mode="categorical",
    batch_size = BATCH_SIZE
)

client_valid_gen = datagen.flow_from_dataframe(
    client_valid,
    x_col = "filepaths",
    y_col = "labels",
    target_size = IMG_SIZE,
    color_mode = "rgb",
    class_mode="categorical",
    batch_size = BATCH_SIZE
)

# Weights
train_labels = client_train_gen.classes
class_weights = compute_class_weight(class_weight='balanced', classes=np.unique(train_labels), y=train_labels)
class_weights = dict(enumerate(class_weights))


results_list = []

class FlwrClient(fl.client.NumPyClient):
    def __init__(self, model, train_gen, test_gen):
        self.model = model
        self.train_gen = train_gen
        self.test_gen = test_gen

    def get_parameters(self, config):
        # Display server metrics if available
        if "server_metrics" in config:
            server_metrics = config["server_metrics"]
            print(f"Received server metrics: {server_metrics}")
        return self.model.get_weights()

    def fit(self, parameters, config):
        # Update model weights
        self.model.set_weights(parameters)

        # Train locally
        history = self.model.fit(self.train_gen, epochs=1, verbose=1)
        results = {
            "loss": history.history["loss"][0],
            "accuracy": history.history["accuracy"][0],
        }
        print("Training Metrics, Accuracy = {}, Loss = {}".format(results['accuracy'], results['loss']))
        results_list.append(results)

        # Return metrics to server
        return self.model.get_weights(), len(self.train_gen), results

    def evaluate(self, parameters, config):
        # Evaluate on test data
        self.model.set_weights(parameters)
        loss, accuracy = self.model.evaluate(self.test_gen)
        print("Validation Metrics, Accuracy = {}, Loss = {}".format(accuracy, loss))
        num_examples_test = len(self.test_gen)
        return loss, num_examples_test, {"accuracy": accuracy}

    

model = create_model()
model.compile(optimizer="adam", loss='categorical_crossentropy', metrics=['accuracy'])

client = FlwrClient(model, client_train_gen, client_valid_gen)
fl.client.start_client(server_address="localhost:8080", client=client)
