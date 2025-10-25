import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import RepoPage from "./pages/RepoPage";
import LoginPage from "./pages/LoginPage";
import MaterialPage from "./pages/MaterialPage";
import RolePage from "./pages/RolePage";
import ReportPage from "./pages/ReportPage";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="*" element={<NotFound />} />

            <Route path="/repository" element={<RepoPage />} />

            <Route path="/login" element={<LoginPage />} />

            <Route path="/material" element={<MaterialPage />} />

            <Route path="/role" element={<RolePage />} />

            <Route path="/report" element={<ReportPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
