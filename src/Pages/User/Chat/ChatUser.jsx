import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import {
  getlist_his_oldApi,
  get_chathistory_Api,
  Delete_Chat_Session,
} from "../../../Networking/User/APIs/Chat/ChatApi";
import { AskQuestionAPI } from "../../../Networking/Admin/APIs/UploadDocApi";

export const UserChat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const textareaRef = useRef(null);
  const { sessionId: incomingSessionId = null, type, Building_id } = location.state || {};

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const chatRef = useRef(null);

  const fetchMessages = async () => {
    setLoadingSessions(true);
    try {
      const res = await dispatch(getlist_his_oldApi()).unwrap();
      setChatList(res);

      const filtered = type ? res.filter((chat) => chat.category === type) : res;

      if (incomingSessionId) {
        setSelectedChatId(incomingSessionId);
        setSessionId(incomingSessionId);
        await handleSessionHistory(incomingSessionId);
      } else if (filtered.length > 0) {
        const latestChat = filtered[0];
        setSelectedChatId(latestChat.session_id);
        setSessionId(latestChat.session_id);
        await handleSessionHistory(latestChat.session_id);
      } else {
        const newId = uuidv4();
        const newChat = {
          session_id: newId,
          name: newId,
          created_at: new Date().toISOString(),
          category: type,
        };
        setChatList([newChat]);
        setSessionId(newId);
        setSelectedChatId(newId);
        setMessages([]);
      }
    } catch (e) {
      console.error("Fetch messages failed:", e);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [incomingSessionId]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return toast.warning("Please enter a message.");

    let activeSessionId = sessionId;

    if (!activeSessionId) {
      const newId = uuidv4();
      const newChat = {
        session_id: newId,
        name: newId,
        created_at: new Date().toISOString(),
        title: message,
        category: type,
      };
      setChatList((prev) => [newChat, ...prev]);
      setSessionId(newId);
      setSelectedChatId(newId);
      activeSessionId = newId;
    } else {
      setChatList((prev) =>
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

    try {
      setIsSending(true);
      const payload = {
        question: message,
        building_id: Building_id,
        category: type,
        session_id: activeSessionId,
      };

      const response = await dispatch(AskQuestionAPI(payload)).unwrap();

      if (response?.answer) {
        if (Array.isArray(response.answer)) {
          const newMsgs = response.answer.map((ans) => ({
            message: ans.answer,
            file: ans.file || null,
            sender: "Admin",
            timestamp: new Date(),
          }));
          setMessages((prev) => [...prev, ...newMsgs]);
        } else {
          const adminMessage = {
            message: response.answer,
            file: response.answer.file || null,
            sender: "Admin",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, adminMessage]);
        }
      }
    } catch (e) {
      console.error("Send message failed:", e);
    } finally {
      setIsSending(false);
    }
  };


  const handleSessionHistory = async (id) => {
    setLoadingMessages(true);
    try {
      const res = await dispatch(get_chathistory_Api(id)).unwrap();
      if (Array.isArray(res)) {
        const formatted = res.flatMap((chat) => {
          const msgs = [
            { message: chat.question, sender: "User", timestamp: new Date(chat.timestamp), file: chat.file },
          ];

          if (Array.isArray(chat.answers)) {
            chat.answers.forEach((ans) =>
              msgs.push({
                message: ans.answer,
                sender: "Admin",
                timestamp: new Date(ans.timestamp || chat.timestamp),
                file: ans.file || null,
              })
            );
          } else if (chat.answer) {
            msgs.push({
              message: chat.answer,
              sender: "Admin",
              timestamp: new Date(chat.timestamp),
              file: chat.file || null,
            });
          }
          return msgs;
        });
        setMessages(formatted);
        setSessionId(id);
      }
    } catch (e) {
      console.error("Failed to get chat history:", e);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(Delete_Chat_Session(id)).unwrap();
      await fetchMessages();
      if (selectedChatId === id) {
        setSelectedChatId(null);
        setSessionId(null);
        setMessages([]);
      }
    } catch (e) {
      console.error("Error deleting chat session:", e);
    }
  };

  return (
    <div className="container-fluid py-3" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-md-3 border-end bg-light d-flex flex-column p-3">
          <button
            className="btn btn-light d-flex align-items-center justify-content-start gap-2 w-100 mb-3 border"
            onClick={() => {
              // Prevent creating new session if current one is empty
              const hasMessages = messages.length > 0;
              const currentChat = chatList.find((chat) => chat.session_id === selectedChatId);

              if (!hasMessages && !currentChat?.title) {
                toast.info("Please send a message in this chat before starting a new one.");
                return;
              }

              const newId = uuidv4();
              const newChat = {
                session_id: newId,
                name: newId,
                created_at: new Date().toISOString(),
                category: type || "general",
              };

              setChatList((prev) => [newChat, ...prev]);
              setSessionId(newId);
              setSelectedChatId(newId);
              setMessages([]);
            }}
          >
            <span className="fw-semibold">➕ New Chat</span>
          </button>


          <div className="flex-grow-1 chat-item-wrapper overflow-auto hide-scrollbar">
            {loadingSessions ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : chatList?.length > 0 ? (
              chatList
                .filter((chat) => chat.category === type)
                .map((chat) => (
                  <div
                    key={chat.session_id}
                    className={`chat-item d-flex justify-content-between align-items-start p-2 ${selectedChatId === chat.session_id
                      ? "bg-dark text-white"
                      : "bg-light text-dark"
                      } border`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedChatId(chat.session_id);
                      setSessionId(chat.session_id);
                      handleSessionHistory(chat.session_id);
                    }}
                  >
                    <div className="flex-grow-1">
                      <div className="fw-semibold">
                        {chat?.title ? `${chat.title.substring(0, 10)}...` : `${chat.session_id.substring(0, 10)}...`}
                      </div>
                      <div
                        className={`small ${selectedChatId === chat.session_id ? "text-white" : "text-muted"
                          }`}
                      >
                        {chat.created_at
                          ? new Date(chat.created_at).toLocaleDateString()
                          : "Just now"}
                      </div>

                    </div>
                    {!isSending &&
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(chat.session_id);
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    }
                  </div>
                ))
            ) : (
              <div className="text-muted small text-center mt-3">No chat sessions yet.</div>
            )}
          </div>
        </div>

        <div className="col-md-9 d-flex flex-column">
          <div className="flex-grow-1 overflow-auto p-3 bg-light rounded mb-2 hide-scrollbar">
            <h5 className="text-muted mb-3">💬 Chat With  {type == "Lease" ? "Lease Agreement" : "Letter of Intent"}
            </h5>
            <div className="message-container1 hide-scrollbar" ref={chatRef}>
              {loadingMessages ? (
                <div className="text-center py-3">
                  <div className="spinner-border text-secondary"></div>
                </div>
              ) : messages?.length > 0 ? (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`mb-2 small ${msg.sender === "Admin" ? "text-start" : "text-end"}`}
                  >
                    <div
                      className={`d-inline-block px-3 py-2 rounded ${msg.sender === "Admin" ? "bg-secondary text-white" : "bg-primary text-white"
                        }`}
                    >
                      {msg.message}
                      {msg.file && (
                        <div>
                          <a
                            href={msg.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-warning small"
                          >
                            📎 View File
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="text-muted fst-italic mt-1" style={{ fontSize: "0.75rem" }}>
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
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
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
