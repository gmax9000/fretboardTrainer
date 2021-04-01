// svg element
const svgns = "http://www.w3.org/2000/svg"
const svg = document.querySelector("svg");

// defs element
const defs = document.createElementNS(svgns, "defs");
svg.appendChild(defs);

// basic data structure for the fretboard
const gitScale = 3000
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
const nutWidth = 2*fretboard.fretWidth;

// creating the board
const board = document.createElementNS(svgns, 'rect');
board.setAttribute("x", "0");
board.setAttribute("y", "0");
board.setAttribute("width", fretboard.scale);
board.setAttribute("height", fretboard.width);
board.setAttribute("fill", fretboard.boardColor);
svg.appendChild(board);

// creating the nut
const nut = document.createElementNS(svgns, 'rect');
nut.setAttribute("x", "0");
nut.setAttribute("y", "0");
nut.setAttribute("width", nutWidth);
nut.setAttribute("height", fretboard.width);
nut.setAttribute("fill", "white");
svg.appendChild(nut);

// fretAsset definition
const fretAsset = document.createElementNS(svgns, 'line');
fretAsset.setAttribute("id", "fretAsset");
fretAsset.setAttribute("x1", "0");
fretAsset.setAttribute("y1", "0");
fretAsset.setAttribute("x2", "0");
fretAsset.setAttribute("y2", fretboard.width);
fretAsset.setAttribute("stroke", fretboard.fretColor);
fretAsset.setAttribute("stroke-width", fretboard.fretWidth);
defs.appendChild(fretAsset);

// dotAsset definition
const dotAsset = document.createElementNS(svgns, 'circle');
dotAsset.setAttribute("id", "dotAsset");
dotAsset.setAttribute("cx", "0");
dotAsset.setAttribute("cy", "0");
dotAsset.setAttribute("r", fretboard.fretWidth);
dotAsset.setAttribute("fill", "white");
defs.appendChild(dotAsset);

// doubleDotAsset definition
const doubleDotAsset = document.createElementNS(svgns, 'g');
doubleDotAsset.setAttribute("id", "doubleDotAsset");
// first dot
let oneDot = document.createElementNS(svgns, 'circle');
oneDot.setAttribute("cx", "0");
oneDot.setAttribute("cy", fretboard.width/3);
oneDot.setAttribute("r", fretboard.fretWidth);
oneDot.setAttribute("fill", "white");
doubleDotAsset.appendChild(oneDot);
defs.appendChild(doubleDotAsset);
// second dot
oneDot = document.createElementNS(svgns, 'circle');
oneDot.setAttribute("cx", "0");
oneDot.setAttribute("cy", fretboard.width*2/3);
oneDot.setAttribute("r", fretboard.fretWidth);
oneDot.setAttribute("fill", "white");
doubleDotAsset.appendChild(oneDot);

// stringAsset definition
const stringAsset = document.createElementNS(svgns, 'line');
stringAsset.setAttribute("id", "stringAsset");
stringAsset.setAttribute("x1", "0");
stringAsset.setAttribute("y1", "0");
stringAsset.setAttribute("x2", fretboard.scale);
stringAsset.setAttribute("y2", "0");
stringAsset.setAttribute("stroke", fretboard.stringColor);
defs.appendChild(stringAsset);

// create list of fret positions
const remainingScaleDivider = 17.871; // it's called the rule of 18
const fretPositions = [];
for (i = 0; i < fretboard.numOfFrets; i++) {
    fretPositions.push(
        (i === 0 ?
            (fretboard.scale / remainingScaleDivider) + nutWidth :
            fretPositions[i - 1] + ((fretboard.scale - fretPositions[i - 1]) / remainingScaleDivider)
        )
    );
}

// single dot positions (repeated after 12th fret)
const singleDotPos = [3, 5, 7, 9];

// place frets and dots in svg
for (i = 0; i < fretboard.numOfFrets; i++) {
    let fret = document.createElementNS(svgns, 'use');
    fret.setAttribute("x", fretPositions[i]);
    fret.setAttribute("y", "0");
    fret.setAttribute("href", "#fretAsset");
    fret.setAttribute("id", "fret" + (i + 1)); //can't override def attributes, do I need it?

    svg.appendChild(fret);

    // place single dots at 3 5 7 9 repeat from 12th
    if (singleDotPos.indexOf((i+1) % 12 ) !== -1) {
        let dot = document.createElementNS(svgns, 'use');
        dot.setAttribute("x", (fretPositions[i] + fretPositions[i-1]) / 2);
        dot.setAttribute("y", "50%");
        dot.setAttribute("href", "#dotAsset");
        dot.setAttribute("id", "dot" + (i + 1)); //can't override def attributes, do I need it?
        
        svg.appendChild(dot)
    }

    // place double dots at every 12th fret
    if ((i+1)%12 === 0) {
        let dot = document.createElementNS(svgns, 'use');
        dot.setAttribute("x", (fretPositions[i] + fretPositions[i-1]) / 2);
        dot.setAttribute("y", "0");
        dot.setAttribute("href", "#doubleDotAsset");
        dot.setAttribute("id", "dot" + (i + 1)); //can't override def attributes, do I need it?
        
        svg.appendChild(dot)
    }
}

// calculate string starting position and distance between strings
let stringPos = fretboard.width/12;
let stringDistance = (fretboard.width - (2 * stringPos)) / (fretboard.strings.length - 1);

// place strings
for (i = 0; i < fretboard.strings.length; i++) {
    let guitarString = document.createElementNS(svgns, 'use');
    guitarString.setAttribute("x", "0");
    guitarString.setAttribute("y", stringPos.toString());
    guitarString.setAttribute("href", "#stringAsset")
    guitarString.setAttribute("stroke-width", i + fretboard.fretWidth/1.5);
    guitarString.setAttribute("id", "string" + i);  //can't override def attributes, do I need it?

    svg.appendChild(guitarString);

    stringPos += stringDistance;
}

/**
 * place viewbox
 * 
 * the width of the graphic is the position of the last fret with some buffer
 * the height of the graphic is what is called the width of a guitar 
 */
const lastFretPosition = fretPositions[fretboard.numOfFrets - 1];
const lastFretViewBuffer = fretPositions[fretboard.numOfFrets - 1] - fretPositions[fretboard.numOfFrets - 2];
svg.setAttribute("viewBox", "0" + " 0 " + (lastFretPosition + lastFretViewBuffer) + " " + fretboard.width);