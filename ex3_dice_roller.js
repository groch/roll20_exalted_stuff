/**
 * Exalted 3rd Edition Dice Roller
 * @author Mike Leavitt
 * @author Sylvain "Groch" CLIQUOT
 * @version 1.1
 */

class LOGLEVEL {
    static EMERGENCY    = new LOGLEVEL(1);
    static ALERT        = new LOGLEVEL(2);
    static CRITICAL     = new LOGLEVEL(3);
    static ERROR        = new LOGLEVEL(4);
    static WARNING      = new LOGLEVEL(5);
    static NOTICE       = new LOGLEVEL(6);
    static INFO         = new LOGLEVEL(7);
    static DEBUG        = new LOGLEVEL(8);

    constructor(value) {
        this.value = value;
    }
    toString() {
        return `${this.value}`;
    }
}
// CONSTANTS
const LogLvl = LOGLEVEL.INFO,
  ConditionalList = {
    '1MotD': {
        faceTrigger: (face, result, condIterator) => [7,8,9,10].includes(face),
        diceCheckMethod: handleFaceCondition1MotD, //f(result, condIterator, item, rerolled, exploded, turn, titleText)
        defaultConditionObj: {
            name: '1MotD',
            status: [,,,,,,,0,0,0,0],
            remainingToDo: 0,
            statusTotal: [,,,,,,,0,0,0,0],
            totalRerolled: 0
        }
    }
  },
  DefaultRollSetup = {
    hasRecursiveOrExplosiveFeature: false,
    has10doubled: true,
    verbosity: 0,
    colored: false,
    onlyResult: false,
    revertTitleOrder: false,
    face: [null],
    conditionalActivated: [],
    rollToProcess: [],
    finalResults: [],
    maxRecursiveAchieved: false
};

function logger(level, ...logged) {
    if (!(level instanceof LOGLEVEL)) {
        logged.unshift(level);
        level = LOGLEVEL.DEBUG;
    }

    if (level <= LogLvl)
        log(...logged);
}

logger('-- Loaded EX3Dice! --');
sendChat('EX3Dice API', 'Thanks for using EX3Dice (Groch Version)! For instructions, type <code>!exr -help</code>');

/**
 * The core functionality of the script. Intercepts API messages meant for it, extracts the core of the command, and passes it to
 * the appropriate function for handling.
 */
on('chat:message', function(msg) {
	var apiWake = '!exr ';

	if (msg.type == 'api' && msg.content.indexOf(apiWake) != -1) {
		var slc = msg.content.slice(msg.content.indexOf(apiWake) + apiWake.length);
		var rawCmd = slc.trim();
		var patt = /^.*\#/;

		if (patt.test(rawCmd)) {
			parseCmd = rawCmd.replace('#', 'd10>7');
			var rollStr = '/roll ' + parseCmd;
			performRoll(msg, rollStr);
		} else if (rawCmd.indexOf('-help') != -1) {
            var outHTML = buildHelp();
            sendChat('EX3Dice API', '/w ' + msg.who + ' ' + outHTML);
		} else {
		    printError(msg, msg.who);
		}
	}
});

function setSelectedTurnOrder(selected, successes) {
    logger(LOGLEVEL.INFO, 'setTurnOrder::INSIDE !!!');
    if (!selected || !selected.length) {
        logger(LOGLEVEL.WARNING, 'setTurnOrder::NO SELECTEDS ! RETURN');
        return;
    }
    var turnOrder = (Campaign().get('turnorder') === '') ? [] : Array.from(JSON.parse(Campaign().get('turnorder')));
    logger('setTurnOrder::turnOrder='+JSON.stringify(turnOrder));

    logger(LOGLEVEL.INFO, 'setTurnOrder::selected='+JSON.stringify(selected));
    var selectedTokenId = selected.map(o => getObj('graphic',o._id)).filter(n => n).map(o => o.get('id'));
    if (!Array.isArray(selectedTokenId)) selectedTokenId = [selectedTokenId];
    if (selectedTokenId.length && Array.isArray(selectedTokenId[0])) selectedTokenId.map(o => o[0]);
    logger('setTurnOrder::selectedTokenId='+JSON.stringify(selectedTokenId));

    const idTurnOrder = turnOrder.map(o => o.id);
    logger('setTurnOrder::idTurnOrder=' + JSON.stringify(idTurnOrder));
    var idTurnToCreate = [];

    for (const id of selectedTokenId) {
        if (!idTurnOrder.includes(id)) {
            logger('setTurnOrder::adding to include into turnorder id=' + id);
            idTurnToCreate.push(id);
        }
    }

    if (idTurnToCreate.length < idTurnOrder.length) {
        for (var i = 0; i < turnOrder.length; i++) {
            if (selectedTokenId.includes(turnOrder[i].id)) {
                logger(`setTurnOrder::setting id=${turnOrder[i].id} to pr=${successes}`);
                turnOrder[i].pr = successes;
            }
        }
    }

    if (idTurnToCreate.length > 0) {
        for (const id of idTurnToCreate) {
            logger(LOGLEVEL.INFO, `setTurnOrder::pushing to turnorder id=${id} pr=${successes}`);
            turnOrder.push({id:id,pr:successes,custom:''});
        }
    }

    logger(LOGLEVEL.INFO, `setTurnOrder::FINAL setting turnOrder=${JSON.stringify(turnOrder)}`);
    Campaign().set('turnorder', JSON.stringify(turnOrder));
}


/**
 * The rolling function. Handles making the roll and passing the results to the anonymous callback function. Extracts the commands from
 * the original roll string, and sends them along to be parsed and executed by the appropriate functions in the script.
 *
 * @param Roll20 Message Object		msg		The original message object.
 * @param string					cmd		The properly parsed /roll command, to pass to the QuantumRoller.
 *
 * @return void
 */
function performRoll(msg, cmd) {
    sendChat(msg.who, cmd, function(ops) {
	    if (ops[0].type == 'rollresult') {
	        var result = JSON.parse(ops[0].content);
            result.toGm = false;
            result.setTurn = false;
            
            setupRollStructure(result);

	        var strSplit = ops[0].origRoll.split('-');
	        var cmds = [];
	        _.each(strSplit, parseCmds, cmds);
            logger(LOGLEVEL.NOTICE, 'performRoll::parseCmds DONE !');
            logger('performRoll::ops='+JSON.stringify(ops));
            logger('performRoll::result='+ops[0].content);
            logger('performRoll::cmds='+JSON.stringify(cmds));

	        if (!_.isEmpty(cmds)) processCmds(cmds, result);
            finalizeRoll(result);

            const player = getObj("player", msg.playerid);
	        var outHTML = buildHTML(result, msg.content, ops[0].origRoll, player.get('color'));

            if (result.toGm) {
                if (!playerIsGM(msg.playerid)) sendChat(msg.who, `/w ${player.get('displayname')} ${outHTML}`);
                sendChat(msg.who, '/w gm ' + outHTML);
            } else {
	            sendChat(msg.who, '/direct ' + outHTML);
            }

            if (result.setTurn)
                setSelectedTurnOrder(msg.selected, result.total);
	    } else {
	        printError(ops[0], msg.who);
	    }
	});
}

function setupRollStructure(result) {
    result.rollSetup = JSON.parse(JSON.stringify(DefaultRollSetup));

    for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        result.rollSetup.face.push({
            face: i,
            rerolls: [],
            explosives: [],
            doubles: []
        });
    }

    logger(`setupRollStructure::result.rollSetup=${JSON.stringify(result.rollSetup)}`);
}

/**
 * This is the function called by _.each(), above, to parse each command string into the command and its arguments (if any). In the
 * _.each() call above, the cmds array is passed as the function's context.
 *
 * @param Array element <string>	item	Passed by the Underscore.js _.each() function; is the value of the element that corresponds to the
 *												current pointer in the collection.
 *
 * @return void.
 */
function parseCmds(item) {
    var trim = item.trim();
    if (!item) return;
    logger(LOGLEVEL.INFO, 'parseCmds::item="' + trim + '"');

    var objRet, match = false;
    var patt = /^(r|R)(l\d*)?(k|K)?(?:\s([\d,]+))?(?:\sTAGS=([(?:\w)+,]+))?$/;
    if (ret = trim.match(patt)) {
        match = true;
        logger(LOGLEVEL.NOTICE, 'parseCmds::MATCH1 = rerolls');
        logger('parseCmds::ret='+JSON.stringify(ret));
        objRet = {
            cmd: ret[1],
            faces: [...ret[4].split(',').filter(i => i).map(i => Number(i))],
            limit: ret[2] ? Number(ret[2].substring(1)) : ret[1] == 'r' ? 1 : 0,
            keepBest: ret[3] ? true : false,
            tagList: ret[5] ? [...ret[5].split(',').filter(i => i)] : []
        };
    }
    patt = /^(d|e|E)(l\d*)?(?:\s([\d,]+))?$/;
    if (ret = trim.match(patt)) {
        match = true;
        logger(LOGLEVEL.NOTICE, 'parseCmds::MATCH1 = doubles & explodes');
        logger('parseCmds::ret='+JSON.stringify(ret));
        objRet = {
            cmd: ret[1],
            faces: [...ret[3].split(',').filter(i => i).map(i => Number(i))],
            limit: ret[2] ? Number(ret[2].substring(1)) : ret[1] == 'r' ? 1 : 0
        };
    }
    patt = /^(g|gm|D|target|turn|v|V|c|o|onlyResult|rev|reverseTitle|1MotD)$/;
    if (ret = trim.match(patt)) {
        match = true;
        logger(LOGLEVEL.NOTICE, 'parseCmds::MATCH2 - gm & D & Turn & verbosity & color & onlyResult & reverseTitle');
        logger('parseCmds::ret='+JSON.stringify(ret));
        objRet = {
            cmd: ret[1],
            args: null
        };
    }

    logger(LOGLEVEL.INFO, 'parseCmds::FINAL objRet='+JSON.stringify(objRet));
    if (match) this.push(objRet);
}


/**
 * This takes the parsed cmds array and actually interprets those commands and passes them to the appropriate functions. This is sort of the heart
 * of the whole script.
 *
 * @param Array <JavaScript Object>		cmds	The array of parsed commands created with parseCmds(), above.
 * @param JavaScript Object	Reference	result	The contents of the rollresult message from the performRoll() function, including the total successes and
 *													each individual roll result.
 *
 * @return void
 */
function processCmds(cmds, result) {
    logger(LOGLEVEL.INFO, `processCmds::processCmds cmds=${JSON.stringify(cmds)}, result=${JSON.stringify(result)}`);
    for (const item of cmds) {
        var recReroll = false,
            exploIgnore = true,
            verbosityToSet = 1;
        switch (String(item.cmd)) {
            case 'R':
                recReroll = true;
            case 'r':
                for (const face of item.faces) {
                    logger(LOGLEVEL.INFO, `processCmds::adding reroll on face=${face}, limit=${item.limit}, rec=${item.recReroll}, keepBest=${item.keepBest}, tags='${item.tagList}'`);
                    result.rollSetup.face[face].rerolls.push({
                        limit: item.limit,
                        done: 0,
                        keepBest: item.keepBest ? item.keepBest : false,
                        recursive: recReroll,
                        tagList: item.tagList
                    });
                }
                break;
            case 'E':
                exploIgnore = false;
            case 'e':
                for (const face of item.faces) {
                    logger(LOGLEVEL.INFO, `processCmds::adding explode on face=${face}, limit=${item.limit}, exploIgnore=${item.exploIgnore}`);
                    result.rollSetup.face[face].explosives.push({
                        limit: item.limit,
                        done: 0,
                        ignoreRerolled: exploIgnore
                    });
                }
                break;
            case 'D':
                result.rollSetup.has10doubled = false;
                break;
            case 'd':
                logger(LOGLEVEL.INFO, `processCmds::adding doubles on faces=${item.faces}, limit=${item.limit}`);
                for (const face of item.faces) result.rollSetup.face[face].doubles.push({limit: item.limit, done: 0});
                break;
            case '1MotD':
                result.rollSetup.conditionalActivated.push(JSON.parse(JSON.stringify(ConditionalList['1MotD'].defaultConditionObj)));
                break;
            case 'turn':
            case 'target':
                result.setTurn = true;
                break;
            case 'g':
            case 'gm':
                result.toGm = true;
                break;
            case 'o':
            case 'onlyResult':
                result.rollSetup.onlyResult = true;
                break;
            case 'rev':
            case 'reverseTitle':
                result.rollSetup.revertTitleOrder = true;
                break;
            case 'c':
                result.rollSetup.colored = true;
                break;
            case 'V':
                result.rollSetup.colored = true;
            case 'v':
                result.rollSetup.verbosity = verbosityToSet;
            default:
                break;
        }
    }

    logger(`processCmds::processCmds END`);
}


/**
 * This function handles doubling the values. This one is called pretty much every time the script runs, as it's one of the most common things
 * that any roll in Exalted is expected to do.
 *
 * @param JavaScript Object Reference	result		The content of the rollresult message, as above.
 *
 * @return void
 */
function doDoubles(result) {
    logger(LOGLEVEL.INFO, `doDoubles::doDoubles do10s=${result.rollSetup.has10doubled}, result=${JSON.stringify(result)}`);

    var newTotal = 0;
    for (const dice of result.rollSetup.finalResults)
        if (dice.v >= 7) newTotal++;

    logger(LOGLEVEL.INFO, `doDoubles::NEW result.total=${newTotal}`);
    result.total = newTotal;

    if (result.rollSetup.has10doubled) {
        result.rollSetup.face[10].doubles.push({limit: 0, done: 0});
    }
	// Create an empty array for our values to double.
    var doubles = result.rollSetup.face.filter(i => i).map(i => ({v:i.v, dbl: i.doubles.length ? true : false}));
    logger(`doDoubles::doubles=${JSON.stringify(doubles)}`);

    var addSucc = 0, finalResultsWithDoubleSections = [];
    if (!_.isEmpty(doubles.filter(i => i.dbl))) {
        for (const item of result.rollSetup.finalResults) {
            finalResultsWithDoubleSections.push(item);
            if (item.v === 'SECTIONDONE') continue;
            let faceObj = result.rollSetup.face[item.v];
            if (faceObj.doubles.length) {
                if (!item.rerolled) addSucc += (item.v >= 7) ? 1 : 2;
                item.doubled = true;
                faceObj.doubles[0].done++;
                if (faceObj.doubles[0].limit != 0 && faceObj.doubles[0].limit == faceObj.doubles[0].done) {
                    logger(LOGLEVEL.NOTICE, `doDoubles::DOUBLE SECTION DONE=${JSON.stringify(faceObj.doubles[0])}`)
                    finalResultsWithDoubleSections.push({
                        v: 'SECTIONDONE',
                        sectionType: 'Double',
                        details: `&#013;&#010; face: ${item.v}&#013;&#010; limit: ${faceObj.doubles[0].limit}`
                    });
                    faceObj.doubles.shift();
                }
            }
        }
        log(`doDoubles::setting new finalResults=${finalResultsWithDoubleSections}`);
        result.rollSetup.finalResults = finalResultsWithDoubleSections;
    }

    logger(LOGLEVEL.INFO, `doDoubles::addSucc=${addSucc}`);
    result.total += addSucc;
}

/**
 * Perform the roll with settings created during previous steps.
 *
 * @param JavaScript Object reference	result		The content of the rollresult message, as above; now in its final version, with all rolls and successes
 *														accurately calculated.
 */
function finalizeRoll(result) {
    logger(LOGLEVEL.INFO, `finalizeRoll::finalizeRoll result=${JSON.stringify(result)}`);

    // copy rolls
    result.rollSetup.rollToProcess = result.rolls[0].results;
    logger(`finalizeRoll::finalizeRoll rollToProcess=${JSON.stringify(result.rollSetup.rollToProcess)}`);
	if (typeof result.rollSetup.rollToProcess == 'undefined') {
        logger(LOGLEVEL.ERROR, `finalizeRoll::finalizeRoll ERROR QUITTING !!!!`);
        return;
    }

    //sort reroll & explosives
    sortRerollsAndExplosives(result);

    logger(`finalizeRoll::FINAL rollSetup=${JSON.stringify(result.rollSetup)}`)
    var turn = 1;
    do {
        logger(LOGLEVEL.NOTICE, `MEGATURN(${turn}) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        handleRollTurn(result, turn++);
        if (turn > 42) break;
    } while (result.rollSetup.rollToProcess.length > 0)
    if (turn >= 42) result.rollSetup.maxRecursiveAchieved = true;

    doDoubles(result);

    logger(`finalizeRoll::rewriting result.rolls[0].results=${JSON.stringify(result.rollSetup.finalResults)}`);
    result.rolls[0].results = result.rollSetup.finalResults;
}

function sortRerollsAndExplosives(result) {
    for (var i = 1; i <= 10; i++) {
        var face = result.rollSetup.face[i];
        face.rerolls.sort((a, b) => {
            if (a.recursive && !b.recursive) return 1;
            if (!a.recursive && b.recursive) return -1;
            return a.limit - b.limit;
        });
        face.explosives.sort((a, b) => {
            if (!a.ignoreRerolled && b.ignoreRerolled) return 1;
            if (a.ignoreRerolled && !b.ignoreRerolled) return -1;
            return a.limit - b.limit;
        });
    }
}

function strFill(number) {
    return number < 10 ? number + '  ' : number;
}

function updateTitleAndPushToNextRolls(result, toNextRoll, finalObj, nextRollsToProcess, sectionDone) {
    logger(`updateTitleAndPushToNextRolls::revert=${result.rollSetup.revertTitleOrder}, pushing:${finalObj.title}, to:${toNextRoll.title}`);
    if (Array.isArray(toNextRoll)) {
        for (const item of toNextRoll) updateTitle(result, item, finalObj);
    } else {
        updateTitle(result, toNextRoll, finalObj);
    }

    if (Array.isArray(toNextRoll))
        nextRollsToProcess.push(...toNextRoll);
    else
        nextRollsToProcess.push(toNextRoll);

    if (sectionDone) {
        if (Array.isArray(sectionDone))
            result.rollSetup.finalResults.push(...sectionDone);
        else
            result.rollSetup.finalResults.push(sectionDone);
    }
}

function updateTitle(result, toNextRoll, finalObj) {
    if (result.rollSetup.revertTitleOrder)
        toNextRoll.title.unshift(...finalObj.title);
    else
        toNextRoll.title.push(...finalObj.title);
}

function makeNewTitleFromOld(result, prevItem, actionsOfThisRoll) {
    var ret = prevItem, lastItem = prevItem.length - 1;
    var titleToChange = result.rollSetup.revertTitleOrder ? lastItem : 0;
    ret[titleToChange] = ret[titleToChange]+actionsOfThisRoll;
    return ret;
}

/**
 * Perform the roll with settings created during previous steps.
 *
 * @param JavaScript Object reference	result		The content of the rollresult message, as above; now in its final version, with all rolls and successes
 *														accurately calculated.
 * @param Number                        turn        number for turn, 1 = initial roll
 */
function handleRollTurn(result, turn) {
    logger(LOGLEVEL.INFO, `handleROllTurn::handleROllTurn turn=${turn}, rollToProcess=${JSON.stringify(result.rollSetup.rollToProcess)}`);
    var nextRollsToProcess = [];
    for (const item of result.rollSetup.rollToProcess) {
        var rerolled = false,           exploded = false,           face = item.v,          producedADie = false,
            toNextRollRerolled = null,  toNextRollExploded = null,  toNextRollCondi = [],
            tagList = [],               titleText = '',             faceObj = result.rollSetup.face[face],            
            rerollSectionDone = null,   explodeSectionDone = null,  condiSectionDone = [],
            rerollSnapshot = null;
        logger(`handleRollTurn::face(${face}) rerolls.length=${faceObj.rerolls.length}, explosives.length=${faceObj.explosives.length}`);
        if (faceObj.rerolls.length) {
            rerollSnapshot = faceObj.rerolls[0];
            ({ rerolled, toNextRollRerolled, titleText, rerollSectionDone } = handleFaceReroll(faceObj, item, turn, titleText, result.rollSetup.conditionalActivated.length));
        }
        if (faceObj.explosives.length)
            ({ exploded, toNextRollExploded, titleText, explodeSectionDone } = handleFaceExplode(faceObj, item, rerolled, turn, titleText, result.rollSetup.conditionalActivated.length));
        if (result.rollSetup.conditionalActivated.length) {
            ({ producedADie, titleText } = handleFaceConditionals(result, rerolled, exploded, titleText, item, turn, toNextRollCondi, condiSectionDone));
        }
        var finalObj = {
            wasEverRerolled:    item.wasEverRerolled || false,      v:          face,
            wasRerolled:        item.wasRerolled || false,          doubled:    false,
            wasExploded:        item.wasExploded || false,          tags:       tagList,    wasConditionallyAffected:   item.wasConditionallyAffected || false,
            rerolled:           rerolled,                           exploded:   exploded,   condTriggered:              producedADie,
            title: item.title ? makeNewTitleFromOld(result, item.title, titleText) : [`Roll Initial.${result.rollSetup.conditionalActivated.length ? condiPadder : ''}            Face=${strFill(face)}.${titleText}`]
        };
        logger(LOGLEVEL.NOTICE, `handleRollTurn::face(${face}) =>finalObj=${finalObj.v} rerolled=${rerolled} exploded=${exploded} FULL=${JSON.stringify(finalObj)}`);
        result.rollSetup.finalResults.push(finalObj);
        if (rerolled || rerollSnapshot && rerollSnapshot.recursive) updateTitleAndPushToNextRolls(result, toNextRollRerolled, finalObj, nextRollsToProcess, rerollSectionDone);
        if (exploded)                                               updateTitleAndPushToNextRolls(result, toNextRollExploded, finalObj, nextRollsToProcess, explodeSectionDone);
        if (producedADie)                                           updateTitleAndPushToNextRolls(result, toNextRollCondi,    finalObj, nextRollsToProcess, condiSectionDone);
    }
    logger(LOGLEVEL.INFO, `handleRollTurn::END nextRollsToProcess=${nextRollsToProcess.map(i => i.v)} FULL=${JSON.stringify(nextRollsToProcess)}`);
    result.rollSetup.rollToProcess = nextRollsToProcess;
    if (turn === 1) result.rollSetup.finalResults.push({v: 'SECTIONDONE', sectionType: 'Initial Roll', details: ''});
}

function handleFaceReroll(faceObj, item, turn, titleText, condiLength) {
    logger(LOGLEVEL.INFO, `handleRollTurn::face(${face}) REROLL TO DO ! section=${JSON.stringify(faceObj.rerolls[0])}`);
    var reroll = randomInteger(10), face = item.v, toNextRollRerolled, rerolled = false;
    if (faceObj.rerolls[0].recursive || (!(faceObj.rerolls[0].keepBest && reroll < face) && !item.wasRerolled)) {
        rerolled = !faceObj.rerolls[0].keepBest || reroll > face;
        var rerolledVal = (faceObj.rerolls[0].keepBest && reroll < face) ? face : reroll;
        toNextRollRerolled = {
            v: rerolledVal, wasEverRerolled: true,
            wasRerolled: true, wasExploded: false, wasConditionallyAffected: false,
            title: [`RollTurn (${strFill(turn + 1)}). R${condiLength ? condiPadder : ''} ->Face=${strFill(rerolledVal)}.`]
        };
    }
    faceObj.rerolls[0].done++;
    titleText += `${rerolled ? 'Rerolled to a' : 'Not Reroll to'} ${strFill(reroll)} `
        + (faceObj.rerolls[0].limit != 0
            ? ` (Done${faceObj.rerolls[0].done}/${faceObj.rerolls[0].limit} ).`
            : ` ( Done${strFill(faceObj.rerolls[0].done)} ).`);
    var rerollSectionDone;
    if (faceObj.rerolls[0].limit != 0 && faceObj.rerolls[0].limit == faceObj.rerolls[0].done) {
        logger(LOGLEVEL.NOTICE, `handleRollTurn::handleFaceReroll REROLL SECTION DONE=${JSON.stringify(faceObj.rerolls[0])}`);
        rerollSectionDone = {
            v: 'SECTIONDONE',
            sectionType: 'Reroll',
            details: `&#013;&#010; face: ${item.v}&#013;&#010; limit: ${faceObj.rerolls[0].limit}&#013;&#010; keepBest: ${faceObj.rerolls[0].keepBest}&#013;&#010; recursive: ${faceObj.rerolls[0].recursive}&#013;&#010; tagList: '${faceObj.rerolls[0].tagList.join('\', \'')}'`
        };
        faceObj.rerolls.shift();
    }
    return { rerolled, toNextRollRerolled, titleText, rerollSectionDone };
}

function handleFaceExplode(faceObj, item, rerolled, turn, titleText, condiLength) {
    logger(LOGLEVEL.INFO, `handleRollTurn::face(${face}) EXPLOSIVE TO DO ! section=${JSON.stringify(faceObj.explosives[0])} rerolled=${rerolled}`);
    var newDie = randomInteger(10), face = item.v, toNextRollExploded, exploded = false;
    var iterator = 0, explodeSectionDone;
    for (; iterator < faceObj.explosives.length && !(!faceObj.explosives[iterator].ignoreRerolled || (!rerolled && !item.wasEverRerolled)); iterator++);
    if (iterator == faceObj.explosives.length) {
        logger(`handleRollTurn::NO EXPLO MATCHING IN ${iterator} ITEMS. explosives=${JSON.stringify(faceObj.explosives)}`);
    } else {
        logger(`handleRollTurn::EXPLO iterator=${iterator} TEST=${!faceObj.explosives[iterator].ignoreRerolled || (!rerolled && !item.wasRerolled)}, part1=${!faceObj.explosives[iterator].ignoreRerolled}, part2=${!rerolled}, part3=${!item.wasRerolled}`);
        if (!faceObj.explosives[iterator].ignoreRerolled || (!rerolled && !item.wasEverRerolled)) {
            exploded = true;
            toNextRollExploded = {
                v: newDie, wasEverRerolled: item.rerolled || true,
                wasRerolled: false, wasExploded: true, wasConditionallyAffected: false,
                title: [`RollTurn (${strFill(turn + 1)}). E${condiLength ? condiPadder : ''} ->Face=${strFill(newDie)}.`]
            };
            faceObj.explosives[iterator].done++;
            titleText += ` Explode to a ${strFill(newDie)} ` + (faceObj.explosives[iterator].limit != 0
                ? ` (Done${faceObj.explosives[iterator].done}/${faceObj.explosives[iterator].limit} ).`
                : ` ( Done${strFill(faceObj.explosives[iterator].done)} ).`);
            if (faceObj.explosives[iterator].limit != 0 && faceObj.explosives[iterator].limit == faceObj.explosives[iterator].done) {
                logger(LOGLEVEL.NOTICE, `handleRollTurn::EXPLOSIVE SECTION DONE=${JSON.stringify(faceObj.explosives[iterator])}`);
                explodeSectionDone = {
                    v: 'SECTIONDONE',
                    sectionType: 'Explode',
                    details: `&#013;&#010; face: ${item.v}&#013;&#010; limit: ${faceObj.explosives[iterator].limit}&#013;&#010; ignoreRerolled: ${faceObj.explosives[iterator].ignoreRerolled}`
                };
                faceObj.explosives.shift();
            }
        }
    }
    return { exploded, toNextRollExploded, titleText, explodeSectionDone };
}

function handleFaceConditionals(result, rerolled, exploded, titleText, item, turn, toNextRollCondi, condiSectionDone) {
    var face = item.v, producedADie = false;
    logger(LOGLEVEL.INFO, `handleRollTurn::face(${face}) CONDITIONAL-ALL-TESTS ! rerolled=${rerolled} exploded=${exploded}`);
    for (var condIterator = 0; condIterator < result.rollSetup.conditionalActivated.length; condIterator++) {
        var condConfig = ConditionalList[result.rollSetup.conditionalActivated[condIterator].name];
        logger(`handleRollTurn::face(${face}) section=${JSON.stringify(condConfig)}`);
        var localProducedADie = false, localCondiSectionDone, localToNextRollCondi = null;
        if (condConfig && condConfig.faceTrigger(face, result, condIterator)) {
            ({ localProducedADie, localToNextRollCondi, titleText, localCondiSectionDone } = condConfig.diceCheckMethod(result, condIterator, item, rerolled, exploded, turn, titleText));
            logger(`handleRollTurn::after diceCheckMethod, localToNextRollCondi=${JSON.stringify(localToNextRollCondi)}`);
            if (localProducedADie) {
                producedADie = true;
                toNextRollCondi.push(localToNextRollCondi);
            }
            if (localCondiSectionDone)
                condiSectionDone.push(localCondiSectionDone);
        }
    }
    logger(LOGLEVEL.INFO, `handleRollTurn::face(${face}) END CONDITIONAL-ALL-TESTS ! toNextRollCondi.length=${toNextRollCondi.length}`);
    return { producedADie, titleText };
}

function handleFaceCondition1MotD(result, condIterator, item, rerolled, exploded, turn, titleText) {
    var face = item.v, faceObj = result.rollSetup.face[face], toNextRollCondi = null, producedADie = false;
    var condiSectionDone = null, cond = result.rollSetup.conditionalActivated[condIterator];
    logger(LOGLEVEL.INFO, `handleFaceCondition1MotD::face(${face}) CONDITIONAL-1MotD TO DO ! rerolled=${rerolled} exploded=${exploded} section=${JSON.stringify(cond)}`);
    cond.status[face]++;
    logger(`handleFaceCondition1MotD::CONDI (cond.status[${face}]=${cond.status[face]} === 3)=${cond.status[face] === 3}`);
    if (cond.status[face] === 3) {
        cond.status[face] = 0;
        cond.remainingToDo++;
    }
    if (cond.remainingToDo) {
        logger(LOGLEVEL.EMERGENCY, `handleFaceCondition1MotD::remainingToDo=${cond.remainingToDo}`);
        for (var i=0; i < result.rollSetup.finalResults.length && cond.remainingToDo > 0; i++) {
            const dieTesting = result.rollSetup.finalResults[i];
            if (dieTesting.v < 7 && !dieTesting.rerolled) {
                logger(LOGLEVEL.EMERGENCY, `handleFaceCondition1MotD::found a die to reroll ! turning into a 10 die no=${i} dieTesting=${JSON.stringify(dieTesting)}`);
                producedADie = true;
                toNextRollCondi = {
                    v: 10, wasEverRerolled: true,
                    wasRerolled: true, wasExploded: false, wasConditionallyAffected: true,
                    title: [`RollTurn (${strFill(turn + 1)}). C(1MotD) ->Face=10.`]
                };
                result.rollSetup.finalResults[i].condTriggered = false; //1MotD produce normal reroll
                result.rollSetup.finalResults[i].rerolled = true;
                result.rollSetup.finalResults[i].wasEverRerolled = true;
                cond.remainingToDo--;
                cond.statusTotal[face]++;
                cond.totalRerolled++;
                titleText += `1MotD created a 10 (` + (cond.remainingToDo != 0 ? `Remaining:${cond.remainingToDo}, ` : '') + `Total=${cond.statusTotal[face]}(${face})/${cond.totalRerolled}).`;
            }
        }
    }
    logger(LOGLEVEL.EMERGENCY, `handleFaceCondition1MotD::QUITTING ! producedADie=${producedADie}, titleText="${titleText}", toNextRollCondi=${JSON.stringify(toNextRollCondi)}, condiSectionDone=${JSON.stringify(condiSectionDone)}`);
    return { localProducedADie: producedADie, localToNextRollCondi: toNextRollCondi, titleText, localCondiSectionDone: condiSectionDone };
}

const   outerStyle = "background: url('https://app.roll20.net/images/quantumrollsm.png') no-repeat bottom left; margin: 0 0 -7px -45px",
        innerStyle = "margin: 0 0 7px 45px; padding-bottom: 7px;",
        baseColor = 'black',
        successColor = '#23b04f',
        doubleColor = '#950015',
        rerolledColor = 'rgba(0, 100, 255, 1)',
        explodedColor = 'rgba(255, 235, 0, 1)',
        conditionalColor = 'cyan',
        initialRollColor = '#f06292',
        formulaStyleBase = "font-size:inherit;background:white;border-radius:3px;",
        totalStyle = formulaStyleBase + 'padding:4px;display:inline;border:1px solid #d1d1d1;cursor:move;font-size:1.4em;font-weight:bold;color:black;line-height:2.0em;',
        formulaStyle = formulaStyleBase + 'padding-left:4px;border:1px solid #d1d1d1;font-size:1.1em;line-height:2.0em;word-wrap:break-word;',
        formattedFormulaStyle = "display:block;float:left;",
        uidraggableStyle = "cursor:move",
        diceBackgroundStyle = "position: absolute; top: 1px; left: 0%;",
        planeWalkerFont = "font-family: 'Planewalker';", // use font from character sheet css
        diceRollStyle = planeWalkerFont + " letter-spacing: -1px; top: 4px;",
        successColorStyle = " color: "+successColor+"; text-shadow: 0 0 0.03em "+successColor,
        doubleColorStyle = " color: "+doubleColor+"; text-shadow: 0 0 0.03em "+doubleColor,
        rerolledStyle = 'opacity: 0.4;',
        wasAffectedTextShadow = ', -3px 0 0.03em ',
        rerolledTextShadow = `, 5px -5px 3px ${rerolledColor}`,
        explodedTextShadow = `, 0.08em 0.05em 0px ${explodedColor}`,
        condTriggeredTextShadow = `, 0.15em 0em 2px ${conditionalColor}`,
        maxRecursionStyle = 'color: red; font-size: larger; font-weight: bold; padding-top: 10px;',
        sectionDoneStyle = 'position:relative;padding: 3px 0;width: 3px;height:1em;top:0.33em;border-radius:1em;border: 1px solid black;',
        condiPadder = '              ';

function recalculateSuccesses(origCmd, succ, result) {
    var patt = /^.*\#(?:\[[^\]]+\])?((?:[\+-]\d+[^\]]*\]?)+)?/;
    var innerPatt = /(([\+-]\d+)(?:[^\]\+-]*\]?))/g;
    var ret, addedSuccessesLabel = '', addedSuccesses = 0;
    if (ret = origCmd.match(patt)) {
        logger('recalculateSuccesses::ret='+JSON.stringify(ret));
        logger('recalculateSuccesses::succ='+succ);
        if (ret[1]) {
            logger('recalculateSuccesses::ret[1]='+ret[1]);
            var arrayAddedSuccesses = [...ret[1].matchAll(innerPatt)];
            logger('recalculateSuccesses::arrayAddedSuccesses='+JSON.stringify(arrayAddedSuccesses));
            for (const [, , item] of arrayAddedSuccesses) {
                logger('recalculateSuccesses::item='+item);
                addedSuccessesLabel += item;
                addedSuccesses += Number(item);
            }
        }
    }

    logger(LOGLEVEL.INFO, `recalculateSuccesses::updating total successes=${succ + addedSuccesses}, old=${succ} + ${addedSuccesses}`);
    succ += addedSuccesses;
    if (succ < 0)
        succ = 0;
    var succTxt = addedSuccessesLabel ? `${result.total}${addedSuccesses >= 0 ? '+' + addedSuccesses : addedSuccesses}=${succ}` : succ;
    return { addedSuccessesLabel, succTxt, succ };
}

/**
 * This builds the raw HTML response for the roll message. This is designed to, as much as is possible, mimic the standard roll result, up to and including
 * adding the d10-shaped result backing in the player's color.
 *
 * @param JavaScript Object reference	result		The content of the rollresult message, as above; now in its final version, with all rolls and successes
 *														accurately calculated.
 * @param string						origCmd		The original API command. Used for debug purposes; currently not in use.
 * @param string						origRoll	The original roll executed by Roll20, for display in the result.
 * @param string						color		The hexadecimal value of the player's selected color.
 *
 * @return string						html		The completed, raw HTML, to be sent in a direct message to the chat window.
 */
function buildHTML(result, origCmd, origRoll, color) {
    var vals = result.rolls[0].results, succ = result.total;
    logger(LOGLEVEL.INFO, `buildHTML::buildHTML vals=${vals.map(i => i.v)}, succ=${succ}`);

    var addedSuccessesLabel, succTxt;
    ({ addedSuccessesLabel, succTxt, succ } = recalculateSuccesses(origCmd, succ, result));

    var html = "";
    html += "<div style=\"" + outerStyle + "\"><div style=\"" + innerStyle + "\">";
    html +=   "<div class=\"formula\" style=\"display:inline;" + formulaStyle + "\"> rolling " + origRoll + " </div>";
    html +=     "<div style=\"clear: both;\"></div>";
    if (!result.rollSetup.onlyResult) {
        html += "<div class=\"formula formattedformula\" style=\"" + formulaStyle + ";" + formattedFormulaStyle + "\">";
        html +=   "<div class=\"dicegrouping ui-sortable\" data-groupindex=\"0\">";
        html = displayRolls(vals, result, html);
        if (addedSuccessesLabel) html += addedSuccessesLabel;
        html +=   "</div>";
        html += "</div>";
        html += "<div style=\"clear: both;\"></div>";
    }
    if (result.rollSetup.maxRecursiveAchieved) {
        html += "<p style='"+maxRecursionStyle+"'>MAX RECURSION ACHIEVED</p>";
        html += "<div style=\"clear: both;\"></div>";
    }
    html +=     "<strong> = </strong>";
    html +=   "<div class=\"rolled ui-draggable\" style=\"" + totalStyle + ";" + uidraggableStyle + "\">" + succTxt + " Success" + ((succ != 1) ? "es" : "") + "</div>";
    html += "</div></div>";
    return html;
}

function displayRolls(vals, result, html) {
    var isDouble;
    html += '(';
    _.each(vals, function (item, idx) {
        if (item.v === 'SECTIONDONE') {
            if (result.rollSetup.verbosity == 0) return;
            var sectionColor;
            if      (item.sectionType === 'Double')         sectionColor = doubleColor;
            else if (item.sectionType === 'Reroll')         sectionColor = rerolledColor;
            else if (item.sectionType === 'Explode')        sectionColor = explodedColor;
            else if (item.sectionType === 'Conditinal')     sectionColor = conditionalColor;
            else if (item.sectionType === 'Initial Roll')   sectionColor = initialRollColor;
            html += `<div data-origindex="${idx}" class="diceroll d10" style="background-color:${sectionColor};${sectionDoneStyle}" title="Section ${item.sectionType} DONE${item.details}"></div>`;
            return;
        }
        if (result.rollSetup.verbosity == 0 && item.rerolled)
            return;
        isDouble = item.doubled;
        var affectedTextShadow = '';
        if (item.wasRerolled || item.wasExploded) {
            affectedTextShadow = wasAffectedTextShadow;
            if (item.wasRerolled)       affectedTextShadow += item.wasConditionallyAffected ? conditionalColor : rerolledColor;
            else if (item.wasExploded)  affectedTextShadow += item.wasConditionallyAffected ? conditionalColor : explodedColor;
        }
        if (item.exploded)      affectedTextShadow += explodedTextShadow;
        if (item.rerolled)      affectedTextShadow += rerolledTextShadow;
        if (item.condTriggered) affectedTextShadow += condTriggeredTextShadow;
        html += `<div data-origindex="${idx}" class="diceroll d10" style="padding: 3px 0;${item.rerolled ? rerolledStyle : ''}">`;
        logger(`displayRolls::title =\n${item.title.join('\n')}\nJSON=${JSON.stringify(item.title)}`);
        html += '<div class="dicon" style="' + (item.v == 10 ? ' top: -1px;' : '') + (item.title.length ? '" title="' + item.title.join('&#013;&#010;') : '') + '">';
        html += '<div class="didroll" style="' + diceRollStyle
            + ((isDouble ? doubleColorStyle : ((item.v >= 7) ? successColorStyle : ` text-shadow: 0 0 0.03em ${baseColor}`))
                + (result.rollSetup.colored ? affectedTextShadow : '') + ';')
            + ([1, 10].includes(item.v) ? ' left: 1.5px;' : ' left: 0px;')
            + ' font-size: ' + (item.v == 10 ? '31' : '40') + 'px;">' + item.v + '</div>';
        html += "<div class=\"backing\" style=\"opacity: 1;\"><img src=\"https://s3.amazonaws.com/files.d20.io/images/263689904/B-bmVPv5NQIDKEbHObaOmg/max.png?1641622935\" style=\"" + diceBackgroundStyle + "\"></div>";
        html += "</div>";
        html += (idx + 1 != vals.length) ? "+" : "";
        html += "</div>";
    });
    return html + ')';
}

/**
 * This builds the HTML for the message that is sent when the user passes the -help command. It's all pretty standard; if you know HTML already, it should
 * be fairly self-explanatory.
 *
 * @return string		outhtml, outhtml2, outhtml3		I know I probably shouldn't have to return three separate strings, but I kept getting errors
 *															when I did it as one string earlier that I couldn't explain, and so once I got it working,
 *															I stopped touching it.
 */
function buildHelp() {

    var tableStyle = 'border-collapse: collapse;';
    var thStyle = 'text-align: center; width: 100px;';
    var tdStyle = 'padding: 5px; border: 1px solid rgb(200,200,200);';

    var divStyle = 'border: 1px solid rgb(200,200,200); border-radius: 3px; background-color: white; padding: 5px; margin: 10px 0px;';
    var pStyle = 'margin: 5px 0px; line-height: 1.5;';

    var outhtml = '';

    outhtml += '<div style="' + divStyle + '">';

    outhtml += '<p style="' + pStyle + '"><strong>Exalted 3rd Edition Dice Roller Help</strong></p>';
    outhtml += '<p style="' + pStyle + '">The basic syntax of most rolls you will make is:</p>';
    outhtml += '<p style="' + pStyle + '"><code>!exr [no. of dice]#</code></p>';
    outhtml += '<p style="' + pStyle + '">The <code>#</code> marks the end of the dice statement, and this syntax provides the most common type of roll in ';
    outhtml += 'Exalted: that many dice, with a target number of 7+, and 10s count double. In the majority of cases, this is all you need.</p>';
    outhtml += '<p style="' + pStyle + '">Charms, however, can throw a wrench in this, so I designed the script to be able to compensate. With the additional ';
    outhtml += 'commands and arguments, you can customize the way the roller treats your results and counts your successes, in order to match that behavior.</p>';
    outhtml += '<p style="' + pStyle + '">The full syntax of rolls is as follows:</p>';
    outhtml += '<p style="' + pStyle + '"><code>!exr [no. of dice]# -[cmd1] [arg1],[arg2]... -[cmd2] [arg3],[arg4]...</code></p>';
    outhtml += '<p style="' + pStyle + '"><em>You can also type <code>!exr -help</code> to pull up this menu again, if necessary.</em></p>';
    outhtml += '<br />';

    outhtml += '<p style="' + pStyle + '">The following table explains the various commands.</p>';

    var outhtml2 = '<table style="' + tableStyle + '">';
    outhtml2 += '<tr><th style="' + tdStyle + ' ' + thStyle + '">Command</th><th style="' + tdStyle + ' ' + thStyle + '">Explanation</th></tr>';

    outhtml2 += '<tbody>';
    outhtml2 += '<tr>';
    outhtml2 += '<td style="' + tdStyle + '">';
    outhtml2 += '<p style="' + pStyle + ' ' + thStyle + '"><code>-d / -D [l]</code></p>';
    outhtml2 += '</td>';
    outhtml2 += '<td style="' + tdStyle + '">';
    outhtml2 += '<p style="' + pStyle + '">These commands cover doubling of successful results. <code>-d</code>, followed by a comma-delimited list of values ';
    outhtml2 += 'to double, automatically doubles 10s. <code>-D</code> does not (mostly useful for damage rolls). <code>-d</code> without arguments is ';
    outhtml2 += 'unnecessary, as the script will double 10s by default. You <em>may</em> pass <code>-D</code> by itself, to double nothing.</p>';
    outhtml2 += '<p style="' + pStyle + '">The optional <code>l</code> modifier covers cases where a charm or effect offers limited doubled results. '
    outhtml2 += 'Just add <code>l</code> and the maximum number of doubles after the command, <em>e.g.,</em> <code>-dl5</code>.</p>';
    outhtml2 += '</td>';
    outhtml2 += '</tr>';

    var outhtml3 = '<tr>';
    outhtml3 += '<td style="' + tdStyle + ' ' + thStyle + '">';
    outhtml3 += '<p style="' + pStyle + ' ' + thStyle + '"><code>-r / -R [l]</code></p>';
    outhtml3 += '</td>';
    outhtml3 += '<td style="' + tdStyle + '">';
    outhtml3 += '<p style="' + pStyle + '">These cover rerolls. <code>-r</code> provides single rerolls—once the values have been rerolled once, that\'s it. ';
    outhtml3 += 'It also defaults to keeping the higher of the two results (if you need to keep the second roll regardless, pass the <code>l</code> modifier, ';
    outhtml3 += 'below). <code>-R</code> is a <em>recursive</em> reroll, and covers the cases where a charm or effect instructs you to "reroll [x]s until [x]s ';
    outhtml3 += 'fail to appear." It will keep rerolling the results in the comma-delimited list of arguments until those values are no longer in the pool, for ';
    outhtml3 += 'better or for worse.</p>';
    outhtml3 += '<p style="' + pStyle + '">The optional <code>l</code> modifier behaves differently than above here. As mentioned briefly before, this modifier ';
    outhtml3 += 'signals the script that you want to keep the rerolled value, regardless of which is higher. The syntax for such a command would look like ';
    outhtml3 += '<code>-rl 6,4</code>, for example. As -R is going to keep rolling until identical ';
    outhtml3 += 'results fail to appear, this modifier has no effect on those rolls</p>';
    outhtml3 += '</td>';
    outhtml3 += '</tr>';
    outhtml3 += '</tbody>';

    outhtml3 += '</table>';
    outhtml3 += '</div>';

    return outhtml + outhtml2 + outhtml3;
}


/**
 * This PMs an error message to the user in the event that it doesn't understand something.
 *
 * @param JavaScript Object Reference	result		The content of the rollresult message, as above.
 * @param string						sender		The name of the player who sent the command. Corresponds to msg.who in the original on() function call.
 *
 * @return void
 */
function printError(result, sender) {
    logger(LOGLEVEL.ERROR, 'Error!');

    if (result.type == 'error' ) {
        sendChat('EX3Dice API', '/w ' + sender + ' I tried, but Roll20 had a problem with this. They said: ' + result.content);
    } else {
        sendChat('EX3Dice API', '/w ' + sender + ' Sorry, I didn\'t understand your input. Please try again.');
    }
}
