// svg element
const svgns = "http://www.w3.org/2000/svg"
const svg = document.querySelector("svg");

// defs element
const defs = document.createElementNS(svgns, "defs");
svg.appendChild(defs);

// basic data structure for the fretboard
const gitScale = 1000
const fretboard = {
    boardColor: "brown",
    fretColor: "darkgoldenrod",
    stringColor: "grey",

    scale: gitScale,
    width: gitScale / 10,
    numOfFrets: 24,
    fretWidth: gitScale / 300,
    nutWidth: gitScale / 150,

    // single dot positions (repeated after 12th fret)
    singleDotPos: [3, 5, 7, 9],
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

// creating the board
const board = document.createElementNS(svgns, 'rect');
board.setAttribute("x", "0");
board.setAttribute("y", "0");
board.setAttribute("width", fretboard.scale);
board.setAttribute("height", fretboard.width);
board.setAttribute("fill", fretboard.boardColor);
board.setAttribute("id", "board");
svg.appendChild(board);

// creating the nut
const nut = document.createElementNS(svgns, 'rect');
nut.setAttribute("x", "0");
nut.setAttribute("y", "0");
nut.setAttribute("width", fretboard.nutWidth);
nut.setAttribute("height", fretboard.width);
nut.setAttribute("fill", "white");
nut.setAttribute("id", "nut");
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
defs.appendChild(dotAsset);

// doubleDotAsset definition
const doubleDotAsset = document.createElementNS(svgns, 'g');
doubleDotAsset.setAttribute("id", "doubleDotAsset");
// first dot
let oneDot = document.createElementNS(svgns, 'circle');
oneDot.setAttribute("cx", "0");
oneDot.setAttribute("cy", fretboard.width / 3);
oneDot.setAttribute("r", fretboard.fretWidth);
oneDot.setAttribute("fill", "white");
doubleDotAsset.appendChild(oneDot);
defs.appendChild(doubleDotAsset);
// second dot
oneDot = document.createElementNS(svgns, 'circle');
oneDot.setAttribute("cx", "0");
oneDot.setAttribute("cy", fretboard.width * 2 / 3);
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

// takes a guitar and returns an array of fret positions
function calculateFretPositions(guitar) {
    const remainingScaleDivider = 17.871; // it's called the rule of 18
    const fretPositions = [];
    for (i = 0; i < guitar.numOfFrets; i++) {
        if (i === 0) {
            fretPositions.push((guitar.scale / remainingScaleDivider) + fretboard.nutWidth);
        } else {
            fretPositions.push(fretPositions[i - 1] + ((guitar.scale - fretPositions[i - 1]) / remainingScaleDivider));
        }
    }
    return fretPositions;
}

const fretPositions = calculateFretPositions(fretboard);

// takes an array of fret positions and returns an array of fret centers
function calculateFretCenterX(fretPositions) {
    const fretCenters = [];
    for (i = 0; i < fretPositions.length; i++) {
        if (i === 0) {
            fretCenters.push(fretPositions[i] / 2);
        } else {
            fretCenters.push((fretPositions[i] + fretPositions[i - 1]) / 2);
        }
    }
    return fretCenters;
}
const fretCenters = calculateFretCenterX(fretPositions);

// place frets and dots in svg
for (i = 0; i < fretboard.numOfFrets; i++) {
    let fret = document.createElementNS(svgns, 'use');
    fret.setAttribute("x", fretPositions[i]);
    fret.setAttribute("y", "0");
    fret.setAttribute("href", "#fretAsset");
    fret.setAttribute("id", "fret" + (i + 1)); //can't override def attributes, do I need it?

    svg.appendChild(fret);

    // place single dots at 3 5 7 9 repeat from 12th
    if (fretboard.singleDotPos.indexOf((i + 1) % 12) !== -1) {
        let dot = document.createElementNS(svgns, 'use');
        dot.setAttribute("x", fretCenters[i]);
        dot.setAttribute("y", "50%");
        dot.setAttribute("fill", "white");
        dot.setAttribute("href", "#dotAsset");
        dot.setAttribute("id", "dotAtFret_" + (i + 1)); //can't override def attributes, do I need it?

        svg.appendChild(dot)
    }

    // place double dots at every 12th fret
    if ((i + 1) % 12 === 0) {
        let dot = document.createElementNS(svgns, 'use');
        dot.setAttribute("x", fretCenters[i]);
        dot.setAttribute("y", "0");
        dot.setAttribute("href", "#doubleDotAsset");
        dot.setAttribute("id", "dotsAtFret_" + (i + 1)); //can't override def attributes, do I need it?

        svg.appendChild(dot)
    }
}

// calculate string starting position and distance between strings

function calculateStringPositions(guitar) {
    const positions = [guitar.width / 12];
    const stringDistance = (guitar.width - (2 * positions[0])) / (guitar.strings.length - 1); // TODO: check against div by zero
    for (i = 1; i < guitar.strings.length; i++) {
        positions.push(positions[i - 1] + stringDistance);
    };
    return positions;
}
const stringPositions = calculateStringPositions(fretboard);

// place strings
for (i = 0; i < fretboard.strings.length; i++) {
    let guitarString = document.createElementNS(svgns, 'use');
    guitarString.setAttribute("x", "0");
    guitarString.setAttribute("y", stringPositions[i]);
    guitarString.setAttribute("href", "#stringAsset")
    guitarString.setAttribute("stroke-width", i*(fretboard.fretWidth / 10) + (fretboard.fretWidth * 2 / 3));
    guitarString.setAttribute("id", "string" + i);  //can't override def attributes, do I need it?

    svg.appendChild(guitarString);
}

for (i = 0; i < stringPositions.length; i++) {
    for (j = 0; j < fretPositions.length; j++) {
        let noteDot = document.createElementNS(svgns, 'use');
        noteDot.setAttribute("x", fretCenters[j]);
        noteDot.setAttribute("y", stringPositions[i]);
        noteDot.setAttribute("id", "note_" + (j + (i * fretPositions.length)));
        noteDot.setAttribute("href", "#dotAsset");
        noteDot.setAttribute("fill", "red");
        svg.appendChild(noteDot);        
    }
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

let body = document.querySelector("body")
let noteListParagraph = document.createElement("p");

const basicNotes = ["a"];
for (i=1; i< 12; i++){
    if(basicNotes[i-1] === "b" || basicNotes[i-1] === "e" || basicNotes[i-1].indexOf("#") !== -1){
        basicNotes.push(String.fromCharCode((basicNotes[i-1].charCodeAt(0) + 1)));
    } else {
        basicNotes.push(basicNotes[i-1] + "#")
    }
}
// take a number, return a note
function numberToNote(noteNumber){
    return basicNotes[noteNumber%12];
}

let noteList = "";
for (i =0; i<27; i++){
    noteList += numberToNote(i) + ", ";
}
noteListParagraph.textContent = noteList;
body.appendChild(noteListParagraph);