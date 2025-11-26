import React, { useEffect, useState } from "react";
import { Card, Button, Form, Modal, Accordion } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  createThoughtApi,
  get_Threads_Api,
  getThreadhistory,
} from "../../../Networking/Admin/APIs/forumApi";
import { CreateThread } from "./createThread";
import { toast } from "react-toastify";

export const PortfolioForum = () => {
  const dispatch = useDispatch();
  const { ThreadList } = useSelector((state) => state.ForumSlice);

  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [threadMessages, setThreadMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [sending, setSending] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(get_Threads_Api());
  }, [dispatch]);

  useEffect(() => {
    setThreads(ThreadList);
  }, [ThreadList]);

  const handleCreatethread = () => {
    setShowCreateModal(true);
  };

  const handlethreadhistory = async (thread) => {
    setSelectedThread(thread);
    setLoadingHistory(true);

    try {
      const data = await dispatch(getThreadhistory(thread.id)).unwrap();
      setThreadMessages(data.thoughts || []);
    } catch (error) {
      toast.error("Failed to fetch thread history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    if (!selectedThread) {
      toast.warning("Please select a thread first");
      return;
    }

    try {
      setSending(true);

      // Add message
      await dispatch(
        createThoughtApi({
          thread_id: selectedThread.id,
          content: newMessage,
        })
      ).unwrap();

      setNewMessage("");

      // 🔥 Re-fetch updated messages instantly
      const data = await dispatch(getThreadhistory(selectedThread.id)).unwrap();
      setThreadMessages(data.thoughts || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add thought");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container-fluid p-0" style={{ height: "100vh" }}>
      <div className="row g-0 h-100">
        <div className="d-block d-lg-none col-12 border-bottom">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header style={{ paddingLeft: "25px" }}>
                Portfolio Threads ({threads.length})
              </Accordion.Header>
              <Accordion.Body style={{ maxHeight: "40vh", overflowY: "auto" }}>
                <Button
                  className="w-100 mb-3"
                  style={{ background: "#00B159", border: 0 }}
                  onClick={handleCreatethread}
                >
                  + New Portfolio Thread
                </Button>

                {threads.length === 0 ? (
                  <p className="text-muted">Loading threads...</p>
                ) : (
                  threads.map((t) => (
                    <Card
                      key={t.id}
                      className={`p-3 mb-2 shadow-sm border ${
                        selectedThread?.id === t.id ? "border-primary" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handlethreadhistory(t)}
                    >
                      <h6 className="fw-bold mb-1">
                        {t.title?.length > 28
                          ? t.title.slice(0, 28) + "..."
                          : t.title}
                      </h6>
                    </Card>
                  ))
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>

        <div
          className="d-none d-lg-block col-lg-3 border-end"
          style={{ overflowY: "auto", height: "100%" }}
        >
          <div className="p-3">
            <h5 className="fw-bold">Portfolio Threads ({threads.length})</h5>

            <Button
              className="w-100 my-3"
              style={{ background: "#00B159", border: 0 }}
              onClick={handleCreatethread}
            >
              + New Portfolio Thread
            </Button>

            {threads.map((t) => (
              <Card
                key={t.id}
                className={`p-3 mb-2 shadow-sm border ${
                  selectedThread?.id === t.id ? "border-primary" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => handlethreadhistory(t)}
              >
                <h6 className="fw-bold mb-1">
                  {t.title?.length > 28
                    ? t.title.slice(0, 28) + "..."
                    : t.title}
                </h6>
              </Card>
            ))}
          </div>
        </div>

        <div
          className="col-lg-9 col-12 d-flex flex-column p-3"
          style={{
            overflow: "hidden",
            height: "100%",
          }}
        >
          {!selectedThread ? (
            <h5 className="text-muted">Select a thread to view details</h5>
          ) : (
            <>
              <h3 className="fw-bold px-4">{selectedThread.title}</h3>

              <div
                style={{
                  flexGrow: 1,
                  overflowY: "auto",
                  paddingBottom: "120px",
                }}
              >
                {loadingHistory ? (
                  <p className="text-muted">Loading thread history...</p>
                ) : threadMessages.length === 0 ? (
                  <p className="text-muted">No thoughts yet...</p>
                ) : (
                  threadMessages.map((msg) => (
                    <Card
                      key={msg.id}
                      className={`p-3 mb-3 shadow-sm ${
                        msg.deleted ? "border-danger bg-light" : ""
                      }`}
                    >
                      <h6 className="fw-bold">
                        {msg.author_name || "Unknown User"}
                      </h6>

                      {msg.deleted ? (
                        <p className="text-danger fst-italic mb-2">
                          This message was deleted.
                        </p>
                      ) : (
                        <p className="mb-2" style={{ whiteSpace: "pre-line" }}>
                          {msg.content}
                        </p>
                      )}

                      <div className="text-muted small d-flex justify-content-between">
                        <span>{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              <div
                className="d-flex p-3 shadow-lg bg-white"
                style={{
                  position: "sticky",
                  bottom: 0,
                  borderRadius: "12px",
                  zIndex: 10,
                }}
              >
                <Form.Control
                  type="text"
                  placeholder="Add a new Forum Thought..."
                  className="me-2"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />

                <Button onClick={handleSend} disabled={sending}>
                  {sending ? "Sending..." : "Send"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Portfolio Thread</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateThread onClose={() => setShowCreateModal(false)} />
        </Modal.Body>
      </Modal>
    </div>
  );
};
