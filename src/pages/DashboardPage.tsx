import { useState } from "react";
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
import DashboardHUD from "../components/DashboardHUD";

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
  id: number;
  data: string;
  nome: string;
  sala: string;
  buyIn: number;
  premiacao: number;
  lucro: number;
  notas: string;
}

interface Transacao {
  id: number;
  data: string;
  tipo: "deposito" | "retirada";
  valor: number;
  sala: string;
}

interface Props {
  torneios: Torneio[];
  transacoes: Transacao[];
  bankrollInicial: number;
  setBankrollInicial: React.Dispatch<React.SetStateAction<number>>;
  salas: string[];
}

export default function DashboardPage({ torneios, transacoes, bankrollInicial, setBankrollInicial, salas }: Props) {
  const [mesFiltro, setMesFiltro] = useState("");
  const [anoFiltro, setAnoFiltro] = useState("");
  const [salaFiltro, setSalaFiltro] = useState("");
  const [editandoBankroll, setEditandoBankroll] = useState(false);
  const [novoBankrollInicial, setNovoBankrollInicial] = useState(bankrollInicial);

  function salvarBankroll() {
    setBankrollInicial(novoBankrollInicial);
    setEditandoBankroll(false);
  }

  const torneiosFiltrados = torneios.filter((t) => {
    const [ano, mes] = t.data.split("-");
    return (
      (mesFiltro ? mes === mesFiltro : true) &&
      (anoFiltro ? ano === anoFiltro : true) &&
      (salaFiltro ? t.sala === salaFiltro : true)
    );
  });

  const lucroTotal = torneiosFiltrados.reduce((acc, t) => acc + t.lucro, 0);

  const totalDepositos = transacoes
    .filter((t) => t.tipo === "deposito")
    .reduce((acc, t) => acc + t.valor, 0);
  const totalRetiradas = transacoes
    .filter((t) => t.tipo === "retirada")
    .reduce((acc, t) => acc + t.valor, 0);

  const bankrollAtual = bankrollInicial + lucroTotal + totalDepositos - totalRetiradas;

  const graficoLabels = [...torneiosFiltrados]
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .map((t) => t.data);

  let acumulado = 0;
  const graficoDados = [...torneiosFiltrados]
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .map((t) => {
      acumulado += t.lucro;
      return acumulado;
    });

  const chartData = {
    labels: graficoLabels,
    datasets: [
      {
        label: "Lucro Acumulado ($)",
        data: graficoDados,
        borderColor: "rgb(37, 99, 235)",
        backgroundColor: "rgba(37, 99, 235, 0.5)",
        tension: 0.2,
      },
    ],
  };

  const getStatsBySala = (sala: string) => {
    const torneiosDaSala = torneios.filter(t => t.sala === sala);
    const investido = torneiosDaSala.reduce((acc, t) => acc + t.buyIn, 0);
    const ganho = torneiosDaSala.reduce((acc, t) => acc + t.premiacao, 0);
    const lucro = ganho - investido;
    const roi = investido > 0 ? ((lucro / investido) * 100).toFixed(2) : "0.00";
    const totalTorneios = torneiosDaSala.length;

    return { investido, ganho, lucro, roi, totalTorneios };
  };

  const getBankrollBySala = (sala: string) => {
    const transacoesDaSala = transacoes.filter(t => t.sala === sala);
    const torneiosDaSala = torneios.filter(t => t.sala === sala);

    const depositos = transacoesDaSala
      .filter(t => t.tipo === "deposito")
      .reduce((acc, t) => acc + t.valor, 0);

    const retiradas = transacoesDaSala
      .filter(t => t.tipo === "retirada")
      .reduce((acc, t) => acc + t.valor, 0);
      
    const lucroTorneios = torneiosDaSala.reduce((acc, t) => acc + t.lucro, 0);

    return depositos - retiradas + lucroTorneios;
  };

  const salasComStats = salas.map(sala => ({
    nome: sala,
    stats: getStatsBySala(sala)
  })).filter(s => s.stats.totalTorneios > 0);

  const salasComBankroll = salas.map(sala => ({
    nome: sala,
    bankroll: getBankrollBySala(sala)
  }));
  
  return (
    <>
      <div className="max-w-5xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800 p-4 rounded shadow-lg">
          <p className="text-gray-400">Bankroll Inicial</p>
          {editandoBankroll ? (
            <div className="flex justify-center items-center gap-2 mt-1">
              <input
                type="number"
                value={novoBankrollInicial}
                onChange={(e) => setNovoBankrollInicial(parseFloat(e.target.value) || 0)}
                className="w-24 bg-gray-700 text-white p-1 rounded"
              />
              <button onClick={salvarBankroll} className="bg-green-600 text-white p-1 rounded hover:bg-green-700 text-sm">Salvar</button>
              <button onClick={() => setEditandoBankroll(false)} className="bg-red-600 text-white p-1 rounded hover:bg-red-700 text-sm">Cancelar</button>
            </div>
          ) : (
            <p className="text-lg font-bold text-white flex justify-center items-center gap-2">
              ${bankrollInicial.toFixed(2)}
              <button onClick={() => setEditandoBankroll(true)} className="text-blue-400 hover:text-blue-200 text-sm">
                (Editar)
              </button>
            </p>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded shadow-lg">
          <p className="text-gray-400">Bankroll Atual</p>
          <p className={`text-lg font-bold ${bankrollAtual >= 0 ? "text-green-400" : "text-red-400"}`}>
            ${bankrollAtual.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow-lg">
          <p className="text-gray-400">Total Depósitos</p>
          <p className="text-lg font-bold text-green-400">${totalDepositos.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow-lg col-span-1 md:col-span-2">
          <p className="text-gray-400">Total Retiradas</p>
          <p className="text-lg font-bold text-red-400">${totalRetiradas.toFixed(2)}</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mb-4">
        <h2 className="text-xl font-bold mb-2 text-white">Filtros</h2>
        <div className="flex flex-wrap gap-2 justify-center bg-gray-800 p-4 rounded shadow-lg">
          <div className="flex flex-wrap gap-2 justify-center w-full">
            <button
              onClick={() => setSalaFiltro("")}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-200 ${
                salaFiltro === "" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              Todas
            </button>
            {salas.map((s) => (
              <button
                key={s}
                onClick={() => setSalaFiltro(s)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  salaFiltro === s ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-4 justify-center w-full mt-2">
            <select
              value={mesFiltro}
              onChange={(e) => setMesFiltro(e.target.value)}
              className="border border-gray-700 p-2 rounded bg-gray-700 text-white"
            >
              <option value="">Todos os meses</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            <select
              value={anoFiltro}
              onChange={(e) => setAnoFiltro(e.target.value)}
              className="border border-gray-700 p-2 rounded bg-gray-700 text-white"
            >
              <option value="">Todos os anos</option>
              {[...new Set(torneios.map((t) => t.data.split("-")[0]))].map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <DashboardHUD torneios={torneiosFiltrados} />
      
      {salasComStats.length > 0 && (
        <div className="max-w-5xl mx-auto mb-6">
          <h2 className="text-xl font-bold mb-2 text-white">Análise por Sala</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {salasComStats.map(s => (
              <div key={s.nome} className="bg-gray-800 p-4 rounded shadow-lg text-center">
                <h3 className="text-lg font-bold text-blue-400 mb-2">{s.nome}</h3>
                <p className="text-gray-400">Torneios: <span className="font-bold text-white">{s.stats.totalTorneios}</span></p>
                <p className="text-gray-400">Lucro: <span className={`font-bold ${s.stats.lucro >= 0 ? "text-green-400" : "text-red-400"}`}>${s.stats.lucro.toFixed(2)}</span></p>
                <p className="text-gray-400">ROI: <span className="font-bold text-white">{s.stats.roi}%</span></p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="max-w-5xl mx-auto bg-gray-800 p-4 rounded shadow-lg mb-6">
        <Line data={chartData} />
      </div>
      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-xl font-bold mb-2 text-white">Bankroll por Sala</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {salasComBankroll.map(s => (
            <div key={s.nome} className="bg-gray-800 p-4 rounded shadow-lg text-center">
              <h3 className="text-lg font-bold text-blue-400 mb-2">{s.nome}</h3>
              <p className="text-gray-400">Bankroll Atual: <span className={`font-bold ${s.bankroll >= 0 ? "text-green-400" : "text-red-400"}`}>${s.bankroll.toFixed(2)}</span></p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}