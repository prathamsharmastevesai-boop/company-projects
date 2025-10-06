import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  Delete_Chat_Specific_Session,
  get_Session_List_Specific,
} from "../../../Networking/User/APIs/Chat/ChatApi";
import { AskQuestionGeneralAPI } from "../../../Networking/Admin/APIs/GeneralinfoApi";
import ReactMarkdown from "react-markdown";

export const BrokerChat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const chatRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const incomingSessionId = location.state?.sessionId || null;

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sessionList, setSessionList] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null); // track which message is speaking

  const scrollToBottom = () => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startRecording = async () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Speech Recognition not supported in this browser.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!recognitionRef.current) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript);
        };

        recognitionRef.current.onerror = (event) => {
          toast.error(
            event.error === "not-allowed"
              ? "Microphone access denied."
              : "Voice recognition error: " + event.error
          );
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

    let activeSessionId = sessionId;
    if (!activeSessionId) {
      const newId = uuidv4();
      const newChat = {
        session_id: newId,
        name: newId,
        category: "Broker",
        created_at: new Date().toISOString(),
        title: message,
      };
      setSessionList((prev) => [newChat, ...prev]);
      setSessionId(newId);
      activeSessionId = newId;
    }

    const userMessage = { message, sender: "User", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      setIsSending(true);
      const payload = {
        session_id: activeSessionId,
        question: userMessage.message,
        category: "Broker",
      };
      const response = await dispatch(AskQuestionGeneralAPI(payload)).unwrap();

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
      console.error("Send message error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container-fluid py-3" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-md-12 d-flex flex-column">
          <div className="flex-grow-1 overflow-auto p-3 bg-light rounded mb-2 hide-scrollbar">
            <h5 className="text-muted mb-3">💬 Third Party Contact Information</h5>
            <div className="message-container1 hide-scrollbar" ref={chatRef}>
              {messages.length > 0 ? (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`mb-2 small ${msg.sender === "Admin" ? "text-start" : "text-end"}`}
                  >
                    <div
                      className={`d-inline-block px-3 py-2 rounded position-relative ${
                        msg.sender === "Admin" ? "bg-secondary text-white" : "bg-primary text-white"
                      }`}
                      style={{
                        maxWidth: "75%",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        textAlign: "left",
                      }}
                    >
                      {msg.sender === "Admin" ? (
                        <>
                          <ReactMarkdown>{msg.message}</ReactMarkdown>
                          <i
                            className={`bi ${speakingIndex === i ? "bi-volume-up-fill" : "bi-volume-mute"} ms-2`}
                            style={{
                              cursor: "pointer",
                              fontSize: "1rem",
                              color: speakingIndex === i ? "#000000ff" : "#ccc",
                              position: "absolute",
                              right: "8px",
                              bottom: "8px",
                            }}
                            onClick={() => toggleSpeak(i, msg.message)}
                          ></i>
                        </>
                      ) : (
                        msg.message
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
              <button
                className={`btn me-2 ${isRecording ? "btn-danger" : "btn-outline-secondary"}`}
                onClick={startRecording}
                aria-label="Record message"
              >
                <i className={`bi ${isRecording ? "bi-mic-mute-fill" : "bi-mic-fill"}`}></i>
              </button>

              <textarea
                ref={textareaRef}
                rows={1}
                className="form-control me-2"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  const ta = textareaRef.current;
                  if (ta) {
                    ta.style.height = "auto";
                    const lineHeight = 20;
                    const maxHeight = lineHeight * 3;
                    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + "px";
                  }
                }}
                onKeyDown={(e) => {
                  const isComposing = e.nativeEvent?.isComposing;
                  if (e.key === "Enter" && !isComposing && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                    if (textareaRef.current) textareaRef.current.style.height = "auto";
                  }
                }}
                style={{ resize: "none", overflow: "auto" }}
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
