import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getdistilledExpenseTrackerlistApi } from "../../../Networking/Admin/APIs/distilledExpenseTrackerApi";

export const DistilledExpenseTrackerlist = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    dispatch(getdistilledExpenseTrackerlistApi())
      .unwrap()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err || "Failed to fetch data");
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center mt-4">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">
        Distilled Expense Tracker Submissions
      </h2>
      {data && data.reverse() && data.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Submarket</th>
              <th>Building SF</th>
              <th>Class</th>
              <th>Property Insurance</th>
              <th>Janitorial</th>
              <th>Security</th>
              <th>TI Allowances</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || index}>
                <td>{index + 1}</td>
                <td>{item.submarket_geo}</td>
                <td>{item.building_sf_band}</td>

                <td>{item.building_class}</td>
                <td>{item.property_insurance_psf}</td>
                <td>{item.janitorial_cleaning_psf}</td>
                <td>{item.security_monitoring_psf}</td>
                <td>{item.ti_allowances_psf}</td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center">No submissions found.</div>
      )}
    </div>
  );
};
