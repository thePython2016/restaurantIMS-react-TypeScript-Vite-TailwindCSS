import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButtonOut() {
  const phoneNumber = "255622071858";
  const message = "Hello! I want to know more about your services";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50"
    >
      <FaWhatsapp size={30} color="white" />
    </a>
  );
}
