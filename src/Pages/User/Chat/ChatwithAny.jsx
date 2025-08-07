import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import { AskQuestion_Specific_API, Delete_Chat_Session, get_chathistory_Specific_Api, get_Session_List_Specific, get_specific_Doclist_Api, Upload_specific_file_Api } from "../../../Networking/User/APIs/Chat/ChatApi";


export const ChatWithAnyDoc = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const initialBuildings = location.state?.office;
  console.log(initialBuildings, "initialBuildings");


  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  console.log(sessionId, "sessionId");

  const [messages, setMessages] = useState([]);
  // const [editIndex, setEditIndex] = useState(null);
  // const [fileToReplace, setFileToReplace] = useState(null);
  // const [isReplacing, setIsReplacing] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
     const [isUploading, setIsUploading] = useState(false);
  console.log(chatList, "chatList");

  const [selectedChatId, setSelectedChatId] = useState(null);

  const fileInputRef = useRef();
  const chatRef = useRef(null);

  const fetchDocuments = async () => {
        const response = await dispatch(get_specific_Doclist_Api());

        if (response?.payload && Array.isArray(response.payload)) {
            setUploadedFiles(response.payload);
        }
    };

  const fetchMessages = async () => {
console.log("fjsfgjdsgfudgsfdgfdug");

    const res = await dispatch(
      get_Session_List_Specific()
    ).unwrap();
    console.log(res, "res111111gdgdfgdfgdfgdfgdf11");
    await setChatList(res)

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
    
  }, [])

  // const handleReplace = (e) => {
  //   const newFile = e.target.files[0];
  //   if (!newFile || editIndex === null) {
  //     toast.error("No file selected for replacement.");
  //     return;
  //   }
  //   setFileToReplace(newFile);
  //   toast.info("New file selected. Click 'Confirm Update' to apply changes.");
  // };

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

  // ✅ Automatically create session if none exists
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
    session_id: activeSessionId,
  };

  console.log(payload, "payload");

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
    try {
      const res_chat_his = await dispatch(get_chathistory_Specific_Api(id)).unwrap();
      console.log(res_chat_his, "res_chat_hisres_chat_hisres_chat_hisres_chat_hisres_chat_hisres_chat_his");

      if (Array.isArray(res_chat_his)) {
        const formattedMessages = res_chat_his.flatMap(chat => [
          {
            message: chat.question,
            sender: "User",
            timestamp: new Date(chat.timestamp),
          },
          {
            message: chat.answer,
            sender: "Admin",
            timestamp: new Date(chat.timestamp),
          }
        ]);
        setSessionId(id)
        setMessages(formattedMessages);
        scrollToBottom();
      }

      console.log(res_chat_his, 'Chat history response in component');
    } catch (error) {
      console.error('Failed to get chat history:', error);
    }
  };



    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (!selectedFiles.length) {
            alert("⚠️ No files selected.");
            return;
        }

        try {
            setIsUploading(true);
            const res = await dispatch(
                Upload_specific_file_Api({
                    files: selectedFiles,
                })
            ).unwrap();

            toast.success(res?.msg || "Documents uploaded successfully!");
            await fetchDocuments();
        } catch (error) {
            const errorMsg = error?.response?.data?.msg || error?.message || "❌ Upload failed";
            toast.error(errorMsg);
        } finally {
            setIsUploading(false);
        }
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleReplace = (e) => {
        const newFile = e.target.files[0];
        if (!newFile || editIndex === null) {
            toast.error("No file selected for replacement.");
            return;
        }
        setFileToReplace(newFile);
        toast.info("New file selected. Click 'Confirm Update' to apply changes.");
    };

    const confirmUpdate = async () => {
        if (editIndex === null || !fileToReplace) {
            toast.error("No file selected for update.");
            return;
        }

        const oldFile = uploadedFiles[editIndex];
        const file_id = oldFile?.file_id;
        if (!file_id) {
            toast.error("File ID not found for replacement.");
            return;
        }

        try {
            setIsReplacing(true);
            await dispatch(
                UpdateDocSubmit({
                    new_file: fileToReplace,
                    file_id,
                })
            ).unwrap();
            await fetchDocuments();
            setEditIndex(null);
            setFileToReplace(null);
        } catch (error) {
            toast.error("Failed to update file.");
        } finally {
            setIsReplacing(false);
        }
    };

  

  const handleDelete = async (id) => {
    console.log(id,"vvvvv");
    
    try {
      await dispatch(Delete_Chat_Session(id));
      const updatedChatList = await dispatch(get_Session_List_Specific());
      setChatList(updatedChatList.payload || []);
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
            {chatList.map((chat, index) => (
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
            ))}

          </div>

        </div>

        <div className="col-md-9 d-flex flex-column">
          <div

            className="flex-grow-1 overflow-auto p-3 bg-light rounded mb-2 hide-scrollbar"
          >
            <h5 className="text-muted mb-3">💬 Chat Messages</h5>
            <div className="message-container hide-scrollbar" ref={chatRef} >
              {messages.length > 0 ? (
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
              <div className="upload-container hide-scrollbar">
                {uploadedFiles.length > 0 ? (
                  uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className={`border p-2 rounded mb-2 ${selectedFileIndex === index ? "border-primary bg-light" : ""}`}
                      onClick={() => setSelectedFileIndex(index)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{file.original_file_name || file.name}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted">No documents uploaded yet.</div>
                )}
              </div>
            </div>


            {/* {fileToReplace && editIndex !== null && (
              <div className="mb-3">
                <button className="btn btn-success" onClick={confirmUpdate} disabled={isReplacing}>
                  {isReplacing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Updating...
                    </>
                  ) : (
                    "Confirm Update File"
                  )}
                </button>
              </div>
            )} */}

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

            {/* <input type="file" ref={fileInputRef} className="d-none" onChange={handleReplace} /> */}

            <div className="d-flex align-items-center border rounded p-2 bg-white">
                         {/* Upload Button */}
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

                        {/* Input box */}
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />

                        {/* Send Button */}
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






// import { useEffect, useRef, useState } from "react";
// import {
//     AskQuestionAPI,
//     DeleteDocSubmit,
//     ListDocSubmit,
//     UpdateDocSubmit,
// } from "../../../Networking/Admin/APIs/UploadDocApi";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { AskQuestion_Specific_API, get_specific_Doclist_Api, Upload_specific_file_Api } from "../../../Networking/User/APIs/Chat/ChatApi";

// export const ChatWithAnyDoc = () => {
//     const { DocList } = useSelector((state) => state.DocSlice);
//     const dispatch = useDispatch();
//     const location = useLocation();

//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const [messages, setMessages] = useState([]);
//     const [editIndex, setEditIndex] = useState(null);
//     const [fileToReplace, setFileToReplace] = useState(null);
//     const [isReplacing, setIsReplacing] = useState(false);
//     const [isUploading, setIsUploading] = useState(false);
//     const [deletingIndex, setDeletingIndex] = useState(null);
//     const [selectedFileIndex, setSelectedFileIndex] = useState(null);
//     const [isSending, setIsSending] = useState(false);
//     const [message, setMessage] = useState("");

//     const fileInputRef = useRef();
//     const chatRef = useRef(null);

//     const fetchDocuments = async () => {
//         const response = await dispatch(get_specific_Doclist_Api());

//         if (response?.payload && Array.isArray(response.payload)) {
//             setUploadedFiles(response.payload);
//         }
//     };

//     const fetchMessages = async () => {

//         // const res = await dispatch(
//         //   ListMessagesAPI({
//         //     building_id: initialBuildings.Building_id,
//         //     office_id: initialBuildings.office.id,
//         //   })
//         // ).unwrap();

//         // if (Array.isArray(res?.messages)) {
//         //     setMessages(res.messages);
//         //     scrollToBottom();
//         // }
//     };

//     const scrollToBottom = () => {
//         if (chatRef.current) {
//             chatRef.current.scrollTop = chatRef.current.scrollHeight;
//         }
//     };

//     useEffect(() => {
//         fetchDocuments();
//         fetchMessages();
//     }, []);

//     const handleFileChange = async (e) => {
//         const selectedFiles = Array.from(e.target.files);
//         if (!selectedFiles.length) {
//             alert("⚠️ No files selected.");
//             return;
//         }

//         try {
//             setIsUploading(true);
//             const res = await dispatch(
//                 Upload_specific_file_Api({
//                     files: selectedFiles,
//                 })
//             ).unwrap();

//             toast.success(res?.msg || "Documents uploaded successfully!");
//             await fetchDocuments();
//         } catch (error) {
//             const errorMsg = error?.response?.data?.msg || error?.message || "❌ Upload failed";
//             toast.error(errorMsg);
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     const handleEdit = (index) => {
//         setEditIndex(index);
//         if (fileInputRef.current) fileInputRef.current.click();
//     };

//     const handleReplace = (e) => {
//         const newFile = e.target.files[0];
//         if (!newFile || editIndex === null) {
//             toast.error("No file selected for replacement.");
//             return;
//         }
//         setFileToReplace(newFile);
//         toast.info("New file selected. Click 'Confirm Update' to apply changes.");
//     };

//     const confirmUpdate = async () => {
//         if (editIndex === null || !fileToReplace) {
//             toast.error("No file selected for update.");
//             return;
//         }

//         const oldFile = uploadedFiles[editIndex];
//         const file_id = oldFile?.file_id;
//         if (!file_id) {
//             toast.error("File ID not found for replacement.");
//             return;
//         }

//         try {
//             setIsReplacing(true);
//             await dispatch(
//                 UpdateDocSubmit({
//                     new_file: fileToReplace,
//                     file_id,
//                 })
//             ).unwrap();
//             await fetchDocuments();
//             setEditIndex(null);
//             setFileToReplace(null);
//         } catch (error) {
//             toast.error("Failed to update file.");
//         } finally {
//             setIsReplacing(false);
//         }
//     };

//     const handleDelete = async (file_id, index) => {
//         try {
//             setDeletingIndex(index);
//             await dispatch(DeleteDocSubmit(file_id)).unwrap();
//             await fetchDocuments();
//         } catch (err) {
//             toast.error("Failed to delete file.");
//         } finally {
//             setDeletingIndex(null);
//         }
//     };

//     const handleSendMessage = async () => {
//         if (!message.trim()) {
//             toast.warning("Please enter a message.");
//             return;
//         }

//         if (selectedFileIndex === null) {
//             toast.warning("Please select a document.");
//             return;
//         }

//         const selectedFile = uploadedFiles[selectedFileIndex];

//         if (!selectedFile?.file_id) {
//             toast.error("Missing file or location info.");
//             return;
//         }

//         const payload = {
//             question: message,
//             file_id: selectedFile.file_id,
//         };

//         try {
//             setIsSending(true);
//             const response = await dispatch(AskQuestion_Specific_API(payload)).unwrap();

//             setMessages((prev) => [
//                 ...prev,
//                 { message: response.question, sender: "User", timestamp: new Date() },
//                 { message: response.answer, sender: "Admin", timestamp: new Date() },
//             ]);

//             setMessage("");
//             scrollToBottom();
//             // toast.success("Message sent successfully!");
//         } catch (error) {
//             toast.error("Send message failed.");
//         } finally {
//             setIsSending(false);
//         }
//     };



//     return (
//         <div className="container py-2 d-flex flex-column justify-content-between" style={{ height: "100vh" }}>


//             {/* Chat Messages */}
//             <div
//                 ref={chatRef}
//                 className="mb-3 p-3 bg-light rounded overflow-auto  hide-scrollbar"
//                 style={{ maxHeight: "60%" }}
//             >
//                 <h5 className="text-muted">💬 Chat Messages</h5>
//                 <div>
//                     {messages.length > 0 ? (
//                         messages.map((msg, i) => (
//                             <div key={i} className={`mb-2 small ${msg.sender === "Admin" ? "text-start" : "text-end"}`}>
//                                 <div
//                                     className={`d-inline-block px-3 py-2 rounded ${msg.sender === "Admin" ? "bg-secondary text-white" : "bg-primary text-white"}`}
//                                 >
//                                     <div>{msg.message}</div>
//                                 </div>
//                                 <div
//                                     className={`text-muted fst-italic mt-1`}
//                                     style={{ fontSize: "0.75rem" }}
//                                 >
//                                     {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString()}
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="text-muted">No messages yet.</div>
//                     )}

//                     {isSending && (
//                         <div className="text-start small mt-2">
//                             <div className="d-inline-block px-3 py-2 rounded bg-secondary text-white">
//                                 <div>
//                                     <span className="spinner-border spinner-border-sm me-2" role="status" />
//                                     Admin is typing...
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             <div className="pt-2">
//                 <div className="overflow-auto mb-2 p-2 bg-white border rounded">
//                     <h5 className="mb-3">📄 Select Document to Chat</h5>
//                     <div className="upload-container_specific hide-scrollbar">
//                         {uploadedFiles.length > 0 ? (
//                             uploadedFiles.map((file, index) => (
//                                 <div
//                                     key={index}
//                                     className={`border p-2 rounded mb-2 ${selectedFileIndex === index ? "border-primary bg-light" : ""}`}
//                                     onClick={() => setSelectedFileIndex(index)}
//                                     style={{ cursor: "pointer" }}
//                                 >
//                                     <div className="d-flex justify-content-between align-items-center">
//                                         <span>{file.original_file_name || file.name}</span>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="text-muted">No documents uploaded yet.</div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Uploading Indicator */}
//                 {isUploading && (
//                     <div className="text-primary mb-2">
//                         <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                         Uploading...
//                     </div>
//                 )}

//                 {/* Confirm Replace */}
//                 {fileToReplace && editIndex !== null && (
//                     <div className="mb-3">
//                         <button
//                             className="btn btn-success"
//                             onClick={confirmUpdate}
//                             disabled={isReplacing}
//                         >
//                             {isReplacing ? (
//                                 <>
//                                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                                     Updating...
//                                 </>
//                             ) : (
//                                 "Confirm Update File"
//                             )}
//                         </button>
//                     </div>
//                 )}

//                 {/* Hidden Replace File Input */}
//                 <input
//                     type="file"
//                     ref={fileInputRef}
//                     className="d-none"
//                     onChange={handleReplace}
//                 />

//                 <div className="">
//                     {/* Selected File Display */}
//                     {selectedFileIndex !== null && uploadedFiles[selectedFileIndex] && (
//                         <div className="alert alert-secondary d-flex justify-content-between align-items-center p-2 mb-2">
//                             <div>
//                                 {uploadedFiles[selectedFileIndex].original_file_name ||
//                                     uploadedFiles[selectedFileIndex].name}
//                             </div>
//                             <i
//                                 className="bi bi-x-circle me-1"
//                                 onClick={() => setSelectedFileIndex(null)}
//                             ></i>
//                         </div>
//                     )}

//                     {/* Bottom Input Section */}
//                     <div className="d-flex align-items-center border rounded p-2 bg-white">
//                         {/* Upload Button */}
//                         <label htmlFor="file-upload" style={{ cursor: "pointer" }} className="me-2 mb-0">
//                             <i className="bi bi-paperclip fs-5 text-primary"></i>
//                         </label>
//                         <input
//                             id="file-upload"
//                             type="file"
//                             multiple
//                             className="d-none"
//                             onChange={handleFileChange}
//                             disabled={isUploading}
//                         />

//                         {/* Input box */}
//                         <input
//                             type="text"
//                             className="form-control me-2"
//                             placeholder="Type a message..."
//                             value={message}
//                             onChange={(e) => setMessage(e.target.value)}
//                         />

//                         {/* Send Button */}
//                         <button className="btn btn-primary" onClick={handleSendMessage}>
//                             <i className="bi bi-send"></i>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


