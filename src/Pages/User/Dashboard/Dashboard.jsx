import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import buildingCardImg from '../../../assets/building-card-bg2.jpeg';
import { ListBuildingSubmit } from '../../../Networking/Admin/APIs/BuildingApi';
import { ListLeaseSubmit } from '../../../Networking/Admin/APIs/LeaseApi';
import { RequestPermissionSubmit } from '../../../Networking/User/APIs/Permission/PermissionApi';
import RAGLoader from '../../../Component/Loader';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cardsRef = useRef([]);

  const [requestingPermissionId, setRequestingPermissionId] = useState(null);


  const { BuildingList, loading } = useSelector(state => state.BuildingSlice);

  useEffect(() => {
    dispatch(ListBuildingSubmit());
  }, [dispatch]);

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (card) {
        setTimeout(() => {
          card.classList.add("visible");
        }, i * 150);
      }
    });
  }, [BuildingList]);

  const handleRequestPermission = async (building_id) => {
    if (requestingPermissionId === building_id) return;

    setRequestingPermissionId(building_id);
    try {
      const res = await dispatch(RequestPermissionSubmit({ building_id })).unwrap();
      toast.success("Permission request sent!");
    } catch (err) {
      console.error("Permission request failed:", err);
      toast.error("Permission request failed.");
    } finally {
      setRequestingPermissionId(null);
    }
  };


  const handleSubmit = async (building) => {
    if (building.access_status === "NULL") {
      toast.warning("Press Icon for lease Request");
    } else if (building.access_status === "approved") {
      await dispatch(ListLeaseSubmit(building.id));
      navigate(`/UserLeaseList/${building.id}`);
    } else if (building.access_status === "pending") {
      toast.warning("Request in Pending State");
    } else {
      toast.error("Request denied");
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{ height: '40vh', backgroundColor: '#1f1f1f' }}
        className="hero-section text-white d-flex align-items-center justify-content-center text-center"
      >
        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/6789/6789463.png"
            alt="Under Construction"
            style={{ width: '100px' }}
            className="mb-3 animate__animated animate__fadeInDown"
          />
          <h1 className="display-4 fw-bold animate__animated animate__fadeInUp">Welcome to RAG</h1>
          <p className="lead animate__animated animate__fadeInUp">Your real estate management dashboard is under construction 🛠️</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-4">
        <h2 className="text-start mb-2 fw-bold">🏢 Featured Buildings</h2>
        <hr />

        {loading ? (
          <div className="text-center py-5">
            <RAGLoader />
            <p className="mt-3 text-muted">Loading buildings...</p>
          </div>
        ) : BuildingList.length === 0 ? (
          <div className="alert alert-info">No buildings found.</div>
        ) : (
          <div className="row">
            {[...BuildingList].reverse().map((building, index) => (
              <div className="col-md-6 col-lg-4 mb-4" key={index}>
                <div
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="card border-0 shadow-sm h-100 slide-in-top position-relative overflow-hidden"
                  style={{ backgroundColor: '#1f1f1f', color: 'white', borderRadius: '16px' }}
                >
                  <div
                    className="d-flex align-items-center"
                    style={{
                      height: 160,
                      backgroundImage: `url(${buildingCardImg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderTopLeftRadius: '16px',
                      borderTopRightRadius: '16px'
                    }}
                  ></div>

                  <div className="card-body pt-3 position-relative" onClick={() => handleSubmit(building)}>
                    {/* Lock Icon */}
                    <div
                      className="position-absolute"
                      style={{ top: "10px", right: "10px", zIndex: 2 }}
                      title="Request Access"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestPermission(building.id);
                      }}
                    >
                      {requestingPermissionId === building.id ? (
                        <div className="spinner-border spinner-border-sm text-warning" role="status"></div>
                      ) : (
                        <i
                          className="bi bi-shield-lock-fill text-warning"
                          style={{ cursor: "pointer", fontSize: "1.3rem" }}
                        ></i>
                      )}
                    </div>

                    <h5 className="card-title text-white mb-3">
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
    </div>
  );
};
