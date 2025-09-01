# Federated Learning Simulation using Flower, TensorFlow, and React

This project simulates a Federated Learning system using **Flower (flwr)** and **TensorFlow**, with a web-based interface built using **React + Vite**. It allows simulation of multiple clients (including Admin), each training locally and sending updates to a central server for aggregation.

---

## 🛠️ Setup Instructions

### 📦 Step 1: Install Anaconda

Download and install the Anaconda distribution for your operating system from:

🔗 [https://www.anaconda.com/products/distribution](https://www.anaconda.com/products/distribution)

> Anaconda comes with the `conda` package manager, Python, and many scientific libraries preinstalled.

---

### ⚙️ Step 2: Create Python Environment & Install Packages

Open **Anaconda Prompt** (or your terminal) and run:

```bash
# Create a new environment
conda create -n flenv python=3.10

# Activate the environment
conda activate flenv

# Install required Python packages
pip install tensorflow flwr

# Install extras for data handling
pip install matplotlib pandas scikit-learn jupyter

---
```

### 🖥️ Step 3: Install Node.js

Download and install **Node.js (LTS version recommended)** from the official website:  
🔗 [https://nodejs.org/](https://nodejs.org/)

After installation, verify by running:

```bash
node -v
npm -v

```

### ⬇️ Step 4: Clone the repository

Clone the repository to your device

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
