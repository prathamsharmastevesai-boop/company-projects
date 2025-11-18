import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  get_Session_List_Specific,
  Delete_Chat_Session,
  get_Chat_History,
} from "../../../Networking/User/APIs/Chat/ChatApi";
import { toast } from "react-toastify";

export const SessionList = ({ setShowSessionModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sessionList, setSessionList] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isDeleting, setIsDeleting] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const res = await dispatch(get_Session_List_Specific()).unwrap();
      setSessionList(res);
      setFilteredSessions(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    let filtered = sessionList;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (session) =>
          session.category &&
          session.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (session) =>
          session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSessions(filtered);
  }, [searchTerm, selectedCategory, sessionList]);

  const handleDeleteSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;

    try {
      setIsDeleting((prev) => ({ ...prev, [id]: true }));
      await dispatch(Delete_Chat_Session(id)).unwrap();
      toast.success("Session deleted successfully!");
      setSessionList((prev) => prev.filter((s) => s.session_id !== id));
    } catch (error) {
      console.error("Failed to delete session:", error);
      toast.error("Failed to delete session");
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSelect = async (session) => {
    setSelectedChatId(session.session_id);
    setSessionId(session.session_id);
    if (setShowSessionModal) setShowSessionModal(false);

    switch (session.category) {
      case "ThirdParty":
        navigate("/ThirdPartychat", {
          state: { sessionId: session.session_id, type: session.category },
        });
        break;
      case "Colleague":
        navigate("/ColleagueChat", {
          state: { sessionId: session.session_id, type: session.category },
        });
        break;
      case "ComparativeBuilding":
        navigate("/ComparativeBuildingChat", {
          state: { sessionId: session.session_id, type: session.category },
        });
        break;
      case "TenantInformation":
        navigate("/TenantInformationChat", {
          state: { sessionId: session.session_id, type: session.category },
        });
        break;
      case "TenantMarket":
        navigate("/TenantMarket", {
          state: { sessionId: session.session_id, type: session.category },
        });
        break;
      case "Comps":
        navigate("/CompsChat", {
          state: { sessionId: session.session_id, type: session.category },
        });
        break;
      case "Gemini":
        navigate("/geminichat", {
          state: { sessionId: session.session_id, type: session.category },
        });
        break;
      case "Building":
        navigate("/BuildingChat", {
          state: { sessionId: session.session_id, type: session.category },
        });
        break;
      case "report_generation":
        navigate("/ReportChat", {
          state: { sessionId: session.session_id, type: session.category },
        });
        break;

      case "portfolio":
        navigate("/ChatWithAnyDoc", {
          state: { sessionId: session.session_id, type: session.category },
        });
        break;
      case "Lease":
      case "LOI":
        navigate("/UserChat", {
          state: {
            sessionId: session.session_id,
            type: session.category,
            Building_id: session.building_id,
          },
        });
        break;
      default:
        console.warn("Unknown category:", session.category);
    }
  };

  const getCategoryStyle = (category) => {
    return "badge bg-dark text-white";
  };

  const uniqueCategories = [
    "All",
    ...new Set(sessionList.map((s) => s.category)),
  ];

  return (
    <>
      <div
        className="header-bg {
-bg d-flex justify-content-start px-3 align-items-center sticky-header"
      >
        <h5 className="mb-0 text-light">Chat History</h5>
      </div>
      <div
        className="p-3 position-relative"
        style={{ maxWidth: "100%", minHeight: "100vh" }}
      >
        {isLoadingSessions && (
          <div
            className="d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 10 }}
          >
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-2">
          <select
            className="form-select form-select-sm w-100 w-md-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ maxWidth: 200 }}
          >
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 250 }}
          />
        </div>

        {!isLoadingSessions && (
          <>
            {filteredSessions && filteredSessions.length > 0 ? (
              <div
                className="list-group hide-scrollbar"
                style={{ overflowY: "auto" }}
              >
                {filteredSessions.map((session) => (
                  <div
                    key={session.session_id}
                    className={`d-flex align-items-center justify-content-between 
                  flex-wrap border rounded-3 mb-2 shadow-sm
                  ${
                    selectedChatId === session.session_id
                      ? "bg-dark text-white"
                      : "bg-light text-dark"
                  }`}
                    style={{
                      padding: "10px 12px",
                      transition: "all 0.2s ease-in-out",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSelect(session)}
                  >
                    <div className="d-flex align-items-center flex-grow-1 col-12 col-sm-5 mb-2 mb-sm-0">
                      <span
                        className="text-truncate"
                        style={{
                          maxWidth: "100%",
                          fontWeight: "500",
                          fontSize: "0.95rem",
                        }}
                      >
                        {session.title ||
                          `Session ${session.session_id.slice(0, 8)}`}
                      </span>
                    </div>

                    <div className="col-6 d-flex align-items-center justify-content-around col-sm-3 text-end">
                      <div className="text-start text-sm-center mb-2 mb-sm-0">
                        <span
                          className={getCategoryStyle(session.category)}
                          style={{
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {session.category}
                        </span>
                      </div>
                      <button
                        className={`btn btn-sm ${
                          selectedChatId === session.session_id
                            ? "btn-outline-light"
                            : "btn-outline-dark"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.session_id);
                        }}
                        disabled={isDeleting[session.session_id]}
                      >
                        {isDeleting[session.session_id] ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          ></span>
                        ) : (
                          <i className="bi bi-trash"></i>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="d-flex flex-column justify-content-center align-items-center text-center mt-5"
                style={{ opacity: 0.8 }}
              >
                <i
                  className="bi bi-inbox text-secondary mb-3"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h6 className="text-muted">No sessions available</h6>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
