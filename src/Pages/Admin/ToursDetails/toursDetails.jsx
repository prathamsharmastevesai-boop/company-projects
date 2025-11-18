import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Accordion, Row, Col, Modal, Button } from "react-bootstrap";
import {
  DeleteToursSubmit,
  GeToursList,
} from "../../../Networking/User/APIs/Tours/toursApi";
import { toast } from "react-toastify";
import RAGLoader from "../../../Component/Loader";

export const ToursDetails = () => {
  const dispatch = useDispatch();
  const [toursList, setToursList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await dispatch(GeToursList()).unwrap();
        setToursList(result || []);
      } catch (error) {
        console.error("Error loading tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const openDeleteModal = (id) => {
    setSelectedTourId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      await dispatch(DeleteToursSubmit(selectedTourId)).unwrap();

      setToursList((prev) => prev.filter((item) => item.id !== selectedTourId));
      toast.success("Tour deleted successfully");
    } catch (err) {
      toast.error("Error deleting tour");
    } finally {
      setDeleteLoading(false);
      setShowModal(false);
      setSelectedTourId(null);
    }
  };

  return (
    <div className="m-3">
      <h4 className="mb-3">Tours List</h4>

      {loading && (
        <div className="text-center my-5">
          <RAGLoader />
        </div>
      )}

      {!loading && toursList.length === 0 && (
        <p className="text-center mt-4">No tours found</p>
      )}

      {!loading && (
        <Row>
          {toursList.map((item) => (
            <Col md={4} sm={6} xs={12} key={item.id}>
              <Card className="mb-3 shadow-sm small-card">
                <Card.Body className="p-2">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0 text-dark">{item.building}</h6>

                    <button
                      className="btn btn-sm btn-outline-danger p-1"
                      onClick={() => openDeleteModal(item.id)}
                      style={{ borderRadius: "50%" }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>

                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="mb-1">
                        <small>
                          <strong>Date:</strong> {item.date?.split("T")[0]}
                        </small>
                      </div>
                      <div className="mb-1">
                        <small>
                          <strong>Floor:</strong> {item.floor_suite}
                        </small>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1">
                        <small>
                          <strong>Tenant:</strong> {item.tenant}
                        </small>
                      </div>
                      <div className="mb-1">
                        <small>
                          <strong>Broker:</strong> {item.broker}
                        </small>
                      </div>
                    </div>
                  </div>

                  <Accordion className="mt-2">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <small>Notes</small>
                      </Accordion.Header>
                      <Accordion.Body>
                        <small>
                          {item.notes ? item.notes : "No notes available"}
                        </small>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this tour?</Modal.Body>
        <Modal.Footer>
          {deleteLoading ? (
            <Button variant="danger" disabled>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Deleting...
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Yes, Delete
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};
