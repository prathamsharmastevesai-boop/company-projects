import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { inviteAdminApi, getAdminlistApi } from "../redux/adminApis";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminManagement = () => {
  const dispatch = useDispatch();

  // Local state for invite form
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // Redux state
  const { adminList, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminlistApi());
  }, [dispatch]);

  const handleInvite = (e) => {
    e.preventDefault();
    dispatch(inviteAdminApi({ email, role }));
    setEmail("");
    setRole("");
  };

  return (
    <div className="container mt-4">
      {/* Responsive Row */}
      <div className="row">
        {/* Invite Admin Form */}
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
          <div className="card shadow p-3">
            <h5 className="mb-3">Invite Admin</h5>
            <form onSubmit={handleInvite}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select role</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="manager">Manager</option>
                  <option value="editor">Editor</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Invite
              </button>
            </form>
          </div>
        </div>

        {/* Admin List */}
        <div className="col-lg-8 col-md-6 col-sm-12">
          <div className="card shadow p-3">
            <h5 className="mb-3">Admin List</h5>

            {loading && (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            )}

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            {!loading && adminList?.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminList.map((admin, idx) => (
                      <tr key={idx}>
                        <td>{admin.email}</td>
                        <td>{admin.role}</td>
                        <td>{admin.status || "Active"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              !loading && <p>No admins found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
