def wifa(weights, data_sizes):
    aggregated_weights = {}
    total_data_size = sum(data_sizes)

    for key in weights[0]:
        aggregated_weights[key] = sum(w[key] * size for w, size in zip(weights, data_sizes)) / total_data_size

    return aggregated_weights