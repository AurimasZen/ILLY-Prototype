import { useState } from "react";
import { ChatBoxInput } from "./ChatBoxInput";

import "./chatBox.css";

export const ChatBox = () => {
    const [chat, setChat] = useState([{author: "ILLY", text: "Hey there! Nice to see you! How are you today?"}]);

    const handleSubmit = async (userInput: string) => {
        if (!userInput.trim()) return;
        
        setChat((prevChat) => [...prevChat, { author: "Kajus", text: userInput }]);
    
        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput }),
            });

            const modelResponse = await response.json();

            setChat((prevChat) => [...prevChat, modelResponse]);
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
                        return (
                        <div className="message">
                            <p className="message_author">{message.author}</p>
                            <p className="message_text">{message.text}</p>
                        </div>);
                    })}
                </div>
            </div>
            <ChatBoxInput handleSubmit = {handleSubmit}/>
        </div>
    );
}