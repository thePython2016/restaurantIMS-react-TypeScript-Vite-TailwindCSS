import React, { useState } from "react";
import { useAuth } from '../../context/AuthContext';

const AirtimeForm: React.FC = () => {
  const { accessToken } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("KES 10");
  const [response, setResponse] = useState<any>(null);

  const sendAirtime = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      setResponse({ error: "Authentication required. Please log in again." });
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/send-airtime/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ phoneNumber, amount }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error sending airtime:", error);
      setResponse({ error: "Failed to send airtime" });
    }
  };

  return (
    <div>
      <h2>Test Airtime (Sandbox)</h2>
      <form onSubmit={sendAirtime}>
        <input
          type="text"
          placeholder="+254711123456"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <select value={amount} onChange={(e) => setAmount(e.target.value)}>
          <option value="KES 10">KES 10</option>
          <option value="KES 20">KES 20</option>
          <option value="KES 50">KES 50</option>
        </select>
        <button type="submit">Send Airtime</button>
      </form>

      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
};

export default AirtimeForm;
