/* eslint-disable no-undef */
/* eslint-disable no-sparse-arrays */
/**
 * Exalted 3rd Edition Dice Roller
 * @author Mike Leavitt
 * Forked after 1.0 to modify heavily
 * @author Sylvain "Groch" CLIQUOT
 * Discord: Groch#0102
 * Github: https://github.com/groch/roll20_exalted_stuff
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
const LogLvl = LOGLEVEL.DEBUG,
  ConditionalList = {
    '1MotD': {
        faceTrigger: (setup, result, condIterator) => !setup.rerolled && setup.successSnapshot,
        diceCheckMethod: handleFaceCondition1MotD, //(result, setup, item, turn, condIterator)
        getDetailMethod: detailsCond1MotDSectionDone, //f(condObj, showDone = false)
        defaultConditionObj: {
            name: '1MotD',
            status: [,,,,,,,0,0,0,0],
            remainingToDo: 0,
            statusTotal: [,,,,,,,0,0,0,0],
            totalRerolled: 0
        },
        finalizeDefaultConditionObj: (obj, result) => {
            logger('finalizeDefaultConditionObj::Cond 1MotD')
            for (var i = 1; i < result.rollSetup.face.length; i++) {
                if (result.rollSetup.face[i].successes.length) {
                    logger(`finalizeDefaultConditionObj::1MotD - SETTING DEFAULT FOR i=${i}, obj=${obj}`);
                    obj.status[i] = 0;
                    obj.statusTotal[i] = 0;
                }
            }
        }
    },
    'DIT': {
        faceTrigger: (setup, result, condIterator) => setup.success || setup.doubled,
        diceCheckMethod: handleFaceConditionDIT, //(result, setup, item, turn, condIterator)
        turnHook: null, //f(result, turn, nextRollsToProcess, condIterator)
        getDetailMethod: detailsCondDITSectionDone, //f(condObj, showDone = false)
        defaultConditionObj: {
            name: 'DIT',
            status: 0,
            done: 0
        },
        finalizeDefaultConditionObj: null //finalizeDefaultConditionObjDIT
    },
    'HMU': {
        faceTrigger: (setup, result, condIterator) => setup.success || setup.doubled,
        diceCheckMethod: handleFaceConditionDIT, //(result, setup, item, turn, condIterator)
        turnHook: handleTurnConditionalHookHMU, //f(result, turn, nextRollsToProcess, condIterator)
        getDetailMethod: detailsCondDITSectionDone, //f(condObj, showDone = false)
        defaultConditionObj: {
            name: 'HMU',
            status: 0,
            done: 0,
            firstTurnSuccesses: 0
        },
        finalizeDefaultConditionObj: null //finalizeDefaultConditionObjDIT
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
  },
  DefaultRollHandlingSetup = {
    face: null,
    faceObj: null,
    titleText: '',
    tagList: [],
    rerolled: false,
    exploded: false,
    success: false,
    doubled: false,
    producedADie: false,
    toNextRollRerolled: null,
    toNextRollExploded: null,
    toNextRollCondi: [],
    rerollSnapshot: null,
    rerollSectionDone: null,
    successSnapshot: null,
    successSectionDone: null,
    doubleSnapshot: null,
    doubleSectionDone: null,
    explodeSnapshot: null,
    explodeSectionDone: null,
    condiSectionDone: []
  },
  ParserConfig = [{
        categoryName: 'Rerolls',
        pattern: /^(r|R)(l\d*)?(k|K)?(?:\s([\d,]+))?(?:\sTAGS=([(?:\w)+,]+))?$/,
        getCmdObj: (matchReturn) => ({
          cmd:      matchReturn[1],
          limit:    matchReturn[2] ? Number(matchReturn[2].substring(1)) : 0,
          keepBest: matchReturn[3] ? true : false,
          faces:    [...matchReturn[4].split(',').filter(i => i).map(i => Number(i))],
          tagList:  matchReturn[5] ? [...matchReturn[5].split(',').filter(i => i)] : []})
    },{
        categoryName: 'Doubles & Explodes',
        pattern: /^(d|e|E)(l\d*)?(?:\s([\d,]+))?$/,
        getCmdObj: (matchReturn) => ({
            cmd:    matchReturn[1],
            limit:  matchReturn[2] ? Number(matchReturn[2].substring(1)) : 0,
            faces:  [...matchReturn[3].split(',').filter(i => i).map(i => Number(i))]})
    },{
        categoryName: 'Successes',
        pattern: /^(s)(l\d*)?(?:\s([\d,]+))?$/,
        getCmdObj: (matchReturn) => ({
            cmd:    matchReturn[1],
            limit:  matchReturn[2] ? Number(matchReturn[2].substring(1)) : 0,
            faces:  [...matchReturn[3].split(',').filter(i => i).map(i => Number(i))]})
    },{
        categoryName: 'GM, D, Turn, Verbosity, color, onlyResult, reverseTitle',
        pattern: /^(g|gm|D|target|turn|v|V|c|o|onlyResult|rev|reverseTitle)$/,
        getCmdObj: (matchReturn) => ({
            cmd:    matchReturn[1]})
    }],
  tableStyle = 'border-collapse: collapse; width: 100%; color: black;',
  thStyle = 'text-align: center;',
  tdStyle = 'padding: 5px; border: 1px solid rgb(200,200,200);',
  divStyle = 'border: 1px solid rgb(200,200,200); border-radius: 3px; background-color: white; padding: 5px; margin: 10px 0px; color: black;',
  pStyle = 'margin: 5px 0px; line-height: 1.5;',
  helpData = [
      {
          arrayfirstCol:['-d NB,...','-d[lNB]','-D'],
          arraySecondCol:[
"These commands cover doubling of all successful corresponding face(s).\
 <code>-d</code>, followed by a comma-delimited list of values to double, automatically doubles 10s.\
 <code>-D</code> prevent this (mostly useful for damage rolls).\
 <code>-d</code> without arguments is unnecessary, as the script will double 10s by default.\
 You <em>may</em> pass <code>-D</code> by itself, to double nothing.",
'The optional <code>l</code> signals the script to limit the number of doubles. Example :<code>-dl1 8,9</code>.',
"The optional <code>l</code> modifier covers cases where a charm or effect offers limited doubled results.\
 Just add <code>l</code> and the maximum number of doubles after the command, <em>e.g.,</em> <code>-dl5 8</code>.\
 These command can be stacked, consuming smallest limit first and trying to do all the limit,\
 <em>e.g.,</em> <code>-dl3 8,9 -dl2 9</code> would try to reroll 5 9s, first consuming the limit '2' then '3'\
 This is the case for each command using the <code>l</code> optional code"
          ],
      },
      {
        arrayfirstCol:['-s NB,...','-s[lNB]'],
        arraySecondCol:[
"These commands cover adding faces as success.\
<code>-s</code>, followed by a comma-delimited list of values to add as success, useless without arguments.",
'The optional <code>l</code> signals the script to limit the number of this/these faces counting as success. Example :<code>-sl3 2,5,6</code>.',
"The optional <code>l</code> modifier covers really rare cases where a charm or effect enable other sides as succes (sidereals for example).\
 Follow rules described in first command"
        ],
      },
      {
        arrayfirstCol:['-r NB,...','-r[lNB] NB','-r[k|K] NB','-r NB TAGS=LABEL,...','-R NB,...','-R[lNB] NB','-R[k|K] NB','-R NB TAGS=LABEL,...'],
        arraySecondCol:[
'These commands cover rerolls, followed by a comma-delimited list of values to reroll\
 <code>-r</code> provides single rerolls—once the values have been rerolled once.\
 <code>-R</code> is a <em>recursive</em> reroll, and covers the cases where a charm or effect instructs you to "reroll [x]s until [x]s fail to appear."\
 It will keep rerolling the results in the comma-delimited list of arguments until those values are no longer in the pool, for better or for worse.\
 By default, rerolled dice are hidden, see <code>-v|V</code> below.',
'The optional <code>l</code> signals the script to limit the number of rerolls. Example :<code>-rl 6,4</code>.',
'The optional <code>k|K</code> signals the script that you want to keep the highest rerolled value. Example :<code>-rk 1</code>.',
'The optional <code>TAGS=LABEL,LABEL,...</code> signals the script that you tag the rerolled dice with some label (usefull for some specific charms). Example :<code>-r 1,2 TAGS=charm1</code>.',
'Everything above can be combined. Example :<code>-Rl3K 1,2,3 TAGS=charm42OP</code>.'
        ],
      },
      {
        arrayfirstCol:['-e NB,...','-e[lNB]','-E NB,...','-E[lNB]'],
        arraySecondCol:[
"These commands cover exploding of faces, creating new dice when happening.\
 <code>-e</code>, followed by a comma-delimited list of values to explode, not exploding on rerolled dices.\
 <code>-E</code> works the same as above but ignore if dice is rerolled, exploding each time the face is encountered.\
 <code>-e/E</code> without arguments is useless.",
'The optional <code>l</code> signals the script to limit the number of explodes. Example :<code>-el1 8,9</code>.',
"The optional <code>l</code> modifier covers cases where a charm or effect offers limited doubled results. Follow rules described in first command"
        ],
      },
      {
        arrayfirstCol:['-g', '-gm'],
        arraySecondCol:["This commands is used to hide roll to other players. Example :<code>!exr 42#+2 -el1 8,9 -gm</code>."],
      },
      {
        arrayfirstCol:['-target', '-turn'],
        arraySecondCol:[
"This command is used to set result as turn tracker value for selected token.\
 do nothing more than a roll if no token is selected"
        ],
      },
      {
        arrayfirstCol:['-v', '-V', '-c'],
        arraySecondCol:[
"These commands are used to increase visual information included in the roll.",
"<code>-v</code> is 1st level of verbosity, including 'roll turns' markers to track limits and rerolls.\
 <code>-c</code> is color shadows, used to track visually which dice is rerolled, which come from a reroll, same for exploding & conditionals.\
 <code>-V</code> is a short hand for -v -c",
"Example :<code>!exr 42#+2 -v -c -gm</code>."
        ],
      },
      {
        arrayfirstCol:['-rev', '-reverseTitle'],
        arraySecondCol:["This command is used to reverse order of title (hover text on each dice) informations."],
      },
      {
        arrayfirstCol:['-o', '-onlyResult'],
        arraySecondCol:["This command is used to hide dices and only show result."],
      },
      {
        arrayfirstCol:[...Object.keys(ConditionalList).map(i => `-${i}`)],
        arraySecondCol:[
"These commands are conditionals triggers, name are abreviation from book, you should refer to the book for these ones and contact the developper if something feel off.",
"Actually there is :",
'- 1MotD: CRAFT=> First Movement of the Demiurge, Exalte Core, p298',
'- DIT: CRAFT=> Divine Inspiration Technique, Exalte Core, p298',
'- HMU: CRAFT=> Holistic Miracle Understanding (version ameliorée de DIT), Exalte Core, p299'
        ],
      }
  ];

function setupRollStructure(result) {
    result.rollSetup = JSON.parse(JSON.stringify(DefaultRollSetup));

    for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        result.rollSetup.face.push({
            face: i,
            rerolls: [],
            explosives: [],
            successes: [],
            doubles: []
        });
    }

    for (const i of [7, 8, 9, 10])
        result.rollSetup.face[i].successes.push({limit: 0, done: 0});

    logger(`setupRollStructure::result.rollSetup=${JSON.stringify(result.rollSetup)}`);
}

/**
 * FINALIZE DEFAULT CONDITION OBJECTS
 */
// function finalizeDefaultConditionObjDIT(obj, result, nextRollsToProcess) {
//     if (result.addedSuccesses) {
//         obj.status = result.addedSuccesses;
//         result.rollSetup.finalResults.push(makeSectionDoneObj('Cond-DIT', conditionalColor, `&#013;&#010; Success added to roll stored=${result.addedSuccesses}`));
//         while (obj.status >= 3) {
//             obj.status -= 3;
//             // eslint-disable-next-line no-undef
//             var newDie = randomInteger(10);
//             logger(`finalizeDefaultConditionObjDIT::newDie=${newDie}`);
//             nextRollsToProcess.push({
//                 v: newDie, wasEverRerolled: false,
//                 wasRerolled: false, wasExploded: false, wasConditionallyAffected: true,
//                 title: [`RollTurn (2  ). DIT            ->Face=${strFill(newDie)}.`],
//                 tagList: ['DIT']
//             });
//             obj.done++;
//         }
//     }
// }

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
		var patt = /^.*#/;

		if (patt.test(rawCmd)) {
			var parseCmd = rawCmd.replace('#', 'd10>7');
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

    var pageId = getObj('graphic', selectedTokenId[0]).get('pageid');
    if (idTurnToCreate.length > 0) {
        for (const id of idTurnToCreate) {
            logger(LOGLEVEL.INFO, `setTurnOrder::pushing to turnorder id=${id} pr=${successes}`);
            turnOrder.push({id:id,pr:successes,custom:'',_pageid:pageId});
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

            parseAddedSuccesses(result, msg.content);

            if (!_.isEmpty(cmds)) processCmds(cmds, result);
            if (result.rollSetup.has10doubled) result.rollSetup.face[10].doubles.push({limit: 0, done: 0});
            finalizeRoll(result);

            const player = getObj("player", msg.playerid);
            var outHTML = buildHTML(result, ops[0].origRoll, player);
            if (!outHTML) {
                logger(LOGLEVEL.EMERGENCY, 'performRoll:: !!!!!!!!! outHTML IS NULL OR EMPTY !!!!!!!!!!');
                return;
            }

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

    var objRet, match = false, ret, patt;
    for (var i = 0; i < ParserConfig.length; i++) {
        if ((ret = trim.match(ParserConfig[i].pattern))) {
            match = true;
            logger(LOGLEVEL.NOTICE, `parseCmds::MATCH${i+1} = ${ParserConfig[i].categoryName}`);
            logger('parseCmds::ret='+JSON.stringify(ret));
            objRet = ParserConfig[i].getCmdObj(ret);
            break;
        }
    }

    if (!match) {
        for (const condItem of Object.keys(ConditionalList)) {
            patt = new RegExp(`^(${condItem})$`);
            if ((ret = trim.match(patt))) {
                match = true;
                logger(LOGLEVEL.NOTICE, `parseCmds::MATCH - Conditional Item = ${condItem}`);
                logger('parseCmds::ret='+JSON.stringify(ret));
                objRet = {cmd: ret[1]};
            }
        }
    }

    logger(LOGLEVEL.INFO, `parseCmds::FINAL match=${match} objRet=${JSON.stringify(objRet)}`);
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
        // else default Parsing
        switch (String(item.cmd)) {
            case 'R':
                recReroll = true; // break omitted because same treatment
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
                exploIgnore = false; // break omitted because same treatment
            case 'e':
                for (const face of item.faces) {
                    logger(LOGLEVEL.INFO, `processCmds::adding explode on face=${face}, limit=${item.limit}, exploIgnore=${exploIgnore}`);
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
            case 's':
                logger(LOGLEVEL.INFO, `processCmds::adding success on faces=${item.faces}, limit=${item.limit}`);
                for (const face of item.faces) result.rollSetup.face[face].successes.push({limit: item.limit, done: 0});
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
                result.rollSetup.colored = true; // break omitted because same treatment
            case 'v':
                result.rollSetup.verbosity = verbosityToSet; // break omitted because default rule fallback
            default:
                break;
        }
    }

    for (const item of cmds) {
        // create Conditional Default Item + Init
        if (Object.keys(ConditionalList).includes(item.cmd)) {
            var dupedDefaultConditionObj = JSON.parse(JSON.stringify(ConditionalList[item.cmd].defaultConditionObj));
            logger(LOGLEVEL.NOTICE, `processCmds::COND ENABLING obj=${JSON.stringify(dupedDefaultConditionObj)}`);
            result.rollSetup.conditionalActivated.push(dupedDefaultConditionObj);
            continue;
        }
    }

    logger(`processCmds::processCmds END`);
}

function recountSuccesses(result) {
    logger(LOGLEVEL.INFO, `doDoubles::doDoubles do10s=${result.rollSetup.has10doubled}, result=${JSON.stringify(result)}`);

    var newTotal = 0, addSucc = 0;
    for (const item of result.rollSetup.finalResults) {
        if (item.v === 'SECTIONDONE') continue;
        if (!item.rerolled && item.success) newTotal++;
        if (!item.rerolled && item.doubled) addSucc += 1;
    }
    logger(LOGLEVEL.INFO, `doDoubles::NEW result.total=${newTotal} + ${addSucc}`);
    result.total = newTotal + addSucc;
}

/**
 * Perform the roll with settings created during previous steps.
 *
 * @param JavaScript Object reference	result		The content of the rollresult message, as above; now in its final version, with all rolls and successes
 *														accurately calculated.
 */
function finalizeRoll(result) {
    logger(LOGLEVEL.INFO, `finalizeRoll::finalizeRoll result=${JSON.stringify(result)}`);

    result.rollSetup.rollToProcess = result.rolls[0].results;
    logger(`finalizeRoll::finalizeRoll rollToProcess=${JSON.stringify(result.rollSetup.rollToProcess)}`);
	if (typeof result.rollSetup.rollToProcess == 'undefined') {
        logger(LOGLEVEL.ERROR, `finalizeRoll::finalizeRoll ERROR QUITTING !!!!`);
        return;
    }

    sortRerollsAndExplosives(result);

    logger(`finalizeRoll::FINAL rollSetup=${JSON.stringify(result.rollSetup)}`)
    var turn = 1;
    do {
        logger(LOGLEVEL.NOTICE, `MEGATURN(${turn}) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        handleRollTurn(result, turn++);
        if (turn > 420) break;
    } while (result.rollSetup.rollToProcess.length > 0)
    if (turn >= 420) result.rollSetup.maxRecursiveAchieved = true;

    handleSectionCleaning(result, true);
    recountSuccesses(result);

    logger(`finalizeRoll::rewriting result.rolls[0].results=${JSON.stringify(result.rollSetup.finalResults)}`);
    result.rolls[0].results = result.rollSetup.finalResults;
}

function sortRerollsAndExplosives(result) {
    for (var i = 1; i <= 10; i++) {
        var face = result.rollSetup.face[i];
        face.rerolls.sort((a, b) => {
            if ((a.recursive && !b.recursive) || (!a.limit && b.limit)) return 1;
            if ((!a.recursive && b.recursive) || (a.limit && !b.limit)) return -1;
            return a.limit - b.limit;
        });
        face.explosives.sort((a, b) => {
            if ((!a.ignoreRerolled && b.ignoreRerolled) || (!a.limit && b.limit)) return 1;
            if ((a.ignoreRerolled && !b.ignoreRerolled) || (a.limit && !b.limit)) return -1;
            return a.limit - b.limit;
        });
        face.successes.sort((a, b) => {
            if (!a.limit && b.limit) return 1;
            if (a.limit && !b.limit) return -1;
            return a.limit - b.limit;
        });
        face.doubles.sort((a, b) => {
            if (!a.limit && b.limit) return 1;
            if (a.limit && !b.limit) return -1;
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

    if (turn === 1)
        for (const confObj of result.rollSetup.conditionalActivated)
            if (ConditionalList[confObj.name].finalizeDefaultConditionObj) ConditionalList[confObj.name].finalizeDefaultConditionObj(confObj, result, nextRollsToProcess);

    for (const item of result.rollSetup.rollToProcess) {
        var setup = JSON.parse(JSON.stringify(DefaultRollHandlingSetup));
        setup.face = item.v, setup.faceObj = result.rollSetup.face[setup.face], setup.wasConditionallyAffected = item.wasConditionallyAffected;
        if (item.tagList && item.tagList.length) for (const tag of item.tagList) setup.tagList.push(tag);
        handleRoll(result, setup, item, turn);
        var finalObj = {
            v:                  setup.face,                    tags:                     setup.tagList,
            success:            setup.success,                 doubled:                  setup.doubled,
            wasEverRerolled:    item.wasEverRerolled || false, wasRerolled:              item.wasRerolled || false,
            wasExploded:        item.wasExploded || false,     wasConditionallyAffected: item.wasConditionallyAffected || false,
            rerolled:           setup.rerolled,                exploded:                 setup.exploded,
            condTriggered:      setup.producedADie,            condRerolled:             false,
            title: item.title ? makeNewTitleFromOld(result, item.title, setup.titleText) : [`Roll Initial.${result.rollSetup.conditionalActivated.length ? condiPadder : ''}            Face=${strFill(setup.face)}.${setup.titleText}`]
        };
        logger(LOGLEVEL.NOTICE, `handleRollTurn::face(${setup.face}) =>finalObj=${finalObj.v} rerolled=${setup.rerolled} exploded=${setup.exploded} FULL=${JSON.stringify(finalObj)}`);
        result.rollSetup.finalResults.push(finalObj);
        if (setup.rerolled || setup.rerollSnapshot && setup.rerollSnapshot.recursive) updateTitleAndPushToNextRolls(result, setup.toNextRollRerolled, finalObj, nextRollsToProcess, setup.rerollSectionDone);
        if (setup.successSectionDone)                                                 result.rollSetup.finalResults.push(setup.successSectionDone);
        if (setup.doubleSectionDone)                                                  result.rollSetup.finalResults.push(setup.doubleSectionDone);
        if (setup.exploded)                                                           updateTitleAndPushToNextRolls(result, setup.toNextRollExploded, finalObj, nextRollsToProcess, setup.explodeSectionDone);
        if (setup.producedADie && setup.toNextRollCondi)                              updateTitleAndPushToNextRolls(result, setup.toNextRollCondi,    finalObj, nextRollsToProcess, setup.condiSectionDone);
    }

    if (turn === 1 || result.rollSetup.verbosity >= 1)
        result.rollSetup.finalResults.push({v: 'SECTIONDONE', sectionType: (turn === 1 ? 'Initial Roll' : `Additional Rolls n${turn-1}`), color: initialRollColor, details: ''});

    handleTurnConditionalHook(result, turn, nextRollsToProcess);

    logger(LOGLEVEL.INFO, `handleRollTurn::END nextRollsToProcess=${nextRollsToProcess.map(i => i.v)} FULL=${JSON.stringify(nextRollsToProcess)}`);
    result.rollSetup.rollToProcess = nextRollsToProcess;
    if (turn === 1 || result.rollSetup.verbosity >= 1)
        handleSectionCleaning(result);
}

function handleTurnConditionalHook(result, turn, nextRollsToProcess) {
    logger(LOGLEVEL.INFO, `handleTurnConditionalHook::TURN CONDITIONAL-ALL-TESTS !`);

    var condIterator = 0;
    do {
        for (; condIterator < result.rollSetup.conditionalActivated.length; condIterator++) {
            var condConfig = ConditionalList[result.rollSetup.conditionalActivated[condIterator].name];
            logger(`handleRollTurn::testing section=${JSON.stringify(condConfig)}`);
            if (condConfig.turnHook) {
                logger(LOGLEVEL.INFO ,`handleRollTurn::HANDLING TURN ON Section=${JSON.stringify(condConfig)}`);
                condConfig.turnHook(result, turn, nextRollsToProcess, condIterator);
            }
        }
    } while (condIterator != result.rollSetup.conditionalActivated.length);

    logger(LOGLEVEL.INFO, `handleTurnConditionalHook::END TURN CONDITIONAL-ALL-TESTS`);
}

function handleTurnConditionalHookHMU(result, turn, nextRollsToProcess, condIterator) {
    if (turn !== 2) return;
    var cond = result.rollSetup.conditionalActivated[condIterator];
    if (cond.firstTurnSuccesses >= 3) {
        result.rollSetup.finalResults.push(makeSectionDoneObj('Cond-HMU', conditionalColor, `&#013;&#010; HMU generated 3 or more success (${cond.firstTurnSuccesses}) => Adding 3 dices`));
        for (var i = 0; i < 3; i++) {
            var newDie = randomInteger(10);
            nextRollsToProcess.push({
                v: newDie, wasEverRerolled: false,
                wasRerolled: false, wasExploded: false, wasConditionallyAffected: true,
                title: [`RollTurn (${strFill(turn + 1)}). C(HMU)    ->Face=${strFill(newDie)}.`],
                tagList: ['HMU']
            });
            cond.done++;
        }
    }
}

function handleRoll(result, setup, item, turn) {
    logger(`handleRollTurn::face(${setup.face}) rerolls.length=${setup.faceObj.rerolls.length}, explosives.length=${setup.faceObj.explosives.length}, doubles.length=${setup.faceObj.doubles.length}, conditionalActivated.length=${result.rollSetup.conditionalActivated.length}`);
    if (setup.faceObj.rerolls.length)
        handleFaceReroll(setup, item, turn, result.rollSetup.conditionalActivated.length);
    if (!setup.rerolled && setup.faceObj.successes.length)
        handleFaceSuccess(setup);
    if (setup.faceObj.doubles.length && !setup.rerolled)
        handleFaceDouble(setup);
    if (setup.faceObj.explosives.length)
        handleFaceExplode(setup, item, turn, result.rollSetup.conditionalActivated.length);
    if (result.rollSetup.conditionalActivated.length)
        handleFaceConditionals(result, setup, item, turn);
}

function handleFaceReroll(setup, item, turn, condiLength) {
    setup.rerollSnapshot = setup.faceObj.rerolls[0];
    var reroll = randomInteger(10);
    logger(LOGLEVEL.INFO, `handleRollTurn::face(${setup.face}) REROLL TO DO ! section=${JSON.stringify(setup.faceObj.rerolls[0])}`);
    if (setup.faceObj.rerolls[0].recursive || (!(setup.faceObj.rerolls[0].keepBest && reroll < setup.face) && !item.wasRerolled)) {
        setup.rerolled = !setup.faceObj.rerolls[0].keepBest || reroll > setup.face;
        var rerolledVal = (setup.faceObj.rerolls[0].keepBest && reroll < setup.face) ? setup.face : reroll;
        setup.toNextRollRerolled = {
            v: rerolledVal, wasEverRerolled: true,
            wasRerolled: true, wasExploded: false, wasConditionallyAffected: false,
            title: [`RollTurn (${strFill(turn + 1)}). R${condiLength ? condiPadder : ''} ->Face=${strFill(rerolledVal)}.`]
        };
    }
    setup.faceObj.rerolls[0].done++;
    setup.titleText += ` ${setup.rerolled ? 'Rerolled to a' : 'Not Reroll to'} ${strFill(reroll)}`
        + (setup.faceObj.rerolls[0].limit != 0
            ? ` (Done${setup.faceObj.rerolls[0].done}/${setup.faceObj.rerolls[0].limit} ).`
            : ` ( Done${strFill(setup.faceObj.rerolls[0].done)} ).`);
    if (setup.faceObj.rerolls[0].limit != 0 && setup.faceObj.rerolls[0].limit == setup.faceObj.rerolls[0].done) {
        setup.rerollSectionDone = removeFirstRerollSection(setup.faceObj);
    }
}

function handleFaceSuccess(setup) {
    setup.successSnapshot = setup.faceObj.successes[0];
    logger(LOGLEVEL.INFO, `handleRollTurn::face(${setup.face}) SUCCESS ! section=${JSON.stringify(setup.faceObj.successes[0])}`);
    setup.success = true;
    setup.faceObj.successes[0].done++;
    if (setup.faceObj.successes[0].limit != 0 && setup.faceObj.successes[0].limit == setup.faceObj.successes[0].done)
        setup.successSectionDone = removeFirstSuccessSection(setup.faceObj);
}

function handleFaceDouble(setup) {
    setup.doubleSnapshot = setup.faceObj.successes[0];
    logger(LOGLEVEL.INFO, `handleRollTurn::face(${setup.face}) DOUBLE  ! section=${JSON.stringify(setup.faceObj.doubles[0])}`);
    setup.doubled = true;
    setup.faceObj.doubles[0].done++;
    if (setup.faceObj.doubles[0].limit != 0 && setup.faceObj.doubles[0].limit == setup.faceObj.doubles[0].done)
        setup.doubleSectionDone = removeFirstDoubleSection(setup.faceObj);
}

function handleFaceExplode(setup, item, turn, condiLength) {
    var newDie = randomInteger(10);
    logger(LOGLEVEL.INFO, `handleRollTurn::face(${setup.face}) EXPLOSIVE TO DO ! section=${JSON.stringify(setup.faceObj.explosives[0])} rerolled=${setup.rerolled}`);
    var iterator = 0;
    for (; iterator < setup.faceObj.explosives.length && !(!setup.faceObj.explosives[iterator].ignoreRerolled || (!setup.rerolled && !item.wasEverRerolled)); iterator++);
    if (iterator == setup.faceObj.explosives.length) {
        logger(`handleRollTurn::NO EXPLO MATCHING IN ${iterator} ITEMS. explosives=${JSON.stringify(setup.faceObj.explosives)}`);
    } else {
        setup.explodeSnapshot = setup.faceObj.explosives[iterator];
        logger(`handleRollTurn::EXPLO iterator=${iterator} TEST=${!setup.faceObj.explosives[iterator].ignoreRerolled || (!setup.rerolled && !item.wasRerolled)}, part1=${!setup.faceObj.explosives[iterator].ignoreRerolled}, part2=${!setup.rerolled}, part3=${!item.wasRerolled}`);
        if (!setup.faceObj.explosives[iterator].ignoreRerolled || (!setup.rerolled && !item.wasEverRerolled)) {
            setup.exploded = true;
            setup.toNextRollExploded = {
                v: newDie, wasEverRerolled: item.rerolled || true,
                wasRerolled: false, wasExploded: true, wasConditionallyAffected: false,
                title: [`RollTurn (${strFill(turn + 1)}). E${condiLength ? condiPadder : ''} ->Face=${strFill(newDie)}.`]
            };
            setup.faceObj.explosives[iterator].done++;
            setup.titleText += ` Explode to a ${strFill(newDie)} ` + (setup.faceObj.explosives[iterator].limit != 0
                ? ` (Done${setup.faceObj.explosives[iterator].done}/${setup.faceObj.explosives[iterator].limit} ).`
                : ` ( Done${strFill(setup.faceObj.explosives[iterator].done)} ).`);
            if (setup.faceObj.explosives[iterator].limit != 0 && setup.faceObj.explosives[iterator].limit == setup.faceObj.explosives[iterator].done) {
                setup.explodeSectionDone = removeIteratorExplodeSection(setup.faceObj, iterator);
            }
        }
    }
}

function handleFaceConditionals(result, setup, item, turn) {
    logger(LOGLEVEL.INFO, `handleRollTurn::face(${setup.face}) CONDITIONAL-ALL-TESTS ! rerolled=${setup.rerolled} exploded=${setup.exploded}`);

    var condIterator = 0;
    do {
        for (; condIterator < result.rollSetup.conditionalActivated.length; condIterator++) {
            var condConfig = ConditionalList[result.rollSetup.conditionalActivated[condIterator].name];
            logger(`handleRollTurn::face(${setup.face}) section=${JSON.stringify(condConfig)}`);
            var localToNextRollCondi = null, localCondiSectionDone;
            if (condConfig && condConfig.faceTrigger(setup, result, condIterator)) {
                ({ localToNextRollCondi, localCondiSectionDone } = condConfig.diceCheckMethod(result, setup, item, turn, condIterator));
                logger(`handleRollTurn::after diceCheckMethod, localToNextRollCondi=${JSON.stringify(localToNextRollCondi)}`);
                if (setup.producedADie && localToNextRollCondi)
                    setup.toNextRollCondi.push(localToNextRollCondi);
                if (localCondiSectionDone) {
                    setup.condiSectionDone.push(localCondiSectionDone);
                    break;
                }
            }
        }
    } while (condIterator != result.rollSetup.conditionalActivated.length);

    logger(LOGLEVEL.INFO, `handleRollTurn::face(${setup.face}) END CONDITIONAL-ALL-TESTS ! toNextRollCondi.length=${setup.toNextRollCondi.length}`);
}

function handleFaceCondition1MotD(result, setup, item, turn, condIterator) {
    var toNextRollCondi, condiSectionDone = null, cond = result.rollSetup.conditionalActivated[condIterator];
    logger(LOGLEVEL.INFO, `handleFaceCondition1MotD::face(${setup.face}) CONDITIONAL-1MotD TO DO ! rerolled=${setup.rerolled} exploded=${setup.exploded} section=${JSON.stringify(cond)}`);
    cond.status[setup.face]++;
    logger(`handleFaceCondition1MotD::CONDI (cond.status[${setup.face}]=${cond.status[setup.face]} === 3)=${cond.status[setup.face] === 3}`);
    if (cond.status[setup.face] === 3) {
        cond.status[setup.face] = 0;
        cond.remainingToDo++;
    }
    if (cond.remainingToDo) {
        logger(LOGLEVEL.INFO, `handleFaceCondition1MotD::remainingToDo=${cond.remainingToDo}`);
        var diceNb = 1;
        for (var i=0; i < result.rollSetup.finalResults.length && cond.remainingToDo > 0; i++) {
            const dieTesting = result.rollSetup.finalResults[i];
            if (dieTesting.v === 'SECTIONDONE') continue;
            if (!dieTesting.success && !dieTesting.rerolled) {
                logger(LOGLEVEL.INFO, `handleFaceCondition1MotD::found a die to reroll ! turning into a 10 die no=${diceNb++} dieTesting=${JSON.stringify(dieTesting)}`);
                setup.producedADie = true;
                toNextRollCondi = {
                    v: 10, wasEverRerolled: true,
                    wasRerolled: true, wasExploded: false, wasConditionallyAffected: true,
                    title: [`RollTurn (${strFill(turn + 1)}). C(1MotD) ->Face=10.`]
                };
                dieTesting.condTriggered = false; //1MotD produce normal reroll but tagging for clarity
                dieTesting.rerolled = true, dieTesting.condRerolled = true, dieTesting.wasEverRerolled = true;
                logger(`handleFaceCondition1MotD::die rerolled =${JSON.stringify(result.rollSetup.finalResults[i])}`);
                cond.remainingToDo--,       cond.statusTotal[setup.face]++, cond.totalRerolled++;
                setup.titleText += ` 1MotD created a 10 (` + (cond.remainingToDo != 0 ? `Remaining:${cond.remainingToDo}, ` : '') + `Total=${cond.statusTotal[setup.face]}(${setup.face})/${cond.totalRerolled}).`;
            }
        }
    }
    // if (condition of removing section) condiSectionDone = removeIteratorCondSectionMethod(result, condIterator, true);
    logger(LOGLEVEL.EMERGENCY, `handleFaceCondition1MotD::QUITTING ! producedADie=${setup.producedADie}, titleText="${setup.titleText}", toNextRollCondi=${JSON.stringify(toNextRollCondi)}, condiSectionDone=${JSON.stringify(condiSectionDone)}`);
    return { localToNextRollCondi: toNextRollCondi, localCondiSectionDone: condiSectionDone };
}

function handleFaceConditionDIT(result, setup, item, turn, condIterator) {
    var toNextRollCondi, condiSectionDone = null, cond = result.rollSetup.conditionalActivated[condIterator];
    logger(LOGLEVEL.INFO, `handleFaceConditionDIT::face(${setup.face}) CONDITIONAL-DIT TO DO ! success=${setup.success} doubled=${setup.doubled} section=${JSON.stringify(cond)}`);
    cond.status += setup.doubled ? 2 : 1;
    if (turn === 2 && setup.tagList.includes('DIT')) cond.firstTurnSuccesses += setup.doubled ? 2 : 1;
    logger(`handleFaceConditionDIT::CONDI after cond.status=${cond.status} cond.done${cond.done}`);
    var createDie = false;
    if (cond.status >= 3) {
        cond.status -= 3;
        createDie = true;
    }
    if (createDie) {
        var newDie = randomInteger(10);
        logger(`handleFaceConditionDIT::newDie=${newDie}`);
        setup.producedADie = true;
        toNextRollCondi = {
            v: newDie, wasEverRerolled: false,
            wasRerolled: false, wasExploded: true, wasConditionallyAffected: true,
            title: [`RollTurn (${strFill(turn + 1)}). C(DIT)       ->Face=${strFill(newDie)}.`],
            tagList: ['DIT']
        };
        cond.done++;
        setup.titleText += ` DIT created a ${strFill(newDie)} ( Done${strFill(cond.done)}).`;
    }
    // if (condition of removing section) condiSectionDone = removeIteratorCondSectionMethod(result, condIterator, true);
    logger(LOGLEVEL.INFO, `handleFaceConditionDIT::QUITTING ! producedADie=${setup.producedADie}, titleText="${setup.titleText}", toNextRollCondi=${JSON.stringify(toNextRollCondi)}, condiSectionDone=${JSON.stringify(condiSectionDone)}`);
    return { localToNextRollCondi: toNextRollCondi, localCondiSectionDone: condiSectionDone };
}

/**
 * SECTION CLEANING
 */
function handleSectionCleaning(result, lastTurnClean = false) {
    logger(LOGLEVEL.INFO, 'handleSectionCleaning::CLEANING !');
    for (const faceClearing of [1,2,3,4,5,6,7,8,9,10]) {
        var faceObj = result.rollSetup.face[faceClearing];
        // remove non recursive reroll && push section accordingly
        while (faceObj.rerolls.length && (!faceObj.rerolls[0].recursive || lastTurnClean))
            result.rollSetup.finalResults.push(removeFirstRerollSection(faceObj, true));
        // remove doubles && push section accordingly
        while (lastTurnClean && faceObj.doubles.length)
            result.rollSetup.finalResults.push(removeFirstDoubleSection(faceObj, true));
        // remove non ignore explo && push section accordingly
        var i = 0;
        do {
            for (; i < faceObj.explosives.length; i++) {
                if (lastTurnClean || faceObj.explosives[i].ignoreRerolled) {
                    result.rollSetup.finalResults.push(removeIteratorExplodeSection(faceObj, i, true));
                    break;
                }
            }
        } while (i != faceObj.explosives.length);
    }
    // remove condActivated && push section accordingly
    logger(LOGLEVEL.INFO, `handleSectionCleaning::CLEANING COND ! length=${result.rollSetup.conditionalActivated.length}, full=${JSON.stringify(result.rollSetup.conditionalActivated)}`);
    while (lastTurnClean && result.rollSetup.conditionalActivated.length)
        result.rollSetup.finalResults.push(removeIteratorCondSectionMethod(result, 0, true));
}

function removeFirstSuccessSection(faceObj, showDone = false) {
    logger(LOGLEVEL.NOTICE, `doDoubles::SUCCESS SECTION DONE=${JSON.stringify(faceObj.successes[0])}`);
    var removedSuccessSection = {
        v: 'SECTIONDONE',
        sectionType: 'Success',
        color: successColor,
        details: `&#013;&#010; face: ${faceObj.face}&#013;&#010; limit: ${showDone ? faceObj.successes[0].done + '/' + faceObj.successes[0].limit : faceObj.successes[0].limit}`
    };
    faceObj.successes.shift();
    return removedSuccessSection;
}

function removeFirstDoubleSection(faceObj, showDone = false) {
    logger(LOGLEVEL.NOTICE, `doDoubles::DOUBLE SECTION DONE=${JSON.stringify(faceObj.doubles[0])}`);
    var removedDoubleSection = {
        v: 'SECTIONDONE',
        sectionType: 'Double',
        color: doubleColor,
        details: `&#013;&#010; face: ${faceObj.face}&#013;&#010; limit: ${showDone ? faceObj.doubles[0].done + '/' + faceObj.doubles[0].limit : faceObj.doubles[0].limit}`
    };
    faceObj.doubles.shift();
    return removedDoubleSection;
}

function removeFirstRerollSection(faceObj, showDone = false) {
    logger(LOGLEVEL.NOTICE, `removeFirstRerollSection::REROLL SECTION DONE=${JSON.stringify(faceObj.rerolls[0])}`);
    var rerollSectionDone = {
        v: 'SECTIONDONE',
        sectionType: 'Reroll',
        color: rerolledColor,
        details: `&#013;&#010; face: ${faceObj.face}&#013;&#010; limit: ${showDone ? faceObj.rerolls[0].done + '/' + faceObj.rerolls[0].limit : faceObj.rerolls[0].limit}&#013;&#010; keepBest: ${faceObj.rerolls[0].keepBest}&#013;&#010; recursive: ${faceObj.rerolls[0].recursive}&#013;&#010; tagList: '${faceObj.rerolls[0].tagList.join('\', \'')}'`
    };
    faceObj.rerolls.shift();
    return rerollSectionDone;
}

function removeIteratorExplodeSection(faceObj, iterator, showDone = false) {
    logger(LOGLEVEL.NOTICE, `removeIteratorExplodeSection::EXPLOSIVE SECTION DONE=${JSON.stringify(faceObj.explosives[iterator])}`);
    var explodeSectionDone = {
        v: 'SECTIONDONE',
        sectionType: 'Explode',
        color: explodedColor,
        details: `&#013;&#010; face: ${faceObj.face}&#013;&#010; limit: ${showDone ? faceObj.explosives[iterator].done + '/' + faceObj.explosives[iterator].limit : faceObj.explosives[iterator].limit}&#013;&#010; ignoreRerolled: ${faceObj.explosives[iterator].ignoreRerolled}`
    };
    faceObj.explosives.splice(iterator, 1);
    return explodeSectionDone;
}

function removeIteratorCondSectionMethod(result, iterator, showDone = false) {
    var condObj = result.rollSetup.conditionalActivated[iterator];
    logger(LOGLEVEL.NOTICE, `removeIteratorCondSectionMethod::Global COND SECTION id=${iterator} to Remove=${JSON.stringify(condObj)}`);
    var condSectionDone = makeSectionDoneObj(`Cond-${condObj.name}`, conditionalColor, ConditionalList[condObj.name].getDetailMethod(condObj, showDone));
    result.rollSetup.conditionalActivated.splice(iterator, 1);
    return condSectionDone;
}

function detailsCond1MotDSectionDone(condObj, showDone = false) {
    logger(LOGLEVEL.NOTICE, `detailsCond1MotDSectionDone::COND-1MotD Detail SECTION DONE=${JSON.stringify(condObj)}`);
    var detail = `&#013;&#010; Remaining To DO=${condObj.remainingToDo}&#013;&#010; Total Rerolled =${condObj.totalRerolled}`;
    const faceList = condObj.statusTotal.map((i, index) => Number.isInteger(i) ? index : null).filter(i => i);
    logger(`detailsCond1MotDSectionDone::faceList=${faceList}`);
    if (showDone)
        for (const i of faceList) detail += `&#013;&#010; ${strFill(i)}: ${condObj.status[i]}/3-RerollTriggered=${condObj.statusTotal[i]}`;
    return detail;
}

function detailsCondDITSectionDone(condObj, showDone = false) {
    logger(LOGLEVEL.NOTICE, `detailsCond1MotDSectionDone::COND-DIT Detail SECTION DONE=${JSON.stringify(condObj)}`);
    var detail = `&#013;&#010; Success stocked=${condObj.status}/3&#013;&#010; Total generated =${condObj.done}`;
    return detail;
}

function makeSectionDoneObj(typeTxt, color, detailsTxt = '') {
    return {v: 'SECTIONDONE', sectionType: typeTxt, color: color, details: detailsTxt};
}

/* Build HTML */
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
        rerolledTextShadow = `, 5px -5px 3px `,
        explodedTextShadow = `, 0.08em 0.05em 0px ${explodedColor}`,
        condTriggeredTextShadow = `, 0.15em 0em 2px ${conditionalColor}`,
        maxRecursionStyle = 'color: red; font-size: larger; font-weight: bold; padding-top: 10px;',
        sectionDoneStyle = 'position:relative;padding: 3px 0;width: 3px;height:1em;top:0.33em;border-radius:1em;border: 1px solid black;',
        condiPadder = '              ';

function parseAddedSuccesses(result, origCmd) {
    logger(`parseAddedSuccesses::parseAddedSuccesses origCmd=${origCmd}, result=${JSON.stringify(result)}`);
    var patt = /^.*#(?:\[[^\]]+\])?((?:[+-]\d+(?:\[[^\]+-]*\]?)?)*)/;
    var innerPatt = /(([+-]\d+)(?:[^\]+-]*\]?))/g;
    var ret, succ = result.total, addedSuccessesLabel = '', addedSuccesses = 0;
    if ((ret = origCmd.match(patt))) {
        logger('parseAddedSuccesses::ret='+JSON.stringify(ret));
        logger('parseAddedSuccesses::succ='+succ);
        if (ret[1]) {
            logger('parseAddedSuccesses::ret[1]='+ret[1]);
            var arrayAddedSuccesses = [...ret[1].matchAll(innerPatt)];
            logger('parseAddedSuccesses::arrayAddedSuccesses='+JSON.stringify(arrayAddedSuccesses));
            for (const [, , item] of arrayAddedSuccesses) {
                logger('parseAddedSuccesses::item='+item);
                addedSuccessesLabel += item;
                addedSuccesses += Number(item);
            }
        }
    }
    if (addedSuccesses !== 0 || addedSuccessesLabel !== '') {
        result.addedSuccesses = addedSuccesses;
        result.addedSuccessesLabel = addedSuccessesLabel;
    }
}

function recalculateSuccesses(result) {
    var succ = result.total;
    logger(LOGLEVEL.INFO, `recalculateSuccesses::updating total successes=${succ + result.addedSuccesses}, old=${succ} + ${result.addedSuccesses}`);
    if (result.addedSuccesses) succ += result.addedSuccesses;
    if (succ < 0)
        succ = 0;
    var succTxt = result.addedSuccessesLabel ? `${result.total}${result.addedSuccesses >= 0 ? '+' + result.addedSuccesses : result.addedSuccesses}=${succ}` : succ;
    if (result.total !== succ) result.total = succ;
    return { succTxt, succ };
}

/**
 * This builds the raw HTML response for the roll message. This is designed to, as much as is possible, mimic the standard roll result, up to and including
 * adding the d10-shaped result backing in the player's color.
 *
 * @param JavaScript Object reference	result		The content of the rollresult message, as above; now in its final version, with all rolls and successes
 *														accurately calculated.
 * @param string						origRoll	The original roll executed by Roll20, for display in the result.
 * @param object roll20 player			player		The roll20 object containing everything possibly needed.
 *
 * @return string						html		The completed, raw HTML, to be sent in a direct message to the chat window.
 */
function buildHTML(result, origRoll, player) {
    if (!result.rolls[0].results) {
        logger(LOGLEVEL.EMERGENCY, 'buildHTML:: !!!!!! result.rolls[0].results IS EMPTY !?!?!?!??!?!?! !!!!!!!!!');
        return;
    }
    if (result.rollSetup.verbosity == 0) result.rolls[0].results = result.rolls[0].results.filter(item => item.v !== 'SECTIONDONE');

    var vals = result.rolls[0].results, succ = result.total;
    logger(LOGLEVEL.INFO, `buildHTML::buildHTML vals=${vals.map(i => i.v)}, succ=${succ}`);

    var succTxt;
    ({ succTxt, succ } = recalculateSuccesses(result));

    var html = "";
    html += "<div style=\"" + outerStyle + "\"><div style=\"" + innerStyle + "\">";
    html +=   "<div class=\"formula\" style=\"display:inline;" + formulaStyle + "\">"+player.get('displayname')+" roll " + origRoll + " </div>";
    html +=     "<div style=\"clear: both;\"></div>";
    if (!result.rollSetup.onlyResult) {
        html += "<div class=\"formula formattedformula\" style=\"" + formulaStyle + ";" + formattedFormulaStyle + "\">";
        html +=   "<div class=\"dicegrouping ui-sortable\" data-groupindex=\"0\">";
        html = displayRolls(vals, result, html);
        if (result.addedSuccessesLabel) html += result.addedSuccessesLabel;
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
    var diceNumber = 1;
    html += '(';
    _.each(vals, function (item, idx) {
        logger(`displayRolls::item=${JSON.stringify(item)}`);
        if (item.v === 'SECTIONDONE') {
            logger(LOGLEVEL.INFO, `displayRolls::item(${strFill(diceNumber++)})=SECTION ${item.sectionType}, verbosity=${result.rollSetup.verbosity}`);
            if (result.rollSetup.verbosity == 0) return;
            html += `<div data-origindex="${idx}" class="diceroll d10" style="background-color:${item.color};${sectionDoneStyle}" title="Section ${item.sectionType} DONE${item.details}"></div>`;
            return;
        } else 
            logger(LOGLEVEL.INFO, `displayRolls::item(${strFill(diceNumber++)})=${item.v}, full=${JSON.stringify(item)}`);
        if (result.rollSetup.verbosity == 0 && item.rerolled)
            return;
        var affectedTextShadow = '';
        if (item.wasRerolled || item.wasExploded) {
            affectedTextShadow = wasAffectedTextShadow;
            if (item.wasRerolled)       affectedTextShadow += item.wasConditionallyAffected ? conditionalColor : rerolledColor;
            else if (item.wasExploded)  affectedTextShadow += item.wasConditionallyAffected ? conditionalColor : explodedColor;
        }
        if (item.exploded)      affectedTextShadow += explodedTextShadow;
        if (item.rerolled)      affectedTextShadow += rerolledTextShadow + (item.condRerolled ? conditionalColor : rerolledColor);
        if (item.condTriggered) affectedTextShadow += condTriggeredTextShadow;
        if (item.exploded || item.rerolled || item.condTriggered)
            affectedTextShadow += ';';
        html += `<div data-origindex="${idx}" class="diceroll d10" style="padding: 3px 0;${item.rerolled ? rerolledStyle : ''}">`;
        logger(`displayRolls::title =\n${item.title.join('\n')}\nJSON=${JSON.stringify(item.title)}`);
        html += '<div class="dicon" style="' + (item.v == 10 ? ' top: -1px;' : '') + (item.title.length ? '" title="' + item.title.join('&#013;&#010;') : '') + '">';
        html += '<div class="didroll" style="' + diceRollStyle
            + ((item.doubled ? doubleColorStyle : (item.success ? successColorStyle : ` text-shadow: 0 0 0.03em ${baseColor}`))
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

function buildTableRow(arrayfirstCol, arraySecondCol) {
    var outhtml =  '<tr>';
        outhtml +=     `<td style="${tdStyle}">`;
        outhtml +=         `<p style="${pStyle}">`
    for (const [i,code] of arrayfirstCol.entries())
        outhtml +=             `<code>${code}</code>${i < arrayfirstCol.length-1 ? '<br>' :''}`;
        outhtml +=         `</p>`;
        outhtml +=     '</td>';
        outhtml +=     `<td style="${tdStyle}">`;
    for (const paragraph of arraySecondCol)
        outhtml +=         `<p style="${pStyle}">${paragraph}</p>`;
        outhtml +=     '</td>';
        outhtml += '</tr>';
    return outhtml;
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
    var outhtml = '';
    outhtml +=  `<div style="${divStyle}">`;
    outhtml +=      `<p style="${pStyle}"><strong>Exalted 3rd Edition Dice Roller Help</strong></p>`;
    outhtml +=      `<p style="${pStyle}">The basic syntax of most rolls you will make is:</p>`;
    outhtml +=      `<p style="${pStyle}"><code>!exr [no. of dice]#</code></p>`;
    outhtml +=      `<p style="${pStyle}">The <code>#</code> marks the end of the dice statement, and this syntax provides the most common type of roll in `;
    outhtml +=          'Exalted: that many dice, with a target number of 7+, and 10s count double. In the majority of cases, this is all you need.</p>';
    outhtml +=      `<p style="${pStyle}">Charms, however, can throw a wrench in this, so I designed the script to be able to compensate. With the additional `;
    outhtml +=          'commands and arguments, you can customize the way the roller treats your results and counts your successes, in order to match that behavior.</p>';
    outhtml +=      `<p style="${pStyle}">The full syntax of rolls is as follows:</p>`;
    outhtml +=      `<p style="${pStyle}"><code>!exr [no. of dice]# -[cmd1] [arg1],[arg2]... -[cmd2] [arg3],[arg4]...</code></p>`;
    outhtml +=      `<p style="${pStyle}"><em>You can also type <code>!exr -help</code> to pull up this menu again, if necessary.</em></p>`;
    outhtml +=      '<br />';
    outhtml +=      `<p style="${pStyle}">The following table explains the various commands.</p>`;
    outhtml +=      `<table style="${tableStyle}">`;
    outhtml +=         `<tr><th style="${tdStyle} ${thStyle}">Command</th><th style="${tdStyle} ${thStyle}">Explanation</th></tr>`;
    outhtml +=         '<tbody>';

    for (const helpSection of helpData)
        outhtml += buildTableRow(helpSection.arrayfirstCol, helpSection.arraySecondCol);

    outhtml +=     '</tbody>';
    outhtml +=     '</table>';
    outhtml += '</div>';
    logger(`buildHelp::buildHelp outhtml=${outhtml}`);
    return outhtml;
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
