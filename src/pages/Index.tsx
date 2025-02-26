
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, LineChart, Shield, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 w-full z-50 glass">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">seekcap</h1>
          <div className="flex gap-6">
            <Button variant="ghost" className="text-sm">
              Features
            </Button>
            <Button variant="ghost" className="text-sm">
              Solutions
            </Button>
            <Button variant="ghost" className="text-sm">
              About
            </Button>
            <Button className="flex items-center gap-2">
              Get Started
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </nav>
      </header>

      <main>
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <span className="px-3 py-1 rounded-full bg-primary/5 text-sm font-medium inline-block mb-6">
                Introducing Seekcap
              </span>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Discover the future of financial insights
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Advanced analytics and intelligent predictions for modern businesses,
                delivering clarity in complex financial landscapes.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="hover-scale">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="hover-scale">
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 glass hover-scale">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-muted-foreground">
                  Instant insights and live data analysis for immediate decision-making.
                </p>
              </Card>
              <Card className="p-6 glass hover-scale">
                <Shield className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security ensuring your data stays protected.
                </p>
              </Card>
              <Card className="p-6 glass hover-scale">
                <LineChart className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Predictive Models</h3>
                <p className="text-muted-foreground">
                  Advanced algorithms forecasting market trends and opportunities.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
