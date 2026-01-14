import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetSubleaseTrackerList,
  GetSubleaseById,
  DeleteSubleaseById,
  UpdateSubleaseById,
} from "../../../Networking/Admin/APIs/subleaseTrackerApi";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import RAGLoader from "../../../Component/Loader";

export const SubleaseTrackerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, list } = useSelector((state) => state.subleaseSlice);

  const role = sessionStorage.getItem("role");
  const Role = role;
  console.log(Role, "Role");

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [detail, setDetail] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    id: null,
    name: "",
    loading: false,
  });

  const [detailLoading, setDetailLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const confirmDelete = (id, name) => {
    setDeleteModal({
      show: true,
      id,
      name,
      loading: false,
    });
  };

  useEffect(() => {
    dispatch(GetSubleaseTrackerList());
  }, [dispatch]);

  const openDetailModal = async (id, edit = false) => {
    setShowModal(true);
    setIsEdit(edit);
    setDetailLoading(true);

    try {
      const data = await dispatch(GetSubleaseById(id)).unwrap();

      const initializedData = {
        ...data?.data,
        q1: data?.data?.q1 || {
          check_in: false,
          headcount_confirmation: false,
          building_update_note_sent: false,
          holiday_gift: true,
        },
        q2: data?.data?.q2 || {
          check_in: false,
          headcount_confirmation: false,
          building_update_note_sent: false,
          holiday_gift: true,
        },
        q3: data?.data?.q3 || {
          check_in: false,
          headcount_confirmation: false,
          building_update_note_sent: false,
          holiday_gift: true,
        },
        q4: data?.data?.q4 || {
          check_in: false,
          headcount_confirmation: false,
          building_update_note_sent: false,
          holiday_gift: true,
        },
        notes: data?.data?.notes || "",
      };

      setDetail({ ...data, data: initializedData });

      console.log(
        { ...data, data: initializedData },
        "detail after initialization"
      );
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleNavigate = () => {
    {
      Role === "admin"
        ? navigate("/sublease-tracker-form")
        : navigate("/user-sublease-tracker");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    setDeleteModal((prev) => ({ ...prev, loading: true }));

    try {
      await dispatch(DeleteSubleaseById(deleteModal.id)).unwrap();
      dispatch(GetSubleaseTrackerList());
      toast.success("Sublease deleted successfully!");
      setDeleteModal({ show: false, id: null, name: "", loading: false });
    } catch (error) {
      console.error("Error deleting sublease:", error);
      toast.error("Failed to delete sublease. Please try again.");
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setDetail((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [parent]: {
            ...prev.data[parent],
            [child]: type === "checkbox" ? checked : value,
          },
        },
      }));
    } else {
      setDetail((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [name]: type === "checkbox" ? checked : value,
        },
      }));
    }
  };

  const handleSave = async () => {
    if (!detail?.id) return;

    setIsSaving(true);
    try {
      await dispatch(
        UpdateSubleaseById({
          tracker_id: detail.id,
          data: {
            sub_tenant_name: detail.data.sub_tenant_name,
            building_address: detail.data.building_address,
            floor_suite: detail.data.floor_suite,
            sublease_commencement_date: detail.data.sublease_commencement_date,
            sublease_expiration_date: detail.data.sublease_expiration_date,
            subtenant_headcount: detail.data.subtenant_headcount,
            direct_tenant_notice_of_renewal_date:
              detail.data.direct_tenant_notice_of_renewal_date,
            subtenant_current_rent: detail.data.subtenant_current_rent,
            direct_tenant_current_rent: detail.data.direct_tenant_current_rent,
            subtenant_contact_info: detail.data.subtenant_contact_info,
            direct_tenant_contact_info: detail.data.direct_tenant_contact_info,
            notes: detail.data.notes || "",
            q1: detail.data.q1,
            q2: detail.data.q2,
            q3: detail.data.q3,
            q4: detail.data.q4,
          },
        })
      ).unwrap();

      dispatch(GetSubleaseTrackerList());
      setShowModal(false);
      setIsEdit(false);
      toast.success("Sublease updated successfully!");
    } catch (error) {
      console.error("Error updating sublease:", error);
      alert("Failed to update sublease. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const renderQuarterSection = (quarter, quarterName) => (
    <div className="border p-3 mb-3 rounded">
      <h6 className="fw-bold mb-3">{quarterName.toUpperCase()}</h6>
      <div className="row">
        <div className="col-md-6">
          <div className="form-check mb-2">
            {isEdit ? (
              <input
                type="checkbox"
                className="form-check-input"
                name={`${quarter}.check_in`}
                checked={detail?.data?.[quarter]?.check_in ?? false}
                onChange={handleChange}
                id={`${quarter}-checkin`}
              />
            ) : (
              <input
                type="checkbox"
                className="form-check-input"
                checked={detail?.data?.[quarter]?.check_in ?? false}
                disabled
              />
            )}
            <label className="form-check-label" htmlFor={`${quarter}-checkin`}>
              Check In
            </label>
          </div>

          <div className="form-check mb-2">
            {isEdit ? (
              <input
                type="checkbox"
                className="form-check-input"
                name={`${quarter}.headcount_confirmation`}
                checked={
                  detail?.data?.[quarter]?.headcount_confirmation ?? false
                }
                onChange={handleChange}
                id={`${quarter}-headcount`}
              />
            ) : (
              <input
                type="checkbox"
                className="form-check-input"
                checked={
                  detail?.data?.[quarter]?.headcount_confirmation ?? false
                }
                disabled
              />
            )}
            <label
              className="form-check-label"
              htmlFor={`${quarter}-headcount`}
            >
              Headcount Confirmation
            </label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-check mb-2">
            {isEdit ? (
              <input
                type="checkbox"
                className="form-check-input"
                name={`${quarter}.building_update_note_sent`}
                checked={
                  detail?.data?.[quarter]?.building_update_note_sent ?? false
                }
                onChange={handleChange}
                id={`${quarter}-note-sent`}
              />
            ) : (
              <input
                type="checkbox"
                className="form-check-input"
                checked={
                  detail?.data?.[quarter]?.building_update_note_sent ?? false
                }
                disabled
              />
            )}
            <label
              className="form-check-label"
              htmlFor={`${quarter}-note-sent`}
            >
              Building Update Note Sent
            </label>
          </div>

          <div className="form-check mb-2">
            {isEdit ? (
              <input
                type="checkbox"
                className="form-check-input"
                name={`${quarter}.holiday_gift`}
                checked={detail?.data?.[quarter]?.holiday_gift ?? false}
                onChange={handleChange}
                id={`${quarter}-holiday-gift`}
              />
            ) : (
              <input
                type="checkbox"
                className="form-check-input"
                checked={detail?.data?.[quarter]?.holiday_gift ?? false}
                disabled
              />
            )}
            <label
              className="form-check-label"
              htmlFor={`${quarter}-holiday-gift`}
            >
              Holiday Gift
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="header-bg d-flex justify-content-between flex-wrap px-3 align-items-center sticky-header">
        <h5 className="mb-0 text-light mx-4">Sublease Tracker List</h5>
        <button
          className="btn btn-secondary d-flex align-items-center gap-2"
          onClick={handleNavigate}
          style={{ fontWeight: "600", padding: "0.5rem 1rem" }}
        >
          <BsPlusLg /> Add Sublease
        </button>
      </div>

      <div className="container-fuild p-4">
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <RAGLoader />
          </div>
        )}

        {!loading && list?.length === 0 && (
          <div className="text-center my-5">
            <p className="text-muted fs-5">No entries found.</p>
          </div>
        )}

        {!loading && list?.length > 0 && (
          <div className="table-responsive shadow-sm bg-white rounded">
            <table className="table align-middle">
              <thead>
                <tr className="table-light text-uppercase small fw-bold">
                  <th>Sub-Tenant Name</th>
                  <th>Floor / Suite</th>
                  <th>Commencement Date</th>
                  <th>Expiration Date</th>
                  <th>Headcount</th>
                  <th>Building Address</th>
                  <th>Last Edited By</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {list.map((item) => (
                  <tr key={item.id} className="border-bottom">
                    <td>{item?.data?.sub_tenant_name || "N/A"}</td>
                    <td>{item?.data?.floor_suite || "N/A"}</td>
                    <td>
                      {item?.data?.sublease_commencement_date?.slice(0, 10) ||
                        "N/A"}
                    </td>
                    <td>
                      {item?.data?.sublease_expiration_date?.slice(0, 10) ||
                        "N/A"}
                    </td>
                    <td>{item?.data?.subtenant_headcount}</td>
                    <td
                      style={{
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item?.data?.building_address || "N/A"}
                    </td>
                    <td>
                      <div
                        className="text-truncate"
                        style={{ maxWidth: "100px" }}
                      >
                        {item?.updated_by_email}
                      </div>
                    </td>

                    <td className="text-center table-icons">
                      <button
                        className="btn btn-outline-primary btn-sm rounded-circle me-2"
                        onClick={() => openDetailModal(item.id, false)}
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-outline-warning btn-sm rounded-circle me-2"
                        onClick={() => openDetailModal(item.id, true)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm rounded-circle"
                        onClick={() =>
                          confirmDelete(item.id, item?.data?.sub_tenant_name)
                        }
                        title="Delete"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {deleteModal.show && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    className="btn-close"
                    onClick={() =>
                      setDeleteModal({
                        show: false,
                        id: null,
                        name: "",
                        loading: false,
                      })
                    }
                    disabled={deleteModal.loading}
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete{" "}
                  <strong>{deleteModal.name || "this sublease"}</strong>?
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      setDeleteModal({
                        show: false,
                        id: null,
                        name: "",
                        loading: false,
                      })
                    }
                    disabled={deleteModal.loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={deleteModal.loading}
                  >
                    {deleteModal.loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {isEdit ? "Edit Sublease" : "Sublease Details"}
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      setIsEdit(false);
                    }}
                    disabled={isSaving || detailLoading}
                  ></button>
                </div>

                <div className="modal-body">
                  {detailLoading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "200px",
                      }}
                    >
                      <RAGLoader />
                    </div>
                  ) : (
                    <div className="row g-3">
                      <div className="col-12">
                        <h5 className="fw-bold border-bottom pb-2 mb-3">
                          Basic Information
                        </h5>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          Sub-Tenant Name:
                        </label>
                        {isEdit ? (
                          <input
                            type="text"
                            className="form-control"
                            name="sub_tenant_name"
                            value={detail?.data?.sub_tenant_name || ""}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="mb-0">
                            {detail?.data?.sub_tenant_name}
                          </p>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          Floor / Suite:
                        </label>
                        {isEdit ? (
                          <input
                            type="text"
                            className="form-control"
                            name="floor_suite"
                            value={detail?.data?.floor_suite || ""}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="mb-0">{detail?.data?.floor_suite}</p>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          Building Address:
                        </label>
                        {isEdit ? (
                          <input
                            type="text"
                            className="form-control"
                            name="building_address"
                            value={detail?.data?.building_address || ""}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="mb-0">
                            {detail?.data?.building_address}
                          </p>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">Headcount:</label>
                        {isEdit ? (
                          <input
                            type="number"
                            className="form-control"
                            name="subtenant_headcount"
                            value={detail?.data?.subtenant_headcount || 0}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="mb-0">
                            {detail?.data?.subtenant_headcount}
                          </p>
                        )}
                      </div>

                      <div className="col-12 mt-4">
                        <h5 className="fw-bold border-bottom pb-2 mb-3">
                          Dates
                        </h5>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-bold">
                          Commencement Date:
                        </label>
                        {isEdit ? (
                          <input
                            type="date"
                            className="form-control"
                            name="sublease_commencement_date"
                            value={formatDateForInput(
                              detail?.data?.sublease_commencement_date
                            )}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="mb-0">
                            {detail?.data?.sublease_commencement_date?.slice(
                              0,
                              10
                            )}
                          </p>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-bold">
                          Expiration Date:
                        </label>
                        {isEdit ? (
                          <input
                            type="date"
                            className="form-control"
                            name="sublease_expiration_date"
                            value={formatDateForInput(
                              detail?.data?.sublease_expiration_date
                            )}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="mb-0">
                            {detail?.data?.sublease_expiration_date?.slice(
                              0,
                              10
                            )}
                          </p>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-bold">
                          Direct Tenant Notice Date:
                        </label>
                        {isEdit ? (
                          <input
                            type="date"
                            className="form-control"
                            name="direct_tenant_notice_of_renewal_date"
                            value={formatDateForInput(
                              detail?.data?.direct_tenant_notice_of_renewal_date
                            )}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="mb-0">
                            {detail?.data?.direct_tenant_notice_of_renewal_date?.slice(
                              0,
                              10
                            )}
                          </p>
                        )}
                      </div>

                      <div className="col-12 mt-4">
                        <h5 className="fw-bold border-bottom pb-2 mb-3">
                          Rent Information
                        </h5>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          Subtenant Current Rent:
                        </label>
                        {isEdit ? (
                          <input
                            type="text"
                            className="form-control"
                            name="subtenant_current_rent"
                            value={detail?.data?.subtenant_current_rent || ""}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="mb-0">
                            {detail?.data?.subtenant_current_rent}
                          </p>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          Direct Tenant Current Rent:
                        </label>
                        {isEdit ? (
                          <input
                            type="text"
                            className="form-control"
                            name="direct_tenant_current_rent"
                            value={
                              detail?.data?.direct_tenant_current_rent || ""
                            }
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="mb-0">
                            {detail?.data?.direct_tenant_current_rent}
                          </p>
                        )}
                      </div>

                      <div className="col-12 mt-4">
                        <h5 className="fw-bold border-bottom pb-2 mb-3">
                          Contact Information
                        </h5>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          Subtenant Contact Info:
                        </label>
                        {isEdit ? (
                          <input
                            type="text"
                            className="form-control"
                            name="subtenant_contact_info"
                            value={detail?.data?.subtenant_contact_info || ""}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="mb-0">
                            {detail?.data?.subtenant_contact_info}
                          </p>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          Direct Tenant Contact Info:
                        </label>
                        {isEdit ? (
                          <input
                            type="text"
                            className="form-control"
                            name="direct_tenant_contact_info"
                            value={
                              detail?.data?.direct_tenant_contact_info || ""
                            }
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="mb-0">
                            {detail?.data?.direct_tenant_contact_info}
                          </p>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold">Notes:</label>
                        {isEdit ? (
                          <textarea
                            className="form-control"
                            name="notes"
                            rows="4"
                            value={detail?.data?.notes || ""}
                            onChange={handleChange}
                            placeholder="Enter any additional notes here..."
                          />
                        ) : (
                          <div className="p-3 bg-light rounded">
                            {detail?.data?.notes || (
                              <span className="text-muted">
                                No notes available
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="col-12 mt-4">
                        <h5 className="fw-bold border-bottom pb-2 mb-3">
                          Quarterly Checks
                        </h5>
                      </div>
                      {renderQuarterSection("q1", "Quarter 1")}
                      {renderQuarterSection("q2", "Quarter 2")}
                      {renderQuarterSection("q3", "Quarter 3")}
                      {renderQuarterSection("q4", "Quarter 4")}
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setIsEdit(false);
                    }}
                    disabled={isSaving || detailLoading}
                  >
                    {isEdit ? "Cancel" : "Close"}
                  </button>
                  {isEdit && !detailLoading && (
                    <button
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import {
//   DeleteBuilding,
//   ListBuildingSubmit,
//   CreateBuildingSubmit,
//   UpdateBuildingSubmit,
// } from "../../../Networking/Admin/APIs/BuildingApi";
// import { useDispatch, useSelector } from "react-redux";
// import RAGLoader from "../../../Component/Loader";

// export const SubleaseTrackerList = () => {
//   const { BuildingList } = useSelector((state) => state.BuildingSlice);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const cardsRef = useRef([]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [address, setAddress] = useState("");
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const [editBuildingId, setEditBuildingId] = useState(null);
//   const [editFieldValue, setEditFieldValue] = useState("");

//   useEffect(() => {
//     const fetchBuildings = async () => {
//       setLoading(true);
//       const category = "SubleaseTracker";
//       await dispatch(ListBuildingSubmit(category));
//       setLoading(false);
//     };
//     fetchBuildings();
//   }, [dispatch]);

//   useEffect(() => {
//     if (!loading) {
//       cardsRef.current.forEach((card, i) => {
//         if (card) {
//           card.classList.remove("visible");
//           setTimeout(() => {
//             card.classList.add("visible");
//           }, i * 150);
//         }
//       });
//     }
//   }, [BuildingList, searchTerm, loading]);

//   const startEdit = (building) => {
//     setEditBuildingId(building.id);
//     setEditFieldValue(building.address || "");
//   };

//   const saveEdit = async (buildingId) => {
//     if (!editFieldValue.trim()) return;
//     setLoading(true);

//     try {
//       const payload = {
//         building_id: buildingId,
//         address: editFieldValue,
//       };

//       await dispatch(UpdateBuildingSubmit(payload)).unwrap();

//       await dispatch(ListBuildingSubmit("SubleaseTracker"));

//       setEditBuildingId(null);
//     } catch (error) {
//       console.error("Error updating building:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (buildingId) => {
//     try {
//       setDeleteLoading(true);
//       await dispatch(DeleteBuilding(buildingId));
//       await dispatch(ListBuildingSubmit("SubleaseTracker"));
//     } catch (error) {
//       console.error("Delete failed:", error);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleAddSubmit = async (e) => {
//     e.preventDefault();
//     if (!address.trim()) return;

//     setLoading(true);
//     try {
//       const payload = [
//         {
//           category: "SubleaseTracker",
//           address: address,
//         },
//       ];

//       await dispatch(CreateBuildingSubmit(payload)).unwrap();

//       await dispatch(ListBuildingSubmit("SubleaseTracker"));

//       setAddress("");
//     } catch (error) {
//       console.error("Error submitting building:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (buildingId) => {
//     navigate("/subleaseTracker", { state: { office: { buildingId } } });
//   };

//   const filteredBuildings = BuildingList.filter((building) => {
//     const name = building.building_name?.toLowerCase() || "";
//     const addr = building.address?.toLowerCase() || "";
//     const term = searchTerm.toLowerCase();
//     return name.includes(term) || addr.includes(term);
//   });

//   const BuildingCard = ({ building, index }) => (
//     <div
//       ref={(el) => (cardsRef.current[index] = el)}
//       className="card border-0 shadow-sm hover-shadow w-100"
//       style={{
//         backgroundColor: "#fff",
//         borderWidth: "0.1px",
//         borderColor: "#cacacaff",
//         borderRadius: "16px",
//       }}
//     >
//       <div className="position-absolute top-0 end-0 p-2">
//         {editBuildingId === building.id ? (
//           <>
//             <i
//               className="bi bi-check-circle-fill text-success me-3"
//               style={{ cursor: "pointer", fontSize: "1.2rem" }}
//               onClick={() => saveEdit(building.id)}
//               title="Save"
//             ></i>
//             <i
//               className="bi bi-x-circle-fill text-secondary"
//               style={{ cursor: "pointer", fontSize: "1.2rem" }}
//               onClick={() => setEditBuildingId(null)}
//               title="Cancel"
//             ></i>
//           </>
//         ) : (
//           <>
//             <i
//               className="bi bi-pencil-square text-primary me-3"
//               style={{ cursor: "pointer", fontSize: "1.2rem" }}
//               onClick={() => startEdit(building)}
//               title="Edit"
//             ></i>
//             <i
//               className="bi bi-trash text-danger"
//               style={{ cursor: "pointer", fontSize: "1.2rem" }}
//               onClick={() => handleDelete(building.id)}
//               title="Delete"
//             ></i>
//           </>
//         )}
//       </div>

//       <div className="card-body d-flex flex-column justify-content-center">
//         {editBuildingId === building.id ? (
//           <input
//             type="text"
//             className="form-control"
//             value={editFieldValue}
//             onChange={(e) => setEditFieldValue(e.target.value)}
//             autoFocus
//           />
//         ) : (
//           <p
//             className="mb-2 text-secondary"
//             onClick={() => handleSubmit(building.id)}
//             style={{ cursor: "pointer" }}
//           >
//             <div className="col-md-12 py-2">
//               <div className="d-flex mx-1">
//                 <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
//                 <div className="mx-2 check">{building.address || "N/A"}</div>
//                 {/* <strong>Curated Intelligence:</strong> */}
//               </div>
//             </div>
//           </p>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="container-fuild p-3" style={{ position: "relative" }}>
//       {deleteLoading && (
//         <div className="upload-overlay">
//           <div className="text-center">
//             <div className="spinner-border text-primary" role="status"></div>
//             <div className="upload-text mt-2">Deleting building...</div>
//           </div>
//         </div>
//       )}

//       <div
//         className="text-center bg-white rounded shadow-sm py-3 mb-4"
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 10,
//           borderBottom: "1px solid #dee2e6",
//         }}
//       >
//         <h2 className="fw-bold text-dark">🏢 Sublease Tracker Building List</h2>
//         <p className="text-muted mb-3">
//           Here’s a summary of all the submitted buildings.
//         </p>
//         <input
//           type="search"
//           placeholder="Search by building name or address"
//           className="form-control bg-white text-dark mx-auto text-center dark-placeholder"
//           style={{ maxWidth: "420px" }}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           disabled={loading || deleteLoading}
//         />
//       </div>

//       {loading ? (
//         <div
//           className="d-flex justify-content-center align-items-center"
//           style={{ height: "60vh" }}
//         >
//           <RAGLoader />
//         </div>
//       ) : (
//         <div className="d-flex flex-column gap-3">
//           <form onSubmit={handleAddSubmit}>
//             <div className="row g-2 align-items-center justify-content-between">
//               <div className="col-md-9">
//                 <div className="input-group">
//                   <span className="input-group-text">
//                     <i className="bi bi-geo-alt-fill"></i>
//                   </span>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter building address"
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     disabled={loading}
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="col-md-3 col-12">
//                 <button
//                   type="submit"
//                   className="btn btn-success w-100"
//                   disabled={loading}
//                 >
//                   <i className="bi bi-plus-circle me-2"></i> Add Building
//                 </button>
//               </div>
//             </div>
//           </form>

//           {filteredBuildings.length === 0 ? (
//             <p className="text-center text-muted mt-3">
//               No buildings found. Add a new one above
//             </p>
//           ) : (
//             [...filteredBuildings]
//               .reverse()
//               .map((building, index) => (
//                 <BuildingCard
//                   key={building.id || index}
//                   building={building}
//                   index={index}
//                 />
//               ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };
