import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChamaProvider } from './contexts/ChamaContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChamaDetailsPage } from './pages/ChamaDetailsPage';
import type { Chama } from './types';

function App() {
  const [selectedChama, setSelectedChama] = useState<Chama | null>(null);

  const handleSelectChama = (chama: Chama) => {
    setSelectedChama(chama);
  };

  const handleBackToDashboard = () => {
    setSelectedChama(null);
  };

  return (
    <AuthProvider>
      <ChamaProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {selectedChama ? (
                    <ChamaDetailsPage
                      chama={selectedChama}
                      onBack={handleBackToDashboard}
                    />
                  ) : (
                    <DashboardPage onSelectChama={handleSelectChama} />
                  )}
                </ProtectedRoute>
              }
            />

            {/* Redirect any unknown routes to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ChamaProvider>
    </AuthProvider>
  );
}

export default App;
