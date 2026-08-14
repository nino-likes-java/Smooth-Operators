import { useState, useRef, useEffect } from 'react';
import { aiSuggestions, aiChatHistory } from '../../data/dummyData';

const AI_RESPONSES = {
  '📊 Summarize my week':
    'This week you logged 38.5 hours across 5 days. You completed 12 tasks, attended 4 meetings, and your productivity score was 87%. Your attendance streak is at 14 days! 🔥',
  '📝 Draft leave request':
    'Here\'s a draft: "Hi Manager, I\'d like to request casual leave on Aug 18-19 for personal reasons. My tasks are up to date and I\'ve briefed the team. Please approve." Shall I submit this?',
  '🎯 Show my goals':
    'Your Q3 goals: \n1. ✅ Complete React migration (Done)\n2. 🔄 Improve test coverage to 80% (Currently: 62%)\n3. ⏳ Lead 2 knowledge-sharing sessions (1/2 done)\n4. ⏳ Reduce API response time by 20%',
  '💡 Suggest a training':
    'Based on your skill tree, I recommend: "Advanced TypeScript Patterns" — it aligns with your in-progress TypeScript skill and would unlock the Architecture path. There\'s a workshop next Tuesday! 📚',
  'Leave request query':
    'Your current leave balance: 12 Casual days, 8 Sick days, 15 Earned leave days. You have 2 pending requests (Aug 18-19 and Sep 5). To submit a new request, just tell me the dates and type! 📋',
  'Payroll question':
    'Your last payroll (July 2026): Gross ₹85,000 | Deductions ₹12,400 (PF, TDS, ESI) | Net ₹72,600. Payment processed on Jul 31. Next payroll runs Aug 31. Need a salary slip? 💰',
  'Policy clarification':
    'Which policy would you like clarified?\n🏖️ Leave Policy (casual/sick/earned)\n🏠 WFH Policy (up to 8 days/month)\n⏰ Attendance Policy (9:30 AM–6:30 PM)\n💼 Expense Reimbursement (within 30 days). Just ask!',
  'Benefits question':
    'Your active benefits:\n✅ Health Insurance (₹5L, family included)\n✅ Term Life Insurance (₹50L)\n✅ Meal Allowance (₹3,000/month)\n✅ L&D Budget (₹20,000/year)\n✅ Gratuity after 5 years. 🎁',
  'Project Exec':
    'Project Execution updates: "Mobile App Redesign" is 78% complete ✅, "API Gateway Migration" is 45% (needs attention ⚠️), and "Q3 Analytics Dashboard" kicks off next Monday. Shall I pull the full breakdown?',
};

const HR_QUICK_TOPICS = [
  { label: '📋 Leave Request',        query: 'Leave request query',   dest: 'HR Team',      destIcon: '👥' },
  { label: '💰 Payroll Question',      query: 'Payroll question',      dest: 'HR Team',      destIcon: '👥' },
  { label: '📜 Policy Clarification',  query: 'Policy clarification',  dest: 'HR Team',      destIcon: '👥' },
  { label: '🎁 Benefits Question',     query: 'Benefits question',     dest: 'HR Team',      destIcon: '👥' },
  { label: '🗂️ Project Exec',          query: 'Project Exec',          dest: 'Project Exec', destIcon: '🗂️' },
];

const DEST_STYLES = {
  'HR Team':      { bg: 'rgba(7,21,37,0.08)',        border: 'rgba(7,21,37,0.25)',        color: '#071525' },
  'Project Exec': { bg: 'rgba(200,169,107,0.12)',    border: 'rgba(200,169,107,0.35)',    color: '#9a7a3a' },
};

export default function AICoPilotWidget() {
  const [isOpen, setIsOpen]               = useState(false);
  const [messages, setMessages]           = useState([...aiChatHistory]);
  const [inputValue, setInputValue]       = useState('');
  const [isTyping, setIsTyping]           = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null); // null = all visible
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(text, dest) {
    const userMsg = text || inputValue.trim();
    if (!userMsg) return;
    setMessages((prev) => [...prev, { role: 'user', text: userMsg, dest: dest || null }]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      const response =
        AI_RESPONSES[userMsg] ||
        `I'd be happy to help with "${userMsg}"! This feature is coming soon — try one of the quick topics below. 🚀`;
      setMessages((prev) => [...prev, { role: 'assistant', text: response }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  }

  function handleTopicClick(topic, idx) {
    setSelectedTopic(idx);
    handleSend(topic.query, topic.dest);
  }

  function toggleOpen() {
    setIsOpen((v) => !v);
    setSelectedTopic(null);
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-500 hover:scale-110 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #C8A96B, #0D2035)',
          boxShadow: isOpen
            ? '0 0 30px rgba(200,169,107,0.4), 0 0 60px rgba(13,32,53,0.2)'
            : '0 0 20px rgba(200,169,107,0.3), 0 0 40px rgba(13,32,53,0.15)',
          zIndex: 100,
          transform: isOpen ? 'rotate(45deg) scale(1.1)' : 'rotate(0deg)',
        }}
        id="ai-copilot-toggle"
        aria-label="Toggle AI CoPilot"
      >
        {isOpen ? '✕' : '✨'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-[380px] flex flex-col animate-fade-in-up overflow-hidden"
          style={{
            zIndex: 99,
            height: 530,
            background: '#FFFFFF',
            border: '2px solid #071525',
            boxShadow: '0 8px 40px rgba(0,0,0,0.18), 4px 4px 0px #071525',
          }}
          id="ai-copilot-panel"
        >
          {/* Header */}
          <div
            className="px-5 py-3 flex items-center justify-between border-b"
            style={{ borderColor: 'rgba(7,21,37,0.12)', background: '#F9FAFB' }}
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                style={{ background: 'linear-gradient(135deg, #C8A96B, #0D2035)' }}
              >
                🤖
              </div>
              <div>
                <h4 className="text-sm font-semibold" style={{ color: '#071525' }}>AI CoPilot</h4>
                <p className="text-[10px] flex items-center gap-1" style={{ color: '#6D7782' }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#4ade80' }} />
                  Online · Ready to assist
                </p>
              </div>
            </div>

            {/* Right: channel badges — always visible */}
            <div className="flex flex-col items-end gap-1">
              <span
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(7,21,37,0.08)', border: '1px solid rgba(7,21,37,0.2)', color: '#071525' }}
              >
                👥 HR Team
              </span>
              <span
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(200,169,107,0.12)', border: '1px solid rgba(200,169,107,0.35)', color: '#9a7a3a' }}
              >
                🗂️ Project Exec
              </span>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: '#FFFFFF' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className="max-w-[85%] px-4 py-2.5 text-sm leading-relaxed"
                  style={{
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, rgba(200,169,107,0.15), rgba(7,21,37,0.08))'
                      : '#F4F1E8',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(200,169,107,0.3)' : 'rgba(7,21,37,0.1)'}`,
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    color: '#172332',   /* dark navy text — always readable */
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.text}
                </div>
                {/* Destination tag below user message */}
                {msg.role === 'user' && msg.dest && (() => {
                  const s = DEST_STYLES[msg.dest];
                  return (
                    <span
                      className="flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-semibold"
                      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                    >
                      {msg.dest === 'HR Team' ? '👥' : '🗂️'} Sent to {msg.dest}
                    </span>
                  );
                })()}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-2.5 flex items-center gap-1.5"
                  style={{ background: '#F4F1E8', border: '1px solid rgba(7,21,37,0.1)', borderRadius: '16px 16px 16px 4px' }}
                >
                  {[0, 1, 2].map((j) => (
                    <span
                      key={j}
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#C8A96B', animation: `typing-dot 1.4s infinite ${j * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quick Topics — hide others when one is selected */}
            <div className="pt-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#6D7782' }}>
                Quick Topics
              </p>
              <div className="flex flex-wrap gap-1.5">
                {HR_QUICK_TOPICS.map((topic, idx) => {
                  const isSelected = selectedTopic === idx;
                  if (selectedTopic !== null && !isSelected) return null; // hide others
                  return (
                    <button
                      key={idx}
                      onClick={() => handleTopicClick(topic, idx)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 cursor-pointer hover:scale-105"
                      style={{
                        background: isSelected ? 'rgba(7,21,37,0.08)' : 'rgba(200,169,107,0.08)',
                        border: `1px solid ${isSelected ? 'rgba(7,21,37,0.25)' : 'rgba(200,169,107,0.3)'}`,
                        color: isSelected ? '#071525' : '#9a7a3a',
                      }}
                    >
                      {isSelected && <span>✓</span>}
                      {topic.label}
                      {isSelected && (
                        <span
                          className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: DEST_STYLES[topic.dest].bg, border: `1px solid ${DEST_STYLES[topic.dest].border}`, color: DEST_STYLES[topic.dest].color }}
                        >
                          → {topic.dest}
                        </span>
                      )}
                    </button>
                  );
                })}
                {selectedTopic !== null && (
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-medium cursor-pointer hover:scale-105 transition-all"
                    style={{ background: 'transparent', border: '1px dashed rgba(200,169,107,0.4)', color: '#9a7a3a' }}
                  >
                    + More topics
                  </button>
                )}
              </div>
            </div>

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div
            className="px-4 py-2.5 flex flex-wrap gap-1.5 border-t"
            style={{ borderColor: 'rgba(7,21,37,0.1)', background: '#F9FAFB' }}
          >
            {aiSuggestions.map((suggestion, i) => (
              <button
                key={i}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer hover:scale-105"
                style={{ background: 'rgba(7,21,37,0.05)', border: '1px solid rgba(7,21,37,0.12)', color: '#4B5563' }}
                onClick={() => handleSend(suggestion)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(200,169,107,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(200,169,107,0.35)';
                  e.currentTarget.style.color = '#9a7a3a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(7,21,37,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(7,21,37,0.12)';
                  e.currentTarget.style.color = '#4B5563';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            className="px-4 py-3 flex items-center gap-2 border-t"
            style={{ borderColor: 'rgba(7,21,37,0.12)', background: '#F9FAFB' }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-sm outline-none border-none"
              style={{ color: '#172332' }}
              id="ai-copilot-input"
            />
            <button
              onClick={() => handleSend()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110"
              style={{
                background: inputValue.trim()
                  ? 'linear-gradient(135deg, #C8A96B, #0D2035)'
                  : 'rgba(7,21,37,0.08)',
              }}
              id="ai-copilot-send"
            >
              <span className="text-sm" style={{ color: inputValue.trim() ? '#fff' : '#6D7782' }}>↑</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
