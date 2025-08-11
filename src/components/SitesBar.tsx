import React from "react";

const pokerSites = [
  { name: "PokerStars", url: "https://www.pokerstars.com", emoji: "♠️" },
  { name: "GG Poker", url: "https://www.ggpoker.com", emoji: "♦️" },
  { name: "PartyPoker", url: "https://www.partypoker.com", emoji: "♥️" },
  { name: "888poker", url: "https://www.888poker.com", emoji: "♣️" },
  { name: "Winamax", url: "https://www.winamax.fr", emoji: "🎯" },
];

export default function SitesBar() {
  return (
    <div className="flex gap-4 p-3 bg-gray-100 rounded-lg shadow">
      {pokerSites.map((site) => (
        <a
          key={site.name}
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:underline"
        >
          <span className="text-xl">{site.emoji}</span>
          <span>{site.name}</span>
        </a>
      ))}
    </div>
  );
}
