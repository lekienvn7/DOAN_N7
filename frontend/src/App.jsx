import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import UserPage from "./pages/UserPage";
import RepoPage from "./pages/RepoPage";
import LoginPage from "./pages/LoginPage";
import MaterialPage from "./pages/MaterialPage";
import RolePage from "./pages/RolePage";
import ReportPage from "./pages/ReportPage";
import NoticePage from "./pages/NoticePage";
import ErrorRepo from "./pages/ErrorRepo";
import ErrorMaterial from "./pages/ErrorMaterial";
import ErrorReport from "./pages/ErrorReport";
import ErrorUser from "./pages/ErrorUser";
import Layout from "./pages/Layout";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Layout className="bg-[#1d1d1f]">
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/repository"
              element={
                <Layout className="bg-[#1d1d1f]">
                  <RepoPage />
                </Layout>
              }
            />
            <Route
              path="/material"
              element={
                <Layout className="bg-[#1d1d1f]">
                  <MaterialPage />
                </Layout>
              }
            />
            <Route
              path="/role"
              element={
                <Layout className="bg-[#1d1d1f]">
                  <RolePage />
                </Layout>
              }
            />
            <Route
              path="/user"
              element={
                <Layout className="bg-[#1d1d1f]">
                  <UserPage />
                </Layout>
              }
            />
            <Route
              path="/report"
              element={
                <Layout className="bg-[#1d1d1f]">
                  <ReportPage />
                </Layout>
              }
            />
            <Route
              path="/notice"
              element={
                <Layout className="bg-[#1d1d1f]">
                  <NoticePage />
                </Layout>
              }
            />

            <Route
              path="/login"
              element={
                <Layout className="bg-[#1d1d1f]">
                  <LoginPage />
                </Layout>
              }
            />
            <Route
              path="*"
              element={
                <Layout className="bg-[#1d1d1f]">
                  <NotFound />
                </Layout>
              }
            />

            <Route
              path="/error-repo"
              element={
                <Layout className="bg-[#1d1d1f]">
                  <ErrorRepo />
                </Layout>
              }
            />
            <Route
              path="/error-material"
              element={
                <Layout className="bg-[#1d1d1f]">
                  <ErrorMaterial />
                </Layout>
              }
            />
            <Route
              path="/error-report"
              element={
                <Layout className="bg-[#1d1d1f]">
                  <ErrorReport />
                </Layout>
              }
            />
            <Route
              path="/error-user"
              element={
                <Layout className="bg-[#1d1d1f]">
                  <ErrorUser />
                </Layout>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
