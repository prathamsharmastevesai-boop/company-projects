import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Spinner, Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  FeedbackSubmit,
  gefeedbackSubmit,
} from "../../../Networking/User/APIs/Feedback/feedbackApi";

export const Feedback = () => {
  const dispatch = useDispatch();

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback || rating === 0) {
      toast.error("Please write feedback and select a rating.");
      return;
    }

    const data = { feedback, rating };

    try {
      setLoading(true);
      await dispatch(FeedbackSubmit(data));
      setFeedback("");
      setRating(0);
      setHover(0);

      const updatedList = "";
      setFeedbackList(updatedList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sortedFeedback = [...feedbackList].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="container py-5 d-flex flex-column align-items-center">
      <Card
        className="p-4 shadow-lg border-0 rounded-4 mb-5"
        style={{ width: "100%", maxWidth: 500, background: "#f8f9fa" }}
      >
        <h4 className="text-center mb-3" style={{ color: "#333" }}>
          We Value Your Feedback
        </h4>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Your Feedback</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Share your thoughts about our service..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              style={{ resize: "none", borderRadius: "12px" }}
            />
          </Form.Group>

          <div className="mb-4 text-center">
            <Form.Label className="fw-semibold d-block mb-2">
              Rate Us
            </Form.Label>
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`bi ${
                  star <= (hover || rating) ? "bi-star-fill" : "bi-star"
                }`}
                style={{
                  fontSize: "2rem",
                  color: star <= (hover || rating) ? "#f8c300" : "#ccc",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  margin: "0 5px",
                }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              ></i>
            ))}
          </div>

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
              {loading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
