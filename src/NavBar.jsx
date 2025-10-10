import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "./UserContext";

let NavBar = () => {
  let userContext = useContext(UserContext);
  let onLogoutClick = (event) => {
    event.preventDefault();

    userContext.setUser({
      isLoggedIn: false,
      _id: null,
      username: null,
    });

    window.location.hash = "/";
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-body-dark navbar-style">
      {/* navbar navbar-expand-lg navbar-dark bg-dark navbar-style */}
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="#">
          sammelan
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
              <NavLink className="nav-link active" aria-current="page" to="/">
                Home
              </NavLink>
            </li> */}
            {userContext.user.isLoggedIn ? (
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">
                  <i className="fa fa-dashboard"></i> Dashboard
                </NavLink>
              </li>
            ) : (
              ""
            )}

            {!userContext.user.isLoggedIn ? (
              <li>
                <NavLink
                  className="nav-link"
                  to="/"
                  activeClassName="active"
                  exact={true}
                >
                  Login
                </NavLink>
              </li>
            ) : (
              ""
            )}

            {/*register link starts */}
            {!userContext.user.isLoggedIn ? (
              <li className="nav-item">
                <NavLink className="nav-link" to="/Registration">
                  <i className="fa fa-user-plus"></i> Register
                </NavLink>
              </li>
            ) : (
              ""
            )}
            {/* register link ends */}
            {/* dropdown starts */}
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                activeClassName="inactive"
              >
                Dropdown
              </NavLink>
              <ul className="dropdown-menu">
                <li>
                  <NavLink className="dropdown-item" to="/chat">
                    Action
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="#">
                    Another action
                  </NavLink>
                </li>
                {/* <li><hr className="dropdown-divider"></li> */}
                <li>
                  <NavLink className="dropdown-item" to="#">
                    Something else here
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* dropdown ends */}
            {/* <li className="nav-item">
              <NavLink className="nav-link disabled" aria-disabled="true">
                Disabled
              </NavLink>
            </li> */}
          </ul>
          {/* <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form> */}
          {/* right box starts */}
          {userContext.user.isLoggedIn ? (
            <div style={{ marginRight: 100 }}>
              <ul className="navbar-nav">
                <li className="nav-item dropdown z-100">
                  <NavLink
                    className="nav-link dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    activeClassName="inactive"
                  >
                    <i className="fa fa-user-circle"></i>{" "}
                    {userContext.user.username}
                  </NavLink>

                  <div
                    className="dropdown-menu textarea"
                    aria-labelledby="navbarDropdown"
                  >
                    <NavLink
                      className="dropdown-item bg-info text-dark"
                      to="/#"
                      onClick={onLogoutClick}
                    >
                      Logout
                    </NavLink>
                  </div>
                </li>
              </ul>
            </div>
          ) : (
            ""
          )}

          {/* right box ends */}
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
