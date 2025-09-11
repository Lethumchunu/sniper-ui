# 🎯 Sniper Strategy Dashboard

A precision-focused trading dashboard built with React + TypeScript, designed to detect high-probability sniper setups using Smart Money Concepts (SMC).

---

## 🚀 Features

- ✅ Trend Detection (1h candles)
- ✅ Momentum Analysis (15m candles)
- ✅ Entry Trigger Confirmation
- ✅ Liquidity Sweep & Order Block Filters
- ✅ Setup Strength Scoring (`invalid`, `valid`, `strong`)
- ✅ Auto-Trade Simulation for Strong Setups
- ✅ Trade History with P&L Tracking
- ✅ Journal Logging & Filtering
- ✅ Candle Chart Preview

---

## 📊 Strategy Logic

A setup is considered **strong** when:
- Trend is up
- Momentum is bullish
- Entry trigger is confirmed
- Liquidity sweep **and** order block are detected

---

## 🧪 Simulated Trade Execution

When auto-trade is enabled:
- Trades are triggered for `strong` setups
- Entry at last candle close
- Exit at +1.5% target
- P&L is calculated and logged

---

## 📘 Journal & Trade History

- View all setup attempts with strength and market context
- Filter journal by setup validity
- Track simulated trades with entry, exit, and P&L

---

## 🛠️ Tech Stack

- React + TypeScript
- Modular strategy engine (`strategy.ts`)
- Custom components (`SniperStatusCard`, `CandleChart`)
- Local state management

---

## 📦 Installation

```bash
git clone https://github.com/Lethumchunu/sniper-dashboard.git
cd sniper-dashboard
npm install
npm start
