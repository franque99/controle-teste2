import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ReportsPage from "./pages/ReportsPage";
import Header from "./components/Header";
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

const salas = [
  "WPT Global",
  "CoinPoker",
  "PokerStars",
  "ChampionPoker",
  "YaPoker",
  "PokerStars.es",
  "partypoker",
  "888poker",
  "GGPoker",
  "VangPoker",
].sort();

export default function App() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [bankrollInicial, setBankrollInicial] = useState(0);
  const [arquivoImportado, setArquivoImportado] = useState<File | null>(null);

  useEffect(() => {
    const dadosTorneios = localStorage.getItem("torneios");
    if (dadosTorneios) setTorneios(JSON.parse(dadosTorneios));

    const dadosBankroll = localStorage.getItem("bankrollInicial");
    if (dadosBankroll) setBankrollInicial(parseFloat(dadosBankroll));

    const dadosTransacoes = localStorage.getItem("transacoes");
    if (dadosTransacoes) setTransacoes(JSON.parse(dadosTransacoes));
  }, []);

  useEffect(() => {
    localStorage.setItem("torneios", JSON.stringify(torneios));
  }, [torneios]);

  useEffect(() => {
    localStorage.setItem("bankrollInicial", bankrollInicial.toString());
  }, [bankrollInicial]);

  useEffect(() => {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  }, [transacoes]);

  function exportarParaCSV() {
    const dados = {
      bankrollInicial: bankrollInicial,
      torneios: torneios,
      transacoes: transacoes,
    };
    const dadosJSON = JSON.stringify(dados, null, 2);
    const blob = new Blob([dadosJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dados_grind_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert("Dados exportados com sucesso!");
  }

  function importarDeCSV(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivoImportado) {
      alert("Por favor, selecione um arquivo para importar.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const dadosImportados = JSON.parse(event.target?.result as string);
        if (window.confirm("Isso irá substituir os dados atuais. Deseja continuar?")) {
          setBankrollInicial(dadosImportados.bankrollInicial || 0);
          setTorneios(dadosImportados.torneios || []);
          setTransacoes(dadosImportados.transacoes || []);
          alert("Dados importados com sucesso!");
          setArquivoImportado(null);
        }
      } catch (error) {
        alert("Erro ao importar o arquivo. Verifique se ele está no formato correto (JSON).");
        console.error("Erro ao importar:", error);
      }
    };
    reader.readAsText(arquivoImportado);
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
          TZ Controle de Grind
        </h1>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                torneios={torneios}
                setTorneios={setTorneios}
                transacoes={transacoes}
                setTransacoes={setTransacoes}
                salas={salas}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                torneios={torneios}
                transacoes={transacoes}
                bankrollInicial={bankrollInicial}
                setBankrollInicial={setBankrollInicial}
                salas={salas}
              />
            }
          />
          <Route path="/reports" element={<ReportsPage torneios={torneios} salas={salas} />} />
        </Routes>
        <div className="max-w-5xl mx-auto mt-6 bg-gray-800 p-4 rounded shadow-lg flex flex-col md:flex-row gap-4 justify-between items-center">
          <h2 className="text-xl font-bold text-white">Dados</h2>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <button
              onClick={exportarParaCSV}
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Exportar Dados
            </button>
            <form onSubmit={importarDeCSV} className="flex gap-2">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setArquivoImportado(e.target.files ? e.target.files[0] : null)}
                className="text-white text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Importar Dados
              </button>
            </form>
          </div>
        </div>
      </div>
    </Router>
  );
}