from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room
import subprocess
import threading
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="gevent")  # Use gevent as async mode

# Global variables to store server and client processes
server_process = None
client_processes = []

import sys
import io
import logging

# Set UTF-8 as the default encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    handlers=[
        logging.StreamHandler(sys.stdout),
    ],
    encoding='utf-8',
)


@app.route("/start_server", methods=["POST"])
def start_server():
    global server_process

    if server_process:
        return jsonify({"status": "error", "message": "Server already running"}), 400

    def stream_server_logs():
        # Stream logs to the web interface
        for line in iter(server_process.stdout.readline, b""):
            socketio.emit("server_log", {"log": line.decode()}, to=None)

    # Start the Flower server
    server_process = subprocess.Popen(
        ["python", "server.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        bufsize=1
    )
    threading.Thread(target=stream_server_logs, daemon=True).start()

    return jsonify({"status": "success", "message": "Server started"})


@app.route("/start_clients", methods=["POST"])
def start_clients():
    global client_processes
    num_clients = request.json.get("num_clients", 0)

    if not num_clients or num_clients <= 0:
        return jsonify({"status": "error", "message": "Invalid number of clients"}), 400

    if client_processes:
        return jsonify({"status": "error", "message": "Clients already running"}), 400

    for client_id in range(1, num_clients + 1):
        def stream_client_logs(client_id):
            for line in iter(process.stdout.readline, b""):
                # print(line)
                socketio.emit(f"client_{client_id}_log", {"log": line.decode()},  to=None)

        process = subprocess.Popen(
            ["python", "client.py", f"--client_id={client_id}"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            bufsize=1
        )
        client_processes.append(process)
        threading.Thread(target=stream_client_logs, args=(client_id,), daemon=True).start()

    return jsonify({"status": "success", "message": f"{num_clients} clients started"})


@app.route("/stop_all", methods=["POST"])
def stop_all():
    global server_process, client_processes

    if server_process:
        server_process.terminate()
        server_process = None

    for process in client_processes:
        process.terminate()
    client_processes = []

    return jsonify({"status": "success", "message": "All processes stopped"})


@socketio.on("connect")
def handle_connect():
    print("Client connected")


if __name__ == "__main__":
    socketio.run(app, port=5000)