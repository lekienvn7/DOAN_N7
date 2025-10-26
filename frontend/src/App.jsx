import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/MenuPage/HomePage";
import NotFound from "./pages/NotFound";
import UserPage from "./pages/MenuPage/UserPage";
import WHpage from "./pages/MenuPage/Warehouse";
import ElectricWH from "./pages/MenuPage/RepoPages/ElectricWH";
import ChemicalWH from "./pages/MenuPage/RepoPages/ChemicalWH";
import IotWH from "./pages/MenuPage/RepoPages/IotWH";
import TechnologyWH from "./pages/MenuPage/RepoPages/TechnologyWH";
import MechanicalWH from "./pages/MenuPage/RepoPages/MechanicalWH";
import AutoWH from "./pages/MenuPage/RepoPages/AutoWH";
import TelecomWH from "./pages/MenuPage/RepoPages/TelecomWH";
import FashionWH from "./pages/MenuPage/RepoPages/FashionWH";
import LoginPage from "./pages/MenuPage/LoginPage";
import MaterialPage from "./pages/MenuPage/MaterialPage";
import RolePage from "./pages/MenuPage/RolePage";
import ReportPage from "./pages/MenuPage/ReportPage";
import NoticePage from "./pages/MenuPage/NoticePage";
import ErrorRepo from "./pages/ErrorPage/ErrorRepo";
import ErrorMaterial from "./pages/ErrorPage/ErrorMaterial";
import ErrorReport from "./pages/ErrorPage/ErrorReport";
import ErrorUser from "./pages/ErrorPage/ErrorUser";
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
                  <WHpage />
                </Layout>
              }
            >
              <Route path="electric" element={<ElectricWH />} />
              <Route path="chemical" element={<ChemicalWH />} />
              <Route path="iot" element={<IotWH />} />
              <Route path="technology" element={<TechnologyWH />} />
              <Route path="mechanical" element={<MechanicalWH />} />
              <Route path="automotive" element={<AutoWH />} />
              <Route path="telecom" element={<TelecomWH />} />
              <Route path="fashion" element={<FashionWH />} />
            </Route>

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
