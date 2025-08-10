// components/FloatingCandles.tsx
import styles from './FloatingCandles.module.css';
import React from 'react';
const FloatingCandles = () => {
  const candleCount = 15;
  const candles = Array.from({ length: candleCount });

  const CandleSVG = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="60"
      viewBox="0 0 20 60"
      fill="none"
    >
      {/* Llama */}
      <path
        d="M10 5C8 2 12 0 10 0C8 0 8 3 8 5C8 7 12 7 12 5C12 3 10 2 10 5Z"
        fill="#ffdd55"
      />
      {/* Cuerpo de vela */}
      <rect x="6" y="8" width="8" height="50" rx="2" fill="#fff8dc" stroke="#e0c97f" />
      {/* Sombra */}
      <rect x="6" y="8" width="4" height="50" rx="2" fill="#f5deb3" />
    </svg>
  );

  return (
    <div className={styles.candleContainer}>
      {candles.map((_, index) => (
        <div
          key={index}
          className={styles.candle}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1}s`,
            animationDuration: `${5 + Math.random() * 15}s`,
          }}
        >
          <CandleSVG />
        </div>
      ))}
    </div>
  );
};

export default FloatingCandles;
