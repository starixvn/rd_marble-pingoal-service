import mongoose from "mongoose";
import { BET_CHOICES, IS_DEV_ENV } from "../constants";
import { MatchType } from "./tournaments";

export type ResultType = {
    tournamentId?: mongoose.Types.ObjectId;
    score: string;
    videoName: string;
    videoDuration?: number;
    videoTimeline?: number[];
    events?: string[];
    overUnderValue: number;
    homeWinsOnDraw: boolean;
    penalty: { home: number; away: number };
};

const resultSchema = new mongoose.Schema<ResultType>(
    {
        tournamentId: { type: mongoose.Schema.Types.ObjectId },
        score: { type: String },
        videoName: { type: String },
        overUnderValue: { type: Number },
        homeWinsOnDraw: { type: Boolean },
        penalty: { type: Object },
    },
    { _id: false }
);

const matchSchema = new mongoose.Schema<MatchType>(
    {
        home: { type: String },
        away: { type: String },
    },
    { _id: false }
);

export type SettlementResultType = {
    [key in keyof typeof BET_CHOICES]: boolean;
} & { draw4: boolean };

const settlementResultSchema = new mongoose.Schema<SettlementResultType>(
    {
        home: { type: Boolean },
        away: { type: Boolean },
        draw: { type: Boolean },
        draw4: { type: Boolean },
        over: { type: Boolean },
        under: { type: Boolean },
        odd: { type: Boolean },
        even: { type: Boolean },
    },
    { _id: false }
);

export interface IRound {
    id: number;
    result: ResultType;
    settlementResult: SettlementResultType;
    match: MatchType;
    time: Date;
    exchangeRateId: number;
}

const RoundSchema = new mongoose.Schema<IRound>({
    id: { type: Number, required: true },
    result: resultSchema,
    settlementResult: settlementResultSchema,
    match: matchSchema,
    time: { type: Date, default: () => new Date() },
    exchangeRateId: { type: Number, required: true },
});

const modelName = IS_DEV_ENV ? "marblefootball_dev_rounds" : "marblefootball_rounds";
const Round = mongoose.model(modelName, RoundSchema);

export default Round;
