// src/config.ts
export const strategyConfig = {
  mode: 'scalping', // or 'day'
  sessionFilter: true,
  momentumThreshold: 0.5,
  activeTriggers: ['engulfing', 'choch'],
  rrRatio: 2,
  partials: true,
};
