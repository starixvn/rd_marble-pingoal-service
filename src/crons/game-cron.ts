import { Table } from "sc-game-base";
import GameData from "../game-data";
import GameDefinition from "../game-definition";
import AppConfigs from "../app-configs";
import { TournamentConsumer } from "../consumers";
import { HttpsProxyAgent } from "https-proxy-agent";
import axios from "axios";
import { retry } from "../helpers";
import { generateVideoName } from "../helpers/result-helper";
import defaultVideoTimelines from "../timelines/video-timelines";
import Chance from "chance";

export default class GameCron extends Table.Crons.TableGameCron {
    declare gameData: GameData;
    declare definition: GameDefinition;
    declare appConfigs: typeof AppConfigs;

    tournamentConsumer: TournamentConsumer;

    constructor(container: any) {
        super(container);

        this.gameData.liveStreamServer = this.appConfigs.liveStreamServer;
        this.tournamentConsumer = container.tournamentConsumer;
    }

    async queryLastResult() {
        await super.queryLastResult();
        const lastTournament = await this.tournamentConsumer.getLastTournament();
        this.gameData.publishedTournament = lastTournament;
    }

    override resetForNewRound() {
        super.resetForNewRound();
        this.gameData.playerBetCount = {};
    }

    async getVideoTimelineForHalf(videoName: string) {
        const url = new URL(`${videoName}.json`, this.appConfigs.liveStreamServer);

        const agent = this.appConfigs.proxyServer.enabled ? new HttpsProxyAgent(this.appConfigs.proxyServer.url) : undefined;

        try {
            const response = await axios.get(url.toString(), { httpsAgent: agent });

            return response.data.timeLine;
        } catch (error) {
            this.logService.logError(`In match ${this.gameData.roundId}, failed to get video timeline ${url} with error: ${error}`);
            throw error;
        }
    }

    async getVideoTimeline() {
        const delay = 100;
        const retries = 3;

        try {
            const [videoTimeline] = await Promise.all([
                retry(() => this.getVideoTimelineForHalf(this.gameData.result.videoName), retries, delay).catch((error) => {
                    this.logService.logError(`In match ${this.gameData.roundId}, failed to fetch video timeline: ${error}`);
                    return this.getDefaultVideoTimeline(this.gameData.result.videoName);
                })
            ]);

            this.gameData.result.videoTimeline = videoTimeline;

        } catch (error) {
            this.logService.logError(`Unexpected error fetching video timelines: ${error}`);
            this.gameData.result.videoTimeline = this.getDefaultVideoTimeline(this.gameData.result.videoName);
        }
    }

    getDefaultVideoTimeline(result: string) {
        const videoName = generateVideoName(result, {}, true);

        this.gameData.result.videoName = videoName;

        const videoTimeline = (defaultVideoTimelines as any)[`${videoName}_${result}`];

        this.logService.logWarning(`Get default video timeline for ${videoName}_${result}: ${videoTimeline}`);
        return videoTimeline;
    }

    async generateRoundData() {
        await this.roundResultConsumer.generateResult();

        this.gameData.settlementResultFromAdmin = {};
    }

    publishVideoStream() {
        const videoResult = {
            videoName: this.gameData.result.videoName,
            videoTimeline: this.gameData.result.videoTimeline,
            events: this.gameData.result.events,
        };

        this.runningRoundInfoPublisher.publishToAllUsers({ videoResult });
    }

    async publishTournament() {
        const tournament = await this.tournamentConsumer.getCurrentTournament();

        this.gameData.publishedTournament = JSON.parse(JSON.stringify(tournament));

        this.runningRoundInfoPublisher.publishToAllUsers({ tournament });
    }

    override async proceed() {
        const { durations } = this.definition;

        if (this.gameData.remainingTime === durations.wholeRound) {
            await this.checkGameStatus();
        }

        if (!this.gameData.disabled) {
            this.gameData.remainingTime--;
        }

        const remainingTime = this.gameData.remainingTime;
        console.log(`remainingTime: `, remainingTime);

        if (remainingTime === durations.startingRound) {
            await this.publishTournament();
        }

        if (this.isStartingTime(remainingTime, durations)) {
            this.resetForNewRound();
            this.bot?.reset();

            await this.generateRoundData();
            this.calculateStreamGap();
            await this.getVideoTimeline();
        }

        if (remainingTime === durations.placingBets) {
            this.gameStatusPublisher.publishStartPlacingBetStatus();
        }

        if (remainingTime === durations.lockingBet - 1) {
            this.gameStatusPublisher.publishEndPlacingBetStatus();
        }

        if (remainingTime === durations.streamingVideo) {
            this.publishVideoStream();
            this.syncRemainingTimeWithVideoLength();
        }

        if (remainingTime < 0) {
            this.gameData.remainingTime = durations.wholeRound;

            await this.settleGameRoundConsumer.settleRound();
        }

        if (this.isDuringBetTime(remainingTime)) {
            this.bot && (await this.bot.run());
            this.runningRoundInfoPublisher.publish();
        }
    }

    isDuringBetTime(remainingTime: number) {
        const { placingBets, lockingBet } = this.definition.durations;

        return remainingTime < placingBets && remainingTime > lockingBet;
    }

    private calculateStreamGap() {
        console.log('max video length', this.definition.maxVideoLength);
        const videoLength = this.getRandomVideoDuration();
        console.log(`videoLength: ${videoLength}`);
        this.gameData.streamGap = this.definition.maxVideoLength - videoLength;
        console.log(`stream gap ${this.gameData.streamGap}`);
    }

    private syncRemainingTimeWithVideoLength() {
        console.log(`remaining time synce with video timeline`);
        this.gameData.remainingTime -= this.gameData.streamGap;
    }

    private getRandomVideoDuration() {
        return new Chance().integer({ min: 30, max: this.definition.maxVideoLength });
    }
}