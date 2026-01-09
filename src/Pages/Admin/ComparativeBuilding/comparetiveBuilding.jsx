import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  GeneralInfoSubmit,
  UploadGeneralDocSubmit,
  UpdateGeneralDocSubmit,
} from "../../../Networking/Admin/APIs/GeneralinfoApi";
import { toast } from "react-toastify";
import RAGLoader from "../../../Component/Loader";
import { useLocation } from "react-router-dom";
import { DeleteDocSubmit } from "../../../Networking/Admin/APIs/UploadDocApi";
import { BackButton } from "../../../Component/backButton";

export const ComparativeBuildingData = () => {
  const location = useLocation();

  const buildingId = location?.state?.office?.buildingId;

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
      const res = await dispatch(
        GeneralInfoSubmit({
          buildingId: buildingId,
          category: "ComparativeBuilding",
        })
      ).unwrap();

      if (Array.isArray(res)) {
        const filteredDocs = res.filter(
          (f) => f.category === "ComparativeBuilding"
        );
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
  }, [dispatch]);

  const uploadFile = async (file) => {
    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ].includes(file.type)
    ) {
      toast.error("Only PDF, DOCX, XLSX files are allowed");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      toast.error("File size must be under 30MB");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        UploadGeneralDocSubmit({
          file,
          category: "ComparativeBuilding",
          building_Id: buildingId,
        })
      ).unwrap();

      await fetchData();
      toast.success("File uploaded successfully!");
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

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await uploadFile(file);
  };

  // const handleEditClick = (file) => {
  //   setEditingFile(file);
  //   if (editFileRef.current) editFileRef.current.click();
  // };

  const handleEditChange = async (e) => {
    const newFile = e.target.files[0];
    if (!newFile || !editingFile) return;

    setLoading(true);
    try {
      await dispatch(
        UpdateGeneralDocSubmit({
          file_id: editingFile.file_id,
          new_file: newFile,
          category: "ComparativeBuilding",
          building_Id: buildingId,
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
        DeleteDocSubmit({
          file_id: file.file_id,
          category: "ComparativeBuilding",
        })
      ).unwrap();

      await fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fuild p-3">
      <div className="d-flex align-items-start align-items-md-center gap-2 pt-5 pt-md-3 pb-3">
        <BackButton className="flex-shrink-0" />

        <div className="flex-grow-1 min-w-0">
          <h5 className="fw-bold mb-0">Comparative Building Data</h5>

          <p className="text-muted mb-0 description small">
            {" "}
            Upload and manage documents for Building Information
          </p>
        </div>
      </div>

      <div
        className={`border border-2 rounded-3 p-2 text-center mb-4 ${
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
        <p className="small text-muted mt-2">
          Supports PDF, DOCX, CSV, XLSX files up to 30MB
        </p>
        {loading && <RAGLoader />}
      </div>

      <div className="card shadow-sm">
        <div className="card-header fw-semibold">Uploaded Documents</div>
        {listLoading ? (
          <div className="p-3 text-center">
            <RAGLoader />
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {docs?.length === 0 && (
              <li className="list-group-item text-muted">
                No documents uploaded yet.
              </li>
            )}
            {docs?.map((file) => (
              <li
                key={file?.file_id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <i className="bi bi-file-earmark-text text-primary me-2"></i>
                  {file?.name}
                </span>
                <span>
                  {/* <i
                    className="bi bi-pencil-square text-primary me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditClick(file)}
                  /> */}
                  <i
                    className="bi bi-trash text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(file)}
                  />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* <input
        type="file"
        accept=".pdf,.docx,.xls,.xlsx"
        ref={editFileRef}
        style={{ display: "none" }}
        onChange={handleEditChange}
      /> */}
    </div>
  );
};
