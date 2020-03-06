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
    speechHelper.speak(data);
}

function speakTextCompletionCallBack() {
    btnSpeak.disabled = false;
}

function speechCallBack(response) {
    dvSpokenText.innerHTML = response;
}

btnSpeak.addEventListener('click', () => {
    btnSpeak.disabled = true;
    let msg = getTextToRead();
    let speech = new SpeechHelper();
    speech.speak(msg, speakTextCompletionCallBack);
});

btnStartRecognise.addEventListener('click', () => {
    speechHelper.startSpeechRecognition(speechCallBack);
    document.getElementById("divbtnStartRecognise").className = "hideme";
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
    dvDiffArea.innerHTML = stringDiff.getmodifiedDiffString(sourceText, spokenText, 'delCallBack');
});