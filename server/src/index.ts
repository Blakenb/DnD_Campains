import dotenv from "dotenv";
dotenv.config();

console.log("✅ OPENAI_API_KEY:", process.env.OPENAI_API_KEY); // sanity check

import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import authRoutes from "./routes/auth";
import campaignRoutes from "./routes/campaigns";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Initialize OpenAI once AFTER dotenv loads
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes(openai));

// HTTP + Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

interface PartyState {
  players: string[];
  actions: { [socketId: string]: string };
}

const partyStates: { [campaignId: string]: PartyState } = {};

io.on("connection", (socket) => {
  console.log(`✅ Player connected: ${socket.id}`);

  socket.on("join_party", (campaignId) => {
    socket.join(campaignId);
    if (!partyStates[campaignId]) {
      partyStates[campaignId] = { players: [], actions: {} };
    }
    if (partyStates[campaignId].players.length >= 6) {
      socket.emit("party_full", "This party is full.");
      return;
    }
    partyStates[campaignId].players.push(socket.id);
    console.log(`✅ ${socket.id} joined ${campaignId}`);
  });

  socket.on("player_action", async ({ campaignId, action }) => {
    const party = partyStates[campaignId];
    if (!party) return;
    party.actions[socket.id] = action;

    if (Object.keys(party.actions).length === party.players.length) {
      const combined = Object.values(party.actions).join("; ");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a Dungeon Master in a DnD campaign.",
          },
          { role: "user", content: combined },
        ],
      });
      io.to(campaignId).emit(
        "dm_response",
        completion.choices[0].message.content
      );
      party.actions = {};
    }
  });

  socket.on("disconnect", () => {
    for (const [cid, party] of Object.entries(partyStates)) {
      party.players = party.players.filter((p) => p !== socket.id);
      delete party.actions[socket.id];
    }
    console.log(`❌ Player disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(5001, () => console.log("✅ Server running on port 5001"));
