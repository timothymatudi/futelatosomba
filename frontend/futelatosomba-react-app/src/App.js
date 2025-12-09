import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { SpeedInsights } from "@vercel/speed-insights/react";
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import { LanguageProvider } from './context/LanguageContext';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import MarketDataPage from './pages/MarketDataPage';
import FindAgents from './pages/FindAgents';
import HousePrices from './pages/HousePrices';
import PropertyValuation from './pages/PropertyValuation';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <PropertyProvider>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/properties" element={<Home />} />
                  <Route path="/properties/:id" element={<PropertyDetails />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Public Pages */}
                  <Route path="/market-data" element={<MarketDataPage />} />
                  <Route path="/find-agents" element={<FindAgents />} />
                  <Route path="/house-prices" element={<HousePrices />} />
                  <Route path="/valuation" element={<PropertyValuation />} />

                  {/* Auth Pages */}
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Protected User Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Agent Routes */}
                  <Route
                    path="/agent-dashboard"
                    element={
                      <ProtectedRoute requireAgent={true}>
                        <AgentDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/add-property"
                    element={
                      <ProtectedRoute requireAgent={true}>
                        <AddProperty />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/edit-property/:id"
                    element={
                      <ProtectedRoute requireAgent={true}>
                        <EditProperty />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />

              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              <SpeedInsights />
            </div>
          </PropertyProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
