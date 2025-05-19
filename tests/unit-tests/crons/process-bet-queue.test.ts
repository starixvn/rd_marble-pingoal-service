import { stub } from "jest-auto-stub";
import ProcessBetQueue from "../../../src/crons/process-bet-queue";
import GameData from "../../../src/game-data";
import GameDefinition from "../../../src/game-definition";
import {
    baseMetrics,
    betLogsRepository,
    betsRepository,
    gameManagementApiClientFactory,
    logService,
    placeBet,
    placeBetPublisher,
} from "../global-stubs";
import { TableProcessBetQueue } from "sc-game-base/src/table/crons";

describe("ProcessBetQueue", () => {
    let processBetQueue: ProcessBetQueue;
    let mockPlayer: any;
    let mockBet: any;
    let mockRate: number;

    beforeEach(() => {
        const gameData = stub<GameData>();
        const definition = stub<GameDefinition>({ choices: ["choice1", "choice2"] } as any);
        gameData.playerBetCount = {};
        processBetQueue = new ProcessBetQueue({
            definition,
            gameData,
            placeBetPublisher,
            placeBet,
            logService,
            betsRepository,
            betLogsRepository,
            gameManagementApiClientFactory,
            baseMetrics,
        });

        mockPlayer = { UID: "player1" };
        mockBet = { amount: 100, betChoice: "choice1", roundId: 1, clientSeed: new Date() };
        mockRate = 1.5;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("adjustTotalBets", () => {
        it("should call adjustPlayerBetCount with correct parameters", () => {
            // Arrange
            jest.spyOn(TableProcessBetQueue.prototype, "adjustTotalBets");
            const adjustPlayerBetCountSpy = jest.spyOn(processBetQueue, "adjustPlayerBetCount");

            // Act
            processBetQueue.adjustTotalBets(mockPlayer, mockBet, mockRate);

            // Assert
            expect(adjustPlayerBetCountSpy).toHaveBeenCalledWith(mockPlayer, mockBet.betChoice);
        });
    });

    describe("adjustPlayerBetCount", () => {
        it("should initialize playerBetCount array if not present", () => {
            // Arrange

            // Act
            processBetQueue.adjustPlayerBetCount(mockPlayer, mockBet.betChoice);

            // Assert
            expect(processBetQueue.gameData.playerBetCount[mockBet.betChoice]).toEqual([mockPlayer.UID]);
        });

        it("should add player UID to playerBetCount array if not already present", () => {
            // Arrange
            processBetQueue.gameData.playerBetCount[mockBet.betChoice] = [];

            // Act
            processBetQueue.adjustPlayerBetCount(mockPlayer, mockBet.betChoice);

            // Assert
            expect(processBetQueue.gameData.playerBetCount[mockBet.betChoice]).toContain(mockPlayer.UID);
        });

        it("should not add player UID to playerBetCount array if already present", () => {
            // Arrange
            processBetQueue.gameData.playerBetCount[mockBet.betChoice] = [mockPlayer.UID];

            // Act
            processBetQueue.adjustPlayerBetCount(mockPlayer, mockBet.betChoice);

            // Assert
            expect(processBetQueue.gameData.playerBetCount[mockBet.betChoice].length).toBe(1);
        });

        it("should not add player UID if betChoice is not in definition choices", () => {
            // Arrange

            // Act
            processBetQueue.adjustPlayerBetCount(mockPlayer, "invalidChoice");

            // Assert
            expect(processBetQueue.gameData.playerBetCount["invalidChoice"]).toBeUndefined();
        });
    });
});
