import { BET_CHOICES } from "./constants";

export type OddsType = {
    [key in keyof typeof BET_CHOICES]: number;
} & { draw4: number };

export type HalfConfigType = {
    scoreRate: Record<string, number>;
};

export type MatchConfigType = {
    firstHalf: HalfConfigType;
    secondHalf: HalfConfigType;
    ou: number;
};

export const halfConfig: HalfConfigType = {
    scoreRate: {
        "0-0": 0.111,
        "1-0": 0.1142,
        "0-1": 0.1142,
        "1-1": 0.16,
        "2-0": 0.0741,
        "0-2": 0.0741,
        "2-1": 0.0648,
        "1-2": 0.0648,
        "3-0": 0.037,
        "0-3": 0.037,
        "2-2": 0.0558,
        "3-1": 0.0372,
        "1-3": 0.0372,
        "4-0": 0.0093,
        "0-4": 0.0093,
    },
};

export const matchConfig: MatchConfigType = {
    firstHalf: halfConfig,
    secondHalf: halfConfig,
    ou: 4.5,
};
