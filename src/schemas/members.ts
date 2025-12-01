import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWarning extends Document {
    userId: string;        // ID member yang diwarn
    guildId: string;       // ID server
    moderatorId: string;   // ID moderator yang memberi warn
    reason: string;        // Alasan warn
    date: Date;            // Waktu warn
}

const warningSchema: Schema<IWarning> = new Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    moderatorId: { type: String, required: true },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Warning: Model<IWarning> = mongoose.model("Warning", warningSchema);
export default Warning;
