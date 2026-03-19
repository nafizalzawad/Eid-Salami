import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./pages/HomePage";
import CreateWheelPage from "./pages/CreateWheelPage";
import SharePage from "./pages/SharePage";
import SpinPage from "./pages/SpinPage";
import DemoPage from "./pages/DemoPage";
import VerifyPage from "./pages/VerifyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateWheelPage />} />
          <Route path="/share/:wheelId" element={<SharePage />} />
          <Route path="/spin/:wheelId" element={<SpinPage />} />
          <Route path="/verify/:wheelId" element={<VerifyPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
