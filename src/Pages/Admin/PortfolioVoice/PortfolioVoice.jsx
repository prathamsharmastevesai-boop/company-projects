import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Upload_specific_file_Api,
  get_specific_Doclist_Api,
  Delete_Doc_Specific,
} from "../../../Networking/User/APIs/Chat/ChatApi";

export const PortfolioVoice = () => {
  const dispatch = useDispatch();
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true); 
      const res = await dispatch(get_specific_Doclist_Api()).unwrap();
      const docs = (res.files || []).map((doc) => ({
        ...doc,
        category: doc.category?.toLowerCase() || "",
      }));
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false); 
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) {
      toast.warning("No files selected.");
      return;
    }

    const MAX_FILE_SIZE_MB = 3;
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      toast.error(
        "Some files exceed the 3MB size limit. Please upload smaller files."
      );
      return;
    }

    try {
      setIsUploading(true);
      const res = await dispatch(
        Upload_specific_file_Api({ files: selectedFiles, category: "portfolio" })
      ).unwrap();
      await fetchDocuments();
      toast.success(res?.msg || "Documents uploaded successfully!");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.msg || error?.message || "Upload failed";
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleDeleteDoc = async (id) => {
    try {
      setIsDeleting((prev) => ({ ...prev, [id]: true }));
      await dispatch(Delete_Doc_Specific(id)).unwrap();
      await fetchDocuments();
      toast.success("Document deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete document.");
      console.error("Failed to delete document:", error);
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.original_file_name.toLowerCase().includes(search.toLowerCase())
  );

  const totalSizeMB = documents.reduce((sum, doc) => {
    const sizeNum = parseFloat(doc.size) || 0;
    return sum + (doc.size?.toLowerCase().includes("kb") ? sizeNum / 1024 : sizeNum);
  }, 0);

  return (
    <div className="container p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Portfolio Voice</h4>
          <p className="text-muted mb-0">
            Upload and manage PDF documents for data retrieval
          </p>
        </div>
        <div>
          <label className="btn btn-primary d-flex align-items-center mb-0">
            <i className="bi bi-upload me-2"></i>
            {isUploading ? "Uploading..." : "Upload PDFs"}
            <input
              type="file"
              accept="application/pdf"
              multiple
              hidden
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-file-earmark-text me-2"></i> Document Library
                </h5>
                <div className="d-flex align-items-center">
                  <span className="badge bg-dark me-2">{documents.length} Documents</span>
                  <span className="badge bg-light text-dark">
                    {totalSizeMB.toFixed(2)} MB Total
                  </span>
                </div>
              </div>

              <div className="d-flex mb-3">
                <div className="flex-grow-1 me-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search documents..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button className="btn btn-outline-secondary me-2">Filter by Date</button>
                <button className="btn btn-outline-secondary">Sort by Size</button>
              </div>

              {filteredDocs.length > 0 ? (
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Uploaded</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.map((doc) => (
                      <tr key={doc.file_id}>
                        <td>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            {doc.original_file_name}
                          </a>
                        </td>
                        <td>
                          {parseFloat(doc.size)
                            ? (doc.size.toLowerCase().includes("kb")
                                ? parseFloat(doc.size) / 1024
                                : parseFloat(doc.size)
                              ).toFixed(2)
                            : doc.size}{" "}
                          MB
                        </td>
                        <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteDoc(doc.file_id)}
                            disabled={isDeleting[doc.file_id]}
                          >
                            {isDeleting[doc.file_id] ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-muted py-4">No documents uploaded yet.</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
