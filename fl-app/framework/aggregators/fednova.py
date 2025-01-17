def fednova(weights, learning_rates):
    aggregated_weights = {}
    total_normalized_weight = sum(1 / lr for lr in learning_rates)

    for key in weights[0]:
        aggregated_weights[key] = sum(w[key] / lr for w, lr in zip(weights, learning_rates)) / total_normalized_weight

    return aggregated_weights
