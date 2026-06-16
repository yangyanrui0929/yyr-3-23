import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Sun, Moon, Zap, Battery, Smile, Meh, Frown, AlertTriangle, Building } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const {
    dayTime,
    totalGeneration,
    totalConsumption,
    storedPower,
    maxStorage,
    satisfaction,
    openSettlement,
    networks,
    getLineForNetwork,
    openLineNameModal,
  } = useGameStore();

  const isDay = dayTime < 50;
  const netPower = totalGeneration - totalConsumption;
  const storagePercent = maxStorage > 0 ? (storedPower / maxStorage) * 100 : 0;

  const getSatisfactionIcon = () => {
    if (satisfaction >= 70) return <Smile className="w-5 h-5 text-green-500" />;
    if (satisfaction >= 40) return <Meh className="w-5 h-5 text-yellow-500" />;
    return <Frown className="w-5 h-5 text-red-500" />;
  };

  const getSatisfactionText = () => {
    if (satisfaction >= 80) return '非常满意';
    if (satisfaction >= 60) return '比较满意';
    if (satisfaction >= 40) return '一般';
    if (satisfaction >= 20) return '不太满意';
    return '非常不满';
  };

  const validNetworks = networks.filter((n) => n.hasWire && n.buildingCount > 0);

  const namedNetworks = validNetworks.filter((n) => {
    const line = getLineForNetwork(n.networkId);
    return line !== null;
  });

  const unnamedNetworks = validNetworks.filter((n) => {
    const line = getLineForNetwork(n.networkId);
    return line === null;
  });

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
              isDay ? 'bg-yellow-100' : 'bg-indigo-900'
            }`}
          >
            {isDay ? (
              <Sun className="w-6 h-6 text-yellow-500 animate-pulse" />
            ) : (
              <Moon className="w-6 h-6 text-indigo-300" />
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500">{isDay ? '白天' : '夜晚'}</p>
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${dayTime}%`,
                  background: isDay
                    ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
                    : 'linear-gradient(90deg, #6366F1, #4338CA)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="h-10 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">电力</p>
            <p className="text-sm font-bold">
              <span className="text-green-600">+{totalGeneration}</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-red-500">-{totalConsumption}</span>
            </p>
            <p
              className={`text-xs font-semibold ${
                netPower >= 0 ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {netPower >= 0 ? '▲' : '▼'} {Math.abs(netPower)}
            </p>
          </div>
        </div>

        <div className="h-10 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <Battery className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">蓄电池</p>
            <p className="text-sm font-bold text-gray-700">
              {Math.round(storedPower)} / {maxStorage}
            </p>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${storagePercent}%`,
                  background:
                    storagePercent > 60
                      ? 'linear-gradient(90deg, #34D399, #10B981)'
                      : storagePercent > 30
                      ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
                      : 'linear-gradient(90deg, #F87171, #EF4444)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="h-10 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
            {getSatisfactionIcon()}
          </div>
          <div>
            <p className="text-xs text-gray-500">居民满意度</p>
            <p className="text-sm font-bold text-gray-700">{getSatisfactionText()}</p>
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${satisfaction}%`,
                  background:
                    satisfaction >= 60
                      ? 'linear-gradient(90deg, #34D399, #10B981)'
                      : satisfaction >= 30
                      ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
                      : 'linear-gradient(90deg, #F87171, #EF4444)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="h-10 w-px bg-gray-200" />

        <button
          onClick={openSettlement}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 text-sm"
        >
          📊 结算
        </button>
      </div>

      {(namedNetworks.length > 0 || unnamedNetworks.length > 0) && (
        <div className="pt-3 border-t border-gray-200/60">
          <h3 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            线路统计
            <span className="text-gray-400 font-normal">（点击电线可命名线路）</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {namedNetworks.map((network) => {
              const line = getLineForNetwork(network.networkId);
              if (!line) return null;
              const loadRatio =
                network.generation > 0
                  ? Math.min(100, (network.consumption / network.generation) * 100)
                  : network.consumption > 0
                  ? 100
                  : 0;

              return (
                <button
                  key={network.networkId}
                  onClick={() => openLineNameModal(network.networkId)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left min-w-[140px]"
                  style={{
                    borderLeft: `4px solid ${line.color}`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{line.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-0.5">
                        <Building className="w-3 h-3" />
                        {network.poweredBuildingCount}/{network.buildingCount}
                      </span>
                      <span className="flex items-center gap-0.5 text-red-500">
                        <AlertTriangle className="w-3 h-3" />
                        {network.faultyCount}
                      </span>
                      <span
                        className={`font-semibold ${
                          loadRatio > 90
                            ? 'text-red-500'
                            : loadRatio > 60
                            ? 'text-amber-500'
                            : 'text-green-500'
                        }`}
                      >
                        {Math.round(loadRatio)}%
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}

            {unnamedNetworks.map((network, idx) => {
              const loadRatio =
                network.generation > 0
                  ? Math.min(100, (network.consumption / network.generation) * 100)
                  : network.consumption > 0
                  ? 100
                  : 0;

              return (
                <button
                  key={network.networkId}
                  onClick={() => openLineNameModal(network.networkId)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left min-w-[140px] border-dashed border-2 border-gray-300"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-400 truncate">
                      未命名线路 {idx + 1}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center gap-0.5">
                        <Building className="w-3 h-3" />
                        {network.poweredBuildingCount}/{network.buildingCount}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" />
                        {network.faultyCount}
                      </span>
                      <span>{Math.round(loadRatio)}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
