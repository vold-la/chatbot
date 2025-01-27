'use client';

import { useState } from 'react';
import { PiPaperPlaneRight } from 'react-icons/pi';

interface InputSectionProps {
  sendMessage: (content: string) => void;
}

export const InputSection = ({ sendMessage }: InputSectionProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
        />
        <button
          type="submit"
          className="p-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
        >
          <PiPaperPlaneRight size={20} />
        </button>
      </form>
    </div>
  );
};
