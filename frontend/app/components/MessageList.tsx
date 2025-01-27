'use client';

import { RefObject } from 'react';

import { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface TempMessage extends Omit<Message, 'user_id'> {
  isTemp?: boolean;
}

interface MessageListProps {
  messages: (Message | TempMessage)[];
  messageListRef: RefObject<HTMLDivElement>;
  removeMessage: (id: number) => void;
  editMessage: (id: number, content: string) => void;
}

export const MessageList = ({
  messages,
  messageListRef,
  removeMessage,
  editMessage,
}: MessageListProps) => {
  console.log('Messages in MessageList:', JSON.stringify(messages, null, 2));

  return (
    <div ref={messageListRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div key="empty-message" className="text-center text-gray-500">
          No messages yet
        </div>
      ) : (
        messages.map((message) => {
          const key =
            'isTemp' in message && message.isTemp ? `temp-${message.id}` : `message-${message.id}`;

          return (
            <MessageBubble
              key={key}
              message={message}
              onDelete={removeMessage}
              onEdit={editMessage}
            />
          );
        })
      )}
    </div>
  );
};
