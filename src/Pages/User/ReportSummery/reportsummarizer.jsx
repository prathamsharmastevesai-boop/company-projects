import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import RAGLoader from "../../../Component/Loader";
import { useDispatch } from "react-redux";
import {
  DeleteAbstractDoc,
  ListAbstractLeaseDoc,
  UploadReportGenerator,
} from "../../../Networking/Admin/APIs/AiAbstractLeaseAPi";
import { baseURL } from "../../../Networking/NWconfig";
import { useNavigate } from "react-router-dom";

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const SummeryUpload = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [docs, setDocs] = useState([]);
  const [loader, setLoader] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const fetchDocs = () => {
    setLoader(true);
    dispatch(ListAbstractLeaseDoc({ category: "report_generation" }))
      .unwrap()
      .then((res) => setDocs(res?.files || []))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load documents.");
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    fetchDocs();
  }, [dispatch]);

  const handleOpenChat = (doc) => {
    navigate("/ReportChat", {
      state: {
        fileId: doc.file_id,
        fileName: doc.original_file_name,
        fileUrl: baseURL + doc.file_url,
      },
    });
  };

  const handlePreview = async (doc) => {
    try {
      const token = sessionStorage.getItem("access_token");

      if (!token) {
        toast.error("Authentication token missing.");
        return;
      }

      const url = /^https?:\/\//i.test(doc.file_url)
        ? doc.file_url
        : baseURL + doc.file_url;

      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error("PDF FETCH ERROR:", resp.status, text);
        toast.error("Server returned an invalid PDF.");
        return;
      }

      const blob = await resp.blob();

      if (!blob.type.includes("pdf")) {
        console.error("INVALID PDF BLOB RECEIVED:", blob);
        toast.error("Server did not return a valid PDF.");
        return;
      }

      const blobUrl = URL.createObjectURL(blob);

      setPdfBlobUrl(blobUrl);
      setPdfName(doc.original_file_name);
      setPageNumber(1);
      setNumPages(null);
      setShowPreview(true);
    } catch (err) {
      console.error("PREVIEW ERROR:", err);
      toast.error("Unable to preview file.");
    }
  };

  const closePreview = () => {
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setShowPreview(false);
    setPdfBlobUrl(null);
    setPdfName("");
    setNumPages(null);
    setPageNumber(1);
  };

  const validateAndUploadFile = (file) => {
    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Only PDF files are allowed.");
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      toast.error("File must be under 30 MB.");
      return;
    }

    const payload = { file, category: "report_generation" };
    setLoader(true);
    dispatch(UploadReportGenerator(payload))
      .unwrap()
      .then(() => {
        fetchDocs();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoader(false));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndUploadFile(file);
      e.target.value = "";
    }
  };

  const handleDelete = (fileId) => {
    if (!window.confirm("Delete this document?")) return;

    setLoader(true);
    dispatch(DeleteAbstractDoc({ fileId }))
      .unwrap()
      .then(() => {
        fetchDocs();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoader(false));
  };

  return (
    <>
      {" "}
      <div
        className="header-bg {
-bg d-flex justify-content-start px-3 align-items-center sticky-header"
      >
        <h5 className="mb-0 text-light">Report Summarizer</h5>
      </div>
      <div className="container-fuild p-3">
        <p className="text-muted">Upload a PDF report to summarize</p>

        <div className="border border-2 rounded-3 py-5 text-center mb-4 bg-light">
          <i className="bi bi-upload fs-1 text-primary"></i>
          <h6 className="fw-semibold mt-3">Upload Report (PDF Only)</h6>
          <p className="text-muted mb-3">Drag & drop or click to select</p>
          <p className="text-muted mb-3">Max 30 MB</p>

          <label className="btn btn-outline-primary">
            <i className="bi bi-file-earmark-arrow-up me-1"></i> Choose File
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept=".pdf"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header fw-semibold">Uploaded Reports</div>

          {loader ? (
            <div className="text-center p-3">
              <RAGLoader />
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {docs.length === 0 ? (
                <li className="list-group-item text-muted">
                  No documents uploaded yet.
                </li>
              ) : (
                docs.map((doc) => (
                  <li
                    key={doc.file_id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div
                      className="text-truncate"
                      style={{ maxWidth: "300px" }}
                    >
                      {doc.original_file_name}
                    </div>

                    <div className="d-flex gap-2 align-items-center">
                      <button
                        onClick={() => handleOpenChat(doc)}
                        className="btn btn-sm btn-outline-secondary"
                        title="Chat"
                      >
                        💬 Chat
                      </button>

                      {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(doc);
                      }}
                      className="btn btn-sm btn-outline-primary"
                      title="Preview"
                    >
                      Preview
                    </button> */}

                      <i
                        className="bi bi-trash text-danger"
                        style={{ cursor: "pointer", fontSize: "1.1rem" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(doc.file_id);
                        }}
                        title="Delete"
                      />
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {showPreview && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
            tabIndex={-1}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5
                    className="modal-title text-truncate"
                    style={{ maxWidth: "500px" }}
                  >
                    Preview: {pdfName}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closePreview}
                    aria-label="Close"
                  />
                </div>

                <div
                  className="modal-body p-0 d-flex flex-column"
                  style={{ height: "80vh" }}
                >
                  <div className="flex-grow-1 overflow-auto bg-white p-2">
                    {pdfBlobUrl ? (
                      <Document
                        file={pdfBlobUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        onLoadError={(err) =>
                          console.error("PDF LOAD ERROR:", err)
                        }
                        loading={
                          <div className="text-center p-4">
                            <RAGLoader />
                          </div>
                        }
                        error={
                          <div className="text-danger p-3">
                            Failed to load PDF.
                          </div>
                        }
                      >
                        <Page
                          pageNumber={pageNumber}
                          width={Math.min(window.innerWidth * 0.85, 900)}
                          renderTextLayer
                          renderAnnotationLayer
                        />
                      </Document>
                    ) : (
                      <div className="text-center p-4">
                        <RAGLoader />
                      </div>
                    )}
                  </div>

                  {numPages && (
                    <div className="bg-light border-top p-2 d-flex justify-content-center align-items-center gap-3">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                        disabled={pageNumber <= 1}
                      >
                        Previous
                      </button>

                      <span className="text-muted">
                        Page {pageNumber} of {numPages}
                      </span>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          setPageNumber((p) => Math.min(numPages, p + 1))
                        }
                        disabled={pageNumber >= numPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
