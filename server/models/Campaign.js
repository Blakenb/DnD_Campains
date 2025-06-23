const mongoose = require('mongoose');
const CampaignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gameType: String,
  character: {
    name: String,
    class: String,
    level: Number,
    background: String,
    actions: [String]
  },
  chatHistory: [{
    sender: String,
    text: String
  }]
});
module.exports = mongoose.model('Campaign', CampaignSchema);
