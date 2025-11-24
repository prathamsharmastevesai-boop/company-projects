import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getadminfeedbacksubmit } from "../../../Networking/Admin/APIs/feedbackApi";
import {
  Card,
  Row,
  Col,
  Container,
  Modal,
  Button,
  Accordion,
} from "react-bootstrap";
import RAGLoader from "../../../Component/Loader";
import { DeleteFeedbackSubmit } from "../../../Networking/User/APIs/Feedback/feedbackApi";

export const AdminFeedback = () => {
  const dispatch = useDispatch();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

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

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await dispatch(DeleteFeedbackSubmit(selectedId)).unwrap();
      setFeedbacks((prev) => prev.filter((item) => item.id !== selectedId));
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setDeleteLoading(false);
      setShowModal(false);
      setSelectedId(null);
    }
  };

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
      <h2 className="mb-4 text-start fw-bold" style={{ color: "#333" }}>
        Information Collaboration
      </h2>

      {feedbacks.length === 0 ? (
        <p className="text-center text-muted fs-5">No feedback available.</p>
      ) : (
        <Row className="g-4">
          {feedbacks.map((fb) => (
            <Col key={fb.id} xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card
                className="border-0 shadow-sm"
                style={{
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(8px)",
                  transition: "transform .25s ease, box-shadow .25s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-6px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0px)")
                }
              >
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="fw-semibold mb-1 text-dark">
                        {fb.user_email}
                      </h6>
                      <small className="text-muted">
                        User Feedback Received
                      </small>
                    </div>

                    <button
                      className="btn btn-light border-0 p-1 shadow-sm"
                      style={{
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => openDeleteModal(fb.id)}
                    >
                      <i className="bi bi-trash text-danger"></i>
                    </button>
                  </div>

                  <Accordion>
                    <Accordion.Item
                      eventKey="0"
                      className="border-0 shadow-sm"
                      style={{ borderRadius: "12px" }}
                    >
                      <Accordion.Header>View Feedback</Accordion.Header>

                      <Accordion.Body
                        className="text-secondary"
                        style={{ lineHeight: 1.5 }}
                      >
                        {fb.feedback}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        show={showModal}
        onHide={() => !deleteLoading && setShowModal(false)}
        centered
      >
        <Modal.Header closeButton={!deleteLoading}>
          <Modal.Title className="fw-semibold">Delete Feedback</Modal.Title>
        </Modal.Header>

        <Modal.Body className="fs-6">
          {deleteLoading ? (
            <div className="text-center py-2">
              <div className="spinner-border text-danger" role="status"></div>
              <p className="mt-2">Deleting, please wait...</p>
            </div>
          ) : (
            "Are you sure you want to delete this feedback permanently?"
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
