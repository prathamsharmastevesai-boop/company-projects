import React, { useEffect, useState } from "react";
import {
  getProfileDetail,
  ProfileUpdateApi,
} from "../../../Networking/User/APIs/Profile/ProfileApi";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaCamera, FaSave, FaTimes } from "react-icons/fa";
import RAGLoader from "../../../Component/Loader";
import { toast } from "react-toastify";
import { baseURL } from "../../../Networking/NWconfig";

export const UserProfile = () => {
  const { userdata } = useSelector((state) => state.ProfileSlice);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [bgPhotoUrl, setBgPhotoUrl] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [bgPhotoFile, setBgPhotoFile] = useState(null);
  const [tempPhoto, setTempPhoto] = useState(null);
  const [tempBgPhoto, setTempBgPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        await dispatch(getProfileDetail());
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [dispatch]);

  useEffect(() => {
    if (userdata) {
      setName(userdata.name || "");
      setNumber(userdata.number || "");
      setPhotoUrl(userdata.photo_base64 || "https://placehold.co/100x100");
      setBgPhotoUrl(
        userdata.bg_photo_base64 ||
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
      );
    }
  }, [userdata]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const MAX_FILE_SIZE_MB = 1;
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert("⚠️ Profile photo must be less than 1MB.");
      return;
    }

    setPhotoFile(file);
    setTempPhoto(URL.createObjectURL(file));
  };

  const handleBgPhotoChange = (e) => {
    const file = e.target.files[0];
    const MAX_FILE_SIZE_MB = 2;
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert("⚠️ Background photo must be less than 2MB.");
      return;
    }

    setBgPhotoFile(file);
    setTempBgPhoto(URL.createObjectURL(file));
  };

  const cancelEditing = () => {
    setName(userdata.name || "");
    setNumber(userdata.number || "");
    setPhotoFile(null);
    setBgPhotoFile(null);
    setTempPhoto(null);
    setTempBgPhoto(null);
    setIsEditing(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("number", number);
    if (photoFile) formData.append("photo", photoFile);
    if (bgPhotoFile) formData.append("bg_photo", bgPhotoFile);

    try {
      await dispatch(ProfileUpdateApi(formData));
      dispatch(getProfileDetail());
      setIsEditing(false);
      setPhotoFile(null);
      setBgPhotoFile(null);
      setTempPhoto(null);
      setTempBgPhoto(null);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="hero-section text-center bg-dark py-3 mb-4 animate__animated animate__fadeInDown"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 3,
          height: "20vh",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <h2 className="fw-bold text-light">👤 Profile</h2>
        <p className="text-light mb-0">Here's a summary of your profile.</p>
      </div>

      <div className="container mt-2 px-4">
        {loadingProfile ? (
          <div className="text-center ">
            <RAGLoader />
            <p className="mt-2 text-muted">Loading profile...</p>
          </div>
        ) : (
          <div className="card shadow-sm overflow-hidden">
            <div
            // style={{
            //   backgroundImage: `url(${tempBgPhoto || bgPhotoUrl})`,
            //   backgroundSize: "cover",
            //   backgroundPosition: "center",
            //   height: "180px",
            //   position: "relative",
            // }}
            >
              {/* {isEditing && (
                <label
                  htmlFor="bg-photo-upload"
                  className="btn btn-light rounded-circle"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    height: "40px",
                    width: "40px",
                    cursor: "pointer",
                  }}
                  title="Change background photo"
                >
                  <FaCamera />
                  <input
                    id="bg-photo-upload"
                    type="file"
                    onChange={handleBgPhotoChange}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                </label>
              )} */}

              {/* <div style={{ position: "relative", display: "inline-block" }}> */}
              {/* <img
                  src={tempPhoto || photoUrl}
                  alt="Profile"
                  className="rounded-circle border border-3 border-white shadow"
                  crossOrigin="anonymous"
                  style={{
                    width: "100px",
                    height: "100px",
                    position: "absolute",
                    top: "100px",
                    left: "20px",
                    objectFit: "cover",
                  }}
                /> */}

              {/* {isEditing && (
                <label
                  htmlFor="profile-photo-upload"
                  className="btn btn-light rounded-circle"
                  style={{
                    position: "absolute",
                    height: "40px",
                    width: "40px",
                    top: "160px",
                    left: "90px",
                    cursor: "pointer",
                  }}
                  title="Change profile photo"
                >
                  <FaCamera />
                  <input
                    id="profile-photo-upload"
                    type="file"
                    onChange={handlePhotoChange}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                </label>
              )} */}
              {/* </div> */}
            </div>

            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h4> 👤 Profile Info</h4>
                {!isEditing ? (
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit className="me-1" /> Edit
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={cancelEditing}
                  >
                    <FaTimes className="me-1" />
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div className="mb-2">
                  {!isEditing ? (
                    <>
                      <label className="form-label fw-bold">Full Name</label>
                      <br />
                      <label>{name}</label>
                    </>
                  ) : (
                    <>
                      <label className="form-label">Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                      />
                    </>
                  )}
                </div>

                <div className="mb-3">
                  {!isEditing ? (
                    <>
                      <label className="form-label fw-bold">Phone Number</label>
                      <br />
                      <label>{number}</label>
                    </>
                  ) : (
                    <>
                      <label className="form-label">Phone Number</label>
                      <input
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="form-control"
                      />
                    </>
                  )}
                </div>

                {isEditing && (
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={cancelEditing}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-warning"
                      disabled={loading}
                    >
                      {loading ? (
                        "Saving..."
                      ) : (
                        <>
                          <FaSave className="me-1" /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
