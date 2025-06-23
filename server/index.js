// ✅ index.js — FINAL VERSION

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const campaignRoutes = require("./routes/campaigns"); // ✅ Will receive OpenAI
const OpenAI = require("openai");

// ✅ Load environment variables FIRST
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Create OpenAI instance ONCE here
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Pass OpenAI to the campaigns route
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes(openai)); // ✅ Correct!

// ✅ Create HTTP server + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ✅ Multiplayer turn-based logic
const partyStates = {};

io.on("connection", (socket) => {
  console.log(`✅ New socket connected: ${socket.id}`);

  socket.on("join_party", (campaignId) => {
    socket.join(campaignId);
    if (!partyStates[campaignId]) {
      partyStates[campaignId] = { players: [], actions: {} };
    }
    if (!partyStates[campaignId].players.includes(socket.id)) {
      partyStates[campaignId].players.push(socket.id);
    }
  });

  socket.on("player_action", async ({ campaignId, action }) => {
    const party = partyStates[campaignId];
    if (!party) return;

    party.actions[socket.id] = action;

    // Wait until ALL players have acted
    if (Object.keys(party.actions).length === party.players.length) {
      const combined = Object.values(party.actions).join("; ");

      // ✅ Use same OpenAI instance for DM response
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a DnD Dungeon Master." },
          { role: "user", content: combined },
        ],
      });

      io.to(campaignId).emit(
        "dm_response",
        completion.choices[0].message.content
      );

      // Clear actions for next turn
      party.actions = {};
    }
  });

  socket.on("disconnect", () => {
    for (const [cid, party] of Object.entries(partyStates)) {
      party.players = party.players.filter((p) => p !== socket.id);
      delete party.actions[socket.id];
    }
  });
});

// ✅ Start the server
server.listen(5001, () => console.log("✅ Server running on port 5001"));
