export const cleanLogText = (log) => {
  return log.replace(/\x1b\[[0-9;]*m/g, "||");
};

export const chartData = (labels, counts) => {
  return {
    labels,
    datasets: [
      {
        label: "Image Count",
        data: counts,
        backgroundColor: "#2563eb",
        borderColor: "#1e40af",
        borderWidth: 1,
      },
    ],
  };
};

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "Class Distribution",
      font: { size: 20, weight: "600" },
      color: "#374151",
    },
    tooltip: {
      backgroundColor: "#f3f4f6",
      titleColor: "#374151",
      bodyColor: "#374151",
    },
  },
  scales: {
    x: {
      ticks: { color: "#374151" },
    },
    y: {
      ticks: { color: "#374151" },
      beginAtZero: true,
    },
  },
};
