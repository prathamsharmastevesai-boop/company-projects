import React, { useEffect, useState } from "react";
import { Card, Button, Form, Modal, Accordion, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  createThoughtApi,
  deleteThoughtApi,
  deleteThreadsApi,
  get_Threads_Api,
  getThreadhistory,
  updateThoughtApi,
} from "../../../Networking/Admin/APIs/forumApi";
import { CreateThread } from "./createThread";
import { toast } from "react-toastify";

export const PortfolioForum = () => {
  const dispatch = useDispatch();
  const { ThreadList } = useSelector((state) => state.ForumSlice);

  const { userdata } = useSelector((state) => state.ProfileSlice);

  const messagesEndRef = React.useRef(null);

  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [threadMessages, setThreadMessages] = useState([]);

  const [userdetail, setUserdetail] = useState({});

  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [editingThoughtId, setEditingThoughtId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [sending, setSending] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [threadMessages]);

  useEffect(() => {
    setLoadingThreads(true);
    dispatch(get_Threads_Api())
      .unwrap()
      .finally(() => setLoadingThreads(false));
  }, []);

  useEffect(() => {
    setThreads(ThreadList);
  }, [ThreadList]);

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";

    if (diffDays === 1) return "Yesterday";

    return `${diffDays}d ago`;
  };

  const handleCreatethread = () => {
    setShowCreateModal(true);
  };

  const handleDeleteThread = async (threadId) => {
    setThreadToDelete(threadId);
    setShowDeleteModal(true);
  };

    const confirmDeleteThread = async () => {
    try {
      setDeletingId(threadToDelete);

      await dispatch(deleteThreadsApi({ thread_id: threadToDelete })).unwrap();
      await dispatch(get_Threads_Api()).unwrap();
    if (selectedThread?.id === threadToDelete) {
      setSelectedThread(null);
      setThreadMessages([]);
    }
      toast.success("Thread deleted successfully");
    } catch (err) {
  
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setThreadToDelete(null);
    }
  };

  const handlethreadhistory = async (thread) => {
    setSelectedThread(thread);
    setLoadingHistory(true);
    setUserdetail(userdata?.id);
    try {
      const data = await dispatch(getThreadhistory(thread.id)).unwrap();
      setThreadMessages(data.thoughts || []);
    } catch (error) {
 
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleEdit = (thoughtId, content) => {
    setEditingThoughtId(thoughtId);

    setNewMessage(content);
  };

  const handleDelete = async (threadId, thoughtId) => {
    if (!thoughtId) {
      toast.error("Thought ID is missing!");
      return;
    }

    try {
      setLoadingId(thoughtId);
      await dispatch(
        deleteThoughtApi({ thread_id: threadId, thought_id: thoughtId })
      ).unwrap();

      toast.success("Thought deleted successfully");

      setThreadMessages((prev) => prev.filter((msg) => msg.id !== thoughtId));

      await dispatch(get_Threads_Api()).unwrap();
    } catch (err) {
      toast.error(err || "Failed to delete thought");
    } finally {
      setLoadingId(null);
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

      if (editingThoughtId) {
        await dispatch(
          updateThoughtApi({
            thread_id: selectedThread.id,
            thought_id: editingThoughtId,
            content: newMessage,
          })
        ).unwrap();
        setEditingThoughtId(null);

        toast.success("Thought updated!");
      } else {
        await dispatch(
          createThoughtApi({
            thread_id: selectedThread.id,
            content: newMessage,
          })
        ).unwrap();
      }

      setNewMessage("");
      const data = await dispatch(getThreadhistory(selectedThread.id)).unwrap();
      setThreadMessages(data.thoughts || []);
    } catch (error) {
      console.error(error);

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
                  style={{ background: "#6c757d", border: 0 }}
                  onClick={handleCreatethread}
                >
                  + New Portfolio Thread
                </Button>

                {loadingThreads ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-secondary" />
                    <p className="text-muted mt-2">Loading threads...</p>
                  </div>
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
                      <h6
                        className="fw-bold mb-1 text-truncate"
                        style={{ maxWidth: "100%" }}
                      >
                        {t.title?.length > 28
                          ? t.title.slice(0, 28) + "..."
                          : t.title}
                      </h6>

                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <div
                          className="d-flex align-items-center gap-2"
                          style={{ fontSize: 14 }}
                        >
                          <span>{t.author_name}</span>
                          <span>|</span>
                          <span>
                            last thought at{" "}
                            {t.last_thought_at
                              ? formatRelativeDate(t.last_thought_at)
                              : "-"}
                          </span>
                        </div>

                        <button
                          className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                          style={{ width: 32, height: 30, padding: 0 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteThread(t.id);
                          }}
                        >
                          {deletingId === t.id ? (
                            <Spinner
                              animation="border"
                              size="sm"
                              style={{ width: "14px", height: "14px" }}
                            />
                          ) : (
                            <i
                              className="bi bi-trash"
                              style={{ fontSize: 14 }}
                            ></i>
                          )}
                        </button>
                      </div>
                    </Card>
                  ))
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>

        <div
          className="d-none d-lg-block col-lg-3 border-end hide-scrollbar"
          style={{ overflowY: "auto", height: "100%" }}
        >
          <div className="p-3">
            <h5 className="fw-bold">Portfolio Threads ({threads.length})</h5>

            <Button
              className="w-100 my-3"
              style={{ background: "#6c757d", border: 0 }}
              onClick={handleCreatethread}
            >
              + New Portfolio Thread
            </Button>

            {loadingThreads ? (
              <div className="text-center py-4">
                <div className="spinner-border text-secondary" />
                <p className="text-muted mt-2">Loading threads...</p>
              </div>
            ) : (
              threads.map((t) => (
                <Card
                  key={t.id}
                  className={`p-3 mb-2 shadow-sm thread_card border ${
                    selectedThread?.id === t.id ? "border-primary" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handlethreadhistory(t)}
                >
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2">
                    <div className="flex-grow-1 thread_title">
                      <h6
                        className="fw-bold mb-1 text-truncate"
                        style={{ maxWidth: "100%" }}
                      >
                        {t.title?.length > 28
                          ? t.title.slice(0, 28) + "..."
                          : t.title}
                      </h6>
                    </div>

                    <div className="thread_btn d-flex flex-row flex-md-column align-items-center text-end gap-2">
                      <button
                        className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                        style={{ width: 32, height: 30, padding: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteThread(t.id);
                        }}
                      >
                        {deletingId === t.id ? (
                          <Spinner
                            animation="border"
                            size="sm"
                            style={{ width: "14px", height: "14px" }}
                          />
                        ) : (
                          <i
                            className="bi bi-trash"
                            style={{ fontSize: 14 }}
                          ></i>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-content-center">
                    <span className="text-center" style={{ fontSize: 14 }}>
                      {t.author_name}
                    </span>
                    <span>|</span>
                    <span className="text-center " style={{ fontSize: 14 }}>
                      last thought at{" "}
                      {t.last_thought_at
                        ? formatRelativeDate(t.last_thought_at)
                        : "-"}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div
          className="col-lg-9 col-12 d-flex flex-column p-3 "
          style={{
            overflow: "hidden",
            height: "100%",
          }}
        >
          {!selectedThread ? (
            <div
              className="d-flex justify-content-center align-items-start"
              style={{ height: "100%", width: "100%" }}
            >
              <h5 className="text-muted m-0">
                Select a thread to view details
              </h5>
            </div>
          ) : (
            <>
              <h3 className="fw-bold px-4">{selectedThread.title}</h3>
              <hr />
              <div
                style={{
                  flexGrow: 1,
                  overflowY: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "start",
                }}
                className="hide-scrollbar"
              >
                {loadingHistory ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "100%", width: "100%" }}
                  >
                    <p className="text-muted m-0">Loading Thoughts...</p>
                  </div>
                ) : threadMessages.length === 0 ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "100%", width: "100%" }}
                  >
                    <p className="text-muted m-0">No thoughts yet</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column w-100 ">
                    {threadMessages.map((msg) => (
                      <Card
                        key={msg.id}
                        className={`p-3 mb-3 shadow-sm
    ${msg.deleted ? "border-danger bg-light" : ""}
    ${msg.author_role === "admin" ? "admin-thread" : "user-thread"}
  `}
                      >
                        <h6
                          className={`fw-bold ${
                            msg.author_role === "admin" ? "text-primary" : ""
                          }`}
                        >
                          {msg.author_name || "Unknown User"}
                          {msg.author_role === "admin" && (
                            <span className="badge bg-primary ms-2">Admin</span>
                          )}
                        </h6>

                        {msg.deleted ? (
                          <p className="text-danger fst-italic mb-2">
                            This message was deleted.
                          </p>
                        ) : (
                          <p
                            className="mb-2"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {msg.content}
                          </p>
                        )}

                        <div className="text-muted small d-flex justify-content-between">
                          <span>
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                          {userdata.role == "admin" ? (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm p-2  d-flex align-items-center justify-content-center"
                                onClick={() => handleEdit(msg.id, msg.content)}
                                title="Edit"
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#0d6efd",
                                }}
                              >
                                <i className="bi bi-pencil-square fs-6"></i>
                              </button>

                              <button
                                className="btn btn-sm p-2 d-flex align-items-center justify-content-center"
                                onClick={() =>
                                  handleDelete(selectedThread.id, msg.id)
                                }
                                disabled={loadingId === msg.id}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#dc3545",
                                }}
                              >
                                {loadingId === msg.id ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  <i className="bi bi-trash3-fill fs-6"></i>
                                )}
                              </button>
                            </div>
                          ) : Number(msg.author_uid) === userdetail ? (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm p-2  d-flex align-items-center justify-content-center"
                                onClick={() => handleEdit(msg.id, msg.content)}
                                title="Edit"
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#0d6efd",
                                }}
                              >
                                <i className="bi bi-pencil-square fs-6"></i>
                              </button>

                              <button
                                className="btn btn-sm p-2 d-flex align-items-center justify-content-center"
                                onClick={() =>
                                  handleDelete(selectedThread.id, msg.id)
                                }
                                disabled={loadingId === msg.id}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#dc3545",
                                }}
                              >
                                {loadingId === msg.id ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  <i className="bi bi-trash3-fill fs-6"></i>
                                )}
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </Card>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
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
                  placeholder={
                    editingThoughtId
                      ? "Editing thought..."
                      : "Add a new Forum Thought..."
                  }
                  className="me-2"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />

                <button
                  className="btn btn-secondary rounded-circle d-flex justify-content-center align-items-center"
                  onClick={handleSend}
                  disabled={sending}
                  style={{ width: "38px", height: "38px" }}
                >
                  {sending ? (
                    <div className="spinner-border spinner-border-sm text-light"></div>
                  ) : (
                    <i className="bi bi-send-fill"></i>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>Are you sure you want to delete this thread?</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={confirmDeleteThread}
            disabled={deletingId === threadToDelete}
          >
            {deletingId === threadToDelete ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

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
