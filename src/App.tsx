import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "./components/Layout";
import Campaigns from "./pages/Campaigns";
import Performance from "./pages/Performance";
import NotFound from "./pages/NotFound";
import Discovery from "./pages/Discovery";
import Inbox from "./pages/Inbox";
import Contracts from "./pages/Contracts";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NewCampaign from "./pages/NewCampaign";
import CampaignDetail from "./pages/CampaignDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="App">
            <a href="#main-content" className="skip-nav">Skip to main content</a>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Campaigns />} />
                <Route path="campaigns/new" element={<NewCampaign />} />
                <Route path="campaigns/:campaignId" element={<CampaignDetail />} />
                <Route path="discovery" element={<Discovery />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="performance" element={<Performance />} />
                <Route path="contracts" element={<Contracts />} />
                <Route path="payments" element={<Payments />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
