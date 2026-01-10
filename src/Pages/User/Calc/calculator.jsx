import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { calcSubmitApi } from "../../../Networking/User/APIs/Calculator/calcApi";

export const LeaseFinanceCalculator = () => {
  const dispatch = useDispatch();

  const [grossArea, setGrossArea] = useState("");
  const [termYears, setTermYears] = useState("");
  const [freeRentMonths, setFreeRentMonths] = useState("");
  const [baseRentYear1, setBaseRentYear1] = useState("");
  const [annualEscalation, setAnnualEscalation] = useState("");
  const [tiAllowance, setTiAllowance] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [commissionList, setCommissionList] = useState([]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});


  const [input, setInput] = useState("");
  const handleClick = (value) => setInput(input + value);
  const clearInput = () => setInput("");
  const calculate = () => {
    try {
      const res = Function(`"use strict"; return (${input})`)();
      setInput(String(res));
    } catch {
      setInput("Error");
    }
  };


  const validate = () => {
    const err = {};

    if (!grossArea || Number(grossArea) <= 0)
      err.grossArea = "Gross Area must be greater than 0";

    if (!termYears || Number(termYears) < 1 || Number(termYears) > 50)
      err.termYears = "Term must be between 1–50 years";

    if (!baseRentYear1 || Number(baseRentYear1) <= 0)
      err.baseRentYear1 = "Base Rent must be greater than 0";

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
      err.freeRentMonths = "Free Rent must be between 0–36 months";

    if (!tiAllowance || Number(tiAllowance) < 0)
      err.tiAllowance = "TI Allowance must be 0 or greater";

    if (!discountRate || Number(discountRate) < 0 || Number(discountRate) > 100)
      err.discountRate = "Discount Rate must be 0–100%";

    if (commissionList.length !== Number(termYears))
      err.commissionList = "Generate commission rows first";

    const invalidRate = commissionList.some(
      (c) => c.rate === "" || c.rate < 0 || c.rate > 100
    );
    if (invalidRate) err.commissionRates = "All commission rates must be 0–100%";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const generateCommissionYears = () => {
    const years = Number(termYears);
    if (!years) return;

    const arr = Array.from({ length: years }, (_, i) => ({
      year: i + 1,
      rate: "",
    }));
    setCommissionList(arr);
  };

  const updateCommissionRate = (index, value) => {
    const copy = [...commissionList];
    copy[index].rate = value;
    setCommissionList(copy);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const payload = {
      Gross_Area_SF: Number(grossArea),
      Total_Term_Years: Number(termYears),
      Face_Rent_PSF: Number(baseRentYear1),
      Annual_Escalation_Rate: Number(annualEscalation),
      Free_Rent_Months: Number(freeRentMonths),
      TI_Allowance_PSF: Number(tiAllowance),
      Discount_Rate: Number(discountRate),
      Commission_Rate_per_Year: commissionList.map((c) => ({
        year: Number(c.year),
        rate_pct: Number(c.rate),
      })),
    };

    try {
      const response = await dispatch(calcSubmitApi(payload));
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
        <div className="col-12 col-lg-8">
          <div className="card p-3 shadow-sm">
            <h4 className="fw-bold">Deal Parameters</h4>
            <hr />
            <div className="row">
              {[
                ["Gross Area (SF)", grossArea, setGrossArea, errors.grossArea],
                ["Total Term (Years)", termYears, setTermYears, errors.termYears],
                ["Base Rent PSF – Year 1", baseRentYear1, setBaseRentYear1, errors.baseRentYear1],
                ["Annual Escalation (%)", annualEscalation, setAnnualEscalation, errors.annualEscalation],
                ["Free Rent (Months)", freeRentMonths, setFreeRentMonths, errors.freeRentMonths],
                ["TI Allowance (PSF)", tiAllowance, setTiAllowance, errors.tiAllowance],
                ["Discount Rate (%)", discountRate, setDiscountRate, errors.discountRate],
              ].map(([label, val, setter, err], idx) => (
                <div className="col-md-6 mb-3" key={idx}>
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

            <h5 className="fw-bold mt-3">Commission Rates</h5>
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
            {commissionList.map((c, i) => (
              <div className="mb-2" key={i}>
                <label>Year {c.year} Rate (%)</label>
                <input
                  type="number"
                  className={`form-control ${
                    errors.commissionRates ? "is-invalid" : ""
                  }`}
                  value={c.rate}
                  onChange={(e) => updateCommissionRate(i, e.target.value)}
                />
              </div>
            ))}
            {errors.commissionRates && (
              <div className="text-danger mb-2">{errors.commissionRates}</div>
            )}

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <span className="spinner-border spinner-border-sm"></span> : "Calculate"}
            </button>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card shadow-sm p-2">
            <h5 className="fw-bold mb-3">Calculated Results</h5>
            {!result && <p className="text-muted">Submit to see result.</p>}
            {result && (
              <>
                <div className="p-2 bg-light rounded mb-2">
                  <strong>Net Effective Rent (PSF Annual):</strong>
                  <h4>${result.NER_PSF_Annual}</h4>
                </div>
                <div className="p-2 bg-light rounded mb-2">
                  <strong>Total Cash Outflow (Concessions):</strong>
                  <h4>${result.Total_Cash_Outflow_Concessions}</h4>
                </div>
                <div className="p-2 bg-light rounded mb-2">
                  <strong>NPV Rent:</strong>
                  <h4>${result.NPV_Rent}</h4>
                </div>
              </>
            )}
          </div>
           <div className="card p-1 mt-3 mb-3">
              <h5 className="fw-bold mb-3 text-center">Calculator</h5>

              <input
                value={input}
                readOnly
                className="form-control mb-3 text-end fs-4"
                style={{ background: "#f7f7f7", height: "55px" }}
              />

              <div
                className="d-grid"
                style={{
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "10px",
                }}
              >
                {[
                  "7",
                  "8",
                  "9",
                  "/",
                  "4",
                  "5",
                  "6",
                  "*",
                  "1",
                  "2",
                  "3",
                  "-",
                  "0",
                  ".",
                  "=",
                  "+",
                ].map((btn) => (
                  <button
                    key={btn}
                    onClick={() =>
                      btn === "=" ? calculate() : handleClick(btn)
                    }
                    className="btn fw-bold"
                    style={{
                      padding: "14px",
                      fontSize: "20px",
                      background: btn === "=" ? "#0d6efd" : "#e9ecef",
                      color: btn === "=" ? "white" : "black",
                      borderRadius: "10px",
                    }}
                  >
                    {btn}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-secondary w-100 mt-3"
                onClick={clearInput}
              >
                Clear
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};
