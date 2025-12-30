import React, { useEffect, useState } from "react";
import { Card, Button, Form, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { DeleteUser } from "../../../Networking/Admin/APIs/LoginAPIs";
import { toast } from "react-toastify";
import {
  getAdminlistApi,
  inviteAdminApi,
} from "../../../Networking/SuperAdmin/AdminSuperApi";

export const AdminManagement = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [admin, setadmin] = useState([]);
  const [company_name, setcompany_name] = useState("");
  const [admin_name, setadmin_name] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [deletingUser, setDeletingUser] = useState({});

  useEffect(() => {
    fetchadmin();
  }, []);

  const handleDelete = async (email) => {
    try {
      setDeletingUser((prev) => ({ ...prev, [email]: true }));

      await dispatch(DeleteUser( email )).unwrap();
      fetchadmin()
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeletingUser((prev) => ({ ...prev, [email]: false }));
    }
  };

  const fetchadmin = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getAdminlistApi()).unwrap();
      setadmin(res || []);
    } catch (err) {
      console.error("Failed to fetch admin:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteAdmin = async () => {
    const newErrors = {};

    if (!admin_name) newErrors.admin_name = "Admin Name is required";
    if (!company_name) newErrors.company_name = "Company Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setInviteLoading(true);
    try {
      await dispatch(
        inviteAdminApi({ email, company_name, admin_name })
      ).unwrap();
      setEmail("");
      setcompany_name("");
      setadmin_name("");
      fetchadmin();
    } catch (err) {
      console.error("Invite failed:", err);
      toast.error("Failed to send invite");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="container-fluid p-3">
      <h4 className="fw-bold">Admin Management</h4>
      <p className="text-muted">
        Control Admin access to Portfolio Pulse documents and features
      </p>

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <p className="mb-0">
            <strong>🔒 Security Model:</strong> Only Super Administrators can
            create Super Administrators accounts. Admins receive secure
            credentials via email.
          </p>
        </Card.Body>
      </Card>

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">
            <i className="bi bi-person-plus me-2"></i> Add New Admin
          </h5>

          <Form>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Control
                  type="text"
                  placeholder="Enter Admin Name..."
                  value={admin_name}
                  onChange={(e) => setadmin_name(e.target.value)}
                  disabled={inviteLoading}
                  isInvalid={!!errors.admin_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.admin_name}
                </Form.Control.Feedback>
              </div>

              <div className="col-md-6">
                <Form.Control
                  type="text"
                  placeholder="Enter Company Name..."
                  value={company_name}
                  onChange={(e) => setcompany_name(e.target.value)}
                  disabled={inviteLoading}
                  isInvalid={!!errors.company_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.company_name}
                </Form.Control.Feedback>
              </div>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-md-9">
                <Form.Control
                  type="email"
                  placeholder="Enter Admin Email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={inviteLoading}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </div>

              <div className="col-md-3 d-grid">
                <Button
                  variant="primary"
                  onClick={handleInviteAdmin}
                  disabled={inviteLoading}
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
                    "Invite Admin"
                  )}
                </Button>
              </div>
            </div>
          </Form>

          <small className="text-muted d-block mt-2">
            Admin will receive secure login credentials via email.
          </small>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <h5 className="mb-0">Active Admins</h5>
            <span className="badge bg-dark mt-2 mt-sm-0">
              {admin.length} Total Admin
            </span>
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
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      Loading...
                    </td>
                  </tr>
                ) : admin.length > 0 ? (
                  admin.map((user, index) => (
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
                            onClick={() => handleDelete(user.email)}
                            disabled={deletingUser[user.email]}
                          >
                            {deletingUser[user.email]
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No admin found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
