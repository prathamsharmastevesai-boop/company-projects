import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { commissionSimpleApi } from "../../../Networking/User/APIs/Calculator/calcApi";

export const CommissionCalculator = () => {
  const dispatch = useDispatch();

  const [grossArea, setGrossArea] = useState("");
  const [termYears, setTermYears] = useState("");
  const [freeRentMonths, setFreeRentMonths] = useState("");
  const [faceRentYear1, setFaceRentYear1] = useState("");
  const [annualEscalation, setAnnualEscalation] = useState("");

  const [commissionList, setCommissionList] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};

    if (!grossArea || Number(grossArea) <= 0)
      err.grossArea = "Gross area must be greater than 0";

    if (!termYears || Number(termYears) < 1 || Number(termYears) > 50)
      err.termYears = "Term must be between 1 and 50 years";

    if (!faceRentYear1 || Number(faceRentYear1) <= 0)
      err.faceRentYear1 = "Face rent must be greater than 0";

    if (
      annualEscalation === "" ||
      Number(annualEscalation) < 0 ||
      Number(annualEscalation) > 100
    )
      err.annualEscalation = "Escalation must be between 0–100%";

    if (
      freeRentMonths === "" ||
      Number(freeRentMonths) < 0 ||
      Number(freeRentMonths) > 36
    )
      err.freeRentMonths = "Free rent must be between 0–36 months";

    if (commissionList.length !== Number(termYears))
      err.commissionList = "Generate commission rows first";

    const invalidRate = commissionList.some(
      (c) => c.rate_pct === "" || c.rate_pct < 0 || c.rate_pct > 100
    );
    if (invalidRate)
      err.commissionRates = "All commission rates must be 0–100%";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const generateCommissionYears = () => {
    if (!termYears || termYears < 1) return;

    const rows = Array.from({ length: Number(termYears) }, (_, i) => ({
      year: i + 1,
      rate_pct: "",
    }));
    setCommissionList(rows);
  };

  const updateCommissionRate = (index, value) => {
    const arr = [...commissionList];
    arr[index].rate_pct = value;
    setCommissionList(arr);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const payload = {
      Square_Footage: Number(grossArea),
      Total_Term_Years: Number(termYears),
      Base_Rent_PSF: [Number(faceRentYear1)],
      Annual_Escalation_Rate: Number(annualEscalation),
      Free_Rent_Months: Number(freeRentMonths),
      Commission_Rate_Annual_Pct: commissionList.map((c) => ({
        year: c.year,
        rate_pct: Number(c.rate_pct),
      })),
    };

    try {
      const response = await dispatch(commissionSimpleApi(payload));
      if (response.meta?.requestStatus === "fulfilled") {
        setResult(response.payload);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-3">
      <div className="row g-3">
        <div className="col-md-8">
          <div className="card p-3 shadow-sm">
            <h4 className="fw-bold">Deal Parameters</h4>
            <hr />

            <div className="row">
              {[
                ["Gross Area (SF)", grossArea, setGrossArea, errors.grossArea],
                ["Total Term (Years)", termYears, setTermYears, errors.termYears],
                ["Face Rent PSF – Year 1", faceRentYear1, setFaceRentYear1, errors.faceRentYear1],
                ["Annual Escalation Rate (%)", annualEscalation, setAnnualEscalation, errors.annualEscalation],
                ["Free Rent (Months)", freeRentMonths, setFreeRentMonths, errors.freeRentMonths],
              ].map(([label, val, setter, err], i) => (
                <div className="col-md-6 mb-3" key={i}>
                  <label className="fw-semibold">{label}</label>
                  <input
                    type="number"
                    className={`form-control ${err ? "is-invalid" : ""}`}
                    value={val}
                    onChange={(e) => setter(e.target.value)}
                  />
                  {err && <div className="invalid-feedback">{err}</div>}
                </div>
              ))}
            </div>

            <h5 className="fw-bold mt-3">Commission Rates (Annual)</h5>
            <hr />

            <button
              className="btn btn-outline-primary w-100 mb-3"
              onClick={generateCommissionYears}
            >
              Generate Commission Rows
            </button>

            {errors.commissionList && (
              <div className="text-danger mb-2">{errors.commissionList}</div>
            )}

            {commissionList.map((item, idx) => (
              <div key={idx} className="mb-2">
                <label>Year {item.year} – Rate (%)</label>
                <input
                  type="number"
                  className={`form-control ${
                    errors.commissionRates ? "is-invalid" : ""
                  }`}
                  value={item.rate_pct}
                  onChange={(e) => updateCommissionRate(idx, e.target.value)}
                />
              </div>
            ))}

            {errors.commissionRates && (
              <div className="text-danger">{errors.commissionRates}</div>
            )}

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate"}
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5 className="fw-bold">Calculated Results</h5>
            {!result && <p className="text-muted">Submit to see result.</p>}
            {result && (
              <pre className="bg-light p-3 rounded">
                {JSON.stringify(result.Total_Commission_Due, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
