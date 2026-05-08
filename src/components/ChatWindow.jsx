import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

const ChatWindow = ({ messages, onSend, isTyping, error, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 10000 }}>
      {/* Floating Button - Red like in the video */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '50px', 
          height: '50px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#ef4444',
          color: '#fff',
          cursor: 'pointer',
          border: 'none',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
          transition: 'all 0.3s ease'
        }}
      >
        {isOpen ? <X size={24} /> : (
          <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderRadius: '4px', position: 'relative' }}>
            <div style={{ width: '4px', height: '4px', background: '#fff', position: 'absolute', top: '4px', left: '4px', borderRadius: '50%' }}></div>
          </div>
        )}
      </button>

      {/* Chat Window - Cream/Beige like in the video */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '60px', 
          right: 0, 
          width: '320px', 
          height: '400px', 
          background: '#fefcf8',
          border: '1px solid #e5e1da',
          borderRadius: '1rem',
          display: 'flex', 
          flexDirection: 'column', 
          transition: 'all 0.3s ease',
          transform: isOpen ? 'scale(1)' : 'scale(0.8)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transformOrigin: 'bottom right',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e1da', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1a1a1a' }}>AI Assistant</span>
          <button onClick={onClear} style={{ background: 'none', border: '1px solid #e5e1da', color: '#6b7280', cursor: 'pointer', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.7rem' }}>
            Clear
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                maxWidth: '85%', 
                padding: '0.6rem 0.8rem', 
                borderRadius: '0.75rem', 
                fontSize: '0.8rem',
                lineHeight: '1.4',
                background: msg.role === 'user' ? '#f5f1ea' : '#e0f2fe', // User: Beige, AI: Blue
                color: '#1a1a1a',
                border: '1px solid rgba(0,0,0,0.05)',
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
             <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic' }}>Assistant is typing...</div>
          )}
        </div>

        {/* Footer */}
        <form onSubmit={handleSubmit} style={{ padding: '0.75rem', background: '#fff', borderTop: '1px solid #e5e1da' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             <input 
               type="text" 
               placeholder="Ask from dashboard data only" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               style={{ 
                 flex: 1,
                 padding: '0.5rem 0.75rem', 
                 background: '#fff', 
                 border: '1px solid #e5e1da', 
                 borderRadius: '0.5rem', 
                 color: '#1a1a1a',
                 outline: 'none',
                 fontSize: '0.8rem'
               }} 
             />
             <button 
               type="submit" 
               disabled={!input.trim()}
               style={{ 
                 background: 'none', 
                 border: '1px solid #e5e1da', 
                 color: '#1a1a1a', 
                 padding: '0.4rem 0.8rem',
                 borderRadius: '0.5rem',
                 cursor: 'pointer',
                 fontSize: '0.75rem',
                 fontWeight: '600'
               }}
             >
               Send
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
