interface Torneio {
  buyIn: number;
  premiacao: number;
}

interface Props {
  torneios: Torneio[];
}

export default function ReportsCard({ torneios }: Props) {
  const totalInvestido = torneios.reduce((acc, t) => acc + t.buyIn, 0);
  const totalPremiacao = torneios.reduce((acc, t) => acc + t.premiacao, 0);
  const lucroTotal = totalPremiacao - totalInvestido;
  const roi = totalInvestido > 0 ? ((lucroTotal / totalInvestido) * 100).toFixed(2) : "0.00";
  const numTorneios = torneios.length;

  return (
    <div className="max-w-5xl mx-auto mb-6">
      <h2 className="text-xl font-bold mb-2 text-white">Estatísticas Gerais</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div className="bg-gray-800 p-4 rounded shadow-lg">
          <p className="text-gray-400">Total de Torneios</p>
          <p className="text-lg font-bold text-white">{numTorneios}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow-lg">
          <p className="text-gray-400">Total Investido</p>
          <p className="text-lg font-bold text-white">${totalInvestido.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow-lg">
          <p className="text-gray-400">Lucro Total</p>
          <p className={`text-lg font-bold ${lucroTotal >= 0 ? "text-green-400" : "text-red-400"}`}>
            ${lucroTotal.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow-lg">
          <p className="text-gray-400">ROI Médio</p>
          <p className="text-lg font-bold text-white">{roi}%</p>
        </div>
      </div>
    </div>
  );
}
