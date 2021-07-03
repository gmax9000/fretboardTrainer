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
        if (noteNumber < 0){
            throw "Specified noteNumber is not positive!";
        }
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

export {numberToNote, notesOnString};