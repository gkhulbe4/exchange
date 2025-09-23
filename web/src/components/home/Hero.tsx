import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Sparkles,
  Users,
} from "lucide-react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Wire Transfers are Live",
      subtitle: "Deposit and withdraw INR with no fees.",
      cta: "Start Trading",
      bgGradient: "from-primary to-primary-glow",
      image:
        "https://ivory-occasional-marmoset-271.mypinata.cloud/ipfs/bafkreicaakptfjczpdofexdbgeriiht2jgz336eozfed7pedhi6q6hxdii",
    },
    {
      title: "Cash Rewards",
      subtitle:
        "Generate volume to level up and earn up to ₹32L in cash rewards.",
      cta: "View Rewards",
      bgGradient: "from-buy to-buy-light",
      image: "https://d2hpp4ok8w7j4q.cloudfront.net/assets/Blog-Banner7.jpg",
    },
    {
      title: "Lend SOL. Earn 4.68% APY",
      subtitle:
        "Lend SOL to earn staking yield + lending yield, and use as collateral.",
      cta: "Lend SOL",
      bgGradient: "from-accent to-accent-light",
      image:
        "https://ivory-occasional-marmoset-271.mypinata.cloud/ipfs/bafkreihev34pghr2l5bvs2vtrwcmdychtaibkgrzidkkamnbr3333hli7u",
    },
    {
      title: "Invite Friends and Earn",
      subtitle:
        "Refer a friend and earn a percentage of their trading fees & points.",
      cta: "Manage Referrals",
      bgGradient: "from-secondary to-secondary-light",
      image:
        "https://ivory-occasional-marmoset-271.mypinata.cloud/ipfs/bafkreicgbphrfrvzl3ykwc4vke2pmk6gwt3udtokbdh36bqqnq3axtejue",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  return (
    <section className="relative bg-gradient-to-br from-background via-secondary/5 to-background overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <div className="relative h-[400px] rounded-2xl overflow-hidden">
          {heroSlides.map((slide, index) => {
            return (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-full"
                }`}
              >
                <div
                  className={`h-full bg-gradient-to-br ${slide.bgGradient} p-12 flex items-center relative`}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="max-w-2xl text-white z-10">
                    <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-xl mb-8 opacity-90 text-gray-300">
                      {slide.subtitle}
                    </p>
                    <Button
                      size="lg"
                      className="bg-white text-black font-bold rounded-xl hover:bg-white/90"
                    >
                      {slide.cta}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
