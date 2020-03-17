'use strict';

let speechHelper = new SpeechHelper();
let stringDiff = new DiffHelper();
let speechRecognitionStatus = "stop";
let story = `Sheebu was a sheep. One day she found a bell. She thought to herself 'Wow! What a tingle-jingle bell. 
        I will wear this bell.' She hung it around her neck. 
        Seeing the bell her friends asked, "Sheebu, what a lovely bell you have." Sheebu felt happy.`;
story = `Put yourself in an all English speaking environment where you can learn passively. 
The best way to learn is through speaking. Practise every day.
Practise the 4 core skills: reading, writing, speaking and listening`;

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

function speechCallBack(response) {
    dvSpokenText.innerHTML = response;
}

function speakWord() {
    var promise = new Promise((resolve, reject) => {
        speechHelper.startSpeechRecognition(
            (response) => {
                resolve(response);
            }
        );
    });
    return promise;
}

function delCallBack(data, opcode) {
    if (opcode === 'play') {
        speechHelper.speak(data);
    } else if (opcode === 'record') {
        speakWord().then((resp) => {
            console.log(resp);
            divSpeakTest.innerText = resp;
            speechHelper.abortSpeechRecognition();
        });
    }

}

//btnAudioControl.addEventListener('click', () => {
// btnSpeak.addEventListener('click', () => {
//     btnSpeak.disabled = true;
//     let msg = getTextToRead();
//     let speech = new SpeechHelper();
//     speech.speak(msg, speakTextCompletionCallBack);
// });
function playAudio(url) {
    audioControl.src = url;
    audioControl.play();
}

$("#btnAudioControl").click(function() {
    //$.getJSON('/audio/SheebutheSheep_1.json',function(data){ console.log(data);})
    if (audioControl.paused) {
        $("i:first").addClass("fa-pause");
        $("i:first").removeClass("fa-play");
        playAudio('/audio/SheebutheSheep_1.mp3');
    } else {
        $("i:first").addClass("fa-play");
        $("i:first").removeClass("fa-pause");
        audioControl.pause();
    }
});

$("#btnStartRecognise").click(function() {
    speechRecognitionStatus = (speechRecognitionStatus === "stop") ? "listening" : "stop";
    if (speechRecognitionStatus === "listening") {
        speechHelper.startSpeechRecognition(speechCallBack);
        $("#btnStartRecognise i:first-child").addClass("fa-microphone-slash");
        $("#btnStartRecognise i:first-child").removeClass("fa-microphone");
        $("#dvSpeachStatus").show();
    } else {
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

$(document).ready(function() {
    //content

    //story
    //$("#parent").append('<div id = "newElement">A ' 
    //+ 'Computer Science portal for geeks</div>'); 
    $.getJSON('/audio/SheebutheSheep_1.json', function(syncData) {
        syncData.fragments.forEach((data) => {
            let text = data.lines[0];
            let audioUrl = '/audio/SheebutheSheep_1.mp3#t=' + data.begin + "," + data.end;
            let tag = `<a style="text-decoration:none" href='#' onclick=playAudio('${audioUrl}')>${text} </a>`;
            $('#content').append(tag);
        });
    });

});