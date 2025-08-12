import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { DeleteBuilding, ListBuildingSubmit } from "../../../Networking/Admin/APIs/BuildingApi";
import { useDispatch, useSelector } from "react-redux";
import RAGLoader from "../../../Component/Loader";  

export const ListBuilding = () => {
  // Redux
  const { BuildingList } = useSelector((state) => state.BuildingSlice);

  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cardsRef = useRef([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch buildings with loading state
  useEffect(() => {
    const fetchBuildings = async () => {
      setLoading(true);
      await dispatch(ListBuildingSubmit());
      setLoading(false);
    };
    fetchBuildings();
  }, [dispatch]);

  // Animate cards when buildings or searchTerm changes
  useEffect(() => {
    if (!loading) {
      cardsRef.current.forEach((card, i) => {
        if (card) {
          card.classList.remove("visible"); // reset class before adding
          setTimeout(() => {
            card.classList.add("visible");
          }, i * 150);
        }
      });
    }
  }, [BuildingList, searchTerm, loading]);

  // Handle functions
  const handleEdit = (building) => {
    navigate("/UpdateBuilding", { state: { buildings: [building] } });
  };

  const handleDelete = async (building) => {
    try {
      await dispatch(DeleteBuilding(building));
      await dispatch(ListBuildingSubmit());
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleSubmit = async (building) => {
    navigate(`/LeaseList/${building}`);
    await dispatch(ListLeaseSubmit(building));
  };

  // Filter buildings by search term
  const filteredBuildings = BuildingList.filter((building) => {
    const name = building.building_name?.toLowerCase() || "";
    const address = building.address?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return name.includes(term) || address.includes(term);
  });

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
        <h2 className="fw-bold text-dark">🏢 Building List</h2>
        <p className="text-muted mb-0">Here’s a summary of all the submitted buildings.</p>

        {/* Search input */}
        <input
          type="search"
          placeholder="Search by building name or address"
          className="form-control mt-3 mx-auto d-block text-center"
          style={{ maxWidth: "400px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "60vh" }}
        >
          <RAGLoader />
        </div>
      ) : (
        <>
          

          {/* Buildings list */}
          {filteredBuildings.length === 0 ? (
            <div className="alert alert-info">No buildings found.</div>
          ) : (
            <div className="row">
              {/* Create New Building card at top */}
          <div
            className="col-md-6 col-lg-4 mb-4"
            onClick={() => navigate("/CreateBuilding")}
            style={{ cursor: "pointer", maxWidth: "300px", margin: "0 auto 30px" }}
          >
            <div
              className="card border-0 shadow-sm h-auto d-flex justify-content-center align-items-center text-center hover-shadow"
              style={{ minHeight: "150px" }}
            >
              <button className="btn text-primary">
                <i className="bi bi-plus-circle me-2"></i> Create New Building
              </button>
            </div>
          </div>
              {[...filteredBuildings].reverse().map((building, index) => (
                <div className="col-md-6 col-lg-4 mb-4" key={index}>
                  
                  <div
                    ref={(el) => (cardsRef.current[index] = el)}
                    className="card border-0 shadow-sm h-auto hover-shadow position-relative"
                  >
                    <div
                      className="position-absolute top-0 end-0 p-2"
                      style={{ zIndex: 1 }}
                    >
                      <i
                        className="bi bi-pencil-square text-primary me-3"
                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                        onClick={() => handleEdit(building)}
                        title="Edit"
                      ></i>
                      <i
                        className="bi bi-trash text-danger"
                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                        onClick={() => handleDelete(building.id)}
                        title="Delete"
                      ></i>
                    </div>

                    <div
                      className="card-body"
                      onClick={() => handleSubmit(building.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <h5 className="card-title text-dark mb-3">
                        🏢 {building.building_name || `Building #${index + 1}`}
                      </h5>
                      <p className="mb-2">
                        <i className="bi bi-calendar3 me-2 text-secondary"></i>
                        <strong>Year Built:</strong>{" "}
                        <span className="badge text-dark">
                          {building.year || "N/A"}
                        </span>
                      </p>
                      <p>
                        <i className="bi bi-geo-alt-fill me-2 text-secondary"></i>
                        <strong>Address:</strong> {building.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
