import { useState } from "react";
import "./chatBox.css";

interface ChatBoxInputProps {
    handleSubmit: (userInput: string) => void;
}

export const ChatBoxInput = ({ handleSubmit }: ChatBoxInputProps) => {
    const [input, setInput] = useState("");

    const submitMessage = () => {
        if (!input.trim()) return;
        handleSubmit(input);
        setInput("");
    }

    return (
        <div className="chatInput">
            <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitMessage()}
                placeholder="Type a message..."
            />
            <button 
                onClick={() => {
                     submitMessage();
                }}
            >
                Enter
            </button>
        </div>
    );
};
