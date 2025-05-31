import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Campaigns from "./pages/Campaigns";
import Performance from "./pages/Performance";
import NotFound from "./pages/NotFound";
import Discovery from "./pages/Discovery";
import Inbox from "./pages/Inbox";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Campaigns />} />
            <Route path="discovery" element={<Discovery />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="performance" element={<Performance />} />
            {/* Placeholder routes for disabled nav items */}
            <Route path="contracts" element={<div className="text-center py-12 text-secondary">Contracts page coming soon</div>} />
            <Route path="payments" element={<div className="text-center py-12 text-secondary">Payments page coming soon</div>} />
            <Route path="settings" element={<div className="text-center py-12 text-secondary">Settings page coming soon</div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
