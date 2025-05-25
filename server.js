import express from "express";
import admin from "firebase-admin";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import serviceAccount from "./secretkey.json" assert { type: "json" };
import cors from "cors";
import axios from "axios";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//point to add the task
app.post("/addtask", async (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).send("Invalid input");
  }
  const now = new Date();
  console.log(now);
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0];

  const newtask = db.collection("todo").doc();
  await newtask.set({
    id: newtask.id,
    task,
    status: "in-progress",
    date,
    time,
  });
  res.status(201).json({ message: "Task added successfully" });
});

//end point to delete the task
app.delete("/delete/:id", async (req, res) => {
  const tid = req.params.id;
  try {
    const task = db.collection("todo").doc(tid);
    const doc = await task.get();
    if (!doc.exists) {
      return res.status(404).send({ error: "Task not found" });
    }
    await task.delete();
    res.status(200).send({ message: "Task deleted successfully" });
  } catch (err) {
    console.log("Error deleting task", err);
    res.status(500).send({ error: "Error deleting task" });
  }
});

//for updating the task
app.put("/edit/:id", async (req, res) => {
  const tid = req.params.id;
  const { task } = req.body;

  try {
    const reqtsk = db.collection("todo").doc(tid);
    const doc = await reqtsk.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    await reqtsk.update({ task });

    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Error updating task" });
  }
});

//retrieve all the tesks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await db.collection("todo").get();
    const tasklist = [];
    tasks.forEach((doc) => {
      tasklist.push(doc.data());
    });
    res.status(200).json(tasklist);
  } catch (err) {
    console.error("Error retrieving tasks:", err);
    res.status(500).json({ error: "Error retrieving tasks" });
  }
});

//pending list of task summary
// app.get("/pendingSummary", async (req, res) => {
//   try {
//     const tasksSnapshot = await db
//       .collection("todo")
//       .where("status", "==", "in-progress")
//       .get();

//     if (tasksSnapshot.empty) return res.json({ summary: "No pending tasks." });

//     const tasklist = [];

//     tasksSnapshot.forEach((doc) => {
//       const data = doc.data();
//       if (data.task) {
//         tasklist.push(`- ${data.task}`);
//       }
//     });

//     const prompt = `Give a 100 words summary of the following pending tasks:\n${tasklist.join(
//       "\n"
//     )}`;

//     const result = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     // Fix: access text property directly, not as a function
//     const summary =
//       result.response?.text || result.text || "No summary returned";

//     res.status(200).json({ summary });
//   } catch (err) {
//     console.error("Error retrieving tasks:", err);
//     res.status(500).json({ error: "Error retrieving tasks" });
//   }
// });

const SLAKE_WEBHOOK_URL =
  "https://hooks.slack.com/services/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";

app.get("/pendingSummary", async (req, res) => {
  try {
    const tasksSnapshot = await db
      .collection("todo")
      .where("status", "==", "in-progress")
      .get();

    if (tasksSnapshot.empty) {
      const noTaskMsg = "No pending tasks.";
      await axios.post(SLACK_WEBHOOK_URL, {
        text: `📝 Task Summary:\n${noTaskMsg}`,
      });
      return res.json({ summary: noTaskMsg });
    }

    const tasklist = [];

    tasksSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.task) {
        tasklist.push(`- ${data.task}`);
      }
    });

    const prompt = `Give a 100 words summary of the following pending tasks:\n${tasklist.join(
      "\n"
    )}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const summary =
      result.response?.text || result.text || "No summary returned";

    // 🟡 Send summary to Slack
    await axios.post(SLAKE_WEBHOOK_URL, {
      text: `📝 *Pending Task Summary:*\n${summary}`,
    });

    res.status(200).json({ summary });
  } catch (err) {
    console.error("Error retrieving tasks:", err);
    res.status(500).json({ error: "Error retrieving tasks" });
  }
});

//status updation endpoint
app.put("/statusUpdate/:id", async (req, res) => {
  const tid = req.params.id;
  const { status } = req.body;

  try {
    const reqtsk = db.collection("todo").doc(tid);
    const doc = await reqtsk.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }
    await reqtsk.update({ status });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Error updating task" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
