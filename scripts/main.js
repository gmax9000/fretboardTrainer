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

const [numberToNote, notesOnString] = (function () {

    const basicNotes = ["a"];
    for (let i = 1; i < 12; i++) {
        if (basicNotes[i - 1] === "b" || basicNotes[i - 1] === "e" || basicNotes[i - 1].indexOf("#") !== -1) {
            basicNotes.push(String.fromCharCode((basicNotes[i - 1].charCodeAt(0) + 1)));
        } else {
            basicNotes.push(basicNotes[i - 1] + "#")
        }
    }

    function numberToNote(noteNumber) {
        return basicNotes[noteNumber % 12];
    }

    function notesOnString(startingNoteObject, numberOfFrets) {
        const startingNoteNumber = basicNotes.indexOf(startingNoteObject.note) + startingNoteObject.octave * 12; //missing accidental
        let notesOnString = [];
        for (let i = startingNoteNumber; i < startingNoteNumber + numberOfFrets + 1; i++) {
            notesOnString.push(numberToNote(i));
        }
        return notesOnString;
    }

    return [
        numberToNote,
        notesOnString
    ]
})();

// creating the board
const board = document.createElementNS(svgns, 'rect');
board.setAttribute("width", fretboard.scale);
board.setAttribute("height", fretboard.width);
board.setAttribute("fill", fretboard.boardColor);
board.setAttribute("id", "board");
svg.appendChild(board);

// creating the nut
const nut = document.createElementNS(svgns, 'rect');
nut.setAttribute("width", fretboard.nutWidth);
nut.setAttribute("height", fretboard.width);
nut.setAttribute("fill", "white");
nut.setAttribute("id", "nut");
svg.appendChild(nut);

// fretAsset definition
const fretAsset = document.createElementNS(svgns, 'line');
fretAsset.setAttribute("id", "fretAsset");
fretAsset.setAttribute("y2", fretboard.width);
fretAsset.setAttribute("stroke", fretboard.fretColor);
fretAsset.setAttribute("stroke-width", fretboard.fretWidth);
defs.appendChild(fretAsset);

// whiteDotAsset definition
const whiteDotAsset = document.createElementNS(svgns, 'circle');
whiteDotAsset.setAttribute("id", "whiteDotAsset");
whiteDotAsset.setAttribute("fill", "white");
whiteDotAsset.setAttribute("r", fretboard.fretWidth);
defs.appendChild(whiteDotAsset);

// redDotAsset definition
const redDotAsset = document.createElementNS(svgns, 'circle');
redDotAsset.setAttribute("id", "redDotAsset");
redDotAsset.setAttribute("fill", "red");
redDotAsset.setAttribute("r", 1.5 * fretboard.fretWidth);
defs.appendChild(redDotAsset);

// doubleDotAsset definition
const doubleDotAsset = document.createElementNS(svgns, 'g');
doubleDotAsset.setAttribute("id", "doubleDotAsset");
// first dot
let oneDot = document.createElementNS(svgns, 'use');
oneDot.setAttribute("y", fretboard.width / 3);
oneDot.setAttribute("href", "#whiteDotAsset");
doubleDotAsset.appendChild(oneDot);
// second dot
oneDot = document.createElementNS(svgns, 'use');
oneDot.setAttribute("y", fretboard.width * 2 / 3);
oneDot.setAttribute("href", "#whiteDotAsset");
doubleDotAsset.appendChild(oneDot);
defs.appendChild(doubleDotAsset);

// stringAsset definition
const stringAsset = document.createElementNS(svgns, 'line');
stringAsset.setAttribute("id", "stringAsset");
stringAsset.setAttribute("x2", fretboard.scale);
stringAsset.setAttribute("stroke", fretboard.stringColor);
defs.appendChild(stringAsset);

// takes a guitar and returns an array of fret positions
function calculateFretPositions(guitar) {
    const remainingScaleDivider = 17.871; // it's called the rule of 18
    const fretPositions = [];
    for (let i = 0; i < guitar.numOfFrets; i++) {
        if (i === 0) {
            fretPositions.push((guitar.scale / remainingScaleDivider) + fretboard.nutWidth);
        } else {
            fretPositions.push(fretPositions[i - 1] + ((guitar.scale - fretPositions[i - 1]) / remainingScaleDivider));
        }
    }
    return fretPositions;
}

const fretPositions = calculateFretPositions(fretboard);

/**
 * 
 * @param {number[]} fretPositions 
 * @returns the positions of all fret centers
 */
function calculateFretCenterX(fretPositions) {
    const fretCenters = [fretboard.nutWidth / 2];
    for (let i = 0; i < fretPositions.length; i++) {
        if (i === 0) {
            fretCenters.push((fretPositions[i] + fretboard.nutWidth) / 2);
        } else {
            fretCenters.push((fretPositions[i] + fretPositions[i - 1]) / 2);
        }
    }
    return fretCenters;
}
const fretCenters = calculateFretCenterX(fretPositions);

// place frets and dots in svg
const fretGroup = document.createElementNS(svgns, "g");
fretGroup.setAttribute("id", "fretsAndInlays");
svg.appendChild(fretGroup)

for (let i = 0; i < fretboard.numOfFrets; i++) {
    let fret = document.createElementNS(svgns, 'use');
    fret.setAttribute("x", fretPositions[i]);
    fret.setAttribute("y", "0");
    fret.setAttribute("href", "#fretAsset");
    fret.setAttribute("id", "fret" + (i + 1)); //can't override def attributes, do I need it?

    fretGroup.appendChild(fret);

    // place single dots at 3 5 7 9 repeat from 12th
    if (fretboard.singleDotPos.indexOf(i % 12) !== -1) {
        let dot = document.createElementNS(svgns, 'use');
        dot.setAttribute("x", fretCenters[i]);
        dot.setAttribute("y", "50%");
        dot.setAttribute("href", "#whiteDotAsset");
        dot.setAttribute("id", "dotAtFret_" + i); //can't override def attributes, do I need it?

        fretGroup.appendChild(dot)

        let noteText = document.createElementNS(svgns, 'text');
        noteText.setAttribute("fill", "black");
        noteText.setAttribute("font-weight", "bold");
        noteText.setAttribute("font-size", fretboard.fretWidth * 1.8);
        let textNode = document.createTextNode(i);
        noteText.appendChild(textNode);
    
        fretGroup.appendChild(noteText);
        let bbox = noteText.getBBox();
        noteText.setAttribute("x", fretCenters[i] - bbox.width / 2);
        noteText.setAttribute("y", fretboard.width/2 + bbox.height / 4);
    }

    // place double dots at every 12th fret
    // need to shift i by one here to display double dot at end of array
    // this is due to first fret being at 0th position
    if ((i + 1) % 12 === 0) {
        let dot = document.createElementNS(svgns, 'use');
        dot.setAttribute("x", fretCenters[i + 1]);
        dot.setAttribute("y", "0");
        dot.setAttribute("href", "#doubleDotAsset");
        dot.setAttribute("id", "dotsAtFret_" + i); //can't override def attributes, do I need it?

        fretGroup.appendChild(dot)
    }
}

// calculate string starting position and distance between strings

function calculateStringPositions(guitar) {
    const positions = [guitar.width / 12];
    const stringDistance = (guitar.width - (2 * positions[0])) / (guitar.strings.length - 1); // TODO: check against div by zero
    for (let i = 1; i < guitar.strings.length; i++) {
        positions.push(positions[i - 1] + stringDistance);
    };
    return positions;
}
const stringPositions = calculateStringPositions(fretboard);

// place strings
const stringGroup = document.createElementNS(svgns, "g");
stringGroup.id = "stringGroup";
svg.appendChild(stringGroup);

for (let i = 0; i < fretboard.strings.length; i++) {
    let guitarString = document.createElementNS(svgns, 'use');
    guitarString.setAttribute("x", "0");
    guitarString.setAttribute("y", stringPositions[i]);
    guitarString.setAttribute("href", "#stringAsset")
    guitarString.setAttribute("stroke-width", i * (fretboard.fretWidth / 10) + (fretboard.fretWidth * 2 / 3));
    guitarString.setAttribute("id", "string" + i);  //can't override def attributes, do I need it?

    stringGroup.appendChild(guitarString);
}

let notesOnAllStrings = [];
for (let i = 0; i < fretboard.strings.length; i++) {
    notesOnAllStrings.push(notesOnString(fretboard.strings[i], fretboard.numOfFrets));
}

function showAllNotes() {
    const noteGroup = document.createElementNS(svgns, 'g');
    noteGroup.setAttribute("id", "noteIcons")
    svg.appendChild(noteGroup);
    for (let i = 0; i < stringPositions.length; i++) {
        for (let j = 0; j < fretPositions.length + 1; j++) {
            displaySingleNote(i, j,noteGroup, false);
        }
    }
};

showAllNotes();
/**
 * place viewbox
 * 
 * the width of the graphic is the position of the last fret with some buffer
 * the height of the graphic is what is called the width of a guitar 
 */
const lastFretPosition = fretPositions[fretboard.numOfFrets - 1];
const lastFretViewBuffer = fretPositions[fretboard.numOfFrets - 1] - fretPositions[fretboard.numOfFrets - 2];
svg.setAttribute("viewBox", "-5" + " 0 " + (lastFretPosition + lastFretViewBuffer) + " " + fretboard.width);

/**
 * actual page logic starts here
 */

function activateButton() {
    modeButtons.forEach(element => element.setAttribute("class", (element === this) ? "activeButton" : "inactiveButton"));
}

function removeNoteIcons() {
    let iconGroup = document.querySelector("#noteIcons");
    if (iconGroup) {
        iconGroup.parentElement.removeChild(iconGroup);
    }
}

const answerButtonsDiv = document.querySelector("#answerButtons");
for (let i = 0; i < 12; i++) {
    let newButton = document.createElement("button");
    newButton.id = numberToNote(i) + "_button";
    newButton.textContent = numberToNote(i);
    answerButtonsDiv.appendChild(newButton);
}

answerButtonsDiv.addEventListener("click", removeNoteIcons);
answerButtonsDiv.addEventListener("click", displayQuestionMark);

const modeButtons = document.querySelectorAll("ul#modeButtons button");
modeButtons.forEach(element => element.addEventListener("click", activateButton));
modeButtons.forEach(element => element.addEventListener("click", removeNoteIcons));

const answerButtons = document.querySelectorAll("div#answerButtons button");

function compareToSolution(noteString){
    const currentNote = notesOnAllStrings[currentRandomNote.stringNumber][currentRandomNote.fret];
    if(noteString === currentNote){
        return "correct";
    }else{
        return "incorrect";
    }
}
function checkAnswer() {
    answerButtons.forEach(element => element.setAttribute("class", (element === this) ? compareToSolution(this.textContent) : "notSelected"))
}
answerButtons.forEach(element => element.addEventListener("click", checkAnswer));

const displayNoteButton = document.querySelector("#notesButton");
const readingPracticeButton = document.querySelector("#readingPracticeButton");
const locationPracticeButton = document.querySelector("#locationPracticeButton");

displayNoteButton.addEventListener("click", showAllNotes);

function displayQuestionMark(){
    currentRandomNote = randomNote();
    const iconGroup = document.createElementNS(svgns, "g");
    iconGroup.id = "noteIcons";
    svg.appendChild(iconGroup);
    displaySingleNote(currentRandomNote.stringNumber, currentRandomNote.fret, iconGroup, true);
    scrollToRandomNote(currentRandomNote);
}
readingPracticeButton.addEventListener("click", displayQuestionMark)

let activeStrings = [6];

function randomNote() {
    let numActiveStrings = activeStrings.length;
    let a = activeStrings[Math.round((numActiveStrings - 1) * Math.random())] - 1;
    let b = Math.round(fretboard.numOfFrets * Math.random());
    return {
        stringNumber: a,
        fret: b
    };
}

let currentRandomNote = randomNote();

function displaySingleNote(string, fret, parent, questionmark) {
    let noteDot = document.createElementNS(svgns, 'use');
    noteDot.setAttribute("x", fretCenters[fret]);
    noteDot.setAttribute("y", stringPositions[string]);
    noteDot.setAttribute("id", "note_" + (fret + (string * fretPositions.length)));
    noteDot.setAttribute("href", "#redDotAsset");
    parent.appendChild(noteDot);

    let noteText = document.createElementNS(svgns, 'text');
    noteText.setAttribute("fill", "white");
    noteText.setAttribute("font-size", fretboard.fretWidth * 2.5);
    let textNode = document.createTextNode((questionmark ? "?" : notesOnAllStrings[string][fret]));
    noteText.appendChild(textNode);

    parent.appendChild(noteText);
    let bbox = noteText.getBBox();
    noteText.setAttribute("x", fretCenters[fret] - bbox.width / 2);
    noteText.setAttribute("y", stringPositions[string] + bbox.height / 4);
}

function scrollToRandomNote(currentRandomNote){
    let fboard = document.querySelector("#fboard");
    fboard.scrollTo({
        top: 0,
        left: (fretCenters[currentRandomNote.fret] * fboard.scrollWidth / gitScale),
        behavior: "smooth"
    })
    console.log("Fret:\t", currentRandomNote.fret , "xcoordinate:\t", fretCenters[currentRandomNote.fret] * fboard.scrollWidth / gitScale, "fretboard width:\t", fboard.scrollWidth);
}

let stringTogglers = document.querySelectorAll("div#stringtogglers button");
stringTogglers.forEach(element => {
    element.addEventListener("click", toggleString);
});

function toggleString(event){
    togglenumber = event.target.value;
    let index = activeStrings.indexOf(Number(togglenumber));

    if(index < 0){
        activeStrings.push(Number(togglenumber));
        this.setAttribute("class", "activeButton")
        console.log("index was: ", index);
    } else {
        activeStrings.splice(index, 1)
        this.setAttribute("class", "inactiveButton")
        console.log("index was: ", index);

    }
}