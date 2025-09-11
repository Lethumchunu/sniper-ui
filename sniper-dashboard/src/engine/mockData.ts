import { Candle } from './types';

export const mockBullish15m: Candle[] = [
  { time: '2025-09-06T09:00', open: 100, high: 105, low: 99, close: 104, timeframe: '15m' },
  { time: '2025-09-06T09:15', open: 104, high: 108, low: 103, close: 107, timeframe: '15m' },
  { time: '2025-09-06T09:30', open: 107, high: 112, low: 106, close: 110, timeframe: '15m' }
];

export const mockBearish15m: Candle[] = [
  { time: '2025-09-06T09:00', open: 110, high: 112, low: 108, close: 109, timeframe: '15m' },
  { time: '2025-09-06T09:15', open: 109, high: 110, low: 106, close: 107, timeframe: '15m' },
  { time: '2025-09-06T09:30', open: 107, high: 108, low: 104, close: 105, timeframe: '15m' }
];

export const mockChoppy15m: Candle[] = [
  { time: '2025-09-06T09:00', open: 100, high: 103, low: 97, close: 101, timeframe: '15m' },
  { time: '2025-09-06T09:15', open: 101, high: 104, low: 100, close: 100, timeframe: '15m' },
  { time: '2025-09-06T09:30', open: 100, high: 102, low: 98, close: 99, timeframe: '15m' }
];

export const mockCandles1h: Candle[] = [
  { time: '2025-09-06T07:00', open: 95, high: 102, low: 94, close: 100, timeframe: '1h' },
  { time: '2025-09-06T08:00', open: 100, high: 106, low: 99, close: 105, timeframe: '1h' },
  { time: '2025-09-06T09:00', open: 105, high: 110, low: 104, close: 108, timeframe: '1h' }
];
