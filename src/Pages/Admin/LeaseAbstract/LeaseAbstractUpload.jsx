import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import RAGLoader from "../../../Component/Loader";
import { useDispatch } from "react-redux";
import {
  DeleteAbstractDoc,
  ListAbstractLeaseDoc,
  UploadAbstractLeaseDoc,
} from "../../../Networking/Admin/APIs/AiAbstractLeaseAPi";
import { DownloadGeneratedLease1 } from "../../../Networking/Admin/APIs/AiInslightsAPi";

export const LeaseAbstractUpload = () => {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const [docs, setDocs] = useState([]);
  const [aiDraft, setAiDraft] = useState(null);
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  // Global loader for fetch/upload list operations
  const [loader, setLoader] = useState(false);

  // Per-item loader: { [file_id]: boolean }
  const [itemLoading, setItemLoading] = useState({});

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiDraft, submittedFeedback]);

  const fetchDocs = () => {
    setLoader(true);
    dispatch(ListAbstractLeaseDoc({ category: "lease" }))
      .unwrap()
      .then((res) => {
        setDocs(res?.files || []);
      })
      .catch((err) => {
        console.error("Failed to fetch lease docs:", err);
        toast.error("Failed to fetch documents");
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

    if (file.size > 30 * 1024 * 1024) {
      toast.error("File must be under 30MB");
      return;
    }

    const payload = { file, category: "lease" };
    setLoader(true);
    dispatch(UploadAbstractLeaseDoc(payload))
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

  // helper to set per-item loading
  const setItemLoadingState = (fileId, value) =>
    setItemLoading((prev) => ({ ...prev, [fileId]: value }));

  const handleDelete = (fileId) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    setItemLoadingState(fileId, true);
    dispatch(DeleteAbstractDoc({ fileId }))
      .unwrap()
      .then(() => {
        toast.success("Document deleted");
        // refresh list
        fetchDocs();
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        toast.error("Delete failed");
      })
      .finally(() => setItemLoadingState(fileId, false));
  };

  const handleDownloadDraft = async (file_id) => {
    if (!file_id) {
      toast.error("Please select a document first");
      return;
    }

    setItemLoadingState(file_id, true);
    try {
      const res = await dispatch(DownloadGeneratedLease1(file_id)).unwrap();

      if (!res || !res.download_url) {
        toast.error("Download Url not found");
      } else {
        window.open(res.download_url, "_blank");
      }
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Download failed");
    } finally {
      setItemLoadingState(file_id, false);
    }
  };

  return (
    <>
      <div
        className="header-bg {
-bg d-flex justify-content-start px-3 align-items-center sticky-header"
      >
        <h5 className="mb-0 text-light"> AI Lease Abstract</h5>
      </div>

      <div className="container-fuild p-3">
        <p className="text-muted">
          Upload a Lease, review extracted terms, and generate a draft lease
          automatically.
        </p>

        <div className="border border-2 rounded-3 py-5 text-center mb-4 bg-light">
          <i className="bi bi-upload fs-1 text-primary"></i>
          <h6 className="fw-semibold mt-3">Upload Lease Agreement</h6>
          <p className="text-muted mb-3">
            Drag and drop Lease Agreement file here, or click to select file
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
          <div className="card-header fw-semibold">
            Uploaded Lease Documents
          </div>

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

              {docs.map((doc) => {
                const isItemLoading = !!itemLoading[doc.file_id];
                return (
                  <li
                    key={doc.file_id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>{doc.original_file_name}</div>

                    <div className="d-flex gap-3 align-items-center">
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => handleDownloadDraft(doc.file_id)}
                        disabled={isItemLoading}
                      >
                        {isItemLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                            />
                            Loading...
                          </>
                        ) : (
                          "Download"
                        )}
                      </button>

                      <i
                        className={`bi bi-trash ${
                          isItemLoading ? "text-muted" : "text-danger"
                        }`}
                        style={{
                          cursor: isItemLoading ? "not-allowed" : "pointer",
                        }}
                        onClick={() =>
                          !isItemLoading && handleDelete(doc.file_id)
                        }
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

// import React, { useState, useRef, useEffect } from "react";
// import { toast } from "react-toastify";
// import { diffWords } from "diff";
// import RAGLoader from "../../../Component/Loader";
// import { useDispatch } from "react-redux";
// import {
//   DeleteAbstractDoc,
//   // getMetaData,
//   // getTextData,
//   // getTextViewData,
//   ListAbstractLeaseDoc,
//   // UpdateDraftingtext,
//   UploadAbstractLeaseDoc,
// } from "../../../Networking/Admin/APIs/AiAbstractLeaseAPi";
// import { baseURL } from "../../../Networking/NWconfig";
// import { DownloadGeneratedLease } from "../../../Networking/Admin/APIs/LeaseApi";

// export const LeaseAbstractUpload = () => {
//   const dispatch = useDispatch();
//   const bottomRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [docs, setDocs] = useState([]);
//   // const [selectedDoc, setSelectedDoc] = useState(null);
//   // const [loading, setLoading] = useState(false);
//   const [aiDraft, setAiDraft] = useState(null);
//   // const [isEditing, setIsEditing] = useState(false);
//   // const [editedDraft, setEditedDraft] = useState("");
//   // const [showDiff, setShowDiff] = useState(false);
//   // const [feedback, setFeedback] = useState(null);
//   // const [feedbackComment, setFeedbackComment] = useState("");
//   const [submittedFeedback, setSubmittedFeedback] = useState(false);
//   const [loader, setLoader] = useState(false);
//   // const [updateloading, setUpadteLoading] = useState(false);
//   // const [showModal, setShowModal] = useState(false);
//   // const [previewData, setPreviewData] = useState("");

//   // const [metadata, setMetadata] = useState({
//   //   tenant_name: "",
//   //   landlord_name: "",
//   //   property_address: "",
//   //   lease_term: "",
//   //   rent_amount: "",
//   //   square_footage: "",
//   //   commencement_date: "",
//   //   expiration_date: "",
//   //   security_deposit: "",
//   //   use_clause: "",
//   //   tenant_improvements: "",
//   //   additional_terms: "",
//   // });

//   useEffect(() => {
//     if (bottomRef.current) {
//       bottomRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [aiDraft, submittedFeedback]);

//   const fetchDocs = () => {
//     setLoader(true);
//     dispatch(ListAbstractLeaseDoc({ category: "lease" }))
//       .unwrap()
//       .then((res) => {
//         setDocs(res?.files || []);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch lease docs:", err);
//       })
//       .finally(() => setLoader(false));
//   };

//   useEffect(() => {
//     fetchDocs();
//   }, [dispatch]);

//   const validateAndUploadFile = (file) => {
//     if (
//       ![
//         "application/pdf",
//         "application/msword",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ].includes(file.type)
//     ) {
//       toast.error("Only PDF, DOC, or DOCX files are allowed");
//       return;
//     }

//     if (file.size > 30 * 1024 * 1024) {
//       toast.error("File must be under 30MB");
//       return;
//     }

//     const payload = { file, category: "lease" };
//     setLoader(true);
//     dispatch(UploadAbstractLeaseDoc(payload))
//       .unwrap()
//       .then(() => {
//         toast.success(`${file.name} uploaded successfully`);
//         fetchDocs();
//       })
//       .catch((err) => {
//         console.error("Upload failed:", err);
//       })
//       .finally(() => setLoader(false));
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) {
//       validateAndUploadFile(e.target.files[0]);
//     }
//   };

//   // const handlefilePreview = async (fileId) => {
//   //   try {
//   //     setLoader(true);
//   //     const [Textdata1] = await Promise.all([
//   //       dispatch(getTextViewData(fileId)).unwrap(),
//   //     ]);
//   //     setPreviewData(Textdata1);
//   //     setShowModal(true);
//   //   } catch (error) {
//   //     console.error("Failed to fetch preview data:", error);
//   //   } finally {
//   //     setLoader(false);
//   //   }
//   // };

//   const handleDelete = (fileId) => {
//     if (!window.confirm("Are you sure you want to delete this document?"))
//       return;

//     setLoader(true);
//     dispatch(DeleteAbstractDoc({ fileId }))
//       .unwrap()
//       .then(() => {
//         fetchDocs();
//       })
//       .catch((err) => {
//         console.error("Delete failed:", err);
//       })
//       .finally(() => setLoader(false));
//   };

//   // const handleGenerateDraft = async (id) => {
//   //   if (!selectedDoc) {
//   //     toast.error("Please select a document first");
//   //     return;
//   //   }

//   //   setLoading(true);
//   //   try {
//   //     const [Metadata, Textdata] = await Promise.all([
//   //       dispatch(getMetaData(id)).unwrap(),
//   //       dispatch(getTextData(id)).unwrap(),
//   //     ]);
//   //     setTimeout(() => {
//   //       setMetadata({
//   //         tenant_name: Metadata.structured_metadata.tenant_name || "",
//   //         landlord_name: Metadata.structured_metadata.landlord_name || "",
//   //         property_address: Metadata.structured_metadata.property_address || "",
//   //         lease_term: Metadata.structured_metadata.lease_term || "",
//   //         rent_amount: Metadata.structured_metadata.rent_amount || "",
//   //         square_footage: Metadata.structured_metadata.square_footage || "",
//   //         commencement_date:
//   //           Metadata.structured_metadata.commencement_date || "",
//   //         expiration_date: Metadata.structured_metadata.expiration_date || "",
//   //         security_deposit: Metadata.structured_metadata.security_deposit || "",
//   //         use_clause: Metadata.structured_metadata.use_clause || "",
//   //         tenant_improvements:
//   //           Metadata.structured_metadata.tenant_improvements || "",
//   //         additional_terms: Metadata.structured_metadata.additional_terms || "",
//   //       });

//   //       setAiDraft(Textdata);
//   //       setEditedDraft(Textdata);
//   //       setLoading(false);
//   //     }, 2000);
//   //   } catch (error) {
//   //     console.error("Error fetching data:", error);
//   //     toast.error("Failed to generate lease draft");
//   //     setLoading(false);
//   //   }
//   // };

//   // const handleSaveDraft = async (id) => {
//   //   setUpadteLoading(true);
//   //   try {
//   //     const json = {
//   //       file_id: id,
//   //       text: editedDraft,
//   //     };
//   //     await dispatch(UpdateDraftingtext(json)).unwrap();
//   //     toast.success("Draft updated successfully");
//   //     setAiDraft(editedDraft);
//   //     setIsEditing(false);
//   //     setShowDiff(false);
//   //   } catch (error) {
//   //     console.error("Error saving draft:", error);
//   //     toast.error("Failed to update draft");
//   //   } finally {
//   //     setUpadteLoading(false);
//   //   }
//   // };

//   // const handleSubmitFeedback = () => {
//   //   if (!feedback) {
//   //     toast.error("Please select 👍 or 👎 before submitting feedback.");
//   //     return;
//   //   }
//   //   setSubmittedFeedback(true);
//   //   toast.success("Feedback submitted. Thank you!");
//   // };

//   const handleDownloadDraft = async (file_id) => {
//     console.log(file_id, "file_id");

//     if (!file_id) {
//       toast.error("Please select a document first");
//       return;
//     }

//     try {
//       const res = await dispatch(DownloadGeneratedLease(file_id)).unwrap();

//       if (!file_id) {
//         toast.error("Download URL not found");
//         return;
//       }

//       window.open(res.download_url, "_blank");
//     } catch (err) {
//       toast.error(err || "Download failed");
//     }
//   };

//   // const renderDiff = () => {
//   //   const diff = diffWords(aiDraft, editedDraft);
//   //   return (
//   //     <div className="row">
//   //       <div
//   //         className="col-6 border-end pe-3"
//   //         style={{ whiteSpace: "pre-wrap" }}
//   //       >
//   //         <h6 className="fw-semibold text-muted">Original Draft</h6>
//   //         {diff.map((part, idx) => (
//   //           <span
//   //             key={idx}
//   //             style={{
//   //               backgroundColor: part.removed ? "#f8d7da" : "transparent",
//   //               textDecoration: part.removed ? "line-through" : "none",
//   //               color: part.removed ? "red" : "inherit",
//   //               padding: "0 2px",
//   //             }}
//   //           >
//   //             {part.removed || !part.added ? part.value : ""}
//   //           </span>
//   //         ))}
//   //       </div>
//   //       <div className="col-6 ps-3" style={{ whiteSpace: "pre-wrap" }}>
//   //         <h6 className="fw-semibold text-muted">Edited Draft</h6>
//   //         {diff.map((part, idx) => (
//   //           <span
//   //             key={idx}
//   //             style={{
//   //               backgroundColor: part.added ? "#d4edda" : "transparent",
//   //               color: part.added ? "green" : "inherit",
//   //               padding: "0 2px",
//   //             }}
//   //           >
//   //             {part.added || !part.removed ? part.value : ""}
//   //           </span>
//   //         ))}
//   //       </div>
//   //     </div>
//   //   );
//   // };

//   return (
//     <>
//       <div
//         className="header-bg {
// -bg d-flex justify-content-start px-3 align-items-center sticky-header"
//       >
//         <h5 className="mb-0 text-light"> AI Lease Abstract</h5>
//       </div>
//       <div className="container-fuild p-3">
//         <p className="text-muted">
//           Upload an LOI, review extracted terms, and generate a draft lease
//           automatically.
//         </p>

//         <div className="border border-2 rounded-3 py-5 text-center mb-4 bg-light">
//           <i className="bi bi-upload fs-1 text-primary"></i>
//           <h6 className="fw-semibold mt-3">Upload Lease Agreement</h6>
//           <p className="text-muted mb-3">
//             Drag and drop Lease Agreement file here, or click to select file
//           </p>
//           <label className="btn btn-outline-primary">
//             <i className="bi bi-file-earmark-arrow-up me-1"></i> Choose File
//             <input
//               type="file"
//               ref={fileInputRef}
//               hidden
//               onChange={handleFileChange}
//               accept=".pdf,.doc,.docx"
//             />
//           </label>
//         </div>

//         <div className="card shadow-sm mb-4">
//           <div className="card-header fw-semibold">Uploaded LOI Documents</div>
//           {loader ? (
//             <div className="text-center p-3">
//               <RAGLoader />
//             </div>
//           ) : (
//             <ul className="list-group list-group-flush">
//               {docs.length === 0 && (
//                 <li className="list-group-item text-muted">
//                   No documents uploaded yet.
//                 </li>
//               )}
//               {docs.map((doc) => (
//                 <li
//                   key={doc.file_id}
//                   className="list-group-item d-flex justify-content-between align-items-center"
//                 >
//                   <div>{doc.original_file_name}</div>
//                   <div className="d-flex gap-3 align-items-center">
//                     <div className="d-flex gap-3 align-items-center">
//                       <button
//                         className="btn btn-sm btn-outline-info"
//                         onClick={() => handleDownloadDraft(doc.file_id)}
//                         disabled={loader} // optional: disable when loading
//                       >
//                         {loader ? "Loading..." : "Download"}
//                       </button>

//                       <i
//                         className="bi bi-trash text-danger"
//                         style={{ cursor: loader ? "not-allowed" : "pointer" }}
//                         onClick={() => !loader && handleDelete(doc.file_id)}
//                       />
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };
