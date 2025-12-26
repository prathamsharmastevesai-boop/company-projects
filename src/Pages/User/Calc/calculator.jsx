import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { calcSubmitApi } from "../../../Networking/User/APIs/Calculator/calcApi";
import { Accordion } from "react-bootstrap";

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

  const generateCommissionYears = () => {
    const years = Number(termYears);
    if (!years) return;

    const arr = [];
    for (let i = 1; i <= years; i++) {
      arr.push({ year: i, rate: "" });
    }
    setCommissionList(arr);
  };

  const updateCommissionRate = (index, value) => {
    const copy = [...commissionList];
    copy[index].rate = value;
    setCommissionList(copy);
  };

  const handleSubmit = async () => {
    if (
      !grossArea ||
      !termYears ||
      !baseRentYear1 ||
      !annualEscalation ||
      !freeRentMonths ||
      !tiAllowance ||
      !discountRate
    ) {
      alert("Please fill all required fields!");
      return;
    }

    if (commissionList.length !== Number(termYears)) {
      alert("Please generate commission years first.");
      return;
    }

    setLoading(true);

    const payload = {
      Gross_Area_SF: Number(grossArea),
      Total_Term_Years: Number(termYears),
      Face_Rent_PSF: Number(baseRentYear1),
      Annual_Escalation_Rate: Number(annualEscalation),
      Free_Rent_Months: Number(freeRentMonths),

      TI_Allowance_PSF: Number(tiAllowance),
      Discount_Rate: Number(discountRate),

      Commission_Rate_per_Year: commissionList.map((item) => ({
        year: Number(item.year),
        rate_pct: Number(item.rate),
      })),
    };

    const response = await dispatch(calcSubmitApi(payload));

    if (response.meta.requestStatus === "fulfilled") {
      setResult(response.payload);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="container-fuild p-3">
        <div className="row g-3">
          <div className="col-md-8">
            <div className="card p-3 shadow-sm">
              <h4 className="fw-bold">Deal Parameters (Required Inputs)</h4>
              <hr />

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Gross Area (SF)</label>
                  <input
                    className="form-control"
                    type="number"
                    value={grossArea}
                    onChange={(e) => setGrossArea(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Total Term (Years)</label>
                  <input
                    className="form-control"
                    type="number"
                    value={termYears}
                    onChange={(e) => {
                      setTermYears(e.target.value);
                      setCommissionList([]);
                    }}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Base Rent PSF – Year 1</label>
                  <input
                    className="form-control"
                    type="number"
                    value={baseRentYear1}
                    onChange={(e) => setBaseRentYear1(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Annual Escalation Rate (%)</label>
                  <input
                    className="form-control"
                    type="number"
                    value={annualEscalation}
                    onChange={(e) => setAnnualEscalation(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Free Rent (Months)</label>
                  <input
                    className="form-control"
                    type="number"
                    value={freeRentMonths}
                    onChange={(e) => setFreeRentMonths(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>TI Allowance (PSF)</label>
                  <input
                    className="form-control"
                    type="number"
                    value={tiAllowance}
                    onChange={(e) => setTiAllowance(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Discount Rate (%)</label>
                  <input
                    className="form-control"
                    type="number"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(e.target.value)}
                  />
                </div>
              </div>

              <h5 className="fw-bold mt-3">Commission Rates</h5>
              <hr />

              <button
                className="btn btn-outline-primary w-100 mb-3"
                onClick={generateCommissionYears}
              >
                Generate Commission Rows
              </button>

              {commissionList.map((item, index) => (
                <div className="mb-2" key={index}>
                  <label>Year {item.year} Rate (%)</label>
                  <input
                    className="form-control"
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      updateCommissionRate(index, e.target.value)
                    }
                  />
                </div>
              ))}

              <button
                className="btn btn-primary w-100 mt-3"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  "Calculate"
                )}
              </button>
            </div>
          </div>

          <div className="col-md-4">
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
    </>
  );
};
