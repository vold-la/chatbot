'use client';

import { useEffect, useState } from 'react';
import { PiPencilSimpleLine, PiTrash } from 'react-icons/pi';

import { Message } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

type TempMessage = Omit<Message, 'user_id'> & {
  isTemp?: boolean;
};

interface MessageBubbleProps {
  message: Message | TempMessage;
  onDelete: (id: number) => void;
  onEdit: (id: number, content: string) => void;
}

export const MessageBubble = ({ message, onDelete, onEdit }: MessageBubbleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [showActions, setShowActions] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSubmit = () => {
    onEdit(message.id, editedContent);
    setIsEditing(false);
  };

  const isUser = message.sender === 'user';
  const isTemp = 'isTemp' in message && message.isTemp;
  const isDeleted = message.deleted_at !== null && message.deleted_at !== undefined;
  const isEdited = message.updated_at !== null && message.updated_at !== undefined;

  const handleTouchStart = () => {
    if (!isUser || isTemp || isDeleted) return;

    const timer = setTimeout(() => {
      setShowActions(true);
    }, 200);

    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group relative`}>
      <div
        className={`max-w-[70%] break-words rounded-lg px-4 py-2 ${
          isUser
            ? `bg-purple-50 text-purple-900 ${isTemp ? 'opacity-50' : ''}`
            : 'bg-gray-50 text-gray-900'
        } ${isDeleted ? 'opacity-50' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="p-2 border rounded text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2 py-1 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-2 py-1 text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="relative flex items-center gap-2">
              <p className={isDeleted ? 'italic text-gray-500' : ''}>
                {isDeleted ? 'This message was deleted' : message.content}
              </p>
              {isTemp && (
                <div className="ml-2">
                  <LoadingSpinner size="small" />
                </div>
              )}
              {isUser && !isTemp && !isDeleted && (showActions || longPressTimer === null) && (
                <div
                  className={`ml-2 flex gap-1 items-center ${showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
                >
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <PiPencilSimpleLine size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(message.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <PiTrash size={16} />
                  </button>
                </div>
              )}
            </div>
            {isEdited && !isDeleted && <span className="text-xs text-gray-400">Edited</span>}
          </div>
        )}
      </div>
    </div>
  );
};
