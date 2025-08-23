import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './textchat.css';
import { FiSend } from "react-icons/fi";

function Textchat() {
  const location = useLocation();
  const chatUser = location.state?.chatUser;
  const chatUserId = location.state?.userId;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const token = localStorage.getItem("token");
  const myId = localStorage.getItem("userId"); // ✅ logged-in user's _id


  useEffect(() => {
  let interval;

  const fetchMessages = async () => {
    if (!chatUserId) return;
    try {
      const res = await fetch(`https://live-chat-x7h2.onrender.com/api/messages/dm/${chatUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const formatted = data.map(msg => ({
        ...msg,
        sender: msg.sender?._id ? msg.sender : { _id: msg.sender, username: "Unknown" },
        receiver: msg.receiver?._id ? msg.receiver : { _id: msg.receiver, username: "Unknown" }
      }));
      setMessages(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  fetchMessages(); // initial load

  // ✅ Fetch every 2 seconds
  interval = setInterval(fetchMessages, 1000);

  // Cleanup on unmount
  return () => clearInterval(interval);

}, [chatUserId, token]);

  // Load messages between logged-in user and selected user
  useEffect(() => {
    if (chatUserId) {
      fetch(`https://live-chat-x7h2.onrender.com/api/messages/dm/${chatUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          // ✅ Ensure sender & receiver are populated objects
          const formatted = data.map(msg => ({
            ...msg,
            sender: msg.sender?._id ? msg.sender : { _id: msg.sender, username: "Unknown" },
            receiver: msg.receiver?._id ? msg.receiver : { _id: msg.receiver, username: "Unknown" }
          }));
          setMessages(formatted);
        })
        .catch(err => console.error(err));
    }
  }, [chatUserId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await fetch(`https://live-chat-x7h2.onrender.com/api/messages/dm/${chatUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: message })
      });

      const newMsg = await res.json();

      // ✅ Ensure new message has populated sender & receiver
      const formattedMsg = {
        ...newMsg,
        sender: newMsg.sender?._id ? newMsg.sender : { _id: newMsg.sender, username: "You" },
        receiver: newMsg.receiver?._id ? newMsg.receiver : { _id: newMsg.receiver, username: chatUser }
      };

      setMessages(prev => [...prev, formattedMsg]);
      setMessage("");

    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className="textchat-container">
      <div className="chat-header">
        <h3>{chatUser ? `Chatting with: ${chatUser}` : "Select a user"}</h3>
      </div>

      <div className="text-area">
        {messages.map(msg => (
          <div
            key={msg._id || msg.id}
            className={`chat-bubble ${msg.sender._id === myId ? "sender" : "receiver"}`}
          >
            <strong>{msg.sender._id === myId ? "You" : msg.sender.username}: </strong>
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chating">
        <input
          className="chatin"
          type="text"
          value={message}
          placeholder="Enter message"
          onChange={e => setMessage(e.target.value)}
        />
        <button type="submit" className="chatbtn">
          <FiSend className="chatbtnimg"/>
        </button>
      </form>
    </div>
  );
}

export default Textchat;
