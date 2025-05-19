import { stub } from "jest-auto-stub";
import Bot from "../../../src/crons/bot";
import GameData from "../../../src/game-data";
import GameDefinition from "../../../src/game-definition";
import { gameManagementApiClientFactory, publisher, tempBetsRepository } from "../global-stubs";

describe("Bot", () => {
    let botInstance: Bot;

    const definition = stub<GameDefinition>({
        choices: ["choice1", "choice2"] as any,
    });
    const gameData = stub<GameData>({
        players: {},
        playerBetCount: {
            choice1: [],
            invalidChoice: [],
        },
    });

    beforeEach(() => {
        botInstance = new Bot(definition, gameData, publisher, gameManagementApiClientFactory, tempBetsRepository);
    });

    describe("updateBalanceAndPublishBetPayload", () => {
        it("should update the balance and call updatePlayerBetCount", () => {
            const botId = "bot1";
            const choice = "choice1";
            const amount = 100;
            const balance = 500;

            gameData.players[botId] = { red: 0 };

            const updatePlayerBetCountSpy = jest.spyOn(botInstance, "updatePlayerBetCount");
            const superUpdateSpy = jest.spyOn(botInstance, "updateBalanceAndPublishBetPayload");

            botInstance.updateBalanceAndPublishBetPayload(botId, choice, amount, balance);

            expect(gameData.players[botId].red).toBe(balance);
            expect(updatePlayerBetCountSpy).toHaveBeenCalledWith(botId, choice);
            expect(superUpdateSpy).toHaveBeenCalledWith(botId, choice, amount, balance);
        });
    });

    describe("updatePlayerBetCount", () => {
        it("should update player bet count for a valid choice", () => {
            const playerId = "player1";
            const choice = "choice1";

            botInstance.updatePlayerBetCount(playerId, choice);

            expect(gameData.playerBetCount[choice]).toContain(playerId);
        });

        it("should not update player bet count for an invalid choice", () => {
            const playerId = "player1";
            const choice = "invalidChoice";

            botInstance.updatePlayerBetCount(playerId, choice);

            expect(gameData.playerBetCount[choice]).toEqual([]);
        });

        it("should initialize playerBetCount array if it doesn't exist", () => {
            const playerId = "player1";
            const choice = "choice2";

            delete gameData.playerBetCount[choice];

            botInstance.updatePlayerBetCount(playerId, choice);

            expect(gameData.playerBetCount[choice]).toEqual([playerId]);
        });

        it("should not add duplicate player IDs to playerBetCount", () => {
            const playerId = "player1";
            const choice = "choice1";

            gameData.playerBetCount[choice] = [playerId];

            botInstance.updatePlayerBetCount(playerId, choice);

            expect(gameData.playerBetCount[choice]).toEqual([playerId]);
            expect(gameData.playerBetCount[choice].length).toBe(1);
        });
    });
});
