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

```
---

### 🖥️ Step 3: Install Node.js

Download and install **Node.js (LTS version recommended)** from the official website:  
🔗 [https://nodejs.org/](https://nodejs.org/)

After installation, verify by running:

```bash
node -v
npm -v

```

---

### ⬇️ Step 4: Clone the repository

Clone the repository to your device

```bash
git clone [https://github.com/ritxsh7/Medi-FL-System.git](https://github.com/ritxsh7/Medi-FL-System.git)
cd Medi-FL-System

```

---

### 📂 Step 5: Download the Medi-FL dataset & configure its path in the system

=> Download the Medi-FL dataset from 🔗 [https://www.kaggle.com/datasets/d1a19112a22cb39a870249a6c2b236b2ca9123ab4af61d544a96d72aa4b2c436](https://www.kaggle.com/datasets/d1a19112a22cb39a870249a6c2b236b2ca9123ab4af61d544a96d72aa4b2c436)

=> Configure the path of downloaded dataset in the config file **/fl-app/framework/server.py** at line number 61

<pre> ```python def get_eval_fn(model):
    val_dir = "dataset-directory-here//data//valid"
    val_gen = create_test_generator(val_dir) ``` </pre>

---

### ▶️ Step 6: Start the aggregation server 

The aggregation server is where the trained models from client will be aggregated using the WIFA Algorithm.

```bash

cd /fl-app
python app.py
```

---

### 💻 Step 7: Start the local middleware server 

Access to the aggregation server routes through a Node.js middleware for additional security. This server is global for all the clients in the learning process.

In a separate terminal, run these commands

```bash

cd /fl-app/app
npm start

```

---

### 📳 Step 8: Start the client applications

The client application is where the data will be trained on local client data. The locally trained model then can be sent to the aggregation server for federated learning.

In 2 seperate terminals (2 clients), run these commands

```bash

cd /fl-app/client
npm run dev

```

---







