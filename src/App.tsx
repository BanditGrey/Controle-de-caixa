import React, { useState, useEffect } from 'react';
import { PortalLauncher } from './components/PortalLauncher';
import { FinancialApp } from './modules/financial/FinancialApp';
import { RequiemApp } from './modules/requiem/RequiemApp';

export type AppMode = 'portal' | 'financial' | 'requiem';

export function App() {
  const [activeApp, setActiveApp] = useState<AppMode>(() => {
    if (typeof window === 'undefined') return 'portal';
    try {
      const saved = localStorage.getItem('active_demo_app');
      if (saved === 'financial' || saved === 'requiem' || saved === 'portal') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'portal';
  });

  useEffect(() => {
    try {
      localStorage.setItem('active_demo_app', activeApp);
    } catch {
      // fallback
    }
  }, [activeApp]);

  if (activeApp === 'financial') {
    return <FinancialApp onSwitchApp={() => setActiveApp('portal')} />;
  }

  if (activeApp === 'requiem') {
    return <RequiemApp onSwitchApp={() => setActiveApp('portal')} />;
  }

  return <PortalLauncher onSelectApp={(app) => setActiveApp(app)} />;
}

export default App;
