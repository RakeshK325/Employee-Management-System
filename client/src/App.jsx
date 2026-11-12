import React from 'react';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <ToastProvider>
      <AppLayout />
    </ToastProvider>
  );
}

export default App;
