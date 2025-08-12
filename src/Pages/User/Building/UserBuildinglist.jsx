import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ListBuildingSubmit } from "../../../Networking/Admin/APIs/BuildingApi";
import { useDispatch, useSelector } from "react-redux";
import { ListLeaseSubmit } from "../../../Networking/Admin/APIs/LeaseApi";
import buildingCardImg from '../../../assets/building-card-bg2.jpeg';
import { RequestPermissionSubmit } from "../../../Networking/User/APIs/Permission/PermissionApi";
import { toast } from "react-toastify";
import RAGLoader from "../../../Component/Loader";

export const UserBuildinglist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cardsRef = useRef({});

  const [requestingPermissionId, setRequestingPermissionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { BuildingList, loading } = useSelector((state) => state.BuildingSlice);

  useEffect(() => {
    dispatch(ListBuildingSubmit({ navigate }));
  }, [dispatch, navigate]);

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
      const res = await dispatch(RequestPermissionSubmit({ building_id })).unwrap();
      console.log(res, "Permission Response");
    } catch (err) {
      console.error("Permission request failed:", err);
    } finally {
      setRequestingPermissionId(null);
    }
  };

  const handleSubmit = async (building) => {
    if (building.access_status === "NULL") {
      toast.warning("Press Icon for lease Request");
    } else if (building.access_status === "approved") {
      navigate(`/UserLeaseList/${building.id}`);
      await dispatch(ListLeaseSubmit(building.id));
    } else if (building.access_status === "pending") {
      toast.warning("Request in Pending State");
    } else {
      toast.error("Request denied");
    }
  };

  return (
    <>
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

      <div
        className="hero-section text-center bg-white py-3 mb-4 animate__animated animate__fadeInDown"
        style={{ position: "sticky", top: 0, zIndex: 10, height: "20vh", borderBottom: "1px solid #dee2e6" }}
      >
        <h2 className="fw-bold text-light">🏢 Buildings</h2>
        <p className="text-light mb-0">Here’s a summary of all the submitted buildings.</p>
      </div>

      <div className="container mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search by address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search Buildings by Address"
          autoComplete="off"
        />
      </div>

      <div className="container py-2">
        {loading ? (
          <div className="text-center py-5">
            <RAGLoader />
            <p className="mt-3 text-muted">Loading buildings...</p>
          </div>
        ) : filteredBuildings.length === 0 ? (
          <div className="alert alert-info">No buildings found matching your search.</div>
        ) : (
          <div className="row">
            {[...filteredBuildings].reverse().map((building, index) => (
              <div className="col-md-6 col-lg-4 mb-4" key={building.id}>
                <div
                  ref={(el) => (cardsRef.current[building.id] = el)}
                  className="card border-0 shadow-sm h-100 slide-in-top position-relative overflow-hidden"
                  style={{ backgroundColor: "#1f1f1f", color: "white", borderRadius: "16px" }}
                >
                  <div
                    className="d-flex align-items-center"
                    style={{
                      height: 160,
                      backgroundImage: `url(${buildingCardImg})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  ></div>

                  <div
                    className="card-body pt-3 position-relative"
                    onClick={() => handleSubmit(building)}
                    style={{ cursor: "pointer" }}
                  >
                    {building.access_status !== "approved" && (
                      <div
                        className="position-absolute"
                        style={{ top: "10px", right: "10px", zIndex: 2 }}
                        title="Request Access"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRequestPermission(building.id);
                        }}
                      >
                        <i
                          className="bi bi-shield-lock-fill text-warning"
                          style={{ cursor: "pointer", fontSize: "1.3rem" }}
                        ></i>
                      </div>
                    )}

                    <h5 className="card-title text-white mb-3 mt-2">
                      🏢 {building.building_name || `Building #${index + 1}`}
                    </h5>
                    <p className="mb-2">
                      <i className="bi bi-calendar3 me-2 text-light"></i>
                      <strong>Year Built:</strong> <span>{building.year || "N/A"}</span>
                    </p>
                    <p>
                      <i className="bi bi-geo-alt-fill me-2 text-light"></i>
                      <strong>Address:</strong> {building.address || "N/A"}
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
