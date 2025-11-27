import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { calcSubmitApi } from "../../../Networking/User/APIs/Calculator/calcApi";

export const LeaseFinanceCalculator = () => {
  const dispatch = useDispatch();

  const [grossArea, setGrossArea] = useState("");
  const [termYears, setTermYears] = useState("");
  const [faceRent, setFaceRent] = useState("");
  const [annualEscalation, setAnnualEscalation] = useState("");
  const [freeRentMonths, setFreeRentMonths] = useState("");
  const [tiAllowance, setTiAllowance] = useState("");
  const [commissionPerYear, setCommissionPerYear] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [commissionTotal, setCommissionTotal] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState("");

  const handleClick = (value) => setInput(input + value);
  const clearInput = () => setInput("");
  const calculate = () => {
    try {
      const result = Function(`"use strict"; return (${input})`)();
      setInput(String(result));
    } catch {
      setInput("Error");
    }
  };
  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      gross_area_sf: Number(grossArea),
      total_term_years: Number(termYears),
      face_rent_psf: Number(faceRent),
      annual_escalation_rate: Number(annualEscalation),
      free_rent_months: Number(freeRentMonths),
      ti_allowance_psf: Number(tiAllowance),
      commission_rate_per_year: Number(commissionPerYear),
      discount_rate: Number(discountRate),
      commission_rate_total: Number(commissionTotal),
    };

    const response = await dispatch(calcSubmitApi(payload));

    if (response.meta.requestStatus === "fulfilled") {
      setResult(response.payload);

      setGrossArea("");
      setTermYears("");
      setFaceRent("");
      setAnnualEscalation("");
      setFreeRentMonths("");
      setTiAllowance("");
      setCommissionPerYear("");
      setDiscountRate("");
      setCommissionTotal("");
    }

    setLoading(false);
  };

  return (
    <div className="container my-4">
      <div className="header-bg bg-secondary d-flex justify-content-start px-3 align-items-center sticky-header rounded mb-3">
        <h5 className="mb-0 text-light py-2">Lease Finance Calculator</h5>
      </div>

      <div className="row g-3">
        <div className="col-md-8 calc-height">
          <div className="card p-3 shadow-sm">
            <h4 className="fw-bold">Deal Parameters (Required Inputs)</h4>
            <hr />

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-semibold">Gross Area (SF)</label>
                <input
                  type="number"
                  className="form-control"
                  value={grossArea}
                  onChange={(e) => setGrossArea(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="fw-semibold">Total Term (Years)</label>
                <input
                  type="number"
                  className="form-control"
                  value={termYears}
                  onChange={(e) => setTermYears(e.target.value)}
                />
              </div>
            </div>

            <h5 className="fw-bold">Net Effective Rent (NER Inputs)</h5>
            <hr />

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-semibold">Face Rent PSF</label>
                <input
                  type="number"
                  className="form-control"
                  value={faceRent}
                  onChange={(e) => setFaceRent(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="fw-semibold">
                  Annual Escalation Rate (%)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={annualEscalation}
                  onChange={(e) => setAnnualEscalation(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-semibold">Free Rent (Months)</label>
                <input
                  type="number"
                  className="form-control"
                  value={freeRentMonths}
                  onChange={(e) => setFreeRentMonths(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="fw-semibold">TI Allowance PSF</label>
                <input
                  type="number"
                  className="form-control"
                  value={tiAllowance}
                  onChange={(e) => setTiAllowance(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-semibold">
                  Commission Rate / Year (%)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={commissionPerYear}
                  onChange={(e) => setCommissionPerYear(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="fw-semibold">Discount Rate (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(e.target.value)}
                />
              </div>
            </div>

            <h5 className="fw-bold">Commission Calculator (Inputs)</h5>
            <hr />

            <div className="col-md-12 mb-3">
              <label className="fw-semibold">Commission Rate Total (%)</label>
              <input
                type="number"
                className="form-control"
                value={commissionTotal}
                onChange={(e) => setCommissionTotal(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                "Calculate Final Metrics"
              )}
            </button>
          </div>
        </div>

        <div className="col-md-4 calc-height">
          <div className="card p-3 shadow-sm mb-2">
            <h5 className="fw-bold mb-3">Calculated Results</h5>
            {!result && (
              <p className="text-muted">Submit to get calculated results.</p>
            )}

            {result && (
              <>
                <div className="p-3 bg-light mb-2 rounded">
                  <h6 className="text-primary fw-bold">NER PSF (Annual)</h6>
                  <h3 className="fw-bold">${result?.ner_psf_annual}</h3>
                </div>

                <div className="p-3 bg-light mb-2 rounded">
                  <h6 className="text-primary fw-bold">Total Commission Due</h6>
                  <h3 className="fw-bold">${result?.total_commission_due}</h3>
                </div>

                <div className="p-3 bg-light mb-2 rounded">
                  <h6 className="text-primary fw-bold">Total Cash Outflow</h6>
                  <h3 className="fw-bold">
                    ${result?.total_cash_outflow_concessions}
                  </h3>
                </div>
              </>
            )}
          </div>
          <div className="card p-3 shadow-sm mb-3">
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
                  onClick={() => (btn === "=" ? calculate() : handleClick(btn))}
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

            <button className="btn btn-danger w-100 mt-3" onClick={clearInput}>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
