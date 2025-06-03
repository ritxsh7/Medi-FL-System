import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ metrics, text }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Accuracy",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
      {
        label: "Loss",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
      },
    ],
  });

  useEffect(() => {
    // Update chart data when metrics change
    const updatedData = {
      labels:
        metrics.length > 0 ? metrics.map((_, i) => i + 1) : [1, 2, 3, 4, 5],
      datasets: [
        {
          ...chartData.datasets[0],
          data: metrics.map((m) => m.accuracy * 100),
        },
        {
          ...chartData.datasets[1],
          data: metrics.map((m) => m.loss * 100),
        },
      ],
    };
    setChartData(updatedData);
  }, [metrics]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: text,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Rounds",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Percentage (%)",
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "450px", margin: "auto" }}>
      <Line data={chartData} options={options} style={{ width: "100%" }} />
    </div>
  );
};

export default LineChart;
