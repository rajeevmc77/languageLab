'use strict';

let speechHelper = new SpeechHelper();
let stringDiff = new DiffHelper();

function cleanText(message) {
    try {
        let pattern = /[^A-Za-z0-9\s]/g;
        message = message.replace(pattern, '').toLowerCase();
    } catch (exp) {
        console.log(exp.message);
    }
    return message;
}

function analyseAssessment(wordsStats) {
    //{deletedWords: 14, insertedwords: 6, sourceWords: 32, spokenWords: 24}
    let html = "<p> Source Words : " + wordsStats.sourceWords + " Spoken Words : " + wordsStats.spokenWords +
        " Removed words : " + wordsStats.deletedWords + " New words :" + wordsStats.insertedwords +
        " Matching Words : " + (wordsStats.sourceWords - wordsStats.deletedWords) +
        " Accuracy : " + (wordsStats.sourceWords - wordsStats.deletedWords) / wordsStats.sourceWords +
        "</p>";
    divAnalysisArea.innerHTML = html;
}

function getTextToRead() {
    var node = document.getElementById('dvTextToRead');
    return cleanText(node.innerText);
}

function getSpokenText() {
    var node = document.getElementById('dvSpokenText');
    return cleanText(node.innerText);
}

function delCallBack(data) {
    speechHelper.speak(data);
}

// function speakTextCompletionCallBack() {
//     btnSpeak.disabled = false;
// }

function speechCallBack(response) {
    dvSpokenText.innerHTML = response;
}

// btnSpeak.addEventListener('click', () => {
//     btnSpeak.disabled = true;
//     let msg = getTextToRead();
//     let speech = new SpeechHelper();
//     speech.speak(msg, speakTextCompletionCallBack);
// });
$("#btnAudioControl").click(function() {
    if (audioControl.paused) {
        $("i:first").addClass("fa-pause");
        $("i:first").removeClass("fa-play");
        //btnAudioControl.childNodes[0].className = "fa fa-pause fa-2x";
        audioControl.play();
    } else {
        $("i:first").addClass("fa-play");
        $("i:first").removeClass("fa-pause");
        //btnAudioControl.childNodes[0].className = "fa fa-play fa-2x";
        audioControl.pause();
    }
});

// btnAudioControl.addEventListener('click', () => {
//     //$.getJSON('/audio/SheebutheSheep_1.json',function(data){ console.log(data);})
//     if (audioControl.paused) {
//         btnAudioControl.childNodes[0].className = "fa fa-pause fa-2x";
//         audioControl.play();
//     } else {
//         btnAudioControl.childNodes[0].className = "fa fa-play fa-2x";
//         audioControl.pause();
//     }
// });



btnStartRecognise.addEventListener('click', () => {
    speechHelper.startSpeechRecognition(speechCallBack);
    divbtnStartRecognise.className = "hideme";
    //document.getElementById("divbtnStartRecognise").className = "hideme";
    document.getElementById("divbtnStopRecognise").className = "showme";
});
btnStopRecognise.addEventListener('click', () => {
    speechHelper.stopSpeechRecognition();
    document.getElementById("divbtnStartRecognise").className = "showme";
    document.getElementById("divbtnStopRecognise").className = "hideme";
});

btnAssessReading.addEventListener('click', () => {
    let sourceText = getTextToRead();
    let spokenText = getSpokenText();
    let diffResult = stringDiff.getmodifiedDiffString(sourceText, spokenText, 'delCallBack');
    dvDiffArea.innerHTML = diffResult;
    let wordsStats = stringDiff.getAssessmentStats(diffResult);
    wordsStats['sourceWords'] = sourceText.split(' ').length;
    wordsStats['spokenWords'] = spokenText.split(' ').length;
    analyseAssessment(wordsStats);
});