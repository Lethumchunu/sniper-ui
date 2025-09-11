import React, { useEffect, useRef } from 'react';

const TradingViewChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).TradingView) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: 'OANDA:XAUUSD',
          interval: '15',
          timezone: 'Africa/Johannesburg',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_top_toolbar: false,
          container_id: 'tradingview-chart'
        });
      }
    };

    containerRef.current?.appendChild(script);
  }, []);

  return <div id="tradingview-chart" ref={containerRef} style={{ height: '500px' }} />;
};

export default TradingViewChart;
