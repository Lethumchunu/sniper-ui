import { Candle } from './types';

export function checkTrend(candles: Candle[]): 'uptrend' | 'downtrend' | 'sideways' {
  if (candles.length < 3) return 'sideways';

  const [c1, c2, c3] = candles.slice(-3);

  console.log('🔍 Trend Debug');
  console.log('Highs:', c1.high, c2.high, c3.high);
  console.log('Lows:', c1.low, c2.low, c3.low);

  const isHH = c3.high > c2.high && c2.high > c1.high;
  const isHL = c3.low > c2.low && c2.low > c1.low;

  const isLH = c3.high < c2.high && c2.high < c1.high;
  const isLL = c3.low < c2.low && c2.low < c1.low;

  if (isHH && isHL) return 'uptrend';
  if (isLH && isLL) return 'downtrend';

  return 'sideways';
}

export function checkMomentum(candles: Candle[]): 'bullish' | 'bearish' | 'neutral' {
  if (candles.length < 3) return 'neutral';

  const lastThree = candles.slice(-3);

  const strongBullish = lastThree.every(c => c.close > c.open && (c.close - c.open) > (c.high - c.low) * 0.5);
  const strongBearish = lastThree.every(c => c.close < c.open && (c.open - c.close) > (c.high - c.low) * 0.5);

  if (strongBullish) return 'bullish';
  if (strongBearish) return 'bearish';

  return 'neutral';
}

export function checkEntryTrigger(candles: Candle[]): boolean {
  if (candles.length < 2) return false;

  const prev = candles[candles.length - 2];
  const current = candles[candles.length - 1];

  console.log('🔍 Entry Trigger Debug');
  console.log('Prev:', prev);
  console.log('Current:', current);

  const isBullishEngulfing =
    current.close > current.open &&
    current.open < prev.close &&
    current.close > prev.open;

  const isBearishEngulfing =
    current.close < current.open &&
    current.open > prev.close &&
    current.close < prev.open;

  return isBullishEngulfing || isBearishEngulfing;
}

export function isSniperSetup(candles: Candle[]): boolean {
  const trend = checkTrend(candles);
  const momentum = checkMomentum(candles);
  const entry = checkEntryTrigger(candles);

  console.log('🧠 Sniper Setup Debug');
  console.log('Trend:', trend);
  console.log('Momentum:', momentum);
  console.log('Entry Trigger:', entry ? 'Valid' : 'Not Found');

  const isAligned =
    (trend === 'uptrend' && momentum === 'bullish') ||
    (trend === 'downtrend' && momentum === 'bearish');

  return isAligned && entry;
}
