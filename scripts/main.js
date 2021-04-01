// basic data structure for the fretboard
const gitScale = 1500
let fretboard = {
    boardColor: "brown",
    fretColor: "darkgoldenrod",
    stringColor: "grey",
    scale: gitScale,
    width: gitScale/10,
    numOfFrets: 24,
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
let svgns = "http://www.w3.org/2000/svg"
const svg = document.querySelector("svg");


// creating the board
let board = document.createElementNS(svgns, 'rect');
board.setAttribute("x", "0");
board.setAttribute("y", "0");
board.setAttribute("width", fretboard.scale);
board.setAttribute("height", fretboard.width);
board.setAttribute("fill", fretboard.boardColor);

svg.appendChild(board);

// creating the frets
const frets = [];
const singleDots = [];

// first fret position is scale/18
// second fret position is fret0pos + (scale - fret0pos)/18
let fretDivider = 18;
let fretPos = fretboard.scale / fretDivider;
const singleDotPos = [3, 5, 9, 12];

for(i=0; i < fretboard.numOfFrets; i++){
    frets.push(document.createElementNS(svgns, 'rect'));
    frets[i].setAttribute("x", fretPos.toString());
    frets[i].setAttribute("y", "0");
    frets[i].setAttribute("width", "5");
    frets[i].setAttribute("height", fretboard.width);
    frets[i].setAttribute("fill", fretboard.fretColor);
    frets[i].setAttribute("id", "fret" + i);

    svg.appendChild(frets[i]);

    // if (singleDotPos.indexOf(i+1) !== -1) {
    //     singleDots.push(document.createElementNS(svgns, 'circle'));
    //     singleDots[].setAttribute("cx", ((Number(frets[i - 1].getAttribute("x")) + fretPos) / 2).toString());
    //     singleDots[].setAttribute("cy", fretboard.width / 2);
    //     singleDots[].setAttribute("r", "5");
    //     singleDots[].setAttribute("fill", "white");
    //     singleDots[].setAttribute("id", "circle" + i);
    // }

    fretPos += (fretboard.scale - fretPos)/fretDivider;
}


let stringPos = 5;
let stringDistance = (fretboard.width - (2*stringPos)) / (fretboard.strings.length - 1);
const strings = [];

for(i=0; i < fretboard.strings.length; i++){
    strings.push(document.createElementNS(svgns, 'rect'));
    strings[i].setAttribute("x", "0");
    strings[i].setAttribute("y", stringPos.toString());
    strings[i].setAttribute("width", fretboard.scale);
    strings[i].setAttribute("height", "5");
    strings[i].setAttribute("fill", fretboard.stringColor);
    strings[i].setAttribute("id", "string" + i);

    svg.appendChild(strings[i]);

    stringPos += stringDistance;
}

/**
 * the width of the graphic is what is called a scale on a guitar
 * the height of the graphic is what is called the width of a guitar 
 */
let lastFretPosition = Number(frets[frets.length - 1].getAttribute("x"));
let lastFretViewBuffer = 15;
//svg.setAttribute("width",  lastFretPosition + lastFretViewBuffer);
//svg.setAttribute("height", fretboard.width);

//svg.setAttribute("width",  300);
//svg.setAttribute("height", fretboard.width);
//svg.setAttribute("preserveAspectRatio", "none")
svg.setAttribute("viewBox", "0 0 " + (lastFretPosition + lastFretViewBuffer) +" " + fretboard.width);