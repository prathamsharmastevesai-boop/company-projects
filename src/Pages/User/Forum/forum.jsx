import React, { useState } from "react";
import { Card, Button, Form, InputGroup } from "react-bootstrap";

export const Forum = () => {
  const [threads, setThreads] = useState([
    {
      id: 1,
      title: "Welcome to the Portfolio Forum!",
      createdBy: "Admin",
      createdAt: "Today",
    },
    {
      id: 2,
      title: "How do we submit portfolio updates?",
      createdBy: "John Doe",
      createdAt: "Yesterday",
    },
  ]);

  const [newThread, setNewThread] = useState("");

  const handleCreateThread = () => {
    if (!newThread.trim()) return;

    const data = {
      id: Date.now(),
      title: newThread,
      createdBy: "You",
      createdAt: "Just now",
    };

    setThreads([data, ...threads]);
    setNewThread("");
  };

  return (
    <div className="container py-4" style={{ maxWidth: "900px" }}>
      <h2 className="mb-4 fw-bold">Portfolio Forum</h2>

      {/* Create New Thread */}
      <Card className="p-3 mb-4 shadow-sm">
        <h5 className="mb-3">Create a New Portfolio Thread</h5>

        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Enter thread title..."
            value={newThread}
            onChange={(e) => setNewThread(e.target.value)}
          />
          <Button variant="primary" onClick={handleCreateThread}>
            Create
          </Button>
        </InputGroup>
      </Card>

      {/* Threads List */}
      <h4 className="mb-3">All Threads</h4>

      {threads.length === 0 ? (
        <p className="text-muted">No threads yet. Start a discussion!</p>
      ) : (
        threads.map((t) => (
          <Card key={t.id} className="p-3 mb-3 shadow-sm">
            <div className="d-flex justify-content-between">
              <h5 className="mb-1">{t.title}</h5>
            </div>

            <div className="text-muted small">
              Created by <strong>{t.createdBy}</strong> • {t.createdAt}
            </div>

            <div className="mt-3">
              <Button variant="outline-primary" size="sm" className="me-2">
                View
              </Button>
              <Button variant="outline-secondary" size="sm" className="me-2">
                Edit
              </Button>
              <Button variant="outline-danger" size="sm">
                Delete
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
