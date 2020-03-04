'use strict';
import SpeechHelper from './speechHelper';

export function speak(msg) {
    let speech = new SpeechHelper();
    speech.speak(msg);
}