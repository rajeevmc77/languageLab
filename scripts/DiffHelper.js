'use strict';

/** 
 * @description Synthesise and Recognise speech from Browser. 
 */
class DiffHelper {
    constructor() {
        this._delpatteren = /(?<del><del>\s*(?<delString>(.*?))\s*<\/del>)/gmi;
        this._inspatteren = /(?<ins><ins>\s*(.*?)\s*<\/ins>)/gmi;
        this._revisedDelTag = '<a href="#" onclick="myfunc(\'$<delString>\')">$<del></a>';
    }

    /** @description Speak out all the text passed in to the system.
     * @param {string} message to be spoken.         
     */
    getmodifiedDiffString(sourceString, mutedString, callbackDelFunc = "delCallBack", callbackInsFunc = "insCallBack") {
        let modifiedDiffString = "",
            diff = "";
        this._revisedDelTag = '<a href="#" onclick="' + callbackDelFunc + '(\'$<delString>\')">$<del></a>';
        try {
            diff = diffString(sourceString, mutedString);
            modifiedDiffString = diff.replace(this._delpatteren, this._revisedDelTag);
        } catch (exp) {
            console.log('exception ocured.', exp.message)
        }
        return modifiedDiffString;
    }
}