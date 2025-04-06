import { useState } from "react";
import { ChatBoxInput } from "./ChatBoxInput";

import "./chatBox.css";

export const ChatBox = () => {
    const [chat, setChat] = useState([{author: "ILLY", text: "Labas, mano vardas ILLY. Man magiškoji fėja pakuždėjo, jog tau buvo diagnozuotas vėžys. Nesijaudink, aš atkeliavau, kad padėčiau tau susipažinti su tuo, kas yra vėžys, kaip suprasti savo diagnozę ir ką tai reiškia tau. Aš būsiu šalia ir atsakysiu į visus tau rūpimus klausimus, kad jaustumeisi saugiai ir suprastum, kas vyksta. Susipažinkime, kuo tu vardu?"}]);

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
                <div className="chatHistory">
                {chat
                    .slice()
                    .reverse()
                    .map((message, index) => (
                    <div key={index} className="message">
                        <p className="message_author">{message.author}</p>
                        <p className="message_text">{message.text}</p>
                    </div>
                ))}
                </div>
            </div>
            <ChatBoxInput handleSubmit = {handleSubmit}/>
        </div>
    );
}