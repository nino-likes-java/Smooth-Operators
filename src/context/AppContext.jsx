import { createContext, useContext, useState, useCallback } from 'react';
import { announcements } from '../data/dummyData';

const AppContext = createContext(null);

// Seed initial messages for demo
const INITIAL_EMPLOYEE_MESSAGES = [
  {
    id: 1,
    from: 'HR Team',
    fromRole: 'hr',
    text: 'Welcome! Feel free to reach out if you have any questions.',
    timestamp: '2026-08-12 09:15',
    read: true,
  },
];

const INITIAL_HR_MESSAGES = [
  {
    id: 1,
    from: 'Alex Morgan',
    fromRole: 'employee',
    employeeId: 'EMP-2247',
    department: 'Engineering',
    text: 'Hi HR, I had a question about the new health benefits package.',
    timestamp: '2026-08-13 10:30',
    read: false,
  },
  {
    id: 2,
    from: 'Priya Sharma',
    fromRole: 'employee',
    employeeId: 'EMP-1890',
    department: 'Engineering',
    text: 'Could you clarify the leave encashment policy?',
    timestamp: '2026-08-13 11:45',
    read: false,
  },
  {
    id: 3,
    from: 'Mike Johnson',
    fromRole: 'employee',
    employeeId: 'EMP-3041',
    department: 'Marketing',
    text: 'Following up on my salary discrepancy report from last week.',
    timestamp: '2026-08-13 14:00',
    read: true,
  },
];

export function AppProvider({ children }) {
  const [role, setRole] = useState('employee');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Side panel (hamburger drawer)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // Logo dropdown
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);

  // Messaging
  const [employeeMessages, setEmployeeMessages] = useState(INITIAL_EMPLOYEE_MESSAGES);
  const [hrMessages, setHrMessages] = useState(INITIAL_HR_MESSAGES);

  // Announcements new indicator
  const [readAnnouncementIds, setReadAnnouncementIds] = useState([]);
  const hasNewAnnouncements = announcements.some(
    (a) => !readAnnouncementIds.includes(a.id)
  );
  const markAnnouncementsRead = useCallback(() => {
    setReadAnnouncementIds(announcements.map((a) => a.id));
  }, []);

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  // Send a message as employee â†’ HR
  const sendEmployeeMessage = useCallback((text) => {
    setEmployeeMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        from: 'You',
        fromRole: 'employee',
        text,
        timestamp: new Date().toLocaleString('en-IN', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', hour12: false,
        }),
        read: true,
      },
    ]);
    // Simulate HR reply after 1.5s
    setTimeout(() => {
      setEmployeeMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'HR Team',
          fromRole: 'hr',
          text: 'Thanks for reaching out! We have received your message and will get back to you shortly.',
          timestamp: new Date().toLocaleString('en-IN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: false,
          }),
          read: true,
        },
      ]);
    }, 1500);
  }, []);

  // HR replies to an employee
  const sendHrReply = useCallback((employeeId, text) => {
    setHrMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        from: 'HR Team',
        fromRole: 'hr',
        replyTo: employeeId,
        text,
        timestamp: new Date().toLocaleString('en-IN', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', hour12: false,
        }),
        read: true,
      },
    ]);
  }, []);

  const unreadHrMessages = hrMessages.filter(
    (m) => m.fromRole === 'employee' && !m.read
  ).length;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isLoggedIn,
        setIsLoggedIn,
        mousePos,
        handleMouseMove,
        isSidePanelOpen,
        setIsSidePanelOpen,
        isLogoMenuOpen,
        setIsLogoMenuOpen,
        employeeMessages,
        hrMessages,
        sendEmployeeMessage,
        sendHrReply,
        hasNewAnnouncements,
        markAnnouncementsRead,
        unreadHrMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

