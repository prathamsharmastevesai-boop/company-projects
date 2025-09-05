import React, { useEffect, useState } from "react";
import { Card, Button, Form, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getUserlistApi, inviteUserApi } from "../../../Networking/Admin/APIs/UserManagement";
import { DeleteUser } from "../../../Networking/Admin/APIs/LoginAPIs";
import { toast } from "react-toastify";
import { getAdminlistApi, inviteAdminApi } from "../../../Networking/SuperAdmin/AdminSuperApi";

export const AdminManagement = () => {

    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [admin, setadmin] = useState([]);
    const [company_name, setcompany_name] = useState();
    const [admin_name,setadmin_name] = useState();
    const [loading, setLoading] = useState(false);
    const [inviteLoading, setInviteLoading] = useState(false);

    useEffect(() => {
        fetchadmin();
    }, []);

const handleDelete = async (email) => {
  if (!email) {
    return toast.error("Email is required");
  }

  try {
    await dispatch(DeleteUser(email));
    fetchadmin();
  } catch (error) {
    console.error(error);
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
        if (!email) {
            alert("Please enter an email address");
            return;
        }
        setInviteLoading(true);
        try {
            await dispatch(inviteAdminApi({ email , company_name ,admin_name})).unwrap();
            setEmail("");
            fetchadmin();
        } catch (err) {
            console.error("Invite failed:", err);
        } finally {
            setInviteLoading(false);
        }
    };

    return (
        <div className="container p-4">
            <h4 className="fw-bold">Admin Management</h4>
            <p className="text-muted">
                Control Admin access to Portfolio Pulse documents and features
            </p>

            <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                    <p className="mb-0">
                        <strong>🔒 Security Model:</strong> Only Super Administrators can create
                        Super Administrators accounts. Admin receive secure credentials via email.
                    </p>
                </Card.Body>
            </Card>

           <Card className="mb-4 border-0 shadow-sm">
  <Card.Body>
    <h5 className="mb-3">
      <i className="bi bi-person-plus me-2"></i> Add New Admin
    </h5>

    <div className="d-flex flex-column gap-3">

   <div className="d-flex justify-content-between me-3 ">
      <div className="col-md-6 mx-1">
         <Form.Control
        type="text"
        placeholder="Enter Admin Name..."
        value={admin_name || ""}
        onChange={(e) => setadmin_name(e.target.value)}
        disabled={inviteLoading}
      />
      </div>

     <div className="col-md-6 mx-1">
         <Form.Control
        type="text"
        placeholder="Enter Company Name..."
        value={company_name || ""}
        onChange={(e) => setcompany_name(e.target.value)}
        disabled={inviteLoading}
      />
     </div>
   </div>

      {/* Email */}
      <div className="d-flex gap-2">
        <Form.Control
          type="email"
          placeholder="Enter Admin Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={inviteLoading}
        />
        <Button
          variant="primary w-25"
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

    <small className="text-muted">
      Admin will receive secure login credentials via email.
    </small>
  </Card.Body>
</Card>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Active Admins</h5>
                        <span className="badge bg-dark">{admin.length} Total Admin</span>
                    </div>

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
                                            <span className={`badge ${user.status === "Verified" ? "bg-success" : "bg-secondary"}`}>
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
                                                >
                                                    Delete
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
                </Card.Body>
            </Card>
        </div>
    );
};
