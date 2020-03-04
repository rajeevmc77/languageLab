'use strict';

/** 
 * @description Synthesise and Recognise speech from Browser. 
 */
class SpeechHelper {
    constructor() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this._recognition = new SpeechRecognition();
        this._recognition.interimResults = true;
        this._continueRecognisingSpeech = true;
        this._recognition.onresult = this.recognisedTranscript;
        this._recognition.onend = this.recognitionCompletion;
        this._recognisedTranscriptsBag = [];

        this._synth = window.speechSynthesis;
        this._toSpeak = new SpeechSynthesisUtterance();
        this._voices = this._synth.getVoices();
        this._toSpeak.voice = this._voices[2];
        //this._toSpeak.voiceURI = 'native';
        this._toSpeak.lang = 'en-US';
        this._toSpeak.rate = 1;
        //this._toSpeak.onend = this.speechEnd;
        //this._toSpeak.onstart = this.speechStart;
        //this._toSpeak.onboundary = this.speechBoundary;
    }

    /** @description Speak out all the text passed in to the system.
     * @param {string} message to be spoken.         
     */
    speak(message) {
        try {
            let msgArray = this.decompose(message, 15);
            this.speakBatch(msgArray, 0);
        } catch (exp) {
            console.log('exception ocured.', exp.message)
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
    speechEnd() {
        //console.log('Speech ended.');
    };
    speechStart() {
        //console.log('Speech started.');
    };
    speechBoundary(e) {
        //console.log('Speech boundary reached.')
    };

    recogniseSpeech() {
        this._recognition.start();
    }

    recognisedTranscript(evt) {
        const transcript = Array.from(evt.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        if (!this._recognisedTranscriptsBag) {
            this._recognisedTranscriptsBag = [];
        }
        this._recognisedTranscriptsBag.push(transcript);
        console.log(transcript);
    }

    recognitionCompletion(evt) {
        if (this._continueRecognisingSpeech == true) {
            this.recogniseSpeech();
        }
    }

}