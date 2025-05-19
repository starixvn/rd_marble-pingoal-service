import { TableGameConfigBot } from "sc-game-base/src/table/crons";
import GameData from "../game-data";

export default class Bot extends TableGameConfigBot {
    declare gameData: GameData;

    override updateBalanceAndPublishBetPayload(botId: string, choice: string, amount: number, balance: number) {
        super.updateBalanceAndPublishBetPayload(botId, choice, amount, balance);
        this.updatePlayerBetCount(botId, choice);
    }

    updatePlayerBetCount(playerId: string, choice: string) {
        if (this.definition.choices.includes(choice)) {
            if (!this.gameData.playerBetCount[choice]) {
                this.gameData.playerBetCount[choice] = [];
            }
            !this.gameData.playerBetCount[choice].includes(playerId) && this.gameData.playerBetCount[choice].push(playerId);
        }
    }
}
