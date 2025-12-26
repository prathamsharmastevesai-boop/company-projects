import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  get_Chat_History,
  get_Session_List_Specific,
} from "../../../Networking/User/APIs/Chat/ChatApi";
import TypingIndicator from "../../../Component/TypingIndicator";
import {
  AskQuestionGeminiAPI,
  DeleteGeneralDocSubmit,
  UploadGeneralDocSubmit,
} from "../../../Networking/Admin/APIs/GeneralinfoApi";
import { Modal } from "react-bootstrap";
import { ListAbstractLeaseDoc } from "../../../Networking/Admin/APIs/AiAbstractLeaseAPi";

export const GeminiChat = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const [sessionId, setSessionId] = useState(location.state?.sessionId || null);
  const [category, setCategory] = useState(location.state?.type);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState(null);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [docs, setDocs] = useState([]);
  const [isDocsLoading, setIsDocsLoading] = useState(false);

  const isLoading = isLoadingSession;

  useEffect(() => {
    if (location.state?.sessionId) {
      setSessionId(location.state.sessionId);
      setSessionReady(true);
      return;
    }

    const fetchLastSession = async () => {
      setIsLoadingSession(true);
      try {
        const res = await dispatch(get_Session_List_Specific()).unwrap();

        const filtered = res.filter(
          (s) => s.category?.toLowerCase() === "gemini"
        );

        if (filtered.length > 0) {
          filtered.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          const latestSession = filtered[0];

          setSessionId(latestSession.session_id);
        } else {
          setSessionId(null);
          setMessages([]);
        }
      } catch (err) {
        setSessionId(null);
        setMessages([]);
      } finally {
        setIsLoadingSession(false);
        setSessionReady(true);
      }
    };

    fetchLastSession();
  }, [dispatch, location.state]);

  useEffect(() => {
    if (!sessionReady || !sessionId) return;

    const fetchChatHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const res = await dispatch(get_Chat_History(sessionId)).unwrap();
        if (Array.isArray(res) && res.length > 0) {
          const formatted = res.flatMap((item) => [
            { sender: "User", message: item.question },
            { sender: "Admin", message: item.answer },
          ]);
          setMessages(formatted);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        setMessages([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchChatHistory();
  }, [sessionReady, sessionId, dispatch]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      } else if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 500);
  };

  useEffect(() => {
    if (!isLoadingHistory) {
      scrollToBottom();
    }
  }, [messages, isReplyLoading, isLoadingHistory]);

  useEffect(() => {
    if (!isLoadingHistory && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    }
  }, [isLoadingHistory, messages.length]);

  const startRecording = async () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      toast.error("Speech Recognition not supported.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!recognitionRef.current) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript);
        };

        recognitionRef.current.onerror = () => {
          toast.error("Voice not recognized. Try again.");
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => setIsRecording(false);
      }

      if (!isRecording) {
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
    } catch {
      toast.error("Microphone not found or access denied.");
    }
  };

  const toggleSpeak = (index, text) => {
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.onend = () => setSpeakingIndex(null);
      utterance.onerror = () => setSpeakingIndex(null);
      setSpeakingIndex(index);
      window.speechSynthesis.speak(utterance);
    }
  };

  const uploadFile = async (file) => {
    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ].includes(file.type)
    ) {
      toast.error("Only PDF, DOCX, XLSX, and CSV files are allowed");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      toast.error("File size must be under 30MB");
      return;
    }

    try {
      setIsUploading(true);

      await dispatch(
        UploadGeneralDocSubmit({
          file,
          sessionId,
          category: "Gemini",
        })
      ).unwrap();

      toast.success("File uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      // toast.error("Upload failed!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) await uploadFile(file);
    e.target.value = null;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return toast.warning("Please enter a message.");

    if (!sessionId) {
      toast.info("Please start a new chat session first.");
      return;
    }

    if (isLoadingHistory) {
      toast.info("Please wait until chat history is loaded.");
      return;
    }

    const userMessage = { message, sender: "User", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      setIsSending(true);
      setIsReplyLoading(true);

      const payload = {
        session_id: sessionId,
        question: userMessage.message,
        category: "Gemini",
      };

      const response = await dispatch(AskQuestionGeminiAPI(payload)).unwrap();

      if (response?.answer) {
        const adminMessage = {
          message: response.answer,
          sender: "Admin",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, adminMessage]);
      } else {
        toast.warning("No response from assistant.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Message failed to send.");
    } finally {
      setIsSending(false);
      setIsChatStarted(true);
      setIsReplyLoading(false);
    }
  };

  const handleNewSession = () => {
    const newId = uuidv4();
    setSessionId(newId);
    setMessages([]);
    setIsChatStarted(false);
  };

  const fetchDocs = async () => {
    try {
      setIsDocsLoading(true);
      const res = await dispatch(
        ListAbstractLeaseDoc({ category: "Gemini" })
      ).unwrap();

      setDocs(res || []);
    } catch {
      toast.error("Failed to fetch documents.");
    } finally {
      setIsDocsLoading(false);
    }
  };

  useEffect(() => {
    if (showDocsModal) fetchDocs();
  }, [showDocsModal]);

  const handleDeleteDoc = async (docId) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      setDeletingDocId(docId);
      await dispatch(
        DeleteGeneralDocSubmit({
          file_id: docId,
          category: "Gemini",
        })
      ).unwrap();

      toast.success("Document deleted.");
      fetchDocs();
    } catch {
      toast.error("Failed to delete document.");
    } finally {
      setDeletingDocId(null);
    }
  };

  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center py-4">
      <div className="spinner-border text-secondary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="ms-2 text-muted">Loading...</span>
    </div>
  );

  return (
    <div className="container-fluid py-3" style={{ height: "100vh" }}>
      <AnimatePresence mode="wait">
        {!isChatStarted && messages.length === 0 ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="d-flex justify-content-center align-items-center h-100"
          >
            <div
              className="p-4 bg-white shadow-sm rounded-4 text-center"
              style={{ width: "100%", maxWidth: 600 }}
            >
              <h5 className="mb-3 text-muted d-flex align-items-center justify-content-between">
                <span className="d-flex align-items-center">
                  <i
                    className="bi bi-stars me-2 text-secondary"
                    style={{ fontSize: "1.3rem" }}
                  ></i>
                  Gemini
                </span>

                <label
                  htmlFor="fileUpload"
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                  style={{ borderRadius: "20px" }}
                >
                  <i className="bi bi-upload me-1"></i> Upload
                </label>

                <input
                  type="file"
                  id="fileUpload"
                  className="d-none"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </h5>

              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="d-flex align-items-end rounded-pill py-2 px-3 bg-light border position-relative">
                    <i
                      className="bi bi-chat-dots-fill text-secondary position-absolute"
                      style={{
                        left: "18px",
                        bottom: "14px",
                        fontSize: "1.1rem",
                      }}
                    ></i>

                    <textarea
                      ref={textareaRef}
                      rows={1}
                      className="form-control flex-grow-1 border-0 shadow-none bg-transparent me-2 ps-4"
                      placeholder="Ask Now, Let's Work..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={isSending}
                    />

                    {message.length > 0 ? (
                      <button
                        className="btn btn-secondary rounded-circle"
                        onClick={handleSendMessage}
                        disabled={isSending}
                        style={{ width: "38px", height: "38px" }}
                      >
                        {isSending ? (
                          <div className="spinner-border spinner-border-sm text-light" />
                        ) : (
                          <i className="bi bi-send-fill"></i>
                        )}
                      </button>
                    ) : (
                      <button
                        className={`btn rounded-circle ${
                          isRecording ? "btn-danger" : "btn-outline-secondary"
                        }`}
                        onClick={startRecording}
                        disabled={isSending}
                        style={{ width: "38px", height: "38px" }}
                      >
                        <i
                          className={`bi ${
                            isRecording ? "bi-mic-mute-fill" : "bi-mic-fill"
                          }`}
                        ></i>
                      </button>
                    )}
                  </div>
                  <div className="mt-3 d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleNewSession}
                      disabled={isLoading}
                    >
                      <i className="bi bi-plus-circle me-1"></i> New Session
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setShowDocsModal(true)}
                    >
                      <i className="bi bi-folder2-open me-1"></i> Documents
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="h-100"
          >
            <div className="row h-100">
              <div className="col-md-12 d-flex flex-column">
                <div className="chat-header d-flex justify-content-between align-items-center mb-2">
                  <div className="mt-3 d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                      onClick={handleNewSession}
                      disabled={isLoading}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      <span className="d-none d-sm-inline">New Session</span>
                    </button>

                    <button
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                      onClick={() => setShowDocsModal(true)}
                    >
                      <i className="bi bi-folder2-open me-1"></i>
                      <span className="d-none d-sm-inline">Documents</span>
                    </button>
                  </div>
                  <h5 className="chat-title text-muted mb-0 d-flex align-items-center">
                    Gemini
                  </h5>
                </div>

                <div
                  ref={chatRef}
                  className="flex-grow-1 overflow-auto p-3 bg-light rounded mb-2 hide-scrollbar"
                >
                  {isLoadingHistory ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="message-container1 hide-scrollbar">
                      {messages.length > 0 ? (
                        <>
                          {messages.map((msg, i) => (
                            <div
                              key={i}
                              className={`mb-2 small ${
                                msg.sender === "Admin"
                                  ? "text-start"
                                  : "text-end"
                              }`}
                            >
                              <div
                                className={`d-inline-block px-3 py-2 position-relative responsive-box ${
                                  msg.sender === "Admin"
                                    ? ""
                                    : "bg-secondary text-light"
                                }`}
                              >
                                {msg.sender === "Admin" ? (
                                  <>
                                    <i
                                      className={`bi ${
                                        speakingIndex === i
                                          ? "bi-volume-up-fill"
                                          : "bi-volume-mute"
                                      } ms-2`}
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "1rem",
                                        color:
                                          speakingIndex === i ? "#000" : "#ccc",
                                        position: "absolute",
                                        right: "8px",
                                        bottom: "18px",
                                      }}
                                      onClick={() =>
                                        toggleSpeak(i, msg.message)
                                      }
                                    ></i>
                                    <div className="py-3">
                                      <ReactMarkdown>
                                        {msg.message}
                                      </ReactMarkdown>
                                    </div>
                                  </>
                                ) : (
                                  msg.message
                                )}
                              </div>
                            </div>
                          ))}

                          {isReplyLoading && <TypingIndicator />}

                          <div ref={messagesEndRef} />
                        </>
                      ) : (
                        <div
                          className="d-flex justify-content-center align-items-center text-muted w-100 text-center"
                          style={{ minHeight: "60vh" }}
                        >
                          No messages yet.
                          {!sessionId &&
                            " Click 'New Session' to start a conversation."}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2 pb-1">
                  <div className="d-flex align-items-end rounded-pill py-2 px-3 bg-white shadow-sm border">
                    {isUploading ? (
                      <div className="spinner-border spinner-border-sm text-secondary m-2" />
                    ) : (
                      <>
                        <label
                          htmlFor="chatFileUpload"
                          className="btn btn-link p-0 me-2 d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                        >
                          <i
                            className="bi bi-upload text-secondary"
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                        </label>

                        <input
                          id="chatFileUpload"
                          type="file"
                          className="d-none"
                          accept=".pdf,.docx,.xlsx,.csv"
                          onChange={handleFileChange}
                          disabled={isUploading}
                        />
                      </>
                    )}

                    <textarea
                      ref={textareaRef}
                      rows={1}
                      className="form-control flex-grow-1 border-0 shadow-none bg-transparent me-2"
                      placeholder="Ask Now, Let's Work..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={isSending || isReplyLoading}
                    />

                    {message.length > 0 ? (
                      <button
                        className="btn btn-secondary rounded-circle"
                        onClick={handleSendMessage}
                        disabled={isSending || isReplyLoading}
                        style={{ width: "38px", height: "38px" }}
                      >
                        {isSending ? (
                          <div className="spinner-border spinner-border-sm text-light" />
                        ) : (
                          <i className="bi bi-send-fill"></i>
                        )}
                      </button>
                    ) : (
                      <button
                        className={`btn rounded-circle ${
                          isRecording ? "btn-danger" : "btn-outline-secondary"
                        }`}
                        onClick={startRecording}
                        disabled={isSending || isReplyLoading}
                        style={{ width: "38px", height: "38px" }}
                      >
                        <i
                          className={`bi ${
                            isRecording ? "bi-mic-mute-fill" : "bi-mic-fill"
                          }`}
                        ></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        show={showDocsModal}
        onHide={() => setShowDocsModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Uploaded Documents</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {isDocsLoading ? (
            <LoadingSpinner />
          ) : !docs || !docs.files || docs.files.length === 0 ? (
            <p className="text-muted text-center">No documents uploaded yet.</p>
          ) : (
            <ul className="list-group">
              {docs.files.map((doc) => (
                <li
                  key={doc.file_id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    <i className="bi bi-file-earmark-text me-2"></i>
                    {doc.original_file_name}
                  </span>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteDoc(doc.file_id)}
                      disabled={deletingDocId === doc.file_id}
                    >
                      {deletingDocId === doc.file_id ? (
                        <div className="spinner-border spinner-border-sm text-danger" />
                      ) : (
                        <i className="bi bi-trash"></i>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};
