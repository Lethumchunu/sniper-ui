import React, { useEffect, useRef } from 'react';
import {
  createChart,
  Time,
  CandlestickData,
  IChartApi,
  ISeriesApi
} from 'lightweight-charts';

type Candle = {
  time: string; // ISO string
  open: number;
  high: number;
  low: number;
  close: number;
};

interface Props {
  data: Candle[];
}

const LiveChart: React.FC<Props> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 300,
        layout: {
          background: {
            color: '#ffffff'
          },
          textColor: '#000000'
        },
        grid: {
          vertLines: { color: '#eee' },
          horzLines: { color: '#eee' }
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: true
        }
      });

      seriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350'
      });
    }

    if (seriesRef.current) {
      const formattedData: CandlestickData<Time>[] = data.map(candle => ({
        time: Math.floor(new Date(candle.time).getTime() / 1000) as Time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close
      }));

      seriesRef.current.setData(formattedData);
    }
  }, [data]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />;
};

export default LiveChart;
