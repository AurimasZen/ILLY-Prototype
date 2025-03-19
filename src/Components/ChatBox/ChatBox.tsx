import { useState } from "react";
import { ChatBoxInput } from "./ChatBoxInput";

import "./chatBox.css";

export const ChatBox = () => {
    const [chat, setChat] = useState([]);

    const handleSubmit = async (userInput: string) => {
        if (!userInput.trim()) return;
        
        setChat([...chat, userInput]);
    
        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput }),
            });
    
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="chatBox">
            <div className="chatContent">
                <h1>Chat</h1>
                <div className="chatHistory">
                    {chat.map((message) => {
                        return <p>{message}</p>
                    })}
                </div>
            </div>
            <ChatBoxInput handleSubmit = {handleSubmit}/>
        </div>
    );
}