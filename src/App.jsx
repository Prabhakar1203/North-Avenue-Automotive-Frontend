import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/login';
import Navbar from './components/Navbar';
import DashboardNavbar from './components/DashboardNavbar';
import InventeryClerk from './pages/InventeryClerk';
import Manager from './pages/manager';
import SalesmanHero from './pages/salesmanHero';
import Owner from './pages/owner';
import SellerHistory from './pages/SellerHistory';
import AverageTimeInventery from './pages/AverageTimeInventery';
import AveragePricePerCondition from './pages/AveragePricePerCondition';
import PartsStatistics from './pages/PartsStatistics';
import MonthlySales from './pages/MontlhySales';
import SalesHistory from './pages/salesHistory';
import GetCustomers from './pages/getCustomers';
import GetVendors from './pages/getVendors';
import GetPendingParts from './pages/getPendingOrderParts';
import PublicPage from './pages/PublicPage';
import OwnerToInventery from './pages/ownerToInventery';
import OwnerToSalesman from './pages/ownerToSalesman';
import OwnerToManager from './pages/ownerToManager';
// import Dashboard from './pages/Dashboard';
import PublicRoute from './components/publicRoute';
import ProtectedRoute from './components/privateRoute';
function App() {
  const { user } = useSelector((state) => state.user);

  return (
    <Router>
     {/* <PublicPage /> */}
      <Routes>
        {/* Public Routes */}

        <Route 
          path="/" 
          element={
            <PublicRoute>
              <PublicPage />
            </PublicRoute>
          } 
        />

        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />

        {/* Private Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardNavbar />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/salesman" 
          element={
            <ProtectedRoute>
              <SalesmanHero />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager" 
          element={
            <ProtectedRoute>
              <Manager />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner" 
          element={
            <ProtectedRoute>
              <Owner />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/inventoryClerk" 
          element={
            <ProtectedRoute>
              <InventeryClerk />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/sellerhistory" 
          element={
            <ProtectedRoute>
              <SellerHistory />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/averagetimeinventery" 
          element={
            <ProtectedRoute>
              <AverageTimeInventery />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/averagepricepercondition" 
          element={
            <ProtectedRoute>
              <AveragePricePerCondition />
            </ProtectedRoute>
          } 
        />

      <Route 
          path="/partsstatistics" 
          element={
            <ProtectedRoute>
              <PartsStatistics />
            </ProtectedRoute>
          } 
        />

      <Route 
          path="/monthlysales" 
          element={
            <ProtectedRoute>
              <MonthlySales />
            </ProtectedRoute>
          } 
        />

      <Route 
          path="/saleshistory" 
          element={
            <ProtectedRoute>
              <SalesHistory />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/getCustomers" 
          element={
            <ProtectedRoute>
              <GetCustomers />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/getVendors" 
          element={
            <ProtectedRoute>
              <GetVendors />
            </ProtectedRoute>
          } 
        />

      <Route 
          path="/getpendingparts" 
          element={
            <ProtectedRoute>
              <GetPendingParts />
            </ProtectedRoute>
          } 
        />

      <Route 
          path="/onwertoinventery" 
          element={
            <ProtectedRoute>
              <OwnerToInventery />
            </ProtectedRoute>
          } 
        />

      <Route 
          path="/onwertosalesman" 
          element={
            <ProtectedRoute>
              <OwnerToSalesman />
            </ProtectedRoute>
          } 
        />

      <Route 
          path="/onwertomanager" 
          element={
            <ProtectedRoute>
              <OwnerToManager />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;
