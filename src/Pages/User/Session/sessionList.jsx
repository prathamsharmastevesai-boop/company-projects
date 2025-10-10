import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { get_Session_List_Specific } from "../../../Networking/User/APIs/Chat/ChatApi";

export const SessionList = ({ setShowSessionModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sessionList, setSessionList] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const res = await dispatch(get_Session_List_Specific()).unwrap();
      setSessionList(res);

      if (!selectedChatId && res.length > 0) {
        const latestChat = res[0];
        setSelectedChatId(latestChat.session_id);
        setSessionId(latestChat.session_id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSelect = async (session) => {
    setSelectedChatId(session.session_id);
    setSessionId(session.session_id);
    await fetchChatHistory(session.session_id);

    if (setShowSessionModal) setShowSessionModal(false);

    switch (session.category) {
      case "Broker":
        navigate("/BrokerChat", {
          state: { sessionId: session.session_id, type: session.category },
        });
        break;
      case "Colleague":
        navigate("/ColleagueChat", {
          state: { sessionId: session.session_id, type: session.category },
        });
        break;
      case "Building":
        navigate("/BuildingChat", {
          state: { sessionId: session.session_id, type: session.category },
        });
        break;
      case "Market":
        navigate("/CompsChat", {
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
    switch (category) {
      case "Broker":
      case "Colleague":
      case "Building":
      case "Market":
        return "badge bg-dark text-white";
      default:
        return "badge bg-dark text-white";
    }
  };

  return (
    <div className="p-2" style={{ maxWidth: "100%" }}>
      {isLoadingSessions ? (
        <p className="text-center text-light">Loading sessions...</p>
      ) : sessionList && sessionList.length > 0 ? (
        <div
          className="list-group hide-scrollbar"
          style={{ maxHeight: "40vh", overflowY: "auto" }}
        >
          {sessionList.map((session) => (
            <button
              key={session.session_id}
              onClick={() => handleSelect(session)}
              className={`list-group-item d-flex justify-content-between align-items-center mb-2 border-0 rounded-2 ${
                selectedChatId === session.session_id
                  ? "bg-dark text-white shadow-sm"
                  : "bg-light text-dark"
              }`}
              style={{
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
              }}
            >
              <span className="text-truncate me-2" style={{ maxWidth: "70%" }}>
                {session.title || `Session ${session.session_id.slice(0, 8)}`}
              </span>
              <span className={getCategoryStyle(session.category)}>
                {session.category}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-light text-center">No sessions available</p>
      )}
    </div>
  );
};
