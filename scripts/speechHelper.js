'use strict';

/** 
 * @description Synthesise and Recognise speech from Browser. 
 */
class SpeechHelper {
    constructor() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this._recognition = new SpeechRecognition();
        this._recognition.interimResults = true;
        //this._recognition.continuous = true;
        this._recognition.maxAlternatives = 1;
        this._continueRecognisingSpeech = true;
        this._recogniseCallBackFunc = null;
        this._recognition.onresult = this.recognisedTranscript.bind(this);
        this._recognition.onend = this.recognitionCompletion.bind(this);
        this._recognisedTranscriptsBag = [];
        this._currentTranscript = "";

        this._synth = window.speechSynthesis;
        this._toSpeak = new SpeechSynthesisUtterance();
        this._voices = this._synth.getVoices();
        this._toSpeak.voice = this._voices[2];
        this._toSpeak.lang = 'en-UK';
        this._toSpeak.rate = 1;
        this._speakComplationCallBack;
    }

    /** @description Speak out all the text passed in to the system.
     * @param {string} message to be spoken.         
     */
    speak(message, speakComplationCallBack) {
        try {
            let msgArray = this.decompose(message, 15);
            this.speakBatch(msgArray, 0);
            this._speakComplationCallBack = speakComplationCallBack;
        } catch (exp) {
            console.log('exception ocured.', exp.message)
        }
    }

    speakingBatchCompleted() {
        if (typeof(this._speakComplationCallBack) === typeof(Function)) {
            this._speakComplationCallBack();
        }
    }

    /** @description Speak out a batch of words in the list that passed in.
     * @param {string} message to be spoken.         
     */
    speakBatch(message, index) {
        try {
            this.speakAsync(message[index]).then(() => {
                index++;
                if (index < message.length) {
                    this.speakBatch(message, index);
                } else {
                    this.speakingBatchCompleted();
                }
            });
        } catch (exp) {
            console.log('exception ocured.', exp.message)
        }
    }

    speakAsync(message) {
        let retPromise = new Promise(
            (resolve, reject) => {
                this._toSpeak.onend = resolve;
            }
        );
        this._toSpeak.voice = this._synth.getVoices()[2];
        this._toSpeak.text = message;
        this._synth.speak(this._toSpeak);
        return retPromise;
    }

    /** @description decompose the given string into a list of given length.
     * @param {string} message  message to be split into list
     * @param {number} splitsize  max lenth of a list item .         
     */
    decompose(message, splitsize) {
        let msgList = [];
        let msgSplitArray = message.split(' ');
        let msgLength = msgSplitArray.length;
        let cumilativeListLength = 0;
        let msg = "";
        while (true) {
            msg = msgSplitArray.slice(cumilativeListLength, cumilativeListLength + splitsize).join(' ');
            msgList.push(msg);
            cumilativeListLength = cumilativeListLength + splitsize;
            if (cumilativeListLength >= msgLength)
                break;
        }
        return msgList;
    }

    startSpeechRecognition(callbackfunc) {
        try {
            this._continueRecognisingSpeech = true;
            this._recognisedTranscriptsBag = [];
            this._recogniseCallBackFunc = callbackfunc;
            this._recognition.start();
        } catch (exp) {
            console.log(exp.message);
        }

    }

    restartSpeechRecognition() {
        try {
            this._recognition.start();
        } catch (exp) {
            console.log(exp.message);
        }

    }

    stopSpeechRecognition(callbackfunc) {
        try {
            this._continueRecognisingSpeech = false;
            this._recognition.stop();
        } catch (exp) {
            console.log(exp.message);
        }

    }
    recognisedTranscript(evt) {
        this._currentTranscript = Array.from(evt.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        console.log(this._currentTranscript);
        if (typeof(this._recogniseCallBackFunc) === typeof(Function)) {
            let str = this._recognisedTranscriptsBag.join(' ') + ' ' + this._currentTranscript;
            this._recogniseCallBackFunc(str);
        }
    }

    recognitionCompletion() {
        if (this._continueRecognisingSpeech == true) {
            this._recognisedTranscriptsBag.push(this._currentTranscript);
            if (typeof(this._recogniseCallBackFunc) === typeof(Function)) {
                this._recogniseCallBackFunc(this._recognisedTranscriptsBag.join(' '));
            }
            this.restartSpeechRecognition();
        }
    }

}