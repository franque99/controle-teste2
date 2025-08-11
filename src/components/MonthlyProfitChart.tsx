import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Torneio {
  data: string;
  lucro: number;
}

interface Props {
  torneios: Torneio[];
}

export default function MonthlyProfitChart({ torneios }: Props) {
  const lucroPorMes: { [key: string]: number } = {};

  torneios.forEach(torneio => {
    const [ano, mes] = torneio.data.split('-');
    const chave = `${ano}-${mes}`;
    if (!lucroPorMes[chave]) {
      lucroPorMes[chave] = 0;
    }
    lucroPorMes[chave] += torneio.lucro;
  });

  const labels = Object.keys(lucroPorMes).sort();
  const dataPoints = labels.map(chave => lucroPorMes[chave]);

  const data = {
    labels: labels,
    datasets: [{
      label: 'Lucro por Mês ($)',
      data: dataPoints,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      tension: 0.2,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Lucro por Mês',
        color: '#fff',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ccc',
        },
        grid: {
          color: 'rgba(204, 204, 204, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#ccc',
        },
        grid: {
          color: 'rgba(204, 204, 204, 0.1)',
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded shadow-lg mt-6">
      <Line data={data} options={options} />
    </div>
  );
}