// src/components/ChatArea.js

import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import UsersList from "./UserList"; // if needed for navigation
import { UserContext } from "./UserContext";

const ChatArea = ({ selectedGroup, socket, setSelectedGroup }) => {
  // console.log(connectedUsers);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const userContext = useContext(UserContext);

  let currentUser = null;
  try {
    // const storedUser = localStorage.getItem("userContext");
    currentUser = userContext.user ? userContext.user : null;
    console.log("CurrentUser from Chat Area:", currentUser);
  } catch (e) {
    console.error("Invalid userInfo in Chat Area localStorage", e);
    currentUser = null;
  }
  // get current user from UserContext
  const getCurrentUser = () => {
    try {
      const users = currentUser;

      console.log("getCurrentUser", users);
      return users;
    } catch (e) {
      console.error("Invalid userInfo", e);
      return null;
    }
  };

  const fetchMessages = async () => {
    let currentUser = null;
    try {
      // const storedUser = localStorage.getItem("userContext");
      currentUser = userContext.user ? userContext.user : null;
      console.log("CurrentUser from Chat Area:", currentUser);
    } catch (e) {
      console.error("Invalid userInfo in Chat Area localStorage", e);
      currentUser = null;
    }
    const user = currentUser;
    if (!user || !selectedGroup) return;

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/messages/${selectedGroup._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      // console.log("From chate area Fetched messages:", data);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (selectedGroup && socket) {
      fetchMessages();

      socket.emit("Join room", selectedGroup._id);
      // console.log("selected Group Id", selectedGroup._id);
      socket.on("message received", (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
      });

      socket.on("users in room", (users) => {
        console.log("users in room", users);
        setConnectedUsers(users);
      });

      socket.on("user joined", (user) => {
        setConnectedUsers((prev) => [...prev, user]);
      });

      socket.on("user left", (userId) => {
        setConnectedUsers((prev) => prev.filter((u) => u?._id !== userId));
      });

      socket.on("notification", (notification) => {
        alert(
          `${
            notification.type === "USER_JOINED"
              ? "User Joined: "
              : "Notification: "
          } ${notification.message}`
        );
      });

      socket.on("user typing", ({ username }) => {
        setTypingUsers((prev) => new Set(prev).add(username));
      });

      socket.on("user stop typing", ({ username }) => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(username);
          return newSet;
        });
      });

      return () => {
        socket.emit("leave room", selectedGroup._id);
        socket.off("message received");
        socket.off("users in room");
        socket.off("user joined");
        socket.off("user left");
        socket.off("notification");
        socket.off("user typing");
        socket.off("user stop typing");
      };
    }
  }, [selectedGroup, socket, setSelectedGroup, messages]);

  const formatTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const sendMessage = async () => {
    const user = getCurrentUser();
    if (!user || !selectedGroup) return;
    if (!newMessage.trim()) return;

    console.log("from sent message", user.token);
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/messages`,
        {
          sender: user._id,
          content: newMessage,
          groupId: selectedGroup._id,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      console.log("data from selected Group..", data);
      socket.emit("new message", { ...data, groupId: selectedGroup._id });
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message: " + (error.message || ""));
    }
  };

  const handleTyping = (e) => {
    const user = getCurrentUser();
    setNewMessage(e.target.value);

    if (!isTyping && selectedGroup) {
      setIsTyping(true);
      socket.emit("typing", {
        groupId: selectedGroup._id,
        username: user?.username,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (selectedGroup) {
        socket.emit("stop typing", { groupId: selectedGroup._td });
      }
      setIsTyping(false);
    }, 2000);
  };

  const renderTypingIndicator = () => {
    if (typingUsers.size === 0) return null;
    const arr = Array.from(typingUsers);
    return arr.map((username) => (
      <div key={username} className="mb-1 text-muted small">
        {username} is typing...
      </div>
    ));
  };

  // scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="d-flex flex-column flex-lg-row position-relative"
      style={{ height: "100vh" }}
    >
      {/* Chat Area */}
      <div
        className="flex-grow-1 d-flex flex-column bg-light"
        style={{ maxWidth: "100%" }}
      >
        {/* Chat Header */}
        {selectedGroup ? (
          <>
            <div className="d-flex align-items-center justify-content-between p-3 bg-white border-bottom shadow-sm">
              <div className="d-flex align-items-center">
                {/* Back Button (Visible on mobile) */}
                <button
                  className="btn btn-link d-lg-none me-2"
                  onClick={() => setSelectedGroup(null)}
                >
                  ←
                </button>
                <i className="bi bi-chat-dots text-primary fs-4 me-2"></i>
                <div>
                  <h6 className="fw-bold mb-0">{selectedGroup.name}</h6>
                  <small className="text-muted">
                    {selectedGroup.description}
                  </small>
                </div>
              </div>
              <i
                className="bi bi-info-circle text-muted fs-5"
                role="button"
                onClick={() => console.log("Info clicked")}
              ></i>
            </div>

            {/* Messages Section */}
            <div
              className="flex-grow-1 overflow-auto p-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#ddd transparent",
              }}
            >
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`d-flex flex-column mb-3 ${
                    message.sender._id === currentUser?._id
                      ? "align-items-start"
                      : "align-items-end"
                  }`}
                >
                  {/* Sender Info */}
                  <div
                    className={`d-flex align-items-center gap-2 mb-1 ${
                      message.sender._id === currentUser?._id
                        ? "justify-content-start"
                        : "justify-content-end"
                    }`}
                  >
                    {message.sender._id === currentUser?._id ? (
                      <>
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                          style={{
                            width: "25px",
                            height: "25px",
                            fontSize: "12px",
                          }}
                        >
                          {message.sender.username[0].toUpperCase()}
                        </div>
                        <small className="text-muted">
                          You • {formatTime(message.createdAt)}
                        </small>
                      </>
                    ) : (
                      <>
                        <small className="text-muted">
                          {message.sender.username} •{" "}
                          {formatTime(message.createdAt)}
                        </small>
                        <div
                          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                          style={{
                            width: "25px",
                            height: "25px",
                            fontSize: "12px",
                          }}
                        >
                          {message.sender.username[0].toUpperCase()}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-3 rounded-3 shadow-sm ${
                      message.sender._id === currentUser?._id
                        ? "bg-primary text-white"
                        : "bg-white text-dark"
                    }`}
                    style={{ maxWidth: "70%" }}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {/* Typing Indicator */}
              {renderTypingIndicator && renderTypingIndicator()}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-top">
              <div className="input-group input-group-lg">
                <input
                  type="text"
                  className="form-control border-0 bg-light"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <button
                  className="btn btn-primary rounded-circle"
                  style={{ width: "45px", height: "45px" }}
                  onClick={sendMessage}
                >
                  <i className="bi bi-send-fill"></i>
                </button>
              </div>
            </div>
          </>
        ) : (
          // Empty chat state
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-4">
            <i className="bi bi-chat-dots text-muted fs-1 mb-3"></i>
            <h5 className="text-muted mb-2">Welcome to the Chat</h5>
            <p className="text-secondary">
              Select a group from the sidebar to start chatting
            </p>
          </div>
        )}
      </div>

      {/* Users Sidebar */}
      <div className="d-none d-lg-block border-start bg-white scroll-container">
        {selectedGroup && <UsersList users={connectedUsers} />}
      </div>
    </div>
  );
};

// ChatArea.propTypes = {
//   selectedGroup: PropTypes.object,
//   socket: PropTypes.object,
//   setSelectedGroup: PropTypes.func.isRequired,
// };

export default ChatArea;
