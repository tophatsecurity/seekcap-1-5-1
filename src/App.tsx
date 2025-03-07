
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
import Banners from "./pages/Banners";
import AssetDetail from "./pages/AssetDetail";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Data from "./pages/Data";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Capture from "./pages/Capture";
import Deploy from "./pages/Deploy";
import Topology from "./pages/Topology";
import Performance from "./pages/Performance";
import { AuthProvider, RequireAuth } from "./lib/auth";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Set document title
    document.title = "THS|SEEKCAP";
    
    // Initialize default capture settings if needed
    const initializeCaptureSettings = async () => {
      try {
        // Check if capture_settings table has any rows
        const { count, error } = await supabase
          .from('capture_settings')
          .select('*', { count: 'exact', head: true });
          
        if (error) {
          console.error("Error checking capture settings:", error);
          return;
        }
        
        // If no rows, create a default row
        if (count === 0) {
          console.log("No capture settings found, creating default settings");
          const { error: insertError } = await supabase
            .from('capture_settings')
            .insert({
              id: 1,
              capture_directory: '/tmp/capture',
              storage_mode: 'local',
              capture_server: { hostname: 'localhost', ip: '127.0.0.1' },
              storage_timeout: 3600,
              return_paths: {
                scp: { enabled: false, base_path: '/tmp' },
                ftp: { enabled: false, base_path: '/tmp' },
                tftp: { enabled: false, base_path: '/tmp' },
                direct: { enabled: true, base_path: '/tmp' }
              },
              credentials: {},
              vendors: {},
              interface_commands: {},
              capture_commands: {},
              stop_capture_commands: {},
              remove_pcap_commands: {},
              tmp_directories: {},
              interface_regex: {},
              extract_pcap_commands: {}
            });
            
          if (insertError) {
            console.error("Error creating default capture settings:", insertError);
          }
        }
      } catch (err) {
        console.error("Error initializing capture settings:", err);
      }
    };
    
    initializeCaptureSettings();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
                <Route path="/capture" element={
                  <RequireAuth>
                    <Layout><Capture /></Layout>
                  </RequireAuth>
                } />
                <Route path="/deploy" element={
                  <RequireAuth>
                    <Layout><Deploy /></Layout>
                  </RequireAuth>
                } />
                <Route path="/topology" element={
                  <RequireAuth>
                    <Layout><Topology /></Layout>
                  </RequireAuth>
                } />
                <Route path="/performance" element={
                  <RequireAuth>
                    <Layout><Performance /></Layout>
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
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
