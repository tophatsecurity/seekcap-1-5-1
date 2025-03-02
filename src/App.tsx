
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { JsonDataProvider } from "./context/JsonDataContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import AssetDetail from "./pages/AssetDetail";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Data from "./pages/Data";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Set document title
    document.title = "THS|SEEKCAP";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <JsonDataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
              <Route path="/assets" element={<Layout><Assets /></Layout>} />
              <Route path="/assets/:macAddress" element={<Layout><AssetDetail /></Layout>} />
              <Route path="/data" element={<Layout><Data /></Layout>} />
              <Route path="/reports" element={<Layout><Reports /></Layout>} />
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </JsonDataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
