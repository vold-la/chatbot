"use client";
import { PiUser } from "react-icons/pi";
import { MessageInput } from "./MessageInput";

interface InputSectionProps {
    sendMessage: (content: string) => void;
}

export const InputSection = ({ sendMessage }: InputSectionProps) => {
    return (
        <div className="flex items-center mt-2 mx-4 gap-2 py-4 border-t border-gray-100">
            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-lime-300">
                <PiUser size={16} />
            </div>
            <MessageInput handleMessageSubmit={sendMessage} />
        </div>
    );
}; 