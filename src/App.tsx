import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/Layout";
import QuestionGenerator from "./pages/QuestionGenerator";
import LessonPlanGenerator from "./pages/LessonPlanGenerator";
import Translator from "./pages/Translator";
import Chatbot from "./pages/Chatbot";
import ActivityGenerator from "./pages/ActivityGenerator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<QuestionGenerator />} />
            <Route path="lesson-plan" element={<LessonPlanGenerator />} />
            <Route path="translator" element={<Translator />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="activity-generator" element={<ActivityGenerator />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;