import { useState } from "react";
import { format } from "date-fns";

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
  setTorneios: React.Dispatch<React.SetStateAction<Torneio[]>>;
  transacoes: Transacao[];
  setTransacoes: React.Dispatch<React.SetStateAction<Transacao[]>>;
  salas: string[];
}

export default function HomePage({ torneios, setTorneios, transacoes, setTransacoes, salas }: Props) {
  const [novoTorneio, setNovoTorneio] = useState({
    data: format(new Date(), "yyyy-MM-dd"),
    nome: "",
    sala: salas[0],
    buyIn: 0,
    premiacao: 0,
    notas: ""
  });

  const [novaTransacao, setNovaTransacao] = useState({
    data: format(new Date(), "yyyy-MM-dd"),
    tipo: "deposito",
    valor: 0,
    sala: salas[0],
  });

  const [filtroNomeTorneio, setFiltroNomeTorneio] = useState("");

  const adicionarTorneio = (e: React.FormEvent) => {
    e.preventDefault();
    const lucro = novoTorneio.premiacao - novoTorneio.buyIn;
    const novoId = torneios.length > 0 ? Math.max(...torneios.map((t) => t.id)) + 1 : 1;
    const torneioParaAdicionar = { ...novoTorneio, lucro, id: novoId };
    setTorneios([...torneios, torneioParaAdicionar]);
    setNovoTorneio({
      data: format(new Date(), "yyyy-MM-dd"),
      nome: "",
      sala: salas[0],
      buyIn: 0,
      premiacao: 0,
      notas: ""
    });
  };

  const adicionarTransacao = (e: React.FormEvent) => {
    e.preventDefault();
    const novoId = transacoes.length > 0 ? Math.max(...transacoes.map((t) => t.id)) + 1 : 1;
    const transacaoParaAdicionar = { ...novaTransacao, id: novoId, valor: parseFloat(String(novaTransacao.valor)) };
    setTransacoes([...transacoes, transacaoParaAdicionar as Transacao]);
    setNovaTransacao({
      data: format(new Date(), "yyyy-MM-dd"),
      tipo: "deposito",
      valor: 0,
      sala: salas[0],
    });
  };

  const removerTorneio = (id: number) => {
    setTorneios(torneios.filter((t) => t.id !== id));
  };

  const removerTransacao = (id: number) => {
    setTransacoes(transacoes.filter((t) => t.id !== id));
  };

  const torneiosFiltrados = torneios.filter(torneio => 
    torneio.nome.toLowerCase().includes(filtroNomeTorneio.toLowerCase())
  );

  return (
    <>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Adicionar Novo Torneio</h2>
          <form onSubmit={adicionarTorneio} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Data</label>
              <input
                type="date"
                value={novoTorneio.data}
                onChange={(e) => setNovoTorneio({ ...novoTorneio, data: e.target.value })}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Nome do Torneio</label>
              <input
                type="text"
                value={novoTorneio.nome}
                onChange={(e) => setNovoTorneio({ ...novoTorneio, nome: e.target.value })}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Sala</label>
              <select
                value={novoTorneio.sala}
                onChange={(e) => setNovoTorneio({ ...novoTorneio, sala: e.target.value })}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {salas.map((sala) => (
                  <option key={sala} value={sala}>
                    {sala}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Buy-In ($)</label>
              <input
                type="number"
                step="0.01"
                value={novoTorneio.buyIn}
                onChange={(e) => setNovoTorneio({ ...novoTorneio, buyIn: parseFloat(e.target.value) })}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Premiação ($)</label>
              <input
                type="number"
                step="0.01"
                value={novoTorneio.premiacao}
                onChange={(e) => setNovoTorneio({ ...novoTorneio, premiacao: parseFloat(e.target.value) })}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Notas</label>
              <textarea
                value={novoTorneio.notas}
                onChange={(e) => setNovoTorneio({ ...novoTorneio, notas: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Adicionar Torneio
            </button>
          </form>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Adicionar Transação</h2>
          <form onSubmit={adicionarTransacao} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Data</label>
              <input
                type="date"
                value={novaTransacao.data}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, data: e.target.value })}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Tipo</label>
              <select
                value={novaTransacao.tipo}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, tipo: e.target.value as "deposito" | "retirada" })}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm"
              >
                <option value="deposito">Depósito</option>
                <option value="retirada">Retirada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Valor ($)</label>
              <input
                type="number"
                step="0.01"
                value={novaTransacao.valor}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, valor: parseFloat(e.target.value) })}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Sala</label>
              <select
                value={novaTransacao.sala}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, sala: e.target.value })}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm"
              >
                {salas.map((sala) => (
                  <option key={sala} value={sala}>
                    {sala}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Adicionar Transação
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-white">Últimos Registros</h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-lg font-bold mb-2 text-blue-300">Torneios</h3>
          <div className="mb-4">
              <input
                  type="text"
                  placeholder="Filtrar por nome do torneio..."
                  value={filtroNomeTorneio}
                  onChange={(e) => setFiltroNomeTorneio(e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded text-white"
              />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700 text-gray-300 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Data</th>
                  <th className="py-3 px-6 text-left">Torneio</th>
                  <th className="py-3 px-6 text-left">Sala</th>
                  <th className="py-3 px-6 text-center">Buy-In</th>
                  <th className="py-3 px-6 text-center">Premiação</th>
                  <th className="py-3 px-6 text-center">Lucro</th>
                  <th className="py-3 px-6 text-left">Notas</th>
                  <th className="py-3 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-200 text-sm font-light">
                {[...torneiosFiltrados].reverse().map((torneio) => (
                  <tr
                    key={torneio.id}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {torneio.data}
                    </td>
                    <td className="py-3 px-6 text-left">{torneio.nome}</td>
                    <td className="py-3 px-6 text-left">{torneio.sala}</td>
                    <td className="py-3 px-6 text-center">
                      ${torneio.buyIn.toFixed(2)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      ${torneio.premiacao.toFixed(2)}
                    </td>
                    <td
                      className={`py-3 px-6 text-center font-bold ${
                        torneio.lucro >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      ${torneio.lucro.toFixed(2)}
                    </td>
                    <td className="py-3 px-6 text-left max-w-xs overflow-hidden text-ellipsis">
                      {torneio.notas}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => removerTorneio(torneio.id)}
                        className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-2 text-blue-300">Transações</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700 text-gray-300 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Data</th>
                  <th className="py-3 px-6 text-left">Tipo</th>
                  <th className="py-3 px-6 text-left">Valor</th>
                  <th className="py-3 px-6 text-left">Sala</th>
                  <th className="py-3 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-200 text-sm font-light">
                {[...transacoes].reverse().map((transacao) => (
                  <tr
                    key={transacao.id}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {transacao.data}
                    </td>
                    <td
                      className={`py-3 px-6 text-left font-bold ${
                        transacao.tipo === "deposito"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transacao.tipo === "deposito" ? "Depósito" : "Retirada"}
                    </td>
                    <td className="py-3 px-6 text-left">
                      ${transacao.valor.toFixed(2)}
                    </td>
                    <td className="py-3 px-6 text-left">{transacao.sala}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => removerTransacao(transacao.id)}
                        className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}