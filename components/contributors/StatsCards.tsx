import React from "react";

interface StatsCardsProps {
  stats: {
    total: number;
    level1: number;
    level2: number;
    level3: number;
    totalContributions: number;
  };
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
    <div className="p-6 text-center bg-white/10 rounded-2xl border border-primary/50 hover:bg-white/15 transition-colors">
      <div className="text-3xl font-extrabold text-primary mb-2">
        {stats.total}
      </div>
      <div className="text-sm text-gray-300">Contributors</div>
    </div>
    <div className="p-6 text-center bg-white/10 rounded-2xl border border-primary/50 hover:bg-white/15 transition-colors">
      <div className="text-3xl font-extrabold text-purple-400 mb-2">
        {stats.totalContributions}
      </div>
      <div className="text-sm text-gray-300">Total Commits</div>
    </div>
    <div className="p-6 text-center bg-white/10 rounded-2xl border border-primary/50 hover:bg-white/15 transition-colors">
      <div className="text-3xl font-extrabold text-yellow-400 mb-2">
        {stats.level3}
      </div>
      <div className="text-sm text-gray-300">Experts</div>
    </div>
    <div className="p-6 text-center bg-white/10 rounded-2xl border border-primary/50 hover:bg-white/15 transition-colors">
      <div className="text-3xl font-extrabold text-blue-400 mb-2">
        {stats.level2}
      </div>
      <div className="text-sm text-gray-300">Advanced</div>
    </div>
  </div>
);
