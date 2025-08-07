import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Gallery from "./pages/Gallery";
import Letters from "./pages/Letters";
import WriteLetter from "./pages/WriteLetter";
import LetterDetail from "./pages/LetterDetail";
import Comic from "./pages/Comic";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/story" element={<Story />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/letters" element={<Letters />} />
            <Route path="/write-letter" element={<WriteLetter />} />
            <Route path="/letters/:id" element={<LetterDetail />} />
            <Route path="/comic" element={<Comic />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
