import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const PortfolioVoice = () => {
  return (
    <div className="container p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Portfolio Voice</h4>
          <p className="text-muted mb-0">
            Upload and manage PDF documents for data retrieval
          </p>
        </div>
        <button className="btn btn-primary d-flex align-items-center">
          <i className="bi bi-upload me-2"></i> Upload PDFs
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              <i className="bi bi-file-earmark-text me-2"></i> Document Library
            </h5>
            <div className="d-flex align-items-center">
              <span className="badge bg-dark me-2">0 Documents</span>
              <span className="badge bg-light text-dark">0.0 MB Total</span>
            </div>
          </div>

          <div className="d-flex mb-3">
            <div className="flex-grow-1 me-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search documents..."
              />
            </div>
            <button className="btn btn-outline-secondary me-2">
              Filter by Date
            </button>
            <button className="btn btn-outline-secondary">Sort by Size</button>
          </div>

          <div className="text-center text-muted py-4">
            No documents uploaded yet.
          </div>
        </div>
      </div>
    </div>
  );
};
