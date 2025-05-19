import { TableGameData } from "sc-game-base/src/table";
import { ResultType } from "./models/rounds";
import { ITournament } from "./models/tournaments";
import { GameConfigs } from "sc-game-base/src/core/game-data";
import { DEFAULT_TOURNAMENT_CODES } from "./constants";

export default class GameData extends TableGameData {
    declare realPlayers: { [playerId: string]: RealPlayer };
    declare result: ResultType;
    declare gameConfigs: GameConfigs & { tournamentConfig: typeof DEFAULT_TOURNAMENT_CODES; videoStreamConfig: VideoStreamConfig };

    constructor(remainingTime: number) {
        super(remainingTime);
        this.playerBetCount = {};
    }
    playerBetCount: Record<string, string[]> = {};
    liveStreamServer = "";
    tournament = {} as ITournament;
    publishedTournament = {} as ITournament;
}

export type RealPlayer = {
    UID: string;
    profile: { name: string; minBet: number; maxBet: number };
    session: any;
    socketClient: any;
};

type VideoStreamConfig = {
    videoInfos: VideoInfo[];
};

type VideoInfo = {
    videoName: string;
    numberOfVideos: number;
};
