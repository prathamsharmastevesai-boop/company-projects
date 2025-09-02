import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { diffWords } from "diff";
import RAGLoader from "../../../Component/Loader";
import { useDispatch } from "react-redux";
import {
  DeleteDrafingDoc,
  ListDraftingLeaseDoc,
  UploadDraftingLeaseDoc,
} from "../../../Networking/Admin/APIs/AiDraftingLeaseAPi";

export const LeaseDraftingUpload = () => {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
   const fileInputRef = useRef(null);

  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDraft, setEditedDraft] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [loader, setLoader] = useState(false);

  const [metadata, setMetadata] = useState({
    tenant: "",
    rent: "",
    term: "",
  });

 

  useEffect(() => {
  if (bottomRef.current) {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [aiDraft, submittedFeedback]);

  const fetchDocs = () => {
    setLoader(true);
    dispatch(ListDraftingLeaseDoc({ category: "lease" }))
      .unwrap()
      .then((res) => {
        setDocs(res?.files || []);
      })
      .catch((err) => {
        console.error("Failed to fetch lease docs:", err);
        toast.error("Failed to fetch lease documents");
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    fetchDocs();
  }, [dispatch]);

  const validateAndUploadFile = (file) => {
    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      toast.error("Only PDF, DOC, or DOCX files are allowed");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("File must be under 3MB");
      return;
    }

    const payload = { file, category: "lease" };
    setLoader(true);
    dispatch(UploadDraftingLeaseDoc(payload))
      .unwrap()
      .then(() => {
        toast.success(`${file.name} uploaded successfully`);
        fetchDocs();
      })
      .catch((err) => {
        console.error("Upload failed:", err);
        toast.error("Upload failed");
      })
      .finally(() => setLoader(false));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      validateAndUploadFile(e.target.files[0]);
    }
  };

  const handleDelete = (fileId) => {
      if (!window.confirm("Are you sure you want to delete this document?"))
        return;

      setLoader(true);
      dispatch(DeleteDrafingDoc({ fileId }))
        .unwrap()
        .then(() => {
          fetchDocs();
        })
        .catch((err) => {
          console.error("Delete failed:", err);
        })
        .finally(() => setLoader(false));
  };

  const handleGenerateDraft = async () => {
    if (!selectedDoc) {
      toast.error("Please select a document first");
      return;
    }

    setLoading(true);
    try {
      // Replace with real API call
      setTimeout(() => {
        setMetadata({
          tenant: "Alphabets Childcare",
          rent: "4400",
          term: "10 years",
        });

        const draft = `AI Draft Lease Agreement for "${selectedDoc.original_file_name}":\n\nThis Lease Agreement is made between Landlord and Tenant...`;
        setAiDraft(draft);
        setEditedDraft(draft);
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error("Draft generation failed:", err);
      toast.error("Lease draft generation failed.");
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    setAiDraft(editedDraft);
    setIsEditing(false);
    setShowDiff(false);
    toast.success("Draft saved successfully!");
  };

  const handleSubmitFeedback = () => {
    if (!feedback) {
      toast.error("Please select 👍 or 👎 before submitting feedback.");
      return;
    }
    console.log("Feedback submitted:", { feedback, feedbackComment });
    setSubmittedFeedback(true);
    toast.success("Feedback submitted. Thank you!");
  };

  const renderDiff = () => {
    const diff = diffWords(aiDraft, editedDraft);
    return (
      <div className="row">
        <div
          className="col-6 border-end pe-3"
          style={{ whiteSpace: "pre-wrap" }}
        >
          <h6 className="fw-semibold text-muted">Original Draft</h6>
          {diff.map((part, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: part.removed ? "#f8d7da" : "transparent",
                textDecoration: part.removed ? "line-through" : "none",
                color: part.removed ? "red" : "inherit",
                padding: "0 2px",
              }}
            >
              {part.removed || !part.added ? part.value : ""}
            </span>
          ))}
        </div>
        <div className="col-6 ps-3" style={{ whiteSpace: "pre-wrap" }}>
          <h6 className="fw-semibold text-muted">Edited Draft</h6>
          {diff.map((part, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: part.added ? "#d4edda" : "transparent",
                color: part.added ? "green" : "inherit",
                padding: "0 2px",
              }}
            >
              {part.added || !part.removed ? part.value : ""}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container p-4">
      <h5 className="fw-bold">📑 AI Lease Drafting</h5>
      <p className="text-muted">
        Upload an LOI, review extracted terms, and generate a draft lease
        automatically.
      </p>

      <div className="border border-2 rounded-3 p-5 text-center mb-4 bg-light">
        <i className="bi bi-upload fs-1 text-primary"></i>
        <h6 className="fw-semibold mt-3">Upload Letter of Intent</h6>
        <p className="text-muted mb-3">
          Drag and drop Letter of Intent file here, or click to select file
        </p>
        <label className="btn btn-outline-primary">
          <i className="bi bi-file-earmark-arrow-up me-1"></i> Choose File
          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
        </label>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header fw-semibold">Uploaded LOI Documents</div>
        {loader ? (
          <div className="text-center p-3">
            <RAGLoader />
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {docs.length === 0 && (
              <li className="list-group-item text-muted">
                No documents uploaded yet.
              </li>
            )}
            {docs.map((doc) => (
              <li
                key={doc.file_id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <input
                    type="radio"
                    name="selectedDoc"
                    checked={selectedDoc?.file_id === doc.file_id}
                    onChange={() => setSelectedDoc(doc)}
                    className="me-2"
                  />
                  {doc.original_file_name}
                </div>
                <div className="d-flex gap-3 align-items-center">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-info"
                  >
                    Preview
                  </a>
                  <i
                    className="bi bi-trash text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(doc.file_id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
 <button
        className="btn btn-primary mb-4 d-flex align-items-center justify-content-center gap-2"
        onClick={handleGenerateDraft}
        disabled={!selectedDoc || loading}
        style={{ minWidth: "180px", height: "45px" }}
      >
        {loading ? (
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cpu fs-5"></i>
            <span className="ai-loader">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span>Generating Draft...</span>
          </div>
        ) : (
          <>
            <i className="bi bi-stars fs-5"></i>
            <span>Generate Lease Draft</span>
          </>
        )}
      </button>
      {selectedDoc && aiDraft && (
        <div className="card shadow-sm mb-4">
          <div className="card-header fw-semibold">Extracted Key Terms</div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Tenant</label>
              <input
                type="text"
                className="form-control"
                value={metadata.tenant}
                onChange={(e) =>
                  setMetadata({ ...metadata, tenant: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Rent</label>
              <input
                type="number"
                className="form-control"
                value={metadata.rent}
                onChange={(e) =>
                  setMetadata({ ...metadata, rent: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Lease Term</label>
              <input
                type="text"
                className="form-control"
                value={metadata.term}
                onChange={(e) =>
                  setMetadata({ ...metadata, term: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      )}

      {aiDraft && (
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center fw-semibold">
            AI Drafted Lease
            {!isEditing ? (
              <i
                className="bi bi-pencil-square text-primary"
                style={{ cursor: "pointer", fontSize: "1.2rem" }}
                onClick={() => setIsEditing(true)}
              />
            ) : (
              <div className="d-flex gap-2">
                <i
                  className="bi bi-eye text-info"
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                  title="Toggle Redline View"
                  onClick={() => setShowDiff(!showDiff)}
                />
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                  onClick={handleSaveDraft}
                />
                <i
                  className="bi bi-x-circle-fill text-danger"
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                  onClick={() => {
                    setIsEditing(false);
                    setShowDiff(false);
                  }}
                />
              </div>
            )}
          </div>

          <div className="card-body">
            {isEditing ? (
              showDiff ? (
                renderDiff()
              ) : (
                <textarea
                  className="form-control"
                  rows={10}
                  value={editedDraft}
                  onChange={(e) => setEditedDraft(e.target.value)}
                />
              )
            ) : (
              <div style={{ whiteSpace: "pre-wrap" }}>{aiDraft}</div>
            )}
          </div>

          {!isEditing && !submittedFeedback && (
            <div className="card-footer">
              <h6 className="fw-semibold mb-2">Provide Feedback</h6>
              <div className="d-flex gap-3 align-items-center mb-3">
                <i
                  className={`bi bi-hand-thumbs-up-fill ${feedback === "up" ? "text-success" : "text-muted"
                    }`}
                  style={{ cursor: "pointer", fontSize: "1.5rem" }}
                  onClick={() => setFeedback("up")}
                />
                <i
                  className={`bi bi-hand-thumbs-down-fill ${feedback === "down" ? "text-danger" : "text-muted"
                    }`}
                  style={{ cursor: "pointer", fontSize: "1.5rem" }}
                  onClick={() => setFeedback("down")}
                />
              </div>
              <textarea
                className="form-control mb-2"
                rows={3}
                placeholder="Add optional feedback..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
              />
              <button
                className="btn btn-outline-primary"
                onClick={handleSubmitFeedback}
              >
                Submit Feedback
              </button>
            </div>
          )}

         {submittedFeedback && (
  <div className="card-footer text-success fw-semibold">
    Thank you for your feedback!
  </div>
)}

<div ref={bottomRef}></div>
        </div>
      )}
    </div>
  );
};



// import React, { useState, useRef, useEffect } from "react";
// import { toast } from "react-toastify";
// import { diffWords } from "diff";
// import RAGLoader from "../../../Component/Loader";
// import { useDispatch } from "react-redux";
// import {
//   DeleteDrafingDoc,
//   ListDraftingLeaseDoc,
//   UploadDraftingLeaseDoc,
//   // GenerateLeaseDraft,
//   // SubmitFeedback,
//   // SaveEditedDraft,
//   // ListTemplates,
//   // UploadTemplate,
//   // DeleteTemplate,
//   // ExtractLOIData
// } from "../../../Networking/Admin/APIs/AiDraftingLeaseAPi";

// export const LeaseDraftingUpload = () => {
//   const dispatch = useDispatch();

//   const [docs, setDocs] = useState([]);
//   const [templates, setTemplates] = useState([]);
//   const [selectedDoc, setSelectedDoc] = useState(null);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [aiDraft, setAiDraft] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedDraft, setEditedDraft] = useState("");
//   const [showDiff, setShowDiff] = useState(false);
//   const [feedback, setFeedback] = useState(null);
//   const [feedbackComment, setFeedbackComment] = useState("");
//   const [submittedFeedback, setSubmittedFeedback] = useState(false);
//   const [loader, setLoader] = useState(false);
//   const [activeTab, setActiveTab] = useState("upload");
//   const [extractedData, setExtractedData] = useState(null);
//   const [draftId, setDraftId] = useState(null);

//   const [metadata, setMetadata] = useState({
//     tenant: "",
//     rent: "",
//     term: "",
//     property_address: "",
//     security_deposit: "",
//     use_clause: "",
//     tenant_improvements: ""
//   });

//   const fileInputRef = useRef(null);
//   const templateInputRef = useRef(null);

//   const fetchDocs = () => {
//     setLoader(true);
//     dispatch(ListDraftingLeaseDoc({ category: "lease" }))
//       .unwrap()
//       .then((res) => {
//         setDocs(res?.files || []);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch LOI docs:", err);
//         toast.error("Failed to fetch LOI documents");
//       })
//       .finally(() => setLoader(false));
//   };

//   const fetchTemplates = () => {
//     setLoader(true);
//     // dispatch(ListTemplates())
//     //   .unwrap()
//     //   .then((res) => {
//     //     setTemplates(res?.templates || []);
//     //     if (res?.templates?.length > 0) {
//     //       setSelectedTemplate(res.templates[0]);
//     //     }
//     //   })
//     //   .catch((err) => {
//     //     console.error("Failed to fetch templates:", err);
//     //     toast.error("Failed to fetch lease templates");
//     //   })
//     //   .finally(() => setLoader(false));
//   };

//   useEffect(() => {
//     fetchDocs();
//     fetchTemplates();
//   }, [dispatch]);

//   const validateAndUploadFile = (file, category) => {
//     const validTypes = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];
    
//     if (!validTypes.includes(file.type)) {
//       toast.error("Only PDF, DOC, or DOCX files are allowed");
//       return;
//     }

//     if (file.size > 10 * 1024 * 1024) {
//       toast.error("File must be under 10MB");
//       return;
//     }

//     const payload = { file, category };
//     setLoader(true);
//     dispatch(UploadDraftingLeaseDoc(payload))
//       .unwrap()
//       .then(() => {
//         toast.success(`${file.name} uploaded successfully`);
//         if (category === "loi") {
//           fetchDocs();
//         } else if (category === "template") {
//           fetchTemplates();
//         }
//       })
//       .catch((err) => {
//         console.error("Upload failed:", err);
//         toast.error("Upload failed");
//       })
//       .finally(() => setLoader(false));
//   };

//   const handleFileChange = (e, category) => {
//     if (e.target.files.length > 0) {
//       validateAndUploadFile(e.target.files[0], category);
//     }
//   };

//   const handleDelete = (fileId, type) => {
//     if (!window.confirm("Are you sure you want to delete this document?"))
//       return;

//     setLoader(true);
//     dispatch(DeleteDrafingDoc({ fileId, type }))
//       .unwrap()
//       .then(() => {
//         if (type === "loi") {
//           fetchDocs();
//           if (selectedDoc?.file_id === fileId) {
//             setSelectedDoc(null);
//           }
//         } else if (type === "template") {
//           fetchTemplates();
//           if (selectedTemplate?.file_id === fileId) {
//             setSelectedTemplate(templates[0] || null);
//           }
//         }
//       })
//       .catch((err) => {
//         console.error("Delete failed:", err);
//         toast.error("Delete failed");
//       })
//       .finally(() => setLoader(false));
//   };

//   const handleExtractLOIData = async () => {
//     if (!selectedDoc) {
//       toast.error("Please select an LOI document first");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = ""
//       // await dispatch(ExtractLOIData(selectedDoc.file_id)).unwrap();
//       setExtractedData(response.data);
//       setMetadata(response.metadata);
//       toast.success("LOI data extracted successfully");
//     } catch (err) {
//       console.error("LOI extraction failed:", err);
//       toast.error("Failed to extract data from LOI");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerateDraft = async () => {
//     if (!selectedDoc) {
//       toast.error("Please select an LOI document first");
//       return;
//     }

//     if (!selectedTemplate) {
//       toast.error("Please select a lease template");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         loi_id: selectedDoc.file_id,
//         template_id: selectedTemplate.file_id,
//         metadata: extractedData ? metadata : null
//       };
      
//       const response = ""
//       // await dispatch(GenerateLeaseDraft(payload)).unwrap();
//       setAiDraft(response.draft);
//       setEditedDraft(response.draft);
//       setDraftId(response.draft_id);
//       toast.success("Lease draft generated successfully");
//     } catch (err) {
//       console.error("Draft generation failed:", err);
//       toast.error("Lease draft generation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveDraft = async () => {
//     if (!draftId) {
//       toast.error("No draft to save");
//       return;
//     }

//     setLoading(true);
//     try {
//       // await dispatch(SaveEditedDraft({
//       //   draft_id: draftId,
//       //   content: editedDraft
//       // })).unwrap();
      
//       setAiDraft(editedDraft);
//       setIsEditing(false);
//       setShowDiff(false);
//       toast.success("Draft saved successfully!");
//     } catch (err) {
//       console.error("Save failed:", err);
//       toast.error("Failed to save draft");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitFeedback = async () => {
//     if (!feedback) {
//       toast.error("Please select 👍 or 👎 before submitting feedback.");
//       return;
//     }

//     if (!draftId) {
//       toast.error("No draft associated with this feedback");
//       return;
//     }

//     setLoading(true);
//     try {
//       // await dispatch(SubmitFeedback({
//       //   draft_id: draftId,
//       //   feedback,
//       //   comment: feedbackComment
//       // })).unwrap();
      
//       setSubmittedFeedback(true);
//       toast.success("Feedback submitted. Thank you!");
//     } catch (err) {
//       console.error("Feedback submission failed:", err);
//       toast.error("Failed to submit feedback");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderDiff = () => {
//     const diff = diffWords(aiDraft, editedDraft);
//     return (
//       <div className="row">
//         <div
//           className="col-6 border-end pe-3"
//           style={{ whiteSpace: "pre-wrap" }}
//         >
//           <h6 className="fw-semibold text-muted">Original Draft</h6>
//           {diff.map((part, idx) => (
//             <span
//               key={idx}
//               style={{
//                 backgroundColor: part.removed ? "#f8d7da" : "transparent",
//                 textDecoration: part.removed ? "line-through" : "none",
//                 color: part.removed ? "red" : "inherit",
//                 padding: "0 2px",
//               }}
//             >
//               {part.removed || !part.added ? part.value : ""}
//             </span>
//           ))}
//         </div>
//         <div className="col-6 ps-3" style={{ whiteSpace: "pre-wrap" }}>
//           <h6 className="fw-semibold text-muted">Edited Draft</h6>
//           {diff.map((part, idx) => (
//             <span
//               key={idx}
//               style={{
//                 backgroundColor: part.added ? "#d4edda" : "transparent",
//                 color: part.added ? "green" : "inherit",
//                 padding: "0 2px",
//               }}
//             >
//               {part.added || !part.removed ? part.value : ""}
//             </span>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const renderMetadataFields = () => {
//     return (
//       <div className="row">
//         <div className="col-md-6">
//           <div className="mb-3">
//             <label className="form-label">Tenant Name</label>
//             <input
//               type="text"
//               className="form-control"
//               value={metadata.tenant}
//               onChange={(e) =>
//                 setMetadata({ ...metadata, tenant: e.target.value })
//               }
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Monthly Rent ($)</label>
//             <input
//               type="number"
//               className="form-control"
//               value={metadata.rent}
//               onChange={(e) =>
//                 setMetadata({ ...metadata, rent: e.target.value })
//               }
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Lease Term</label>
//             <input
//               type="text"
//               className="form-control"
//               value={metadata.term}
//               onChange={(e) =>
//                 setMetadata({ ...metadata, term: e.target.value })
//               }
//               placeholder="e.g., 5 years with 2-year option"
//             />
//           </div>
//         </div>
//         <div className="col-md-6">
//           <div className="mb-3">
//             <label className="form-label">Property Address</label>
//             <input
//               type="text"
//               className="form-control"
//               value={metadata.property_address}
//               onChange={(e) =>
//                 setMetadata({ ...metadata, property_address: e.target.value })
//               }
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Security Deposit ($)</label>
//             <input
//               type="number"
//               className="form-control"
//               value={metadata.security_deposit}
//               onChange={(e) =>
//                 setMetadata({ ...metadata, security_deposit: e.target.value })
//               }
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Use Clause</label>
//             <textarea
//               className="form-control"
//               rows="2"
//               value={metadata.use_clause}
//               onChange={(e) =>
//                 setMetadata({ ...metadata, use_clause: e.target.value })
//               }
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Tenant Improvements</label>
//             <textarea
//               className="form-control"
//               rows="2"
//               value={metadata.tenant_improvements}
//               onChange={(e) =>
//                 setMetadata({ ...metadata, tenant_improvements: e.target.value })
//               }
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container p-4">
//       <h5 className="fw-bold">📑 AI Lease Drafting System</h5>
//       <p className="text-muted">
//         Upload an LOI, extract key terms, select a template, and generate a draft lease automatically.
//       </p>

//       <ul className="nav nav-tabs mb-4">
//         <li className="nav-item">
//           <button 
//             className={`nav-link ${activeTab === "upload" ? "active" : ""}`}
//             onClick={() => setActiveTab("upload")}
//           >
//             Upload Documents
//           </button>
//         </li>
//         <li className="nav-item">
//           <button 
//             className={`nav-link ${activeTab === "draft" ? "active" : ""}`}
//             onClick={() => setActiveTab("draft")}
//             disabled={!selectedDoc}
//           >
//             Generate Draft
//           </button>
//         </li>
//         <li className="nav-item">
//           <button 
//             className={`nav-link ${activeTab === "templates" ? "active" : ""}`}
//             onClick={() => setActiveTab("templates")}
//           >
//             Manage Templates
//           </button>
//         </li>
//       </ul>

//       {activeTab === "upload" && (
//         <>
//           <div className="border border-2 rounded-3 p-5 text-center mb-4 bg-light">
//             <i className="bi bi-upload fs-1 text-primary"></i>
//             <h6 className="fw-semibold mt-3">Upload Letter of Intent</h6>
//             <p className="text-muted mb-3">
//               Drag and drop Letter of Intent file here, or click to select file
//             </p>
//             <label className="btn btn-outline-primary">
//               <i className="bi bi-file-earmark-arrow-up me-1"></i> Choose LOI File
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 hidden
//                 onChange={(e) => handleFileChange(e, "loi")}
//                 accept=".pdf,.doc,.docx"
//               />
//             </label>
//           </div>

//           <div className="card shadow-sm mb-4">
//             <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
//               <span>Uploaded LOI Documents</span>
//               <button 
//                 className="btn btn-sm btn-outline-secondary"
//                 onClick={fetchDocs}
//               >
//                 <i className="bi bi-arrow-clockwise"></i> Refresh
//               </button>
//             </div>
//             {loader ? (
//               <div className="text-center p-5">
//                 <RAGLoader />
//               </div>
//             ) : (
//               <ul className="list-group list-group-flush">
//                 {docs.length === 0 && (
//                   <li className="list-group-item text-muted text-center py-4">
//                     <i className="bi bi-inbox fs-1 d-block mb-2"></i>
//                     No LOI documents uploaded yet.
//                   </li>
//                 )}
//                 {docs.map((doc) => (
//                   <li
//                     key={doc.file_id}
//                     className="list-group-item d-flex justify-content-between align-items-center"
//                   >
//                     <div>
//                       <input
//                         type="radio"
//                         name="selectedDoc"
//                         checked={selectedDoc?.file_id === doc.file_id}
//                         onChange={() => setSelectedDoc(doc)}
//                         className="me-2"
//                       />
//                       {doc.original_file_name}
//                     </div>
//                     <div className="d-flex gap-3 align-items-center">
//                       <a
//                         href={doc.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="btn btn-sm btn-outline-info"
//                       >
//                         <i className="bi bi-eye"></i> Preview
//                       </a>
//                       <button
//                         className="btn btn-sm btn-outline-warning"
//                         onClick={() => handleExtractLOIData()}
//                         disabled={!selectedDoc || selectedDoc.file_id !== doc.file_id}
//                       >
//                         <i className="bi bi-gear"></i> Extract Data
//                       </button>
//                       <button
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={() => handleDelete(doc.file_id, "loi")}
//                       >
//                         <i className="bi bi-trash"></i>
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </>
//       )}

//       {activeTab === "draft" && selectedDoc && (
//         <>
//           {extractedData && (
//             <div className="card shadow-sm mb-4">
//               <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
//                 <span>Extracted Key Terms</span>
//                 <button 
//                   className="btn btn-sm btn-outline-primary"
//                   onClick={() => setExtractedData(null)}
//                 >
//                   <i className="bi bi-pencil"></i> Edit
//                 </button>
//               </div>
//               <div className="card-body">
//                 {renderMetadataFields()}
//               </div>
//             </div>
//           )}

//           <div className="card shadow-sm mb-4">
//             <div className="card-header fw-semibold">Select Lease Template</div>
//             <div className="card-body">
//               {templates.length === 0 ? (
//                 <div className="alert alert-warning">
//                   No lease templates available. Please upload templates in the Manage Templates tab.
//                 </div>
//               ) : (
//                 <div className="list-group">
//                   {templates.map((template) => (
//                     <div
//                       key={template.file_id}
//                       className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedTemplate?.file_id === template.file_id ? "active" : ""}`}
//                       onClick={() => setSelectedTemplate(template)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <div>
//                         <input
//                           type="radio"
//                           name="selectedTemplate"
//                           checked={selectedTemplate?.file_id === template.file_id}
//                           onChange={() => setSelectedTemplate(template)}
//                           className="me-2"
//                         />
//                         {template.original_file_name}
//                       </div>
//                       <a
//                         href={template.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="btn btn-sm btn-outline-light"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <i className="bi bi-eye"></i> Preview
//                       </a>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           <button
//             className="btn btn-primary mb-4 d-flex align-items-center justify-content-center gap-2"
//             onClick={handleGenerateDraft}
//             disabled={!selectedDoc || !selectedTemplate || loading}
//             style={{ minWidth: "180px", height: "45px" }}
//           >
//             {loading ? (
//               <div className="d-flex align-items-center gap-2">
//                 <i className="bi bi-cpu fs-5"></i>
//                 <span className="ai-loader">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </span>
//                 <span>Generating Draft...</span>
//               </div>
//             ) : (
//               <>
//                 <i className="bi bi-stars fs-5"></i>
//                 <span>Generate Lease Draft</span>
//               </>
//             )}
//           </button>
//         </>
//       )}

//       {activeTab === "templates" && (
//         <>
//           <div className="border border-2 rounded-3 p-5 text-center mb-4 bg-light">
//             <i className="bi bi-file-earmark-plus fs-1 text-primary"></i>
//             <h6 className="fw-semibold mt-3">Upload Lease Template</h6>
//             <p className="text-muted mb-3">
//               Upload a standard lease template to use for generating drafts
//             </p>
//             <label className="btn btn-outline-primary">
//               <i className="bi bi-file-earmark-arrow-up me-1"></i> Choose Template File
//               <input
//                 type="file"
//                 ref={templateInputRef}
//                 hidden
//                 onChange={(e) => handleFileChange(e, "template")}
//                 accept=".doc,.docx,.pdf"
//               />
//             </label>
//           </div>

//           <div className="card shadow-sm mb-4">
//             <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
//               <span>Available Lease Templates</span>
//               <button 
//                 className="btn btn-sm btn-outline-secondary"
//                 onClick={fetchTemplates}
//               >
//                 <i className="bi bi-arrow-clockwise"></i> Refresh
//               </button>
//             </div>
//             {loader ? (
//               <div className="text-center p-5">
//                 <RAGLoader />
//               </div>
//             ) : (
//               <ul className="list-group list-group-flush">
//                 {templates.length === 0 && (
//                   <li className="list-group-item text-muted text-center py-4">
//                     <i className="bi bi-inbox fs-1 d-block mb-2"></i>
//                     No lease templates uploaded yet.
//                   </li>
//                 )}
//                 {templates.map((template) => (
//                   <li
//                     key={template.file_id}
//                     className="list-group-item d-flex justify-content-between align-items-center"
//                   >
//                     <div>
//                       <i className="bi bi-file-earmark-text me-2"></i>
//                       {template.original_file_name}
//                     </div>
//                     <div className="d-flex gap-2 align-items-center">
//                       <a
//                         href={template.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="btn btn-sm btn-outline-info"
//                       >
//                         <i className="bi bi-eye"></i> Preview
//                       </a>
//                       <button
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={() => handleDelete(template.file_id, "template")}
//                       >
//                         <i className="bi bi-trash"></i>
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </>
//       )}

//       {aiDraft && (
//         <div className="card shadow-sm mt-4">
//           <div className="card-header d-flex justify-content-between align-items-center fw-semibold">
//             <span>AI Drafted Lease Agreement</span>
//             {!isEditing ? (
//               <button
//                 className="btn btn-outline-primary btn-sm"
//                 onClick={() => setIsEditing(true)}
//               >
//                 <i className="bi bi-pencil-square me-1"></i> Edit Draft
//               </button>
//             ) : (
//               <div className="d-flex gap-2">
//                 <button
//                   className="btn btn-outline-info btn-sm"
//                   onClick={() => setShowDiff(!showDiff)}
//                 >
//                   <i className="bi bi-eye me-1"></i> {showDiff ? "Hide" : "Show"} Redline
//                 </button>
//                 <button
//                   className="btn btn-outline-success btn-sm"
//                   onClick={handleSaveDraft}
//                 >
//                   <i className="bi bi-check-circle me-1"></i> Save
//                 </button>
//                 <button
//                   className="btn btn-outline-danger btn-sm"
//                   onClick={() => {
//                     setIsEditing(false);
//                     setShowDiff(false);
//                   }}
//                 >
//                   <i className="bi bi-x-circle me-1"></i> Cancel
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="card-body">
//             {isEditing ? (
//               showDiff ? (
//                 renderDiff()
//               ) : (
//                 <textarea
//                   className="form-control"
//                   rows={15}
//                   value={editedDraft}
//                   onChange={(e) => setEditedDraft(e.target.value)}
//                   style={{ fontFamily: "monospace", fontSize: "14px" }}
//                 />
//               )
//             ) : (
//               <div 
//                 style={{ 
//                   whiteSpace: "pre-wrap", 
//                   fontFamily: "monospace", 
//                   fontSize: "14px",
//                   maxHeight: "500px",
//                   overflowY: "auto"
//                 }}
//               >
//                 {aiDraft}
//               </div>
//             )}
//           </div>

//           {!isEditing && !submittedFeedback && (
//             <div className="card-footer">
//               <h6 className="fw-semibold mb-2">Provide Feedback on this Draft</h6>
//               <div className="d-flex gap-3 align-items-center mb-3">
//                 <button
//                   className={`btn ${feedback === "up" ? "btn-success" : "btn-outline-success"}`}
//                   onClick={() => setFeedback("up")}
//                 >
//                   <i className="bi bi-hand-thumbs-up me-1"></i> Good Draft
//                 </button>
//                 <button
//                   className={`btn ${feedback === "down" ? "btn-danger" : "btn-outline-danger"}`}
//                   onClick={() => setFeedback("down")}
//                 >
//                   <i className="bi bi-hand-thumbs-down me-1"></i> Needs Improvement
//                 </button>
//               </div>
//               <textarea
//                 className="form-control mb-2"
//                 rows={3}
//                 placeholder="Please provide specific feedback on what worked well and what needs improvement..."
//                 value={feedbackComment}
//                 onChange={(e) => setFeedbackComment(e.target.value)}
//               />
//               <button
//                 className="btn btn-primary"
//                 onClick={handleSubmitFeedback}
//                 disabled={!feedback}
//               >
//                 Submit Feedback
//               </button>
//             </div>
//           )}

//           {submittedFeedback && (
//             <div className="card-footer text-success fw-semibold">
//               <i className="bi bi-check-circle-fill me-2"></i>
//               Thank you for your feedback! It will help improve the AI system.
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };