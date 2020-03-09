'use strict';

let speechHelper = new SpeechHelper();
let stringDiff = new DiffHelper();
let speechRecognitionStatus = "stop";

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

$("#btnAudioControl").click(function() {
    //$.getJSON('/audio/SheebutheSheep_1.json',function(data){ console.log(data);})
    if (audioControl.paused) {
        $("i:first").addClass("fa-pause");
        $("i:first").removeClass("fa-play");
        audioControl.play();
    } else {
        $("i:first").addClass("fa-play");
        $("i:first").removeClass("fa-pause");
        audioControl.pause();
    }
});

$("#btnStartRecognise").click(function() { 
    speechRecognitionStatus = (speechRecognitionStatus === "stop") ? "listening" : "stop"; 
    if(speechRecognitionStatus === "listening"){
        speechHelper.startSpeechRecognition(speechCallBack);
        $("#btnStartRecognise i:first-child").addClass("fa-microphone-slash");
        $("#btnStartRecognise i:first-child").removeClass("fa-microphone");       
        $("#dvSpeachStatus").show();
    }
    else{
        speechHelper.stopSpeechRecognition();
        $("#btnStartRecognise i:first-child").addClass("fa-microphone");
        $("#btnStartRecognise i:first-child").removeClass("fa-microphone-slash"); 
        $("#dvSpeachStatus").hide();       
    }
});

$("#btnAssessReading").click(function() {
    let sourceText = getTextToRead();
    let spokenText = getSpokenText();
    let diffResult = stringDiff.getmodifiedDiffString(sourceText, spokenText, 'delCallBack');
    dvDiffArea.innerHTML = diffResult;
    let wordsStats = stringDiff.getAssessmentStats(diffResult);
    wordsStats['sourceWords'] = sourceText.split(' ').length;
    wordsStats['spokenWords'] = spokenText.split(' ').length;
    analyseAssessment(wordsStats);
});


