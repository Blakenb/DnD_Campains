import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  username: string;
  password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
