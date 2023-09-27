import "./chatbot.css";
import chatbot from "./chatbot.jpg";
import fileinput from "../../assets/images/uploadbutton.png";
import close from "../../assets/images/close.png";
import { useState, useEffect, useRef, useContext } from "react";
import { UserDataContext } from "../../../../context/Context";
const Chatbot = () => {
  const userContext = useContext(UserDataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello, how can I assist you?", type: "bot" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);
  const [reportfile, setreportfile] = useState(null);
  const [hinditext, sethinditext] = useState("");
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const onHindiClick = () => {
    sethinditext("Tell in Hindi.");
    const hindibutton = document.getElementById("hindi-button");
    hindibutton.style.display = "none";
  };

  const handleSendMessage = async (message) => {
    if(message.trim() === "" &&  !reportfile) return;
    const chatMessageInput = document.getElementById("chat-message");
    const hindibutton = document.getElementById("hindi-button");
    hindibutton.style.display = "none";
    setMessages((messages) => [...messages, { text: message, type: "user" }]);
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append("ip", JSON.stringify({ ip: "192.168.1.1" }));
      formData.append("question", message);
      if(reportfile)formData.append("reportfile", reportfile[0]);
      formData.append("hindi", hinditext);
      const response = await fetch(`${userContext.api}/chatbot`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const answer = data.answer;

      const sanitizedAnswer = answer.replace(/<br>/g, "");

      setMessages((messages) => [
        ...messages,
        { text: sanitizedAnswer, type: "bot" },
      ]);
      setIsTyping(false);
      if (chatMessageInput) {
        chatMessageInput.readOnly = false;
      }
      const imageUpload = document.getElementById("image-upload");
    imageUpload.value = "";
      
    const inputfile = document.querySelector(".custom-file-upload");
    inputfile.classList.remove("disabled")
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const handleRemoveImage = (imageId) => {
    const chatMessageInput = document.getElementById("chat-message");
    const hindibutton = document.getElementById("hindi-button");
    const imageUpload = document.getElementById("image-upload");
    imageUpload.value = "";
    const inputfile = document.querySelector(".custom-file-upload");
    inputfile.classList.remove("disabled")
    setMessages((messages) =>
      messages.filter((message) => message.imageId !== imageId)
    );
    if (chatMessageInput) {
      chatMessageInput.readOnly = false;
    }
    hindibutton.style.display = "none";
    setreportfile(null);
    console.log("reportfile", reportfile);

  };
  
  const handleImageUpload = (e) => {
    const inputfile = document.querySelector(".custom-file-upload");
    const chatMessageInput = document.getElementById("chat-message");
    const hindibutton = document.getElementById("hindi-button");
    if (chatMessageInput) {
      chatMessageInput.readOnly = true;
    }
    console.log("invoked")
    hindibutton.style.display = "block";
    inputfile.classList.add("disabled")
    const file = e.target.files;
    console.log(file);
    if (file) {
      setreportfile(file);
      const imageUrl = URL.createObjectURL(file[0]);
      setMessages((messages) => [
        ...messages,
        { image: imageUrl, type: "user", imageId: Date.now() },
      ]);

    }
  };
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, reportfile]);

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
                style={{
                  borderBottomLeftRadius: message.type === "bot" ? 0 : "8px",
                  borderBottomRightRadius: message.type === "user" ? 0 : "8px",
                }}
                key={index}
                className={`chat-message ${
                  message.type === "user" ? "user-message" : "bot-message"
                }`}
              >
                {message.text && (
                  <p dangerouslySetInnerHTML={{ __html: message.text }} />
                )}
                {message.image && (
                  <div className="uploaded-image">
                    <img src={close} className="close-image" alt="" onClick={() => handleRemoveImage(message.imageId)}  />
                    <img src={message.image} alt="Uploaded" />
                    
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="bot-message typing-animation">Typing...</div>
            )}
          </div>
          <button
            id="hindi-button"
            className="hindi-button"
            onClick={onHindiClick}
          >
            हिन्दी
          </button>
          <div className="chat-input">
            <input
              id="chat-message"
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
            <label htmlFor="image-upload" className="custom-file-upload">
              <img className="inputfile" id="inputfile" srcset={fileinput} alt="" />
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <button onClick={() => handleSendMessage(inputValue)}>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            </button>{" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
