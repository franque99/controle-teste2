import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Torneio {
  sala: string;
}

interface Props {
  torneios: Torneio[];
  salas: string[];
}

export default function TournamentsByRoomChart({ torneios, salas }: Props) {
  const torneiosPorSala: { [key: string]: number } = salas.reduce((acc, sala) => {
    acc[sala] = 0;
    return acc;
  }, {} as { [key: string]: number });

  torneios.forEach(torneio => {
    if (torneiosPorSala[torneio.sala] !== undefined) {
      torneiosPorSala[torneio.sala]++;
    }
  });

  const data = {
    labels: Object.keys(torneiosPorSala),
    datasets: [
      {
        label: 'Torneios Jogados',
        data: Object.values(torneiosPorSala),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(199, 199, 199, 0.5)',
          'rgba(83, 102, 255, 0.5)',
          'rgba(128, 0, 128, 0.5)',
          'rgba(0, 128, 0, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(128, 0, 128, 1)',
          'rgba(0, 128, 0, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#ccc',
        },
      },
      title: {
        display: true,
        text: 'Distribuição de Torneios por Sala',
        color: '#fff',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((sum: number, current: number) => sum + current, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded shadow-lg mt-6">
      <Pie data={data} options={options} />
    </div>
  );
}