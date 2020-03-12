var difftest = `<del>sheebu </del><ins>cebu </ins> was  a <del>sheep </del><ins>cheap </ins> one  day  she  found <del>a </del><del>bell </del><del>she </del><del>thought </del><del>to </del><del>herself </del><del>wow </del><del>what </del><del>a </del><del>tinglejingle </del><del>bell </del><del>i </del><del>will </del><del>wear </del><del>this </del><del>bell </del><del>she </del><del>hung </del><del>it </del><del>around </del><del>her </del><del>neck </del><del>seeing </del> the  bell <del>her </del><del>friends </del><del>asked </del><del>sheebu </del><del>what </del><ins>what </ins><ins>is </ins><ins>tingle </ins><ins>jingle </ins><ins>bell </ins><ins>spell </ins><ins>app </ins><ins>whats </ins> a  lovely <del>bell </del><ins>belle </ins> you  have <del>sheebu </del><del>felt </del><del>happy </del><ins>brent </ins><ins>hoppe </ins>`;
//var postprocesspatteren = /(<del>\s*(?<delString>[^<.]*?\s*){1}<\/del>){1}(<ins>\s*(.*?)\s*<\/ins>){1}/gmi;
var postprocesspatteren = /(<del>\s*(?<delString>[^<.]*?\s*){1}<\/del>){1}(<ins>\s*(?<insString>.*?)\s*<\/ins>){1}/gmi;
matches = difftest.matchAll(postprocesspatteren)
for (let res of matches) { console.log(res); }
for (let res of matches) { console.log(res.groups); }
for (let res of matches) { let { delString, insString } = res.groups;
    console.log(insString, delString); }