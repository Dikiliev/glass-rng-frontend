// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "./components/Navigation";
import Visualizer from "./pages/Visualizer";
import LiveDraw from "./pages/LiveDraw/LiveDraw";
import HistoryList from "./pages/History/HistoryList";
import HistoryItemPage from "./pages/History/HistoryItem";
import About from "./pages/About";

export default function App() {
    return (
        <TooltipProvider>
            <Navigation />
            <Routes>
                <Route path="/" element={<Visualizer />} />
                <Route path="/draw/:drawId" element={<LiveDraw />} />
                <Route path="/history" element={<HistoryList />} />
                <Route path="/history/:drawId" element={<HistoryItemPage />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </TooltipProvider>
    );
}
