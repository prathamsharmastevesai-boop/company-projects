import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IngestionConfigsSubmit } from "../../../Networking/Admin/APIs/SpaceInquiryApi";
import { Modal, Form, Button } from "react-bootstrap";

export const SpaceInquiry = () => {
  const dispatch = useDispatch();

  const { userdata } = useSelector((state) => state.ProfileSlice);

  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    company_id: userdata.id,
    imap_host: "",
    imap_port: "",
    imap_username: "",
    imap_password: "",
    smtp_host: "",
    smtp_port: "",
    smtp_username: "",
    smtp_password: "",
    building_addresses_list: [""],
    trusted_sender_domains: [""],
    is_active: true,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, value, key) => {
    const updated = [...form[key]];
    updated[index] = value;
    setForm({ ...form, [key]: updated });
  };

  const addArrayField = (key) => {
    setForm({ ...form, [key]: [...form[key], ""] });
  };

  const removeArrayField = (key, index) => {
    const updated = [...form[key]];
    updated.splice(index, 1);
    setForm({ ...form, [key]: updated });
  };

  const handleSubmit = () => {
    dispatch(IngestionConfigsSubmit(form));
    setShow(false);
  };

  return (
    <>
      <div className="container-fluid mt-3">
        <div className="text-end">
          <button
            className="btn btn-success rounded-bottom-pill py-2 px-4"
            onClick={() => setShow(true)}
          >
            Add Inquiry Config
          </button>
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>New Space Inquiry Configuration</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <h5 className="mb-3">IMAP Settings</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label>IMAP Host</Form.Label>
                <Form.Control
                  name="imap_host"
                  value={form.imap_host}
                  onChange={handleChange}
                  placeholder="imap.gmail.com"
                />
              </div>

              <div className="col-md-3 mb-3">
                <Form.Label>IMAP Port</Form.Label>
                <Form.Control
                  name="imap_port"
                  type="number"
                  value={form.imap_port}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>IMAP Username</Form.Label>
                <Form.Control
                  name="imap_username"
                  value={form.imap_username}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>IMAP Password</Form.Label>
                <Form.Control
                  name="imap_password"
                  type="password"
                  value={form.imap_password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr />

            <h5 className="mb-3">SMTP Settings</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label>SMTP Host</Form.Label>
                <Form.Control
                  name="smtp_host"
                  value={form.smtp_host}
                  onChange={handleChange}
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div className="col-md-3 mb-3">
                <Form.Label>SMTP Port</Form.Label>
                <Form.Control
                  name="smtp_port"
                  type="number"
                  value={form.smtp_port}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>SMTP Username</Form.Label>
                <Form.Control
                  name="smtp_username"
                  value={form.smtp_username}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>SMTP Password</Form.Label>
                <Form.Control
                  name="smtp_password"
                  type="password"
                  value={form.smtp_password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr />

            <h5>Building Addresses</h5>
            {form.building_addresses_list.map((item, index) => (
              <div className="d-flex mb-2" key={index}>
                <Form.Control
                  value={item}
                  placeholder="Enter building address"
                  onChange={(e) =>
                    handleArrayChange(
                      index,
                      e.target.value,
                      "building_addresses_list"
                    )
                  }
                />
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() =>
                    removeArrayField("building_addresses_list", index)
                  }
                  disabled={form.building_addresses_list.length === 1}
                >
                  X
                </Button>
              </div>
            ))}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => addArrayField("building_addresses_list")}
            >
              + Add Address
            </Button>

            <hr />

            <h5>Trusted Sender Domains</h5>
            {form.trusted_sender_domains.map((item, index) => (
              <div className="d-flex mb-2" key={index}>
                <Form.Control
                  value={item}
                  placeholder="e.g. jll.com"
                  onChange={(e) =>
                    handleArrayChange(
                      index,
                      e.target.value,
                      "trusted_sender_domains"
                    )
                  }
                />
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() =>
                    removeArrayField("trusted_sender_domains", index)
                  }
                  disabled={form.trusted_sender_domains.length === 1}
                >
                  X
                </Button>
              </div>
            ))}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => addArrayField("trusted_sender_domains")}
            >
              + Add Domain
            </Button>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>

          <Button variant="success" onClick={handleSubmit}>
            Save Configuration
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
