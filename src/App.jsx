import { AppProvider, useApp } from './context/AppContext';
import InteractiveBackground from './components/layout/InteractiveBackground';
import Header from './components/layout/Header';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import HRDashboard from './components/dashboard/HRDashboard';
import AICoPilotWidget from './components/widgets/AICoPilotWidget';
import LoginPage from './components/LoginPage';

function AppContent() {
  const { role, isLoggedIn, handleMouseMove } = useApp();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div
      className="min-h-screen relative"
      onMouseMove={handleMouseMove}
    >
      <InteractiveBackground />
      <Header />

      {/* Main Content */}
      <main
        className="relative px-8 pb-12"
        style={{ paddingTop: 88, zIndex: 10 }}
      >
        <div className="max-w-[1400px] mx-auto">
          {role === 'employee' ? <EmployeeDashboard /> : <HRDashboard />}
        </div>
      </main>

      <AICoPilotWidget />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

