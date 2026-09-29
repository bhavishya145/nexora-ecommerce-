import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User as UserIcon, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedProducts?: Product[];
  timestamp: string;
}

interface SmartAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export const SmartAiAssistantModal: React.FC<SmartAiAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { addItem } = useCart();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      text: "Hello! I am your NEXORA Concierge. What can I help you discover today? Ask me about planar acoustics, biometric health trackers, titanium EDC gear, or custom workstation setups.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const quickPrompts = [
    "What are the best planar magnetic headphones?",
    "Recommend a titanium biometric ring for sleep",
    "Show me portable solar power stations",
    "I need an ultralight gaming mouse under 40 grams"
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await res.json();
      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "Here are some top picks matching your interest.",
        suggestedProducts: data.suggestedProducts || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          sender: 'assistant',
          text: "I experienced a brief communication latency. Let me recommend our top trending gear from the catalog!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-neutral-950 font-bold">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-heading">
                  NEXORA Concierge AI
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-neutral-400">
                Grounded in 50+ lab-certified hardware specifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[88%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                  m.sender === 'user'
                    ? 'bg-cyan-500 text-neutral-950'
                    : 'bg-neutral-800 text-cyan-400 border border-neutral-700'
                }`}
              >
                {m.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-2">
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-neutral-950 border border-neutral-800/80 text-neutral-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span className="text-[10px] text-neutral-400 block text-right mt-1">
                    {m.timestamp}
                  </span>
                </div>

                {/* Inline Product Cards */}
                {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {m.suggestedProducts.map(p => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-800 bg-neutral-950/80 hover:border-cyan-500/50 transition-colors"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          onClick={() => {
                            onClose();
                            onNavigate('product', p.slug || p.id);
                          }}
                          className="w-12 h-12 rounded-lg object-cover bg-neutral-900 cursor-pointer shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4
                            onClick={() => {
                              onClose();
                              onNavigate('product', p.slug || p.id);
                            }}
                            className="text-xs font-semibold text-white truncate cursor-pointer hover:text-cyan-400"
                          >
                            {p.name}
                          </h4>
                          <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                            <span className="text-cyan-400 font-bold">${p.price.toFixed(2)}</span>
                            <span>·</span>
                            <span>{p.rating}★ ({p.reviewCount})</span>
                          </div>
                        </div>
                        <button
                          onClick={() => addItem(p)}
                          className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold shrink-0 transition-colors"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>NEXORA Concierge is scanning catalog specs...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-neutral-800/60 bg-neutral-950/40 flex items-center gap-2 overflow-x-auto">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-800 text-neutral-300 whitespace-nowrap shrink-0 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/90">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask about specs, battery life, ergonomics..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 focus:border-cyan-500 focus:outline-none text-white placeholder-neutral-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
