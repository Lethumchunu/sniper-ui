import { Candle } from './types';
import { checkTrend, checkMomentum, checkEntryTrigger } from './strategy';

export function getSniperReason(entryCandles: Candle[], trendCandles: Candle[]): string[] {
  const reasons: string[] = [];

  const trend = checkTrend(trendCandles);
  if (trend === 'uptrend') {
    reasons.push('✅ 1h trend is up');
  } else {
    reasons.push('❌ 1h trend is down');
  }

  const momentum = checkMomentum(entryCandles);
  if (momentum === 'bullish') {
    reasons.push('✅ 15m momentum is bullish');
  } else {
    reasons.push('❌ 15m momentum is bearish');
  }

  const entryTrigger = checkEntryTrigger(entryCandles);
  if (entryTrigger) {
    reasons.push('✅ 15m entry trigger is valid');
  } else {
    reasons.push('❌ 15m entry trigger is invalid');
  }

  return reasons;
}
