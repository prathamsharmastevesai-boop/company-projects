import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import {
  get_Chat_History,
  get_Session_List_Specific,
} from "../../../Networking/User/APIs/Chat/ChatApi";
import { AskQuestionAPI } from "../../../Networking/Admin/APIs/UploadDocApi";
import TypingIndicator from "../../../Component/TypingIndicator";
import { BackButton } from "../../../Component/backButton";

export const UserChat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatRef = useRef(null);

  const {
    sessionId: incomingSessionId = null,
    type,
    Building_id,
  } = location.state || {};

  const building_id = Building_id;

  const [sessionId, setSessionId] = useState(incomingSessionId || null);
  const session_id = sessionId;
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  const isLoading = isLoadingSession || isLoadingHistory;

  useEffect(() => {
    const fetchLastSession = async () => {
      setIsLoadingSession(true);
      try {
        const res = await dispatch(
          get_Session_List_Specific({
            category: type,
            buildingId: building_id,
          })
        ).unwrap();

        if (res.length > 0) {
          const lastSession = res[res.length - 1];
          setSessionId(lastSession.session_id);
        } else {
          const newId = uuidv4();
          setSessionId(newId);
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to fetch session list:", err);

        const fallbackSession = uuidv4();
        setSessionId(fallbackSession);
        setMessages([]);
      } finally {
        setIsLoadingSession(false);
      }
    };

    if (!sessionId) {
      fetchLastSession();
    } else {
      setIsLoadingSession(false);
    }
  }, [type, sessionId, dispatch]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!sessionId) {
        setIsLoadingHistory(false);
        return;
      }

      setIsLoadingHistory(true);

      try {
        const res = await dispatch(
          get_Chat_History({
            session_id,
            building_id,
          })
        ).unwrap();
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
        console.error("Failed to load history:", error);
        setMessages([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchChatHistory();
  }, [sessionId, building_id, dispatch]);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

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
          toast.error("Voice not recognized.");
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
    } catch (err) {
      toast.error("Microphone not accessible.");
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

    try {
      setIsSending(true);

      const payload = {
        question: userMessage.message,
        building_id: Building_id,
        category: type,
        session_id: sessionId,
      };

      const response = await dispatch(AskQuestionAPI(payload)).unwrap();

      if (response?.answer) {
        const newMessages = Array.isArray(response.answer)
          ? response.answer.map((ans) => ({
              message: ans.answer,
              file: ans.file || null,
              sender: "Admin",
              timestamp: new Date(),
            }))
          : [
              {
                message: response.answer,
                file: response.answer?.file || null,
                sender: "Admin",
                timestamp: new Date(),
              },
            ];

        setMessages((prev) => [...prev, ...newMessages]);
      }
    } catch {
      toast.error("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const handleNewSession = () => {
    const newId = uuidv4();
    setSessionId(newId);
    setMessages([]);
    toast.info("Started a new chat session.");
  };

  return (
    <div className="container-fluid py-3" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-md-12 d-flex flex-column">
          <div className="chat-header d-flex justify-content-between align-items-center mb-2 position-relative flex-wrap">
            <div className="d-flex align-items-center position-relative w-100">
              <div className="d-flex align-items-center">
                <BackButton />
              </div>

              <h5 className="chat-title text-muted mb-0 position-absolute start-50 translate-middle-x text-center">
                💬 Chat With{" "}
                {type === "Lease" ? "Lease Agreement" : "Letter of Intent"}
              </h5>

              <div className="ms-auto d-flex align-items-center">
                <button
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                  onClick={handleNewSession}
                  disabled={isLoadingSession}
                >
                  <i className="bi bi-plus-circle"></i>
                  <span className="d-none d-md-inline ms-1">New Session</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-grow-1 overflow-auto p-3 bg-light rounded mb-2">
            {isLoading ? (
              <div
                className="d-flex justify-content-center align-items-center text-muted w-100"
                style={{ minHeight: "60vh" }}
              >
                <div className="spinner-border text-secondary me-2"></div>
                Loading chat...
              </div>
            ) : messages.length === 0 ? (
              <div
                className="d-flex justify-content-center align-items-center text-muted w-100"
                style={{ minHeight: "60vh" }}
              >
                No messages yet. Start typing...
              </div>
            ) : (
              <div className="message-container1 hide-scrollbar" ref={chatRef}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`mb-2 small ${
                      msg.sender === "Admin" ? "text-start" : "text-end"
                    }`}
                  >
                    <div
                      className={`d-inline-block px-3 py-2 position-relative responsive-box ${
                        msg.sender === "Admin" ? "" : "bg-secondary text-light"
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
                              color: speakingIndex === i ? "#000" : "#999",
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

                {isSending && <TypingIndicator />}
              </div>
            )}
          </div>

          <div className="pt-2 pb-1">
            <div className="d-flex align-items-end rounded-pill py-2 px-3 bg-white shadow-sm border">
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
                    if (message.trim() && !isSending && !isLoading) {
                      handleSendMessage();
                    }
                  }
                }}
                disabled={isSending || isLoading}
                style={{
                  resize: "none",
                  overflow: "hidden",
                  maxHeight: "80px",
                  lineHeight: "20px",
                }}
              />

              {message.length > 0 ? (
                <button
                  className="btn btn-secondary rounded-circle"
                  onClick={handleSendMessage}
                  disabled={isSending || isLoading}
                  style={{ width: "43px", height: "38px" }}
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
                  disabled={isSending || isLoading}
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
    </div>
  );
};
