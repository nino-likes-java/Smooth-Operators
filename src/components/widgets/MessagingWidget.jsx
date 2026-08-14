import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

// â”€â”€ Employee view: contact HR or Project Executive â”€â”€
function EmployeeMessaging() {
  const { employeeMessages, sendEmployeeMessage } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [recipient, setRecipient] = useState('hr');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [employeeMessages, isTyping]);

  function handleSend() {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue('');
    setIsTyping(true);
    sendEmployeeMessage(text);
    setTimeout(() => setIsTyping(false), 1700);
  }

  const QUICK_MESSAGES = [
    'ðŸ“‹ Leave request query',
    'ðŸ’° Payroll question',
    'ðŸ“œ Policy clarification',
    'ðŸ¥ Benefits question',
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Recipient selector */}
      <div
        className="px-4 py-3 flex items-center gap-2 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(38,38,47,0.9)' }}
      >
        <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wide">To:</span>
        <button
          id="msg-recipient-hr"
          onClick={() => setRecipient('hr')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
          style={{
            background: recipient === 'hr' ? 'rgba(45,212,255,0.12)' : 'rgba(255,255,255,0.04)',
            border: recipient === 'hr' ? '1px solid rgba(45,212,255,0.3)' : '1px solid rgba(38,38,47,0.9)',
            color: recipient === 'hr' ? '#2DD4FF' : 'rgba(255,255,255,0.5)',
          }}
        >
          ðŸ›¡ï¸ HR Team
        </button>
        <button
          id="msg-recipient-pm"
          onClick={() => setRecipient('pm')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
          style={{
            background: recipient === 'pm' ? 'rgba(147,51,234,0.12)' : 'rgba(255,255,255,0.04)',
            border: recipient === 'pm' ? '1px solid rgba(147,51,234,0.3)' : '1px solid rgba(38,38,47,0.9)',
            color: recipient === 'pm' ? '#a78bfa' : 'rgba(255,255,255,0.5)',
          }}
        >
          ðŸ“Š Project Exec
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {employeeMessages.map((msg) => {
          const isOutgoing = msg.fromRole === 'employee';
          return (
            <div
              key={msg.id}
              className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
            >
              {!isOutgoing && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 self-end"
                  style={{ background: 'linear-gradient(135deg, #2DD4FF22, #9333EA22)', border: '1px solid rgba(45,212,255,0.2)' }}
                >
                  ðŸ›¡ï¸
                </div>
              )}
              <div style={{ maxWidth: '78%' }}>
                {!isOutgoing && (
                  <p className="text-[10px] text-text-muted mb-1 ml-1">{msg.from}</p>
                )}
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: isOutgoing
                      ? 'linear-gradient(135deg, rgba(45,212,255,0.15), rgba(147,51,234,0.15))'
                      : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isOutgoing ? 'rgba(45,212,255,0.2)' : 'rgba(38,38,47,0.9)'}`,
                    color: 'rgba(255,255,255,0.88)',
                    borderBottomRightRadius: isOutgoing ? 4 : 16,
                    borderBottomLeftRadius: isOutgoing ? 16 : 4,
                  }}
                >
                  {msg.text}
                </div>
                <p className={`text-[9px] text-text-muted mt-1 ${isOutgoing ? 'text-right' : 'text-left ml-1'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 self-end"
              style={{ background: 'linear-gradient(135deg, #2DD4FF22, #9333EA22)', border: '1px solid rgba(45,212,255,0.2)' }}
            >
              ðŸ›¡ï¸
            </div>
            <div
              className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(38,38,47,0.9)',
                borderBottomLeftRadius: 4,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: '#2DD4FF',
                    animation: `typing-dot 1.4s infinite ${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick messages */}
      <div
        className="px-4 py-2 flex flex-wrap gap-1.5 border-t"
        style={{ borderColor: 'rgba(38,38,47,0.9)' }}
      >
        {QUICK_MESSAGES.map((msg, i) => (
          <button
            key={i}
            onClick={() => {
              setInputValue(msg);
            }}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-150 cursor-pointer hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(38,38,47,0.9)',
              color: 'rgba(255,255,255,0.65)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(45,212,255,0.08)';
              e.target.style.borderColor = 'rgba(45,212,255,0.25)';
              e.target.style.color = '#2DD4FF';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.04)';
              e.target.style.borderColor = 'rgba(38,38,47,0.9)';
              e.target.style.color = 'rgba(255,255,255,0.65)';
            }}
          >
            {msg}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 flex items-center gap-2 border-t"
        style={{ borderColor: 'rgba(38,38,47,0.9)' }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Message ${recipient === 'hr' ? 'HR Team' : 'Project Executive'}â€¦`}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none border-none"
          id="msg-input-employee"
        />
        <button
          onClick={handleSend}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110"
          style={{
            background: inputValue.trim()
              ? 'linear-gradient(135deg, #2DD4FF, #9333EA)'
              : 'rgba(38,38,47,0.9)',
          }}
          id="msg-send-employee"
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// â”€â”€ HR view: see messages from employees â”€â”€
function HRMessaging() {
  const { hrMessages, sendHrReply } = useApp();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [replyText, setReplyText] = useState('');
  const chatEndRef = useRef(null);

  // Group messages by employee
  const employees = [...new Set(
    hrMessages.filter((m) => m.fromRole === 'employee').map((m) => m.from)
  )];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [hrMessages, selectedEmployee]);

  const threadMessages = selectedEmployee
    ? hrMessages.filter(
        (m) => m.from === selectedEmployee || m.replyTo === selectedEmployee
      )
    : [];

  function handleReply() {
    if (!replyText.trim() || !selectedEmployee) return;
    sendHrReply(selectedEmployee, replyText.trim());
    setReplyText('');
  }

  if (!selectedEmployee) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          <p className="text-[11px] text-text-muted mb-3 font-semibold uppercase tracking-wide">
            Employee Messages
          </p>
          {employees.map((emp) => {
            const msgs = hrMessages.filter((m) => m.from === emp && m.fromRole === 'employee');
            const lastMsg = msgs[msgs.length - 1];
            const unread = msgs.filter((m) => !m.read).length;
            return (
              <button
                key={emp}
                id={`hr-msg-thread-${emp.replace(/\s/g, '-').toLowerCase()}`}
                onClick={() => setSelectedEmployee(emp)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 cursor-pointer text-left"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(38,38,47,0.9)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(38,38,47,0.9)';
                  e.currentTarget.style.borderColor = 'rgba(45,212,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(38,38,47,0.9)';
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(45,212,255,0.2), rgba(147,51,234,0.2))',
                    border: '1px solid rgba(45,212,255,0.2)',
                    color: '#2DD4FF',
                  }}
                >
                  {emp.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-text-primary">{emp}</p>
                    <span className="text-[10px] text-text-muted">{lastMsg?.timestamp?.slice(-5)}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary truncate mt-0.5">{lastMsg?.text}</p>
                </div>
                {unread > 0 && (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f87171, #dc2626)' }}
                  >
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(38,38,47,0.9)' }}
      >
        <button
          onClick={() => setSelectedEmployee(null)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
          aria-label="Back to list"
          id="hr-msg-back-btn"
        >
          â†
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: 'linear-gradient(135deg, rgba(45,212,255,0.2), rgba(147,51,234,0.2))',
            border: '1px solid rgba(45,212,255,0.2)',
            color: '#2DD4FF',
          }}
        >
          {selectedEmployee.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <p className="text-xs font-semibold text-text-primary">{selectedEmployee}</p>
          <p className="text-[10px] text-text-muted">Employee</p>
        </div>
      </div>

      {/* Thread messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {threadMessages.map((msg) => {
          const isOutgoing = msg.fromRole === 'hr';
          return (
            <div key={msg.id} className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
              <div style={{ maxWidth: '80%' }}>
                {!isOutgoing && (
                  <p className="text-[10px] text-text-muted mb-1 ml-1">{msg.from}</p>
                )}
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: isOutgoing
                      ? 'linear-gradient(135deg, rgba(45,212,255,0.15), rgba(147,51,234,0.15))'
                      : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isOutgoing ? 'rgba(45,212,255,0.2)' : 'rgba(38,38,47,0.9)'}`,
                    color: 'rgba(255,255,255,0.88)',
                    borderBottomRightRadius: isOutgoing ? 4 : 16,
                    borderBottomLeftRadius: isOutgoing ? 16 : 4,
                  }}
                >
                  {msg.text}
                </div>
                <p
                  className={`text-[9px] text-text-muted mt-1 ${isOutgoing ? 'text-right' : 'ml-1'}`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Reply input */}
      <div
        className="px-4 py-3 flex items-center gap-2 border-t"
        style={{ borderColor: 'rgba(38,38,47,0.9)' }}
      >
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleReply()}
          placeholder={`Reply to ${selectedEmployee}â€¦`}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none border-none"
          id="hr-msg-reply-input"
        />
        <button
          onClick={handleReply}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110"
          style={{
            background: replyText.trim()
              ? 'linear-gradient(135deg, #2DD4FF, #9333EA)'
              : 'rgba(38,38,47,0.9)',
          }}
          id="hr-msg-send-btn"
          aria-label="Send reply"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// â”€â”€ Main Widget â”€â”€
export default function MessagingWidget() {
  const { role } = useApp();
  const isHR = role === 'hr';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all duration-500 hover:scale-110 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #2DD4FF, #9333EA)',
          boxShadow: isOpen
            ? '0 0 30px rgba(45, 212, 255, 0.4), 0 0 60px rgba(147, 51, 234, 0.2)'
            : '0 0 20px rgba(45, 212, 255, 0.3), 0 0 40px rgba(147, 51, 234, 0.15)',
          zIndex: 100,
          transform: isOpen ? 'scale(1.1)' : 'scale(1)',
        }}
        id="messaging-widget-toggle"
        aria-label={isOpen ? 'Close messaging' : 'Open messaging'}
      >
        {isOpen ? 'âœ•' : (isHR ? 'ðŸ“¨' : 'ðŸ’¬')}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 glass-card-static flex flex-col animate-fade-in-up overflow-hidden"
          style={{
            zIndex: 99,
            width: 300,
            height: 420,
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 80px rgba(45, 212, 255, 0.06)',
          }}
          id="messaging-panel"
        >
          {/* Panel Header */}
          <div
            className="px-5 py-4 flex items-center gap-3 border-b flex-shrink-0"
            style={{ borderColor: 'rgba(38, 38, 47, 0.9)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg, #2DD4FF, #9333EA)' }}
            >
              {isHR ? 'ðŸ“¨' : 'ðŸ’¬'}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary">
                {isHR ? 'Employee Messages' : 'Contact HR / Project Exec'}
              </h4>
              <p className="text-[10px] text-text-muted flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ background: '#4ade80' }}
                />
                {isHR ? 'Respond to your employees' : 'We typically reply within 2â€“4 hours'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {isHR ? <HRMessaging /> : <EmployeeMessaging />}
          </div>
        </div>
      )}
    </>
  );
}

