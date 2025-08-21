import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useDispatch, useSelector } from "react-redux";
import {
  ListLeaseSubmit,
} from "../../../Networking/Admin/APIs/LeaseApi";
import { ListDocSubmit } from "../../../Networking/Admin/APIs/UploadDocApi";
import Office_image from "../../../assets/Office_image.jpg";
import { toast } from "react-toastify";
import RAGLoader from "../../../Component/Loader";

export const UserLeaseList = () => {
  const { id } = useParams();
  const { leases, message, Building_id, loading } = useSelector(
    (state) => state.LeaseSlice
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardsRef = useRef([]);

  const [searchTerm, setSearchTerm] = useState("");

  const officeList = Array.isArray(leases) ? leases : [];

  useEffect(() => {
    if (id) {
      dispatch(ListLeaseSubmit(id));
    }
  }, [id, dispatch]);

  // Animate cards when filtered list changes
  useEffect(() => {
    filteredLeases.forEach((lease, i) => {
      const card = cardsRef.current[i];
      if (card) {
        setTimeout(() => {
          card.classList.add("visible");
        }, i * 150);
      }
    });
  }, [officeList, searchTerm]); // animate on data or search change

  // Filter leases by tenant_name, lease_number, or address (case-insensitive)
  const filteredLeases =
    searchTerm.trim() === ""
      ? officeList
      : officeList.filter((lease) => {
          const term = searchTerm.toLowerCase();
          return (
            (lease.tenant_name?.toLowerCase().includes(term)) ||
            (lease.lease_number?.toLowerCase().includes(term)) ||
            (lease.address?.toLowerCase().includes(term))
          );
        });

  const handleSubmit = (lease) => {
    const listdata = {
      building_id: Building_id,
      lease_id: lease?.lease_id,
    };
    dispatch(ListDocSubmit(listdata));
    navigate("/UserChat", { state: { office: { Building_id, lease } } });
  };

  return (
    <>
      <div
        className="hero-section text-center bg-primary py-3 mb-4 text-white animate__animated animate__fadeInDown"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          height: "20vh",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <h2 className="fw-bold">🏘️ Leases</h2>
        <p className="mb-0">Browse through the list of available Leases.</p>
      </div>

      <div className="container my-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search leases by tenant name, lease number or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search Leases"
          autoComplete="off"
        />
      </div>

      <div className="container py-2">
        {loading ? (
          <div className="text-center py-5">
            <RAGLoader />
            <p className="mt-3 text-muted">Loading leases...</p>
          </div>
        ) : filteredLeases.length === 0 ? (
          <div className="alert alert-info text-center">
            {message || "No leases found matching your search."}
          </div>
        ) : (
          <div className="row">
            {filteredLeases.map((lease, index) => (
              <div className="col-md-6 col-lg-4 mb-4" key={lease.id}>
                <div
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="card shadow-sm border-0 rounded-4 overflow-hidden h-100 office-card hover-shadow"
                  onClick={() => handleSubmit(lease)}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <div style={{ height: "120px", background: "#f5f5f5" }}>
                    <div
                      className="w-100 h-100"
                      style={{
                        backgroundImage: `url(${Office_image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  </div>

                  <div className="card-body px-4 pt-3 pb-3">
                    <h5 className="text-dark fw-semibold mb-2">
                      <i className="bi bi-door-open-fill me-2 text-primary"></i>
                      {lease.lease_number || "Lease Number Not Available"}
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
          </div>
        )}
      </div>
    </>
  );
};
