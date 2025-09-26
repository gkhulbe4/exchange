import Header from "@/components/home/Header";
import MarketCategories from "@/components/home/MarketCategories";
import MarketTable from "@/components/home/MarketTable";
import Features from "@/components/home/Features";
import CTA from "@/components/home/CTA";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMarketsCurrentPrice } from "@/lib/utils/fetchAllMarketsCurrentPrice";

const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["allMarketsCurrentPrice"],
    queryFn: fetchAllMarketsCurrentPrice,
    refetchOnWindowFocus: true,
  });
  console.log(data);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <MarketCategories
        btcPrice={Number(
          data?.response?.find((m) => m.market === "BTC_USD")?.current_price
        )}
        solPrice={Number(
          data?.response?.find((m) => m.market === "SOL_USD")?.current_price
        )}
        ethPrice={Number(
          data?.response?.find((m) => m.market === "ETH_USD")?.current_price
        )}
        isLoading={isLoading}
      />
      <MarketTable
        btcPrice={
          data?.response?.find((m) => m.market === "BTC_USD")?.current_price
        }
        solPrice={
          data?.response?.find((m) => m.market === "SOL_USD")?.current_price
        }
        ethPrice={
          data?.response?.find((m) => m.market === "ETH_USD")?.current_price
        }
        isLoading={isLoading}
      />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
