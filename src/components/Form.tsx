import React, { useState } from "react";
import { Tournament } from "../types";

interface FormProps {
  onAdd: (t: Tournament) => void;
}

const rooms = [
  { name: "PokerStars", icon: "♠" },
  { name: "GG Poker", icon: "♣" },
  { name: "888Poker", icon: "♦" },
  { name: "PartyPoker", icon: "♥" },
  { name: "Winamax", icon: "★" },
];

export default function Form({ onAdd }: FormProps) {
  const [form, setForm] = useState<Tournament>({
    date: "",
    room: rooms[0].name,
    buyIn: 0,
    prize: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm({ date: "", room: rooms[0].name, buyIn: 0, prize: 0 });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md space-y-4"
    >
      <div>
        <label className="block text-sm font-medium">Data</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="mt-1 w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Sala</label>
        <select
          value={form.room}
          onChange={(e) => setForm({ ...form, room: e.target.value })}
          className="mt-1 w-full border rounded p-2"
        >
          {rooms.map((r) => (
            <option key={r.name} value={r.name}>
              {r.icon} {r.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Buy-in ($)</label>
        <input
          type="number"
          step="0.01"
          value={form.buyIn}
          onChange={(e) =>
            setForm({ ...form, buyIn: parseFloat(e.target.value) })
          }
          className="mt-1 w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Premiação ($)</label>
        <input
          type="number"
          step="0.01"
          value={form.prize}
          onChange={(e) =>
            setForm({ ...form, prize: parseFloat(e.target.value) })
          }
          className="mt-1 w-full border rounded p-2"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Adicionar
      </button>
    </form>
  );
}
