import React, { useEffect, useState } from "react";
import { Modal, Button, Form, FloatingLabel, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import {
  createNoteApi,
  getNotesApi,
  updateNoteApi,
  deleteNoteApi,
} from "../../../Networking/User/APIs/Notes/notesApi";

export const Notes = () => {
  const dispatch = useDispatch();

  const { notes, loading } = useSelector((state) => state.notesSlice);
  console.log(notes, "notes");

  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [currentNote, setCurrentNote] = useState({
    id: null,
    title: "",
    content: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(getNotesApi());
  }, [dispatch]);

  const notesArray = Array.isArray(notes) ? notes : notes ? [notes] : [];

  const sortedNotes = [...notesArray].sort((a, b) => {
    const aTime = new Date(a.updated_at || a.created_at).getTime();
    const bTime = new Date(b.updated_at || b.created_at).getTime();
    return bTime - aTime;
  });

  function openNewNote() {
    setIsEditing(false);
    setCurrentNote({ id: null, title: "", content: "" });
    setShowModal(true);
  }

  function openEditNote(note) {
    setIsEditing(true);
    setCurrentNote({
      id: note.id,
      title: note.title,
      content: note.content,
    });
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;
    setIsEditing(false);
    setCurrentNote({ id: null, title: "", content: "" });
    setShowModal(false);
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: currentNote.title?.trim() || "Untitled",
      content: currentNote.content?.trim() || "",
    };

    try {
      if (isEditing && currentNote.id) {
        await dispatch(
          updateNoteApi({ noteId: currentNote.id, data: payload })
        ).unwrap();
      } else {
        await dispatch(createNoteApi(payload)).unwrap();
      }

      closeModal();
    } catch (err) {
      setError("Save failed. Try again.");
      console.error(err);
    }

    setSaving(false);
  };

  async function handleDelete(noteId) {
    if (!window.confirm("Delete this note?")) return;

    try {
      await dispatch(deleteNoteApi(noteId)).unwrap();
    } catch (err) {
      alert("Failed to delete note");
    }
  }

  function formatDate(date) {
    if (!date) return "";
    return new Date(date).toLocaleString();
  }

  return (
    <div>
      <div className="header-bg d-flex justify-content-between px-3 align-items-center sticky-header">
        <h5 className="mb-0 text-light">Notes</h5>
        <button className="btn btn-secondary btn-sm" onClick={openNewNote}>
          + New Note
        </button>
      </div>
      <div className="container-fuild p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : sortedNotes.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: 40 }}>📝</div>
            <p className="mt-2">No notes yet</p>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={openNewNote}
            >
              + Add Note
            </button>
          </div>
        ) : (
          <div className="list-group">
            {sortedNotes.map((note) => (
              <div
                key={note.id}
                className="list-group-item list-group-item-action mb-2"
              >
                <div className="d-flex w-100 justify-content-between">
                  <h6
                    className="mb-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => openEditNote(note)}
                  >
                    {note.title?.length > 28
                      ? note.title.slice(0, 28) + "..."
                      : note.title}
                  </h6>

                  <small className="text-muted">
                    {formatDate(note.updated_at || note.created_at)}
                  </small>
                </div>

                <p
                  className="mb-1 text-truncate"
                  onClick={() => openEditNote(note)}
                >
                  {note.content}
                </p>

                <div className="d-flex gap-2 justify-content-end">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => openEditNote(note)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal show={showModal} onHide={closeModal} backdrop="static" centered>
          <Form onSubmit={handleSave}>
            <Modal.Header closeButton={!saving}>
              <Modal.Title>{isEditing ? "Edit Note" : "Add Note"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <FloatingLabel label="Title" className="mb-3">
                <Form.Control
                  type="text"
                  value={currentNote.title}
                  required
                  onChange={(e) =>
                    setCurrentNote((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </FloatingLabel>

              <FloatingLabel label="Note">
                <Form.Control
                  as="textarea"
                  style={{ height: "200px" }}
                  value={currentNote.content}
                  onChange={(e) =>
                    setCurrentNote((p) => ({ ...p, content: e.target.value }))
                  }
                />
              </FloatingLabel>

              <div className="mt-2 text-muted small">
                Tip: Only you can see your notes.
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner size="sm" /> Saving...
                  </>
                ) : isEditing ? (
                  "Save changes"
                ) : (
                  "Save"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};
