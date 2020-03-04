'use strict';

/** 
 * @description Synthesise and Recognise speech from Browser. 
 */
class StringDiffHelper {
    constructor() {
        this._diffString = "";
        this._delpatteren = /(?<del><del>\s*(?<delString>(.*?))\s*<\/del>)/gmi;
        this._inspatteren = /(?<ins><ins>\s*(.*?)\s*<\/ins>)/gmi;
    }

    /** @description Speak out all the text passed in to the system.
     * @param {string} message to be spoken.         
     */
    diffStrings(sourceString, mutedString) {
        try {
            this._diffString = diffString(sourceString, mutedString);
        } catch (exp) {
            console.log('exception ocured.', exp.message)
        }
    }

    getmodifiedDiffString() {
        modifiedDiffString = this._diffString.replace(delpatteren, '<a val=$<delString>>$<del></a>');
        return modifiedDiffString;
    }

}