import { MoreVertical, TrendingUp } from "lucide-react";
import React from "react";

interface CardData {
  title: string;
  value: string;
  change: string;
  color: string;
  chartData: number[];
}

const DashboardCards: React.FC = () => {
  const cards: CardData[] = [
    {
      title: "Today's Tests",
      value: "95",
      change: "+2.5% This Month",
      color: "bg-green-500",
      chartData: [20, 30, 25, 40, 35, 45, 30],
    },
    {
      title: "Available Equipment",
      value: "1,457",
      change: "+2.5% This Month",
      color: "bg-blue-500",
      chartData: [15, 25, 20, 30, 25, 35, 20],
    },
    {
      title: "Pending Samples",
      value: "0",
      change: "+2.5% This Month",
      color: "bg-red-500",
      chartData: [5, 10, 8, 12, 10, 15, 8],
    },
    {
      title: "System Users",
      value: "255K",
      change: "+2.5% This Month",
      color: "bg-purple-500",
      chartData: [30, 40, 35, 50, 45, 55, 40],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {card.title}
            </h3>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {card.value}
            </span>
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{card.change}</span>
            </div>
          </div>

          <div className="flex items-end space-x-1 h-8">
            {card.chartData.map((height, i) => (
              <div
                key={i}
                className={`${card.color} rounded-sm opacity-80`}
                style={{
                  height: `${(height / 60) * 100}%`,
                  width: "8px",
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
