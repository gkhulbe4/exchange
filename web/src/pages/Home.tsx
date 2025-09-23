import Header from "@/components/home/Header";
import MarketCategories from "@/components/home/MarketCategories";
import MarketTable from "@/components/home/MarketTable";
import Features from "@/components/home/Features";
import CTA from "@/components/home/CTA";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <MarketCategories />
      <MarketTable />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
