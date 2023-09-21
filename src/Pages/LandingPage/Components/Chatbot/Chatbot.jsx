import "./chatbot.css";
import chatbot from "./chatbot.jpg";
import { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello, how can I assist you?", type: "bot" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState(""); 
  const chatContainerRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (message) => {
    console.log(message);
    setInputValue("")
    setMessages((messages)=>[...messages, { text: message, type: "user" }]);
    setIsTyping(true);

    try {
      const response = await fetch("https://medicalgpt.online/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ip: {
            ip: "192.168.1.1",
          },
          question: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const answer = data.answer;

      const sanitizedAnswer = answer.replace(/<br>/g, "");

        setMessages((messages)=>[...messages, { text: sanitizedAnswer, type: "bot" }]);
        setIsTyping(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`chatbot ${isOpen ? "open" : ""}`}>
      <div className="chatbot-toggle" onClick={toggleChatbot}>
        <img src={chatbot} alt="" />
      </div>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chat-header">Chat with Me</div>
          <div className="chat-messages" ref={chatContainerRef}>
            {messages.map((message, index) => (
              <div
              style={{borderBottomLeftRadius:message.type==="bot"?0:"8px",borderBottomRightRadius:message.type==="user"?0:"8px"}}
                key={index}
                className={`chat-message ${
                  message.type === "user" ? "user-message" : "bot-message"
                }`}
                dangerouslySetInnerHTML={{ __html: message.text }}
              />
            ))}
            {isTyping && (
              <div className="bot-message typing-animation">Typing...</div>
            )}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(inputValue); 
                  setInputValue(""); 
                }
              }}
            />
            <button onClick={() => handleSendMessage(inputValue)}><svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
</svg></button>{" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
