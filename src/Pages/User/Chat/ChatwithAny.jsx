import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import { AskQuestion_Specific_API, Delete_Chat_Specific_Session, Delete_Doc_Specific, get_chathistory_Specific_Api, get_Session_List_Specific, get_specific_Doclist_Api, Upload_specific_file_Api } from "../../../Networking/User/APIs/Chat/ChatApi";
import { FaTrash } from "react-icons/fa";


export const ChatWithAnyDoc = () => {
  const dispatch = useDispatch();
  const chatRef = useRef(null);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionList, setsessionList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState(null);



  const fetchDocuments = async () => {
    setIsLoadingDocuments(true);
    try {
      const response = await dispatch(get_specific_Doclist_Api());
      if (response?.payload && Array.isArray(response.payload)) {
        setUploadedFiles(response.payload);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const fetchMessages = async () => {
    setIsLoadingSessions(true);
    try {
      const res = await dispatch(get_Session_List_Specific()).unwrap();
      setsessionList(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    if (sessionList.length > 0 && !selectedChatId) {
      const latestChat = sessionList[0];
      setSelectedChatId(latestChat.session_id);
      setSessionId(latestChat.session_id);
      setMessages([]);
      handleSessionhistory(latestChat.session_id);
    }
  }, [sessionList]);

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

  }, [])

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

    if (!selectedFile?.file_id) {
      toast.error("Missing file information.");
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

      const updatedsessionList = [newChat, ...sessionList];
      setsessionList(updatedsessionList);
      setSessionId(newId);
      setSelectedChatId(newId);
      activeSessionId = newId;
    }

    const payload = {
      question: message,
      file_id: selectedFile.file_id,
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

      const response = await dispatch(AskQuestion_Specific_API(payload)).unwrap();

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
    setIsLoadingMessages(true);
    try {
      const res_chat_his = await dispatch(get_chathistory_Specific_Api(id)).unwrap();
      if (Array.isArray(res_chat_his)) {
        const formattedMessages = res_chat_his.flatMap(chat => [
          { message: chat.question, sender: "User", timestamp: new Date(chat.timestamp) },
          { message: chat.answer, sender: "Admin", timestamp: new Date(chat.timestamp) }
        ]);
        setSessionId(id);
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to get chat history:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) {
      toast.warning("No files selected.");
      return;
    }

    const MAX_FILE_SIZE_MB = 3;
    const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);

    if (oversizedFiles.length > 0) {
      toast.error(`Some files exceed the 3MB size limit. Please upload smaller files.`);
      return;
    }

    try {
      setIsUploading(true);
      const res = await dispatch(
        Upload_specific_file_Api({
          files: selectedFiles,
        })
      ).unwrap();
      await fetchDocuments();
      toast.success(res?.msg || "Documents uploaded successfully!");
    } catch (error) {
      const errorMsg = error?.response?.data?.msg || error?.message || " Upload failed";
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    try {
      setIsDeleting(true); // show overlay
      await dispatch(Delete_Doc_Specific(id)).unwrap();
      await fetchDocuments();
      toast.success("Document deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete document.");
      console.error("Failed to delete document:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingSessionId(id); 
      await dispatch(Delete_Chat_Specific_Session(id)).unwrap();

      await fetchMessages();

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
              const newId = uuidv4();
              const newChat = {
                session_id: newId,
                name: newId,
                created_at: new Date().toISOString(),
              };

              const updatedsessionList = [newChat, ...sessionList];
              setsessionList(updatedsessionList);
              setSessionId(newId);
              setSelectedChatId(newId);
              setMessages([]);
            }}

            style={{ textAlign: "left" }}
          >
            <span className="fw-semibold"> ➕ New Chat</span>
          </button>
          <div className="flex-grow-1 chat-item-wrapper hide-scrollbar overflow-auto">
            {isLoadingSessions ? (
              <div className="text-center py-4">
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "1.5rem", height: "1.5rem" }}
                >
                  <span className="visually-hidden">Loading sessions...</span>
                </div>
                <div className="mt-2 text-muted small">Loading chat sessions...</div>
              </div>
            ) : sessionList.length > 0 ? (
              sessionList.map((chat, index) => (
                <div
                  key={index}
                  className={`chat-item d-flex justify-between align-items-start p-2 rounded mb-2 position-relative ${selectedChatId === chat.session_id
                    ? "bg-dark text-white"
                    : "bg-light text-dark"
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
                    <div className="fw-semibold">
                      {chat.name && chat.name.trim() !== "" ? chat.name : chat.session_id}
                    </div>
                    <div className="small text-muted">
                      {chat.created_at
                        ? new Date(chat.created_at).toLocaleDateString()
                        : "Just now"}
                    </div>
                  </div>
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
                      >
                        <span className="visually-hidden">Deleting...</span>
                      </div>
                    ) : (
                      <i className="bi bi-trash"></i>
                    )}
                  </button>

                </div>
              ))
            ) : (
              <div className="text-muted small text-center mt-3">
                No chat sessions yet.
              </div>
            )}
          </div>
        </div>
        <div className="col-md-9 d-flex flex-column">
          <div
            className="flex-grow-1 overflow-auto p-3 bg-light rounded mb-2 hide-scrollbar"
          >
            <h5 className="text-muted mb-3">💬 Portfolio Voice</h5>
            <div className="message-container hide-scrollbar" ref={chatRef}>
              {isLoadingMessages ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-secondary" role="status"></div>
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
              <h5 className="mb-3">📄  Select Document to Chat</h5>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isDeleting && (
                <div className="upload-overlay">
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                    <div className="upload-text">Deleting document...</div>
                  </div>
                </div>
              )}

              <div className="upload-container hide-scrollbar">
                {isLoadingDocuments ? (
                  <div className="text-center py-3">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    >
                      <span className="visually-hidden">Loading documents...</span>
                    </div>
                  </div>
                ) : isUploading ? (
                  <div className="d-flex align-items-center p-2 mb-2 border rounded bg-light">
                    <div
                      className="spinner-border text-primary me-2"
                      role="status"
                      style={{ width: "1.2rem", height: "1.2rem" }}
                    >
                      <span className="visually-hidden">Uploading document...</span>
                    </div>
                    <span className="fw-semibold">Uploading document...</span>
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
                        className={`border p-2 rounded mb-2 d-flex justify-content-between align-items-center ${selectedFileIndex === index ? "border-primary bg-light" : ""
                          }`}
                        onClick={() => setSelectedFileIndex(index)}
                        style={{ cursor: "pointer" }}
                      >
                        <span>{file.original_file_name || file.name}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDoc(file.file_id);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))
                )}

                {!isLoadingDocuments && !isUploading && uploadedFiles.filter((file) => {
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
              <label htmlFor="file-upload" style={{ cursor: "pointer" }} className="me-2 mb-0">
                <i className="bi bi-paperclip fs-5 text-primary"></i>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                className="d-none"
                onChange={handleFileChange}
                disabled={isUploading}
              />

              <input
                type="text"
                className="form-control me-2"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button
                className="btn btn-primary"
                onClick={handleSendMessage}
                disabled={isSending}
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




