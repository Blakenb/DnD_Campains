import express from "express";
import jwt from "jsonwebtoken";
import Campaign from "../models/Campaign";
import OpenAI from "openai";

export default function campaignRoutes(openai: OpenAI) {
  const router = express.Router();

  // Get all campaigns for user
  router.get("/", async (req, res) => {
    try {
      const auth = req.headers.authorization || "";
      const [, token = ""] = auth.split(" ");
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const campaigns = await Campaign.find({ userId: decoded.id });
      res.json(campaigns);
    } catch {
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  // Create new campaign
  router.post("/new", async (req, res) => {
    try {
      const auth = req.headers.authorization || "";
      const [, token = ""] = auth.split(" ");
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const newCampaign = new Campaign({
        userId: decoded.id,
        ...req.body,
      });
      await newCampaign.save();
      res.json(newCampaign);
    } catch {
      res.status(401).json({ message: "Unauthorized or invalid token" });
    }
  });

  // Get a single campaign by ID and generate intro if needed
  router.get("/:id", async (req, res) => {
    try {
      const auth = req.headers.authorization || "";
      const [, token = ""] = auth.split(" ");
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const campaign = await Campaign.findOne({
        _id: req.params.id,
        userId: decoded.id,
      });
      if (!campaign) return res.sendStatus(404);

      if (campaign.chatHistory.length === 0) {
        const prompt = `Write an epic introduction for ${campaign.character.name} the ${campaign.character.class} in a ${campaign.gameType} DnD campaign.`;
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are a Dungeon Master." },
            { role: "user", content: prompt },
          ],
        });
        const intro = completion.choices[0].message.content;
        if (intro) {
          campaign.chatHistory.push({ sender: "DM", text: intro });
        } else {
          throw new Error("Failed to generate introduction");
        }
        await campaign.save();
      }

      res.json(campaign);
    } catch {
      res.status(401).json({ message: "Unauthorized or invalid token" });
    }
  });

  return router;
}
