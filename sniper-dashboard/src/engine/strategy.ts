import { Candle } from './types';

export type SniperStrength = 'invalid' | 'valid' | 'strong';

type JournalEntry = {
  time: string;
  result: boolean;
  strength?: SniperStrength;
  marketType: string;
  lastCandle: Candle;
  context?: {
    hasSweep?: boolean;
    hasOrderBlock?: boolean;
    choch?: 'bullish' | 'bearish' | null;
    volumeSpike?: boolean;
    retest?: boolean;
    roundLevelConfluence?: boolean;
    fibConfluence?: boolean;
    sessionValid?: boolean; // ✅ Added time-of-day filter
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

  const wickSize = prev.low - current.low;
  const bodySize = Math.abs(current.close - current.open);
  const wickToBodyRatio = wickSize / bodySize;

  return sweptLow && closedAbovePrevLow && wickToBodyRatio > 2;
}

export function detectOrderBlock(candles: Candle[]): boolean {
  if (candles.length < 3) return false;

  const prev = candles[candles.length - 3];
  const current = candles[candles.length - 2];
  const next = candles[candles.length - 1];

  const isBullishEngulfing =
    prev.close < prev.open &&
    current.close > current.open &&
    current.close > prev.open &&
    current.open < prev.close;

  const followThrough = next.close > current.close;

  return isBullishEngulfing && followThrough;
}

export function detectRetest(candles: Candle[]): boolean {
  if (candles.length < 3) return false;

  const obCandle = candles[candles.length - 3];
  const retestCandle = candles[candles.length - 1];

  return retestCandle.low <= obCandle.high && retestCandle.low >= obCandle.open;
}

export function detectCHoCH(candles: Candle[]): 'bullish' | 'bearish' | null {
  if (candles.length < 3) return null;

  const [prev2, prev1, current] = candles.slice(-3);

  const isBullishCHoCH =
    prev2.low < prev1.low &&
    current.low > prev1.low &&
    current.high > prev1.high;

  const isBearishCHoCH =
    prev2.high > prev1.high &&
    current.high < prev1.high &&
    current.low < prev1.low;

  if (isBullishCHoCH) return 'bullish';
  if (isBearishCHoCH) return 'bearish';
  return null;
}

export function isNearRoundNumber(price: number, threshold: number = 5): boolean {
  const rounded = Math.round(price / 50) * 50;
  return Math.abs(price - rounded) <= threshold;
}

export function isInFibonacciZone(candles: Candle[], levels: number[] = [0.618, 0.786]): boolean {
  if (candles.length < 2) return false;

  const swingLow = Math.min(...candles.map(c => c.low));
  const swingHigh = Math.max(...candles.map(c => c.high));
  const currentClose = candles[candles.length - 1].close;

  const retracement = (swingHigh - currentClose) / (swingHigh - swingLow);

  return levels.some(level => Math.abs(retracement - level) < 0.03);
}

export function isHighVolumeSession(date: Date = new Date()): boolean {
  const hourUTC = date.getUTCHours();
  return (
    (hourUTC >= 7 && hourUTC <= 10) || // London Open
    (hourUTC >= 13 && hourUTC <= 16)   // NY Open
  );
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

export function evaluateSniperSetup(
  entryCandles: Candle[],
  trendCandles: Candle[]
): { result: boolean; strength: SniperStrength } {
  const trend = checkTrend(trendCandles);
  const momentum = checkMomentum(entryCandles);
  const entryTrigger = checkEntryTrigger(entryCandles);
  const sweep = detectLiquiditySweep(entryCandles);
  const orderBlock = detectOrderBlock(entryCandles);
  const retest = detectRetest(entryCandles);
  const choch = detectCHoCH(entryCandles);

  const prev = entryCandles[entryCandles.length - 2];
  const current = entryCandles[entryCandles.length - 1];

  const volumeSpike =
    typeof current.volume === 'number' &&
    typeof prev.volume === 'number' &&
    current.volume > prev.volume * 1.5;

  const roundLevelConfluence = isNearRoundNumber(current.close);
  const fibConfluence = isInFibonacciZone(entryCandles);
  const sessionValid = isHighVolumeSession();

  const baseValid = trend === 'uptrend' &&
                    momentum === 'bullish' &&
                    entryTrigger;

  const fullConfluence = baseValid &&
                         sweep &&
                         orderBlock &&
                         retest &&
                         volumeSpike &&
                         choch === 'bullish' &&
                         roundLevelConfluence &&
                         fibConfluence &&
                         sessionValid;

  if (fullConfluence) return { result: true, strength: 'strong' };
  if (baseValid && (sweep || orderBlock)) return { result: true, strength: 'valid' };
  return { result: false, strength: 'invalid' };
}

export function logSniperSetup(
  candles: Candle[],
  result: boolean,
  marketType: string,
  context?: JournalEntry['context'],
  strength?: SniperStrength
) {
  const last = candles[candles.length - 1];
  const entry: JournalEntry = {
    time: new Date().toISOString(),
    result,
    strength,
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
