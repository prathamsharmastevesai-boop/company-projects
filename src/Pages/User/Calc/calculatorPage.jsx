import React, { useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { LeaseFinanceCalculator } from "./calculator";
import { CommissionCalculator } from "./calcComission";
import { TICalculator } from "./tiCalculator";

export const CalulatorPage = () => {
  const [activeTab, setActiveTab] = useState("form");

  const headerTitle = "Lease Finance Calculator";

  return (
    <>
      <div
        className="px-3 py-3 sticky-top"
        style={{ backgroundColor: "#212529", zIndex: 10 }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <h5 className="text-white m-0 mx-4 mb-2 mb-md-0 text-center text-md-start">{headerTitle}</h5>

          <div className="d-flex gap-2 flex-wrap justify-content-center justify-content-md-end mx-4">
            <Button
              size="sm"
              variant={activeTab === "form" ? "light" : "outline-light"}
              onClick={() => setActiveTab("form")}
            >
              NET Effective Rent
            </Button>

            <Button
              size="sm"
              variant={activeTab === "list" ? "light" : "outline-light"}
              onClick={() => setActiveTab("list")}
            >
              Commission Calculator
            </Button>
             <Button
              size="sm"
              variant={activeTab === "list" ? "light" : "outline-light"}
              onClick={() => setActiveTab("tiCalculator")}
            >
             TiCalculator
            </Button>
            
          </div>
        </div>
      </div>

      <Container fluid className="mt-3">
        <Row>
          <Col xs={12}>
            <Card className="no-shadow-hover border-0">
              {activeTab === "form" && <LeaseFinanceCalculator />}
              {activeTab === "list" && <CommissionCalculator />}
              {activeTab === "tiCalculator" && <TICalculator />}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
