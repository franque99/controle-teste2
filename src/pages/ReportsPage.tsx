import { useState } from "react";
import ReportsCard from "../components/ReportsCard";
import ProfitByRoomChart from "../components/ProfitByRoomChart";
import MonthlyProfitChart from "../components/MonthlyProfitChart";
import TournamentsByRoomChart from "../components/TournamentsByRoomChart";
import StatsByRoomTable from "../components/StatsByRoomTable";

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

interface Props {
  torneios: Torneio[];
  salas: string[];
}

export default function ReportsPage({ torneios, salas }: Props) {
  const [mesFiltro, setMesFiltro] = useState("");
  const [anoFiltro, setAnoFiltro] = useState("");
  const [salaFiltro, setSalaFiltro] = useState("");

  const torneiosFiltrados = torneios.filter((t) => {
    const [ano, mes] = t.data.split("-");
    return (
      (mesFiltro ? mes === mesFiltro : true) &&
      (anoFiltro ? ano === anoFiltro : true) &&
      (salaFiltro ? t.sala === salaFiltro : true)
    );
  });

  return (
    <div className="max-w-5xl mx-auto p-4">
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
      
      <ReportsCard torneios={torneiosFiltrados} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ProfitByRoomChart torneios={torneiosFiltrados} salas={salas} />
        <TournamentsByRoomChart torneios={torneiosFiltrados} salas={salas} />
      </div>

      <MonthlyProfitChart torneios={torneiosFiltrados} />

      <StatsByRoomTable torneios={torneiosFiltrados} salas={salas} />
    </div>
  );
}