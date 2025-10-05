const UsersList = ({ users }) => {
  return (
    <div
      className="h-100 border-start bg-white d-flex flex-column"
      style={{ overflow: "hidden" }}
    >
      {/* Header */}
      <div className="d-flex align-items-center p-3 border-bottom bg-white shadow-sm sticky-top">
        <i className="bi bi-people text-primary me-2"></i>
        <h6 className="mb-0 fw-bold text-secondary">Members</h6>
        <span className="badge bg-primary ms-2">{users.length}</span>
      </div>

      {/* Users List */}
      <div className="flex-grow-1 overflow-auto p-3">
        <div className="d-flex flex-column gap-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="d-flex align-items-center p-2 border rounded shadow-sm bg-white"
              title={`${user.username} is online`}
            >
              {/* Avatar Circle */}
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                style={{ width: "35px", height: "35px", fontSize: "14px" }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>

              {/* Username */}
              <div className="flex-grow-1">
                <span className="fw-medium text-dark small">
                  {user.username}
                </span>
              </div>

              {/* Online badge */}
              <div className="d-flex align-items-center bg-success bg-opacity-10 px-2 py-1 rounded-pill">
                <span
                  className="rounded-circle bg-success me-1"
                  style={{ width: "8px", height: "8px" }}
                ></span>
                <span className="text-success small fw-medium">online</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// UsersList.propTypes = {
//   users: PropTypes.arrayOf(
//     PropTypes.shape({
//       _id: PropTypes.string.isRequired,
//       username: PropTypes.string.isRequired,
//       isOnline: PropTypes.bool,
//     })
//   ).isRequired,
// };

export default UsersList;
