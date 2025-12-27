import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/MenuPage/HomePage";
import NotFound from "./pages/NotFound";
import UserPage from "./pages/MenuPage/UserPage";
import WHpage from "./pages/MenuPage/Warehouse";
import BudgetPage from "./pages/BudgetPage/BudgetPage";
import InfoPage from "./pages/InfoPage";

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

import Chemical from "./pages/MenuPage/RepoMaterialPage/Chemical";
import Electric from "./pages/MenuPage/RepoMaterialPage/Electric";
import Automotive from "./pages/MenuPage/RepoMaterialPage/Automotive";
import Fashion from "./pages/MenuPage/RepoMaterialPage/Fashion";
import Iot from "./pages/MenuPage/RepoMaterialPage/Iot";
import Mechanical from "./pages/MenuPage/RepoMaterialPage/Mechanical";
import Technology from "./pages/MenuPage/RepoMaterialPage/Technology";
import Telecom from "./pages/MenuPage/RepoMaterialPage/Telecom";

import BrokenMaterial from "./components/MaterialPage/TelecomMaterial/BrokenMaterial";
import MaterialRepair from "./components/MaterialPage/TelecomMaterial/MaterialRepair";
import MaterialRepairing from "./components/MaterialPage/TelecomMaterial/MaterialRepairing";

import RolePage from "./pages/MenuPage/RolePage";
import ReportPage from "./pages/MenuPage/ReportPage";
import NoticePage from "./pages/MenuPage/NoticePage";
import ProblematicMaterialPage from "./pages/MenuPage/ProblematicMaterialPage/ProblematicMaterialPage";

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
            {/* HOME */}
            <Route
              path="/home"
              element={
                <Layout className="bg-[var(--bg-page)] text-[var(--text-primary)]">
                  <HomePage />
                </Layout>
              }
            />

            {/* REPOSITORY */}
            <Route
              path="/repository"
              element={
                <Layout className="bg-[var(--bg-page)] text-[var(--text-primary)]">
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

            {/* MATERIAL */}
            <Route
              path="/material"
              element={
                <Layout className="bg-[var(--bg-page)] text-[var(--text-primary)]">
                  <MaterialPage />
                </Layout>
              }
            >
              <Route path="automotive" element={<Automotive />}>
                <Route path="repair" element={<MaterialRepair />} />
                <Route path="repairing" element={<MaterialRepairing />} />
                <Route path="broken" element={<BrokenMaterial />} />
              </Route>

              <Route path="chemical" element={<Chemical />}>
                <Route path="repair" element={<MaterialRepair />} />
                <Route path="repairing" element={<MaterialRepairing />} />
                <Route path="broken" element={<BrokenMaterial />} />
              </Route>

              <Route path="electric" element={<Electric />}>
                <Route path="repair" element={<MaterialRepair />} />
                <Route path="repairing" element={<MaterialRepairing />} />
                <Route path="broken" element={<BrokenMaterial />} />
              </Route>

              <Route path="fashion" element={<Fashion />}>
                <Route path="repair" element={<MaterialRepair />} />
                <Route path="repairing" element={<MaterialRepairing />} />
                <Route path="broken" element={<BrokenMaterial />} />
              </Route>

              <Route path="iot" element={<Iot />}>
                <Route path="repair" element={<MaterialRepair />} />
                <Route path="repairing" element={<MaterialRepairing />} />
                <Route path="broken" element={<BrokenMaterial />} />
              </Route>

              <Route path="mechanical" element={<Mechanical />}>
                <Route path="repair" element={<MaterialRepair />} />
                <Route path="repairing" element={<MaterialRepairing />} />
                <Route path="broken" element={<BrokenMaterial />} />
              </Route>

              <Route path="technology" element={<Technology />}>
                <Route path="repair" element={<MaterialRepair />} />
                <Route path="repairing" element={<MaterialRepairing />} />
                <Route path="broken" element={<BrokenMaterial />} />
              </Route>

              <Route path="telecom" element={<Telecom />}>
                <Route path="repair" element={<MaterialRepair />} />
                <Route path="repairing" element={<MaterialRepairing />} />
                <Route path="broken" element={<BrokenMaterial />} />
              </Route>
            </Route>

            {/* ROLE */}
            <Route
              path="/role"
              element={
                <Layout className="bg-[var(--bg-subtle)] text-[var(--text-primary)]">
                  <RolePage />
                </Layout>
              }
            />

            {/* USER */}
            <Route
              path="/user"
              element={
                <Layout className="bg-[var(--bg-page)] text-[var(--text-primary)]">
                  <UserPage />
                </Layout>
              }
            />

            <Route
              path="/budget"
              element={
                <Layout className="bg-[var(--bg-page)] text-[var(--text-primary)]">
                  <BudgetPage />
                </Layout>
              }
            />

            <Route
              path="/information"
              element={
                <Layout className="bg-[var(--bg-page)] text-[var(--text-primary)]">
                  <InfoPage />
                </Layout>
              }
            />

            {/* REPORT */}
            <Route
              path="/report"
              element={
                <Layout className="bg-[var(--bg-page)] text-[var(--text-primary)]">
                  <ReportPage />
                </Layout>
              }
            />

            {/* NOTICE */}
            <Route
              path="/notice"
              element={
                <Layout className="bg-[var(--bg-page)] text-[var(--text-primary)]">
                  <NoticePage />
                </Layout>
              }
            />

            <Route
              path="/material/problematic"
              element={
                <Layout className="bg-[var(--bg-page)] text-[var(--text-primary)]">
                  <ProblematicMaterialPage />
                </Layout>
              }
            />

            {/* LOGIN */}
            <Route
              path="/login"
              element={
                <Layout className="bg-[var(--bg-page)] text-[var(--text-primary)]">
                  <LoginPage />
                </Layout>
              }
            />

            {/* ERRORS */}
            {[
              ["/error-repo", <ErrorRepo />],
              ["/error-material", <ErrorMaterial />],
              ["/error-report", <ErrorReport />],
              ["/error-user", <ErrorUser />],
            ].map(([path, Comp]) => (
              <Route
                key={path}
                path={path}
                element={
                  <Layout className="bg-[var(--bg-page)] text-[var(--text-primary)]">
                    {Comp}
                  </Layout>
                }
              />
            ))}

            {/* NOT FOUND */}
            <Route
              path="*"
              element={
                <Layout className="bg-[var(--bg-page)] text-[var(--text-primary)]">
                  <NotFound />
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
