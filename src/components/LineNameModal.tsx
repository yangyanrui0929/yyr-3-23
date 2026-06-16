import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { X, Zap, AlertTriangle, Building } from 'lucide-react';
import { LINE_COLORS } from '../utils/constants';

export const LineNameModal: React.FC = () => {
  const {
    showLineNameModal,
    selectedNetworkId,
    closeLineNameModal,
    setLineName,
    networks,
    getLineForNetwork,
  } = useGameStore();

  const [lineName, setLineNameInput] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  useEffect(() => {
    if (showLineNameModal && selectedNetworkId) {
      const existingLine = getLineForNetwork(selectedNetworkId);
      if (existingLine) {
        setLineNameInput(existingLine.name);
        const colorIdx = LINE_COLORS.findIndex(
          (c) => c.color === existingLine.color
        );
        setSelectedColorIndex(colorIdx >= 0 ? colorIdx : 0);
      } else {
        setLineNameInput('');
        const usedColors = networks
          .map((n) => getLineForNetwork(n.networkId)?.color)
          .filter(Boolean);
        const firstUnused = LINE_COLORS.findIndex(
          (c) => !usedColors.includes(c.color)
        );
        setSelectedColorIndex(firstUnused >= 0 ? firstUnused : 0);
      }
    }
  }, [showLineNameModal, selectedNetworkId, getLineForNetwork, networks]);

  if (!showLineNameModal || !selectedNetworkId) return null;

  const network = networks.find((n) => n.networkId === selectedNetworkId);
  if (!network) return null;

  const existingLine = getLineForNetwork(selectedNetworkId);

  const handleSave = () => {
    const name = lineName.trim() || '未命名线路';
    setLineName(selectedNetworkId, name, selectedColorIndex);
    closeLineNameModal();
  };

  const loadRatio =
    network.generation > 0
      ? Math.min(100, (network.consumption / network.generation) * 100)
      : network.consumption > 0
      ? 100
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={closeLineNameModal}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-[scaleIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="p-6 text-white relative"
          style={{
            background: `linear-gradient(135deg, ${LINE_COLORS[selectedColorIndex].color} 0%, ${LINE_COLORS[(selectedColorIndex + 2) % LINE_COLORS.length].color} 100%)`,
          }}
        >
          <button
            onClick={closeLineNameModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6" />
            {existingLine ? '编辑线路' : '命名线路'}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            为这条电力线路起一个名字吧
          </p>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              线路名称
            </label>
            <input
              type="text"
              value={lineName}
              onChange={(e) => setLineNameInput(e.target.value)}
              placeholder="例如：住宅线、工坊线、蓄电线..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none transition-colors text-gray-800"
              autoFocus
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              线路颜色
            </label>
            <div className="flex flex-wrap gap-2">
              {LINE_COLORS.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColorIndex(index)}
                  className={`w-10 h-10 rounded-full transition-all duration-200 ${
                    selectedColorIndex === index
                      ? 'ring-4 ring-offset-2 ring-gray-300 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: color.color,
                    boxShadow: `0 2px 8px ${color.glowColor}`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Building className="w-4 h-4" />
              线路统计
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white rounded-lg p-2">
                <p className="text-xl font-bold text-blue-600">
                  {network.buildingCount}
                </p>
                <p className="text-xs text-gray-500">供电建筑</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-xl font-bold text-red-500">
                  {network.faultyCount}
                </p>
                <p className="text-xs text-gray-500">故障数</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-xl font-bold text-amber-500">
                  {Math.round(loadRatio)}%
                </p>
                <p className="text-xs text-gray-500">负载占比</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>发电: +{network.generation}</span>
                <span>耗电: -{network.consumption}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${loadRatio}%`,
                    backgroundColor:
                      loadRatio > 90
                        ? '#EF4444'
                        : loadRatio > 60
                        ? '#F59E0B'
                        : '#10B981',
                  }}
                />
              </div>
            </div>
          </div>

          {network.faultyCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">
                该线路有 {network.faultyCount} 处故障需要维修
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={closeLineNameModal}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-200"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              保存
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
