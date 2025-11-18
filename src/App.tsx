import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ServiciosList } from './pages/ServiciosList';
import { ServicioDetail } from './pages/ServicioDetail';
import { NuevoServicio } from './pages/NuevoServicio';
import { NuevaCotizacion } from './pages/NuevaCotizacion';
import { EditarCotizacion } from './pages/EditarCotizacion';
import { ComparadorCotizaciones } from './pages/ComparadorCotizaciones';
import { Insumos } from './pages/Insumos';
import { MisCotizaciones } from './pages/MisCotizaciones';
import { NuevoPackInsumos } from './pages/NuevoPackInsumos';
import { ProponerEquivalencias } from './pages/ProponerEquivalencias';
import { DemandaInsumos } from './pages/DemandaInsumos';
import { Toaster } from 'sonner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicios"
          element={
            <ProtectedRoute>
              <ServiciosList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicios/nuevo"
          element={
            <ProtectedRoute>
              <NuevoServicio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicios/:id"
          element={
            <ProtectedRoute>
              <ServicioDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicios/:id/cotizar"
          element={
            <ProtectedRoute>
              <NuevaCotizacion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicios/:id/cotizar/:quoteId"
          element={
            <ProtectedRoute>
              <EditarCotizacion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicios/:id/comparar"
          element={
            <ProtectedRoute>
              <ComparadorCotizaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insumos"
          element={
            <ProtectedRoute>
              <Insumos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cotizaciones"
          element={
            <ProtectedRoute>
              <MisCotizaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicios/:id/pack"
          element={
            <ProtectedRoute>
              <NuevoPackInsumos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicios/:id/equivalencias"
          element={
            <ProtectedRoute>
              <ProponerEquivalencias />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demanda"
          element={
            <ProtectedRoute>
              <DemandaInsumos />
            </ProtectedRoute>
          }
        />
        
        {/* Root route - Landing for non-authenticated, Dashboard for authenticated */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} 
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}