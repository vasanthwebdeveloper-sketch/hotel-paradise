import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, User, Info, Compass, Calendar, Search } from "lucide-react";
import { useApp } from "../context/AppContext";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const { user, showNotification } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcoming greeting
  useEffect(() => {
    setMessages([
      {
        id: "wel-1",
        sender: "ai",
        text: "Greetings from Hotel Paradise Concierge! I am your AI Butler. I can help you with hotel inquiries, smart searches, custom trip itineraries, or booking guidelines. Try asking: 'Is breakfast included?' or 'Create a 3-day itinerary for Savar'.",
        timestamp: new Date()
      }
    ]);
  }, []);

  // Scroll to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    if (!textToSend) setInputValue("");

    // Add user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          userEmail: user?.email || "anonymous@guest.com"
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Simulating minor staggered text rendering for natural elite luxury concierge feel
        setTimeout(() => {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: data.reply,
            timestamp: new Date()
          };
          setMessages((prev) => [...prev, aiMsg]);
          setTyping(false);
        }, 800);
      } else {
        throw new Error("Chat failure");
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "My apologies, guest. My mental links to the main lobby are briefly offline. Please ask your question again in a second.",
          timestamp: new Date()
        }
      ]);
      setTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            // Alert on first open to guide user
            showNotification("AI Concierge drawer active. Welcome to personalized hospitality!", "info");
          }}
          id="btn-chatbot-float"
          className="w-12 h-12 md:w-16 md:h-16 hover:w-48 md:hover:w-56 flex items-center justify-start pl-[14px] md:pl-[20px] bg-[#1C1C1C] text-[#C8A45D] hover:bg-[#C8A45D] hover:text-[#1C1C1C] rounded-full shadow-[0_0_20px_rgba(200,164,93,0.35)] hover:shadow-[0_0_35px_rgba(200,164,93,0.6)] border-2 border-[#C8A45D] group transition-all duration-500 ease-in-out transform hover:-translate-y-1.5 relative overflow-hidden"
        >
          {/* Glowing pulse indicator in top right corner, fades out on hover */}
          <span className="absolute top-1.5 right-1.5 md:top-2.5 md:right-2.5 flex h-2 w-2 md:h-2.5 md:w-2.5 group-hover:opacity-0 transition-opacity duration-300">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8A45D] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-[#C8A45D]"></span>
          </span>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-[#C8A45D] group-hover:text-[#1C1C1C] transition-colors duration-500 shrink-0" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] font-button whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-[120px] md:group-hover:max-w-[160px] transition-all duration-500 ease-in-out overflow-hidden">
              AI Concierge
            </span>
          </div>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl border border-gold/25 w-85 sm:w-96 max-h-[80vh] flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-charcoal text-white px-4 py-3.5 flex items-center justify-between border-b border-gold/15 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gold/10 border border-gold/30 rounded text-gold shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-gold">AI Resort Concierge</h4>
                <p className="text-[9px] uppercase tracking-wider text-white/50">24/7 Priority Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-cream/20 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`p-1.5 rounded-full shrink-0 h-7 w-7 flex items-center justify-center ${
                  msg.sender === "user" ? "bg-gold/15 text-gold" : "bg-charcoal text-white border border-gold/30"
                }`}>
                  {msg.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5 text-gold" />}
                </div>

                {/* Message bubble */}
                <div className={`p-3 rounded-lg leading-relaxed shadow-sm ${
                  msg.sender === "user"
                    ? "bg-gold text-charcoal font-semibold rounded-tr-none"
                    : "bg-white text-gray-700 border border-gold/5 rounded-tl-none font-light"
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="block text-[8px] text-gray-400 text-right mt-1.5 font-sans font-medium">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="p-1.5 rounded-full bg-charcoal text-white shrink-0 h-7 w-7 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-gold animate-spin" />
                </div>
                <div className="p-3 rounded-lg bg-white border border-gold/5 rounded-tl-none text-gray-400 italic">
                  AI Butler is thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Quick prompt templates inside drawer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            <button
              onClick={() => handleQuickPrompt("Is breakfast free?")}
              className="px-2.5 py-1 text-[9px] font-bold text-gray-500 bg-white border border-gray-200 rounded hover:border-gold/50 hover:text-gold transition-colors shrink-0 flex items-center gap-1"
            >
              <Info className="h-3 w-3" />
              "Is breakfast free?"
            </button>

            <button
              onClick={() => handleQuickPrompt("Show me a 3-day itinerary in Savar")}
              className="px-2.5 py-1 text-[9px] font-bold text-gray-500 bg-white border border-gray-200 rounded hover:border-gold/50 hover:text-gold transition-colors shrink-0 flex items-center gap-1"
            >
              <Compass className="h-3 w-3" />
              "3-Day Trip Itinerary"
            </button>

            <button
              onClick={() => handleQuickPrompt("Are there rooms with Sea View under ₹8000?")}
              className="px-2.5 py-1 text-[9px] font-bold text-gray-500 bg-white border border-gray-200 rounded hover:border-gold/50 hover:text-gold transition-colors shrink-0 flex items-center gap-1"
            >
              <Search className="h-3 w-3" />
              "Sea View under 8000"
            </button>
          </div>

          {/* Chat Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask AI Concierge anything..."
              className="flex-grow px-3 py-2 border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-gold focus:border-gold outline-none"
              disabled={typing}
            />
            <button
              type="submit"
              id="btn-chatbot-send"
              className="p-2 bg-gold hover:bg-gold/90 text-charcoal rounded-md shadow-md transition-colors shrink-0"
              disabled={typing}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
