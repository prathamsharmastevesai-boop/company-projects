import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  GeneralInfoSubmit,
  UploadGeneralDocSubmit,
  UpdateGeneralDocSubmit,
  DeleteGeneralDocSubmit,
} from "../Networking/Admin/APIs/GeneralinfoApi";
import { toast } from "react-toastify";
import RAGLoader from "./Loader";

const DocumentManager = ({ category, title, description }) => {
  const dispatch = useDispatch();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const editFileRef = useRef(null);
  const [editingFile, setEditingFile] = useState(null);

  const fetchData = async () => {
    setListLoading(true);
    try {
      const res = await dispatch(GeneralInfoSubmit()).unwrap();
      if (Array.isArray(res)) {
        const filteredDocs = res.filter((f) => f.category === category);
        setDocs(
          filteredDocs.map((f) => ({
            file_id: f.file_id,
            name: f.original_file_name,
          }))
        );
      }
    } catch (err) {
      console.error(`Error fetching ${category} docs:`, err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, category]);

  const uploadFile = async (file) => {
    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ].includes(file.type)
    ) {
      toast.error("Only PDF, DOCX, XLSX, and CSV files are allowed");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      toast.error("File size must be under 30MB");
      return;
    }

    setLoading(true);
    try {
      await dispatch(UploadGeneralDocSubmit({ file, category })).unwrap();
      await fetchData();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) await uploadFile(file);
    e.target.value = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await uploadFile(file);
  };

  const handleEditClick = (file) => {
    setEditingFile(file);
    if (editFileRef.current) editFileRef.current.click();
  };

  const handleEditChange = async (e) => {
    const newFile = e.target.files[0];
    if (!newFile || !editingFile) return;

    setLoading(true);
    try {
      await dispatch(
        UpdateGeneralDocSubmit({
          file_id: editingFile.file_id,
          new_file: newFile,
          category,
        })
      ).unwrap();
      await fetchData();
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setLoading(false);
      e.target.value = null;
      setEditingFile(null);
    }
  };

  const handleDelete = async (file) => {
    if (!window.confirm(`Delete "${file.name}"?`)) return;
    setLoading(true);
    try {
      await dispatch(
        DeleteGeneralDocSubmit({ file_id: file.file_id, category })
      ).unwrap();
      await fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 px-2 px-md-4">
      <div className="container doc-container py-4">
        <h5 className="fw-bold">{title}</h5>
        <p className="text-muted">{description}</p>

        <div
          className={`border border-2 rounded-3 p-4 text-center mb-4 doc-drop-box ${
            isDragging ? "border-primary bg-light" : "border-dashed bg-light"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <i className="bi bi-upload fs-1 text-primary"></i>
          <h6 className="fw-semibold mt-3">Upload Documents</h6>
          <p className="text-muted small mb-3">
            Drag & drop files here or click to select
          </p>

          <label className="btn btn-primary px-4">
            <i className="bi bi-file-earmark-arrow-up me-1"></i> Select File
            <input
              type="file"
              hidden
              accept=".pdf,.csv,.docx,.xlsx"
              onChange={handleFileChange}
            />
          </label>

          {loading && <RAGLoader />}
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header fw-semibold">Uploaded Documents</div>

        {listLoading ? (
          <div className="p-3 text-center">
            <RAGLoader />
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {docs.length === 0 && (
              <li className="list-group-item text-muted text-center">
                No documents uploaded yet.
              </li>
            )}

            {docs.map((file) => (
              <li
                key={file.file_id}
                className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
                style={{ overflow: "hidden" }}
              >
                <span
                  className="mb-2 mb-md-0 text-truncate w-100"
                  style={{ overflow: "hidden" }}
                >
                  <i className="bi bi-file-earmark-text text-primary me-2"></i>
                  {file.name}
                </span>

                <div className="d-flex gap-3 flex-shrink-0">
                  <i
                    className="bi bi-pencil-square text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditClick(file)}
                  ></i>
                  <i
                    className="bi bi-trash text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(file)}
                  ></i>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="file"
        accept=".pdf,.csv,.docx,.xlsx"
        ref={editFileRef}
        style={{ display: "none" }}
        onChange={handleEditChange}
      />
    </div>
  );
};

export default DocumentManager;
