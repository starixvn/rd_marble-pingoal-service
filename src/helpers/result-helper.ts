import { halfConfig, HalfConfigType, matchConfig } from "../match-configs";
import { ResultType, SettlementResultType } from "../models/rounds";
import Chance from "chance";
import { shuffle } from "./shuffle";
import crypto from "crypto";
import { DEFAULT_NUMBER_OF_VIDEOS, POOL_SIZE } from "../constants";
import { randomHelper } from ".";

type DataResultType = {
    randomMode: number;
    numberOfVideos: Record<string, number>;
    pool?: string[];
};
export const generateResult = (data: DataResultType): ResultType => {
    const chance = new Chance();
    const pool = data.pool || createScorePool(halfConfig, POOL_SIZE);
    const randomMode = data.randomMode || 1;
    const numberOfVideos = data.numberOfVideos || DEFAULT_NUMBER_OF_VIDEOS;

    const score = generateResultForHalf({ randomMode, numberOfVideos, pool });
    const videoInfo = getVideoInfoFromResult(score, numberOfVideos);
    const homeWinsOnDraw = chance.bool();
    const penalty = generatePenaltyResult(homeWinsOnDraw);
    const result = {
        score,
        ...videoInfo,
        overUnderValue: matchConfig.ou,
        homeWinsOnDraw,
        penalty,
    };
    return result;
};

export const generateResultFromAdminRawResult = (roundResult: ResultType, numberOfVideos: Record<string, number>): ResultType => {
    const score = roundResult.score || "0:0";
    const videoInfo = getVideoInfoFromResult(score, numberOfVideos);
    const penalty = generatePenaltyResult(roundResult.homeWinsOnDraw);

    return {
        score,
        homeWinsOnDraw: roundResult.homeWinsOnDraw,
        penalty,
        ...videoInfo,
        overUnderValue: matchConfig.ou,
    };
};

export const getSettlementResult = (roundResult: ResultType): SettlementResultType => {
    const { score } = roundResult;

    const homeGoals = parseInt(score.split(":")[0] ?? "0");
    const awayGoals = parseInt(score.split(":")[1] ?? "0");

    const isOver = homeGoals + awayGoals > roundResult.overUnderValue;
    const isOdd = (homeGoals + awayGoals) % 2 === 1;

    return {
        home: homeGoals > awayGoals,
        away: awayGoals > homeGoals,
        draw: homeGoals === awayGoals,
        draw4: homeGoals === awayGoals && homeGoals === 4,
        over: isOver,
        under: !isOver,
        odd: isOdd,
        even: !isOdd,
    };
};

export const generateRawResultForHash = () => {};

const generateResultForHalf = (data: DataResultType) => {
    const scoreResult = getScoreFromPool(data);

    const [homeGoals, awayGoals] = scoreResult.split("-").map(Number);
    const score = `${homeGoals}:${awayGoals}`;

    return score;
};

const getScoreFromPool = (data: DataResultType) => {
    const pool = data.pool || createScorePool(halfConfig, POOL_SIZE);

    const index = randomHelper.getRandomIndexFromArray(data.randomMode, POOL_SIZE);
    return pool[index];
};

const getVideoInfoFromResult = (score: string, numberOfVideos: Record<string, number>) => {
    const videoName = generateVideoName(score, numberOfVideos);

    return {
        videoName,
    };
};

export const generateVideoName = (result: string, numberOfVideos: Record<string, number>, videoDefault = false, ignoredVideo = "") => {
    const chance = new Chance();
    const currentNumberOfVideos = numberOfVideos[result] || DEFAULT_NUMBER_OF_VIDEOS[result];
    let videoIndex = videoDefault ? 0 : chance.integer({ min: 1, max: currentNumberOfVideos }) - 1;
    let videoName = crypto.createHash("sha256").update(`${result}-${videoIndex}`).digest("hex");

    if (videoName === ignoredVideo && !videoDefault) {
        videoIndex = (videoIndex + 1) % currentNumberOfVideos;
        videoName = crypto.createHash("sha256").update(`${result}-${videoIndex}`).digest("hex");
    }

    return videoName;
};

const generatePenaltyResult = (homeWinsOnDraw: boolean) => {
    const chance = new Chance();
    const maxLosingPenalty = 4;
    const losingTeamPenalty = chance.integer({ min: 0, max: maxLosingPenalty });
    const difference = losingTeamPenalty === maxLosingPenalty ? 1 : chance.integer({ min: 1, max: 2 });
    const winningTeamPenalty = losingTeamPenalty + difference;

    return homeWinsOnDraw ? { home: winningTeamPenalty, away: losingTeamPenalty } : { home: losingTeamPenalty, away: winningTeamPenalty };
};

export function createScorePool(config: HalfConfigType, poolSize: number): string[] {
    const pool: string[] = [];

    for (const [score, rate] of Object.entries(config.scoreRate)) {
        const count = Math.round(rate * poolSize);
        for (let i = 0; i < count; i++) {
            pool.push(score);
        }
    }

    return shuffle(shuffle(pool));
}
