import { useState, useRef, useEffect } from "react";
import { Send, ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Message = { id: number; text: string; sender: "user" | "ai" };

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "您好！我是您的智能分析助手，可以提问行业概览或企业动态。", sender: "ai" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = { id: Date.now(), text: inputValue, sender: "user" };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    setIsOpen(true);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "正在为您分析，这是一条模拟的AI回复结果，供界面预览展示。",
        sender: "ai"
      }]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div ref={chatContainerRef} className="w-full max-w-[1200px] mx-auto relative pointer-events-auto px-4">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "300px" }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              className="bg-white border-t border-l border-r border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] rounded-t-2xl overflow-hidden flex flex-col mx-auto"
            >
              <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <Sparkles size={16} />
                  AI 智能解读对话
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/50 transition-colors"
                >
                  <ChevronDown size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-white">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${msg.sender === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-slate-50 border border-slate-100 text-slate-700 rounded-bl-sm"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} className="h-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Input Area (Always visible) */}
        <div className="bg-white border border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] h-[70px] flex items-center px-4 gap-4 w-full relative z-10 rounded-b-none rounded-t-xl mb-0 mx-auto transition-all">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex-shrink-0 text-slate-500 hover:text-blue-600 transition-colors w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 shadow-sm"
          >
            {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={() => setIsOpen(true)}
              placeholder="提问行业/企业相关问题，AI实时解读..."
              className="w-full h-11 bg-slate-50 rounded-full px-5 pr-12 text-[15px] outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all border border-slate-200 placeholder:text-slate-400 text-slate-700 cursor-pointer"
            />
          </div>
          
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex-shrink-0 bg-blue-600 text-white w-11 h-11 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <Send size={18} className="mr-0.5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
