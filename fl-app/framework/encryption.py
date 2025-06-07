import numpy as np
from phe import paillier
import asyncio
import random
from typing import List, Tuple, Dict
import logging

# Configure logging for professional output
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EncryptionFLServer:
    """Central server for federated learning with homomorphic encryption."""
    
    def __init__(self, num_clients: int, model_size: int):
        self.num_clients = num_clients
        self.model_size = model_size
        self.global_model = np.zeros(model_size)  # Initialize global model
        self.public_key, self.private_key = paillier.generate_paillier_keypair()
        logger.info("Server initialized with Paillier key pair for homomorphic encryption.")

    def aggregate_encrypted_weights(self, encrypted_weights: List[List[paillier.EncryptedNumber]]) -> List[paillier.EncryptedNumber]:
        logger.info("Aggregating encrypted weights from %d clients.", self.num_clients)
        aggregated = []
        for i in range(self.model_size):
            #Addition of encrypted weights
            sum_encrypted = encrypted_weights[0][i]
            for j in range(1, self.num_clients):
                sum_encrypted = self.public_key.raw_add(sum_encrypted.ciphertext(), encrypted_weights[j][i].ciphertext())
                sum_encrypted = paillier.EncryptedNumber(self.public_key, sum_encrypted)
            aggregated.append(sum_encrypted)
        return aggregated

    def decrypt_aggregated_weights(self, encrypted_aggregate: List[paillier.EncryptedNumber]) -> np.ndarray:
        """Decrypt aggregated weights and update global model."""
        logger.info("Decrypting aggregated weights.")
        decrypted_weights = np.array([self.private_key.decrypt(w) / self.num_clients for w in encrypted_aggregate])
        self.global_model = decrypted_weights
        return self.global_model

    def distribute_global_model(self) -> np.ndarray:
        """Distribute the global model to clients."""
        logger.info("Distributing global model to clients.")
        return self.global_model.copy()

class FLClient:
    """Client for federated learning with homomorphic encryption."""
    
    def __init__(self, client_id: int, public_key: paillier.PaillierPublicKey, model_size: int):
        self.client_id = client_id
        self.public_key = public_key
        self.model_size = model_size
        self.local_model = np.random.randn(model_size) * 0.1  # Simulate local training
        logger.info("Client %d initialized with random local model.", client_id)

    def train_local_model(self, global_model: np.ndarray) -> None:
        """Simulate local training by updating model with synthetic data."""
        logger.info("Client %d performing local training.", self.client_id)
        # Simulate gradient update
        gradients = np.random.randn(self.model_size) * 0.01
        self.local_model = global_model + gradients

    def encrypt_local_model(self) -> List[paillier.EncryptedNumber]:
        """Encrypt local model weights using homomorphic encryption."""
        logger.info("Client %d encrypting local model weights.", self.client_id)
        return [self.public_key.encrypt(w) for w in self.local_model]

async def federated_learning_round(server: EncryptionFLServer, clients: List[FLClient], round_id: int) -> None:
    """Execute one round of federated learning with homomorphic encryption."""
    logger.info("Starting federated learning round %d.", round_id)
    
    # Server distributes global model
    global_model = server.distribute_global_model()
    
    # Clients train locally and encrypt weights
    encrypted_weights = []
    for client in clients:
        client.train_local_model(global_model)
        encrypted_weights.append(client.encrypt_local_model())
    
    # Server aggregates encrypted weights
    encrypted_aggregate = server.aggregate_encrypted_weights(encrypted_weights)
    
    # Server decrypts and updates global model
    global_model = server.decrypt_aggregated_weights(encrypted_aggregate)
    logger.info("Round %d completed. Global model updated: %s", round_id, global_model[:5])

async def main():
    """Main function to simulate federated learning with homomorphic encryption."""
    logger.info("Initializing federated learning simulation.")
    
    # Configuration
    num_clients = 3
    model_size = 10
    num_rounds = 2
    
    # Initialize server and clients
    server = EncryptionFLServer(num_clients, model_size)
    clients = [FLClient(i, server.public_key, model_size) for i in range(num_clients)]
    
    # Run federated learning rounds
    for round_id in range(1, num_rounds + 1):
        await federated_learning_round(server, clients, round_id)
    
    logger.info("Federated learning completed. Final global model: %s", server)