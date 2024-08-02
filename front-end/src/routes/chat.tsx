import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import io, { Socket } from "socket.io-client";
import { CHAT_WS_URL } from "../auth/constants";
import "../App.css";
import "../chat.css"

interface IMessage {
  sender: string;
  content: string;
  timestamp: Date;
}

export default function Chat() {
  let socket: Socket;
  const { userId } = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const auth = useAuth();

  // pedimos chat -> query existe un room? id: 1 y id: 2?
  // existe? retorna id : crea y luego retorna.
  // usuario 1, usuario 2, usuario..n, messages: Message[];
  // 

  useEffect(() => {
    socket = io(CHAT_WS_URL, {query: {room: 1}});
    socket.on("messageReceived", handleNewMessage);
  });

  useEffect(() => {}, [userId]);

  const handleNewMessage = (message: IMessage) => {
    console.log("!!!!!!!!!", message);
    setMessages([...messages, message]);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      sender: auth.getUser()?.username,
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    socket.emit("newMessage", message);

    // await sendMessageToServer(message);
    // setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <h2>Chat con {userId}</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === auth.getUser()?.username ? "sent" : "received"
            }`}
          >
            <span className="sender chat-item">{`${msg.sender}:`}</span>
            <span className="content chat-item">{msg.content}</span>
            <span className="timestamp chat-item">
              ----{ msg.timestamp.toString()}
            </span>
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
