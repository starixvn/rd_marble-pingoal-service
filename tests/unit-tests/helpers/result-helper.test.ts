import { resultHelper } from "../../../src/helpers";
import { HalfConfigType } from "../../../src/match-configs";
import { ResultType } from "../../../src/models/rounds";
import crypto from "crypto";

jest.mock("chance", () => {
    return function () {
        return {
            integer: jest.fn().mockReturnValue(1),
            bool: jest.fn().mockReturnValue(true),
            weighted: jest.fn().mockImplementation((arr) => arr[0]),
        };
    };
});

jest.mock("../../../src/helpers/shuffle", () => ({
    shuffle: jest.fn((array) => array),
}));

jest.mock("../../../src/helpers/random-helper", () => ({
    getRandomIndexFromArray: jest.fn().mockReturnValue(0),
}));

jest.mock("../../../src/constants", () => ({
    DEFAULT_NUMBER_OF_VIDEOS: {},
    POOL_SIZE: 10_000,
}));

const NUMBER_OF_VIDEOS = {
    HAA: 1,
    AHH: 2,
};