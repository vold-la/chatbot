'use client';

import { useState } from 'react';
import { PiPaperPlaneRight } from 'react-icons/pi';

import { Message } from '../types';
import Button from './Button';

interface MessageInputProps {
  message?: Message;
  handleMessageSubmit?: (content: string) => void;
  handleMessageUpdate?: (id: number, content: string) => void;
}

export const MessageInput = ({
  message,
  handleMessageSubmit,
  handleMessageUpdate,
}: MessageInputProps) => {
  const [inputText, setInputText] = useState<string>(message ? message.content : '');

  const submitMessage = () => {
    if (message && handleMessageUpdate) {
      handleMessageUpdate(message.id, inputText);
    } else if (handleMessageSubmit) {
      handleMessageSubmit(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-1 gap-2 items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitMessage();
        }}
        className="flex-1 flex"
      >
        <input
          placeholder={!message ? 'Your question' : ''}
          type="text"
          className="flex-1 px-2 py-1 rounded-full ring-gray-700 text-sm focus:outline-none focus:ring-[1px] "
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </form>
      <Button handleClick={submitMessage} size={28}>
        <PiPaperPlaneRight size={16} />
      </Button>
    </div>
  );
};
