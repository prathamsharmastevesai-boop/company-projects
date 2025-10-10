import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { SessionList } from "../Pages/User/Session/sessionList";

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { Role } = useSelector((state) => state.loginSlice);

  const [openMenu, setOpenMenu] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setCollapsed((prev) => !prev);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = (path) => {
    navigate(path);
    if (isMobile) setCollapsed(true);
  };

  const toggleAccordion = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <>
      <aside
        className={`sidebar-wrapper d-flex flex-column bg-dark text-white border-end ${
          isMobile && !collapsed ? "sidebar-mobile-open" : ""
        }`}
      >
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          {!collapsed && <span className="mb-0 fs-5">creportfoliopulse</span>}
          {isMobile && (
            <button
              className="btn btn-sm btn-outline-light"
              onClick={toggleSidebar}
            >
              <i
                className={`bi ${
                  collapsed
                    ? "bi-chevron-double-right"
                    : "bi-chevron-double-left"
                }`}
              />
            </button>
          )}

          {/* <button className="btn btn-sm btn-outline-light" onClick={toggleSidebar}>
            <i
              className={`bi ${collapsed ? "bi-chevron-double-right" : "bi-chevron-double-left"
                }`}
            />
          </button> */}
        </div>

        <div
          className="sidebar-body flex-grow-1 overflow-auto px-3 pt-3 hide-scrollbar"
          style={{ minHeight: 0, WebkitOverflowScrolling: "touch" }}
        >
          <ul className="nav flex-column">
            {Role === "superuser" && (
              <>
                {!collapsed && (
                  <h6 className="text-uppercase fw-bold small text-secondary px-2">
                    Super Admin Panel
                  </h6>
                )}

                <li className="nav-header text-light small">Main</li>

                <li
                  className={`nav-item ${
                    isActive("/AdminManagement") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/AdminManagement")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-speedometer2 me-2" />
                    {!collapsed && "Admin Management"}
                  </span>
                </li>
              </>
            )}

            {Role === "admin" && (
              <>
                {!collapsed && (
                  <h6 className="text-uppercase fw-bold small text-secondary px-2">
                    Admin Panel
                  </h6>
                )}

                <li className="nav-header text-light small">Main</li>

                <li
                  className={`nav-item ${
                    isActive("/AdminDashboard") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/AdminDashboard")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-speedometer2 me-2" />
                    {!collapsed && "Dashboard"}
                  </span>
                </li>

                <li
                  className={`nav-item ${
                    isActive("/UserManagement") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/UserManagement")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-people me-2" />
                    {!collapsed && "User Management"}
                  </span>
                </li>

                <li
                  className={`nav-item ${
                    isActive("/Aianalytics") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/Aianalytics")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-graph-up me-2" />
                    {!collapsed && "AI Analytics"}
                  </span>
                </li>

                <li
                  className={`nav-item ${
                    isActive("/RagSystem") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/RagSystem")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-activity me-2" />
                    {!collapsed && "RAG System Tracing"}
                  </span>
                </li>

                <li
                  className={`nav-item ${
                    isActive("/PortfolioVoice") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/PortfolioVoice")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-mic me-2" />
                    {!collapsed && "Portfolio Voice"}
                  </span>
                </li>

                <li
                  className={`nav-item ${
                    isActive("/LeaseDraftingUpload") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/LeaseDraftingUpload")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-cpu me-2" />
                    {!collapsed && "AI Lease Drafting"}
                  </span>
                </li>

                <li
                  className={`nav-item ${
                    isActive("/ComparativeBuildingData") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/ComparativeBuildingData")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-cpu me-2" />
                    {!collapsed && "Comparative Buildings Data"}
                  </span>
                </li>
                <li
                  className={`nav-item ${
                    isActive("/adminFeedback") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/adminFeedback")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi-pencil-square me-2" />
                    {!collapsed && "Feedback"}
                  </span>
                </li>
                {!collapsed && (
                  <li
                    className="nav-header text-light small mt-3 d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleAccordion("dataCategories")}
                  >
                    <span>Data Categories</span>
                    <i
                      className={`bi ms-2 ${
                        openMenu === "dataCategories"
                          ? "bi-chevron-down"
                          : "bi-chevron-right"
                      }`}
                    />
                  </li>
                )}

                {openMenu === "dataCategories" && (
                  <>
                    <li
                      className={`nav-item ${
                        isActive("/Thirdparty") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/Thirdparty")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-people me-2" />
                        {!collapsed && "Third Party Contact Info"}
                      </span>
                    </li>
                    <li
                      className={`nav-item ${
                        isActive("/EmployContact") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/EmployContact")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-people-fill me-2" />{" "}
                        {!collapsed && "Employee Contact Info"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${
                        isActive("/Comps") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/Comps")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-bar-chart-line-fill me-2" />{" "}
                        {!collapsed && "Comps"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${
                        isActive("/TenantsMarket") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/TenantsMarket")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-building me-2" />{" "}
                        {!collapsed && "Tenants in the Market"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${
                        isActive("/TenantInformation") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/TenantInformation")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-card-list me-2" />{" "}
                        {!collapsed && "Tenant Information"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${
                        isActive("/BuildingInfo") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/BuildingInfo")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-building me-2" />
                        {!collapsed && "Building Info Data "}
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
                    <i
                      className={`bi ms-2 ${
                        openMenu === "adminTools"
                          ? "bi-chevron-down"
                          : "bi-chevron-right"
                      }`}
                    />
                  </li>
                )}

                {openMenu === "adminTools" && (
                  <>
                    <li
                      className={`nav-item ${
                        isActive("/Building_list") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/Building_list")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i
                          className="bi bi-plus-circle me-2"
                          style={{ fontSize: 14 }}
                        />
                        {!collapsed && "Add Building (LOI & Lease) "}
                      </span>
                    </li>
                  </>
                )}
              </>
            )}

            {Role === "user" && (
              <div className="mb-2">
                {!collapsed && (
                  <h6 className="text-uppercase fw-bold small text-secondary px-2">
                    User Panel
                  </h6>
                )}

                <li className="nav-header text-light small">Main</li>

                <li
                  className={`nav-item ${
                    isActive("/UserProfile") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/UserProfile")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-person-circle me-2" />
                    {!collapsed && "Profile"}
                  </span>
                </li>

                <li
                  className={`nav-item ${
                    isActive("/dashboard") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/dashboard")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-house-door me-2" />
                    {!collapsed && "Dashboard"}
                  </span>
                </li>

                <li
                  className={`nav-item ${
                    isActive("/ChatWithAnyDoc") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/ChatWithAnyDoc")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-mic me-2" />
                    {!collapsed && "Portfolio Voice"}
                  </span>
                </li>

                <li
                  className={`nav-item ${
                    isActive("/ComparativeBuildingChat") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/ComparativeBuildingChat")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-mic me-2" />
                    {!collapsed && "Comparative Building Data"}
                  </span>
                </li>

                <li
                  className={`nav-item ${
                    isActive("/Feedback") ? "active" : ""
                  }`}
                >
                  <span
                    onClick={() => handleLinkClick("/Feedback")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi-pencil-square me-2" />
                    {!collapsed && "Feedback"}
                  </span>
                </li>

                {!collapsed && (
                  <li
                    className="nav-header text-light small mt-3 d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleAccordion("generalInfo")}
                  >
                    <span>Data Categories</span>
                    <i
                      className={`bi ms-2 ${
                        openMenu === "generalInfo"
                          ? "bi-chevron-down"
                          : "bi-chevron-right"
                      }`}
                    />
                  </li>
                )}

                {openMenu === "generalInfo" && (
                  <ul className="nav flex-column mt-1">
                    <li
                      className={`nav-item ${
                        isActive("/BrokerChat") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/BrokerChat")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-telephone-fill me-1" />
                        {!collapsed && "Third Party Contact Info"}
                      </span>
                    </li>
                    <li
                      className={`nav-item ${
                        isActive("/ColleagueChat") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/ColleagueChat")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-people-fill me-1" />
                        {!collapsed && "Employee Contact Info"}
                      </span>
                    </li>
                    <li
                      className={`nav-item ${
                        isActive("/BuildingChat") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/BuildingChat")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-building me-1" />
                        {!collapsed && "Building Info Data"}
                      </span>
                    </li>
                    <li
                      className={`nav-item ${
                        isActive("/TenantInformationChat") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() =>
                          handleLinkClick("/TenantInformationChat")
                        }
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-chat-left-text me-2" />{" "}
                        {/* Chat icon */}
                        {!collapsed && "Tenant Information"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${
                        isActive("/TenantMarket") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/TenantMarket")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-people-fill me-2" />{" "}
                        {/* Market / tenants icon */}
                        {!collapsed && "Tenants in the Market"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${
                        isActive("/CompsChat") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/CompsChat")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-bar-chart-line-fill me-2" />{" "}
                        {/* Comps / chart icon */}
                        {!collapsed && "Comps"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${
                        isActive("/UserBuildinglist") ? "active" : ""
                      }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/UserBuildinglist")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi-journal-text me-1" />
                        {!collapsed && "Leases Agreement Data & LOI Data"}
                      </span>
                    </li>
                  </ul>
                )}

                {isMobile && showSessionModal && (
                  <div className="mt-2">
                    <div className="bg-dark border w-75 rounded p-2">
                      <SessionList setShowSessionModal={setShowSessionModal} />
                    </div>
                  </div>
                )}
              </div>
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

      {!isMobile && showSessionModal && (
        <div
          className="modal d-flex align-items-center justify-content-start"
          style={{ display: "block" }}
          onClick={() => setShowSessionModal(false)}
        >
          <div
            className="modal-dialog modal-sm"
            style={{ marginLeft: "240px", marginTop: "240px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-dark">
              <div className="modal-body">
                <SessionList setShowSessionModal={setShowSessionModal} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
