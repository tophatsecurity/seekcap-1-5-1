
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { JsonDataProvider } from "./context/JsonDataContext";
import { ThemeProvider } from "./lib/ThemeProvider";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Banners from "./pages/Banners";
import AssetDetail from "./pages/AssetDetail";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Data from "./pages/Data";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AuthProvider, RequireAuth } from "./lib/auth";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Set document title
    document.title = "THS|SEEKCAP";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="system">
          <JsonDataProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={
                    <RequireAuth>
                      <Layout><Dashboard /></Layout>
                    </RequireAuth>
                  } />
                  <Route path="/assets" element={
                    <RequireAuth>
                      <Layout><Assets /></Layout>
                    </RequireAuth>
                  } />
                  <Route path="/banners" element={
                    <RequireAuth>
                      <Layout><Banners /></Layout>
                    </RequireAuth>
                  } />
                  <Route path="/assets/:macAddress" element={
                    <RequireAuth>
                      <Layout><AssetDetail /></Layout>
                    </RequireAuth>
                  } />
                  <Route path="/data" element={
                    <RequireAuth>
                      <Layout><Data /></Layout>
                    </RequireAuth>
                  } />
                  <Route path="/reports" element={
                    <RequireAuth>
                      <Layout><Reports /></Layout>
                    </RequireAuth>
                  } />
                  <Route path="/settings" element={
                    <RequireAuth>
                      <Layout><Settings /></Layout>
                    </RequireAuth>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </JsonDataProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
