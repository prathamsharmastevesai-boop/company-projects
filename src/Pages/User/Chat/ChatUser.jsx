import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";

import { AskQuestionAPI } from "../../../Networking/Admin/APIs/UploadDocApi";

export const UserChat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const {
    sessionId: incomingSessionId = null,
    type,
    Building_id,
  } = location.state || {};

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const [speakingIndex, setSpeakingIndex] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const startRecording = async () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      toast.error("Speech Recognition not supported in this browser.");
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

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          toast.error(
            event.error === "not-allowed"
              ? "Microphone access denied."
              : "Voice not recognized. Please try again later..."
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
      console.error("Microphone access error:", err);
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
        question: userMessage.message,
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

  return (
    <div className="container-fluid py-3" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-md-12 d-flex flex-column">
          <div className="flex-grow-1 overflow-auto p-3 bg-light rounded mb-2 hide-scrollbar">
            <h5 className="text-muted mb-3">
              💬 Chat With{" "}
              {type === "Lease" ? "Lease Agreement" : "Letter of Intent"}
            </h5>

            <div className="message-container1 hide-scrollbar" ref={chatRef}>
              {messages.length > 0 ? (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`mb-2 small ${
                      msg.sender === "Admin" ? "text-start" : "text-end"
                    }`}
                  >
                    <div
                      className={`d-inline-block px-3 py-2 position-relative responsive-box ${
                        msg.sender === "Admin"
                          ? null
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
                              color: speakingIndex === i ? "#000000ff" : "#ccc",
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
                ))
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center text-muted w-100"
                  style={{ minHeight: "60vh" }}
                >
                  No messages yet.
                </div>
              )}
              {isSending && (
                <div className="text-start small mt-2">
                  <div className="d-inline-block px-3 py-2 rounded text-dark">
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
          <div className="pt-2 pb-1">
            <div className="d-flex align-items-end rounded-pill py-2 px-3 bg-white shadow-sm border">
              <textarea
                ref={textareaRef}
                rows={1}
                className="form-control flex-grow-1 border-0 shadow-none bg-transparent me-2"
                placeholder="Ask Now, Let’s Work…"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  const ta = textareaRef.current;
                  if (ta) {
                    ta.style.height = "auto";
                    const lineHeight = 20;
                    const maxHeight = lineHeight * 3;
                    ta.style.height =
                      Math.min(ta.scrollHeight, maxHeight) + "px";
                  }
                }}
                onKeyDown={(e) => {
                  const isComposing = e.nativeEvent?.isComposing;
                  if (e.key === "Enter" && !isComposing && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                    if (textareaRef.current)
                      textareaRef.current.style.height = "auto";
                  }
                }}
                style={{
                  resize: "none",
                  overflow: "hidden",
                  maxHeight: "80px",
                  lineHeight: "20px",
                }}
                disabled={isSending}
              />

              {message.length > 0 ? (
                <button
                  className="btn btn-secondary rounded-circle d-flex align-items-center justify-content-center"
                  onClick={handleSendMessage}
                  disabled={isSending}
                  aria-label="Send message"
                  style={{ width: "38px", height: "38px", padding: "0" }}
                >
                  <i className="bi bi-send-fill"></i>
                </button>
              ) : (
                <button
                  className={`btn rounded-circle d-flex align-items-center justify-content-center ${
                    isRecording ? "btn-danger" : "btn-outline-secondary"
                  }`}
                  onClick={startRecording}
                  disabled={isSending}
                  aria-label="Record message"
                  style={{ width: "38px", height: "38px", padding: "0" }}
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
