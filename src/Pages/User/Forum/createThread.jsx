import React, { useState } from "react";
import { createThread } from "../../../Firebase/services/forumService";

export const CreateThread = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const clientId = localStorage.getItem("clientId") || "test-client-001";
  const userId = localStorage.getItem("userId") || "test-user-001";

  const handleSubmit = async () => {
    await createThread(clientId, userId, title, desc);
    alert("Thread Created!");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Thread title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Thread description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <button onClick={handleSubmit}>Create Thread</button>
    </div>
  );
};
