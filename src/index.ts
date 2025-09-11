import { mockCandles } from './mockData';
import {
  checkTrend,
  checkMomentum,
  checkEntryTrigger,
  isSniperSetup
} from './strategy';
import { isInSession } from './session';
import { triggerSniperAlert } from './alert';
import { getSniperReason } from './reason';

const now = new Date();

if (isInSession(now)) {
  const trend = checkTrend(mockCandles);
  const momentum = checkMomentum(mockCandles);
  const entryTrigger = checkEntryTrigger(mockCandles);
  const sniperSetup = isSniperSetup(mockCandles);

  console.log(`📊 Current HTF Trend: ${trend}`);
  console.log(`⚡ Momentum Filter: ${momentum}`);
  console.log(`🎯 Entry Trigger: ${entryTrigger ? 'Valid' : 'Not Found'}`);

  if (sniperSetup) {
    console.log('🚨 Sniper Setup: ✅ YES');
    triggerSniperAlert({ trend, momentum, entry: entryTrigger });
  } else {
    console.log('🚨 Sniper Setup: ❌ NO');
    const reasons = getSniperReason(mockCandles);
    reasons.forEach(reason => console.log(reason));
  }
} else {
  console.log('⏳ Outside of trading session. Sniper logic paused.');
}
