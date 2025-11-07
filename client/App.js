/*
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import FlightsPage from './pages/FlightsPage';
import HotelsPage from './pages/HotelsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboard from './pages/AdminDashboard';

// Private Route Component for User authentication
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    if (loading) return <div>Loading...</div>; // Simple loading state

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen font-sans bg-gray-50">
          <Header />
          <main className="flex-grow p-4 md:p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/flights" element={<FlightsPage />} />
              <Route path="/hotels" element={<HotelsPage />} />
              
              
              <Route path="/my-bookings" element={
                <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
              } />

            
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
              } />

              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
*/
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import FlightsPage from './pages/FlightsPage';
import HotelsPage from './pages/HotelsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboard from './pages/AdminDashboard';


const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    if (loading) return <div>Loading...</div>; 

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/flights" element={<FlightsPage />} />
              <Route path="/hotels" element={<HotelsPage />} />
              
              {/* Protected User Routes */}
              <Route path="/my-bookings" element={
                <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
              } />

              {/* Protected Admin Route */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

