import React from 'react';
import { SniperStrength } from '../engine/strategy'; // ✅ Import the type

interface SniperStatusCardProps {
  trend: boolean;
  momentum: boolean;
  entryTrigger: boolean;
  sniperSetup: boolean;
  reasons: string[];
  hasSweep: boolean;
  hasOrderBlock: boolean;
  strength?: SniperStrength;
  choch?: 'bullish' | 'bearish' | null; // ✅ Added CHoCH prop
}

export const SniperStatusCard: React.FC<SniperStatusCardProps> = ({
  trend,
  momentum,
  entryTrigger,
  sniperSetup,
  reasons,
  hasSweep,
  hasOrderBlock,
  strength,
  choch
}) => {
  return (
    <div style={{
      border: '2px solid #444',
      padding: '1.5rem',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9',
      maxWidth: '500px',
      margin: '2rem auto',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      <h2>📊 Sniper Status</h2>

      <h3>🧩 Core Conditions</h3>
      <p><strong>Trend:</strong> {trend ? '✅ Uptrend' : '❌ Downtrend'}</p>
      <p><strong>Momentum:</strong> {momentum ? '✅ Bullish' : '❌ Bearish'}</p>
      <p><strong>Entry Trigger:</strong> {entryTrigger ? '✅ Confirmed' : '❌ Not Triggered'}</p>

      <h3>🔍 SMC Filters</h3>
      <p><strong>Liquidity Sweep:</strong> {hasSweep ? '🧠 Detected' : '❌ Not Detected'}</p>
      <p><strong>Order Block:</strong> {hasOrderBlock ? '🧱 Detected' : '❌ Not Detected'}</p>
      <p><strong>CHoCH:</strong> {choch ? `✅ ${choch}` : '❌ Not Detected'}</p> {/* ✅ CHoCH Display */}

      {strength && (
        <p><strong>Setup Strength:</strong> {strength === 'strong' ? '🔥 Strong' : strength === 'valid' ? '✅ Valid' : '🚫 Invalid'}</p>
      )}

      <h3>🎯 Final Setup</h3>
      <p><strong>Sniper Setup:</strong> {sniperSetup ? '🎯 Valid' : '🚫 Invalid'}</p>

      <h3>📌 Trade Decision</h3>
      <p style={{ fontWeight: 'bold', color: sniperSetup ? 'green' : 'red' }}>
        {sniperSetup
          ? '✅ Setup is valid. Trade can be considered.'
          : '🚫 Setup is invalid. No trade.'}
      </p>

      <h3>🧠 Reason Breakdown</h3>
      <ul>
        {reasons.map((reason, index) => (
          <li key={index}>📝 {reason}</li>
        ))}
      </ul>
    </div>
  );
};
