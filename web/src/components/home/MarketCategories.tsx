import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiSolana } from "react-icons/si";

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
}

const MarketCategories = ({
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
  console.log(btcPrice, ethPrice, solPrice);
  const newTokens: MarketData[] = [
    {
      symbol: "SWTCH",
      name: "Switch",
      price: 0.08752,
      change24h: -20.57,
      volume24h: 145000,
    },
    {
      symbol: "WLFI",
      name: "WLFI",
      price: 0.20888,
      change24h: -14.19,
      volume24h: 234000,
    },
    {
      symbol: "APT",
      name: "Aptos",
      price: 4.24,
      change24h: -8.16,
      volume24h: 892000,
    },
    {
      symbol: "XRP",
      name: "Ripple",
      price: 2.87,
      change24h: -3.47,
      volume24h: 1340000,
    },
    {
      symbol: "DOGE",
      name: "Dogecoin",
      price: 0.24128,
      change24h: -8.37,
      volume24h: 567000,
    },
  ];

  const topGainers: MarketData[] = [
    {
      symbol: "ME",
      name: "ME",
      price: 1.06,
      change24h: 41.9,
      volume24h: 890000,
    },
    {
      symbol: "FRAG",
      name: "Fragment",
      price: 0.04524,
      change24h: 9.41,
      volume24h: 123000,
    },
    {
      symbol: "HAEDAL",
      name: "Haedal",
      price: 0.16356,
      change24h: 1.72,
      volume24h: 234000,
    },
    {
      symbol: "USDT",
      name: "Tether",
      price: 1.0,
      change24h: 0.02,
      volume24h: 5670000,
    },
    {
      symbol: "SEND",
      name: "Send",
      price: 0.5653,
      change24h: -1.26,
      volume24h: 456000,
    },
  ];

  const popularTokens: MarketData[] = [
    {
      symbol: "SOL",
      name: "Solana",
      price: solPrice ?? 221.45,
      change24h: -7.14,
      volume24h: 12340000,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: isLoading ? 4176.73 : ethPrice,
      change24h: -6.95,
      volume24h: 23450000,
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: isLoading ? 112897.1 : btcPrice,
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

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${(price * 83).toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      })}`;
    } else if (price >= 1) {
      return `$${(price * 83).toFixed(2)}`;
    } else {
      return `$${(price * 83).toFixed(4)}`;
    }
  };

  const getTokenIcon = (symbol: string) => {
    switch (symbol) {
      case "BTC":
        return <FaBitcoin className="w-8 h-8 text-yellow-500" />;
      case "ETH":
        return <FaEthereum className="w-8 h-8 text-blue-400" />;
      case "SOL":
        return <SiSolana className="w-8 h-8 text-purple-600" />;
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow opacity-20" />
        );
    }
  };

  const renderTokenList = (tokens: MarketData[]) => (
    <div className="space-y-3">
      {tokens.map((token) => (
        <div key={token.symbol}>
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/20 transition-colors">
            <div className="flex items-center gap-3">
              {getTokenIcon(token.symbol)}
              <div>
                <div className="font-semibold text-sm">{token.symbol}</div>
                <div className="text-xs text-muted-foreground">
                  {token.name}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono">
                {formatPrice(token.price)}
              </div>
              <div
                className={`text-xs font-mono flex items-center gap-1 ${
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card hover:bg-card/80 transition-colors">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">New Listings</h3>
            {renderTokenList(newTokens)}
          </CardContent>
        </Card>

        <Card className="bg-card hover:bg-card/80 transition-colors">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Gainers</h3>
            {renderTokenList(topGainers)}
          </CardContent>
        </Card>

        <Card className="bg-card hover:bg-card/80 transition-colors">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Popular</h3>
            {renderTokenList(popularTokens)}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MarketCategories;
