import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Spinner, Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FeedbackSubmit } from "../../../Networking/User/APIs/Feedback/feedbackApi";

export const Feedback = () => {
  const dispatch = useDispatch();

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error("Please enter some information.");
      return;
    }

    const data = { feedback };

    try {
      setLoading(true);
      await dispatch(FeedbackSubmit(data));

      setFeedback("");

      const updatedList = "";
      setFeedbackList(updatedList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="header-bg {
-bg d-flex justify-content-start px-3 align-items-center sticky-header"
      >
        <h5 className="mb-0 text-light">Information Collaboration</h5>
      </div>
      <div className="container py-5 d-flex flex-column align-items-center">
        <Card
          className="p-4 shadow-lg border-0 rounded-4 mb-5"
          style={{ width: "100%", maxWidth: 500, background: "#f8f9fa" }}
        >
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Share Information</Form.Label>

              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Share here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                style={{ resize: "none", borderRadius: "12px" }}
              />
            </Form.Group>

            <div className="text-center">
              <Button
                type="submit"
                className="px-5 py-2 fw-semibold"
                style={{
                  borderRadius: "25px",
                  background: "#007bff",
                  border: "none",
                  fontSize: "16px",
                }}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" animation="border" /> : "Submit"}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
};
