var fs = require('fs');
var resultObj = {
    diceNb: 0,
    resultArray: [],
    resultTotal: 0,
    resultCounted: {},
    resultCountedAvg: {}
};

function log(...args) {
    // console.log(...args);
}

function sendChat(sender, message, callback) {
    // console.log(`SENDCHAT: Sender=${sender}, Message=${message}`);
    if (!sender) {
        if ((ret = message.match(/\/roll ((\d+)d10>7(.*))/)) && callback) {
            resultObj.diceNb = Number(ret[2]);
            let added = ret[3];
            let rollTxt = ret[1];
            // console.log(`rollTxt=${rollTxt}, diceNb=${resultObj.diceNb}, added=${added}`);
            let arrayRandomizedNumber = [];
            for (let i = 0; i < resultObj.diceNb; i++) arrayRandomizedNumber.push(getRandomInt(10));
            // console.log(`CALLING callback WITH THESE VALUES:[${arrayRandomizedNumber.join(', ')}]`);
            let content = `{ "rolls": [{ "results": [${arrayRandomizedNumber.map(i => `{ "v":${i}}`).join(',')}]}]}`;
            // console.log(`content=${arrayRandomizedNumber.join(', ')}`);
            // console.log(`callback([{type: 'rollresult', content: content, origRoll: ${`!exr ${rollTxt}`}}]);`);
            callback([{type: 'rollresult', content: content, origRoll: `!exr ${rollTxt}`}]);
        } else if (message.match(/\/roll .+d10>7/)) {
            console.log('\nPlease enter simple roll like "!exr 42#+5", this script doesn\'t parse before the "#".');
            process.exit(1);
        }
    }
    if ((ret2 = message.match(/BOTCH/))) {
        resultObj.resultArray.push(0);
        resultObj.resultCounted['BOTCH'] = resultObj.resultCounted['BOTCH'] ? resultObj.resultCounted['BOTCH'] + 1 : 1;
        bar1.update(i+1);
    } else if ((ret2 = message.match(/(\d+)(\+\d+)?=(\d+) Successes/)) || (ret2 = message.match(/(\d+) Successes/)) || (ret2 = message.match(/(\d+) Success/))) {
        let successBase = Number(ret2[1]),
            successAdded = ret2[2] ? Number(ret2[2]) : 0,
            successTotal = ret2[3] ? Number(ret2[3]) : Number(ret2[1]);
        // console.log(`FINAL SUCCESS: total=${successTotal}, base=${successBase}, added=${successAdded}`);
        resultObj.resultArray.push(successTotal);
        resultObj.resultTotal += successTotal;
        resultObj.resultCounted[successTotal] = resultObj.resultCounted[successTotal] ? resultObj.resultCounted[successTotal] + 1 : 1;
        bar1.update(i+1);
    }
}

function on(triggerTxt, ...args) {
    //console.log(`ON:'${triggerTxt}' !!`);
}

function getObj(objTypeTxt, objId) {
    if (objTypeTxt === 'player') return {get:() => '42'};
}

function randomInteger(int) {
    return getRandomInt(int);
}

function playerIsGM() {
    return true;
}

// file is included here:
eval(fs.readFileSync('ex3_dice_roller.js')+'');

function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function callChatMessage(txt) {
    EX3Dice.onChatMessage({type: 'api', content: txt});
}

function averageThatShit(nb) {
    return Math.round((nb + Number.EPSILON) * 1000) / 1000;
}

function averageThatShitLess(nb) {
    return Math.round((nb + Number.EPSILON) * 10) / 10;
}

const myArgs = process.argv.slice(2);
const testQty = myArgs[1] ? Number(myArgs[1]) : 42,
      testedRoll = myArgs[0] || '!exr 42#';


const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);

bar1.start(testQty, 0);

for (var i = 0; i < testQty; i++)
    callChatMessage(testedRoll);

bar1.stop();

console.log(`Rolling ${testQty} times this roll : "${testedRoll}"`);
if (testQty <= 84) console.log(`successArray=[${resultObj.resultArray}]`);
console.log(`successTotal=${resultObj.resultTotal}`);
console.log(`successAvg=${averageThatShit(resultObj.resultTotal/testQty)}`);
console.log(`successAvg=${averageThatShit((resultObj.resultTotal/testQty)/resultObj.diceNb)} per die`);
resultObj.resultArray.sort((a,b) => a-b);
let half = Math.floor(resultObj.resultArray.length / 2);
console.log(`successMedian=${resultObj.resultArray.length % 2 ? resultObj.resultArray[half] : averageThatShitLess((resultObj.resultArray[half - 1] + resultObj.resultArray[half]) / 2.0)}`);
console.log('successCounted=');
let addedVal = 0;
if (resultObj.resultCounted['BOTCH']) {
    let botchPercent = resultObj.resultCounted[0] ? averageThatShitLess(100*(Number(resultObj.resultCounted['BOTCH']) / (Number(resultObj.resultCounted[0])+Number(resultObj.resultCounted['BOTCH'])))) : 100;
    console.log(`BOTCH :${String(resultObj.resultCounted['BOTCH']).padStart(6)}, ${String(averageThatShitLess(100*(Number(resultObj.resultCounted['BOTCH']) / testQty))).padStart(5)}%, ${String(botchPercent).padStart(5)}% of 0 successes`);
    addedVal += Number(resultObj.resultCounted['BOTCH']);
    delete resultObj.resultCounted['BOTCH'];
}
for (const [key, value] of Object.entries(resultObj.resultCounted)) {
    console.log(`${String(key).padEnd(6)}:${String(resultObj.resultCounted[key]).padStart(6)}, ${String(averageThatShitLess(100*(Number(value) / testQty))).padStart(5)}%, ${String(averageThatShitLess(100*(Number(addedVal) / testQty))).padStart(5)}% to have done ${key == 0 ? 'worst' : 'less successes'}`);
    addedVal += Number(value);
}