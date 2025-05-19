import { betPercentage } from "../../../src/helpers";
import { BET_CHOICES } from "../../../src/constants";

describe("betPercentage", () => {
    describe("calculateUserBetPercentage", () => {
        const betChoices = ["home", "draw", "away"];

        it("should calculate the correct percentages for each choice of specific choices", () => {
            // Arrange
            const playerBetCount = {
                [BET_CHOICES.home]: ["player1", "player2"],
                [BET_CHOICES.away]: ["player3"],
                [BET_CHOICES.over]: ["player4"],
                [BET_CHOICES.under]: ["player5"],
            };

            // Act
            const result = betPercentage.calculatePlayerBetPercentage(playerBetCount, betChoices);

            // Assert
            expect(result[BET_CHOICES.home]).toBe(67);
            expect(result[BET_CHOICES.draw]).toBe(0);
            expect(result[BET_CHOICES.away]).toBe(33);
        });

        it("should handle empty playerBetCount", () => {
            // Arrange
            const playerBetCount = {};

            // Act
            const result = betPercentage.calculatePlayerBetPercentage(playerBetCount, betChoices);

            // Assert
            expect(result).toEqual({
                home: 0,
                draw: 0,
                away: 0,
            });
        });

        it("should handle zero total bets", () => {
            // Arrange
            const playerBetCount = {
                [BET_CHOICES.home]: [],
                [BET_CHOICES.away]: [],
            };

            // Act
            const result = betPercentage.calculatePlayerBetPercentage(playerBetCount, betChoices);

            // Assert
            expect(result[BET_CHOICES.home]).toBe(0);
            expect(result[BET_CHOICES.away]).toBe(0);
            expect(result[BET_CHOICES.draw]).toBe(0);
        });
    });

    describe("getUserBetPercentage", () => {
        it("should calculate percentages using default bet choices", () => {
            // Arrange
            const playerBetCount = {
                home: ["user1", "user2"],
                draw: ["user3"],
                away: ["user4", "user5", "user6"],
            };

            // Act
            const result = betPercentage.getUserBetPercentage(playerBetCount);

            // Assert
            expect(result).toEqual({
                home: 33,
                draw: 17,
                away: 50,
            });
        });

        it("should handle empty playerBetCount correctly", () => {
            // Arrange
            const playerBetCount = {};

            // Act
            const result = betPercentage.getUserBetPercentage(playerBetCount);

            // Assert
            expect(result).toEqual({
                home: 0,
                draw: 0,
                away: 0,
            });
        });

        it("should handle missing bet choices correctly", () => {
            // Arrange
            const playerBetCount = {
                home: ["user1"],
            };

            // Act
            const result = betPercentage.getUserBetPercentage(playerBetCount);

            // Assert
            expect(result).toEqual({
                home: 100,
                draw: 0,
                away: 0,
            });
        });
    });
});
