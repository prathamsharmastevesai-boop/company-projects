// src/components/ChatWindow.jsx
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { AskQuestionGeneralAPI } from "../Networking/Admin/APIs/GeneralinfoApi";

export const ChatWindow = ({ category, heading }) => {
  const dispatch = useDispatch();
  const chatRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const scrollToBottom = () => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
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

    let activeSessionId = sessionId;
    if (!activeSessionId) {
      const newId = uuidv4();
      setSessionId(newId);
      activeSessionId = newId;
    }

    const userMessage = { message, sender: "User", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    scrollToBottom();

    try {
      setIsSending(true);
      const payload = {
        session_id: activeSessionId,
        question: userMessage.message,
        category,
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
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container-fluid py-3" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-md-12 d-flex flex-column">
          <div className="flex-grow-1 overflow-auto p-3 bg-light rounded mb-2 hide-scrollbar">
            <h5 className="text-muted mb-3">{heading}</h5>

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

          <div className="pt-2">
            <div className="d-flex align-items-center rounded py-2 bg-white">
              <textarea
                ref={textareaRef}
                rows={1}
                className="form-control mx-2"
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
                style={{ resize: "none", overflow: "auto" }}
                disabled={isSending}
              />
              {message.length > 0 ? (
                <button
                  className="btn btn-secondary"
                  onClick={handleSendMessage}
                  disabled={isSending}
                  aria-label="Send message"
                >
                  <i className="bi bi-send"></i>
                </button>
              ) : (
                <button
                  className={`btn me-2 ${
                    isRecording ? "btn-danger" : "btn-outline-secondary"
                  }`}
                  onClick={startRecording}
                  aria-label="Record message"
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
