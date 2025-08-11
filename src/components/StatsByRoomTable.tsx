import React from 'react';

interface Torneio {
  sala: string;
  buyIn: number;
  premiacao: number;
}

interface Props {
  torneios: Torneio[];
  salas: string[];
}

interface StatsPorSala {
  sala: string;
  totalTorneios: number;
  totalBuyIn: number;
  totalPremiacao: number;
  lucro: number;
  roi: number;
}

export default function StatsByRoomTable({ torneios, salas }: Props) {
  const statsPorSala: { [key: string]: StatsPorSala } = {};

  salas.forEach(sala => {
    statsPorSala[sala] = {
      sala,
      totalTorneios: 0,
      totalBuyIn: 0,
      totalPremiacao: 0,
      lucro: 0,
      roi: 0
    };
  });

  torneios.forEach(t => {
    if (statsPorSala[t.sala]) {
      statsPorSala[t.sala].totalTorneios++;
      statsPorSala[t.sala].totalBuyIn += t.buyIn;
      statsPorSala[t.sala].totalPremiacao += t.premiacao;
      statsPorSala[t.sala].lucro += (t.premiacao - t.buyIn);
    }
  });

  Object.keys(statsPorSala).forEach(sala => {
    const stats = statsPorSala[sala];
    if (stats.totalBuyIn > 0) {
      stats.roi = (stats.lucro / stats.totalBuyIn) * 100;
    }
  });

  const dadosDaTabela = Object.values(statsPorSala).filter(stats => stats.totalTorneios > 0);

  return (
    <div className="max-w-5xl mx-auto overflow-x-auto bg-gray-800 p-4 rounded shadow-lg mt-6">
      <h2 className="text-xl font-bold text-blue-400 mb-4">Desempenho Detalhado por Sala</h2>
      <table className="min-w-full bg-gray-800 border-collapse rounded">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2 border-b border-gray-600 text-left">Sala</th>
            <th className="p-2 border-b border-gray-600">Torneios</th>
            <th className="p-2 border-b border-gray-600">Investido</th>
            <th className="p-2 border-b border-gray-600">Premiado</th>
            <th className="p-2 border-b border-gray-600">Lucro</th>
            <th className="p-2 border-b border-gray-600">ROI</th>
          </tr>
        </thead>
        <tbody>
          {dadosDaTabela.map(stats => (
            <tr key={stats.sala} className="text-center hover:bg-gray-700">
              <td className="p-2 border-b border-gray-700 text-left">{stats.sala}</td>
              <td className="p-2 border-b border-gray-700">{stats.totalTorneios}</td>
              <td className="p-2 border-b border-gray-700">${stats.totalBuyIn.toFixed(2)}</td>
              <td className="p-2 border-b border-gray-700">${stats.totalPremiacao.toFixed(2)}</td>
              <td className={`p-2 border-b border-gray-700 ${stats.lucro >= 0 ? "text-green-400" : "text-red-400"}`}>
                ${stats.lucro.toFixed(2)}
              </td>
              <td className={`p-2 border-b border-gray-700 ${stats.roi >= 0 ? "text-green-400" : "text-red-400"}`}>
                {stats.roi.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}