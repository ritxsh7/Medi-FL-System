def fedprox(weights, proximal_term):
    aggregated_weights = {}
    total_proximal_weight = sum(proximal_term for _ in weights)

    for key in weights[0]:
        aggregated_weights[key] = sum(w[key] * proximal_term for w in weights) / total_proximal_weight

    return aggregated_weights