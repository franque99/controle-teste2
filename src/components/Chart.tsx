import React from "react";
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
import { Tournament } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: Tournament[];
}

export default function ChartComp({ data }: ChartProps) {
  const chartData = {
    labels: data.map((t) => t.date),
    datasets: [
      {
        label: "Lucro ($)",
        data: data.map((t) => t.prize - t.buyIn),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Line data={chartData} />
    </div>
  );
}
