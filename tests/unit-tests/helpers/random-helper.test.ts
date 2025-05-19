import { randomHelper } from "../../../src/helpers";

describe("randomHelper", () => {
    describe("getRandomIndexFromArray", () => {
        const testModes = [1, 2, 3];
        const arrayLength = 1000;
        const iterations = 100_000;

        testModes.forEach((mode) => {
            describe(`mode ${mode}`, () => {
                it("should return a random index within the given range", () => {
                    const resultArr = Array.from({ length: iterations }, () => randomHelper.getRandomIndexFromArray(mode, arrayLength));

                    expect(resultArr.every((num) => num >= 0 && num < arrayLength)).toBe(true);
                    expect(resultArr.filter((num) => num === arrayLength).length).toBe(0);
                    expect(resultArr.filter((num) => num === 0).length).toBeGreaterThan(0);
                    expect(resultArr.filter((num) => num === arrayLength - 1).length).toBeGreaterThan(0);
                });
            });
        });
    });
});
