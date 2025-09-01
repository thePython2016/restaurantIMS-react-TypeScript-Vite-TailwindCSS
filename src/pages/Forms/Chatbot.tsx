import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

const Chatbot = ({ roomName = 'general' }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState('');
    const websocket = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    useEffect(() => {
        connectWebSocket();
        fetchHistory();

        return () => {
            if (websocket.current) {
                websocket.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [roomName]);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/chat/history/${roomName}/`);
            const data = await response.json();
            setMessages(data.messages.map(msg => ({
                user: msg.user,
                message: msg.content,
                is_bot: msg.is_bot,
                timestamp: msg.timestamp
            })));
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const connectWebSocket = () => {
        try {
            websocket.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);
            
            websocket.current.onopen = () => {
                setIsConnected(true);
                setConnectionError('');
                reconnectAttempts.current = 0;
                console.log('Connected to WebSocket');
            };

            websocket.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages(prev => [...prev, data]);
            };

            websocket.current.onclose = (event) => {
                setIsConnected(false);
                console.log('WebSocket disconnected:', event.code, event.reason);
                
                // Attempt to reconnect if not a normal closure
                if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current += 1;
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
                    setConnectionError(`Connection lost. Reconnecting in ${delay/1000}s... (Attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
                    
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectWebSocket();
                    }, delay);
                } else if (reconnectAttempts.current >= maxReconnectAttempts) {
                    setConnectionError('Failed to connect after multiple attempts. Please check if the server is running.');
                }
            };

            websocket.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionError('Connection error. Please check if the server is running on port 8000.');
            };
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            setConnectionError('Failed to create WebSocket connection. Please check the server URL.');
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() && isConnected) {
            websocket.current.send(JSON.stringify({
                message: inputMessage,
                user: 'You'
            }));
            setInputMessage('');
        }
    };

    const handleReconnect = () => {
        if (websocket.current) {
            websocket.current.close();
        }
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectAttempts.current = 0;
        setConnectionError('');
        connectWebSocket();
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h3>ChatBot</h3>
                <div className="header-right">
                    <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
                        {isConnected ? '● Connected' : '● Disconnected'}
                    </span>
                    {!isConnected && (
                        <button onClick={handleReconnect} className="reconnect-btn">
                            Reconnect
                        </button>
                    )}
                </div>
            </div>

            {connectionError && (
                <div className="connection-error">
                    {connectionError}
                </div>
            )}

            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.is_bot ? 'bot' : 'user'}`}>
                        <strong>{msg.user}:</strong> {msg.message}
                    </div>
                ))}
            </div>

            <form onSubmit={sendMessage} className="input-form">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={isConnected ? "Type a message..." : "Connect to start chatting..."}
                    disabled={!isConnected}
                />
                <button type="submit" disabled={!isConnected || !inputMessage.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chatbot;