import { expect, test } from "@jest/globals";
import { notesOnString } from "../noteLogic.mjs";
import { numberToNote } from "../noteLogic.mjs";

describe('noteToNumber', () => {

    test("turns a number into a note", () => {
        expect(numberToNote(0)).toEqual("a");
    });

    test("turns a number into a note", () => {
        expect(numberToNote(11)).toEqual("g#");
    });

    test("turns a number into a note", () => {
        expect(numberToNote(12)).toEqual("a");
    });

    test("throws error in case of negative note number", () => {
        function negativeNote() {
            numberToNote(-1);
        }
        expect(negativeNote).toThrowError("Specified noteNumber is not positive!");
    });
});

describe("notesOnString", ()=>{
    test("returns all notes on a string", ()=>{
        const noteObject = {
            note: "e",
            accidental: false,
            octave: 4
        }
        expect(notesOnString(noteObject, 4)).toEqual(["e", "f", "f#", "g", "g#"]);
    })
})