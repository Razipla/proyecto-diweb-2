import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import "../App.css";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const { userId } = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const auth = useAuth();

  useEffect(() => {
  
    // loadMessages();
  }, [userId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      sender: auth.getUser()?.username,
      content: newMessage.trim(),
      timestamp: new Date(),
    };

   
    // await sendMessageToServer(message);

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <h2>Chat con {userId}</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === auth.getUser()?.username ? "sent" : "received"}`}>
            <span className="sender">{msg.sender}</span>
            <span className="content">{msg.content}</span>
            <span className="timestamp">{msg.timestamp.toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="new-message">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}