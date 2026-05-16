import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import axios from "axios";

export default function ChatBotIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = 'http://localhost:8000/api';

  // Auto-scroll to bottom when messages change or bot is typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleChatbot = () => {
    console.log('Chatbot toggle clicked, current state:', isOpen);
    setIsOpen(!isOpen);
    console.log('Chatbot state after toggle:', !isOpen);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Add a small delay to make typing indicator more realistic
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await axios.post(`${API_URL}/chat/`, {
        message: currentMessage
      });

      console.log('API Response:', response.data);

      const botMessage = { 
        text: response.data.response, 
        sender: 'bot' 
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        text: 'Sorry, something went wrong. Please try again.', 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputMessage(value);
    
    // Show typing indicator when user is typing
    if (value.trim() && !isTyping) {
      setIsTyping(true);
    } else if (!value.trim() && isTyping) {
      setIsTyping(false);
    }
  };

  const handleInputFocus = () => {
    if (inputMessage.trim()) {
      setIsTyping(true);
    }
  };

  const handleInputBlur = () => {
    // Keep typing indicator for a moment after blur
    setTimeout(() => {
      if (!inputMessage.trim()) {
        setIsTyping(false);
      }
    }, 1000);
  };

  return (
    <>
      {/* Floating Chatbot Icon */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-28 right-6 bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-110 z-50 group"
        title="Chat with AI Assistant"
      >
        <FaRobot size={24} color="white" />
        
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat with AI Assistant
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div 
          className="fixed bottom-32 right-6 z-[9999]"
          style={{ zIndex: 9999 }}
        >
          {/* Chatbot Container */}
          <div 
            className="relative bg-white rounded-lg shadow-2xl w-80 max-h-[500px] overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-2 duration-300"
            style={{ zIndex: 10000 }}
          >
            {/* Arrow pointing to chatbot button */}
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaRobot size={20} />
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs text-green-100">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-green-200 transition-colors p-1"
              >
                <FaTimes size={18} />
              </button>
            </div>
            
            {/* Chatbot Messages */}
            <div className="h-[350px] overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <FaRobot size={48} className="mx-auto mb-4 text-green-500" />
                    <p>Hi! I'm your AI assistant. How can I help you today?</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'user' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm text-gray-500">AI is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Auto-scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button 
                  onClick={sendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
