import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import {
  AskQuestionGeneralAPI,
  AskQuestionReportAPI,
} from "../Networking/Admin/APIs/GeneralinfoApi";
import {
  get_Chat_History,
  get_Session_List_Specific,
} from "../Networking/User/APIs/Chat/ChatApi";
import TypingIndicator from "./TypingIndicator";

export const ChatWindow = ({ category: propCategory, heading, fileId }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const chatRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const { fileName, fileUrl } = location.state || {};

  const [category, setCategory] = useState(
    location.state?.type || propCategory
  );

  console.log(category, "category");

  const [sessionId, setSessionId] = useState(location.state?.sessionId || null);

  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  const isLoading = isLoadingSession || isLoadingHistory;

  useEffect(() => {
    const fetchLastSession = async () => {
      setIsLoadingSession(true);
      setIsLoadingHistory(true);

      try {
        const res = await dispatch(get_Session_List_Specific()).unwrap();

        let sessionToUse = null;

        if (Array.isArray(res) && res.length > 0) {
          // Filter by category
          const filtered = res.filter(
            (s) => s.category?.toLowerCase() === category?.toLowerCase()
          );

          if (filtered.length > 0) {
            sessionToUse = filtered[filtered.length - 1].session_id;
          }
        }

        // ⭐ If still no session, auto-create one
        if (!sessionToUse) {
          const newAutoId = uuidv4();
          setSessionId(newAutoId);
          setMessages([]);
          return; // no need to load any history
        }

        // If previous session exists
        setSessionId(sessionToUse);
      } catch (err) {
        console.error("Failed to fetch session list:", err);

        // Auto create session even if API call failed
        const fallbackId = uuidv4();
        setSessionId(fallbackId);
        setMessages([]);
      } finally {
        setIsLoadingSession(false);
        // allow history loader to proceed to fetch or skip
      }
    };

    fetchLastSession();
  }, [category, dispatch]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!sessionId) {
        setMessages([]);
        setIsLoadingHistory(false);
        return;
      }

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
  }, [sessionId, dispatch]);

  const scrollToBottom = () => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };
  useEffect(() => scrollToBottom(), [messages]);

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
      setSpeakingIndex(index);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return toast.warning("Please enter a message.");

    const userMessage = { message, sender: "User", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    scrollToBottom();

    try {
      setIsSending(true);
      setIsReplyLoading(true);

      const payload = {
        session_id: sessionId,
        question: userMessage.message,
        category,
        file_id: fileId,
      };

      let response;

      if (category === "report_generation") {
        response = await dispatch(AskQuestionReportAPI(payload)).unwrap();
      } else {
        response = await dispatch(AskQuestionGeneralAPI(payload)).unwrap();
      }

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

      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Message failed to send.");
    } finally {
      setIsSending(false);
      setIsReplyLoading(false);
    }
  };

  const handleNewSession = () => {
    const newId = uuidv4();
    setSessionId(newId);
    setMessages([]);
    toast.info(`Started a new chat session for "${category}".`);
  };

  return (
    <div className="container-fluid py-3" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-md-12 d-flex flex-column">
          <div className="chat-header d-flex justify-content-between align-items-center mb-2 position-relative flex-wrap">
            {/* <div className="d-flex align-items-center position-relative"> */}
            <button
              className="btn btn-outline-secondary btn-sm position-relative d-flex align-items-center ms-4  ms-md-0"
              onClick={handleNewSession}
              disabled={isLoadingSession}
            >
              <i className="bi bi-plus-circle"></i>
              <span className="d-none d-md-inline ms-1">New Session</span>
            </button>
            <h5 className="chat-title text-muted mb-0 text-center">
              {heading}
            </h5>
            {/* </div> */}
          </div>

          <div className="flex-grow-1 overflow-auto p-3 bg-light rounded mb-2 hide-scrollbar">
            {isLoading ? (
              <div
                className="d-flex justify-content-center align-items-center text-muted w-100"
                style={{ minHeight: "60vh" }}
              >
                <div className="spinner-border text-secondary me-2" />
                {isLoadingSession
                  ? "Loading chat session..."
                  : "Loading chat history..."}
              </div>
            ) : (
              <div className="message-container1 hide-scrollbar" ref={chatRef}>
                {messages.length > 0 ? (
                  <>
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`mb-2 small ${
                          msg.sender === "Admin" ? "text-start" : "text-end"
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
                                  color: speakingIndex === i ? "#000" : "#ccc",
                                  position: "absolute",
                                  right: "8px",
                                  bottom: "18px",
                                }}
                                onClick={() => toggleSpeak(i, msg.message)}
                              ></i>
                              <div className="py-3">
                                <ReactMarkdown>{msg.message}</ReactMarkdown>
                              </div>
                            </>
                          ) : (
                            msg.message
                          )}
                        </div>
                      </div>
                    ))}

                    {isReplyLoading && <TypingIndicator />}
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
              <textarea
                ref={textareaRef}
                rows={1}
                className="form-control flex-grow-1 border-0 shadow-none bg-transparent me-2"
                placeholder={"Ask Now, Let's Work..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={!sessionId || isSending || isLoading}
              />

              {message.length > 0 ? (
                <button
                  className="btn btn-secondary rounded-circle"
                  onClick={handleSendMessage}
                  disabled={isSending || isLoading || !sessionId}
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
                  disabled={isSending || isLoading || !sessionId}
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
    </div>
  );
};
