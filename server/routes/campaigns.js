const express = require('express');
const Campaign = require('../models/Campaign');
const jwt = require('jsonwebtoken');

// ✅ DO NOT create OpenAI here!
// ✅ Instead export a function that takes it
module.exports = (openai) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const campaigns = await Campaign.find({ userId: decoded.id });
    res.json(campaigns);
  });

  router.post('/new', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newCampaign = new Campaign({ userId: decoded.id, ...req.body });
    await newCampaign.save();
    res.json(newCampaign);
  });

  router.get('/:id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const campaign = await Campaign.findOne({ _id: req.params.id, userId: decoded.id });
    if (!campaign) return res.sendStatus(404);

    if (campaign.chatHistory.length === 0) {
      // ✅ Use the OpenAI passed in
      const prompt = `Create an epic DnD introduction for a ${campaign.character.class} named ${campaign.character.name} in a ${campaign.gameType} setting.`;
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a creative Dungeon Master." },
          { role: "user", content: prompt }
        ]
      });
      const intro = completion.choices[0].message.content;
      campaign.chatHistory.push({ sender: 'DM', text: intro });
      await campaign.save();
    }

    res.json(campaign);
  });

  return router;
};
