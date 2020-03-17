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
        this._toSpeak.lang = 'en-US';
        this._toSpeak.rate = 1;
        this._speakComplationCallBack;
    }

    /** @description Speak out all the text passed in to the system.
     * @param {string} message to be spoken.         
     */
    speak(message, speakComplationCallBack) {
        try {
            let msgArray = this.decompose(message, 15);
            this._speakComplationCallBack = speakComplationCallBack;
            this.speakBatch(msgArray, 0);
        } catch (exp) {
            console.log('exception ocured.', exp.message)
        }
    }

    /** @description Speak out all the text passed in to the system.
     * @param {string} message to be spoken.         
     */
    speakPromise(message) {
        let retPromise;
        try {
            let msgArray = this.decompose(message, 15);
            retPromise = new Promise((resolve, reject) => {
                this._speakComplationCallBack = resolve;
            });
            this.speakBatch(msgArray, 0);
        } catch (exp) {
            console.log('exception ocured.', exp.message)
            retPromise = new Promise((resolve, reject) => {
                reject(exp.message);
            });
        }
        return retPromise;
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
        /** @description Initiates the speech recognition activity. 
         * @param {function} callbackfunc  call back function has string as parameter
         * eg recognitionDone(str);    
         */
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
        /** @description Promise based speech recognition initiator . 
         * @param {function} callbackfunc  call back function has string as parameter
         * eg recognitionDone(str);    
         */
    startSpeechRecognitionPromise() {
        let retPromise;
        try {
            this._continueRecognisingSpeech = true;
            this._recognisedTranscriptsBag = [];
            retPromise = new Promise((resolve, reject) => {
                this._recogniseCallBackFunc = resolve;
            });
            this._recognition.start();
        } catch (exp) {
            console.log(exp.message);
            retPromise = new Promise((resolve, reject) => {
                reject(exp.message);
            });
        }
        return retPromise;
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
            this._recognition.stop();
            this._continueRecognisingSpeech = false;
        } catch (exp) {
            console.log(exp.message);
        }

    }
    abortSpeechRecognition(callbackfunc) {
        try {
            this._continueRecognisingSpeech = false;
            this._recognition.abort();
        } catch (exp) {
            console.log(exp.message);
        }

    }
    recognisedTranscript(evt) {
        if (this._continueRecognisingSpeech === false)
            return;
        this._currentTranscript = Array.from(evt.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
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