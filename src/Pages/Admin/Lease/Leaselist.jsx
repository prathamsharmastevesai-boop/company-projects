import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useDispatch, useSelector } from "react-redux";
import { DeleteLease, ListLeaseSubmit } from "../../../Networking/Admin/APIs/LeaseApi";
import { ListDocSubmit } from "../../../Networking/Admin/APIs/UploadDocApi";
import RAGLoader from "../../../Component/Loader";

export const LeaseList = () => {
  // Params
  const { id } = useParams();

  // Redux
  const { leases, message, Building_id, loading } = useSelector(state => state.LeaseSlice);

  // Local states
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLeases, setFilteredLeases] = useState([]);

  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardsRef = useRef([]);

  useEffect(() => {
    if (id) {
      dispatch(ListLeaseSubmit(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    const listToAnimate = filteredLeases.length > 0 || searchTerm ? filteredLeases : leases;
    cardsRef.current.forEach((card, i) => {
      if (card) {
        card.classList.remove("visible"); 
        setTimeout(() => {
          card.classList.add("visible");
        }, i * 150);
      }
    });
  }, [leases, filteredLeases, searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLeases([]);
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = leases.filter(lease =>
      (lease.tenant_name?.toLowerCase().includes(lowerSearch)) ||
      (lease.lease_number?.toLowerCase().includes(lowerSearch))
    );
    setFilteredLeases(filtered);
  }, [searchTerm, leases]);

  const handleSubmit = (lease) => {
    const listdata = {
      building_id: Building_id,
      lease_id: lease?.lease_id,
    };
    dispatch(ListDocSubmit(listdata));
    navigate("/LeaseInfo", { state: { office: { Building_id, lease } } });
  };

  const handleEdit = (lease) => {
    navigate("/UpdateLease", { state: { Building_id, offices: [lease] } });
  };

  const handleDelete = async (lease_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Lease?");
    if (confirmDelete) {
      try {
        await dispatch(DeleteLease({ lease_id, building_id: Building_id })).unwrap();
        await dispatch(ListLeaseSubmit(Building_id));
      } catch (error) {
        console.error("Failed to delete Lease:", error);
      }
    }
  };

  const leasesToDisplay = filteredLeases.length > 0 || searchTerm ? filteredLeases : leases;

  return (
    <div className="container p-4">
      <div
        className="text-center bg-white py-3 mb-4"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <h2 className="fw-bold text-dark">🏘️ Lease List</h2>
        <p className="text-muted mb-2">Browse through the list of available Leases.</p>

        <input
          type="search"
          className="form-control mx-auto"
          placeholder="Search by Tenant Name or Lease Number"
          style={{ maxWidth: "400px" }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && (
        <div className="text-center my-5">
         <RAGLoader />
        </div>
      )}

      {!loading && (
        <div className="row">
          <div className="col-md-6 col-lg-4 mb-4">
            <div
              onClick={() => navigate("/CreateLease", { state: { BuildingId: id } })}
              className="card border-0 shadow-sm d-flex justify-content-center align-items-center text-center rounded-4 hover-shadow"
              style={{
                minHeight: "160px",
                cursor: "pointer",
                border: "2px dashed #0d6efd",
                transition: "transform 0.3s ease",
              }}
            >
              <div className="p-4">
                <i className="bi bi-plus-circle text-primary fs-2 mb-2"></i>
                <p className="text-primary fw-medium m-0">Create New Lease</p>
              </div>
            </div>
          </div>
          {leasesToDisplay.length > 0 ? (
            leasesToDisplay.map((lease, index) => (
              <div className="col-md-6 col-lg-4 mb-4" key={lease.lease_id}>
                <div
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="card border-0 shadow-sm slide-in-top hover-shadow position-relative rounded-4"
                  style={{ transition: "transform 0.3s ease" }}
                >
                  <div className="position-absolute top-0 end-0 p-2 d-flex gap-2" style={{ zIndex: 1 }}>
                    <i
                      className="bi bi-pencil-square text-primary"
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                      title="Edit"
                      onClick={() => handleEdit(lease)}
                    ></i>
                    <i
                      className="bi bi-trash text-danger"
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                      title="Delete"
                      onClick={() => handleDelete(lease.lease_id)}
                    ></i>
                  </div>

                  <div
                    className="card-body pb-4 px-4"
                    onClick={() => handleSubmit(lease)}
                    style={{ cursor: "pointer" }}
                  >
                    <h5 className="card-title text-dark fw-semibold mb-3">
                      <i className="bi bi-buildings me-2 text-primary"></i>
                      {lease.lease_number}
                    </h5>

                    <p className="mb-1">
                      <i className="bi bi-person-fill me-2 text-secondary"></i>
                      <strong>Tenant Name:</strong> {lease.tenant_name}
                    </p>

                    <p className="mb-1">
                      <i className="bi bi-door-open-fill me-2 text-secondary"></i>
                      <strong>Suite Number:</strong> {lease.suite_number}
                    </p>

                    <p className="mb-1">
                      <i className="bi bi-geo-alt-fill me-2 text-secondary"></i>
                      <strong>Address:</strong> {lease.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted text-center">{message || "No leases found."}</p>
          )}

          
        </div>
      )}
    </div>
  );
};
