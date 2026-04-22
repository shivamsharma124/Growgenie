import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import LoginPage       from "./pages/LoginPage";
import RegisterPage    from "./pages/RegisterPage";
import DashboardPage   from "./pages/DashboardPage";
import ProductsPage    from "./pages/ProductsPage";
import AiPlannerPage   from "./pages/AiPlannerPage";
import InvoicesPage    from "./pages/InvoicesPage";
import FaqPage         from "./pages/FaqPage";
import MarketingPage   from "./pages/MarketingPage";
import AdminPage       from "./pages/AdminPage";
import Layout          from "./components/common/Layout";

// ─── Route Guards ─────────────────────────────────────────────────────────────
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-[#0a0a0f]">
    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user?.role === "ADMIN" ? children : <Navigate to="/dashboard" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

// ─── App ─────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected — inside Layout (sidebar + topbar) */}
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"  element={<DashboardPage />} />
        <Route path="products"   element={<ProductsPage />} />
        <Route path="ai"         element={<AiPlannerPage />} />
        <Route path="invoices"   element={<InvoicesPage />} />
        <Route path="faq"        element={<FaqPage />} />
        <Route path="marketing"  element={<MarketingPage />} />
        <Route path="admin" element={
          <AdminRoute><AdminPage /></AdminRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            className: "dark:bg-[#1a1a26] dark:text-white text-sm",
            duration: 3000,
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
