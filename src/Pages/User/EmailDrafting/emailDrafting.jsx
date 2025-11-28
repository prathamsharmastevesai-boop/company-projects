import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Modal,
  Dropdown,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  Deletetemplate,
  emailDraftingList,
  newEmailTemplateAPI,
  templateUpdateApi,
} from "../../../Networking/User/APIs/EmailDrafting/emailDraftingApi";
import RAGLoader from "../../../Component/Loader";
import { toast } from "react-toastify";

export const EmailDrafting = () => {
  const dispatch = useDispatch();

  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [detail, setDetail] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [newInfoContent, setNewInfoContent] = useState("");
  const [newInfoTitle, setNewInfoTitle] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const templateResponse = await dispatch(emailDraftingList()).unwrap();
      const data = templateResponse?.data || templateResponse || [];
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setDetail("");
    setIsEditable(false);
  }, [selectedTemplateId]);

  const openIn = (service) => {
    const subject =
      templates.find((t) => String(t.id) === String(selectedTemplateId))
        ?.title || "Email Draft";
    const body = encodeURIComponent(detail);

    let url = "";

    if (service === "gmail") {
      url = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
        subject
      )}&body=${body}`;
    }

    window.open(url, "_blank");
  };

  const openEditModal = (template_id) => {
    const selected = templates.find((t) => t.id === template_id);

    if (selected) {
      setEditId(template_id);
      setEditTitle(selected?.title || "");
      setEditContent(selected?.content || "");
      setShowEditModal(true);
    }
  };

  const handleUpdateTemplate = async () => {
    setLoading(true);
    try {
      await dispatch(
        templateUpdateApi({
          template_id: editId,
          title: editTitle,
          content: editContent,
        })
      ).unwrap();
      toast.success("Template updated successfully!");
      await fetchData();

      setShowEditModal(false);
      setEditId("");
      setEditTitle("");
      setEditContent("");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (template_id) => {
    try {
      setDeleteLoading(true);

      await dispatch(Deletetemplate({ template_id })).unwrap();

      await fetchData();

      toast.success("Template deleted successfully!");
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDraftEmail = () => {
    if (!selectedTemplateId) {
      toast.error("Please select a template first!");
      return;
    }

    const selectedTemplate = templates.find(
      (t) => String(t.id) === String(selectedTemplateId)
    );

    setDetail(selectedTemplate?.content || "");
    setIsEditable(true);
    toast.success("Email draft loaded successfully!");
  };

  const handleAddInfoModal = () => {
    setNewInfoTitle("");
    setNewInfoContent("");
    setShowInfoModal(true);
  };

  const handleSubmitInfo = async () => {
    if (!newInfoTitle.trim() || !newInfoContent.trim()) {
      toast.warning("Please enter both template title and content.");
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        newEmailTemplateAPI({
          title: newInfoTitle,
          content: newInfoContent,
        })
      ).unwrap();

      await fetchData();

      toast.success("Template added successfully!");
      setShowInfoModal(false);
      setNewInfoTitle("");
      setNewInfoContent("");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="header-bg d-flex justify-content-start px-3 align-items-center sticky-header">
        <h5 className="mb-0 text-light">Email Drafting</h5>
      </div>

      <Card className="p-3 p-md-4 shadow-sm mx-auto" style={{ maxWidth: 900 }}>
        {loading && (
          <div className="text-center my-3">
            <RAGLoader />
          </div>
        )}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Select Email Template</Form.Label>
            <Row className="g-2 align-items-center">
              <Col sm={10}>
                <Dropdown className="w-100">
                  <Dropdown.Toggle className="w-100 text-start" variant="light">
                    {selectedTemplateId
                      ? templates.find((t) => t.id === selectedTemplateId)
                          ?.title
                      : "-- Select Email Template --"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="w-100 mt-1 p-0">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="d-flex justify-content-between align-items-center px-3 py-2 dropdown-item"
                        onClick={() => setSelectedTemplateId(template.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          className="text-truncate"
                          style={{ maxWidth: "70%" }}
                        >
                          {template.title}
                        </span>

                        <div className="d-flex gap-2">
                          <i
                            className="bi bi-pencil-square text-primary"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(template.id);
                            }}
                          ></i>

                          <i
                            className={`bi bi-trash text-danger ${
                              deleteLoading ? "disabled" : ""
                            }`}
                            style={{
                              cursor: deleteLoading ? "not-allowed" : "pointer",
                            }}
                            onClick={(e) => {
                              if (deleteLoading) return;
                              e.stopPropagation();
                              handleDeleteTemplate(template.id);
                            }}
                          ></i>
                        </div>
                      </div>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>

              <Col sm={2}>
                <Button
                  variant="outline-success"
                  className="w-100 mt-2 mt-sm-0"
                  onClick={handleAddInfoModal}
                >
                  <i className="bi bi-plus-lg"></i>
                </Button>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="my-3">
            <Row className="d-flex align-items-center justify-content-between mb-2">
              <Col xs={12} md="auto">
                <h5>Detail</h5>
              </Col>

              <Col xs={12} md="auto" className="d-flex gap-2 mt-2 mt-md-0">
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleDraftEmail}
                  disabled={loading}
                >
                  <i className="bi bi-envelope-paper me-2"></i>
                  {loading ? "Generating..." : "Generate Email Draft"}
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openIn("gmail")}
                >
                  Open in Gmail
                </Button>
              </Col>
            </Row>

            <Form.Control
              as="textarea"
              rows={6}
              value={detail}
              placeholder="Details will appear here..."
              readOnly={!isEditable}
              onChange={(e) => setDetail(e.target.value)}
            />
          </Form.Group>
        </Form>

        <Modal
          show={showInfoModal}
          onHide={() => setShowInfoModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New Email Template</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {loading && (
              <div className="text-center my-3">
                <RAGLoader />
              </div>
            )}

            {!loading && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Template Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter template title"
                    value={newInfoTitle}
                    onChange={(e) => setNewInfoTitle(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <small className="text-muted">Suggestions:</small>
                  <div className="d-flex flex-wrap gap-2 mt-1">
                    {[
                      "Rent Reminder",
                      "Lease Renewal Notice",
                      "Payment Acknowledgement",
                      "Maintenance Update",
                      "Late Fee Notice",
                    ].map((suggestion, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant={
                          newInfoTitle === suggestion
                            ? "success"
                            : "outline-secondary"
                        }
                        onClick={() => setNewInfoTitle(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Template Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Write template content here..."
                    value={newInfoContent}
                    onChange={(e) => setNewInfoContent(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowInfoModal(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleSubmitInfo}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Template"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Template Modal */}
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Email Template</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {loading && (
              <div className="text-center my-3">
                <RAGLoader />
              </div>
            )}

            {!loading && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Template Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter template title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Template Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Write template content here..."
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateTemplate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Template"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </>
  );
};
