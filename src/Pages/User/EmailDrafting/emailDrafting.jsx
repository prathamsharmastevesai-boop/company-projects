import React, { useState, useEffect } from "react";
import { Form, Button, Card, Modal, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  emailDraftingList,
  // generateTemplate,
  newEmailTemplateAPI,
  // newTenentAPI,
  // tenentNameList,
} from "../../../Networking/User/APIs/EmailDrafting/emailDraftingApi";
import RAGLoader from "../../../Component/Loader";

export const EmailDrafting = () => {
  const dispatch = useDispatch();

  // const [tenants, setTenants] = useState([]);
  const [templates, setTemplates] = useState([]);
  // const [selectedTenant, setSelectedTenant] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const [detail, setDetail] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [entries, setEntries] = useState([{ key: "", value: "" }]);
  // const [error, setError] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [newInfoContent, setNewInfoContent] = useState("");
  const [newInfoTitle, setNewInfoTitle] = useState("");

  // const [showTenantModal, setShowTenantModal] = useState(false);

  // const [newTenantName, setNewTenantName] = useState("");
  // const [tenantError, setTenantError] = useState("");

  // const [isDraftGenerated, setIsDraftGenerated] = useState(false);

  // useEffect(() => {
  //   if (!isDraftGenerated && selectedTemplateId) {
  //     const selectedTemplate = templates.find(
  //       (t) => String(t.id) === String(selectedTemplateId)
  //     );
  //     setDetail(selectedTemplate?.draft_content || "");
  //     setIsEditable(false);
  //   }
  //   if (!selectedTemplateId) {
  //     setDetail("");
  //   }
  // }, [selectedTemplateId, templates, isDraftGenerated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // const tenantResponse = await dispatch(tenentNameList()).unwrap();
      // setTenants(tenantResponse?.data || tenantResponse || []);

      const templateResponse = await dispatch(emailDraftingList()).unwrap();
      const data = templateResponse?.data || templateResponse || [];
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching tenants or templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setDetail("");
    setIsEditable(false);
    // setIsDraftGenerated(false);
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
    if (service === "outlook") {
      url = `https://outlook.live.com/mail/deeplink/compose?subject=${encodeURIComponent(
        subject
      )}&body=${body}`;
    }
    if (service === "yahoo") {
      url = `https://compose.mail.yahoo.com/?subject=${encodeURIComponent(
        subject
      )}&body=${body}`;
    }

    window.open(url, "_blank");
  };

  // const handleOpenInEmail = () => {
  //   if (!detail.trim()) {
  //     alert("No email draft available to open.");
  //     return;
  //   }

  //   const subject =
  //     templates.find((t) => String(t.id) === String(selectedTemplateId))
  //       ?.title || "Email Draft";

  //   const body = encodeURIComponent(detail);

  //   const mailtoLink = `mailto:?subject=${encodeURIComponent(
  //     subject
  //   )}&body=${body}`;

  //   window.location.href = mailtoLink;
  // };

  const handleDraftEmail = () => {
    if (!selectedTemplateId) {
      alert("Please select a template first!");
      return;
    }

    const selectedTemplate = templates.find(
      (t) => String(t.id) === String(selectedTemplateId)
    );

    setDetail(selectedTemplate?.content || "");
    setIsEditable(true);
    // setIsDraftGenerated(true);

    alert("Email draft loaded successfully!");
  };

  // const handleDraftEmail = async () => {
  //   if (!selectedTemplateId) {
  //     alert("Please select both Tenant and Template first!");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const response = await dispatch(
  //       generateTemplate({
  //         template_id: selectedTemplateId,
  //         // tenant_id: selectedTenant,
  //       })
  //     ).unwrap();

  //     const generatedContent = response?.draft_content || "";
  //     console.log(generatedContent, "generatedContent");

  //     setDetail(generatedContent);
  //     setIsEditable(true);
  //     setIsDraftGenerated(true);

  //     alert(` Email draft generated successfully!`);
  //   } catch (error) {
  //     console.error("Error generating email draft:", error);
  //     alert(error.message || "Failed to generate email draft");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAddInfoModal = () => {
    setNewInfoContent("");
    setShowInfoModal(true);
  };

  // const handleChangeEntry = (index, field, value) => {
  //   const updated = [...entries];
  //   updated[index][field] = value;
  //   setEntries(updated);
  // };

  // const handleAddEntry = () => {
  //   setEntries([...entries, { key: "", value: "" }]);
  // };

  // const handleSubmitTenant = async () => {
  //   if (!newTenantName.trim()) {
  //     setTenantError("Tenant name is required");
  //     return;
  //   }

  //   const formattedData = {};
  //   entries.forEach((entry) => {
  //     if (entry.key && entry.value) {
  //       formattedData[entry.key] = entry.value;
  //     }
  //   });

  //   try {
  //     setTenantError("");
  //     setLoading(true);

  //     const payload = {
  //       name: newTenantName,
  //       data: JSON.parse(JSON.stringify(formattedData)),
  //     };

  //     fetchData();
  //     alert("Tenant added successfully!");
  //     // setTenants((prev) => [...prev, response.data || { name: newTenantName }]);
  //     // setShowTenantModal(false);
  //     setNewTenantName("");
  //     setEntries([{ key: "", value: "" }]);
  //   } catch (error) {
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmitInfo = async () => {
    if (!newInfoTitle.trim() || !newInfoContent.trim()) {
      alert("Please enter both template title and content.");
      return;
    }

    try {
      setLoading(true);

      const response = await dispatch(
        newEmailTemplateAPI({
          title: newInfoTitle,
          content: newInfoContent,
        })
      ).unwrap();

      await fetchData();

      alert("Template added successfully!");

      setTemplates((prev) => [
        ...prev,
        response.data || { title: newInfoTitle, content: newInfoContent },
      ]);

      setShowInfoModal(false);
      setNewInfoTitle("");
      setNewInfoContent("");
    } catch (error) {
      alert(error.message || "Failed to add template");
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
        <h5 className="mb-0 text-light">Email Drafting</h5>
      </div>

      <Card
        className="p-4 shadow-sm"
        style={{ maxWidth: "700px", margin: "20px auto" }}
      >
        {loading && (
          <div className="text-center my-3">
            <RAGLoader />
          </div>
        )}

        <Form>
          <Form.Group className="mb-3">
            {/* <Form.Label>Select Tenant</Form.Label> */}
            {/* <div className="d-flex align-items-center gap-2">
            <Form.Select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
            >
              <option value="">-- Select Tenant --</option>
              {tenants.map((tenant, idx) => (
                <option key={idx} value={tenant.id || tenant._id}>
                  {tenant.name || tenant.tenantName || `Tenant ${tenant.id}`}
                </option>
              ))}
            </Form.Select>
            <Button
              variant="outline-success"
              onClick={() => setShowTenantModal(true)}
            >
              <i className="bi bi-plus-lg"></i>
            </Button>
          </div> */}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Email Template</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Select
                value={selectedTemplateId}
                onChange={(e) => {
                  setSelectedTemplateId(e.target.value);
                  // setIsDraftGenerated(false);
                }}
              >
                <option value="">-- Select Email Template --</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                ))}
              </Form.Select>
              <Button variant="outline-success" onClick={handleAddInfoModal}>
                <i className="bi bi-plus-lg"></i>
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="my-3">
            <div className="d-flex justify-content-between my-2">
              <h5>Detail</h5>

              <div className="d-flex gap-2 justify-content-end">
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
                  className="ms-2"
                  onClick={() => openIn("gmail")}
                >
                  Open in Gmail
                </Button>
              </div>
            </div>

            <Form.Control
              as="textarea"
              rows={4}
              value={detail}
              placeholder="Details will appear here..."
              readOnly={!isEditable}
              onChange={(e) => setDetail(e.target.value)}
            />
          </Form.Group>
        </Form>

        {/* <Modal
        show={showTenantModal}
        onHide={() => setShowTenantModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Tenant(s)</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {loading && (
            <div className="text-center my-3">
              <RAGLoader />
            </div>
          )}

          {!loading && (
            <>
              <Alert variant="info" className="small">
                ⚠️ Tenant key should start with a capital letter and contain no
                spaces or symbols.
              </Alert>

              <Form.Group className="mb-3">
                <Form.Label>Tenant Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Tenant Name"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                />
                {tenantError && (
                  <small className="text-danger">{tenantError}</small>
                )}
              </Form.Group>

              <Form.Label>Tenant Details (Key-Value Pairs)</Form.Label>
              {entries.map((entry, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center gap-2 mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Tenant Key"
                    value={entry.key}
                    onChange={(e) =>
                      handleChangeEntry(index, "key", e.target.value)
                    }
                  />
                  <Form.Control
                    type="text"
                    placeholder="Lease Summary Value"
                    value={entry.value}
                    onChange={(e) =>
                      handleChangeEntry(index, "value", e.target.value)
                    }
                  />
                </div>
              ))}

              {error && <Alert variant="danger">{error}</Alert>}

              <Button variant="outline-primary" onClick={handleAddEntry}>
                <i className="bi bi-plus-lg me-1"></i> Add More
              </Button>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTenantModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleSubmitTenant}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal> */}

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
      </Card>
    </>
  );
};
