export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  timeframe: '1m' | '5m' | '15m' | '1h';
};
