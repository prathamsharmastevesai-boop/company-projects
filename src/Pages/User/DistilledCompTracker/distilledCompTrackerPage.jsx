import React, { useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { DistilledCompTrackerList } from "./distilledCompTrackerList";
import { DistilledCompTracker } from "./distilledCompTracker";

export const DistilledCompTrackerPage = () => {
  const [activeTab, setActiveTab] = useState("chart");

  const headerTitle =
    activeTab === "chart"
      ? "Distilled Comp Tracker Benchmark"
      : "Distilled Comp Tracker List";

  return (
    <Container fluid className="p-0">
      <div
        className="px-3 py-3 sticky-top"
        style={{ backgroundColor: "#212529", zIndex: 10 }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <h5 className="text-white m-0 mx-4">{headerTitle}</h5>
          <div className="d-flex flex-wrap gap-2 px-3">
            <Button
              variant={activeTab === "chart" ? "light" : "outline-light"}
              onClick={() => setActiveTab("chart")}
              className="flex-grow-1 flex-md-grow-0"
            >
              DCT
            </Button>
            <Button
              variant={activeTab === "list" ? "light" : "outline-light"}
              onClick={() => setActiveTab("list")}
              className="flex-grow-1 flex-md-grow-0"
            >
              List
            </Button>
          </div>
        </div>
      </div>

      <Row className="justify-content-center px-3">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            {activeTab === "chart" && <DistilledCompTracker />}
            {activeTab === "list" && <DistilledCompTrackerList />}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
