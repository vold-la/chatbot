'use client';

import { PiSparkle } from 'react-icons/pi';

export const ChatHeader = () => {
  return (
    <div className="flex flex-col items-center pb-4 pt-4 border-b">
      <div className="flex items-center justify-center w-12 h-12 rounded-full mb-2 bg-gradient-to-r from-purple-400 to-purple-300">
        <PiSparkle size={32} color="white" />
      </div>
      <h2 className="font-semibold text-lg tracking-tight">Hey👋, I&apos;m Ava</h2>
      <p className="text-sm text-gray-500 tracking-wide">
        Ask me anything related to the world of AI
      </p>
    </div>
  );
};
