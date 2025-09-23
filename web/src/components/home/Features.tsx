import { Shield, Zap, BarChart3 } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Trading",
      description:
        "Industry-leading security with cold storage and multi-signature wallets",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Ultra-low latency matching engine processing millions of orders per second",
    },
    {
      icon: BarChart3,
      title: "Advanced Charts",
      description:
        "Professional trading tools with real-time market data and technical indicators",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        Why Choose Zenith?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
