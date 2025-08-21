import React, { useEffect, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getUserlistApi, inviteUserApi } from "../../../Networking/Admin/APIs/UserManagement";
import { DeleteUser } from "../../../Networking/Admin/APIs/LoginAPIs";
import { toast } from "react-toastify";

export const UserManagement = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);


const handleDelete = (email) => {
//   if (!email) return toast.error("Email is required");
//   dispatch(DeleteUser(email));
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

    const handleInviteUser = async () => {
        if (!email) {
            alert("Please enter an email address");
            return;
        }
        try {
            await dispatch(inviteUserApi({ email })).unwrap();
            setEmail("");
            fetchUsers(); 
        } catch (err) {
            console.error("Invite failed:", err);
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
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="email"
                            placeholder="Enter user email address..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button variant="primary w-25" onClick={handleInviteUser}>
                            Invite User
                        </Button>
                    </div>
                    <small className="text-muted">
                        User will receive secure login credentials via email and be prompted
                        to create their own password.
                    </small>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Active Users</h5>
                        <span className="badge bg-dark">{users.length} Total Users</span>
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
                            ) : users.length > 0 ? (
                                users.map((user, index) => (
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
                                            {/* {user.actions?.includes("edit") && (
                                                <Button size="sm" variant="outline-primary" className="me-2">
                                                    Edit
                                                </Button>
                                            )} */}
                                            {user.actions?.includes("delete") && (
                                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(user.email)}>
                                                    Delete
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted">
                                        No users found
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
