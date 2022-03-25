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
        }
    }
    if ((ret2 = message.match(/(\d+)(\+\d+)?=(\d+) Successes/)) || (ret2 = message.match(/(\d+) Successes/))) {
        let successBase = Number(ret2[1]),
            successAdded = ret2[2] ? Number(ret2[2]) : 0,
            successTotal = ret2[3] ? Number(ret2[3]) : Number(ret2[1]);
        // console.log(`FINAL SUCCESS: total=${successTotal}, base=${successBase}, added=${successAdded}`);
        resultObj.resultArray.push(successTotal);
        resultObj.resultTotal += successTotal;
        resultObj.resultCounted[successTotal] = resultObj.resultCounted[successTotal] ? resultObj.resultCounted[successTotal] + 1 : 1;
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

// file is included here:
eval(fs.readFileSync('ex3_dice_roller.js')+'');

function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function callChatMessage(txt) {
    onChatMessage({type: 'api', content: txt});
}

function averageThatShit(nb) {
    return Math.round((nb + Number.EPSILON) * 1000) / 1000;
}

const myArgs = process.argv.slice(2);
const testQty = myArgs[1] ? Number(myArgs[1]) : 42,
      testedRoll = myArgs[0] || '!exr 42#';

for (let i = 0; i < testQty; i++)
    callChatMessage(testedRoll);

console.log(`Rolling ${testQty} times this roll : "${testedRoll}"`);
if (testQty <= 84) console.log(`successArray=[${resultObj.resultArray}]`);
console.log(`successTotal=${resultObj.resultTotal}`);
console.log(`successAvg=${averageThatShit(resultObj.resultTotal/testQty)}`);
console.log(`successAvg=${averageThatShit((resultObj.resultTotal/testQty)/resultObj.diceNb)} per die`);
Object.keys(resultObj.resultCounted).map((key, ) => resultObj.resultCounted[key] = String(resultObj.resultCounted[key]).padStart(5) + ' ');
console.log(`successCounted=${JSON.stringify(resultObj.resultCounted).replaceAll('"','').replace('{','').replace('}','').replaceAll(',',', ')}`);

for (const [key, value] of Object.entries(resultObj.resultCounted))
    resultObj.resultCountedAvg[key] = String(averageThatShit(Number(value) / testQty)).padStart(5) + '%';

console.log(`successCounted=${JSON.stringify(resultObj.resultCountedAvg).replaceAll('"','').replace('{','').replace('}','').replaceAll(',',', ')}`);