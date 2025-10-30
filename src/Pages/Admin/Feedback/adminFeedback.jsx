import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getadminfeedbacksubmit } from "../../../Networking/Admin/APIs/feedbackApi";
import { Card, Badge, Spinner } from "react-bootstrap";
import RAGLoader from "../../../Component/Loader";

export const AdminFeedback = () => {
  const dispatch = useDispatch();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await dispatch(getadminfeedbacksubmit()).unwrap();
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [dispatch]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <RAGLoader />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3 p-3">
      <h2 className="mb-3 text-start text-dark">User Feedback List</h2>

      {feedbacks.length === 0 ? (
        <p className="text-center text-muted">No feedback available.</p>
      ) : (
        feedbacks.map((fb) => (
          <Card
            key={fb.id}
            className="shadow-sm hover-shadow"
            style={{ transition: "0.3s" }}
          >
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>{fb.user_email}</span>
                <Badge
                  bg={
                    fb.rating >= 4
                      ? "success"
                      : fb.rating >= 2
                      ? "warning"
                      : "danger"
                  }
                >
                  {fb.rating} ★
                </Badge>
              </Card.Title>
              <Card.Text>{fb.feedback}</Card.Text>
              <Card.Footer
                className="text-muted"
                style={{ fontSize: "0.8rem" }}
              >
                {new Date(fb.created_at).toLocaleString()}
              </Card.Footer>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};
