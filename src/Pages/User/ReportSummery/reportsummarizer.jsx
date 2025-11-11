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

export const SummeryUpload = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [docs, setDocs] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchDocs = () => {
    setLoader(true);
    dispatch(ListAbstractLeaseDoc({ category: "report_generation" }))
      .unwrap()
      .then((res) => {
        setDocs(res?.files || []);
      })
      .catch((err) => {
        console.error("Failed to fetch lease docs:", err);
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

    const payload = { file, category: "report_generation" };
    setLoader(true);
    dispatch(UploadReportGenerator(payload))
      .unwrap()
      .then(() => {
        toast.success(`${file.name} uploaded successfully`);
        fetchDocs();
      })
      .catch((err) => {
        console.error("Upload failed:", err);
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
    dispatch(DeleteAbstractDoc({ fileId }))
      .unwrap()
      .then(() => {
        fetchDocs();
      })
      .catch((err) => {
        console.error("Delete failed:", err);
      })
      .finally(() => setLoader(false));
  };

  return (
    <div className="container p-4">
      <h5 className="fw-bold">📑 Report Generation</h5>
      <p className="text-muted">Upload an Report</p>

      <div className="border border-2 rounded-3 py-5 text-center mb-4 bg-light">
        <i className="bi bi-upload fs-1 text-primary"></i>
        <h6 className="fw-semibold mt-3">Upload Letter of Intent</h6>
        <p className="text-muted mb-3">
          Drag and drop Letter of Intent file here, or click to select file
        </p>
        <p className="text-muted mb-3">Only Pdf files are allowed</p>
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
        <div className="card-header fw-semibold">Uploaded Report</div>
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
                <div>{doc.original_file_name}</div>
                <div className="d-flex gap-3 align-items-center">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-info"
                    onClick={() =>
                      window.open(baseURL + doc.file_url, "_blank")
                    }
                  >
                    Download
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
    </div>
  );
};
