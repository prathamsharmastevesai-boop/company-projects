import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { SessionList } from "../Pages/User/Session/sessionList";
import { getProfileDetail } from "../Networking/User/APIs/Profile/ProfileApi";

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [openMenu, setOpenMenu] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [Gemini, setGemimiStatus] = useState();
  const [Forum, setForumStatus] = useState();

  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 767;

      setIsMobile(mobile);

      if (!mobile) {
        setCollapsed(false);
      } else {
        setCollapsed(true);
        setOpenMenu(null);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await dispatch(getProfileDetail()).unwrap();
        setGemimiStatus(response?.gemini_status);
        setForumStatus(response?.forum_status);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
      }
    };
    fetchProfile();
  }, [dispatch]);

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

  const handleLogout = (navigate) => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <>
      <aside
        className={`sidebar-wrapper d-flex flex-column bg-dark text-white border-end ${isMobile && !collapsed ? "sidebar-mobile-open" : ""
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
                className={`bi ${collapsed
                    ? "bi-chevron-double-right"
                    : "bi-chevron-double-left"
                  }`}
              />
            </button>
          )}
        </div>

        <div
          className="sidebar-body flex-grow-1 overflow-auto px-3 pt-3 "
          style={{ minHeight: 0, WebkitOverflowScrolling: "touch" }}
        >
          <ul className="nav flex-column">
            {role === "superuser" && (
              <>
                {!collapsed && (
                  <h6 className="text-uppercase fw-bold small text-secondary px-2">
                    Super Admin Panel
                  </h6>
                )}

                <li className="nav-header text-light small">Main</li>

                <li
                  className={`nav-item ${isActive("/admin-management") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/admin-management")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-speedometer2 me-1" />
                    {!collapsed && "Admin Management"}
                  </span>
                </li>
              </>
            )}

            {role === "admin" && (
              <>
                {!collapsed && (
                  <h6 className="text-uppercase fw-bold small text-secondary px-2">
                    Admin Panel
                  </h6>
                )}

                <li className="nav-header text-light small">Main</li>

                <li
                  className={`nav-item ${isActive("/admin-dashboard") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/admin-dashboard")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-speedometer2 me-1" />
                    {!collapsed && "Dashboard"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/user-management") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/user-management")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-people me-1" />
                    {!collapsed && "User Management"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/aianalytics") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/aianalytics")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-graph-up me-1" />
                    {!collapsed && "AI Analytics"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/rag-system") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/rag-system")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-activity me-1" />
                    {!collapsed && "RAG System Tracing"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/portfolio-voice") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/portfolio-voice")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-mic me-1" />
                    {!collapsed && "Portfolio Voice"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/admin-portfolio-forum") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/admin-portfolio-forum")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-chat-square-dots me-1" />
                    {!collapsed && "Portfolio Forum"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/lease-drafting-upload") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/lease-drafting-upload")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-pencil-square me-1" />
                    {!collapsed && "AI Lease Drafting"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/admin-information-collaboration") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() =>
                      handleLinkClick("/admin-information-collaboration")
                    }
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi-people me-1" />
                    {!collapsed && "Information Collaboration"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/admin-distilled-comp-tracker") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/admin-distilled-comp-tracker")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-file-earmark-bar-graph me-1" />
                    {!collapsed && "Distilled Comp Tracker"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/distilled-expense-tracker") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() =>
                      handleLinkClick("/distilled-expense-tracker")
                    }
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-table me-1" />
                    {!collapsed && "Distilled Expense Tracker"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/space-inquiry") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/space-inquiry")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi-journal-text me-1" />
                    {!collapsed && "Space Inquiry"}
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
                      className={`bi ms-2 ${openMenu === "dataCategories"
                          ? "bi-chevron-down"
                          : "bi-chevron-right"
                        }`}
                    />
                  </li>
                )}

                {openMenu === "dataCategories" && (
                  <>
                    <li
                      className={`nav-item ${isActive("/third-party-upload") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/third-party-upload")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-people me-1" />
                        {!collapsed && "Third Party Contact Info"}
                      </span>
                    </li>
                    <li
                      className={`nav-item ${isActive("/employee-contact-upload") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/employee-contact-upload")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-people-fill me-1" />{" "}
                        {!collapsed && "Employee Contact Info"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/comps-upload") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/comps-upload")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-bar-chart-line-fill me-1" />{" "}
                        {!collapsed && "Comps"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/comparative-building-list") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() =>
                          handleLinkClick("/comparative-building-list")
                        }
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-bar-chart-line me-1" />
                        {!collapsed && "Comparative Buildings Data"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/tenent-info-building-list") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() =>
                          handleLinkClick("/tenent-info-building-list")
                        }
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-card-list me-1" />{" "}
                        {!collapsed && "Tenant Information"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/tenants-market-upload") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/tenants-market-upload")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-building-check me-1" />

                        {!collapsed && "Tenants in the Market"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/building-info-list") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/building-info-list")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-building me-1" />
                        {!collapsed && "Building Info Data "}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/sublease-tracker-list") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/sublease-tracker-list")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi-journal-text me-1" />
                        {!collapsed && "Sublease Tracker"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/admin-renewal-tracker-list") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() =>
                          handleLinkClick("/admin-renewal-tracker-list")
                        }
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-arrow-repeat me-1" />
                        {!collapsed && "Renewal Tracker"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/admin-tours") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/admin-tours")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-geo-alt me-1" />
                        {!collapsed && "Tours"}
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
                      className={`bi ms-2 ${openMenu === "adminTools"
                          ? "bi-chevron-down"
                          : "bi-chevron-right"
                        }`}
                    />
                  </li>
                )}

                {openMenu === "adminTools" && (
                  <>
                    <li
                      className={`nav-item ${isActive("/admin-lease-loi-building-list") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/admin-lease-loi-building-list")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i
                          className="bi bi-plus-circle me-1"
                          style={{ fontSize: 14 }}
                        />
                        {!collapsed && "Add Building (LOI & Lease) "}
                      </span>
                    </li>
                  </>
                )}
              </>
            )}

            {role === "user" && (
              <div className="mb-2">
                {!collapsed && (
                  <h6 className="text-uppercase fw-bold small text-secondary px-2">
                    User Panel
                  </h6>
                )}

                <li className="nav-header text-light small">Main</li>

                <li
                  className={`nav-item ${isActive("/dashboard") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/dashboard")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-house-door me-1" />
                    {!collapsed && "Dashboard"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/portfolio-chat") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/portfolio-chat")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-mic me-1" />
                    {!collapsed && "Portfolio Voice"}
                  </span>
                </li>
                <li
                  className={`nav-item ${isActive("/cre-news") ? "active" : ""}`}
                >
                  <span
                    onClick={() => handleLinkClick("/cre-news")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-newspaper me-1" />
                    {!collapsed && "CRE News"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/email-drafting") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/email-drafting")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-envelope-open me-1" />{" "}
                    {!collapsed && "Email Drafting"}
                  </span>
                </li>

                {Gemini == true && (
                  <li
                    className={`nav-item ${isActive("/gemini-chat") ? "active" : ""
                      }`}
                  >
                    <span
                      onClick={() => handleLinkClick("/gemini-chat")}
                      className="nav-link text-white"
                      style={{ cursor: "pointer", fontSize: 12 }}
                    >
                      <i className="bi bi-chat-dots-fill me-1" />
                      {!collapsed && "Gemini"}
                    </span>
                  </li>
                )}

                <li
                  className={`nav-item ${isActive("/notes") ? "active" : ""}`}
                >
                  <span
                    onClick={() => handleLinkClick("/notes")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi-journal me-1" />
                    {!collapsed && "Notes"}
                  </span>
                </li>

                {Forum == true && (
                  <li
                    className={`nav-item ${isActive("/portfolio-forum") ? "active" : ""
                      }`}
                  >
                    <span
                      onClick={() => handleLinkClick("/portfolio-forum")}
                      className="nav-link text-white"
                      style={{ cursor: "pointer", fontSize: 12 }}
                    >
                      <i className="bi bi-chat-square-dots me-1" />

                      {!collapsed && "Portfolio Forum"}
                    </span>
                  </li>
                )}

                <li
                  className={`nav-item ${isActive("/ai-lease-abstract-upload") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/ai-lease-abstract-upload")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-file-earmark-text me-1" />{" "}
                    {!collapsed && "AI Lease Abstract"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/information-collaboration") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() =>
                      handleLinkClick("/information-collaboration")
                    }
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi-people me-1" />
                    {!collapsed && "Information Collaboration"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/benchmark") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/benchmark")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-bar-chart-line me-1"></i>

                    {!collapsed && "DET"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/distilled-comp-tracker") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/distilled-comp-tracker")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-kanban me-1"></i>

                    {!collapsed && "DCT"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/calculator") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/calculator")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi-calculator me-1" />

                    {!collapsed && "Calculator"}
                  </span>
                </li>

                <li
                  className={`nav-item ${isActive("/yardi") ? "active" : ""
                    }`}
                >
                  <span
                    onClick={() => handleLinkClick("/yardi")}
                    className="nav-link text-white"
                    style={{ cursor: "pointer", fontSize: 12 }}
                  >
                    <i className="bi bi-briefcase me-1" />
                    {!collapsed && "Yardi"}
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
                      className={`bi ms-2 ${openMenu === "generalInfo"
                          ? "bi-chevron-down"
                          : "bi-chevron-right"
                        }`}
                    />
                  </li>
                )}

                {openMenu === "generalInfo" && (
                  <ul className="nav flex-column mt-1">
                    <li
                      className={`nav-item ${isActive("/third-party-chat") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/third-party-chat")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-telephone-fill me-1" />
                        {!collapsed && "Third Party Contact Info"}
                      </span>
                    </li>
                    <li
                      className={`nav-item ${isActive("/employee-info-chat") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/employee-info-chat")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-people-fill me-1" />
                        {!collapsed && "Employee Contact Info"}
                      </span>
                    </li>
                    <li
                      className={`nav-item ${isActive("/user-building-info-list") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/user-building-info-list")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-building me-1" />
                        {!collapsed && "Building Info Data"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/comparative-user-building-list") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() =>
                          handleLinkClick("/comparative-user-building-list")
                        }
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-cpu me-1" />
                        {!collapsed && "Comparative Building Data"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/tenent-info-user-building-list") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() =>
                          handleLinkClick("/tenent-info-user-building-list")
                        }
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-chat-left-text me-1" />{" "}
                        {!collapsed && "Tenant Information"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/tenant-market") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/tenant-market")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-people-fill me-1" />{" "}
                        {!collapsed && "Tenants in the Market"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/comps-chat") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/comps-chat")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-bar-chart-line-fill me-1" />{" "}
                        {!collapsed && "Comps"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/user-sublease-tracker-list") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/user-sublease-tracker-list")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi-journal-text me-1" />
                        {!collapsed && "Sublease Tracker"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/user-renewal-tracker-list") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/user-renewal-tracker-list")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-arrow-repeat me-1" />
                        {!collapsed && "Renewal Tracker"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/user-lease-loi-building-list") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/user-lease-loi-building-list")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi-journal-text me-1" />
                        {!collapsed && "Leases Agreement Data & LOI Data"}
                      </span>
                    </li>
                    <li
                      className={`nav-item ${isActive("/tours") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/tours")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-geo-alt me-1" />
                        {!collapsed && "Tours"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/deal-list") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/deal-list")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-kanban me-1"></i>

                        {!collapsed && "Deal Tracker"}
                      </span>
                    </li>
                  </ul>
                )}

                {!collapsed && (
                  <li
                    className="nav-header text-light small mt-3 d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleAccordion("Settings")}
                  >
                    <span>Settings</span>
                    <i
                      className={`bi ms-2 ${openMenu === "Settings"
                          ? "bi-chevron-down"
                          : "bi-chevron-right"
                        }`}
                    />
                  </li>
                )}

                {openMenu === "Settings" && (
                  <>
                    <li
                      className={`nav-item ${isActive("/user-profile") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/user-profile")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-person-circle me-1" />
                        {!collapsed && "Profile"}
                      </span>
                    </li>

                    <li
                      className={`nav-item ${isActive("/history") ? "active" : ""
                        }`}
                    >
                      <span
                        onClick={() => handleLinkClick("/history")}
                        className="nav-link text-white"
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        <i className="bi bi-clock-history me-1" />
                        {!collapsed && "Chat History"}
                      </span>
                    </li>
                  </>
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
            onClick={() => handleLogout(navigate, setCollapsed)}
            className="btn btn-outline-danger w-100"
          >
            <i className="bi bi-box-arrow-right me-1" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      <div className="chat-modify-btn p-3 border-bottom  justify-content-between align-items-center">
        {!collapsed && <span className="mb-0 fs-5">creportfoliopulse</span>}
        {isMobile && (
          <button
            className="btn btn-sm btn-outline-light"
            onClick={toggleSidebar}
          >
            <i
              className={`bi ${collapsed ? "bi-chevron-double-right" : "bi-chevron-double-left"
                }`}
            />
          </button>
        )}
      </div>

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
