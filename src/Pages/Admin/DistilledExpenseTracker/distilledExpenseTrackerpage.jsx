import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { DistilledExpenseTracker } from "./distilledExpenseTracker";
import { DistilledExpenseTrackerlist } from "./distilledExpenseTrackerlist";

export const DistilledExpenseTrackerPage = () => {
  const [activeTab, setActiveTab] = useState("form");

  const headerTitle =
    activeTab === "form" ? "Add Submission" : "Submissions List";

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-center px-3 py-3 sticky-top"
        style={{
          backgroundColor: "#212529",
          zIndex: 10,
        }}
      >
        <h5 className="text-white m-0">{headerTitle}</h5>

        <div className="d-flex gap-2">
          <Button
            variant={activeTab === "form" ? "light" : "outline-light"}
            onClick={() => setActiveTab("form")}
          >
            Add Submission
          </Button>

          <Button
            variant={activeTab === "list" ? "light" : "outline-light"}
            onClick={() => setActiveTab("list")}
          >
            View Submissions
          </Button>
        </div>
      </div>

      <Card className="p-3 shadow-sm border-0 mt-3">
        {activeTab === "form" && <DistilledExpenseTracker />}
        {activeTab === "list" && <DistilledExpenseTrackerlist />}
      </Card>
    </>
  );
};
