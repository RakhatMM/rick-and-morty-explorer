import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import CharacterPage from "./pages/CharacterPage";
import LocationPage from "./pages/LocationPage";
import EpisodePage from "./pages/EpisodePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/characters/:id" element={<CharacterPage />} />
        <Route path="/locations/:id" element={<LocationPage />} />
        <Route path="/episodes/:id" element={<EpisodePage />} />
      </Routes>
    </BrowserRouter>
  );
}