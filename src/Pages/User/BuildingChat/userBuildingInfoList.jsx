import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ListBuildingSubmit } from "../../../Networking/Admin/APIs/BuildingApi";
import { useDispatch, useSelector } from "react-redux";
import RAGLoader from "../../../Component/Loader";

export const UserBuildingInfolist = () => {
  const { BuildingList, loading } = useSelector((state) => state.BuildingSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cardsRef = useRef({});

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const category = "BuildingInfo";
    dispatch(ListBuildingSubmit(category));
  }, [dispatch]);

  const filteredBuildings =
    searchTerm.trim() === ""
      ? BuildingList
      : BuildingList.filter((b) =>
          b.address?.toLowerCase().includes(searchTerm.toLowerCase())
        );

  useEffect(() => {
    filteredBuildings.forEach((building, i) => {
      const card = cardsRef.current[building.id];
      if (card) {
        setTimeout(() => {
          card.classList.add("visible");
        }, i * 150);
      }
    });
  }, [filteredBuildings]);

  const goToChat = (buildingId, category) => {
    navigate("/BuildingChat", {
      state: { buildingId, category },
    });
  };

  return (
    <>
      <div className="header-bg d-flex justify-content-start px-3 align-items-center sticky-header">
        <h5 className="mb-0 text-light mx-4">Building Info list</h5>
      </div>

      <div className="container mb-3 mt-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search by address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="container py-2">
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
            {[...filteredBuildings].reverse().map((building) => (
              <div className="col-12 mb-3" key={building.id}>
                <div
                  ref={(el) => (cardsRef.current[building.id] = el)}
                  className="card border-0 shadow-sm slide-in-top p-3"
                  style={{ borderRadius: "16px" }}
                >
                  <div className="d-flex align-items-center justify-content-between ">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                      <div className="fw-semibold">
                        {building.address || "N/A"}
                      </div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() => goToChat(building.id, "floor_plan")}
                      >
                        Floor Plan
                      </button>

                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() => goToChat(building.id, "building_stack")}
                      >
                        Building Stack
                      </button>

                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() => goToChat(building.id, "building_info")}
                      >
                        Building Info
                      </button>
                    </div>
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
