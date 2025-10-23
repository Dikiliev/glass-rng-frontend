// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LiveDraw from "./pages/LiveDraw/LiveDraw";
import AppHeader from "./components/AppHeader";
import HistoryList from "./pages/History/HistoryList";
import HistoryItemPage from "./pages/History/HistoryItem";

export default function App() {
    return (
        <>
            <AppHeader />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/draw/:drawId" element={<LiveDraw />} />

                <Route path="/history" element={<HistoryList />} />
                <Route path="/history/:drawId" element={<HistoryItemPage />} />

                {/* заглушки под будущие страницы */}
                <Route path="/audit" element={<Home />} />
                <Route path="/about" element={<Home />} />

            </Routes>
        </>
    );
}
