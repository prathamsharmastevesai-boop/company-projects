import React from "react";
import { Card, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export const UserLeaseList = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const initialBuildings = location.state?.office;

  const handleLease = (Building_id, type) => {
    navigate("/UserChat", { state: {  Building_id, type  } });
  };

  return (
    <>
      <div
        className="hero-section text-center bg-white pt-5 animate__animated animate__fadeInDown"
        style={{ position: "sticky", top: 0, zIndex: 10, height: "20vh",marginBottom:"30px", borderBottom: "1px solid #dee2e6" }}
      >
        <h5 className="heading_lease text-center text-light">Select Section to Chat with Lease Agreement or Letter of Intent</h5>
      </div>
      <div className="lease_select ">
        <div className="d-flex justify-content-center gap-4 p-4 flex-wrap">

          <Card style={{ minHeight: "16rem" }} className="shadow-lg border-0">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-4">
              <Card.Title className="fs-3 mb-3">Lease Agreement</Card.Title>
              <Card.Text className="fs-6 mb-4">
                Upload documents related to <strong>Lease Agreement</strong> here.
              </Card.Text>
              <Button variant="dark" size="lg" onClick={() => handleLease(initialBuildings?.buildingId, "Lease")}>
                Click Here to Chat With Lease Agreement
              </Button>
            </Card.Body>
          </Card>
          <Card style={{ minHeight: "16rem" }} className="shadow-lg border-0">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-4">
              <Card.Title className="fs-3 mb-3">Letter of Intent</Card.Title>
              <Card.Text className="fs-6 mb-4">
                Upload documents related to <strong>Letter of Intent</strong> here.
              </Card.Text>
              <Button variant="dark" size="lg" onClick={() =>  handleLease(initialBuildings?.buildingId, "LOI")}>
                Click Here to Chat With Letter of Intent
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};
