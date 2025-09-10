import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  Delete_Chat_Specific_Session,
  get_chathistory_Specific_Api,
  get_Session_List_Specific,
  AskQuestion_Specific_API,
} from "../../../Networking/User/APIs/Chat/ChatApi";

export const ChatWithAnyDoc = () => {
  const dispatch = useDispatch();
  const chatRef = useRef(null);
  const location = useLocation();
  const textareaRef = useRef(null);
  const incomingSessionId = location.state?.sessionId || null;

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionList, setSessionList] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [deletingSessionId, setDeletingSessionId] = useState(null);

  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const res = await dispatch(get_Session_List_Specific()).unwrap();
      setSessionList(res);

      const portfolioSessions = res.filter((chat) => chat.category === "portfolio");

      if (portfolioSessions.length > 0) {
        const latestChat = portfolioSessions[0];
        setSelectedChatId(latestChat.session_id);
        setSessionId(latestChat.session_id);
        await fetchChatHistory(latestChat.session_id);
      } else if (incomingSessionId) {
        setSelectedChatId(incomingSessionId);
        setSessionId(incomingSessionId);
        await fetchChatHistory(incomingSessionId);
      } else {
        const newId = uuidv4();
        const newChat = {
          session_id: newId,
          name: newId,
          category: "portfolio",
          created_at: new Date().toISOString(),
        };
        setSessionList((prev) => [newChat, ...prev]);
        setSessionId(newId);
        setSelectedChatId(newId);
        setMessages([]);
      }

      return res;
    } catch (error) {
      console.error("Fetch sessions failed:", error);
      return [];
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [incomingSessionId]);

  const fetchChatHistory = async (id) => {
    setIsLoadingMessages(true);
    try {
      const res = await dispatch(get_chathistory_Specific_Api(id)).unwrap();
      if (Array.isArray(res)) {
        const formattedMessages = res.flatMap((chat) => {
          const msgs = [
            { message: chat.question, sender: "User", timestamp: new Date(chat.timestamp) },
          ];
          if (Array.isArray(chat.answers)) {
            chat.answers.forEach((ans) =>
              msgs.push({ message: ans.answer, sender: "Admin", timestamp: new Date(chat.timestamp) })
            );
          } else if (chat.answer) {
            msgs.push({ message: chat.answer, sender: "Admin", timestamp: new Date(chat.timestamp) });
          }
          return msgs;
        });
        setMessages(formattedMessages);
        setSessionId(id);
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const scrollToBottom = () => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.warning("Please enter a message.");
      return;
    }

    let activeSessionId = sessionId;
    if (!activeSessionId) {
      const newId = uuidv4();
      const newChat = {
        session_id: newId,
        name: newId,
        category: "portfolio",
        created_at: new Date().toISOString(),
        title: message,
      };
      setSessionList((prev) => [newChat, ...prev]);
      setSessionId(newId);
      setSelectedChatId(newId);
      activeSessionId = newId;
    } else {
      setSessionList((prev) =>
        prev.map((chat) =>
          chat.session_id === activeSessionId && !chat.title
            ? { ...chat, title: message }
            : chat
        )
      );
    }

    const userMessage = { message, sender: "User", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    scrollToBottom();

    try {
      setIsSending(true);
      const payload = {
        session_id: activeSessionId,
        question: message,
        category: "portfolio",
      };
      const response = await dispatch(AskQuestion_Specific_API(payload)).unwrap();

      if (response?.answer) {
        const adminMessage = {
          message: response.answer,
          sender: "Admin",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, adminMessage]);
      }

      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingSessionId(id);
      await dispatch(Delete_Chat_Specific_Session(id)).unwrap();
      await fetchSessions();

      if (selectedChatId === id) {
        setSelectedChatId(null);
        setSessionId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting chat session:", error);
    } finally {
      setDeletingSessionId(null);
    }
  };

  return (
    <div className="container-fluid py-3" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-md-3 border-end bg-light d-flex flex-column p-3">
          <button
            className="btn btn-light d-flex align-items-center justify-content-start gap-2 w-100 mb-3 border"
            onClick={() => {
              const hasMessages = messages.length > 0;

              if (!hasMessages) {
                toast.info("Please send a message in this chat before creating a new one.");
                return;
              }

              const newId = uuidv4();
              const newChat = {
                session_id: newId,
                name: newId,
                category: "portfolio",
                created_at: new Date().toISOString(),
              };
              setSessionList((prev) => [newChat, ...prev]);
              setSessionId(newId);
              setSelectedChatId(newId);
              setMessages([]);
            }}
          >
            <span className="fw-semibold"> ➕ New Chat</span>
          </button>

          <div className="flex-grow-1 chat-item-wrapper hide-scrollbar overflow-auto">
            {isLoadingSessions ? (
              <div className="text-center py-4">
                <div
                  className="spinner-border text-primary"
                  style={{ width: "1.5rem", height: "1.5rem" }}
                  role="status"
                ></div>
                <div className="mt-2 text-muted small">
                  Loading chat sessions...
                </div>
              </div>
            ) : sessionList?.length > 0 ? (
              sessionList
                ?.filter((chat) => chat?.category === "portfolio")
                .map((chat) => (
                  <div
                    key={chat.session_id}
                    className={`chat-item d-flex justify-between align-items-start p-2 ${selectedChatId === chat.session_id
                      ? "bg-dark text-white"
                      : "bg-light text-dark"
                      } border`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedChatId(chat.session_id);
                      setSessionId(chat.session_id);
                      fetchChatHistory(chat.session_id);
                    }}
                  >
                    <div className="flex-grow-1">
                      <div className="fw-semibold">
                        {chat?.title
                          ? `${chat.title.substring(0, 10)}...`
                          : `${chat.session_id.substring(0, 10)}...`}
                      </div>
                      <div
                        className={`small ${selectedChatId === chat.session_id
                          ? "text-white"
                          : "text-muted"
                          }`}
                      >
                        {chat.created_at
                          ? new Date(chat.created_at).toLocaleDateString()
                          : "Just now"}
                      </div>
                    </div>
                    {!isSending &&
                      <button
                        className="btn btn-sm btn-outline-danger delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(chat.session_id);
                        }}
                        disabled={deletingSessionId === chat.session_id}
                      >
                        {deletingSessionId === chat.session_id ? (
                          <div
                            className="spinner-border spinner-border-sm text-danger"
                            role="status"
                          />
                        ) : (
                          <i className="bi bi-trash"></i>
                        )}
                      </button>
                    }
                  </div>
                ))
            ) : (
              <div className="text-muted small text-center mt-3">
                No chat sessions yet.
              </div>
            )}
          </div>
        </div>

        {/* Right: messages */}
        <div className="col-md-9 d-flex flex-column">
          <div className="flex-grow-1 overflow-auto p-3 bg-light rounded mb-2 hide-scrollbar">
            <h5 className="text-muted mb-3">💬 Portfolio Voice</h5>
            <div className="message-container1 hide-scrollbar" ref={chatRef}>
              {isLoadingMessages ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-secondary" role="status"></div>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`mb-2 small ${msg.sender === "Admin" ? "text-start" : "text-end"
                      }`}
                  >
                    <div
                      className={`d-inline-block px-3 py-2 rounded ${msg.sender === "Admin"
                        ? "bg-secondary text-white"
                        : "bg-primary text-white"
                        }`}
                    >
                      {msg.message}
                    </div>
                    <div
                      className="text-muted fst-italic mt-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted">No messages yet.</div>
              )}
              {isSending && (
                <div className="text-start small mt-2">
                  <div className="d-inline-block px-3 py-2 rounded bg-secondary text-white">
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Admin is typing...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
           <div className="d-flex align-items-center border rounded p-2 bg-white">
             <textarea
  ref={textareaRef}
  rows={1}
  className="form-control me-2"
  placeholder="Type a message..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    const isComposing = e.nativeEvent && e.nativeEvent.isComposing;

    if (e.key === "Enter" && !isComposing) {
      if (e.shiftKey) {
        // insert a single newline manually
        e.preventDefault();
        const { selectionStart, selectionEnd } = e.target;
        const newValue =
          message.substring(0, selectionStart) +
          "\n" +
          message.substring(selectionEnd);

        setMessage(newValue);

        // move cursor after newline
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
        }, 0);
      } else {
        // normal Enter → send
        e.preventDefault();
        if (!isSending) handleSendMessage();
      }
    }
  }}
  style={{  overflow: "hidden",}}
  disabled={isSending}
/>


              <button
                className="btn btn-primary"
                onClick={handleSendMessage}
                disabled={isSending}
                aria-label="Send message"
              >
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
