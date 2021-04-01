// basic data structure for the fretboard
const gitScale = 1500
const fretboard = {
    boardColor: "brown",
    fretColor: "darkgoldenrod",
    stringColor: "grey",
    scale: gitScale,
    width: gitScale / 10,
    numOfFrets: 24,
    fretWidth: gitScale/300,
    strings: [
        {
            note: "e",
            accidental: false,
            octave: 4
        },
        {
            note: "b",
            accidental: false,
            octave: 3
        },
        {
            note: "g",
            accidental: false,
            octave: 3
        },
        {
            note: "d",
            accidental: false,
            octave: 3
        },
        {
            note: "a",
            accidental: false,
            octave: 2
        },
        {
            note: "e",
            accidental: false,
            octave: 2
        },
    ]
};

// svg preparation
const svgns = "http://www.w3.org/2000/svg"
const svg = document.querySelector("svg");

// defs element
const defs = document.createElementNS(svgns, "defs");
svg.appendChild(defs);

// creating the board
const board = document.createElementNS(svgns, 'rect');
board.setAttribute("x", "0");
board.setAttribute("y", "0");
board.setAttribute("width", fretboard.scale);
board.setAttribute("height", fretboard.width);
board.setAttribute("fill", fretboard.boardColor);
svg.appendChild(board);

// fretAsset definition
const fretAsset = document.createElementNS(svgns, 'rect');
fretAsset.setAttribute("x", "0");
fretAsset.setAttribute("y", "0");
fretAsset.setAttribute("width", fretboard.fretWidth);
fretAsset.setAttribute("height", fretboard.width);
fretAsset.setAttribute("fill", fretboard.fretColor);
fretAsset.setAttribute("id", "fretAsset"); // not working, need to check if necessary
defs.appendChild(fretAsset);

// dotAsset definition
const dotAsset = document.createElementNS(svgns, 'circle');
dotAsset.setAttribute("cx", "0");
dotAsset.setAttribute("cy", "0");
dotAsset.setAttribute("r", fretboard.fretWidth);
dotAsset.setAttribute("fill", "white");
dotAsset.setAttribute("id", "dotAsset"); // not working, need to check if necessary
defs.appendChild(dotAsset);

// create list of fret positions
const fretDivider = 18;
const fretPositions = [];
for (i = 0; i < fretboard.numOfFrets; i++) {
    fretPositions.push(
        (i === 0 ?
            fretboard.scale / fretDivider :
            fretPositions[i - 1] + ((fretboard.scale - fretPositions[i - 1]) / fretDivider)
        )
    );
}

// single dot positions
const singleDotPos = [3, 5, 7, 9];

//let fret;
for (i = 0; i < fretboard.numOfFrets; i++) {
    let fret = document.createElementNS(svgns, 'use');
    fret.setAttribute("x", fretPositions[i] - fretboard.fretWidth / 2);
    fret.setAttribute("y", "0");
    fret.setAttribute("href", "#fretAsset");
    fret.setAttribute("id", "fret" + (i + 1));

    svg.appendChild(fret);

    // if (singleDotPos.indexOf(i+1) !== -1) {
    //     singleDots.push(document.createElementNS(svgns, 'circle'));
    //     singleDots[].setAttribute("cx", ((Number(frets[i - 1].getAttribute("x")) + fretPos) / 2).toString());
    //     singleDots[].setAttribute("cy", fretboard.width / 2);
    //     singleDots[].setAttribute("r", "5");
    //     singleDots[].setAttribute("fill", "white");
    //     singleDots[].setAttribute("id", "circle" + i);
    // }
}

/**
 * the width of the graphic is the position of the last fret with some buffer
 * the height of the graphic is what is called the width of a guitar 
 */
const lastFretPosition = fretPositions[fretboard.numOfFrets - 1];
const lastFretViewBuffer = 15;
const nutWidth = 20;
svg.setAttribute("viewBox", -nutWidth + " 0 " + (lastFretPosition + lastFretViewBuffer) + " " + fretboard.width);

let stringPos = 5;
let stringDistance = (fretboard.width - (2 * stringPos)) / (fretboard.strings.length - 1);
const strings = [];

for (i = 0; i < fretboard.strings.length; i++) {
    strings.push(document.createElementNS(svgns, 'rect'));
    strings[i].setAttribute("x", -nutWidth);
    strings[i].setAttribute("y", stringPos.toString());
    strings[i].setAttribute("width", fretboard.scale);
    strings[i].setAttribute("height", "5");
    strings[i].setAttribute("fill", fretboard.stringColor);
    strings[i].setAttribute("id", "string" + i);

    svg.appendChild(strings[i]);

    stringPos += stringDistance;
}

