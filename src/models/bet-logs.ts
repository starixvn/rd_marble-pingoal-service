import mongoose from "mongoose";
import { IS_DEV_ENV } from "../constants";

const Schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    choice: { type: String },
    amount: { type: Number, default: 0, required: true },
    rebet: { type: Boolean, default: false },
    clientSentTime: { type: Date },
    receivedTime: { type: Date },
    time: { type: Date },
    siteId: { type: String },
    currency: { type: String, required: true },
    rate: { type: Number, required: true },
    playerId: { type: String },
    operatorId: { type: String, required: true },
    roundId: { type: Number, default: 0, required: true },
});

const modelName = IS_DEV_ENV ? "marblefootball_dev_betlogs" : "marblefootball_betlogs";

export default mongoose.model(modelName, Schema);
