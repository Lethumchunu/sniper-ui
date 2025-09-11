import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar
} from 'recharts';
import { Candle } from '../engine/types';

type Props = {
  data: Candle[];
};

export const CandleChart: React.FC<Props> = ({ data }) => {
  const formatted = data.map(c => ({
    time: c.time,
    open: c.open,
    close: c.close,
    high: c.high,
    low: c.low,
    color: c.close > c.open ? '#4caf50' : '#f44336'
  }));

  return (
    <div style={{ margin: '2rem auto', maxWidth: '600px' }}>
      <h3>📉 Candle Chart Preview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={formatted}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="open" fill="#8884d8" />
          <Bar dataKey="close" fill="#82ca9d" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
