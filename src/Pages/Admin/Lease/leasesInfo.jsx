// import { useEffect, useRef, useState } from "react";
// import {
//     AskQuestionAPI,
//     DeleteDocSubmit,
//     ListDocSubmit,
//     UpdateDocSubmit,
//     UploadDocSubmit,
// } from "../../../Networking/Admin/APIs/UploadDocApi";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
// import { toast } from "react-toastify";

// export const OfficeInfomation = () => {
//     const { DocList } = useSelector((state) => state.DocSlice);
//     const dispatch = useDispatch();
//     const location = useLocation();
//     const initialBuildings = location.state?.office;

//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const [messages, setMessages] = useState([]); // ➕ New
//     const [editIndex, setEditIndex] = useState(null);
//     const [fileToReplace, setFileToReplace] = useState(null);
//     const [isReplacing, setIsReplacing] = useState(false);
//     const [isUploading, setIsUploading] = useState(false);
//     const [deletingIndex, setDeletingIndex] = useState(null);
//     const [selectedFileIndex, setSelectedFileIndex] = useState(null);
//     const [message, setMessage] = useState("");

//     const fileInputRef = useRef();
//     const chatRef = useRef(null); // ➕ New

//     const fetchDocuments = async () => {
//         if (!initialBuildings?.Building_id || !initialBuildings?.office?.id) return;

//         const listdata = {
//             building_id: initialBuildings.Building_id,
//             office_id: initialBuildings.office.id,
//         };

//         const response = await dispatch(ListDocSubmit(listdata));
//         if (response?.payload?.files && Array.isArray(response.payload.files)) {
//             setUploadedFiles(response.payload.files);
//         }
//     };

//     const fetchMessages = async () => {
//         if (!initialBuildings?.Building_id || !initialBuildings?.office?.id) return;

//         // const res = await dispatch(
//         //   ListMessagesAPI({
//         //     building_id: initialBuildings.Building_id,
//         //     office_id: initialBuildings.office.id,
//         //   })
//         // ).unwrap();

//         if (Array.isArray(res?.messages)) {
//             setMessages(res.messages);
//             scrollToBottom();
//         }
//     };

//     const scrollToBottom = () => {
//         if (chatRef.current) {
//             chatRef.current.scrollTop = chatRef.current.scrollHeight;
//         }
//     };

//     useEffect(() => {
//         fetchDocuments();
//         fetchMessages();
//     }, [initialBuildings]);

//     const handleFileChange = async (e) => {
//         const selectedFiles = Array.from(e.target.files);
//         if (!selectedFiles.length) {
//             alert("⚠️ No files selected.");
//             return;
//         }

//         if (!initialBuildings?.Building_id || !initialBuildings?.office?.id) {
//             alert("❌ Building ID or Office ID is missing.");
//             return;
//         }

//         try {
//             setIsUploading(true);
//             const res = await dispatch(
//                 UploadDocSubmit({
//                     files: selectedFiles,
//                     buildingId: initialBuildings.Building_id,
//                     office_id: initialBuildings.office.id,
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
//                     buildingId: initialBuildings?.Building_id,
//                     office_id: initialBuildings?.office?.id,
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
//         const buildingId = initialBuildings?.Building_id;
//         const officeId = initialBuildings?.office?.id;

//         if (!selectedFile?.file_id || !buildingId || !officeId) {
//             toast.error("Missing file or location info.");
//             return;
//         }

//         const payload = {
//             question: message,
//             file_id: selectedFile.file_id,
//             building_id: buildingId,
//             office_id: officeId,
//         };

//         try {
//             const response = await dispatch(AskQuestionAPI(payload)).unwrap();

//             // Add question and answer to messages
//             setMessages((prev) => [
//                 ...prev,
//                 { message: response.question, sender: "User", timestamp: new Date() },
//                 { message: response.answer, sender: "Admin", timestamp: new Date() },
//             ]);

//             setMessage("");
//             scrollToBottom();
//             toast.success("Message sent successfully!");
//         } catch (error) {
//             toast.error("Send message failed.");
//         }
//     };


//     return (
//         <div className="container py-2 d-flex flex-column justify-content-between" style={{ height: "100vh" }}>


//             {/* Chat Messages */}
//             <div
//                 ref={chatRef}
//                 className="mb-3 p-3 bg-light rounded overflow-auto"
//                 style={{ maxHeight: "60%" }}
//             >
//                 <h5 className="text-muted">💬 Chat Messages</h5>
//                 <div>
//                         {messages.length > 0 ? (
//                             messages.map((msg, i) => (
//                                 <div key={i} className={`mb-2 small ${msg.sender === "Admin" ? "text-start" : "text-end"}`}>
//                                     <div
//                                         className={`d-inline-block px-3 py-2 rounded ${msg.sender === "Admin" ? "bg-secondary text-white" : "bg-primary text-white"
//                                             }`}
//                                     >
//                                         <div>{msg.message}</div>
//                                     </div>
//                                     <div
//                                         className={`text-muted fst-italic mt-1`}
//                                         style={{ fontSize: "0.75rem" }}
//                                     >
//                                         {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString()}
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="text-muted">No messages yet.</div>
//                         )}
//                 </div>

//             </div>

//         <div className="d-flex flex-column justify-content-end" style={{ maxHeight: "calc(100% - 60%)" }}>
//             {/* Document List */}
//             <div className="overflow-auto mb-3 p-3 bg-white border rounded" style={{ maxHeight: "100%" }}>
//                 <h5 className="mb-3">📄 Uploaded Documents</h5>
//                 {uploadedFiles.length > 0 ? (
//                     uploadedFiles.map((file, index) => (
//                         <div
//                             key={index}
//                             className={`border p-2 rounded mb-2 ${selectedFileIndex === index ? "border-primary bg-light" : ""}`}
//                             onClick={() => setSelectedFileIndex(index)}
//                             style={{ cursor: "pointer" }}
//                         >
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <span>{file.original_file_name || file.name}</span>
//                                 <div className="d-flex gap-2">
//                                     <i
//                                         className="bi bi-pencil-square text-primary"
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleEdit(index);
//                                         }}
//                                         style={{ cursor: "pointer" }}
//                                     ></i>
//                                     <i
//                                         className="text-danger"
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             if (deletingIndex === null) handleDelete(file.file_id, index);
//                                         }}
//                                         style={{ cursor: deletingIndex === index ? "not-allowed" : "pointer" }}
//                                     >
//                                         {deletingIndex === index ? (
//                                             <span className="spinner-border spinner-border-sm" role="status" />
//                                         ) : (
//                                             <i className="bi bi-trash"></i>
//                                         )}
//                                     </i>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <div className="text-muted">No documents uploaded yet.</div>
//                 )}
//             </div>

//             {/* Uploading Indicator */}
//             {isUploading && (
//                 <div className="text-primary mb-2">
//                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                     Uploading...
//                 </div>
//             )}

//             {/* Confirm Replace */}
//             {fileToReplace && editIndex !== null && (
//                 <div className="mb-3">
//                     <button
//                         className="btn btn-success"
//                         onClick={confirmUpdate}
//                         disabled={isReplacing}
//                     >
//                         {isReplacing ? (
//                             <>
//                                 <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                                 Updating...
//                             </>
//                         ) : (
//                             "Confirm Update File"
//                         )}
//                     </button>
//                 </div>
//             )}

//             {/* Hidden Replace File Input */}
//             <input
//                 type="file"
//                 ref={fileInputRef}
//                 className="d-none"
//                 onChange={handleReplace}
//             />

//             <div className="">
//                 {/* Selected File Display */}
//                 {selectedFileIndex !== null && uploadedFiles[selectedFileIndex] && (
//                     <div className="alert alert-secondary d-flex justify-content-between align-items-center p-2 mb-2">
//                         <div>
//                             {uploadedFiles[selectedFileIndex].original_file_name ||
//                                 uploadedFiles[selectedFileIndex].name}
//                         </div>
//                         <i
//                             className="bi bi-x-circle me-1"
//                             onClick={() => setSelectedFileIndex(null)}
//                         ></i>
//                     </div>
//                 )}

//                 {/* Bottom Input Section */}
//                 <div className="d-flex align-items-center border rounded p-2 bg-white">
//                     {/* Upload Button */}
//                     <label htmlFor="file-upload" style={{ cursor: "pointer" }} className="me-2 mb-0">
//                         <i className="bi bi-paperclip fs-5 text-primary"></i>
//                     </label>
//                     <input
//                         id="file-upload"
//                         type="file"
//                         multiple
//                         className="d-none"
//                         onChange={handleFileChange}
//                         disabled={isUploading}
//                     />

//                     {/* Input box */}
//                     <input
//                         type="text"
//                         className="form-control me-2"
//                         placeholder="Type a message..."
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                     />

//                     {/* Send Button */}
//                     <button className="btn btn-primary" onClick={handleSendMessage}>
//                         <i className="bi bi-send"></i>
//                     </button>
//                 </div>
//             </div>
//         </div>
// </div>

//     );
// };







import { useEffect, useRef, useState } from "react";
import {
  DeleteDocSubmit,
  ListDocSubmit,
  UpdateDocSubmit,
  UploadDocSubmit,
} from "../../../Networking/Admin/APIs/UploadDocApi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export const LeaseInfomation = () => {

  //Hooks
  const dispatch = useDispatch();
  const location = useLocation();
  const fileInputRef = useRef();

  //Params
  const initialBuildings = location.state?.office;
  console.log(initialBuildings, "initialBuildings");


  //States
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [fileToReplace, setFileToReplace] = useState(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);

  const fetchDocuments = async () => {
    if (!initialBuildings?.Building_id || !initialBuildings?.lease?.lease_id) return;
    const listdata = {
      building_id: initialBuildings.Building_id,
      lease_id: initialBuildings.lease?.lease_id,
    };
    const response = await dispatch(ListDocSubmit(listdata));
    console.log(response, "response");

    if (response?.payload?.files && Array.isArray(response.payload.files)) {
      setUploadedFiles(response.payload.files);
    }
  };

  //UseEffect
  useEffect(() => {
    fetchDocuments();
  }, [initialBuildings]);

  //Handle Funtion
const handleFileChange = async (e) => {
  const selectedFiles = Array.from(e.target.files);
  const MAX_FILE_SIZE_MB = 3;

  if (!selectedFiles.length) {
    alert("⚠️ No files selected.");
    return;
  }

  const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
  if (oversizedFiles.length > 0) {
    alert(`❌ One or more files exceed the 3MB limit. Please upload smaller files.`);
    return;
  }

  if (!initialBuildings?.Building_id || !initialBuildings?.lease?.lease_id) {
    alert("❌ Building ID or lease ID is missing.");
    return;
  }

  try {
    setIsUploading(true);
    const res = await dispatch(
      UploadDocSubmit({
        files: selectedFiles,
        buildingId: initialBuildings.Building_id,
        lease_id: initialBuildings.lease?.lease_id,
      })
    ).unwrap();

    if (res?.msg) {
      alert(`✅ ${res.msg}`);
    } else {
      alert("✅ Documents uploaded successfully!");
    }

    const listdata = {
      building_id: initialBuildings.Building_id,
      lease_id: initialBuildings.lease?.lease_id,
    };

    const response = await dispatch(ListDocSubmit(listdata));

    if (response?.payload?.files && Array.isArray(response.payload.files)) {
      setUploadedFiles(response.payload.files);
    }
  } catch (error) {
    const errorMsg =
      error?.response?.data?.msg || error?.message || "❌ Upload failed";
    alert(errorMsg);
    console.error("Upload failed:", error);
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
          building_id: initialBuildings.Building_id,
          lease_id: initialBuildings.lease?.lease_id,
        })
      ).unwrap();

      await fetchDocuments();

      setEditIndex(null);
      setFileToReplace(null);
    } catch (error) {
      console.error("Replacement failed:", error);
      toast.error("Failed to update file.");
    } finally {
      setIsReplacing(false);
    }
  };

  const handleDelete = async (file_id, index) => {
    try {
      setDeletingIndex(index);
      const listdata = {
        building_id: initialBuildings.Building_id,
        lease_id: initialBuildings.lease?.lease_id,
        file_id
      }
      await dispatch(DeleteDocSubmit(listdata)).unwrap();

      await fetchDocuments();

    } catch (err) {
      console.error(err);
      toast.error("Failed to delete file.");
    } finally {
      setDeletingIndex(null);
    }
  };


  return (
    <div className="container py-5">
      <h2 className="mb-4">📄 Upload Lease Documents</h2>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="form-control mb-3"
        disabled={isUploading}
      />
      {isUploading && (
        <div className="text-primary mb-3">
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          Uploading...
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="card shadow-sm p-3 mb-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="mb-0">📎 Lease File {index + 1}</h5>
                <div className="d-flex gap-3">
                  <i
                    className="bi bi-pencil-square text-primary"
                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    onClick={() => handleEdit(index)}
                    title="Replace File"
                  ></i>
                  <i
                    className={`text-danger ${deletingIndex === index ? "disabled" : ""}`}
                    style={{
                      cursor: deletingIndex === index ? "not-allowed" : "pointer",
                      fontSize: "1.2rem",
                    }}
                    onClick={() =>
                      deletingIndex === null ? handleDelete(file.file_id, index) : null
                    }
                    title="Delete File"
                  >
                    {deletingIndex === index ? (
                      <span
                        className="spinner-border spinner-border-sm text-danger"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <i className="bi bi-trash"></i>
                    )}
                  </i>

                </div>
              </div>
              <p className="mb-2">
                <strong>ID:</strong> {file.file_id}
              </p>
              <p className="mb-0">
                <strong>File:</strong> {file.original_file_name || file.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {fileToReplace && editIndex !== null && (
        <div className="mt-3">
          <button
            className="btn btn-success"
            onClick={confirmUpdate}
            disabled={isReplacing}
          >
            {isReplacing ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Updating...
              </>
            ) : (
              "Confirm Update File"
            )}
          </button>
        </div>
      )}

      <input
        type="file"
        onChange={handleReplace}
        ref={fileInputRef}
        className="d-none"
      />
    </div>
  );
};
