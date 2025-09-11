import { Candle } from './types';

type JournalEntry = {
  time: string;
  result: boolean;
  marketType: string;
  lastCandle: Candle;
  context?: {
    hasSweep?: boolean;
    hasOrderBlock?: boolean; // ✅ Added for OB tracking
  };
};

const journal: JournalEntry[] = [];

export function checkTrend(candles: Candle[]): string {
  return candles[candles.length - 1].close > candles[0].open ? 'uptrend' : 'downtrend';
}

export function checkMomentum(candles: Candle[]): string {
  return candles[candles.length - 1].close - candles[candles.length - 2].close > 0 ? 'bullish' : 'bearish';
}

export function checkEntryTrigger(candles: Candle[]): boolean {
  return candles[candles.length - 1].close > candles[candles.length - 1].open;
}

export function detectLiquiditySweep(candles: Candle[]): boolean {
  if (candles.length < 2) return false;

  const prev = candles[candles.length - 2];
  const current = candles[candles.length - 1];

  const sweptLow = current.low < prev.low;
  const closedAbovePrevLow = current.close > prev.low;
  const longWick = (prev.low - current.low) > (current.close - current.open);

  return sweptLow && closedAbovePrevLow && longWick;
}

export function detectOrderBlock(candles: Candle[]): boolean {
  if (candles.length < 2) return false;

  const prev = candles[candles.length - 2];
  const current = candles[candles.length - 1];

  const isBullishEngulfing =
    prev.close < prev.open &&
    current.close > current.open &&
    current.close > prev.open &&
    current.open < prev.close;

  return isBullishEngulfing;
}

export function sniperSetup(entryCandles: Candle[], trendCandles: Candle[]): boolean {
  const trend = checkTrend(trendCandles);
  const momentum = checkMomentum(entryCandles);
  const entryTrigger = checkEntryTrigger(entryCandles);
  const sweep = detectLiquiditySweep(entryCandles);
  const orderBlock = detectOrderBlock(entryCandles);

  return trend === 'uptrend' &&
         momentum === 'bullish' &&
         entryTrigger &&
         sweep &&
         orderBlock;
}

export function logSniperSetup(
  candles: Candle[],
  result: boolean,
  marketType: string,
  context?: JournalEntry['context']
) {
  const last = candles[candles.length - 1];
  const entry: JournalEntry = {
    time: new Date().toISOString(),
    result,
    marketType,
    lastCandle: last,
    context
  };

  journal.push(entry);
  console.log('📘 Journal Entry:', entry);
}

export function getJournal(): JournalEntry[] {
  return journal;
}
