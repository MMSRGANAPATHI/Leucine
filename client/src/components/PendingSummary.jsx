import React, { useState } from "react";
import axios from "axios";
import "./PS.css";
const PendingSummary = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:3000/pendingSummary");
      // setSummary(response.data.summary);
      if (response.status === 200) {
        setMessage("Summary fetched successfully!");
      }
      console.log(response);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError("Failed to fetch summary");
    }
    setLoading(false);
  };

  return (
    <div>
      <button className="Summary-btn" onClick={fetchSummary}>
        Get Summary
      </button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default PendingSummary;
