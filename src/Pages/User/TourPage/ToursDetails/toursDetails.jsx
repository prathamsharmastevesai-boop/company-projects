import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Container, Modal, Button, Table } from "react-bootstrap";
import {
  DeleteToursSubmit,
  GeToursList,
} from "../../../../Networking/User/APIs/Tours/toursApi";
import { toast } from "react-toastify";
import RAGLoader from "../../../../Component/Loader";

export const ToursDetails = () => {
  const dispatch = useDispatch();

  const [toursList, setToursList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [viewModal, setViewModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  // Fetch tours
  useEffect(() => {
    const fetchData = async () => {
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

  // Open modal to view notes
  const openViewModal = (tour) => {
    setSelectedTour(tour);
    setViewModal(true);
  };

  // Delete modal
  const openDeleteModal = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      await dispatch(DeleteToursSubmit(deleteId)).unwrap();
      setToursList((prev) => prev.filter((item) => item.id !== deleteId));
      toast.success("Tour deleted successfully");
    } catch (err) {
      toast.error("Error deleting tour");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  // Loader
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
        {toursList.length === 0 ? (
          <div className="text-center py-5">
            <h5>No tours found</h5>
            <p className="text-muted">No tour activity available.</p>
          </div>
        ) : (
          <div className="table-responsive mt-3">
            <Table className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Building</th>
                  <th>User Email</th>
                  <th>Date</th>
                  <th>Floor</th>
                  <th>Tenant</th>
                  <th>Broker</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {toursList.map((tour) => (
                  <tr key={tour.id}>
                    <td>{tour.building || "N/A"}</td>
                    <td>{tour.user_email || "N/A"}</td>
                    <td>{tour.date?.split("T")[0] || "N/A"}</td>
                    <td>{tour.floor_suite || "N/A"}</td>
                    <td>{tour.tenant || "N/A"}</td>
                    <td>{tour.broker || "N/A"}</td>

                    <td>
                      <button
                        className="btn btn-sm text-white me-2"
                        style={{
                          backgroundColor: "#217ae6",
                          borderColor: "#217ae6",
                          padding: "4px 12px",
                        }}
                        onClick={() => openViewModal(tour)}
                      >
                        View Notes
                      </button>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        style={{ padding: "4px 12px" }}
                        onClick={() => openDeleteModal(tour.id)}
                        disabled={deleteLoading && deleteId === tour.id}
                      >
                        {deleteLoading && deleteId === tour.id ? (
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
          <Modal.Title className="fw-semibold">Tour Notes</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedTour && (
            <>
              <p>
                <strong>Building:</strong> {selectedTour.building}
              </p>
              <p>
                <strong>Date:</strong> {selectedTour?.date?.split("T")[0]}
              </p>

              <hr />

              <p>
                <strong>Notes:</strong>
              </p>
              <p className="text-muted">
                {selectedTour.notes || "No notes available"}
              </p>
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
          <Modal.Title>Delete Tour?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {deleteLoading ? (
            <div className="text-center py-2">
              <div className="spinner-border text-danger"></div>
              <p className="mt-2">Deleting...</p>
            </div>
          ) : (
            "Are you sure you want to permanently delete this tour?"
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
