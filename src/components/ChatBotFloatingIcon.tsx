import React, { useState } from "react";
import { FaRobot, FaTimes, FaComment } from "react-icons/fa";

export default function ChatBotFloatingIcon() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chatbot Icon - WhatsApp Style */}
      <div className="fixed bottom-6 left-6 z-50">
        {/* Main Chatbot Button */}
        <button
          onClick={toggleChatbot}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group relative"
          title="Chat with AI Assistant"
        >
          <FaRobot size={24} />
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
          
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
            1
          </div>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat with AI Assistant
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>

        {/* Chat Window */}
        {isOpen && (
          <div className="absolute bottom-20 left-0 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FaRobot size={14} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">AI Assistant</h4>
                  <p className="text-xs text-green-100">Online • Usually replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-green-200 transition-colors p-1"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Chat Content */}
            <div className="h-80 bg-gray-50 p-4">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaComment className="text-green-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Welcome to AI Assistant!</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    I'm here to help you with any questions you might have.
                  </p>
                  <button
                    onClick={() => {
                      // You can add navigation to the full chatbot page here
                      window.location.href = '/chatbot';
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Start Chatting
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

