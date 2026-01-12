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
import Pagination from "../../../Component/pagination";

export const LeaseAbstractUpload = () => {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const [docs, setDocs] = useState([]);
  const [allDocs, setAllDocs] = useState([]);
  const [loader, setLoader] = useState(false);
  const [itemLoading, setItemLoading] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const fetchDocs = () => {
    setLoader(true);
    dispatch(ListAbstractLeaseDoc({ category: "lease" }))
      .unwrap()
      .then((res) => {
        const files = res?.files || [];
        setAllDocs(files);
        setTotalItems(files.length);

        applyPagination(files, currentPage, itemsPerPage);
      })
      .catch((err) => {
        console.error("Failed to fetch lease docs:", err);
        // toast.error("Failed to fetch documents");
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    fetchDocs();
  }, [dispatch]);


  useEffect(() => {
    if (allDocs.length > 0) {
      applyPagination(allDocs, currentPage, itemsPerPage);
    }
  }, [currentPage, itemsPerPage, allDocs]);

  const applyPagination = (documents, page, perPage) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedDocs = documents.slice(startIndex, endIndex);
    setDocs(paginatedDocs);
  };

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
        // toast.error("Upload failed");
      })
      .finally(() => setLoader(false));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      validateAndUploadFile(e.target.files[0]);
    }
  };


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
        <h5 className="mb-0 text-light mx-4"> AI Lease Abstract</h5>
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
          <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
            <span>Uploaded Lease Documents</span>
          </div>

          {loader ? (
            <div className="p-1 text-center">
              <p className="text-muted mt-2">Loading files...</p>
            </div>

          ) : (
            <>
              <ul className="list-group list-group-flush">
                {docs.length === 0 && (
                  <li className="list-group-item text-muted text-center py-4">
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
                      <div className="text-truncate" style={{ maxWidth: "60%" }}>
                        {doc.original_file_name}
                      </div>

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
                          className={`bi bi-trash ${isItemLoading ? "text-muted" : "text-danger"
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


              {allDocs && (
                <Pagination
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(value) => {
                    setItemsPerPage(value);
                    setCurrentPage(1);
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
