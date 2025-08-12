import { useEffect, useRef, useState } from "react";
import {
  AskQuestionAPI,
  ListDocSubmit,
} from "../../../Networking/Admin/APIs/UploadDocApi";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import { Delete_Chat_Session, get_chathistory_Api, getlist_his_oldApi } from "../../../Networking/User/APIs/Chat/ChatApi";


export const UserChat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const initialBuildings = location.state?.office;

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const fileInputRef = useRef();
  const chatRef = useRef(null);

  const fetchDocuments = async () => {
    if (!initialBuildings?.Building_id || !initialBuildings?.lease?.lease_id) return;

    setLoadingDocs(true);
    try {
      const listdata = {
        building_id: initialBuildings.Building_id,
        lease_id: initialBuildings.lease.lease_id,
      };
      const response = await dispatch(ListDocSubmit(listdata));
      if (response?.payload?.files && Array.isArray(response.payload.files)) {
        setUploadedFiles(response.payload.files);
      }
    } finally {
      setLoadingDocs(false);
    }
  };

  const fetchMessages = async () => {
    if (!initialBuildings?.Building_id || !initialBuildings.lease.lease_id) return;

    setLoadingSessions(true);
    try {
      const res = await dispatch(getlist_his_oldApi()).unwrap();
      setChatList(res);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    if (chatList.length > 0 && !selectedChatId) {
      const latestChat = chatList[0];
      setSelectedChatId(latestChat.session_id);
      setSessionId(latestChat.session_id);
      setMessages([]);
      handleSessionhistory(latestChat.session_id);
    }
  }, [chatList]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchMessages();
  }, [initialBuildings])

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.warning("Please enter a message.");
      return;
    }

    if (selectedFileIndex === null) {
      toast.warning("Please select a document.");
      return;
    }

    const selectedFile = uploadedFiles[selectedFileIndex];
    const buildingId = initialBuildings?.Building_id;
    const lease_id = initialBuildings?.lease?.lease_id;

    if (!selectedFile?.file_id || !buildingId || !lease_id) {
      toast.error("Missing file or location info.");
      return;
    }

    let activeSessionId = sessionId;
    if (!activeSessionId) {
      const newId = uuidv4();
      const newChat = {
        session_id: newId,
        name: newId,
        created_at: new Date().toISOString(),
      };

      const updatedChatList = [newChat, ...chatList];
      setChatList(updatedChatList);
      setSessionId(newId);
      setSelectedChatId(newId);
      activeSessionId = newId;
    }

    const payload = {
      question: message,
      file_id: selectedFile.file_id,
      building_id: buildingId,
      lease_id: lease_id,
      session_id: activeSessionId,
    };

    const userMessage = {
      message,
      sender: "User",
      timestamp: new Date(),
    };

    try {
      setIsSending(true);
      setMessages((prev) => [...prev, userMessage]);
      setMessage("");
      scrollToBottom();

      const response = await dispatch(AskQuestionAPI(payload)).unwrap();

      const adminMessage = {
        message: response.answer,
        sender: "Admin",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, adminMessage]);
      scrollToBottom();
    } catch (error) {
      toast.error("Send message failed.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSessionhistory = async (id) => {
    setLoadingMessages(true);
    try {
      const res_chat_his = await dispatch(get_chathistory_Api(id)).unwrap();
      if (Array.isArray(res_chat_his)) {
        const formattedMessages = res_chat_his.flatMap(chat => [
          { message: chat.question, sender: "User", timestamp: new Date(chat.timestamp) },
          { message: chat.answer, sender: "Admin", timestamp: new Date(chat.timestamp) }
        ]);
        setSessionId(id);
        setMessages(formattedMessages);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to get chat history:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

const handleDelete = async (id) => {
  try {
    await dispatch(Delete_Chat_Session(id)).unwrap();

    // Refresh documents and chat sessions after deletion:
    await fetchDocuments();
    await fetchMessages();
    
    // Optionally, reset selected chat if the deleted one was selected
    if (selectedChatId === id) {
      setSelectedChatId(null);
      setSessionId(null);
      setMessages([]);
    }
  } catch (error) {
    console.error("Error deleting chat session:", error);
  }
};


  return (
    <div className="container-fluid py-3" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-md-3 border-end bg-light d-flex flex-column p-3">
          <button
            className="btn btn-light d-flex align-items-center justify-content-start gap-2 w-100 mb-3 border"
            onClick={() => {
              const newId = uuidv4();
              const newChat = {
                session_id: newId,
                name: newId,
                created_at: new Date().toISOString(),
              };

              const updatedChatList = [newChat, ...chatList];
              setChatList(updatedChatList);
              setSessionId(newId);
              setSelectedChatId(newId);
              setMessages([]);
            }}

            style={{ textAlign: "left" }}
          >
            <span className="fw-semibold"> ➕ New Chat</span>
          </button>
          <div className="flex-grow-1 chat-item-wrapper hide-scrollbar overflow-auto">
            {loadingSessions ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : (
              chatList.map((chat, index) => (
                <div
                  key={index}
                  className={`chat-item d-flex justify-between align-items-start p-2 rounded mb-2 position-relative ${selectedChatId === chat.session_id ? "bg-dark text-white" : "bg-light text-dark"
                    } border`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleSessionhistory(chat.session_id);
                    setSelectedChatId(chat.session_id);
                    setSessionId(chat.session_id);
                    setMessages([]);
                  }}
                >
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{chat.name || chat.session_id}</div>
                    <div className="small">
                      {chat.created_at ? chat.created_at.split("T")[0] : "Just now"}
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(chat.session_id);
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

        <div className="col-md-9 d-flex flex-column">
          <div

            className="flex-grow-1 overflow-auto p-3 bg-light rounded mb-2 hide-scrollbar"
          >
            <h5 className="text-muted mb-3">💬 Chat Messages</h5>
            <div className="message-container hide-scrollbar" ref={chatRef} >
              {loadingMessages ? (
                <div className="text-center py-3">
                  <div className="spinner-border text-secondary"></div>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg, i) => (
                  <div key={i} className={`mb-2 small ${msg.sender === "Admin" ? "text-start" : "text-end"}`}>
                    <div
                      className={`d-inline-block px-3 py-2 rounded ${msg.sender === "Admin" ? "bg-secondary text-white" : "bg-primary text-white"}`}
                    >
                      {msg.message}
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
            <div className="overflow-auto mb-2 p-2 bg-white border rounded">
              <h5 className="mb-3">📄 Select Document to Chat</h5>

              {/* Search input */}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="upload-container hide-scrollbar">
                {loadingDocs ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-primary"></div>
                  </div>
                ) : (
                  uploadedFiles
                    .filter((file) => {
                      const name = (file.original_file_name || file.name || "").toLowerCase();
                      return name.includes(searchTerm.toLowerCase());
                    })
                    .map((file, index) => (
                      <div
                        key={index}
                        className={`border p-2 rounded mb-2 ${selectedFileIndex === index ? "border-primary bg-light" : ""
                          }`}
                        onClick={() => setSelectedFileIndex(index)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{file.original_file_name || file.name}</span>
                        </div>
                      </div>
                    ))
                )}
                {!loadingDocs && uploadedFiles.filter((file) => {
                  const name = (file.original_file_name || file.name || "").toLowerCase();
                  return name.includes(searchTerm.toLowerCase());
                }).length === 0 && (
                    <div className="text-muted">No documents found.</div>
                  )}
              </div>
            </div>

            {selectedFileIndex !== null && uploadedFiles[selectedFileIndex] && (
              <div className="alert alert-secondary d-flex justify-content-between align-items-center p-2 mb-2">
                <div>{uploadedFiles[selectedFileIndex].original_file_name || uploadedFiles[selectedFileIndex].name}</div>
                <i
                  className="bi bi-x-circle me-1"
                  onClick={() => setSelectedFileIndex(null)}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
            )}

            <div className="d-flex align-items-center border rounded p-2 bg-white">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleSendMessage}>
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};


