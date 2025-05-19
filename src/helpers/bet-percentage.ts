import { BET_CHOICES } from "../constants";

export const calculatePlayerBetPercentage = (playerBetCount: Record<string, string[]>, betChoices: string[]): Record<string, number> => {
    const total = betChoices.reduce((t, choice) => t + (playerBetCount[choice]?.length || 0), 0);

    return betChoices.reduce((result, choice) => {
        result[choice] = total > 0 && playerBetCount[choice] ? Math.round((playerBetCount[choice].length * 100) / total) : 0;
        return result;
    }, {} as Record<string, number>);
};

export const getUserBetPercentage = (playerBetCount: Record<string, string[]>) => {
    return calculatePlayerBetPercentage(playerBetCount, [BET_CHOICES.home, BET_CHOICES.draw, BET_CHOICES.away]);
};
