import { useState, useRef, useEffect } from 'react';
import { aiSuggestions, aiChatHistory } from '../../data/dummyData';

const AI_RESPONSES = {
  '📊 Summarize my week':
    'This week you logged 38.5 hours across 5 days. You completed 12 tasks, attended 4 meetings, and your productivity score was 87%. Your attendance streak is at 14 days! ðŸ”¥',
  'ðŸ“ Draft leave request':
    'Here\'s a draft: "Hi Manager, I\'d like to request casual leave on Aug 18-19 for personal reasons. My tasks are up to date and I\'ve briefed the team. Please approve." Shall I submit this?',
  '🎯 Show my goals':
    'Your Q3 goals: \n1. ✅ Complete React migration (Done)\n2. ðŸ”„ Improve test coverage to 80% (Currently: 62%)\n3. â³ Lead 2 knowledge-sharing sessions (1/2 done)\n4. â³ Reduce API response time by 20%',
  'ðŸ’¡ Suggest a training':
    'Based on your skill tree, I recommend: "Advanced TypeScript Patterns" — it aligns with your in-progress TypeScript skill and would unlock the Architecture path. There\'s a workshop next Tuesday! ðŸ“š',
};

export default function AICoPilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([...aiChatHistory]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(text) {
    const userMsg = text || inputValue.trim();
    if (!userMsg) return;

    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response =
        AI_RESPONSES[userMsg] ||
        `I'd be happy to help with that! Let me look into "${userMsg}" for you. This feature is coming soon — for now, try one of the quick suggestions below. 🚀`;

      setMessages((prev) => [...prev, { role: 'assistant', text: response }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-500 hover:scale-110 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #C8A96B, #0D2035)',
          boxShadow: isOpen
            ? '0 0 30px rgba(200, 169, 107, 0.4), 0 0 60px rgba(13, 32, 53, 0.2)'
            : '0 0 20px rgba(200, 169, 107, 0.3), 0 0 40px rgba(13, 32, 53, 0.15)',
          zIndex: 100,
          transform: isOpen ? 'rotate(45deg) scale(1.1)' : 'rotate(0deg)',
        }}
        id="ai-copilot-toggle"
        aria-label="Toggle AI CoPilot"
      >
        {isOpen ? '✕' : 'âœ¨'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-[380px] glass-card-static flex flex-col animate-fade-in-up overflow-hidden"
          style={{
            zIndex: 99,
            height: 500,
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4), 0 0 80px rgba(200, 169, 107, 0.06)',
          }}
          id="ai-copilot-panel"
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center gap-3 border-b"
            style={{ borderColor: 'rgba(38, 38, 47, 0.9)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg, #C8A96B, #0D2035)' }}
            >
              ðŸ¤–
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary">AI CoPilot</h4>
              <p className="text-[10px] text-text-muted flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ background: '#C8A96B' }}
                />
                Online Â· Ready to assist
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg, rgba(200, 169, 107, 0.15), rgba(13, 32, 53, 0.15))'
                        : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${
                      msg.role === 'user'
                        ? 'rgba(200, 169, 107, 0.2)'
                        : 'rgba(38, 38, 47, 0.9)'
                    }`,
                    color: '#F4F4F6',
                    borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                    borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 16,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                  style={{
                    background: 'rgba(26, 26, 34, 0.9)',
                    border: '1px solid rgba(38, 38, 47, 0.9)',
                    borderBottomLeftRadius: 4,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: '#C8A96B',
                        animation: `typing-dot 1.4s infinite ${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div
            className="px-5 py-3 flex flex-wrap gap-2 border-t"
            style={{ borderColor: 'rgba(38, 38, 47, 0.9)' }}
          >
            {aiSuggestions.map((suggestion, i) => (
              <button
                key={i}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-105"
                style={{
                  background: 'rgba(26, 26, 34, 0.9)',
                  border: '1px solid rgba(38, 38, 47, 0.9)',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
                onClick={() => handleSend(suggestion)}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(200, 169, 107, 0.1)';
                  e.target.style.borderColor = 'rgba(200, 169, 107, 0.3)';
                  e.target.style.color = '#C8A96B';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(38, 38, 47, 0.9)';
                  e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            className="px-4 py-3 flex items-center gap-2 border-t"
            style={{ borderColor: 'rgba(38, 38, 47, 0.9)' }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none border-none"
              id="ai-copilot-input"
            />
            <button
              onClick={() => handleSend()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110"
              style={{
                background:
                  inputValue.trim()
                    ? 'linear-gradient(135deg, #C8A96B, #0D2035)'
                    : 'rgba(38, 38, 47, 0.9)',
              }}
              id="ai-copilot-send"
            >
              <span className="text-sm">↑</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

