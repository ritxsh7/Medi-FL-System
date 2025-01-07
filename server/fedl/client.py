from flask import Flask, request, jsonify
import threading
import flwr as fl

app = Flask(__name__)

client_data_dir = None

class FlowerClient(fl.client.NumPyClient):
    def __init__(self, data_path):
        self.data_path = data_path

    def get_parameters(self):
        return []

    def fit(self, parameters, config):
        print(f"Training on data from: {self.data_path}")
        return parameters, 100, {}

    def evaluate(self, parameters, config):
        return 0.5, 100, {"accuracy": 0.8}

@app.route("/select-data", methods=["POST"])
def select_data():
    global client_data_dir
    client_data_dir = request.json.get("data_path")
    return jsonify({"message": f"Data directory selected: {client_data_dir}"})

@app.route("/join-server", methods=["POST"])
def join_server():
    if client_data_dir is None:
        return jsonify({"error": "Data directory not selected"}), 400

    client = FlowerClient(client_data_dir)
    threading.Thread(target=fl.client.start_numpy_client, args=("localhost:8080", client)).start()
    return jsonify({"message": "Client joined server"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
