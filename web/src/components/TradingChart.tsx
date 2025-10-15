import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import CandleChart from "./CandleChart";
import { Kline } from "@/lib/types";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const TradingChart = () => {
  const [timeFrame, setTimeFrame] = useState("15m");
  const [chartData, setChartData] = useState<Kline[]>([]);
  const { market } = useParams();

  useEffect(() => {
    async function getChartData() {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }api/v1/trade/getKlineData?timeFrame=${timeFrame}&market=${market}`
        );
        const data: Kline[] = res.data.response;
        // console.log(data);
        setChartData(data);
      } catch (error) {
        console.error(error);
      }
    }

    getChartData();
  }, [timeFrame]);

  const timeframes = ["1m", "15m", "30m", "1h", "1d"];

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          {timeframes.map((tf) => (
            <Button
              onClick={() => setTimeFrame(tf)}
              key={tf}
              variant="ghost"
              size="sm"
              className={`px-3 py-1 text-xs font-mono ${
                tf === timeFrame
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-chart-bg p-4">
        {chartData.length > 0 ? (
          <CandleChart chartData={chartData} />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingChart;
