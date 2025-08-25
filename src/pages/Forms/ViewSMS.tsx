import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Clock, CheckCircle, Circle, RefreshCw, Download, Search, Filter } from 'lucide-react';

// Mock SMS service - replace with your actual service
const smsService = {
  getSMSMessages: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with actual API call
    return [
      {
        id: 1,
        from_phone: '+1234567890',
        to_phone: '+0987654321',
        message_body: 'Hello! I would like to inquire about your services. Can you please provide more information?',
        received_at: '2024-12-15T10:30:00Z',
        is_read: false
      },
      {
        id: 2,
        from_phone: '+1234567891',
        to_phone: '+0987654321',
        message_body: 'Thank you for the quick response yesterday. The issue has been resolved.',
        received_at: '2024-12-14T15:45:00Z',
        is_read: true
      },
      {
        id: 3,
        from_phone: '+1234567892',
        to_phone: '+0987654321',
        message_body: 'Reminder: Your appointment is scheduled for tomorrow at 2 PM.',
        received_at: '2024-12-14T09:15:00Z',
        is_read: true
      },
      {
        id: 4,
        from_phone: '+1234567893',
        to_phone: '+0987654321',
        message_body: 'Emergency: Please call back as soon as possible. This is urgent.',
        received_at: '2024-12-13T20:22:00Z',
        is_read: false
      },
      {
        id: 5,
        from_phone: '+1234567890',
        to_phone: '+0987654321',
        message_body: 'Perfect! I will be there at the scheduled time. Looking forward to meeting you.',
        received_at: '2024-12-13T11:30:00Z',
        is_read: true
      }
    ];
  },
  
  markAsRead: async (smsId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { status: 'success' };
  },
  
  getUnreadCount: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return 2;
  }
};

const ViewSMS = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, read, unread
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
    
    // Poll for new messages every 30 seconds
    const interval = setInterval(() => {
      fetchMessages();
      fetchUnreadCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await smsService.getSMSMessages();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch messages');
      console.error('Error fetching SMS:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await smsService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    await fetchUnreadCount();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (smsId) => {
    try {
      await smsService.markAsRead(smsId);
      setMessages(messages.map(msg => 
        msg.id === smsId ? { ...msg, is_read: true } : msg
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['From', 'To', 'Message', 'Received At', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredMessages.map(msg => [
        msg.from_phone,
        msg.to_phone,
        `"${msg.message_body.replace(/"/g, '""')}"`,
        msg.received_at,
        msg.is_read ? 'Read' : 'Unread'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sms-messages-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.message_body.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.from_phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'read' && msg.is_read) ||
                         (filterStatus === 'unread' && !msg.is_read);
    return matchesSearch && matchesFilter;
  });

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SMS Messages</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 && (
                    <span className="text-red-600 font-medium">
                      {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                    </span>
                  )}
                  {unreadCount === 0 && "All messages read"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={messages.length === 0}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search messages or phone numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No matching messages' : 'No messages yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'SMS messages will appear here when received'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 p-6 transition-all hover:shadow-md ${
                  message.is_read ? 'border-l-gray-300' : 'border-l-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Message Header */}
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {message.from_phone}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {formatDate(message.received_at)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        {message.is_read ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-blue-500" />
                        )}
                        <span className={`text-sm ${message.is_read ? 'text-green-600' : 'text-blue-600'}`}>
                          {message.is_read ? 'Read' : 'Unread'}
                        </span>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="mb-4">
                      <p className="text-gray-800 leading-relaxed">
                        {message.message_body}
                      </p>
                    </div>

                    {/* Message Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        To: {message.to_phone}
                      </span>
                      
                      {!message.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(message.id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if you implement pagination) */}
        {filteredMessages.length > 0 && filteredMessages.length % 20 === 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Load More Messages
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSMS;