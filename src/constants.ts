export const BET_CHOICES = {
    home: "home",
    away: "away",
    draw: "draw",
    over: "over",
    under: "under",
    odd: "odd",
    even: "even",
};

export const DEFAULT_MARGIN = 0.02;

export const IS_DEV_ENV = process.env.NODE_ENV === "development";

export const POOL_SIZE = 10_000;

export const DEFAULT_NUMBER_OF_VIDEOS: Record<string, number> = {
    "0:0": 10,
    "1:0": 12,
    "0:1": 12,
    "1:1": 12,
    "2:0": 12,
    "0:2": 12,
    "2:1": 12,
    "1:2": 12,
    "3:0": 12,
    "0:3": 12,
    "2:2": 12,
    "3:1": 12,
    "1:3": 12,
    "4:0": 12,
    "0:4": 12,
};

export const DEFAULT_TOURNAMENT_CODES = {
    code: "UCL",
    teams: ["MCI", "RMA", "BAR", "LIV", "ARS", "FCB", "INT", "LEV", "AVL", "ATA", "BVB", "JUV", "PSG", "SLB", "ATM", "MIL"],
};
