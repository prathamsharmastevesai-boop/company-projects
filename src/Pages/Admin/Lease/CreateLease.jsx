import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CreateLeaseSubmit } from "../../../Networking/Admin/APIs/LeaseApi";
import RAGLoader from "../../../Component/Loader";

export const CreateLease = () => {
  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Params
  const BuildingId = location.state?.BuildingId;
  console.log("Building ID:", BuildingId);

  // State
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([
    { tenant_name: "", suite_number: "", building_id: BuildingId }
  ]);

  // Input change handler
  const handleChange = (index, field, value) => {
    const updated = [...offices];
    updated[index][field] = value;
    setOffices(updated);
  };

  // Add new lease row
  const addOffice = () => {
    setOffices([
      ...offices,
      { tenant_name: "", suite_number: "", building_id: BuildingId }
    ]);
  };

  // Remove lease row
  const removeOffice = (index) => {
    const updated = offices.filter((_, i) => i !== index);
    setOffices(updated);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(CreateLeaseSubmit(offices));
      navigate(`/LeaseList/${BuildingId}`);
    } catch (error) {
      console.error("Error submitting lease:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 position-relative">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark">🏢 Create Lease</h2>
        <p className="text-muted">Add one or more lease records to your workspace.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {offices.map((office, index) => (
          <div key={index} className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">📄 Lease No. {index + 1}</h5>

                {offices.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeOffice(index)}
                    disabled={loading}
                  >
                    <i className="bi bi-trash3"></i> Remove
                  </button>
                )}
              </div>

              {/* Tenant Name */}
              <div className="mb-3">
                <label className="form-label">Tenant Name</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. John Smith"
                    value={office.tenant_name}
                    onChange={(e) => handleChange(index, "tenant_name", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Suite Number */}
              <div className="mb-3">
                <label className="form-label">Suite Number</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-door-open-fill"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Suite 305"
                    value={office.suite_number}
                    onChange={(e) => handleChange(index, "suite_number", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add/Submit Buttons */}
        <div className="d-flex gap-2 mb-4">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={addOffice}
            disabled={loading}
          >
            <i className="bi bi-plus-circle"></i> Add Another Lease
          </button>

          <button
            type="submit"
            className="btn btn-success"
            disabled={loading}
          >
            <i className="bi bi-send-fill"></i> Submit
          </button>
        </div>
      </form>

      {/* Loader Overlay */}
      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
          style={{ zIndex: 9999 }}
        >
          <RAGLoader />
        </div>
      )}
    </div>
  );
};
