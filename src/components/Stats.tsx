
import { Tournament } from "../types";

interface StatsProps {
  data: Tournament[];
}

export default function Stats({ data }: StatsProps) {
  const totalBuyIn = data.reduce((acc, t) => acc + t.buyIn, 0);
  const totalPrize = data.reduce((acc, t) => acc + t.prize, 0);
  const profit = totalPrize - totalBuyIn;
  const roi = totalBuyIn > 0 ? (profit / totalBuyIn) * 100 : 0;
  const itm =
    data.length > 0
      ? (data.filter((t) => t.prize > 0).length / data.length) * 100
      : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-lg font-bold">${profit.toFixed(2)}</p>
        <p className="text-sm text-gray-600">Lucro</p>
      </div>
      <div>
        <p className="text-lg font-bold">{roi.toFixed(1)}%</p>
        <p className="text-sm text-gray-600">ROI</p>
      </div>
      <div>
        <p className="text-lg font-bold">{itm.toFixed(1)}%</p>
        <p className="text-sm text-gray-600">ITM</p>
      </div>
    </div>
  );
}

