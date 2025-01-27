"use client";
import { useEffect, useRef, useState } from "react";
import { Message } from "../types";
import axios from "axios";
import { API_URL } from "../page";
import { LoadingSpinner } from "./LoadingSpinner";
import { ChatHeader } from "./ChatHeader";
import { ChatControls } from "./ChatControls";
import { MessageList } from "./MessageList";
import { InputSection } from "./InputSection";

export const MessageContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const messageListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    loadInitialMessages();
  }, []);

  const loadInitialMessages = async () => {
    try {
      const res = await axios.get<Message[]>(`${API_URL}/messages/`);
      setMessages(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading messages: ", error);
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    try {
      if (message.trim() === "") return;
      const newMessage = { content: message };
      const res = await axios.post(`${API_URL}/messages/`, newMessage);
      setMessages((prev) => [...prev, ...res.data]);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const removeMessage = async (messageId: number) => {
    try {
      await axios.delete(`${API_URL}/messages/${messageId}`);
      setMessages((prev) => prev.filter((message) => message.id !== messageId));
    } catch (error) {
      console.error("Error removing message: ", error);
    }
  };

  const editMessage = async (messageId: number, content: string) => {
    try {
      const res = await axios.put(`${API_URL}/messages/${messageId}`, { content });
      const data = res.data as Message;
      setMessages((prev) => prev.map((message) => (message.id === messageId ? data : message)));
    } catch (error) {
      console.error("Error editing message: ", error);
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
    <div className={`fixed w-[400px] bottom-4 right-4 rounded-2xl ${isOpen ? isExpanded ? "w-full h-full max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]" : "h-[700px]" : "h-fit"
      } flex flex-col justify-between bg-white shadow-xl font-medium`}>
      <ChatControls
        isOpen={isOpen}
        toggleFullscreen={toggleFullscreen}
        toggleChatWindow={toggleChatWindow}
      />
      {isOpen && (
        <>
          <ChatHeader />
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <MessageList
              messages={messages}
              messageListRef={messageListRef}
              removeMessage={removeMessage}
              editMessage={editMessage}
            />
          )}
          <InputSection sendMessage={sendMessage} />
        </>
      )}
    </div>
  );
};
