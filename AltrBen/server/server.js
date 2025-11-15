const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const clientData = new Map();

// --- API ENDPOINTS ---

// 1. GENERATE TASKS
app.post('/api/generate-tasks', async (req, res) => {
  const { userBrainDump } = req.body;
  console.log('Received brain dump, sending to Claude...');
  const prompt = `
You are a task-parsing AI. The user has provided a "brain dump."
Convert this text into a JSON array of task objects.
Each object must have "text" (clear, concise, and actionable).
Return *only* the raw JSON array, starting with [ and ending with ].

Here is the user's text:
"${userBrainDump}"
`;
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      { model: 'claude-3-haiku-20240307', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] },
      { headers: { 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' } }
    );
    const claudeResponseText = response.data.content[0].text;
    const taskList = JSON.parse(claudeResponseText);
    const finalTaskList = taskList.map((task, index) => ({
      id: Date.now() + index,
      text: task.text,
      completed: false,
    }));
    res.json({ tasks: finalTaskList });
  } catch (error) {
    console.error('Error calling Claude (generate-tasks):', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate tasks from Claude' });
  }
});

// 2. SUBMIT REFLECTION (FIXED!)
app.post('/api/submit-reflection', async (req, res) => {
  const { reflectionText } = req.body;
  console.log('Received reflection, sending to Claude for judging...');

  const prompt = `
You are a productivity judge. The user has submitted their end-of-day reflection.
1.  Analyze their text to identify self-reported distractions or unproductive actions (e.g., "doomscrolling", "wasted time", "skipped workout").
2.  Based on these, calculate a total "pointDeduction" (e.g., -5 for a small distraction, -20 for skipping a major task). If they were perfect, the deduction is 0.
3.  Write a brief, one-paragraph "summary" of their day and a key insight for tomorrow.

User's reflection: "${reflectionText || "I didn't write a reflection."}"

Return a single, raw JSON object (no markdown) with this format:
{
  "pointDeduction": number,
  "summary": "string"
}
`;

  let pointDeduction = 0;
  let summary = "A solid day's work! Keep it up tomorrow.";

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      { model: 'claude-3-sonnet-20240229', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] },
      { headers: { 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' } }
    );
    const claudeResponseText = response.data.content[0].text;
    console.log("Claude judgment:", claudeResponseText);
    const judgment = JSON.parse(claudeResponseText);
    pointDeduction = judgment.pointDeduction;
    summary = judgment.summary;

  } catch (error) {
    console.error('Error calling Claude (submit-reflection):', error.response ? error.response.data : error.message);
    summary = "Couldn't analyze reflection, but great work today!";
  }

  // --- Mock Final Report (NOW WITH REAL DATA!) ---
  const finalReport = {
    insights: [
      summary,
      `Your point deduction was ${pointDeduction} based on your reflection.`,
      "Alt-You 3 (Focused) was your biggest competition today."
    ],
    mergePatch: ["Prioritize starting the first task quickly.", "Set a timer for 1-hour focus blocks."],
    optimalActions: ["Set a 'wind down' alarm for 1 hour before bed.", "Identify your 'Must-Do' task for tomorrow."],
    confidenceScore: 0.91,
    primeUniverse: { universe_id: "🌌 You (Prime)", description: "Your final timeline.", delta: "Completed 3 tasks, 1 distraction", effects: { stress: 5, productivity: 70, gpa_projection: 0.0, energy: 60 }, mood: "Accomplished", quote: "A solid day's work." },
    alternateUniverses: [
      { universe_id: "Alt-You 1", description: "Procrastinated", delta: "Started 1 hour late", effects: { stress: 7, productivity: 40, gpa_projection: 0.0, energy: 50 }, mood: "Stressed", quote: "I should have started sooner." },
      { universe_id: "Alt-You 3", description: "Focused", delta: "Used focus timer", effects: { stress: 4, productivity: 90, gpa_projection: 0.0, energy: 70 }, mood: "Energized", quote: "Flow state is amazing." },
    ]
  };
  
  res.json(finalReport);
});


// --- REAL-TIME SIMULATION ENGINE (UPGRADED) ---

const distractions = [
  { message: "got lost in a YouTube rabbit hole about retro tech.", points: -10 },
  { message: "spent 30 minutes 'researching' a new keyboard.", points: -5 },
  { message: "is staring at their code, completely zoned out.", points: -3 },
  { message: "decided to 'just check' Twitter... 45 minutes ago.", points: -15 },
];
const productives = [
  { message: "is starting their first task! (Bonus)", points: +5 },
  // --- THIS IS THE FIX ---
  { message: "just finished a task ahead of schedule!", points: +15 },
  // -------------------------
  { message: "is silencing notifications to enter 'focus mode'.", points: +5 },
];
const altColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766"]; // Red, Teal, Blue, Yellow

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const runSimulationForClient = (socketId, data) => {
  const { tasks, altScores } = data;
  const altUser = getRandom(altScores);
  let event;
  let eventType;

  if (Math.random() > 0.45) { // Productive
    eventType = 'good';
    const uncompletedTasks = tasks.filter(t => !t.completed);
    if (uncompletedTasks.length > 0 && Math.random() > 0.3) {
      const task = getRandom(uncompletedTasks);
      event = { message: `just finished "${task.text}"!`, points: 10 };
    } else {
      event = getRandom(productives);
    }
  } else { // Distraction
    eventType = 'bad';
    event = getRandom(distractions);
  }

  altUser.score += event.points;
  const altEvent = {
    id: Date.now(),
    source: altUser.name,
    message: event.message,
    color: altUser.color,
    type: eventType,
  };

  io.to(socketId).emit('new-alt-event', altEvent);
  io.to(socketId).emit('scoreboard-update', altScores);
};

setInterval(() => {
  for (const [socketId, data] of clientData.entries()) {
    runSimulationForClient(socketId, data);
  }
}, 7000);

// --- SOCKET CONNECTION HANDLING (UPGRADED) ---
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('start-day-sim', ({ tasks }) => {
    console.log(`Starting simulation for ${socket.id} with ${tasks.length} tasks.`);
    clientData.set(socket.id, {
      tasks: tasks,
      altScores: [
        { id: 1, name: "Alt-You 1", score: 0, color: altColors[0] },
        { id: 2, name: "Alt-You 2", score: 0, color: altColors[1] },
        { id: 3, name: "Alt-You 3", score: 0, color: altColors[2] },
        { id: 4, name: "Alt-You 4", score: 0, color: altColors[3] },
      ]
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    clientData.delete(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Alternate Reality simulation started...');
});