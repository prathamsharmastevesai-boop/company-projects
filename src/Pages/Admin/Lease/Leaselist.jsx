import React from "react";
import { Card, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export const LeaseList = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const initialBuildings = location?.state?.office;

  const id = initialBuildings?.buildingId

  const handleLease = (Building_id) => {
    navigate("/LeaseInfo", {
      state: {
        office: { Building_id, type: "Lease" }
      }
    });
    ;
  };

  const handleLOI = (Building_id) => {
    navigate("/LeaseInfo", {
      state: {
        office: { Building_id, type: "LOI" }
      }
    });
    ;
  };

  return (
    <>
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
          <h5 className="fw-bold text-dark">Select Section to Upload Lease Agreement or Letter of Intent</h5>
        </div>

        <Card style={{ minHeight: "16rem" }} className="shadow-lg border-0">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-4">
            <Card.Title className="fs-3 mb-3">Lease Agreement</Card.Title>
            <Card.Text className="fs-6 mb-4">
              Upload documents related to <strong>Lease Agreement</strong> here.
            </Card.Text>
            <Button variant="dark" size="lg" onClick={() => handleLease(id)}>
              Click Here to Upload Lease Agreement
            </Button>
          </Card.Body>
        </Card>
        <Card style={{ minHeight: "16rem" }} className="shadow-lg border-0">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-4">
            <Card.Title className="fs-3 mb-3">Letter of Intent</Card.Title>
            <Card.Text className="fs-6 mb-4">
              Upload documents related to <strong>Letter of Intent</strong> here.
            </Card.Text>
            <Button variant="dark" size="lg" onClick={() => handleLOI(id)}>
              Click Here to Upload Letter of Intent
            </Button>
          </Card.Body>
        </Card>
      </div>

    </>
  );
};
