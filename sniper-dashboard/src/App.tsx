import React, { useState, useEffect } from 'react';
import { SniperStatusCard } from './components/SniperStatusCard';
import TradingViewChart from './components/TradingViewChart';
import {
  checkTrend,
  checkMomentum,
  checkEntryTrigger,
  detectLiquiditySweep,
  detectOrderBlock,
  evaluateSniperSetup,
  logSniperSetup,
  getJournal,
  detectCHoCH
} from './engine/strategy';
import { getSniperReason } from './engine/reason';
import {
  mockCandles1h,
  mockBullish15m,
  mockBearish15m,
  mockChoppy15m
} from './engine/mockData';

// ✅ Telegram Alert Function
async function sendTelegramAlert(message: string) {
  const botToken = 'YOUR_BOT_TOKEN'; // Replace with your actual token
  const chatId = 7147549538; // Your confirmed chat ID
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message })
  });
}

function App() {
  const [marketType, setMarketType] = useState<'bullish' | 'bearish' | 'choppy'>('bullish');
  const [filter, setFilter] = useState<'all' | 'valid' | 'invalid'>('all');
  const [autoTrade, setAutoTrade] = useState<boolean>(false);
  const [tradeHistory, setTradeHistory] = useState<
    { time: string; entry: number; exit: number; pnl: number }[]
  >([]);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [liveCandles, setLiveCandles] = useState<
    { time: string; open: number; high: number; low: number; close: number; volume: number; timeframe: '1m' }[]
  >([]);

  async function fetchGoldPrice() {
    const response = await fetch('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': 'goldapi-4x8ixsmfbmsxy0-io',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data.price;
  }

  useEffect(() => {
    let currentCandle = {
      time: new Date().toISOString(),
      open: livePrice ?? 0,
      high: livePrice ?? 0,
      low: livePrice ?? 0,
      close: livePrice ?? 0,
      volume: 0,
      timeframe: '1m' as '1m'
    };

    const interval = setInterval(async () => {
      const price = await fetchGoldPrice();
      setLivePrice(price);

      currentCandle.high = Math.max(currentCandle.high, price);
      currentCandle.low = Math.min(currentCandle.low, price);
      currentCandle.close = price;
      currentCandle.volume += 1;

      const now = new Date();
      if (now.getSeconds() === 0) {
        setLiveCandles(prev => [...prev.slice(-49), currentCandle]);
        currentCandle = {
          time: now.toISOString(),
          open: price,
          high: price,
          low: price,
          close: price,
          volume: 0,
          timeframe: '1m' as '1m'
        };
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const entryCandles =
    liveCandles.length >= 50
      ? liveCandles
      : marketType === 'bullish'
      ? mockBullish15m
      : marketType === 'bearish'
      ? mockBearish15m
      : mockChoppy15m;

  const trendCandles = mockCandles1h;

  const trend = checkTrend(trendCandles);
  const momentum = checkMomentum(entryCandles);
  const entryTrigger = checkEntryTrigger(entryCandles);
  const hasSweep = detectLiquiditySweep(entryCandles);
  const hasOrderBlock = detectOrderBlock(entryCandles);
  const choch = detectCHoCH(entryCandles);
  const reasons = getSniperReason(entryCandles, trendCandles);

  const { result: sniperSetupResult, strength } = evaluateSniperSetup(entryCandles, trendCandles);

  function executeTrade(candles: typeof entryCandles) {
    const entryCandle = candles[candles.length - 1];
    const entryPrice = entryCandle.close;

    const exitPrice = parseFloat((entryPrice * 1.015).toFixed(2));
    const pnl = parseFloat((exitPrice - entryPrice).toFixed(2));

    const trade = {
      time: entryCandle.time,
      entry: entryPrice,
      exit: exitPrice,
      pnl
    };

    setTradeHistory(prev => [...prev, trade]);
    console.log(`📈 Trade executed: Entry ${entryPrice}, Exit ${exitPrice}, P&L ${pnl}`);
  }

  useEffect(() => {
    logSniperSetup(entryCandles, sniperSetupResult, marketType, {
      hasSweep,
      hasOrderBlock,
      choch
    }, strength);

    if (autoTrade && strength === 'strong') {
      executeTrade(entryCandles);
      sendTelegramAlert(`🚨 Strong Setup Detected!\nMarket: ${marketType}\nClose: $${entryCandles.at(-1)?.close}`);
    }
  }, [marketType, autoTrade, entryCandles]);

  const filteredJournal = getJournal().filter((entry: any) => {
    if (filter === 'valid') return entry.strength === 'valid' || entry.strength === 'strong';
    if (filter === 'invalid') return entry.strength === 'invalid';
    return true;
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', minHeight: '100vh', padding: '2rem' }}>
      <h2>🎯 Sniper Strategy Dashboard</h2>

      <h4>📈 Live XAUUSD Price</h4>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        {livePrice ? `$${livePrice}` : 'Loading...'}
      </p>

      <label style={{ marginBottom: '1rem', display: 'block' }}>
        Market Condition:
        <select
          value={marketType}
          onChange={e => setMarketType(e.target.value as 'bullish' | 'bearish' | 'choppy')}
          style={{ marginLeft: '1rem', padding: '0.5rem' }}
        >
          <option value="bullish">Bullish</option>
          <option value="bearish">Bearish</option>
          <option value="choppy">Choppy</option>
        </select>
      </label>

      <label style={{ marginBottom: '1rem', display: 'block' }}>
        <input
          type="checkbox"
          checked={autoTrade}
          onChange={() => setAutoTrade(prev => !prev)}
          style={{ marginRight: '0.5rem' }}
        />
        Enable Auto-Trade for Strong Setups
      </label>

      <SniperStatusCard
        trend={trend === 'uptrend'}
        momentum={momentum === 'bullish'}
        entryTrigger={entryTrigger}
        sniperSetup={sniperSetupResult}
        reasons={reasons}
        hasSweep={hasSweep}
        hasOrderBlock={hasOrderBlock}
        strength={strength}
        choch={choch}
      />

      <p style={{ fontStyle: 'italic', color: '#666', marginTop: '1rem' }}>
        Trend confirmed using 1h candles
      </p>

      <h4 style={{ marginTop: '2rem' }}>📈 TradingView Chart</h4>
      <TradingViewChart />

      <label style={{ marginTop: '2rem', display: 'block' }}>
        Filter Journal:
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as 'all' | 'valid' | 'invalid')}
          style={{ marginLeft: '1rem', padding: '0.5rem' }}
        >
          <option value="all">All</option>
          <option value="valid">Valid + Strong</option>
          <option value="invalid">Invalid Only</option>
        </select>
      </label>

      <h4 style={{ marginTop: '1rem' }}>📘 Journaled Setups</h4>
      <ul>
        {filteredJournal.map((entry: any, index: number) => (
          <li key={index}>
            <strong>{entry.time}</strong> – 
            {entry.result ? '✅ Valid' : '❌ Invalid'} – 
            <span style={{
              color: entry.strength === 'strong' ? 'green' :
                     entry.strength === 'valid' ? 'blue' :
                     'red',
                            fontWeight: 'bold'
            }}>
              Strength: {entry.strength ?? 'N/A'}
            </span> – 
            Market: {entry.marketType} – 
            Close: {entry.lastCandle.close}
          </li>
        ))}
      </ul>

      <h4 style={{ marginTop: '2rem' }}>📊 Simulated Trades</h4>
      <ul>
        {tradeHistory.map((trade, index) => (
          <li key={index} style={{ marginBottom: '0.5rem' }}>
            <strong>{trade.time}</strong> – Entry: {trade.entry} – Exit: {trade.exit} – 
            <span style={{ color: trade.pnl >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
              P&L: {trade.pnl}
            </span>
          </li>
        ))}
      </ul>

      <footer style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#999' }}>
        Built for sniper precision. No setup? No trade.
      </footer>
    </div>
  );
}

export default App;
