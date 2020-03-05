'use strict';

let speechHelper = new SpeechHelper();
let stringDiff = new DiffHelper();

function getTextToRead() {
    var node = document.getElementById('dvTextToRead');
    return node.innerText;
}

function getSpokenText() {
    var node = document.getElementById('dvSpokenText');
    return node.innerText;
}

function delCallBack(data) {
    console.log(data);
}

function speakTextCompletionCallBack() {
    console.log('Read Text Completed');
}

function speechCallBack(response) {
    dvSpokenText.innerHTML = response;
}

btnSpeak.addEventListener('click', () => {
    let msg = getTextToRead();
    let speech = new SpeechHelper();
    speech.speak(msg, speakTextCompletionCallBack);
});

btnStartRecognise.addEventListener('click', () => {
    speechHelper.startSpeechRecognition(speechCallBack);
});
btnStopRecognise.addEventListener('click', () => {
    speechHelper.stopSpeechRecognition();
});

btnAssessReading.addEventListener('click', () => {
    let sourceText = getTextToRead();
    let spokenText = getSpokenText();
    dvDiffArea.innerHTML = stringDiff.getmodifiedDiffString(sourceText, spokenText, 'delCallBack');
});