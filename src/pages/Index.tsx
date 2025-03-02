
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Database, LineChart, Shield, Zap, ServerCog, Network } from "lucide-react";

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
            <Link to="/dashboard">
              <Button className="flex items-center gap-2">
                Dashboard
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
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
                SCADA Passive Asset Discovery
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Automatically detect and monitor industrial control systems on your network.
                Gain visibility into your OT assets without active scanning.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="hover-scale">
                    Open Dashboard
                  </Button>
                </Link>
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
                <Network className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Passive Discovery</h3>
                <p className="text-muted-foreground">
                  Discover assets without active scanning that could disrupt sensitive industrial systems.
                </p>
              </Card>
              <Card className="p-6 glass hover-scale">
                <Shield className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Security Analysis</h3>
                <p className="text-muted-foreground">
                  Identify potential vulnerabilities and monitor for anomalous behavior.
                </p>
              </Card>
              <Card className="p-6 glass hover-scale">
                <ServerCog className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">SCADA Protocol Detection</h3>
                <p className="text-muted-foreground">
                  Automatically identify industrial protocols like Modbus, DNP3, and EtherNet/IP.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Database className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Asset Inventory</h3>
                <p className="text-muted-foreground">
                  Maintain a complete inventory of all network assets.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <LineChart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analytics & Reports</h3>
                <p className="text-muted-foreground">
                  Generate comprehensive reports and visualize network data.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Security Monitoring</h3>
                <p className="text-muted-foreground">
                  Keep track of network changes and detect anomalies.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Alerts</h3>
                <p className="text-muted-foreground">
                  Get notified about critical changes in your infrastructure.
                </p>
              </div>
            </div>
            
            <div className="mt-12">
              <Link to="/dashboard">
                <Button size="lg">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
