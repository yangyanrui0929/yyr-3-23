import React from 'react';
import { GridCell, BUILDING_STATS, WIRE_CONNECTIONS, DEFAULT_LINE_COLOR } from '../utils/constants';
import { useGameStore } from '../store/useGameStore';
import { getNetworkIdForCell } from '../utils/powerCalculator';

interface BuildingProps {
  cell: GridCell;
}

export const Building: React.FC<BuildingProps> = ({ cell }) => {
  const { networks, getLineForNetwork } = useGameStore();

  if (cell.type === 'empty') return null;

  const networkId = getNetworkIdForCell(networks, cell.x, cell.y);
  const line = networkId ? getLineForNetwork(networkId) : null;
  const lineColor = line ? { color: line.color, glowColor: line.glowColor } : DEFAULT_LINE_COLOR;

  if (cell.type === 'wire') {
    return (
      <WireVisual
        rotation={cell.rotation}
        powered={cell.powered}
        faulty={cell.faulty}
        lineColor={lineColor}
        hasCustomName={!!line}
      />
    );
  }

  const stats = BUILDING_STATS[cell.type];
  const isRotating = cell.type === 'windmill' && cell.powered && !cell.faulty;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className={`text-3xl transition-all duration-200 ${
          cell.powered && !cell.faulty ? 'scale-100 drop-shadow-lg' : 'opacity-60 scale-95'
        } ${isRotating ? 'animate-[spin_3s_linear_infinite]' : ''}`}
        style={{
          filter: cell.faulty
            ? 'hue-rotate(-50deg) saturate(2)'
            : cell.powered
            ? 'none'
            : 'grayscale(50%)',
        }}
      >
        {stats.emoji}
      </div>
      {cell.faulty && (
        <div className="absolute -top-1 -right-1 text-sm animate-pulse">⚠️</div>
      )}
      {cell.type === 'battery' && !cell.faulty && (
        <div className="absolute bottom-0 left-1 right-1 h-1.5 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500"
            style={{ width: `${Math.min(100, cell.powered ? 80 : 30)}%` }}
          />
        </div>
      )}
    </div>
  );
};

interface WireVisualProps {
  rotation: number;
  powered: boolean;
  faulty: boolean;
  lineColor: { color: string; glowColor: string };
  hasCustomName: boolean;
}

const WireVisual: React.FC<WireVisualProps> = ({ rotation, powered, faulty, lineColor, hasCustomName }) => {
  const connections = WIRE_CONNECTIONS[rotation % 6] || [true, false, true, false];
  const [top, right, bottom, left] = connections;

  const baseColor = faulty
    ? '#EF4444'
    : powered
    ? hasCustomName
      ? lineColor.color
      : '#3B82F6'
    : '#9CA3AF';
  const glowColor = faulty
    ? 'rgba(239, 68, 68, 0.6)'
    : powered
    ? hasCustomName
      ? lineColor.glowColor
      : 'rgba(59, 130, 246, 0.5)'
    : 'transparent';

  const lineStyle: React.CSSProperties = {
    backgroundColor: baseColor,
    boxShadow: powered || faulty ? `0 0 8px ${glowColor}` : 'none',
    transition: 'all 0.3s ease',
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {top && (
        <div
          className="absolute left-1/2 top-0 w-1.5 h-1/2 -translate-x-1/2 rounded-full"
          style={lineStyle}
        />
      )}
      {right && (
        <div
          className="absolute right-0 top-1/2 w-1/2 h-1.5 -translate-y-1/2 rounded-full"
          style={lineStyle}
        />
      )}
      {bottom && (
        <div
          className="absolute left-1/2 bottom-0 w-1.5 h-1/2 -translate-x-1/2 rounded-full"
          style={lineStyle}
        />
      )}
      {left && (
        <div
          className="absolute left-0 top-1/2 w-1/2 h-1.5 -translate-y-1/2 rounded-full"
          style={lineStyle}
        />
      )}
      <div
        className={`absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${
          powered && !faulty ? 'animate-pulse' : ''
        }`}
        style={{
          backgroundColor: baseColor,
          boxShadow: powered || faulty ? `0 0 10px ${glowColor}` : 'none',
        }}
      />
      {faulty && (
        <div className="absolute -top-1 -right-1 text-xs animate-pulse">⚠️</div>
      )}
    </div>
  );
};
