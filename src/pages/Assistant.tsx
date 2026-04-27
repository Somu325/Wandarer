import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I've analyzed your profile. How can I help you navigate your career journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>(['What jobs suit me?', 'Review my skills', 'Interview tips']);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setSuggestedFollowUps([]);

    try {
      const response = await api.chat(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: response.reply }]);
      setSuggestedFollowUps(response.suggestedFollowUps);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] animate-in fade-in duration-500">
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold">Career Assistant</h1>
        <p className="text-text-muted mt-1">Chat with Gemini about your career path, interview prep, or profile improvements.</p>
      </header>

      <div className="card flex-1 flex flex-col min-h-0 overflow-hidden p-0 shadow-lg border-primary/10">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-bg/30">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-surface text-text-body rounded-tl-none border border-border'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface text-text-body p-4 rounded-2xl rounded-tl-none border border-border flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-6 border-t border-border bg-surface">
          {suggestedFollowUps.length > 0 && (
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
              {suggestedFollowUps.map(tip => (
                <button 
                  key={tip} 
                  onClick={() => handleSend(tip)}
                  disabled={loading}
                  className="px-3 py-1.5 bg-primary-soft text-primary hover:bg-primary/10 border border-primary/20 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
                >
                  {tip}
                </button>
              ))}
            </div>
          )}
          
          <div className="flex space-x-3">
            <textarea 
              className="input flex-1 min-h-[44px] max-h-32 py-3 resize-none scroll-smooth" 
              placeholder="Ask about your profile, career advice..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
            />
            <button 
              className="btn btn-primary px-6 h-[44px]"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
          <p className="text-[10px] text-text-muted mt-3 text-center">
            Gemini can make mistakes. Consider checking important career information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
