import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function MamboSMSUserForm() {
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [status, setStatus] = useState("");
  const { accessToken } = useAuth();

  // SMS service function
  const sendSMS = async (smsData) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add auth token if available
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    
    try {
      console.log('🚀 Sending SMS request to:', `${API_BASE_URL}/api/api/v1/sms/single/`);
      console.log('📱 Request data:', smsData);
      
      const response = await fetch(`${API_BASE_URL}/api/api/v1/sms/single/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(smsData)
      });
      
      const result = await response.json();
      console.log('✅ Response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || result.details || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ SMS Service Error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    
    try {
      const smsData = {
        sender_id: senderId,
        message: message,
        mobile: mobile
      };
      
      const result = await sendSMS(smsData);
      setStatus(`Message sent successfully!`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h2>Send SMS</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Sender ID"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          required
        />
        <input
          type="text"
          placeholder="Mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          required
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          required
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Send SMS
        </button>
      </form>
      {status && <p style={{ marginTop: "10px" }}>{status}</p>}
    </div>
  );
}