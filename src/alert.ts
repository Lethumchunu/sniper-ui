export function triggerSniperAlert(details: {
  trend: string;
  momentum: string;
  entry: boolean;
}) {
  console.log('\n🚨 ALERT: Sniper Setup Triggered!');
  console.log(`📊 Trend: ${details.trend}`);
  console.log(`⚡ Momentum: ${details.momentum}`);
  console.log(`🎯 Entry Trigger: ${details.entry ? 'Valid' : 'Not Found'}`);
  console.log('📍 Action: Review chart and prepare execution.\n');
}
