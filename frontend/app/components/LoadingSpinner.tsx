"use client";

export const LoadingSpinner = () => {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="flex space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
        </div>
    );
}; 