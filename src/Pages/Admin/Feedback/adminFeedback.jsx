import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getadminfeedbacksubmit } from "../../../Networking/Admin/APIs/feedbackApi";
import { Card, Badge, Row, Col, Container } from "react-bootstrap";
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
    <Container fluid className="py-4 px-3">
      <h2 className="mb-4 text-start text-dark fw-semibold">
        User Feedback List
      </h2>

      {feedbacks.length === 0 ? (
        <p className="text-center text-muted">No feedback available.</p>
      ) : (
        <Row className="g-4">
          {feedbacks.map((fb) => (
            <Col
              key={fb.id}
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={3}
              className="d-flex"
            >
              <Card
                className="shadow-sm flex-fill border-0 hover-shadow"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Title className="mb-0 text-truncate">
                      {fb.user_email}
                    </Card.Title>
                    <Badge
                      bg={
                        fb.rating >= 4
                          ? "success"
                          : fb.rating >= 2
                          ? "warning"
                          : "danger"
                      }
                      pill
                    >
                      {fb.rating} ★
                    </Badge>
                  </div>
                  <Card.Text className="text-secondary mb-3">
                    {fb.feedback}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted small text-end bg-light">
                  {new Date(fb.created_at).toLocaleString()}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};
