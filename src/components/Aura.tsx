import { useState } from 'react';
import { MessageCircle, X, Send, Plane, Building2, Utensils, BookOpen } from 'lucide-react';

export default function Aura() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{id: number; text: string; sender: 'user' | 'aura'}>>([
    {id: 1, text: 'Ciao, sono AURA. Dove vuoi volare oggi?', sender: 'aura'}
  ]);
  const [input, setInput] = useState('');

  const quickActions = [
    { icon: Plane, label: 'Crea un itinerario da zero', emoji: '✈️' },
    { icon: Building2, label: 'Trova hotel', emoji: '🏨' },
    { icon: Utensils, label: 'Consigli locali', emoji: '🍝' },
    { icon: BookOpen, label: 'Storia e curiosità', emoji: '📖' }
  ];

  const handleQuickAction = (label: string) => {
    const userMsg = {id: messages.length + 1, text: label, sender: 'user' as const};
    setMessages([...messages, userMsg]);
    setTimeout(() => {
      const auraMsg = {
        id: messages.length + 2,
        text: `Perfetto! Sto analizzando "${label}"... Raccontami di più su cosa desideri!`,
        sender: 'aura' as const
      };
      setMessages(prev => [...prev, auraMsg]);
    }, 500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = {id: messages.length + 1, text: input, sender: 'user' as const};
    setMessages([...messages, userMsg]);
    setInput('');

    setTimeout(() => {
      const auraMsg = {
        id: messages.length + 2,
        text: 'Sto creando il tuo itinerario perfetto... Dammi un momento!',
        sender: 'aura' as const
      };
      setMessages(prev => [...prev, auraMsg]);
    }, 800);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-orange rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
        <div className="relative w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-navy rounded-full flex items-center justify-center cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-300 border border-brand-blue/50 hover:border-brand-orange/50">
          <div className="absolute inset-0 rounded-full animate-pulse bg-brand-blue opacity-20"></div>
          {isOpen ? (
            <X className="w-7 h-7 text-white relative z-10" />
          ) : (
            <MessageCircle className="w-7 h-7 text-white relative z-10" />
          )}
          {!isOpen && (
            <div className="absolute top-0 right-0 w-3 h-3 bg-brand-orange rounded-full animate-pulse"></div>
          )}
        </div>
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-40 w-96 max-w-[calc(100vw-24px)] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-br from-slate-950 via-brand-navy to-slate-950 border border-brand-blue/30 rounded-3xl flex flex-col h-96">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-blue/50 to-brand-orange/50 backdrop-blur-md p-4 border-b border-brand-blue/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-brand-blue rounded-full flex items-center justify-center">
                  <span className="text-lg">💡</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">AURA</h3>
                  <p className="text-xs text-brand-blue/80">Il tuo assistente di viaggio</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950 to-brand-navy/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl backdrop-blur-sm ${
                      msg.sender === 'user'
                        ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30'
                        : 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions or input */}
            {messages.length === 1 && (
              <div className="p-3 border-t border-brand-blue/20 bg-brand-navy/20 max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action.label)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/20 hover:border-brand-orange/30 text-sm text-brand-blue transition-all duration-200 flex items-center gap-2"
                    >
                      <span className="text-base">{action.emoji}</span>
                      <span className="truncate">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-brand-blue/20 bg-brand-navy/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Dove vuoi andare..."
                  className="flex-1 bg-brand-blue/10 border border-brand-blue/30 rounded-full px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-brand-orange/50 text-sm"
                />
                <button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-brand-orange to-brand-orangelight hover:from-brand-orangelight hover:to-brand-orange text-white rounded-full p-2 transition-all hover:shadow-lg hover:shadow-brand-orange/50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
