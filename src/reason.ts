import { Candle } from './types';
import { checkTrend, checkMomentum, checkEntryTrigger } from './strategy';

export function getSniperReason(candles: Candle[]) {
  const trend = checkTrend(candles);
  const momentum = checkMomentum(candles);
  const entry = checkEntryTrigger(candles);

  const reasons = [];

  if (trend !== 'uptrend' && trend !== 'downtrend') {
    reasons.push(`❌ Trend is '${trend}' — no clear direction`);
  } else {
    reasons.push(`✅ Trend is '${trend}'`);
  }

  if (
    (trend === 'uptrend' && momentum !== 'bullish') ||
    (trend === 'downtrend' && momentum !== 'bearish')
  ) {
    reasons.push(`❌ Momentum is '${momentum}' — not aligned with trend`);
  } else {
    reasons.push(`✅ Momentum is '${momentum}'`);
  }

  if (!entry) {
    reasons.push('❌ Entry trigger not found');
  } else {
    reasons.push('✅ Entry trigger is valid');
  }

  return reasons;
}
