import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-gradient-to-r from-primary to-primary-glow rounded-3xl p-12 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Start Trading Today</h2>
        <p className="text-xl mb-8 opacity-90">
          Join millions of traders on the most trusted platform
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/trade">
            <Button
              size="lg"
              className="bg-white text-black font-bold rounded-xl hover:bg-white/90"
            >
              Start Trading
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white rounded-xl hover:bg-white/10"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
