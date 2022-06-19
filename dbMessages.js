import mongoose from "mongoose";

const WhatsappSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  recived :Boolean
});
export default mongoose.model("messageContent", WhatsappSchema);
