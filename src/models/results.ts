import mongoose from "mongoose";
import { IS_DEV_ENV } from "../constants";

export interface IResult {
    roundId: number;
    encryptedResultHash: { iv: string; content: string };
    encryptedResult: { iv: string; content: string };
    time: Date;
}

const ResultSchema = new mongoose.Schema({
    roundId: { type: Number, required: true },
    encryptedResult: { iv: { type: String }, content: { type: String } },
    time: { type: Date, default: () => new Date() },
});

const modelName = IS_DEV_ENV ? "marblefootball_dev_results" : "marblefootball_results";
const Result = mongoose.model(modelName, ResultSchema);

export default Result;
