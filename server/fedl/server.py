import sys
import flwr as fl
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import threading
import os
import time
import subprocess

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# List to track connected clients
connected_clients = []


# Start Flower Server
def start_flower_server():
    print("Starting federated learning server on port 8000...")
    strategy = fl.server.strategy.FedAvg(
        min_fit_clients=2,
        min_available_clients=2,
    )
    # Starting the server with the specified strategy on port 8000
    fl.server.start_server(server_address="0.0.0.0:8000", strategy=strategy)

# SocketIO event for client joining the training
@socketio.on('join_server')
def handle_client_join():
    print(request)
    client_ip = request.remote_addr  # Get client IP address
    connected_clients.append(client_ip)  # Add to connected clients list

    # Emit log to the frontend about the client joining
    log_message = f"Client {client_ip} joined the server. Total clients: {len(connected_clients)}"
    socketio.emit('server_log', log_message)

    # Run the Flower client (client-side training)
    print(f"Client {client_ip} is now joining the training...")
    # Execute the client in a separate thread

# Function to start a Flower client
def run_flower_client(client_ip):
    # Path to the data directory (you need to ensure that each client has data)
    data_directory = f"./client_data/{client_ip}"  # Customize this as needed
    if not os.path.exists(data_directory):
        os.makedirs(data_directory)
    
    # Example of Flower client running, replacing with actual data directory
    print(f"Client {client_ip} starting with data directory: {data_directory}")
    
    # Flower client code here
    fl.client.start_numpy_client(server_address="localhost:8000", client=fl.client.NumPyClient())

# Endpoint to start the server
@app.route("/start-server", methods=["POST"])
def start_server():
    threading.Thread(target=start_flower_server, daemon=True).start()
    return jsonify({"message": "Server started successfully"})

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
