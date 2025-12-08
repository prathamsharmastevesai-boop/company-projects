import React, { useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { Feedback } from "./feedback";
import { AdminFeedback } from "../../Admin/Feedback/adminFeedback";

export const InformationCollaborationPage = () => {
  const [activeTab, setActiveTab] = useState("form");

  const headerTitle = "Information Collaboration";

  return (
    <>
      <div
        className="px-3 py-3 sticky-top"
        style={{ backgroundColor: "#212529", zIndex: 10 }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <h5 className="text-white m-0">{headerTitle}</h5>

          <div className="d-flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={activeTab === "form" ? "light" : "outline-light"}
              onClick={() => setActiveTab("form")}
            >
              Information Collaboration
            </Button>

            <Button
              size="sm"
              variant={activeTab === "list" ? "light" : "outline-light"}
              onClick={() => setActiveTab("list")}
            >
              Collaboration List
            </Button>
          </div>
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
