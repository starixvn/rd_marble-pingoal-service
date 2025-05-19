import GameCron from "../../../src/crons/game-cron";
import { Table } from "sc-game-base";
import { stub } from "jest-auto-stub";

import {
    bot,
    gameManagementApiClientFactory,
    gameStatusPublisher,
    provablyFairConsumer,
    roundIdConsumer,
    roundResultConsumer,
    runningRoundInfoPublisher,
    settleGameConsumer,
    unsettledRoundConsumer,
    logService,
    tournamentConsumer,
} from "../global-stubs";
import GameData from "../../../src/game-data";
import GameDefinition from "../../../src/game-definition";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import crypto from "crypto";
jest.mock("../../../src/timelines/video-timelines", () => ({
    "22841ea360fc3c3676a38502aa9a90a1ae1fbdac1d937746358efe559d349b6f_0": [],
    "53e5fe7054fb5c4867e0277e8867c0c08f9ca8be43fdac0d3b6c6ea5c7d656a2_AAAA": [1.8, 19.033333333333335, 33.8, 42.43333333333333],
    cc682a8a1c7d8184524fbb91f04e5ca13e5ea9500960e271f0343e0f18643043_AAAH: [3.8666666666666667, 18.066666666666666, 25.6, 34],
    "1cfbaffb0d00aa024775152621561732337e66109d8885f39612a44d2b99251a_AAA": [5.466666666666667, 19.466666666666665, 37.733333333333334],
    "0d24c9bd7c63dbab23c1f4d827509ee43a17100faeb3284555e60530fb1c1b7b_AAHA": [
        2.6333333333333333, 20.033333333333335, 26.2, 35.266666666666666,
    ],
    c20a85328513d3c79d6d66919175d0a1d112d0c6c660359e4731c444700c21f4_AAHH: [11.5, 26.166666666666668, 33.86666666666667, 41.56666666666667],
    "4b7c786db2cc35db7b37343c0290c083a548044106fecfd206454332ce0ddeea_AAH": [19.166666666666668, 26.9, 40.766666666666666],
    "7a67a3e74e83cbfd65185e1828aa09b85f76bad052538cd1f030f5af06ce2928_AA": [3.7333333333333334, 42],
    "4abd1b067acf617a255861fb3a5d8bb0838c89ec4eac1cc25538583568fdf985_AHAA": [
        2.566666666666667, 18.966666666666665, 29.133333333333333, 37,
    ],
    "7044e5388c3d625e1e95f46a9dfde0b4abc1eeeb7687e3c9e4ac58e13184ce04_AHAH": [2.7, 10.233333333333333, 19.3, 25.6],
    "01099e7f5e7bda327aebc9b027b70fa122c20f65d7eb30833051126580311f88_AHA": [18.333333333333332, 26.6, 35.7],
    "8e626c2af2d112ad3a7a8c0a09898bccde2bdb988ad789d38d1a8c0a51d6104d_AHHA": [
        5.966666666666667, 18.366666666666667, 24.933333333333334, 31.166666666666668,
    ],
    "79ce0aa56795de56ff40f2789f68276f4d3ad703a391b2d39bc780b15479a854_AHHH": [4.1, 10.5, 22.633333333333333, 39.46666666666667],
    "2bec7228ad358ad1e65496edd7a6607c8db04a9aaf80070d754f1de9b47da68b_AHH": [2.9, 11.833333333333334, 25.1],
    c89550cefa212faa7dd7421a06c28711434f6da5fc6093c4e19baaba29a4f960_AH: [13.133333333333333, 24.866666666666667],
    b4510afb170d8204b5ce6dc535770a39fbc66e1a65a8af2a22193b6d4104b49c_A: [37.46666666666667],
    "23b073f2deb8e68cd1e5879dae5e1bf54bb173e2f9646759df0243cf13e4cb94_HAAA": [5.4, 14.866666666666667, 24.9, 39.5],
    c64887d3730b5a52e96e39fb67972ca0f64e21da8aef0ba85517da0e3497584a_HAAH: [18.366666666666667, 27, 33.8, 40.2],
    ab4e46235565c9b63b6c1dae2367a318e6c2605a8645ca575cf0063417d23db3_HAA: [10.133333333333333, 18.9, 41.4],
    "3ff0610ea6b1620a3136fb41df7c2402e77fad6dfbecd88dc3493c3501ac82f7_HAHA": [4.1, 16.9, 25.7, 39.266666666666666],
    bb6e05bad5803753dbd34e8f1aad56e357437844955554b059ba90466a71a73d_HAHH: [5, 12.9, 26.166666666666668, 39.46666666666667],
    "4d29f01056b561efccf6a2bb54e4e5a02747b152d9b7736a1682a4fe81183e89_HAH": [10.866666666666667, 19.966666666666665, 29.5],
    a5ed9e3bdf040f0497132a2964bf16b6ddf17c2582882eb88e5d40bcc3a38e1b_HA: [28.5, 37.06666666666667],
    "847b2dc5fa761efd64fc6af330a8316ef7192457f1e19c29a384d336f3849bab_HHAA": [
        2.8333333333333335, 17.966666666666665, 32.46666666666667, 41.5,
    ],
    ae29dae888d7ac7670cd45e55e056857c13d6fb20bda2fc77dd11872b26864c8_HHAH: [6.3, 26.866666666666667, 33.06666666666667, 41.733333333333334],
    "09bbbfffb623070ce8d9e9ec474457e0a2994458f7178696a4d49a7d077ebef6_HHA": [19.2, 29.966666666666665, 39.86666666666667],
    "33a9416c68b765630961e6f43f980b492c91fbf0dc722a2223941cf3834aa220_HHHA": [
        18.166666666666668, 24.233333333333334, 32.5, 40.03333333333333,
    ],
    "529722ee2e00df1acf61aa94f8194ab24f98ce7325c571f4efda68e57e6a24d2_HHHH": [
        6.8, 12.566666666666666, 26.866666666666667, 36.266666666666666,
    ],
    c9bc635dd734e24c6ba8b47af4628a6b705945c68adbebbf393212376c99d365_HHH: [10.966666666666667, 30.466666666666665, 39.96666666666667],
    "6cd3e090b30fb5a3a3c2c0496d142afc678d8c02131f63b8aa8b60ed813ce8eb_HH": [11.2, 27],
    "4bba7d1cd4adb14007764406ba64b1da5720aeccddc5782940741ec477cd8b03_H": [22.366666666666667],
}));

// Add axios mock
jest.mock("axios");

describe("GameCron", () => {
    let gameCron: GameCron;

    const definition = stub<GameDefinition>();

    definition.durations = {
        wholeRound: 130,
        startingRound: 125,
        placingBets: 120,
        lockingBet: 93,
        streamingVideo: 90,
    } as any;

    beforeEach(() => {
        const gameData = stub<GameData>({
            disabled: false,
        });

        gameCron = new GameCron({
            definition,
            gameData,
            bot: bot as any,
            settleGameRoundConsumer: settleGameConsumer,
            gameStatusPublisher,
            runningRoundInfoPublisher,
            logService: logService as any,
            roundResultConsumer,
            resultsRepository: {} as any,
            appConfigs: {},
            gameManagementApiClientFactory,
            roundIdConsumer,
            provablyFairConsumer,
            unsettledRoundConsumer,
            tournamentConsumer,
        });

        gameCron.gameManagementApiClient = {
            notification: {
                getUmMessages: jest.fn(),
            },
        } as any;
    });

    afterEach(() => {
        jest.clearAllMocks();
        (axios.get as jest.Mock).mockReset();
    });

    describe("proceed", () => {
        it("should reset player bet count for new round", () => {
            // act
            gameCron.resetForNewRound();

            // assert
            expect(gameCron.gameData.playerBetCount).toEqual({});
        });

        it("should generate round data and reset settlement result from admin", async () => {
            // act
            await gameCron.generateRoundData();

            // assert
            expect(roundResultConsumer.generateResult).toHaveBeenCalled();
            expect(gameCron.gameData.settlementResultFromAdmin).toEqual({});
        });

        it("should proceed and handle game status check at the start of a new round", async () => {
            // arrange
            gameCron.gameData.remainingTime = definition.durations.wholeRound;
            jest.spyOn(gameCron, "checkGameStatus").mockImplementation(async () => {});

            // act
            await gameCron.proceed();

            // assert
            expect(gameCron.checkGameStatus).toHaveBeenCalled();
        });

        it("should decrement remaining time if game is not disabled", async () => {
            // arrange
            gameCron.gameData.remainingTime = 5;
            gameCron.gameData.disabled = false;

            // act
            await gameCron.proceed();

            // assert
            expect(gameCron.gameData.remainingTime).toBe(4);
        });

        it("should publish start placing bet status at the correct time", async () => {
            // arrange
            gameCron.gameData.remainingTime = definition.durations.placingBets + 1;

            // act
            await gameCron.proceed();

            // assert
            expect(gameStatusPublisher.publishStartPlacingBetStatus).toHaveBeenCalled();
        });

        it("should publish end placing bet status locking bet time", async () => {
            // arrange
            gameCron.gameData.remainingTime = definition.durations.lockingBet;

            // act
            await gameCron.proceed();

            // assert
            expect(gameStatusPublisher.publishEndPlacingBetStatus).toHaveBeenCalled();
        });

        it("should call getVideoTimeline at the correct time", async () => {
            // arrange
            gameCron.gameData.remainingTime = definition.durations.streamingVideo + 1;
            jest.spyOn(gameCron, "getVideoTimeline").mockResolvedValue();

            // act
            await gameCron.proceed();

            // assert
            expect(gameCron.getVideoTimeline).toHaveBeenCalled();
        });

        it("should call publishVideoStream at the correct time", async () => {
            // arrange
            gameCron.gameData.remainingTime = definition.durations.streamingVideo + 1;
            jest.spyOn(gameCron, "publishVideoStream");
            jest.spyOn(gameCron, "getVideoTimeline").mockResolvedValue();

            // act
            await gameCron.proceed();

            // assert
            expect(gameCron.publishVideoStream).toHaveBeenCalled();
        });

        it("should publish video stream at the correct time", async () => {
            // arrange
            gameCron.gameData.remainingTime = definition.durations.streamingVideo + 1;
            gameCron.gameData.result = {
                firstHalfVideo: "http://marble-football/watch?v=HH",
                secondHalfVideo: "http://marble-football/watch?v=AA",
                firstHalfTimeline: [1, 2, 3],
                secondHalfTimeline: [4, 5, 6],
            } as any;

            jest.spyOn(gameCron, "getVideoTimeline").mockResolvedValue();

            // act
            await gameCron.proceed();

            // assert
            expect(runningRoundInfoPublisher.publishToAllUsers).toHaveBeenCalledWith({
                videoResult: {
                    firstHalfVideo: "http://marble-football/watch?v=HH",
                    secondHalfVideo: "http://marble-football/watch?v=AA",
                    firstHalfTimeline: [1, 2, 3],
                    secondHalfTimeline: [4, 5, 6],
                },
            });
        });

        it("should publish tournament at the correct time", async () => {
            // arrange
            gameCron.gameData.remainingTime = definition.durations.startingRound + 1;

            (tournamentConsumer.getCurrentTournament as any).mockResolvedValue("fake tournament");

            // act
            await gameCron.proceed();

            // assert
            expect(runningRoundInfoPublisher.publishToAllUsers).toHaveBeenCalledWith({ tournament: "fake tournament" });
        });

        describe("when the remaining time is less than 0", () => {
            it("should reset remaining time", async () => {
                // arrange
                gameCron.gameData.remainingTime = -1;
                (definition.settle as jest.Mock).mockReturnValue({ draw: false });

                // act
                await gameCron.proceed();

                // assert
                expect(gameCron.gameData.remainingTime).toBe(definition.durations.wholeRound);
            });

            it("should settle round", async () => {
                // arrange
                gameCron.gameData.remainingTime = -1;
                (definition.settle as jest.Mock).mockReturnValue({ draw: false });

                // act
                await gameCron.proceed();

                // assert
                expect(settleGameConsumer.settleRound).toHaveBeenCalled();
            });
        });

        it("should run bot and publish running round info during bet time", async () => {
            // arrange
            gameCron.gameData.remainingTime = 100;

            // act
            await gameCron.proceed();

            // assert
            expect(bot.run).toHaveBeenCalled();
            expect(runningRoundInfoPublisher.publish).toHaveBeenCalled();
        });

        it("should not decrement remaining time if game is disabled", async () => {
            // arrange
            gameCron.gameData.remainingTime = 5;
            gameCron.gameData.disabled = true;

            // act
            await gameCron.proceed();

            // assert
            expect(gameCron.gameData.remainingTime).toBe(5);
        });

        it("should not run bot if remaining time is not during bet time", async () => {
            // arrange
            gameCron.gameData.remainingTime = 6;

            // act
            await gameCron.proceed();

            // assert
            expect(bot.run).not.toHaveBeenCalled();
        });

        it("should not publish running round info if remaining time is not during bet time", async () => {
            // arrange
            gameCron.gameData.remainingTime = 6;

            // act
            await gameCron.proceed();

            // assert
            expect(runningRoundInfoPublisher.publish).not.toHaveBeenCalled();
        });
    });

    describe("getVideoTimelineForHalf", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should fetch timeline with proxy when enabled", async () => {
            // Arrange
            const videoName = "test-video";
            const mockTimeline = [1, 2, 3];
            gameCron.appConfigs = {
                liveStreamServer: "http://example.com/",
                proxyServer: {
                    enabled: true,
                    url: "http://proxy.com",
                },
            } as any;

            (axios.get as jest.Mock).mockResolvedValue({ data: { timeLine: mockTimeline } });

            // Act
            const result = await gameCron.getVideoTimelineForHalf(videoName);

            // Assert
            expect(axios.get).toHaveBeenCalledWith("http://example.com/test-video.json", { httpsAgent: expect.any(HttpsProxyAgent) });
            expect(result).toEqual(mockTimeline);
        });

        it("should fetch timeline without proxy when disabled", async () => {
            // Arrange
            const videoName = "test-video";
            const mockTimeline = [1, 2, 3];
            gameCron.appConfigs = {
                liveStreamServer: "http://example.com/",
                proxyServer: {
                    enabled: false,
                },
            } as any;

            (axios.get as jest.Mock).mockResolvedValue({ data: { timeLine: mockTimeline } });

            // Act
            const result = await gameCron.getVideoTimelineForHalf(videoName);

            // Assert
            expect(axios.get).toHaveBeenCalledWith("http://example.com/test-video.json", { httpsAgent: undefined });
            expect(result).toEqual(mockTimeline);
        });

        it("should handle and log errors when the request fails", async () => {
            // Arrange
            const videoName = "test-video";
            const mockError = new Error("Network error");
            gameCron.appConfigs = {
                liveStreamServer: "http://example.com/",
                proxyServer: { enabled: false },
            } as any;
            gameCron.gameData.roundId = 123;

            (axios.get as jest.Mock).mockRejectedValue(mockError);

            // Act & Assert
            await expect(gameCron.getVideoTimelineForHalf(videoName)).rejects.toThrow(mockError);
            expect(logService.logError).toHaveBeenCalledWith(
                "In match 123, failed to get video timeline http://example.com/test-video.json with error: Error: Network error"
            );
        });
    });

    describe("queryLastResult", () => {
        let superQueryLastResultSpy: any;

        beforeEach(() => {
            superQueryLastResultSpy = jest.spyOn(Table.Crons.TableGameCron.prototype, "queryLastResult").mockImplementation();
        });

        it("should call super.queryLastResult", async () => {
            // Act
            await gameCron.queryLastResult();

            // Assert
            expect(superQueryLastResultSpy).toHaveBeenCalled();
        });

        it("should set publishedTournament", async () => {
            // Arrange
            (tournamentConsumer.getLastTournament as any).mockResolvedValue("fake tournament");

            // Act
            await gameCron.queryLastResult();

            // Assert
            expect(gameCron.gameData.publishedTournament).toEqual("fake tournament");
        });
    });

    describe("getVideoTimeline", () => {
        it("should correctly set firstHalfTimeline and secondHalfTimeline properties in gameData.result", async () => {
            // Arrange
            const mockFirstHalfTimeline = [
                { time: 0, event: "start" },
                { time: 10, event: "goal" },
            ];
            const mockSecondHalfTimeline = [
                { time: 0, event: "start" },
                { time: 15, event: "goal" },
            ];
            gameCron.gameData.result = {
                firstHalfVideo: "first-half-video",
                secondHalfVideo: "second-half-video",
            } as any;
            jest.spyOn(gameCron, "getVideoTimelineForHalf")
                .mockResolvedValueOnce(mockFirstHalfTimeline)
                .mockResolvedValueOnce(mockSecondHalfTimeline);

            // Act
            await gameCron.getVideoTimeline();

            // Assert
            expect(gameCron.getVideoTimelineForHalf).toHaveBeenCalledTimes(2);
            expect(gameCron.getVideoTimelineForHalf).toHaveBeenCalledWith("first-half-video");
            expect(gameCron.getVideoTimelineForHalf).toHaveBeenCalledWith("second-half-video");
            expect(gameCron.gameData.result.firstHalfTimeline).toEqual(mockFirstHalfTimeline);
            expect(gameCron.gameData.result.secondHalfTimeline).toEqual(mockSecondHalfTimeline);
        });

        it("should use default timeline when video timeline fetch fails", async () => {
            // Arrange
            const mockTimeline = [7, 8, 9];
            gameCron.gameData.result = {
                firstHalf: "HAA",
                secondHalf: "AHH",
            } as any;
            jest.spyOn(gameCron, "getVideoTimelineForHalf")
                .mockRejectedValueOnce(new Error("Network error"))
                .mockRejectedValueOnce(new Error("Network error"));

            jest.spyOn(gameCron, "getDefaultVideoTimeline").mockReturnValue(mockTimeline);

            // Act
            await gameCron.getVideoTimeline();

            // Assert
            expect(gameCron.gameData.result.firstHalfTimeline).toEqual(mockTimeline);
            expect(gameCron.gameData.result.secondHalfTimeline).toEqual(mockTimeline);
        });

        it("should use default timeline for first half when only first half fetch fails", async () => {
            // Arrange
            const mockTimeline = [7, 8, 9];
            gameCron.gameData.result = {
                firstHalf: "HAA",
                secondHalf: "AHH",
            } as any;

            jest.spyOn(gameCron, "getVideoTimelineForHalf")
                .mockRejectedValueOnce(new Error("Network error"))
                .mockResolvedValueOnce(mockTimeline);

            jest.spyOn(gameCron, "getDefaultVideoTimeline").mockReturnValue(mockTimeline);

            // Act
            await gameCron.getVideoTimeline();

            // Assert
            expect(gameCron.getDefaultVideoTimeline).toHaveBeenCalledWith("HAA", true);
            expect(gameCron.gameData.result.secondHalfTimeline).toEqual(mockTimeline);
        });
    });

    describe("getDefaultVideoTimeline", () => {
        it("should return correct default timeline for first half", () => {
            // Arrange
            const videoName = crypto.createHash("sha256").update(`HAA-0`).digest("hex");

            // Act
            const videoTimeline = gameCron.getDefaultVideoTimeline("HAA", true);

            // Assert
            expect(gameCron.gameData.result.firstHalfVideo).toEqual(videoName);
            expect(videoTimeline).toEqual([10.133333333333333, 18.9, 41.4]);
        });

        it("should return correct default timeline for second half", () => {
            // Arrange
            const videoName = crypto.createHash("sha256").update(`AAH-0`).digest("hex");

            // Act
            const videoTimeline = gameCron.getDefaultVideoTimeline("AAH", false);

            // Assert
            expect(gameCron.gameData.result.secondHalfVideo).toEqual(videoName);
            expect(videoTimeline).toEqual([19.166666666666668, 26.9, 40.766666666666666]);
        });
    });
});
