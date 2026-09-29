import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  Plus
} from 'lucide-react';
import { SupportTicket } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SupportPage: React.FC = () => {
  const { user, token, setIsAuthModalOpen } = useAuth();
  const { showToast } = useToast();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  // New ticket form
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('Orders & Shipping');
  const [newMessage, setNewMessage] = useState('');

  // Accordion state for FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does SkyRoute Autonomous Drone Delivery operate?',
      a: 'SkyRoute utilizes obstacle-aware quad-rotor drones with GPS optical beacon recognition. Once flight clearance is granted, the drone hovers at 4 meters and softly lowers your sealed carbon container via automated synthetic tether directly onto your driveway, balcony, or rooftop coordinates.'
    },
    {
      q: 'What is covered under the NEXORA 2-Year Official Lab Warranty?',
      a: 'All hardware purchased directly on NEXORA includes a 24-month comprehensive replacement warranty covering mechanical switch fatigue, planar magnetic driver impedance variances, battery degradation below 80%, and firmware chip calibration.'
    },
    {
      q: 'How do 30-Day Precision Trials and returns work?',
      a: 'You can test any instrument in your personal setup for 30 days. If the ergonomics or acoustic curves do not meet your standards, initiate a 1-click return from your profile. We generate an insured pickup barcode and credit your original payment source upon arrival at our Fremont facility.'
    },
    {
      q: 'How do Vault Reward Points and membership tiers calculate?',
      a: 'Every $1 spent accrues 1 Vault Point. Writing verified purchase reviews adds +50 points. As your balance grows from Bronze (0) to Silver (500), Gold (1000), and Platinum (2000), you unlock tiered permanent discounts, free drone courier upgrades, and priority ticket queuing.'
    }
  ];

  // Fetch tickets
  useEffect(() => {
    if (!token) return;
    fetch('/api/support/tickets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data: SupportTicket[]) => {
        setTickets(data);
        if (data.length > 0 && !selectedTicket) setSelectedTicket(data[0]);
      })
      .catch(() => {});
  }, [token]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: newSubject,
          category: newCategory,
          message: newMessage
        })
      });
      if (res.ok) {
        const ticket: SupportTicket = await res.json();
        setTickets(prev => [ticket, ...prev]);
        setSelectedTicket(ticket);
        setIsCreatingTicket(false);
        setNewSubject('');
        setNewMessage('');
        showToast(`Support Ticket #${ticket.ticketNumber} created!`, 'success');
      }
    } catch {
      showToast('Failed to create ticket', 'error');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim() || !token) return;
    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: replyText.trim() })
      });
      if (res.ok) {
        const updated: SupportTicket = await res.json();
        setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
        setSelectedTicket(updated);
        setReplyText('');
        showToast('Message sent to support technician', 'info');
      }
    } catch {
      showToast('Failed to send message', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading">
          NEXORA Concierge & Technical Support
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-xl">
          Get direct engineering assistance with drone deliveries, acoustic calibration, or initiate hassle-free returns.
        </p>
      </div>

      {/* FAQs Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white font-heading">
          Frequently Answered Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-neutral-200 hover:text-white"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Support Tickets System */}
      <div className="pt-6 border-t border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white font-heading">
              Interactive Support Dispatch
            </h2>
            <p className="text-xs text-neutral-400">
              Submit tickets or communicate with assigned lab technicians in real-time.
            </p>
          </div>
          <button
            onClick={() => setIsCreatingTicket(!isCreatingTicket)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingTicket ? 'Close Ticket Form' : 'Open New Ticket'}</span>
          </button>
        </div>

        {/* Create Ticket Form */}
        {isCreatingTicket && (
          <form onSubmit={handleCreateTicket} className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-4 max-w-2xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Submit Technical or Dispatch Inquiry
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drone delivery waypoint calibration"
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                >
                  <option value="Orders & Shipping">Orders & Shipping</option>
                  <option value="Returns & Refunds">Returns & Refunds</option>
                  <option value="Technical">Technical Specifications</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Inquiry Details</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your order number, device serial, or specific question..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingTicket(false)}
                className="px-4 py-2 text-xs text-neutral-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        )}

        {/* Tickets Master-Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs text-neutral-400 font-semibold block mb-1">Your Tickets</span>
            {tickets.length === 0 ? (
              <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-900/20 text-center text-xs text-neutral-500">
                No tickets on record. Click "+ Open New Ticket" to reach our concierge.
              </div>
            ) : (
              tickets.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                    selectedTicket?.id === t.id
                      ? 'bg-cyan-950/40 border-cyan-500'
                      : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-mono text-cyan-400 font-bold">{t.ticketNumber}</span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium">
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate mt-1">{t.subject}</h4>
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    {t.category} · {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Ticket Chat Messages */}
          <div className="lg:col-span-8 p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 flex flex-col h-[500px]">
            {selectedTicket ? (
              <>
                <div className="pb-3 border-b border-neutral-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedTicket.subject}</h3>
                    <p className="text-[11px] text-neutral-400">
                      Ticket {selectedTicket.ticketNumber} · Category: {selectedTicket.category}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-950 border border-cyan-800 text-cyan-300">
                    {selectedTicket.status}
                  </span>
                </div>

                {/* Messages stream */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {selectedTicket.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${
                        msg.senderRole === 'admin'
                          ? 'mr-auto bg-neutral-950 border border-neutral-800 text-neutral-200'
                          : 'ml-auto bg-cyan-950/60 border border-cyan-800/80 text-white'
                      } p-3 rounded-2xl text-xs space-y-1`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span className="font-semibold text-cyan-400">{msg.senderName}</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="pt-3 border-t border-neutral-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a response to the concierge..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-colors disabled:opacity-40 flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-neutral-500">
                Select a ticket on the left to view the communication history.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
