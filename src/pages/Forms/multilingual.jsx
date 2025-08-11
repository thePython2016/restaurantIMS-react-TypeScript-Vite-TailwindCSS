import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Multilingual() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (event) => {
    console.log('Language changing to:', event.target.value);
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Language:</label>
      <select 
        value={i18n.language || 'en'} 
        onChange={handleLanguageChange}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="en">🇬🇧 English</option>
        <option value="fr">🇫🇷 French</option>
        <option value="sw">🇹🇿 Swahili</option>
      </select>
    </div>
  );
}
