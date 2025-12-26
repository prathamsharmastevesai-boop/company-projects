import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ListBuildingSubmit } from "../../../Networking/Admin/APIs/BuildingApi";
import { RequestPermissionSubmit } from "../../../Networking/User/APIs/Permission/PermissionApi";
import RAGLoader from "../../../Component/Loader";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cardsRef = useRef({});

  const [requestingPermissionId, setRequestingPermissionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { BuildingList, loading } = useSelector((state) => state.BuildingSlice);

  useEffect(() => {
    const category = "BuildingInfo";
    dispatch(ListBuildingSubmit(category));
  }, [dispatch]);

  useEffect(() => {
    filteredBuildings.forEach((building, i) => {
      const card = cardsRef.current[building.id];
      if (card) {
        setTimeout(() => {
          card.classList.add("visible");
        }, i * 150);
      }
    });
  }, [BuildingList, searchTerm]);

  const filteredBuildings =
    searchTerm.trim() === ""
      ? BuildingList
      : BuildingList.filter((building) =>
          building.address?.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const handleRequestPermission = async (building_id) => {
    if (requestingPermissionId === building_id) return;

    setRequestingPermissionId(building_id);
    try {
      await dispatch(RequestPermissionSubmit({ building_id })).unwrap();
    } catch (err) {
      console.error("Permission request failed:", err);
    } finally {
      setRequestingPermissionId(null);
    }
  };

  const handleSubmit = async (building) => {
    const buildingId = building.id;
    navigate("/SelectUserBuildingCategory", {
      state: { office: { buildingId } },
    });
  };

  return (
    <div style={{ position: "relative" }}>
      {requestingPermissionId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            className="spinner-border text-warning"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <section
        style={{ height: "42vh", backgroundColor: "#1f1f1f" }}
        className="hero-section text-white d-flex align-items-center justify-content-center text-center"
      >
        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/6789/6789463.png"
            alt="Under Construction"
            style={{ width: "100px" }}
            className="mb-3 animate__animated animate__fadeInDown"
          />
          <h1 className="display-4 fw-bold animate__animated animate__fadeInUp">
            Welcome to Portfolio Pulse
          </h1>
        </div>
      </section>

      <div className="container-fuild p-3">
        <div className="row align-items-center my-4">
          <div className="col-md-8">
            <div className="d-flex align-items-center mb-2">
              {/* <h2 className="mb-0 me-2">🏢</h2> */}
              <h2 className="text-start mb-0 fw-bold">Building Info</h2>
            </div>
          </div>
          <div className="col-md-12 py-2">
            <input
              type="search"
              style={{
                borderWidth: "0.1px",
                borderColor: "#cacacaff",
                borderRadius: "16px",
              }}
              className="form-control bg-white text-dark dark-placeholder"
              placeholder="Search address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search Buildings by Address"
              autoComplete="off"
            />
          </div>
        </div>

        <hr />

        {loading ? (
          <div className="text-center py-5">
            <RAGLoader />
            <p className="mt-3 text-muted">Loading buildings...</p>
          </div>
        ) : filteredBuildings.length === 0 ? (
          <div className="alert alert-info">
            No buildings found matching your search.
          </div>
        ) : (
          <div className="row">
            {[...filteredBuildings].reverse().map((building, index) => (
              <div className="col-12 mb-3" key={building.id}>
                <div
                  ref={(el) => (cardsRef.current[building.id] = el)}
                  className="card shadow-sm slide-in-top d-flex flex-row align-items-center p-3"
                  style={{
                    backgroundColor: "#fff",
                    borderWidth: "0.1px",
                    borderColor: "#cacacaff",
                    borderRadius: "16px",
                  }}
                >
                  <div
                    className="card-body d-flex flex-column justify-content-center position-relative p-0"
                    onClick={() => handleSubmit(building)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex mx-1">
                      <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                      <div className="mx-2 check w-75">
                        {building.address || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
