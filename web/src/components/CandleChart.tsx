"use client";
import React, { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  Time,
  CandlestickSeries,
} from "lightweight-charts";
import { Kline } from "@/lib/types";

function Chart({ chartData }: { chartData: Kline[] }) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  // console.log(chartData);

  // Keeps track of the current (still forming) candle
  const currentCandleRef = useRef<{
    time: Time;
    open: number;
    high: number;
    low: number;
    close: number;
  } | null>(null);

  //   const { currentPrice } = useWebSocket();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "#0d0d10" },
        textColor: "#fff",
      },
      grid: {
        vertLines: { color: "#222328" },
        horzLines: { color: "#222328" },
      },
      timeScale: {
        borderColor: "#485c7b",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "#485c7b",
      },
    });

    candleSeriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: "#009e64",
      downColor: "#d0464c",
      borderDownColor: "#d0464c",
      borderUpColor: "#009e64",
      wickDownColor: "#d0464c",
      wickUpColor: "#009e64",
    });

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current || !chartData?.length) return;

    const formattedData = chartData.map((candle) => ({
      time: Math.floor(new Date(candle.bucket).getTime() / 1000) as Time,
      open: parseFloat(candle.open),
      high: parseFloat(candle.high),
      low: parseFloat(candle.low),
      close: parseFloat(candle.close),
    }));

    // console.log("Formatted data →", formattedData);

    candleSeriesRef.current.setData(formattedData);
    currentCandleRef.current = null;
  }, [chartData]);

  return (
    <div ref={chartContainerRef} className="w-full h-full min-h-[400px]" />
  );
}

export default Chart;
