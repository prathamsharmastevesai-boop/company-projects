import React, { useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { Feedback } from "./feedback";
import { AdminFeedback } from "../../Admin/Feedback/adminFeedback";

export const InformationCollaborationPage = () => {
  const [activeTab, setActiveTab] = useState("form");

  const headerTitle = "Information Collaboration";

  return (
    <>
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center px-3 py-3 sticky-top flex-wrap"
        style={{
          backgroundColor: "#212529",
          zIndex: 10,
        }}
      >
        <h5 className="text-white m-0 flex-grow-1">{headerTitle}</h5>

        <div className="d-flex gap-2 mt-2 mt-md-0 w-100 w-md-auto">
          <Button
            className="w-100 w-md-auto"
            variant={activeTab === "form" ? "light" : "outline-light"}
            onClick={() => setActiveTab("form")}
          >
            Information Collaboration
          </Button>

          <Button
            className="w-100 w-md-auto"
            variant={activeTab === "list" ? "light" : "outline-light"}
            onClick={() => setActiveTab("list")}
          >
            Collaboration List
          </Button>
        </div>
      </div>

      <Container fluid className="mt-3">
        <Row>
          <Col xs={12}>
            <Card className="p-3 shadow-sm border-0">
              {activeTab === "form" && <Feedback />}
              {activeTab === "list" && <AdminFeedback />}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
