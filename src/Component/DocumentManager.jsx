import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  GeneralInfoSubmit,
  UploadGeneralDocSubmit,
  UpdateGeneralDocSubmit,
  DeleteGeneralDocSubmit,
  UploadfloorStack,
  FloorPlanStackListSubmit,
  FloorPlanStackDeleteSubmit,
} from "../Networking/Admin/APIs/GeneralinfoApi";
import { toast } from "react-toastify";
import RAGLoader from "./Loader";

const DocumentManager = ({ category, title, description, building_Id }) => {
  const dispatch = useDispatch();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const editFileRef = useRef(null);
  const [editingFile, setEditingFile] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [tag, setTag] = useState("");

  const fetchData = async () => {
    setListLoading(true);
    try {
      const res = await dispatch(
        category === "floor_plan" || category === "building_stack"
          ? FloorPlanStackListSubmit({ buildingId: building_Id, category })
          : GeneralInfoSubmit({ buildingId: building_Id, category })
      ).unwrap();

      if (Array.isArray(res)) {
        const filteredDocs = res.filter((f) => f.category === category);
        setDocs(
          filteredDocs.map((f) => ({
            file_id: f.file_id,
            name: f.original_file_name,
            tag: f.tag || "",
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
    const isFloorPlanOrStack =
      category === "floor_plan" || category === "building_stack";

    let allowedTypes;
    let allowedExtensions;

    if (isFloorPlanOrStack) {
      allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      allowedExtensions = ".pdf,.jpg,.jpeg,.png,.gif,.webp";
    } else {
      allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
      allowedExtensions = ".pdf,.csv,.docx,.xlsx";
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        isFloorPlanOrStack
          ? "Only PDF and image files (JPG, PNG, GIF, WEBP) are allowed for this category"
          : "Only PDF, DOCX, XLSX, and CSV files are allowed"
      );
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      toast.error("File size must be under 30MB");
      return;
    }

    setLoading(true);
    try {
      let result;

      if (isFloorPlanOrStack) {
        result = await dispatch(
          UploadfloorStack({
            file,
            category,
            building_Id,
            tag: category === "floor_plan" ? tag : undefined,
          })
        ).unwrap();
      } else {
        result = await dispatch(
          UploadGeneralDocSubmit({
            file,
            category,
            building_Id,
          })
        ).unwrap();
      }

      toast.success("File uploaded successfully");
      await fetchData();
      if (category === "floor_plan") setTag("");
    } catch (err) {
      console.error("Upload failed:", err);
      // toast.error(err.message || "Upload failed");
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

  // const handleEditClick = (file) => {
  //   setEditingFile(file);
  //   editFileRef.current?.click();
  // };

  // const handleEditChange = async (e) => {
  //   const newFile = e.target.files[0];
  //   if (!newFile || !editingFile) return;

  //   setLoading(true);
  //   try {
  //     await dispatch(
  //       UpdateGeneralDocSubmit({
  //         file_id: editingFile.file_id,
  //         new_file: newFile,
  //         category,
  //       })
  //     ).unwrap();
  //     await fetchData();
  //   } catch (err) {
  //     console.error("Edit failed:", err);
  //     toast.error("Edit failed");
  //   } finally {
  //     setLoading(false);
  //     e.target.value = null;
  //     setEditingFile(null);
  //   }
  // };

  const openDeleteModal = (file) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;

    setDeleteLoading(true);
    try {
      await dispatch(
        category === "floor_plan" || category === "building_stack"
          ? FloorPlanStackDeleteSubmit({ file_id: fileToDelete.file_id })
          : DeleteGeneralDocSubmit({
              file_id: fileToDelete.file_id,
              category,
            })
      ).unwrap();

      await fetchData();
      toast.success("Document deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      // toast.error("Failed to delete document");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setFileToDelete(null);
    }
  };

  return (
    <>
      <div className="container px-2 px-md-4">
        <div className="container doc-container py-4">
          <h5 className="fw-bold text-truncate mt-3">{title}</h5>
          <p className="text-muted text-truncate">{description}</p>

          {category === "floor_plan" && (
            <div className="mb-3">
              <label htmlFor="tag" className="form-label">
                Tag
              </label>
              <input
                type="text"
                id="tag"
                required
                className="form-control"
                placeholder="Enter tag for Floor Plan"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </div>
          )}

          <div
            className={`border border-2 rounded-3 p-3 text-center mb-4 w-100 ${
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
                accept={
                  category === "floor_plan" || category === "building_stack"
                    ? ".pdf,.jpg,.jpeg,.png,.gif,.webp"
                    : ".pdf,.csv,.docx,.xlsx"
                }
                onChange={handleFileChange}
                hidden
              />
            </label>

            <p className="small text-muted mt-2 text-wrap">
              Supports{" "}
              {category === "floor_plan" || category === "building_stack"
                ? "PDF and image files (JPG, PNG, GIF, WEBP)"
                : "PDF, DOCX, CSV, XLSX"}{" "}
              up to 30MB
            </p>

            {loading && <RAGLoader />}
          </div>
        </div>

        <div className="card shadow-sm mb-4">
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
                  className="list-group-item d-flex justify-content-between align-items-center flex-wrap"
                >
                  <div
                    className="d-flex align-items-center text-truncate me-2"
                    style={{ maxWidth: "70%" }}
                  >
                    <i className="bi bi-file-earmark-text text-primary me-2"></i>
                    <span
                      className="text-truncate"
                      style={{ maxWidth: "100%" }}
                    >
                      {file.name}
                    </span>
                    {file.tag && (
                      <span className="badge bg-secondary ms-2 text-truncate">
                        {file.tag}
                      </span>
                    )}
                  </div>

                  <div className="d-flex gap-2 mt-2 mt-md-0">
                    {/* Edit Icon (optional) */}
                    {/* <i
      className="bi bi-pencil-square text-primary"
      style={{ cursor: "pointer" }}
      onClick={() => handleEditClick(file)}
    ></i> */}
                    <i
                      className="bi bi-trash text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => openDeleteModal(file)}
                    ></i>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {showDeleteModal && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <p>
                    Are you sure you want to delete:
                    <br />
                    <strong>{fileToDelete?.name}</strong> ?
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={confirmDelete}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentManager;
