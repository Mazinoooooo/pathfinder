import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from 'react';

export default function ChatBox({ messages, chatStarted, hasPreviousMessages, chatBoxRef, handleSubmit }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  // automatically scrolls to the bottom of the existing chat
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom(); 
  }, []);

  // auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        120 // max height (~5-6 lines)
      ) + "px";
    }
  }, [message]);

  const onSubmit = () => {
    if (!message.trim()) return;
    handleSubmit(message);   // just send the message string
    setMessage("");
  };

  return (
    <main className={chatStarted ? "chat-started" : ""}>
      {!chatStarted && !hasPreviousMessages && (
        <div className="greeting">Hi! How can I assist you today?</div>
      )}

      <div className="chat-box" id="chatBox" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.sender === "ai" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>

      <form
        className="chat-input-wrapper"
        id="chatForm"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Type your message..."
          rows={1}
          className="chat-textarea"
          name="message"
        />
        <button type="submit" className="send-btn">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </main>
  );
}