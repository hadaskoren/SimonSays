
var gState;

var NOTES = [];

var gUserMsg;

var gElLevel;
var gElHighestScore;

function setLocalStorageVar() {
    if (localStorage.getItem('highestLevelResult') === null){
        localStorage.setItem('highestLevelResult' , 0);
    } 
}

function init() {
    gElHighestScore = document.querySelector('.highestScore');
    var highestScoreFromStorage = localStorage.getItem('highestLevelResult');
    // if (highestScoreFromStorage === 'undefined') {
    //     highestScoreFromStorage = 0;
    // }
    setLocalStorageVar();

    gState = {
        isUserTurn: false,
        currNoteIndexToClick: 0,
        seqNoteIndexes: [],
        level: 1,
        highestScore: highestScoreFromStorage,
    }

    if(gState.highestScore > 0) {
        gElHighestScore.innerHTML = 'Higest level: '+gState.highestScore;
        gElHighestScore.style.display = 'block';
    }

    NOTES = createNotes();
    renderNotes(NOTES);
    // gUserMsg = document.querySelector('.userMsg');
    doComputerMove();
}

function doComputerMove() {
    gElLevel.innerHTML = 'Level '+gState.level;
    tellUser('Simon says...');
    addRandomNote();
    playSeq();
}

function createNotes() {
    var notes = [];
    
    for (var i = 0; i < 4; i++) {
       var audioFileName = 'sound/note' + (i+1) + '.mp3'; 
       var note = {sound : new Audio(audioFileName)};
       notes.push(note);
    }
    console.log('notes',notes);
    return notes;
}

function renderNotes(notes) {
    
    var ids = ['green','red','blue','yellow'];
    // mapping notes to html tags
    var strHtmls = notes.map(function(note, i){
        var strHtml =  '<div class="note '+ids[i]+'" '+'onclick='+'"noteClicked(this, ' + i + ')">' + 
                        '</div>';
        return strHtml;
    });
    
    strHtmls.push('<div class="simon"><p class="userMsg">New Game</p><p class="level"></p></div>');
    var elContainer = document.querySelector('.container');
    elContainer.innerHTML = strHtmls.join('');
    gElLevel = document.querySelector('.level');
    console.log('elContainer',elContainer);
    
}

function getRandomIntInclusive(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

// Get a random index and oush it to the sequence array
function addRandomNote() {
    var randNoteIndex = getRandomIntInclusive(0, NOTES.length);
    gState.seqNoteIndexes.push(randNoteIndex);
    console.log('gState.seqNoteIndexes',gState.seqNoteIndexes);
}

function playSeq() {
    
    // Get all notes
    var elNotes = document.querySelectorAll('.note');
    
    // go over the notes sequence array
    gState.seqNoteIndexes.forEach(function (seqNoteIndex, i) {
        
        setTimeout(function playNote() {
            // Make the note in the DOM shine
            elNotes[seqNoteIndex].classList.add('playing');
            // play the sound from the array
            NOTES[seqNoteIndex].sound.play();
            
            setTimeout(function () {
                elNotes[seqNoteIndex].classList.remove('playing');
            }, 500);
            
            console.log('Playing: ', NOTES[seqNoteIndex].sound);
        }, 1200 * i);
    });
    
    // When done playing the seq - change turns
    setTimeout(function () {
        console.log('Done Playing!!');
        gState.isUserTurn = true;
        tellUser('Your move!');
        // The time is calculated according to the time it takes to go over the notes array + one more second
    }, 1000 * gState.seqNoteIndexes.length);
    
}

function noteClicked(elNote, noteIndex) {
    
    
    if (!gState.isUserTurn) return;
    elNote.classList.add('clicked');
    setTimeout(function(){
        elNote.classList.remove('clicked');
    }, 500);
    
    // User clicked the right note?
    if (noteIndex === gState.seqNoteIndexes[gState.currNoteIndexToClick]) {
        console.log('User OK!');
        gState.currNoteIndexToClick++;
        if (gState.currNoteIndexToClick === gState.seqNoteIndexes.length) {
            console.log('User done playing seq!');
            tellUser('Good one!', 1000);
            gState.level++;
            gState.isUserTurn = false;
            gState.currNoteIndexToClick = 0;
            
            setTimeout(doComputerMove, 2000);
        }
    } else {
        // Player lost and we should restart the game by calling Init function
        tellUser('You suck!', 1000);
        if(gState.level > localStorage.highestLevelResult) {
                gState.highestScore = gState.level;
                localStorage.highestLevelResult = gState.level;
                gElHighestScore.innerHTML = 'Higest level: '+gState.highestScore;
                gElHighestScore.style.display = 'block';
        } 
        setTimeout(init, 3000);
    }
    console.log('Note', NOTES[noteIndex]);
}

function tellUser(msg, dismissAfter) {
    var elUserMsg = document.querySelector('.userMsg');
    elUserMsg.innerHTML = msg;
    if (dismissAfter) {
        setTimeout(function(){
            elUserMsg.innerHTML = '';
            gElLevel.innerHTML = '';
        }, dismissAfter);
    }
}
