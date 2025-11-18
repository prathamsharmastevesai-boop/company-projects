import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getadminfeedbacksubmit } from "../../../Networking/Admin/APIs/feedbackApi";
import {
  Card,
  Badge,
  Row,
  Col,
  Container,
  Modal,
  Button,
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
      <h2 className="mb-4 text-start text-dark fw-semibold">
        Information Collaboration
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

                    <button
                      className="btn btn-sm btn-outline-danger p-1"
                      onClick={() => openDeleteModal(fb.id)}
                      style={{ borderRadius: "50%" }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
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

      <Modal
        show={showModal}
        onHide={() => !deleteLoading && setShowModal(false)}
        centered
      >
        <Modal.Header closeButton={!deleteLoading}>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {deleteLoading ? (
            <div className="text-center py-2">
              <div className="spinner-border text-danger" role="status"></div>
              <p className="mt-2 small">Deleting...</p>
            </div>
          ) : (
            "Are you sure you want to delete this feedback?"
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
            {deleteLoading ? (
              <span>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Deleting...
              </span>
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
