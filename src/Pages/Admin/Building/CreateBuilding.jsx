import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreateBuildingSubmit, ListBuildingSubmit } from "../../../Networking/Admin/APIs/BuildingApi";
import RAGLoader from "../../../Component/Loader";

export const CreateBuilding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [buildings, setBuildings] = useState([
    { building_name: "", address: "", year: "" },
  ]);

  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...buildings];
    updated[index][field] = value;
    setBuildings(updated);
  };

  const addBuilding = () => {
    setBuildings([...buildings, { building_name: "", address: "", year: "" }]);
  };

  const removeBuilding = (index) => {
    const updated = buildings.filter((_, i) => i !== index);
    setBuildings(updated);
  };

  useEffect(() => {
    const fetchBuildings = async () => {
      await dispatch(ListBuildingSubmit());
    };
    fetchBuildings();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(CreateBuildingSubmit(buildings)).unwrap();
      await dispatch(ListBuildingSubmit());
      navigate("/building_list");
    } catch (error) {
      console.error("Error submitting building:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 position-relative">

      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
          style={{ zIndex: 9999 }}
        >
          <RAGLoader />
        </div>
      )}

      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark">🏢 Create Buildings</h2>
        <p className="text-muted">Fill in the details below to add one or more buildings to your project.</p>
      </div>

      <div className="col-md-12 d-flex row">
        <div className="col-md-12">
          <form onSubmit={handleSubmit}>
            {buildings.map((building, index) => (
              <div key={index} className="card shadow-sm mb-4 border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">🏢 Building No. {index + 1}</h5>
                    {buildings.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeBuilding(index)}
                        disabled={loading}
                      >
                        <i className="bi bi-trash3"></i> Remove
                      </button>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Building Name</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-building"></i></span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Sunrise Heights"
                        value={building.building_name}
                        onChange={(e) => handleChange(index, "building_name", e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Year Built</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-calendar3"></i></span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 2022"
                        value={building.year}
                        onChange={(e) => handleChange(index, "year", e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Address</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-geo-alt-fill"></i></span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 123 Main Street, New Delhi"
                        value={building.address}
                        onChange={(e) => handleChange(index, "address", e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="d-flex gap-2 mb-4">
              <button type="button" className="btn btn-outline-primary" onClick={addBuilding} disabled={loading}>
                <i className="bi bi-plus-circle"></i> Add Another Building
              </button>

              <button type="submit" className="btn btn-success" disabled={loading}>
                <i className="bi bi-send-fill"></i> Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
