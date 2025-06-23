import mongoose from "mongoose";

interface IMessage {
  sender: string;
  text: string;
}

interface ICampaign extends mongoose.Document {
  userId: string;
  name: string;
  gameType: string;
  character: {
    name: string;
    class: string;
    level?: number;
    skills?: string[];
  };
  chatHistory: IMessage[];
}

const CampaignSchema = new mongoose.Schema<ICampaign>({
  userId: { type: String, required: true },
  name: String,
  gameType: String,
  character: {
    name: String,
    class: String,
    level: Number,
    skills: [String],
  },
  chatHistory: [{ sender: String, text: String }],
});

export default mongoose.model<ICampaign>("Campaign", CampaignSchema);
