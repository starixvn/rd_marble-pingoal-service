import { TableProcessBetQueue } from "sc-game-base/src/table/crons";
import GameData from "../game-data";

type BetPayload = {
    amount: number;
    betChoice: string;
    roundId: number;
    clientSeed: Date;
    freeBet?: boolean;
    mode?: string;
};

export default class ProcessBetQueue extends TableProcessBetQueue {
    declare gameData: GameData;

    adjustTotalBets(player: any, bet: BetPayload, rate: number) {
        super.adjustTotalBets(player, bet, rate);
        this.adjustPlayerBetCount(player, bet.betChoice);
    }

    adjustPlayerBetCount(player: any, betChoice: string) {
        if (this.definition.choices.includes(betChoice)) {
            if (!this.gameData.playerBetCount[betChoice]) {
                this.gameData.playerBetCount[betChoice] = [];
            }
            !this.gameData.playerBetCount[betChoice].includes(player.UID) && this.gameData.playerBetCount[betChoice].push(player.UID);
        }
    }
}
