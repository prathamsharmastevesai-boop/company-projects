import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ListDocSubmit,
  UploadDocSubmit,
  UpdateDocSubmit,
  DeleteDocSubmit,
} from "../../../Networking/Admin/APIs/UploadDocApi";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import RAGLoader from "../../../Component/Loader";

export const LeaseInfomation = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const editFileRef = useRef(null);

  const initialBuildings = location.state?.office;

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editingFile, setEditingFile] = useState(null);

  const fetchDocuments = async () => {
    if (!initialBuildings?.Building_id || !initialBuildings?.type) return;
    setLoading(true);
    try {
      const res = await dispatch(
        ListDocSubmit({
          building_id: initialBuildings.Building_id,
        })
      ).unwrap();

      if (Array.isArray(res)) {
        const filtered = res.filter((f) => {
          return f.category
            ?.toLowerCase()
            .includes(initialBuildings.type.toLowerCase());
        });

        setDocs(
          filtered.map((f) => ({
            file_id: f.file_id,
            name: f.original_file_name || f.name,
            category: f.category,
          }))
        );
      } else {
        setDocs([]);
      }
    } catch (err) {
      console.error("Error fetching Lease docs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [initialBuildings]);

  const uploadFile = async (file) => {
    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ].includes(file.type)
    ) {
      toast.error("Only PDF, DOC,CSV, DOCX, XLS, XLSX files are allowed");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      toast.error("File size must be under 30MB");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        UploadDocSubmit({
          files: [file],
          buildingId: initialBuildings.Building_id,
          category: initialBuildings.type,
        })
      ).unwrap();

      await fetchDocuments();
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
        UpdateDocSubmit({
          file_id: editingFile.file_id,
          new_file: newFile,
          building_id: initialBuildings.Building_id,
          category: initialBuildings.type,
        })
      ).unwrap();

      await fetchDocuments();
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
        DeleteDocSubmit({
          building_id: initialBuildings.Building_id,
          file_id: file.file_id,
          category: initialBuildings.type,
        })
      ).unwrap();

      await fetchDocuments();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-3">
      {initialBuildings.type === "Lease" && (
        <>
          <h5 className="fw-bold text-truncate mt-4">Lease Documents</h5>
          <p className="text-muted text-truncate">
            Upload and manage lease-related documents
          </p>
        </>
      )}
      {initialBuildings.type === "LOI" && (
        <>
          <h5 className="fw-bold text-truncate">Letter of Intent Documents</h5>
          <p className="text-muted text-truncate">
            Upload and manage Letter of Intent-related documents
          </p>
        </>
      )}

      <div
        className={`border border-2 rounded-3 p-4 text-center mb-4 w-100 ${
          isDragging ? "border-primary bg-light" : "border-dashed bg-light"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <i className="bi bi-upload fs-1 text-primary"></i>
        <h6 className="fw-semibold mt-3">Upload Documents</h6>
        <p className="text-muted mb-3">
          Drag and drop files here, or click to select files
        </p>
        <label className="btn btn-outline-primary">
          <i className="bi bi-file-earmark-arrow-up me-1"></i> Choose Files
          <input
            type="file"
            accept=".pdf,.csv,.docx,.xlsx"
            onChange={handleFileChange}
            hidden
          />
        </label>
        <p className="small text-muted mt-2 text-wrap">
          Supports PDF, DOCX, CSV, XLSX files up to 30MB
        </p>
        {loading && <RAGLoader />}
      </div>

      <div className="card shadow-sm">
        <div className="card-header fw-semibold">Uploaded Documents</div>
        <ul className="list-group list-group-flush">
          {docs?.length === 0 && (
            <li className="list-group-item text-muted text-center">
              No {initialBuildings.type.toLowerCase()} documents uploaded yet.
            </li>
          )}
          {docs?.map((file) => (
            <li
              key={file?.file_id}
              className="list-group-item d-flex justify-content-between align-items-center flex-wrap"
            >
              <span
                className="d-flex align-items-center text-truncate"
                style={{ maxWidth: "70%" }}
              >
                <i className="bi bi-file-earmark-text text-primary me-2"></i>
                <span className="text-truncate" style={{ maxWidth: "100%" }}>
                  {file?.name}
                </span>
              </span>

              <div className="d-flex gap-2 mt-2 mt-md-0">
                {/* <i
                  className="bi bi-pencil-square text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEditClick(file)}
                /> */}
                <i
                  className="bi bi-trash text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(file)}
                />
              </div>
            </li>
          ))}
        </ul>
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
