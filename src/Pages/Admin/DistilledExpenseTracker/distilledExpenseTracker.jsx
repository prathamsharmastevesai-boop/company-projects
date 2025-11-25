import React, { useState } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { distilledExpenseTracker } from "../../../Networking/Admin/APIs/distilledExpenseTrackerApi";
import { useDispatch } from "react-redux";

const SUBMARKET_OPTIONS = ["Downtown", "Uptown", "Suburb"];
const SF_BAND_OPTIONS = [
  ">25,000 SF",
  ">50,000 SF",
  ">100,000 SF",
  ">200,000 SF",
  ">400,000 SF",
  ">600,000 SF",
  ">800,000 SF",
  ">1,000,000 SF",
  ">1,200,000 SF",
  "ABOVE 1,200,000 SF",
];
const CLASS_OPTIONS = ["A", "B", "C", "D"];

export const DistilledExpenseTracker = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    building_sf_band: "",
    submarket_geo: "",
    building_class: "",
    building_sf: "",
    realestate_taxes_psf: "",
    property_insurance_psf: "",
    utilities_psf: "",
    janitorial_psf: "",
    prop_mgmt_fees_psf: "",
    security_psf: "",
    admin_charges_psf: "",
    ti_buildout_psf: "",
    capex_major_psf: "",
    commission_advert_psf: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "number" && Number(value) < 0) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      "building_sf_band",
      "submarket_geo",
      "building_class",
      "building_sf",
      "realestate_taxes_psf",
      "property_insurance_psf",
      "utilities_psf",
      "janitorial_psf",
      "prop_mgmt_fees_psf",
      "security_psf",
      "admin_charges_psf",
      "ti_buildout_psf",
      "capex_major_psf",
      "commission_advert_psf",
    ];

    for (const field of requiredFields) {
      const value = formData[field];

      if (value === "") {
        toast.error(`Field "${field}" is required`);
        return false;
      }

      if (field.includes("_psf") || field === "building_sf") {
        const numberValue = Number(value);
        if (isNaN(numberValue)) {
          toast.error(`Field "${field}" must be a number`);
          return false;
        }
        if (numberValue < 0) {
          toast.error(`Field "${field}" cannot be negative`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      ...formData,
      building_sf: String(formData.building_sf),
      realestate_taxes_psf: Number(formData.realestate_taxes_psf),
      property_insurance_psf: Number(formData.property_insurance_psf),
      utilities_psf: Number(formData.utilities_psf),
      janitorial_psf: Number(formData.janitorial_psf),
      prop_mgmt_fees_psf: Number(formData.prop_mgmt_fees_psf),
      security_psf: Number(formData.security_psf),
      admin_charges_psf: Number(formData.admin_charges_psf),
      ti_buildout_psf: Number(formData.ti_buildout_psf),
      capex_major_psf: Number(formData.capex_major_psf),
      commission_advert_psf: Number(formData.commission_advert_psf),
    };

    try {
      console.log(payload, "payload");
      const resultAction = await dispatch(distilledExpenseTracker(payload));
      toast.success("Expense submitted successfully!");
      setFormData({
        building_sf_band: "",
        submarket_geo: "",
        building_class: "",
        building_sf: "",
        realestate_taxes_psf: "",
        property_insurance_psf: "",
        utilities_psf: "",
        janitorial_psf: "",
        prop_mgmt_fees_psf: "",
        security_psf: "",
        admin_charges_psf: "",
        ti_buildout_psf: "",
        capex_major_psf: "",
        commission_advert_psf: "",
      });
    } catch (err) {
      toast.error(err.message || "Error submitting expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-3">
      <h2 className="mb-4 text-center">
        Distilled Expense Tracker (DET) Submission
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">
            Building Metadata
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">SF Band</label>
                <select
                  className="form-select"
                  name="building_sf_band"
                  value={formData.building_sf_band}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select SF Band</option>
                  {SF_BAND_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Submarket</label>
                <select
                  className="form-select"
                  name="submarket_geo"
                  value={formData.submarket_geo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Submarket</option>
                  {SUBMARKET_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Building Class</label>
                <select
                  className="form-select"
                  name="building_class"
                  value={formData.building_class}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Class</option>
                  {CLASS_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Building SF</label>
                <input
                  type="number"
                  className="form-control"
                  name="building_sf"
                  value={formData.building_sf}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-success text-white">
            Expense Data ($/SF)
          </div>
          <div className="card-body">
            <div className="row">
              {[
                { label: "Real Estate Taxes", key: "realestate_taxes_psf" },
                { label: "Property Insurance", key: "property_insurance_psf" },
                { label: "Utilities", key: "utilities_psf" },
                { label: "Janitorial", key: "janitorial_psf" },
                { label: "Property Mgmt Fees", key: "prop_mgmt_fees_psf" },
                { label: "Security", key: "security_psf" },
                { label: "Admin Charges", key: "admin_charges_psf" },
                { label: "TI Buildout", key: "ti_buildout_psf" },
                { label: "CapEx Major", key: "capex_major_psf" },
                { label: "Commission & Advert", key: "commission_advert_psf" },
              ].map((item) => (
                <div className="col-md-6 mb-3" key={item.key}>
                  <label className="form-label">{item.label}</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name={item.key}
                    value={formData[item.key]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-success btn-md"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Submitting...
              </>
            ) : (
              "Submit Expense"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
