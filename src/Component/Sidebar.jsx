import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSelector } from "react-redux";
import { useState } from "react";

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { Role } = useSelector((state) => state.loginSlice);

  const [openMenu, setOpenMenu] = useState(null);

  const toggleSidebar = () => {
    if (openMenu) {
      setOpenMenu(null);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = (path) => {
    navigate(path);
    if (window.innerWidth < 768) setCollapsed(true);
  };

  const toggleAccordion = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <aside
      className="sidebar-wrapper d-flex flex-column bg-dark text-white border-end"
      style={{ height: "100dvh" }}
    >
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
        {!collapsed && <span className="mb-0 fs-5">CRE Portfolio Pulse</span>}
        <button className="btn btn-sm btn-outline-light" onClick={toggleSidebar}>
          <i
            className={`bi ${collapsed ? "bi-chevron-double-right" : "bi-chevron-double-left"
              }`}
          />
        </button>

      </div>

      <div
        className="sidebar-body flex-grow-1 overflow-auto px-3 pt-3 hide-scrollbar"
        style={{ minHeight: 0, WebkitOverflowScrolling: "touch" }}
      >
        <ul className="nav flex-column">
          {Role === "admin" && (
            <>
              {!collapsed && (
                <h6 className="text-uppercase fw-bold small text-secondary px-2">
                  Admin Panel
                </h6>
              )}

              <li className="nav-header text-light small">Main</li>

              <li className={`nav-item ${isActive("/AdminDashboard") ? "active" : ""}`}>
                <span onClick={() => handleLinkClick("/AdminDashboard")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                  <i className="bi bi-speedometer2 me-2" />
                  {!collapsed && "Dashboard"}
                </span>
              </li>

              <li className={`nav-item ${isActive("/UserManagement") ? "active" : ""}`}>
                <span onClick={() => handleLinkClick("/UserManagement")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                  <i className="bi bi-people me-2" />
                  {!collapsed && "User Management"}
                </span>
              </li>

              <li className={`nav-item ${isActive("/Aianalytics") ? "active" : ""}`}>
                <span
                  onClick={() => handleLinkClick("/Aianalytics")}
                  className="nav-link text-white fs-6"
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-graph-up me-2" />
                  {!collapsed && "AI Analytics"}
                </span>
              </li>


              <li className={`nav-item ${isActive("/RagSystem") ? "active" : ""}`}>
                <span onClick={() => handleLinkClick("/RagSystem")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                  <i className="bi bi-activity me-2" />
                  {!collapsed && "RAG System Tracing"}
                </span>
              </li>

              <li className={`nav-item ${isActive("/PortfolioVoice") ? "active" : ""}`}>
                <span onClick={() => handleLinkClick("/PortfolioVoice")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                  <i className="bi bi-mic me-2" />
                  {!collapsed && "Portfolio Voice"}
                </span>
              </li>

              {!collapsed && (
                <li
                  className="nav-header text-light small mt-3 d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleAccordion("dataCategories")}
                >
                  <span>Data Categories</span>
                  <i className={`bi ms-2 ${openMenu === "dataCategories" ? "bi-chevron-down" : "bi-chevron-right"}`} />
                </li>
              )}

              {openMenu === "dataCategories" && (
                <>
                  <li className={`nav-item ${isActive("/Thirdparty") ? "active" : ""}`}>
                    <span onClick={() => handleLinkClick("/Thirdparty")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                      <i className="bi bi-people me-2" />
                      Third Party Info
                    </span>
                  </li>
                  <li className={`nav-item ${isActive("/EmployContact") ? "active" : ""}`}>
                    <span onClick={() => handleLinkClick("/EmployContact")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                      <i className="bi bi-person-badge me-2" />
                      Employee Info
                    </span>
                  </li>
                  <li className={`nav-item ${isActive("/MarketIntelligence") ? "active" : ""}`}>
                    <span onClick={() => handleLinkClick("/MarketIntelligence")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                      <i className="bi bi-graph-up-arrow me-2" />
                      Market Intelligence
                    </span>
                  </li>
                  <li className={`nav-item ${isActive("/BuildingInfo") ? "active" : ""}`}>
                    <span onClick={() => handleLinkClick("/BuildingInfo")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                      <i className="bi bi-building me-2" />
                      Building Info
                    </span>
                  </li>
                </>
              )}

              {!collapsed && (
                <li
                  className="nav-header text-light small mt-3 d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleAccordion("adminTools")}
                >
                  <span>Admin Tools</span>
                  <i className={`bi ms-2 ${openMenu === "adminTools" ? "bi-chevron-down" : "bi-chevron-right"}`} />
                </li>
              )}

              {openMenu === "adminTools" && (
                <>
                  <li className={`nav-item ${isActive("/Building_list") ? "active" : ""}`}>
                    <span onClick={() => handleLinkClick("/Building_list")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                      <i className="bi bi-buildings me-2" />
                      Building List
                    </span>
                  </li>
                  <li className={`nav-item ${isActive("/Approved_Denied_list") ? "active" : ""}`}>
                    <span onClick={() => handleLinkClick("/Approved_Denied_list")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                      <i className="bi bi-check2-circle me-2" />
                      Approved/Denied
                    </span>
                  </li>
                  <li className={`nav-item ${isActive("/UserAccess") ? "active" : ""}`}>
                    <span onClick={() => handleLinkClick("/UserAccess")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                      <i className="bi bi-person-gear me-2" />
                      User Access
                    </span>
                  </li>
                </>
              )}
            </>
          )}

          {Role === "user" && (
            <>
              {!collapsed && (
                <h6 className="text-uppercase fw-bold small text-secondary px-2">
                  User Panel
                </h6>
              )}
              <li className="nav-header text-light small">Main</li>
              <li className={`nav-item ${isActive("/UserProfile") ? "active" : ""}`}>
                <span onClick={() => handleLinkClick("/UserProfile")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                  <i className="bi bi-person-circle me-2" />
                  {!collapsed && "Profile"}
                </span>
              </li>

              <li className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}>
                <span onClick={() => handleLinkClick("/dashboard")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                  <i className="bi bi-house-door me-2" />
                  {!collapsed && "Dashboard"}
                </span>
              </li>

              <li className={`nav-item ${isActive("/UserBuildinglist") ? "active" : ""}`}>
                <span onClick={() => handleLinkClick("/UserBuildinglist")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                  <i className="bi bi-buildings me-2" />
                  {!collapsed && "Buildings"}
                </span>
              </li>

              <li className={`nav-item ${isActive("/ChatWithAnyDoc") ? "active" : ""}`}>
                <span onClick={() => handleLinkClick("/ChatWithAnyDoc")} className="nav-link text-white fs-6" style={{ cursor: "pointer" }}>
                  <i className="bi bi-chat-dots me-2" />
                  {!collapsed && "Portfolio Voice"}
                </span>
              </li>

              {!collapsed && (

                <li
                  className={`nav-header text-light small mt-3 d-flex justify-content-between align-items-center ${["/BrokerChat", "/ColleagueChat", "/BuildingChat", "/MarketChat"].includes(location.pathname) ? "active" : ""}`}
                  onClick={() => toggleAccordion("generalInfo")}
                  style={{ cursor: "pointer" }}
                >
                  <span>General Info</span>
                  <i className={`bi ms-2 ${openMenu === "generalInfo" ? "bi-chevron-down" : "bi-chevron-right"}`} />

                </li>
              )}
              {openMenu === "generalInfo" && !collapsed && (
                <ul className="nav flex-column ms-3 mt-1">
                  <li className={`nav-item ${isActive("/BrokerChat") ? "active" : ""}`}>
                    <span onClick={() => handleLinkClick("/BrokerChat")} className="nav-link text-white" style={{ cursor: "pointer" }}>
                      <i className="bi bi-person-badge me-1" />
                      Third Party Info
                    </span>
                  </li>
                  <li className={`nav-item ${isActive("/ColleagueChat") ? "active" : ""}`}>
                    <span onClick={() => handleLinkClick("/ColleagueChat")} className="nav-link text-white" style={{ cursor: "pointer" }}>
                      <i className="bi bi-people-fill me-1" />
                      Employee Info
                    </span>
                  </li>
                  <li className={`nav-item ${isActive("/BuildingChat") ? "active" : ""}`}>
                    <span onClick={() => handleLinkClick("/BuildingChat")} className="nav-link text-white" style={{ cursor: "pointer" }}>
                      <i className="bi bi-building me-1" />
                      Building Info
                    </span>
                  </li>
                  <li className={`nav-item ${isActive("/MarketChat") ? "active" : ""}`}>
                    <span onClick={() => handleLinkClick("/MarketChat")} className="nav-link text-white" style={{ cursor: "pointer" }}>
                      <i className="bi bi-graph-up me-1" />
                      Market Intelligence
                    </span>
                  </li>
                </ul>
              )}
            </>
          )}
        </ul>
      </div>

      <div className="mt-auto p-3 border-top">
        <button
          onClick={() => {
            sessionStorage.removeItem("token");
            setCollapsed(true);
            navigate("/");
          }}
          className="btn btn-outline-danger w-100"
        >
          <i className="bi bi-box-arrow-right me-2" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};
