import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRobot, FaTimes, FaPaperPlane, FaCommentDots } from "react-icons/fa";
import API from "../../api/axios";

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Initialize with a welcome message from the assistant
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I am **Spherey**, your AI Shopping Assistant. 🤖\nHow can I help you today? You can ask me to find products, filter by price, or suggest top categories!",
    },
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage("");
    
    // Add user message to state
    const updatedMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Map message history to simple role/content for the backend
      const history = updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const { data } = await API.post("/ai/chat", {
        message: userMessage,
        history,
      });

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            products: data.products || [],
          },
        ]);
      } else {
        throw new Error("API responded with failure");
      }
    } catch (error) {
      console.error("AI chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am having trouble connecting right now. Please try again later! 😔",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format text with simple markdown support (bold, bullet points)
  const formatText = (text) => {
    if (!text) return "";
    
    // Bold replacement (**text** to <strong>text</strong>)
    let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    
    // Line breaks to <br />
    formatted = formatted.split("\n").map((line, idx) => {
      // Bullet points replacement
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm">
            <span dangerouslySetInnerHTML={{ __html: line.substring(2) }} />
          </li>
        );
      }
      return (
        <p key={idx} className="mb-2 text-sm" dangerouslySetInnerHTML={{ __html: line }} />
      );
    });

    return formatted;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 w-[350px] sm:w-[380px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 transition duration-300 transform scale-100 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-slate-900 dark:bg-slate-950 px-5 py-4 flex items-center justify-between text-white border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500 p-2 rounded-xl text-slate-950 font-bold">
                <FaRobot size={18} className="animate-bounce" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide">Spherey AI</h3>
                <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                  Shopping Assistant
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition cursor-pointer"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950/40">
            {messages.map((msg, index) => (
              <div key={index} className="space-y-3">
                {/* Message Bubble */}
                <div
                  className={`flex gap-2 max-w-[85%] ${
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  {msg.role !== "user" && (
                    <div className="bg-cyan-500 dark:bg-cyan-600 text-slate-950 dark:text-white w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold shadow">
                      S
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-cyan-600 text-white rounded-tr-none"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-gray-100 dark:border-slate-700"
                    }`}
                  >
                    {formatText(msg.content)}
                  </div>
                </div>

                {/* Recommended Product Attachments */}
                {msg.products && msg.products.length > 0 && (
                  <div className="pl-9 pr-4 py-1 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Recommended Matches:
                    </p>
                    <div className="flex flex-col gap-2">
                      {msg.products.map((prod) => (
                        <Link
                          key={prod._id}
                          to={`/products/${prod._id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-2 hover:border-cyan-500 hover:shadow transition duration-200"
                        >
                          <img
                            src={prod.images?.[0] || prod.image || "https://placehold.co/100x100?text=No+Image"}
                            alt={prod.name}
                            className="w-12 h-12 object-contain bg-gray-50 dark:bg-slate-700 rounded-lg p-1"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">
                              {prod.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                              {prod.brand}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
                                ₹{prod.price.toLocaleString("en-IN")}
                              </span>
                              <span className="text-[10px] text-yellow-500 font-semibold flex items-center gap-0.5">
                                ⭐ {prod.rating}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex gap-2 max-w-[85%] mr-auto">
                <div className="bg-cyan-500 text-slate-950 w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold shadow animate-pulse">
                  S
                </div>
                <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-200"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form Action */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Ask Spherey about products..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-white border border-gray-300 dark:border-slate-700 rounded-xl outline-none text-sm focus:border-cyan-500 transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white p-2.5 rounded-xl transition cursor-pointer shadow disabled:opacity-50 disabled:cursor-default"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>

        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 p-4 rounded-full shadow-2xl transition duration-300 hover:scale-110 cursor-pointer animate-pulse-slow flex items-center justify-center border-2 border-white dark:border-slate-800"
        title="Chat with Spherey Assistant"
      >
        {isOpen ? <FaTimes size={20} /> : <FaCommentDots size={20} />}
      </button>
    </div>
  );
}

export default AIChatbot;
