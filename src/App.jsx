import { AppProvider, useApp } from './context/AppContext';
import InteractiveBackground from './components/layout/InteractiveBackground';
import Header from './components/layout/Header';
import SidePanelDrawer from './components/layout/SidePanelDrawer';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import HRDashboard from './components/dashboard/HRDashboard';
import MessagingWidget from './components/widgets/MessagingWidget';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';

function AppContent() {
  const { role, isLoggedIn, handleMouseMove } = useApp();

  if (!isLoggedIn) {
    if (window.location.pathname === '/login') {
      return <LoginPage />;
    }
    return <LandingPage />;
  }

  return (
    <div
      className="min-h-screen relative"
      onMouseMove={handleMouseMove}
    >
      <InteractiveBackground />
      <Header />
      <SidePanelDrawer />

      {/* Main Content */}
      <main
        className="relative px-8 pb-12"
        style={{ paddingTop: 88, zIndex: 10 }}
      >
        <div className="max-w-[1400px] mx-auto">
          {role === 'employee' ? <EmployeeDashboard /> : <HRDashboard />}
        </div>
      </main>

      {/* Messaging Widget (replaces AI CoPilot) */}
      <MessagingWidget />
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

