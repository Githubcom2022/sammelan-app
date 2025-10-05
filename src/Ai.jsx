import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

function ChatApp() {
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "Hello! I'm Gemini AI. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: "You", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "This is a simulated AI response." },
      ]);
    }, 800);
  };

  return (
    <div
      className="container py-4 d-flex flex-column"
      style={{ height: "100vh" }}
    >
      {/* Header */}
      <header className="text-center mb-4">
        <h1>💬 Gemini AI Chat</h1>
        <p className="text-muted">Chat with Google's advanced AI model</p>
      </header>

      {/* Chat Area */}
      <div className="card flex-grow-1 d-flex flex-column">
        <div
          className="card-body overflow-auto"
          style={{ maxHeight: "70vh" }}
          id="chatMessages"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`d-flex mb-3 ${
                msg.sender === "You"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              {msg.sender === "AI" && (
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                  style={{ width: 35, height: 35 }}
                >
                  AI
                </div>
              )}
              <div
                className={`p-2 rounded shadow-sm ${
                  msg.sender === "You"
                    ? "bg-primary text-white"
                    : "bg-light text-dark"
                }`}
                style={{ maxWidth: "75%" }}
              >
                {msg.text}
              </div>
              {msg.sender === "You" && (
                <div
                  className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center ms-2"
                  style={{ width: 35, height: 35 }}
                >
                  You
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Form */}
        <div className="card-footer bg-white">
          <form className="d-flex" onSubmit={handleSubmit}>
            <textarea
              className="form-control me-2"
              rows="1"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
