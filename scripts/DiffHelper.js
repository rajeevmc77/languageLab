'use strict';

/** 
 * @description Synthesise and Recognise speech from Browser. 
 */
class DiffHelper {
    constructor() {
        this._delpatteren = /(?<del><del>\s*(?<delString>(.*?))\s*<\/del>)/gmi;
        this._inspatteren = /(?<ins><ins>\s*(?<insString>(.*?))\s*<\/ins>)/gmi;
        this._postprocesspatteren = /(<del>\s*(?<delString>[^<.]*?\s*){1}<\/del>){1}(<ins>\s*(?<insString>.*?)\s*<\/ins>){1}/gmi;
        this._revisedDelTag = '<a href="#" onclick="myfunc(\'$<delString>\')">$<del></a>';
    }

    /** @description Speak out all the text passed in to the system.
     * @param {string} message to be spoken.         
     */
    getmodifiedDiffString(sourceString, mutedString, callbackDelFunc = "delCallBack", callbackInsFunc = "insCallBack") {
        let modifiedDiffString = "",
            diff = "";
        this._revisedDelTag = ' <a class="assessment" onclick="' + callbackDelFunc + '(\'$<delString>\',\'play\')"> <i class="fa fa-volume-up "></i></a> <span> $<del> </span> ' +
            '<a class="assessment" onclick="' + callbackDelFunc + '(\'$<delString>\',\'record\')"> <i class="fa fa-microphone"></i></a> ';
        try {
            diff = diffString(sourceString, mutedString);
            diff = this.postProcessDiffResult(diff);
            modifiedDiffString = diff.replace(this._delpatteren, this._revisedDelTag);
        } catch (exp) {
            console.log('exception ocured.', exp.message)
        }
        return modifiedDiffString;
    }

    postProcessDiffResult(diff) {
        let diff_new = diff;
        let matches = diff.matchAll(this._postprocesspatteren);
        try {
            for (let match of matches) {
                let { delString, insString } = match.groups;
                if (soundex(delString) == soundex(insString)) {
                    diff_new = diff_new.replace(match[0], delString);
                }
            }
        } catch (exp) {
            console.log(exp.message);
        }
        return diff_new;
    }

    getAssessmentStats(message) {
        let deletedWords = 0;
        let insertedwords = 0;
        try {
            deletedWords = message.match(this._delpatteren).length;
            insertedwords = message.match(this._inspatteren).length;
        } catch (exp) {
            console.log(exp.message);
        }
        return { 'deletedWords': deletedWords, 'insertedwords': insertedwords };
    }
}