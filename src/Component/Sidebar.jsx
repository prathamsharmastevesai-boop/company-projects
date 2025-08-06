import { useNavigate, useLocation } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useSelector } from "react-redux";

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { Role } = useSelector((state) => state.loginSlice);
  console.log(Role, "Role");

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = (path) => {
    navigate(path);
    setCollapsed(true);
  };

  return (
    <div
      className="d-flex flex-column bg-dark text-white p-3 border-end sidebar-wrapper"
      style={{
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 1000,
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <button
        className="btn btn-sm btn-outline-light mb-3"
        onClick={toggleSidebar}
      >
        <i className={`bi ${collapsed ? 'bi-chevron-double-right' : 'bi-chevron-double-left'}`} />
      </button>

      <ul className="nav flex-column">
        {Role === "admin" && (
          <>
            {!collapsed && <h5 className="text-center mb-4">🏢 Admin Panel</h5>}

            <li className={`nav-item ${isActive('/CreateBuilding') ? 'active' : ''}`}>
              <span onClick={() => handleLinkClick('/CreateBuilding')} className="nav-link text-white" style={{ cursor: 'pointer' }}>
                <i className="bi bi-building-add me-2" />
                {!collapsed && "Create Building"}
              </span>
            </li>

            <li className={`nav-item ${isActive('/Building_list') ? 'active' : ''}`}>
              <span onClick={() => handleLinkClick('/Building_list')} className="nav-link text-white" style={{ cursor: 'pointer' }}>
                <i className="bi bi-buildings me-2" />
                {!collapsed && "Building List"}
              </span>
            </li>

            <li className={`nav-item ${isActive('/Approved_Denied_list') ? 'active' : ''}`}>
              <span onClick={() => handleLinkClick('/Approved_Denied_list')} className="nav-link text-white" style={{ cursor: 'pointer' }}>
                <i className="bi bi-info-circle me-2" />
                {!collapsed && "Approved/Denied"}
              </span>
            </li>

            <li className={`nav-item ${isActive('/UserAccess') ? 'active' : ''}`}>
              <span onClick={() => handleLinkClick('/UserAccess')} className="nav-link text-white" style={{ cursor: 'pointer' }}>
                <i className="bi bi-person-gear me-2" />
                {!collapsed && "User Access"}
              </span>
            </li>
          </>
        )}

        {Role === "user" && (
          <>
            <li className={`nav-item ${isActive('/UserProfile') ? 'active' : ''}`}>
              <span onClick={() => handleLinkClick('/UserProfile')} className="nav-link text-white" style={{ cursor: 'pointer' }}>
                <i className="bi bi-person-circle me-2" />
                {!collapsed && "Profile"}
              </span>
            </li>

            <li className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
              <span onClick={() => handleLinkClick('/dashboard')} className="nav-link text-white" style={{ cursor: 'pointer' }}>
                <i className="bi bi-house-door me-2" />
                {!collapsed && "Dashboard"}
              </span>
            </li>

            <li className={`nav-item ${isActive('/UserBuildinglist') ? 'active' : ''}`}>
              <span onClick={() => handleLinkClick('/UserBuildinglist')} className="nav-link text-white" style={{ cursor: 'pointer' }}>
                <i className="bi bi-buildings me-2" />
                {!collapsed && "Buildings"}
              </span>
            </li>

            <li className={`nav-item ${isActive('/ChatWithAnyDoc') ? 'active' : ''}`}>
              <span onClick={() => handleLinkClick('/ChatWithAnyDoc')} className="nav-link text-white" style={{ cursor: 'pointer' }}>
                <i className="bi bi-chat-dots me-2" />
                {!collapsed && "Chat"}
              </span>
            </li>
          </>
        )}
      </ul>

      <div className="mt-auto">
        <button
          onClick={() => {
            sessionStorage.removeItem("token");
            setCollapsed(true);
            Role === "admin" ? navigate("/") : navigate("/");
          }}
          className="btn btn-outline-danger w-100"
        >
          <i className="bi bi-box-arrow-right me-2" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};
