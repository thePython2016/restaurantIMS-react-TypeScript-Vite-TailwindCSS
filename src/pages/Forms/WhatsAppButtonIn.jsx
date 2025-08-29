import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButtonIn() {
  const handleClick = async () => {
    await fetch("http://127.0.0.1:8000/api/send-whatsapp/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_number: "255766047800", // customer number
        message: "Hello 👋 I'd like to know more about your services!"
      }),
    });
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600 transition"
    >
      <FaWhatsapp size={30} color="white" />
    </button>
  );
}
