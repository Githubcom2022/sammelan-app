// import React, { Component } from "react";

// export default class Dashboard extends Component {
//   render() {
//     return (
//       <div>
//         <h4>Dashboard</h4>
//       </div>
//     );
//   }

//   componentDidMount() {
//     document.title = "Dashboard - eCommerce";
//   }
// }
// src/components/Sidebar.js

// src/components/Sidebar.js
import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiLogOut, FiPlus, FiUsers } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import PropTypes from "prop-types";
// import apiURL from "../../utils";

const Sidebar = ({ setSelectedGroup }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newGroupName, setNewGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  // const toast = toast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
    fetchGroups();
  }, []);
  //Check if login user is an admin
  const checkAdminStatus = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || {});
    //!update admin status
    setIsAdmin(userInfo?.isAdmin || false);
  };

  //fetch all groups
  const fetchGroups = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || {});
      const token = userInfo.token;
      const response = await axios.get("http://localhost:5000/api/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(response.data);
      const { data } = response;
      //get user groups
      const userGroupIds = data
        ?.filter((group) => {
          return group?.members?.some(
            (member) => member?._id === userInfo?._id
          );
        })
        .map((group) => group?._id);
      setUserGroups(userGroupIds);
    } catch (error) {
      console.log(error);
    }
  };
  //Create  groups
  const handleCreateGroup = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || {});
      const token = userInfo.token;
      await axios.post(
        "http://localhost:5000/api/groups",
        {
          name: newGroupName,
          description: newGroupDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Group Created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchGroups();
      setNewGroupName("");
      setNewGroupDescription("");
    } catch (error) {
      toast({
        title: "Error Creating Group",
        status: "error",
        duration: 3000,
        isClosable: true,
        description: error?.response?.data?.message || "An error occurred",
      });
    }
  };
  //logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };
  //join group
  const handleJoinGroup = async (groupId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || {});
      const token = userInfo.token;
      await axios.post(
        `http://localhost:5000/api/groups/${groupId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchGroups();
      setSelectedGroup(groups.find((g) => g?._id === groupId));
      toast({
        title: "Joined group successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Joining Group",
        status: "error",
        duration: 3000,
        isClosable: true,
        description: error?.response?.data?.message || "An error occurred",
      });
    }
  };
  //leave group
  const handleLeaveGroup = async (groupId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || {});
      const token = userInfo.token;
      await axios.post(
        `http://localhost:5000/api/groups/${groupId}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchGroups();
      setSelectedGroup(null);
      toast({
        title: "Left group successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error Joining Group",
        status: "error",
        duration: 3000,
        isClosable: true,
        description: error?.response?.data?.message || "An error occurred",
      });
    }
  };
  // Sample groups data

  return (
    <div
      className="d-flex flex-column bg-white border-end border-1 border-secondary-subtle"
      style={{ height: "calc(100vh - 60px)", width: "300px" }}
    >
      {/* Header */}
      <div
        className="d-flex align-items-center justify-content-between p-3 border-bottom bg-white sticky-top"
        style={{ zIndex: 1, backdropFilter: "blur(8px)" }}
      >
        <div className="d-flex align-items-center">
          <i className="bi bi-people text-primary fs-4 me-2"></i>
          <h5 className="mb-0 fw-bold text-dark">Groups</h5>
        </div>

        {isAdmin && (
          <button
            className="btn btn-sm btn-outline-primary rounded-circle"
            title="Create New Group"
            onClick={onOpen}
          >
            <i className="bi bi-plus fs-5"></i>
          </button>
        )}
      </div>

      {/* Group List */}
      <div className="flex-grow-1 overflow-auto p-3 mb-4">
        {groups.map((group) => (
          <div
            key={group._id}
            className={`p-3 rounded border mb-3 ${
              userGroups.includes(group._id)
                ? "bg-primary-subtle border-primary"
                : "bg-light border-secondary-subtle"
            }`}
            style={{ cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.classList.add("shadow-sm")}
            onMouseLeave={(e) => e.currentTarget.classList.remove("shadow-sm")}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div
                onClick={() => setSelectedGroup(group)}
                className="flex-grow-1"
              >
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold text-dark">{group.name}</span>
                  {userGroups.includes(group._id) && (
                    <span className="badge bg-primary-subtle text-primary ms-2">
                      Joined
                    </span>
                  )}
                </div>
                <p className="text-muted small mb-0 text-truncate">
                  {group.description}
                </p>
              </div>

              <button
                className={`btn btn-sm ms-3 ${
                  userGroups.includes(group._id)
                    ? "btn-outline-danger"
                    : "btn-primary"
                }`}
                onClick={() => {
                  userGroups.includes(group._id)
                    ? handleLeaveGroup(group._id)
                    : handleJoinGroup(group._id);
                }}
              >
                {userGroups.includes(group._id) ? "Leave" : "Join"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="p-3 border-top bg-light position-fixed bottom-0 start-0"
        style={{ width: "300px", zIndex: 2 }}
      >
        <button
          className="btn btn-outline-danger w-100 d-flex align-items-center"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </div>

      {/* Modal */}
      <div
        className={`modal fade ${isOpen ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Group</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Group Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Enter group description"
                />
              </div>

              <button
                className="btn btn-primary w-100 mt-3"
                onClick={handleCreateGroup}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar.propTypes = {
//   setSelectedGroup: PropTypes.func.isRequired, // ✅ validation added
// };
export default Sidebar;
