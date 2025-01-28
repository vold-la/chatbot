'use client';

import { useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { useAuth } from '../context/AuthContext';
import { Message } from '../types';
import { ChatControls } from './ChatControls';
import { ChatHeader } from './ChatHeader';
import { InputSection } from './InputSection';
import { LoadingSpinner } from './LoadingSpinner';
import { MessageList } from './MessageList';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface TempMessage extends Omit<Message, 'user_id'> {
  isTemp?: boolean;
}

const MessageContainer = () => {
  const [messages, setMessages] = useState<(Message | TempMessage)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const { token, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/auth');
      return;
    }
    loadInitialMessages();
  }, [isAuthenticated, token, router]);

  const loadInitialMessages = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch(`${API_URL}/api/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    try {
      if (content.trim() === '') return;
      setError(null);

      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error(`Failed to send message: ${response.status}`);
      }

      await loadInitialMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const removeMessage = async (messageId: number) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error(`Failed to delete message: ${response.status}`);
      }

      const deletedMessage = await response.json();
      setMessages((prev) =>
        prev.map((message) => (message.id === messageId ? deletedMessage : message))
      );
    } catch (err) {
      console.error('Error deleting message:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete message');
    }
  };

  const editMessage = async (messageId: number, content: string) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error(`Failed to update message: ${response.status}`);
      }

      const updatedMessage = await response.json();
      setMessages((prev) =>
        prev.map((message) => (message.id === messageId ? updatedMessage : message))
      );
    } catch (err) {
      console.error('Error updating message:', err);
      setError(err instanceof Error ? err.message : 'Failed to update message');
    }
  };

  const toggleChatWindow = () => setIsOpen((prev) => !prev);
  const toggleFullscreen = () => setIsExpanded((prev) => !prev);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={`fixed bottom-4 right-4 rounded-2xl
        ${
          isOpen
            ? isExpanded
              ? 'w-full h-full max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]'
              : 'w-[400px] h-[700px]'
            : 'w-[400px] h-fit'
        } flex flex-col justify-between bg-white shadow-xl font-medium`}
      data-testid="chat-container"
    >
      <ChatControls
        isOpen={isOpen}
        toggleFullscreen={toggleFullscreen}
        toggleChatWindow={toggleChatWindow}
      />
      {isOpen && (
        <>
          <ChatHeader />
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <>
              {error && <div className="p-4 text-red-500 text-center">{error}</div>}
              <MessageList
                messages={messages}
                messageListRef={messageListRef}
                removeMessage={removeMessage}
                editMessage={editMessage}
              />
            </>
          )}
          <InputSection sendMessage={sendMessage} />
        </>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(MessageContainer), {
  ssr: false,
});

export { MessageContainer };
