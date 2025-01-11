from flask import Flask, jsonify, request
import threading
import subprocess
import time
import socketio
import os

# Initialize Flask app and Socket.IO
app = Flask(__name__)
sio = socketio.Server(cors_allowed_origins="*", async_mode='threading')
flask_app = socketio.WSGIApp(sio, app)

# Global variables
training_sessions = {}
lock = threading.Lock()

# Helper function to simulate FL training process
def run_flower_server(session_id):
    try:
        # Simulating Flower server start
        log_file = f"session_{session_id}_server.log"
        with open(log_file, 'w') as log:
            subprocess.run(["python", "flower_server.py"], stdout=log, stderr=subprocess.STDOUT)
    except Exception as e:
        print(f"Error running Flower server: {e}")


def run_client(client_id, session_id):
    try:
        # Simulating Flower client
        log_file = f"session_{session_id}_client_{client_id}.log"
        with open(log_file, 'w') as log:
            subprocess.run(["python", f"flower_client_{client_id}.py"], stdout=log, stderr=subprocess.STDOUT)
    except Exception as e:
        print(f"Error running Flower client {client_id}: {e}")

# API endpoint: Start a new training session
@app.route('/start_session', methods=['POST'])
def start_session():
    data = request.json
    session_id = data.get("session_id")
    client_count = data.get("client_count", 2)

    with lock:
        if session_id in training_sessions:
            return jsonify({"error": "Session ID already exists."}), 400

        training_sessions[session_id] = {"status": "running"}

    # Start the Flower server in a new thread
    server_thread = threading.Thread(target=run_flower_server, args=(session_id,))
    server_thread.start()

    # Start Flower clients in separate threads
    for client_id in range(1, client_count + 1):
        client_thread = threading.Thread(target=run_client, args=(client_id, session_id))
        client_thread.start()

    return jsonify({"message": f"Training session {session_id} started with {client_count} clients."})

# API endpoint: Get logs for a specific session
@app.route('/get_logs', methods=['GET'])
def get_logs():
    session_id = request.args.get("session_id")
    if not session_id or session_id not in training_sessions:
        return jsonify({"error": "Invalid session ID."}), 400

    logs = {}
    try:
        # Read server log
        server_log_file = f"session_{session_id}_server.log"
        if os.path.exists(server_log_file):
            with open(server_log_file, 'r') as log:
                logs["server"] = log.read()

        # Read client logs
        logs["clients"] = {}
        client_id = 1
        while True:
            client_log_file = f"session_{session_id}_client_{client_id}.log"
            if not os.path.exists(client_log_file):
                break
            with open(client_log_file, 'r') as log:
                logs["clients"][f"client_{client_id}"] = log.read()
            client_id += 1

    except Exception as e:
        return jsonify({"error": f"Error reading logs: {e}"}), 500

    return jsonify(logs)

# API endpoint: Stop a training session
@app.route('/stop_session', methods=['POST'])
def stop_session():
    data = request.json
    session_id = data.get("session_id")

    with lock:
        if session_id not in training_sessions:
            return jsonify({"error": "Invalid session ID."}), 400

        training_sessions[session_id]["status"] = "stopped"

    # Simulate stopping the server and clients (logs will stop updating)
    return jsonify({"message": f"Training session {session_id} stopped."})

# Socket.IO for real-time log streaming
@sio.on('connect')
def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.on('disconnect')
def disconnect(sid):
    print(f"Client disconnected: {sid}")

if __name__ == '__main__':
    app_port = 5000
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    server = pywsgi.WSGIServer(("0.0.0.0", app_port), flask_app, handler_class=WebSocketHandler)
    print(f"Backend running on http://localhost:{app_port}/")
    server.serve_forever()


    

