def fedavg(weights):
    aggregated_weights = {}
    num_clients = len(weights)

    for key in weights[0]:
        aggregated_weights[key] = sum(w[key] for w in weights) / num_clients

    return aggregated_weights