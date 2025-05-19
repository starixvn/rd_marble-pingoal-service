import { RunningRoundInfoPublisher as RunningRoundInfoPublisherBase } from "sc-game-base/src/core/event-publishers";

import GameData from "../game-data";
import { getUserBetPercentage } from "../helpers/bet-percentage";

export default class RunningRoundInfoPublisher extends RunningRoundInfoPublisherBase {
    publish() {
        super.publish();

        this.publishBetPercentage();
    }

    publishBetPercentage() {
        const { playerBetCount } = this.gameData as GameData;
        const userBetPercentage = getUserBetPercentage(playerBetCount);

        const choices = Object.keys(playerBetCount);
        if (choices.some((choice) => playerBetCount[choice])) {
            this.publishToAllUsers({ userBetPercentage });
        }
    }
}
