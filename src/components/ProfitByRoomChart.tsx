import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Torneio {
  sala: string;
  lucro: number;
}

interface Props {
  torneios: Torneio[];
  salas: string[];
}

export default function ProfitByRoomChart({ torneios, salas }: Props) {
  const lucroPorSala: { [key: string]: number } = salas.reduce((acc, sala) => {
    acc[sala] = 0;
    return acc;
  }, {} as { [key: string]: number });

  torneios.forEach(torneio => {
    if (lucroPorSala[torneio.sala] !== undefined) {
      lucroPorSala[torneio.sala] += torneio.lucro;
    }
  });

  const data = {
    labels: salas,
    datasets: [{
      label: 'Lucro Total por Sala ($)',
      data: salas.map(sala => lucroPorSala[sala].toFixed(2)),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
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
        text: 'Lucro Acumulado por Sala',
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
      <Bar data={data} options={options} />
    </div>
  );
}