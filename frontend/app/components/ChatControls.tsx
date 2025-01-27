"use client";
import { PiArrowsOutSimple, PiMinus, PiPlus } from "react-icons/pi";
import Button from "./Button";

interface ChatControlsProps {
    isOpen: boolean;
    toggleFullscreen: () => void;
    toggleChatWindow: () => void;
}

export const ChatControls = ({ isOpen, toggleFullscreen, toggleChatWindow }: ChatControlsProps) => {
    return (
        <div className="flex items-center justify-between p-2">
            {isOpen ? (
                <Button handleClick={toggleFullscreen} size={28}>
                    <PiArrowsOutSimple size={16} />
                </Button>
            ) : (
                <span className="px-2 font-semibold tracking-tight">Chat with Ava</span>
            )}

            <Button handleClick={toggleChatWindow} size={28}>
                {isOpen ? <PiMinus size={16} /> : <PiPlus size={16} />}
            </Button>
        </div>
    );
}; 