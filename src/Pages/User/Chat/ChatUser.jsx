import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";

import {
  getlist_his_oldApi,
} from "../../../Networking/User/APIs/Chat/ChatApi";
import { AskQuestionAPI } from "../../../Networking/Admin/APIs/UploadDocApi";

export const UserChat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const { sessionId: incomingSessionId = null, type, Building_id } = location.state || {};

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const [speakingIndex, setSpeakingIndex] = useState(null); // 🔊 track currently speaking message index
  const chatRef = useRef(null);

  // const fetchMessages = async () => {
  //   setLoadingSessions(true);
  //   try {
  //     const res = await dispatch(getlist_his_oldApi()).unwrap();
  //     const filtered = res.filter((chat) => {
  //       const matchType = type ? chat.category === type : true;
  //       const matchBuilding =
  //         Building_id !== undefined && Building_id !== null
  //           ? String(chat.building_id) === String(Building_id)
  //           : true;
  //       return matchType && matchBuilding;
  //     });

  //     setChatList(filtered);

  //     if (incomingSessionId) {
  //       setSelectedChatId(incomingSessionId);
  //       setSessionId(incomingSessionId);
  //     } else if (filtered.length > 0) {
  //       const latestChat = filtered[0];
  //       setSelectedChatId(latestChat.session_id);
  //       setSessionId(latestChat.session_id);
  //     } else {
  //       const newId = uuidv4();
  //       const newChat = {
  //         session_id: newId,
  //         name: newId,
  //         created_at: new Date().toISOString(),
  //         category: type,
  //       };
  //       setChatList([newChat]);
  //       setSessionId(newId);
  //       setSelectedChatId(newId);
  //       setMessages([]);
  //     }
  //   } catch (e) {
  //     console.error("Fetch messages failed:", e);
  //   } finally {
  //     setLoadingSessions(false);
  //   }
  // };

    // useEffect(() => {
    //   fetchMessages();
    // }, [incomingSessionId]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
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
          console.error("Speech recognition error:", event.error);
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
              💬 Chat With {type === "Lease" ? "Lease Agreement" : "Letter of Intent"}
            </h5>

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
                              bottom: "6px",
                            }}
                            title={
                              speakingIndex === i
                                ? "Stop speaking"
                                : "Read this message aloud"
                            }
                            onClick={() => toggleSpeak(i, msg.message)}
                          ></i>
                        </>
                      ) : (
                        msg.message
                      )}
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
              <button
                className={`btn me-2 ${isRecording ? "btn-danger" : "btn-outline-secondary"}`}
                onClick={startRecording}
                aria-label="Record message"
              >
                <i
                  className={`bi ${
                    isRecording ? "bi-mic-mute-fill" : "bi-mic-fill"
                  }`}
                ></i>
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
                    if (textareaRef.current)
                      textareaRef.current.style.height = "auto";
                  }
                }}
                style={{ resize: "none", overflow: "auto" }}
                disabled={isSending}
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
