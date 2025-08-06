import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOffice, ListLeaseSubmit } from "../../../Networking/Admin/APIs/LeaseApi";
import { ListDocSubmit } from "../../../Networking/Admin/APIs/UploadDocApi";

export const LeaseList = () => {
  //Params
  const { id } = useParams();

  //Redux
  const { leases, message, Building_id } = useSelector((state => state.OfficeSlice));
  console.log(leases, "leases");

  //Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardsRef = useRef([]);

  const officeList = Array.isArray(leases) ? leases : [];

  //UseEffect
  useEffect(() => {
    const fetchOffices = async () => {
      if (id) {
        await dispatch(ListLeaseSubmit(id));
      }
    };
    fetchOffices();
  }, [id, dispatch]);

  useEffect(() => {
    const animateCards = () => {
      cardsRef.current.forEach((card, i) => {
        if (card) {
          setTimeout(() => {
            card.classList.add("visible");
          }, i * 150);
        }
      });
    };

    animateCards();
  }, [officeList]);

  //Handle Function
  const handleSubmit = (lease) => {
    console.log("lease object:", lease);
    console.log("lease ID:", lease?.lease_id);
    console.log("Building ID:", Building_id);
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
        await dispatch(DeleteOffice({ lease_id, building_id: Building_id })).unwrap();
        await dispatch(ListLeaseSubmit(Building_id));
      } catch (error) {
        console.error("Failed to delete Lease:", error);
      }
    }
  };


  return (
    <div className="container py-5">
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
        <p className="text-muted mb-0">Browse through the list of available Leases.</p>
      </div>

      <div className="row">
        {Array.isArray(leases) && leases.map((lease, index) => (
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
        ))}

        {leases.length === 0 && <p className="text-muted text-center">{message}</p>}

        {/* Create lease Card */}
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
      </div>

    </div>
  );
};
