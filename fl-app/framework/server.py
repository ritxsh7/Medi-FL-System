import flwr as fl
from typing import Dict, Optional, Tuple
from tensorflow.keras.optimizers import Adamax
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from utils import create_model


IMG_SIZE = (64, 64)
BATCH_SIZE = 32

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

# Create a test generator for evaluation
def create_test_generator(val_dir):
    datagen = ImageDataGenerator(rescale=1.0/255.0)
    return datagen.flow_from_directory(
        val_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=False
    )


results_list = []

# Define evaluation function for server-side evaluation
def get_eval_fn(model):
    val_dir = "D://federated learning//fed-impl//data//valid"
    val_gen = create_test_generator(val_dir)

    def evaluate(
        server_round: int,
        parameters: fl.common.NDArrays,
        config: Dict[str, fl.common.Scalar],
    ) -> Optional[Tuple[float, Dict[str, fl.common.Scalar]]]:
        model.set_weights(parameters) 
        loss, accuracy = model.evaluate(val_gen)
        print("After round {}, Global accuracy = {}, Loss = {} ".format(server_round,accuracy, loss))
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
fl.server.start_server(
    config=fl.server.ServerConfig(num_rounds=20),
    strategy=strategy
)

model.save("../model/final_server_model.h5") 
