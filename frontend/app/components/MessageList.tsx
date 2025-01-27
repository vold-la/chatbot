"use client";
import { Message } from "../types";
import { MessageBubble } from "./MessageBubble";
import { RefObject } from "react";

interface MessageListProps {
    messages: Message[];
    messageListRef: RefObject<HTMLUListElement>;
    removeMessage: (id: number) => void;
    editMessage: (id: number, content: string) => void;
}

export const MessageList = ({ messages, messageListRef, removeMessage, editMessage }: MessageListProps) => {
    return (
        <ul className="flex flex-1 flex-col gap-4 text-sm custom-scrollbar pr-2 pl-4 overflow-y-scroll" ref={messageListRef}>
            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                    handleDeleteMessage={removeMessage}
                    handleUpdateMessage={editMessage}
                />
            ))}
        </ul>
    );
}; 