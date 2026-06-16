export type CellType = 'empty' | 'windmill' | 'house' | 'factory' | 'battery' | 'wire';

export type ToolType = CellType | 'remove';

export interface GridCell {
  x: number;
  y: number;
  type: CellType;
  rotation: number;
  powered: boolean;
  faulty: boolean;
}

export const GRID_SIZE = 8;

export const BUILDING_STATS = {
  windmill: { dayGen: 5, nightGen: 1, consumption: 0, name: '风车', emoji: '🌀' },
  house: { dayGen: 0, nightGen: 0, consumption: 2, name: '住房', emoji: '🏠' },
  factory: { dayGen: 0, nightGen: 0, consumption: 4, name: '工坊', emoji: '🏭' },
  battery: { dayGen: 0, nightGen: 0, consumption: 0, storage: 20, name: '蓄电池', emoji: '🔋' },
  wire: { dayGen: 0, nightGen: 0, consumption: 0, name: '电线', emoji: '⚡' },
} as const;

export const WIRE_CONNECTIONS: Record<number, [boolean, boolean, boolean, boolean]> = {
  0: [true, false, true, false],
  1: [false, true, false, true],
  2: [true, true, false, false],
  3: [true, false, false, true],
  4: [false, true, true, false],
  5: [false, false, true, true],
};

export const DIR_OFFSETS: Array<[number, number]> = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export const TOOLS: Array<{ type: ToolType; name: string; emoji: string; description: string }> = [
  { type: 'windmill', name: '风车', emoji: '🌀', description: '白天+5电，夜晚+1电' },
  { type: 'house', name: '住房', emoji: '🏠', description: '消耗2电，提供满意度' },
  { type: 'factory', name: '工坊', emoji: '🏭', description: '消耗4电，生产物资' },
  { type: 'battery', name: '蓄电池', emoji: '🔋', description: '存储20电量' },
  { type: 'wire', name: '电线', emoji: '⚡', description: '传导电力，右键/R旋转' },
  { type: 'remove', name: '拆除', emoji: '🗑️', description: '移除建筑或电线' },
];

export const DAY_LENGTH = 100;
export const DAY_THRESHOLD = 50;
export const TICK_INTERVAL = 300;
export const FAULT_CHANCE = 0.002;

export interface PowerLine {
  id: string;
  name: string;
  color: string;
  glowColor: string;
}

export const LINE_COLORS: Array<{ color: string; glowColor: string }> = [
  { color: '#3B82F6', glowColor: 'rgba(59, 130, 246, 0.5)' },
  { color: '#10B981', glowColor: 'rgba(16, 185, 129, 0.5)' },
  { color: '#F59E0B', glowColor: 'rgba(245, 158, 11, 0.5)' },
  { color: '#EF4444', glowColor: 'rgba(239, 68, 68, 0.5)' },
  { color: '#8B5CF6', glowColor: 'rgba(139, 92, 246, 0.5)' },
  { color: '#EC4899', glowColor: 'rgba(236, 72, 153, 0.5)' },
  { color: '#06B6D4', glowColor: 'rgba(6, 182, 212, 0.5)' },
  { color: '#84CC16', glowColor: 'rgba(132, 204, 22, 0.5)' },
];

export const DEFAULT_LINE_COLOR = { color: '#3B82F6', glowColor: 'rgba(59, 130, 246, 0.5)' };

export interface NetworkInfo {
  networkId: string;
  cells: Set<string>;
  generation: number;
  consumption: number;
  batteryCapacity: number;
  buildingCount: number;
  faultyCount: number;
  poweredBuildingCount: number;
  hasWire: boolean;
}
