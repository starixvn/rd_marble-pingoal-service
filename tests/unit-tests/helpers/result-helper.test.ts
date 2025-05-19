import { resultHelper } from "../../../src/helpers";
import { HalfConfigType } from "../../../src/match-configs";
import { ResultType } from "../../../src/models/rounds";
import crypto from "crypto";

jest.mock("chance", () => {
    return function () {
        return {
            integer: jest.fn().mockReturnValue(1),
            bool: jest.fn().mockReturnValue(true),
            weighted: jest.fn().mockImplementation((arr) => arr[0]),
        };
    };
});

jest.mock("../../../src/helpers/shuffle", () => ({
    shuffle: jest.fn((array) => array),
}));

jest.mock("../../../src/helpers/random-helper", () => ({
    getRandomIndexFromArray: jest.fn().mockReturnValue(0),
}));

jest.mock("../../../src/constants", () => ({
    DEFAULT_NUMBER_OF_VIDEOS: {},
    POOL_SIZE: 10_000,
}));

const NUMBER_OF_VIDEOS = {
    HAA: 1,
    AHH: 2,
};

describe("Result Helper", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("generateResult", () => {
        it("should generate a result based on match configuration", () => {
            // Act
            const result = resultHelper.generateResult({ randomMode: 1, numberOfVideos: NUMBER_OF_VIDEOS });

            // Assert
            expect(result.firstHalf).toBeDefined();
            expect(result.secondHalf).toBeDefined();
            expect(result.overUnderValue).toBe(4.5);
            expect(result.homeWinsOnDraw).toBe(true);
            expect(result.firstHalfVideo).toBeDefined();
            expect(result.secondHalfVideo).toBeDefined();
            expect(result.penalty).toStrictEqual({ home: 2, away: 1 });
        });

        it("should use provided pool if available", () => {
            // Arrange
            const pool = ["1-0"];

            // Act
            const result = resultHelper.generateResult({ randomMode: 1, pool, numberOfVideos: NUMBER_OF_VIDEOS });
            // Assert
            expect(result.firstHalf).toBe("H");
            expect(result.secondHalf).toBe("H");
        });
    });

    describe("getSettlementResult", () => {
        it("should calculate settlement result based on round result", () => {
            const roundResult: ResultType = {
                firstHalf: "HH",
                secondHalf: "AA",
                overUnderValue: 3.5,
                firstHalfVideo: "http://marble-football/watch?v=HH",
                secondHalfVideo: "http://marble-football/watch?v=AA",
                homeWinsOnDraw: false,
                penalty: { home: 0, away: 0 },
            };

            const settlementResult = resultHelper.getSettlementResult(roundResult);

            expect(settlementResult.home).toBe(false);
            expect(settlementResult.away).toBe(false);
            expect(settlementResult.draw).toBe(true);
            expect(settlementResult.over).toBe(true);
            expect(settlementResult.under).toBe(false);
            expect(settlementResult.odd).toBe(false);
            expect(settlementResult.even).toBe(true);
            expect(settlementResult.draw4).toBe(false);
        });
    });

    describe("generateResultFromAdminRawResult", () => {
        it("should generate a result from admin raw result", () => {
            const roundResult = {
                firstHalf: "HAAA",
                secondHalf: "AHHH",
                homeWinsOnDraw: false,
            } as ResultType;

            const result = resultHelper.generateResultFromAdminRawResult(roundResult, NUMBER_OF_VIDEOS);

            expect(result.firstHalf).toBe("HAAA");
            expect(result.secondHalf).toBe("AHHH");
            expect(result.overUnderValue).toBe(4.5);
            expect(result.homeWinsOnDraw).toBe(false);
            expect(result.firstHalfVideo).toBeDefined();
            expect(result.secondHalfVideo).toBeDefined();
            expect(result.penalty).toBeDefined();
        });

        it("should handle empty results", () => {
            const roundResult = {
                homeWinsOnDraw: true,
            } as ResultType;

            const result = resultHelper.generateResultFromAdminRawResult(roundResult, NUMBER_OF_VIDEOS);

            expect(result.firstHalf).toBe("0");
            expect(result.secondHalf).toBe("0");
        });
    });

    describe("generateVideoName", () => {
        it("should generate a video name based on result", () => {
            const result = "HAA";
            const videoName = resultHelper.generateVideoName(result, NUMBER_OF_VIDEOS);
            const expectedVideoName = crypto.createHash("sha256").update(`${result}-0`).digest("hex");
            expect(videoName).toBe(expectedVideoName);
        });

        it("should generate different video name when ignored video matches and number of videos is bigger than 1", () => {
            const result = "AHH";
            const ignoredVideo = resultHelper.generateVideoName(result, NUMBER_OF_VIDEOS);
            const newVideo = resultHelper.generateVideoName(result, NUMBER_OF_VIDEOS, false, ignoredVideo);
            expect(newVideo).not.toBe(ignoredVideo);
        });

        it("should generate same video name when ignored video matches but number of videos is 1", () => {
            const result = "HAA";
            const ignoredVideo = resultHelper.generateVideoName(result, NUMBER_OF_VIDEOS);
            const newVideo = resultHelper.generateVideoName(result, NUMBER_OF_VIDEOS, false, ignoredVideo);
            expect(newVideo).toBe(ignoredVideo);
        });
    });

    describe("createScorePool", () => {
        it("should create a pool of scores based on config", () => {
            const config: HalfConfigType = {
                scoreRate: {
                    "1-0": 0.5,
                    "0-1": 0.5,
                },
            };

            const pool = resultHelper.createScorePool(config, 100);
            expect(pool).toHaveLength(100);
            expect(pool.filter((score) => score === "1-0").length).toBe(50);
            expect(pool.filter((score) => score === "0-1").length).toBe(50);
        });
    });
});
