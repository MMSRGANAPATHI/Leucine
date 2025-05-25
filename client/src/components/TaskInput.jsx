import React, { useState } from "react";
import axios from "axios";
import "./TI.css";

const TaskInput = () => {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      setMessage("Task cannot be empty");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:3000/addtask", {
        task,
      });
      // setMessage(response.data.message || "Task added!");
      // setTask("");
      if (response.status === 201) {
        alert("Task added successfully!");
      }
    } catch (err) {
      console.error("Error adding task:", err);
      setMessage("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="task"
          id="task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
        />
        <button id="submit-button" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TaskInput;
