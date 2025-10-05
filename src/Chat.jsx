import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import io from "socket.io-client";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";

const ENDPOINT = "http://localhost:5000";

const Chat = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [socket, setSocket] = useState(null);
  const userContext = useContext(UserContext);
  useEffect(() => {
    // console.log("user from chat", userContext.user);
    // const userInfo = JSON.parse(localStorage.getItem("UserContext") || "{}");
    const newSocket = io(ENDPOINT, {
      auth: { user: userContext.user },
    });
    // console.log("Socket connected:", newSocket);
    setSocket(newSocket);
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [socket, userContext]);

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar */}
        <div
          className={`col-md-3 border-end border-secondary ${
            selectedGroup ? "d-none d-md-block" : "d-block"
          }`}
        >
          <Sidebar setSelectedGroup={setSelectedGroup} />
        </div>

        {/* Chat Area */}
        <div
          className={`col-md-9 ${
            selectedGroup ? "d-block" : "d-none d-md-block"
          }`}
        >
          {socket && (
            <ChatArea
              selectedGroup={selectedGroup}
              socket={socket}
              setSelectedGroup={setSelectedGroup}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
