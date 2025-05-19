import { stub } from "jest-auto-stub";
import { TableInGameConsumer } from "sc-game-base/src/table/event-consumers";
import GameData from "../../../src/game-data";
import { InGameConsumer } from "../../../src/consumers";
import GameDefinition from "../../../src/game-definition";
import { gameManagementApiClientFactory, publisher, roundQuery } from "../global-stubs";
import * as helper from "../../../src/helpers/bet-percentage";

describe("InGameConsumer test", () => {
    let consumer: InGameConsumer;
    const definition = stub<GameDefinition>();
    definition.durations = {
        wholeRound: 151,
        startingRound: 141,
        placingBets: 136,
        lockingBet: 109,
        streamingVideo: 108,
    };
    const gameData = stub<GameData>();
    const getBalance = jest.fn();

    beforeEach(() => {
        consumer = new InGameConsumer(definition, gameData, roundQuery, publisher, getBalance, gameManagementApiClientFactory);
    });

    it("should inherit from TableInGameConsumer", () => {
        expect(consumer instanceof TableInGameConsumer).toBeTruthy();
    });

    describe("getCurrentVideoResult", () => {
        const fullVideoResult = {
            firstHalfVideo: "video1.mp4",
            secondHalfVideo: "video2.mp4",
            firstHalfTimeline: [1, 2, 3],
            secondHalfTimeline: [4, 5, 6],
            firstHalf: "AH",
            secondHalf: "HA",
        };

        const timelineResult = {
            firstHalfTimeline: [1, 2, 3],
            secondHalfTimeline: [4, 5, 6],
            firstHalf: "AH",
            secondHalf: "HA",
        };

        beforeEach(() => {
            gameData.result = fullVideoResult as any;
        });

        const testCases = [
            {
                phase: "streaming video",
                timeRange: { start: 0, end: definition.durations.streamingVideo - 1 },
                resultDescription: "full video result",
                expectedResult: fullVideoResult,
            },
            {
                phase: "showing result",
                timeRange: { start: definition.durations.startingRound + 1, end: definition.durations.wholeRound },
                resultDescription: "timeline result",
                expectedResult: timelineResult,
            },
            {
                phase: "starting",
                timeRange: { start: definition.durations.placingBets + 1, end: definition.durations.startingRound },
                resultDescription: "empty result",
                expectedResult: {},
            },
            {
                phase: "placing bets",
                timeRange: { start: definition.durations.streamingVideo, end: definition.durations.placingBets },
                resultDescription: "empty result",
                expectedResult: {},
            },
        ];

        testCases.forEach(({ phase, timeRange, resultDescription, expectedResult }) => {
            describe(`during ${phase} phase with start time ${timeRange.start} and end time ${timeRange.end}`, () => {
                const timeToTests = Array.from({ length: timeRange.end - timeRange.start + 1 }, (_, i) => timeRange.start + i);
                it.each(timeToTests)(`should return ${resultDescription} when remaining time is %s`, (time) => {
                    gameData.remainingTime = time;
                    expect(consumer.getCurrentVideoResult()).toEqual(expectedResult);
                });
            });
        });
    });

    describe("buildPayload", () => {
        it("should build payload with userBetPercentage and video result", async () => {
            // arrange
            const realPlayer = { id: "player1" };
            const basePayload = { some: "payload" };
            const playerBetCount = { home: ["111", "113"], away: ["112"] };
            const userBetPercentage = { home: 66, away: 34, draw: 0 };
            const videoResult = {
                firstHalfVideo: "video1.mp4",
                secondHalfVideo: "video2.mp4",
                firstHalfTimeline: [],
                secondHalfTimeline: [],
                firstHalf: "AH",
                secondHalf: "HA",
            };

            gameData.publishedTournament = {} as any;
            gameData.liveStreamServer = "server1";
            gameData.playerBetCount = playerBetCount;

            jest.spyOn(TableInGameConsumer.prototype, "buildPayload").mockResolvedValue(basePayload);
            jest.spyOn(consumer, "getCurrentVideoResult").mockReturnValue(videoResult);
            jest.spyOn(helper, "getUserBetPercentage").mockReturnValue(userBetPercentage);

            // act
            const result = await consumer.buildPayload(realPlayer);

            // assert
            expect(result).toEqual({
                ...basePayload,
                userBetPercentage,
                videoResult,
                liveStreamServer: "server1",
                tournament: {},
            });

            expect(helper.getUserBetPercentage).toHaveBeenCalledWith(playerBetCount);

            expect(consumer.getCurrentVideoResult).toHaveBeenCalled();
        });
    });
});
