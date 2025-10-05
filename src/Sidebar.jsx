import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";

const Sidebar = ({ setSelectedGroup }) => {
  const [newGroupName, setNewGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  let userContext = useContext(UserContext);

  console.log("UserContext in Sidebar id:", userContext.user.isAdmin);

  // ✅ Check admin
  const checkAdminStatus = () => {
    setIsAdmin(userContext.user?.isAdmin || false);

    // console.log("UserContext in Sidebar:", userContext);
  };
  // console.log("UserContext in Sidebar:", userContext);

  // useEffect(() => {
  //   checkAdminStatus();
  //   fetchGroups();
  // }, [isAdmin, fetchGroups]);

  // ✅ Fetch groups
  const fetchGroups = async () => {
    try {
      //   const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userContext.user.token;
      const response = await axios.get("http://localhost:5000/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched groups response data:", response.data);
      setGroups(response.data);
      // const { data } = response;
      const userGroupIds = response.data
        ?.filter((group) => {
          return group?.members?.some(
            (member) => member?._id === userContext.user?._id
          );
        })
        .map((group) => group?._id);

      console.log("User's groupsIds:", userGroupIds);
      setUserGroups(userGroupIds);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkAdminStatus();
    fetchGroups();
  }, [isAdmin, groups]);

  // ✅ Create group
  const handleCreateGroup = async () => {
    try {
      //   const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userContext.user.token;
      await axios.post(
        "http://localhost:5000/api/groups",
        {
          name: newGroupName,
          description: newGroupDescription,
          admin: userContext.user._id,
          members: userContext.user._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Group Created", { autoClose: 3000 });
      fetchGroups();
      setNewGroupName("");
      setNewGroupDescription("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating group", {
        autoClose: 3000,
      });
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    // localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // ✅ Join group
  const handleJoinGroup = async (groupId) => {
    try {
      //   const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      //   const token = userInfo.token;
      const token = userContext.user.token;
      await axios.post(
        `http://localhost:5000/api/groups/${groupId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchGroups();
      setSelectedGroup(groups.find((g) => g?._id === groupId));
      toast.success("Joined group successfully", { autoClose: 3000 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error joining group", {
        autoClose: 3000,
      });
    }
  };

  // ✅ Leave group
  const handleLeaveGroup = async (groupId) => {
    try {
      //   const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userContext.user.token;
      await axios.post(
        `http://localhost:5000/api/groups/${groupId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchGroups();
      setSelectedGroup(null);
      toast.success("Left group successfully", { autoClose: 3000 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error leaving group", {
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      className="d-flex flex-column bg-white border-end"
      style={{ height: "100vh", width: "300px" }}
    >
      {/* Header */}
      <div className="d-flex align-items-center p-3 border-bottom bg-white sticky-top">
        <i className="fas fa-users text-primary me-2"></i>
        <h5 className="m-0">Groups</h5>

        {isAdmin && (
          <button
            className="btn btn-sm btn-outline-secondry rounded-circle ms-auto"
            data-bs-toggle="modal"
            data-bs-target="#createGroupModal"
          >
            {/* <i className="fas fa-plus bs-info-bg-subtle"></i> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-file-plus-fill border border-secundry"
              viewBox="0 0 16 16"
            >
              <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M8.5 6v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 1 0"></path>
            </svg>

            {/* <h6 className="m-0">Create Group</h6> */}
          </button>
        )}
      </div>

      {/* Group List */}
      <div className="flex-grow-1 overflow-auto p-3">
        {groups.map((group) => (
          <div
            key={group._id}
            className={`card p-3 mb-3 ${
              userGroups.includes(group._id) ? "border-primary bg-light" : ""
            }`}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div
                onClick={() => setSelectedGroup(group)}
                style={{ cursor: "pointer", flex: 1 }}
              >
                <h6 className="fw-bold mb-1">
                  {group.name}
                  {userGroups.includes(group._id) && (
                    <span className="badge bg-primary ms-2">Joined</span>
                  )}
                </h6>
                <p className="text-muted small mb-0">{group.description}</p>
              </div>
              <button
                className={`btn btn-sm ${
                  userGroups.includes(group._id)
                    ? "btn-outline-danger"
                    : "btn-primary"
                } ms-3`}
                onClick={() =>
                  userGroups.includes(group._id)
                    ? handleLeaveGroup(group._id)
                    : handleJoinGroup(group._id)
                }
              >
                {userGroups.includes(group._id) ? "Leave" : "Join"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="p-3 border-top bg-light position-fixed bottom-0 start-0 w-100"
        style={{ maxWidth: "300px" }}
      >
        <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt me-2"></i> Logout
        </button>
      </div>

      {/* Modal */}
      <div className="modal fade" id="createGroupModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Group</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
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
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary w-100"
                onClick={handleCreateGroup}
                data-bs-dismiss="modal"
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

export default Sidebar;
