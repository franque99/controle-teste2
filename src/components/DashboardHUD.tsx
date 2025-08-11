interface Torneio {
  buyIn: number;
  premiacao: number;
}

interface Props {
  torneios: Torneio[];
}

export default function DashboardHUD({ torneios }: Props) {
  const totalInvestido = torneios.reduce((acc, t) => acc + t.buyIn, 0);
  const totalPremiacao = torneios.reduce((acc, t) => acc + t.premiacao, 0);
  const lucroTotal = totalPremiacao - totalInvestido;
  const roi = totalInvestido > 0 ? ((lucroTotal / totalInvestido) * 100).toFixed(2) : "0.00";
  const numTorneios = torneios.length;
  const buyInMedio = numTorneios > 0 ? (totalInvestido / numTorneios).toFixed(2) : "0.00";

  return (
    <div className="max-w-5xl mx-auto mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div className="bg-gray-800 p-4 rounded shadow-lg">
        <p className="text-gray-400 text-sm">Lucro</p>
        <p className={`text-xl font-bold ${lucroTotal >= 0 ? "text-green-400" : "text-red-400"}`}>
          ${lucroTotal.toFixed(2)}
        </p>
      </div>
      <div className="bg-gray-800 p-4 rounded shadow-lg">
        <p className="text-gray-400 text-sm">ROI</p>
        <p className="text-xl font-bold text-white">
          {roi}%
        </p>
      </div>
      <div className="bg-gray-800 p-4 rounded shadow-lg">
        <p className="text-gray-400 text-sm">Torneios</p>
        <p className="text-xl font-bold text-white">
          {numTorneios}
        </p>
      </div>
      <div className="bg-gray-800 p-4 rounded shadow-lg">
        <p className="text-gray-400 text-sm">Buy-In Médio</p>
        <p className="text-xl font-bold text-white">
          ${buyInMedio}
        </p>
      </div>
    </div>
  );
}
