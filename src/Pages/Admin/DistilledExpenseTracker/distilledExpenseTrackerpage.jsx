import React, { useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { DistilledExpenseTracker } from "./distilledExpenseTracker";
import { DistilledExpenseTrackerlist } from "./distilledExpenseTrackerlist";

export const DistilledExpenseTrackerPage = () => {
  const [activeTab, setActiveTab] = useState("form");

  const headerTitle =
    activeTab === "form" ? "Add Submission" : "Submissions List";

  return (
    <Container fluid className="p-0">
      <Row
        className="sticky-top"
        style={{ backgroundColor: "#212529", zIndex: 10 }}
      >
        <Col
          xs={12}
          className="d-flex flex-column flex-md-row justify-content-between align-items-center px-3 py-3 gap-2 gap-md-0"
        >
          <h5 className="text-white m-0">{headerTitle}</h5>
          <div className="d-flex flex-wrap gap-2">
            <Button
              variant={activeTab === "form" ? "light" : "outline-light"}
              onClick={() => setActiveTab("form")}
              className="flex-grow-1 flex-md-grow-0"
            >
              Add Submission
            </Button>
            <Button
              variant={activeTab === "list" ? "light" : "outline-light"}
              onClick={() => setActiveTab("list")}
              className="flex-grow-1 flex-md-grow-0"
            >
              View Submissions
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center ">
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow-sm border-0">
            {activeTab === "form" && <DistilledExpenseTracker />}
            {activeTab === "list" && <DistilledExpenseTrackerlist />}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
