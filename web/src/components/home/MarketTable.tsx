import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown } from "lucide-react";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import { formatCoinPrice, formatVolume } from "@/lib/utils/format";

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  openInterest?: number;
}

const MarketTable = ({
  btcPrice,
  ethPrice,
  solPrice,
  isLoading,
}: {
  btcPrice: number;
  ethPrice: number;
  solPrice: number;
  isLoading: boolean;
}) => {
  const [marketTab, setMarketTab] = useState("spot");

  const popularTokens: MarketData[] = [
    {
      symbol: "SOL",
      name: "Solana",
      price: 221.45,
      change24h: -7.14,
      volume24h: 12340000,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 4176.73,
      change24h: -6.95,
      volume24h: 23450000,
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 112897.1,
      change24h: -2.32,
      volume24h: 45670000,
    },
    {
      symbol: "USDT",
      name: "Tether",
      price: 1.0,
      change24h: 0.02,
      volume24h: 5670000,
    },
    {
      symbol: "APT",
      name: "Aptos",
      price: 4.24,
      change24h: -8.16,
      volume24h: 892000,
    },
  ];

  const futuresData: MarketData[] = [
    {
      symbol: "SOL-USD",
      name: "SOL Perpetual",
      price: 221.45,
      change24h: -7.09,
      volume24h: 402100000,
      openInterest: 223700000,
    },
    {
      symbol: "BTC-USD",
      name: "BTC Perpetual",
      price: 112889.0,
      change24h: -2.28,
      volume24h: 790300000,
      openInterest: 158700000,
    },
    {
      symbol: "ETH-USD",
      name: "ETH Perpetual",
      price: 4175.0,
      change24h: -6.96,
      volume24h: 346500000,
      openInterest: 88900000,
    },
    {
      symbol: "HYPE-USD",
      name: "HYPE Perpetual",
      price: 48.58,
      change24h: -7.2,
      volume24h: 35400000,
      openInterest: 8400000,
    },
    {
      symbol: "DOGE-USD",
      name: "DOGE Perpetual",
      price: 0.24161,
      change24h: -9.16,
      volume24h: 10600000,
      openInterest: 7000000,
    },
  ];

  const getTokenIcon = (symbol: string) => {
    if (symbol.includes("BTC")) {
      return <FaBitcoin className="w-8 h-8 text-yellow-500" />;
    } else if (symbol.includes("ETH")) {
      return <FaEthereum className="w-8 h-8 text-blue-400" />;
    } else if (symbol.includes("SOL")) {
      return <SiSolana className="w-8 h-8 text-purple-500" />;
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow opacity-20" />
      );
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <Tabs value={marketTab} onValueChange={setMarketTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="spot">Spot</TabsTrigger>
          <TabsTrigger value="futures">Futures</TabsTrigger>
          <TabsTrigger value="lend">Lend</TabsTrigger>
        </TabsList>

        <TabsContent value="spot">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                        24h Volume
                      </th>
                      <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                        24h Change
                      </th>
                      <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularTokens.map((token) => (
                      <tr
                        key={token.symbol}
                        className="border-b border-border hover:bg-secondary/10 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {getTokenIcon(token.symbol)}
                            <div>
                              <div className="font-semibold">
                                {token.symbol}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {token.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right p-4 font-mono">
                          {formatCoinPrice(token.price)}
                        </td>
                        <td className="text-right p-4 font-mono text-sm text-muted-foreground">
                          {formatVolume(token.volume24h)}
                        </td>
                        <td className="text-right p-4">
                          <div
                            className={`font-mono text-sm flex items-center justify-end gap-1 ${
                              token.change24h >= 0 ? "text-buy" : "text-sell"
                            }`}
                          >
                            {token.change24h >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {Math.abs(token.change24h).toFixed(2)}%
                          </div>
                        </td>
                        <td className="text-right p-4">
                          <Link to={`/market/${token.symbol}_USD`}>
                            <Button size="sm" variant="outline">
                              Trade
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="futures">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                        24h Volume
                      </th>
                      <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                        Open Interest
                      </th>
                      <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                        24h Change
                      </th>
                      <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {futuresData.map((token) => (
                      <tr
                        key={token.symbol}
                        className="border-b border-border hover:bg-secondary/10 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {getTokenIcon(token.symbol)}
                            <div>
                              <div className="font-semibold">
                                {token.symbol}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {token.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right p-4 font-mono">
                          {formatCoinPrice(token.price)}
                        </td>
                        <td className="text-right p-4 font-mono text-sm text-muted-foreground">
                          {formatVolume(token.volume24h)}
                        </td>
                        <td className="text-right p-4 font-mono text-sm text-muted-foreground">
                          {formatVolume(token.openInterest || 0)}
                        </td>
                        <td className="text-right p-4">
                          <div
                            className={`font-mono text-sm flex items-center justify-end gap-1 ${
                              token.change24h >= 0 ? "text-buy" : "text-sell"
                            }`}
                          >
                            {token.change24h >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {Math.abs(token.change24h).toFixed(2)}%
                          </div>
                        </td>
                        <td className="text-right p-4">
                          <Link
                            to={`/market/${token.symbol.split("-")[0]}_USD`}
                          >
                            <Button size="sm" variant="outline">
                              Trade
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lend">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Lending markets coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default MarketTable;
