import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./TD.css"; // ✅ Link to external CSS
import PS from "./PendingSummary";

const TaskDisplay = () => {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tasks");
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/delete/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const editTask = (id, taskText) => {
    setEditTaskId(id);
    setEditedTaskText(taskText);
  };

  const updateTask = async () => {
    try {
      await axios.put(`http://localhost:3000/edit/${editTaskId}`, {
        task: editedTaskText,
      });
      setEditTaskId(null);
      setEditedTaskText("");
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/statusUpdate/${id}`, {
        status: newStatus,
      });
      fetchTasks();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="task-display-container">
      <h2 style={{ paddingLeft: "6px", fontStyle: "italic" }}>Task List</h2>
      <div className="task-wrapper">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            {editTaskId === task.id ? (
              <div className="task-edit-block">
                <input
                  type="text"
                  value={editedTaskText}
                  onChange={(e) => setEditedTaskText(e.target.value)}
                />
                <button onClick={updateTask}>Save</button>
                <button onClick={() => setEditTaskId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="task-content">
                <div className="task-lines">
                  <div className="task-text">{task.task}</div>
                  <div className="task-meta">
                    Status: {task.status} | Date: {task.date} | Time:{" "}
                    {task.time}
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    onClick={() => editTask(task.id, task.task)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteTask(task.id)} title="Delete">
                    <FaTrash />
                  </button>
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                  >
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="Summary-block">
        <PS />
      </div>
    </div>
  );
};

export default TaskDisplay;
