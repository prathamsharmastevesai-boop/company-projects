import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getadminfeedbacksubmit } from "../../../Networking/Admin/APIs/feedbackApi";
import { Container, Modal, Button, Table } from "react-bootstrap";
import RAGLoader from "../../../Component/Loader";
import { DeleteFeedbackSubmit } from "../../../Networking/User/APIs/Feedback/feedbackApi";

export const AdminFeedback = () => {
  const dispatch = useDispatch();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [viewModal, setViewModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

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

  const openViewModal = (feedback) => {
    setSelectedFeedback(feedback);
    setViewModal(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await dispatch(DeleteFeedbackSubmit(deleteId)).unwrap();
      setFeedbacks((prev) => prev.filter((item) => item.id !== deleteId));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
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
    <div>
      <Container
        fluid
        className="p-4 shadow-sm"
        style={{
          background: "#f5f7fa",
          borderRadius: "8px",
          minHeight: "100vh",
        }}
      >
        {feedbacks.length === 0 ? (
          <div className="text-center py-5">
            <h5>Not found</h5>
            <p className="text-muted">
              Users have not submitted any Collaboration yet.
            </p>
          </div>
        ) : (
          <div className="table-responsive mt-3">
            <Table className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>Category</th>

                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {feedbacks.map((fb) => (
                  <tr key={fb.id}>
                    <td>{fb.user_name || "N/A"}</td>
                    <td>{fb.user_email || "N/A"}</td>
                    <td>{fb.category || "N/A"}</td>

                    <td>
                      {new Date(fb.created_at).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "2-digit",
                      })}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm text-white me-2"
                        style={{
                          backgroundColor: "#217ae6",
                          borderColor: "#217ae6",
                          padding: "4px 12px",
                        }}
                        onClick={() => openViewModal(fb)}
                      >
                        View
                      </button>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        style={{ padding: "4px 12px" }}
                        onClick={() => openDeleteModal(fb.id)}
                        disabled={deleteLoading && deleteId === fb.id}
                      >
                        {deleteLoading && deleteId === fb.id ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          <i className="bi bi-trash"></i>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>

      <Modal
        show={viewModal}
        onHide={() => setViewModal(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">
            Collaboration Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedFeedback && (
            <>
              <p>
                <strong>Collaboration:</strong>
              </p>
              <p className="text-muted">{selectedFeedback.feedback}</p>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={!!deleteId}
        centered
        onHide={() => !deleteLoading && setDeleteId(null)}
      >
        <Modal.Header closeButton={!deleteLoading}>
          <Modal.Title>Delete Collaboration?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {deleteLoading ? (
            <div className="text-center py-2">
              <div className="spinner-border text-danger"></div>
              <p className="mt-2">Deleting...</p>
            </div>
          ) : (
            "Are you sure you want to permanently delete this Collaboration?"
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteId(null)}
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
    </div>
  );
};
