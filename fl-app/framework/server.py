import flwr as fl
import logging
from tensorflow.keras.optimizers import Adamax
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from utils import create_model
from typing import Dict, Optional, Tuple


import sys
import io
import logging

# Set UTF-8 as the default encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


# Configure logging to only show INFO messages
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(message)s",
    handlers=[logging.StreamHandler()],
)

# Disable Flower's default logging

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



# Create a test generator for evaluation
def create_test_generator(test_dir):
    datagen = ImageDataGenerator(rescale=1.0/255.0)
    return datagen.flow_from_directory(
        test_dir,
        target_size=(244, 244),
        batch_size=32,
        class_mode='categorical',
        shuffle=False
    )


results_list = []

# Define evaluation function for server-side evaluation
def get_eval_fn(model):
    test_dir = "data/Testing"
    test_gen = create_test_generator(test_dir)

    def evaluate(
        server_round: int,
        parameters: fl.common.NDArrays,
        config: Dict[str, fl.common.Scalar],
    ) -> Optional[Tuple[float, Dict[str, fl.common.Scalar]]]:
        model.set_weights(parameters) 
        loss, accuracy = model.evaluate(test_gen)
        print("After round {}, Global accuracy = {}, Loss = {}".format(server_round,accuracy, loss))
        results = {"round":server_round,"loss": loss, "accuracy": accuracy}
        results_list.append(results)
        return loss, {"accuracy": accuracy}

    return evaluate

# Initialize model and compile
model = create_model()
model.compile(optimizer="adam", loss='categorical_crossentropy', metrics=['accuracy'])

# Define strategy
strategy = fl.server.strategy.FedAvg(evaluate_fn=get_eval_fn(model), min_available_clients = 2)

# Start Flower server
def start_server():
    fl.server.start_server(
        config=fl.server.ServerConfig(num_rounds=3),
        strategy=strategy,
    )
if __name__ == "__main__":
    start_server()