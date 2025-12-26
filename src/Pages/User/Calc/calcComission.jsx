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

  const generateCommissionYears = () => {
    const years = Number(termYears);
    if (!years) return;

    const rows = [];
    for (let i = 1; i <= years; i++) {
      rows.push({ year: i, rate_pct: "" });
    }
    setCommissionList(rows);
  };

  const updateCommissionRate = (index, value) => {
    const arr = [...commissionList];
    arr[index].rate_pct = value;
    setCommissionList(arr);
  };

  const handleSubmit = async () => {
    if (
      !grossArea ||
      !termYears ||
      !faceRentYear1 ||
      !annualEscalation ||
      !freeRentMonths
    ) {
      alert("Please fill all fields");
      return;
    }

    if (commissionList.length !== Number(termYears)) {
      alert("Generate commission rows first");
      return;
    }

    const hasEmptyCommission = commissionList.some(
      (item) =>
        item.rate_pct === "" ||
        item.rate_pct === null ||
        item.rate_pct === undefined
    );
    if (hasEmptyCommission) {
      alert("Please fill all commission rates");
      return;
    }

    setLoading(true);

    const payload = {
      Square_Footage: Number(grossArea),
      Total_Term_Years: Number(termYears),
      Base_Rent_PSF: [Number(faceRentYear1)],
      Annual_Escalation_Rate: Number(annualEscalation),
      Free_Rent_Months: Number(freeRentMonths),
      Commission_Rate_Annual_Pct: commissionList.map((item) => ({
        year: Number(item.year),
        rate_pct: Number(item.rate_pct),
      })),
    };

    try {
      const response = await dispatch(commissionSimpleApi(payload));

      if (response.meta?.requestStatus === "fulfilled") {
        setResult(response.payload);
      } else {
        alert(
          "Calculation failed: " +
            (response.payload?.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Error occurred: " + error.message);
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
              <div className="col-md-6 mb-3">
                <label>Gross Area (SF)</label>
                <input
                  type="number"
                  className="form-control"
                  value={grossArea}
                  onChange={(e) => setGrossArea(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Total Term (Years)</label>
                <input
                  type="number"
                  className="form-control"
                  value={termYears}
                  onChange={(e) => {
                    setTermYears(e.target.value);
                    setCommissionList([]);
                  }}
                  min="1"
                  max="50"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Face Rent PSF – Year 1</label>
                <input
                  type="number"
                  className="form-control"
                  value={faceRentYear1}
                  onChange={(e) => setFaceRentYear1(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Annual Escalation Rate (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={annualEscalation}
                  onChange={(e) => setAnnualEscalation(e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Free Rent (Months)</label>
                <input
                  type="number"
                  className="form-control"
                  value={freeRentMonths}
                  onChange={(e) => setFreeRentMonths(e.target.value)}
                  min="0"
                  max="36"
                />
              </div>
            </div>

            <h5 className="fw-bold mt-3">Commission Rates (Annual)</h5>
            <hr />

            <button
              className="btn btn-outline-primary w-100 mb-3"
              onClick={generateCommissionYears}
              disabled={!termYears}
            >
              Generate Commission Rows ({termYears || 0} years)
            </button>

            {commissionList.map((item, index) => (
              <div key={index} className="mb-2">
                <label>Year {item.year} – Rate (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={item.rate_pct}
                  onChange={(e) => updateCommissionRate(index, e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            ))}

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleSubmit}
              disabled={loading || commissionList.length === 0}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Calculating...
                </>
              ) : (
                "Calculate"
              )}
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5 className="fw-bold mb-3">Calculated Results</h5>
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
