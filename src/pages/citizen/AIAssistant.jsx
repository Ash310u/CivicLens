import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Bot, Send, User, Leaf, Sparkles, Trash2, MapPin, BookOpen } from 'lucide-react';

const quickPrompts = [
  { text: 'How do I dispose of batteries?', icon: Trash2 },
  { text: 'Find e-waste facility near me', icon: MapPin },
  { text: 'Wet vs dry waste guide', icon: BookOpen },
  { text: 'How to compost at home', icon: Leaf },
];

const initialMessages = [
  { role: 'assistant', content: "Hello! I'm **CivicLens AI** — your civic waste management assistant. I can help you with:\n\n• **Waste disposal guidance** — what goes where\n• **Facility discovery** — find nearest drop-off points\n• **Segregation tips** — how to separate waste correctly\n• **Report help** — how to file and track reports\n\nHow can I help you today?" }
];

export default function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input;
    if (!userMsg.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    // Simulate AI response
    await new Promise(r => setTimeout(r, 1500));
    
    let response = "I can help with that! Let me look into it for you. ";
    if (userMsg.toLowerCase().includes('batter')) {
      response = "**Batteries** are classified as **Hazardous Waste (Red Bin)**.\n\n**How to Prepare:**\n1. Do NOT throw batteries in regular trash\n2. Tape the terminals of lithium batteries to prevent short circuits\n3. Collect them in a separate dry container\n\n**Where to Take:**\n→ Use CivicLens **Disposal Locator** to find the nearest authorized e-waste or hazardous waste collection point.\n\n**Common Mistake:** Mixing batteries with dry waste. This is dangerous and can cause chemical leaks.\n\n📍 *Tap \"Find Facilities\" to locate the nearest drop-off point near you.*";
    } else if (userMsg.toLowerCase().includes('compost')) {
      response = "**Home Composting Guide:**\n\n1. **Get a compost bin** — any container with drainage holes\n2. **Layer green + brown waste:**\n   - 🟢 Green: fruit peels, vegetable scraps, tea leaves\n   - 🟤 Brown: dry leaves, cardboard, newspaper\n3. **Keep it moist** — spray water occasionally\n4. **Turn weekly** — aerate the pile\n5. **Ready in 4-8 weeks** — dark, crumbly, earthy-smelling compost!\n\n**Pro tip:** Avoid meat, dairy, and oily food — they attract pests.\n\n🌱 *Composting reduces wet waste by up to 60% and creates nutrient-rich soil.*";
    } else if (userMsg.toLowerCase().includes('wet') || userMsg.toLowerCase().includes('dry')) {
      response = "**Wet vs Dry Waste Guide:**\n\n🟢 **Wet Waste (Green Bin):**\nFood waste, vegetable peels, fruit scraps, cooked food, coconut shells, flowers, garden waste, soiled tissue\n\n🔵 **Dry Waste (Blue Bin):**\nClean paper, cardboard, rinsed plastic bottles, glass, metal cans, aluminum foil, tetra packs\n\n⚠️ **Key Rules:**\n- Always separate wet and dry before handing to collector\n- Rinse containers before putting in dry waste\n- Soiled paper/tissue goes in wet, not dry\n- Tetra packs are dry waste (cut open and rinse first)\n\n*Master segregation = cleaner city + higher impact score! 🏆*";
    } else if (userMsg.toLowerCase().includes('e-waste') || userMsg.toLowerCase().includes('facility')) {
      response = "**Nearest E-Waste Facilities:**\n\n1. 📍 **E-Waste Drop-Off Point - HSR Layout**\n   Distance: 2.5 km · Hours: 9AM-6PM\n   Accepts: phones, laptops, cables, circuit boards\n\n2. 📍 **Green Recycle Hub - Marathahalli**\n   Distance: 4.1 km · Hours: 8AM-7PM\n   Accepts: plastic, dry waste, e-waste\n\n→ Open **Disposal Locator** in the app for map directions and real-time availability.\n\n⚠️ *Never throw e-waste in regular bins. Electronic components contain toxic materials that pollute soil and water.*";
    }
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-civic-500 to-teal-500 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)]">CivicLens AI Assistant</h1>
            <p className="text-xs text-[var(--text-secondary)]">Powered by Gemini 1.5 · Waste guidance & facility discovery</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 mb-4 rounded-2xl glass-card p-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-ocean-500/10 text-ocean-500'
                  : 'bg-civic-500/10 text-civic-500'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-ocean-500 text-white rounded-tr-sm'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-tl-sm'
              }`}>
                {msg.content.split('\n').map((line, li) => (
                  <p key={li} className={li > 0 ? 'mt-1' : ''}>
                    {line.split('**').map((part, pi) => (
                      pi % 2 === 1 ? <strong key={pi}>{part}</strong> : <span key={pi}>{part}</span>
                    ))}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-civic-500/10 flex items-center justify-center">
                <Sparkles size={16} className="text-civic-500 animate-pulse" />
              </div>
              <div className="bg-[var(--bg-secondary)] rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(p.text)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-civic-500/10 hover:text-civic-600 dark:hover:text-civic-400 border border-[var(--border-subtle)] transition-colors"
              >
                <p.icon size={12} /> {p.text}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about waste disposal, facilities, segregation..."
            className="flex-1 px-4 py-3 text-sm bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-civic-500 focus:ring-2 focus:ring-civic-500/20 transition-all"
          />
          <Button type="submit" variant="primary" size="md" disabled={!input.trim() || loading} icon={Send}>
            Send
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
}
