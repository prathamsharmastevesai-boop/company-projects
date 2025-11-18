import React, { useEffect, useState } from "react";
import { Card, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  getUserlistApi,
  inviteUserApi,
  toggleGeminiApi,
} from "../../../Networking/Admin/APIs/UserManagement";
import { DeleteUser } from "../../../Networking/Admin/APIs/LoginAPIs";
import { toast } from "react-toastify";

export const UserManagement = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    if (!email) return toast.error("Email is required");

    setDeleteLoading(email);

    try {
      await dispatch(DeleteUser(email)).unwrap();
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error || "Failed to delete user");
    } finally {
      setDeleteLoading(null);
      setShowConfirm(false);
      setSelectedEmail(null);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getUserlistApi()).unwrap();
      setUsers(res || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGemini = async (email, enable) => {
    setToggleLoading(email);
    try {
      await dispatch(toggleGeminiApi({ email, enable })).unwrap();
      toast.success(`Gemini ${enable ? "enabled" : "disabled"} for ${email}`);
      fetchUsers();
    } catch (error) {
      //   toast.error("Failed to toggle Gemini");
      console.error(error);
    } finally {
      setToggleLoading(null);
    }
  };

  const handleInviteUser = async () => {
    if (!email) return alert("Please enter an email address");
    setInviteLoading(true);
    try {
      await dispatch(inviteUserApi({ email })).unwrap();
      setEmail("");
      fetchUsers();
    } catch (err) {
      console.error("Invite failed:", err);
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="container p-4">
      <h4 className="fw-bold">User Management</h4>
      <p className="text-muted">
        Control user access to Portfolio Pulse documents and features
      </p>

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <p className="mb-0">
            <strong>🔒 Security Model:</strong> Only administrators can create
            user accounts. Users receive secure credentials via email and must
            change passwords on first login.
          </p>
        </Card.Body>
      </Card>

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">
            <i className="bi bi-person-plus me-2"></i> Add New User
          </h5>
          <Form>
            <Row className="g-2">
              <Col xs={12} md={8}>
                <Form.Control
                  type="email"
                  placeholder="Enter user email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={inviteLoading}
                />
              </Col>
              <Col xs={12} md={4}>
                <Button
                  variant="primary"
                  onClick={handleInviteUser}
                  disabled={inviteLoading}
                  className="w-100"
                >
                  {inviteLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Sending...
                    </>
                  ) : (
                    "Invite User"
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Active Users</h5>
            <span className="badge bg-dark">{users.length} Total Users</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Display Name</th>
                  <th>Created</th>
                  <th>Actions</th>
                  <th>Gemini</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">
                      Loading...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.status === "Verified"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td>{user.display || user.name}</td>
                      <td>{new Date(user.created).toLocaleDateString()}</td>
                      <td>
                        {user.actions?.includes("delete") && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => {
                              setSelectedEmail(user.email);
                              setShowConfirm(true);
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                      <td>
                        {toggleLoading === user.email ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <Form.Check
                            type="switch"
                            id={`gemini-switch-${user.email}`}
                            checked={user.gemini_status}
                            disabled={toggleLoading !== null}
                            onChange={(e) =>
                              handleToggleGemini(user.email, e.target.checked)
                            }
                            className={
                              user.gemini_status
                                ? "text-success"
                                : "text-secondary"
                            }
                          />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
      {/* Delete Confirmation Modal */}
      <div
        className={`modal fade ${showConfirm ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowConfirm(false)}
              ></button>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to delete user:{" "}
                <strong>{selectedEmail}</strong>?
              </p>
            </div>

            <div className="modal-footer">
              <Button
                variant="secondary"
                onClick={() => setShowConfirm(false)}
                disabled={deleteLoading !== null}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={() => handleDelete(selectedEmail)}
                disabled={deleteLoading !== null}
              >
                {deleteLoading === selectedEmail ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
