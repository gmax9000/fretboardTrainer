import { expect, test } from "@jest/globals";
import { numberToNote } from "../noteLogic.mjs";

test("turns a number into a note", () => {
    expect(numberToNote(0)).toEqual("a");
    expect(numberToNote(11)).toEqual("g#");
    expect(numberToNote(12)).toEqual("a");
});

test("turns a number into a note", () => {
    expect(numberToNote(11)).toEqual("g#");
});

test("turns a number into a note", () => {
    expect(numberToNote(12)).toEqual("a");
});