import React, { useState } from 'react';
import { FinancialProvider } from './context/FinancialContext';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <FinancialProvider>
      {isAuthenticated ? (
        <MainLayout onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </FinancialProvider>
  );
}

export default App;
