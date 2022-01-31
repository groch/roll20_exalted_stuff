/**
 * Exalted 3rd Edition Dice Roller
 * @author Mike Leavitt
 * @author Sylvain "Groch" CLIQUOT
 * @version 1.1
 */

log('-- Loaded EX3Dice! --');
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
    log('setTurnOrder::INSIDE !!!');
    if (!selected || !selected.length) {
        log('setTurnOrder::NO SELECTEDS ! RETURN');
        return;
    }
    var turnOrder = (Campaign().get('turnorder') === '') ? [] : Array.from(JSON.parse(Campaign().get('turnorder')));
    log('setTurnOrder::turnOrder='+JSON.stringify(turnOrder));

    log('setTurnOrder::selected='+JSON.stringify(selected));
    var selectedTokenId = selected.map(o => getObj('graphic',o._id)).filter(n => n).map(o => o.get('id'));
    if (!Array.isArray(selectedTokenId)) selectedTokenId = [selectedTokenId];
    if (selectedTokenId.length && Array.isArray(selectedTokenId[0])) selectedTokenId.map(o => o[0]);
    log('setTurnOrder::selectedTokenId='+JSON.stringify(selectedTokenId));

    const idTurnOrder = turnOrder.map(o => o.id);
    log('setTurnOrder::idTurnOrder=' + JSON.stringify(idTurnOrder));
    var idTurnToCreate = [];

    for (const id of selectedTokenId) {
        if (!idTurnOrder.includes(id)) {
            log('setTurnOrder::adding to include into turnorder id=' + id);
            idTurnToCreate.push(id);
        }
    }

    if (idTurnToCreate.length < idTurnOrder.length) {
        for (var i = 0; i < turnOrder.length; i++) {
            if (selectedTokenId.includes(turnOrder[i].id)) {
                log(`setTurnOrder::setting id=${turnOrder[i].id} to pr=${successes}`);
                turnOrder[i].pr = successes;
            }
        }
    }

    if (idTurnToCreate.length > 0) {
        for (const id of idTurnToCreate) {
            log(`setTurnOrder::pushing to turnorder id=${id}`);
            turnOrder.push({id:id,pr:successes,custom:''});
        }
    }

    log(`setTurnOrder::FINAL setting turnOrder=${JSON.stringify(turnOrder)}`);
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
            log('performRoll::parseCmds DONE !');
            log('performRoll::ops='+JSON.stringify(ops));
            log('performRoll::result='+ops[0].content);
            log('performRoll::cmds='+JSON.stringify(cmds));

	        if (!_.isEmpty(cmds)) {
	            processCmds(cmds, result);
	        } //else { // If there are no commands passed, the script defaults to doubling 10s, which is what this call represents.
	        //    doDoubles(result, true, 0);
	        //}

            finalizeRoll(result);

			// This gets the player's color, for styling the roll result HTML output in buildHTML().
	        var player = getObj("player", msg.playerid);
	        var outHTML = buildHTML(result, msg.content, ops[0].origRoll, player.get('color'));

			// Passes the final, formatted HTML as a direct message to the chat window.
            if (result.toGm) {
                if (!playerIsGM(msg.playerid)) sendChat(msg.who, `/w ${msg.who} ${outHTML}`);
                sendChat(msg.who, '/w gm ' + outHTML);
            } else {
	            sendChat(msg.who, '/direct ' + outHTML);
            }

            if (result.setTurn)
                setSelectedTurnOrder(msg.selected, result.total);
	    } else { // Error handling.
	        printError(ops[0], msg.who);
	    }
	});
}


function setupRollStructure(result) {
    result.rollSetup = {
        hasRecursiveOrExplosiveFeature: false,
        has10doubled: true,
        verbosity: 0,
        colored: false,
        onlyResult: false,
        face: [null],
        conditionals: [],
        rollToProcess: [],
        finalResults: [],
        maxRecursiveAchieved: false
    };

    for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        result.rollSetup.face.push({
            face: i,
            rerolls: [],
            explosives: [],
            doubles: []
        });
    }

    log(`setupRollStructure::result.rollSetup=${JSON.stringify(result.rollSetup)}`);
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
    log('parseCmds::item="' + trim + '"');

    // patt = /^(r|R)(l\d*)?(?:\s([\d,]+))?$/;
    var objRet, match = false;
    patt = /^(d|r|R|e|E)(l\d*)?(?:\s([\d,]+))?$/;
    if (ret = trim.match(patt)) {
        match = true;
        log('parseCmds::MATCH1 = rerolls & doubles & explodes');
        log('parseCmds::ret='+JSON.stringify(ret));
        objRet = {
            cmd: ret[1],
            faces: [...ret[3].split(',').filter(i => i).map(i => Number(i))],
            limit: ret[2] ? Number(ret[2].substring(1)) : ret[1] == 'r' ? 1 : 0
        };
    }
    patt = /^(gm|D|target|turn|v|V|c|o|onlyResult)$/;
    if (ret = trim.match(patt)) {
        match = true;
        log('parseCmds::MATCH2 - gm & D & Turn & verbosity & color & onlyResult');
        log('parseCmds::ret='+JSON.stringify(ret));
        objRet = {
            cmd: ret[1],
            args: null
        };
    }

    log('parseCmds::FINAL objRet='+JSON.stringify(objRet));
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
    log(`processCmds::processCmds cmds=${JSON.stringify(cmds)}, result=${JSON.stringify(result)}`);
    for (const item of cmds) {
        var recReroll = false,
            exploIgnore = true,
            verbosityToSet = 1;
        switch (String(item.cmd)) {
            case 'R':
                recReroll = true;
            case 'r':
                for (const face of item.faces) {
                    result.rollSetup.face[face].rerolls.push({
                        limit: item.limit,
                        done: 0,
                        keepBest: item.keepBest ? item.keepBest : false,
                        recursive: recReroll
                    });
                }
                break;
            case 'E':
                exploIgnore = false;
            case 'e':
                for (const face of item.faces) {
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
                for (const face of item.faces) result.rollSetup.face[face].doubles.push({limit: item.limit, done: 0});
                break;
            case 'turn':
            case 'target':
                result.setTurn = true;
                break;
            case 'gm':
                result.toGm = true;
                break;
            case 'o':
            case 'onlyResult':
                result.rollSetup.onlyResult = true;
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

    log(`processCmds::processCmds END`);
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
    log(`doDoubles::doDoubles do10s=${result.rollSetup.has10doubled}, result=${JSON.stringify(result)}`);

    var newTotal = 0;
    for (const dice of result.rollSetup.finalResults)
        if (dice.v >= 7) newTotal++;

	// Update with the new success total.
    log(`doDoubles::result.total=${newTotal}`);
    result.total = newTotal;

    if (result.rollSetup.has10doubled) {
        result.rollSetup.face[10].doubles.push({limit: 0, done: 0});
    }
	// Create an empty array for our values to double.
    var doubles = result.rollSetup.face.filter(i => i).map(i => ({v:i.v, dbl: i.doubles.length ? true : false}));
    log(`doDoubles::doubles=${JSON.stringify(doubles)}`);

    var addSucc = 0;
    if (!_.isEmpty(doubles.filter(i => i.dbl))) {
        for (const item of result.rollSetup.finalResults) {
            let faceObj = result.rollSetup.face[item.v];
            if (faceObj.doubles.length) {
                if (!item.rerolled) addSucc += (item.v >= 7) ? 1 : 2;
                item.doubled = true;
                faceObj.doubles[0].done++;
                if (faceObj.doubles[0].limit != 0 && faceObj.doubles[0].limit == faceObj.doubles[0].done) {
                    log(`doDoubles::DOUBLE SECTION DONE=${JSON.stringify(faceObj.doubles[0])}`)
                    faceObj.doubles.shift();
                }
            }
        }
    }

    log(`doDoubles::addSucc=${addSucc}`);
	// Add the extra successes to the total.
    result.total += addSucc;
}

/**
 * Perform the roll with settings created during previous steps.
 *
 * @param JavaScript Object reference	result		The content of the rollresult message, as above; now in its final version, with all rolls and successes
 *														accurately calculated.
 */
function finalizeRoll(result) {
    log(`finalizeRoll::finalizeRoll result=${JSON.stringify(result)}`);

    // copy rolls
    result.rollSetup.rollToProcess = result.rolls[0].results;
    log(`finalizeRoll::finalizeRoll rollToProcess=${JSON.stringify(result.rollSetup.rollToProcess)}`);
	if (typeof result.rollSetup.rollToProcess == 'undefined') {
        log(`finalizeRoll::finalizeRoll ERROR QUITTING !!!!`);
        return;
    }

    //sort reroll & explosives
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

    log(`finalizeRoll::FINAL rollSetup=${JSON.stringify(result.rollSetup)}`)

    var turn = 1;
    do {
        log(`MEGATURN(${turn}) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        handleRollTurn(result, turn++);
        if (turn > 42) break;
    } while (result.rollSetup.rollToProcess.length > 0)

    if (turn >= 42) result.rollSetup.maxRecursiveAchieved = true;

    doDoubles(result);

    log(`finalizeRoll::rewriting result.rolls[0].results=${JSON.stringify(result.rollSetup.finalResults)}`);
    result.rolls[0].results = result.rollSetup.finalResults;
}

/**
 * Perform the roll with settings created during previous steps.
 *
 * @param JavaScript Object reference	result		The content of the rollresult message, as above; now in its final version, with all rolls and successes
 *														accurately calculated.
 * @param Number                        turn        number for turn, 1 = initial roll
 */
function handleRollTurn(result, turn) {
    log(`handleROllTurn::handleROllTurn turn=${turn}, rollToProcess=${JSON.stringify(result.rollSetup.rollToProcess)}`);
    var nextRollsToProcess = [];
    for (const item of result.rollSetup.rollToProcess) {
        var rerolled = false,
            exploded = false,
            toNextRollRerolled = null,
            toNextRollExploded = null,
            tagList = [],
            face = item.v,
            faceObj = result.rollSetup.face[face],
            titleText = '';
        log(`handleRollTurn::face(${face}).rerolls.length=${faceObj.rerolls.length}`);
        if (faceObj.rerolls.length) {
            log(`handleRollTurn::face(${face}) REROLL TO DO ! section=${JSON.stringify(faceObj.rerolls[0])}`);
            var reroll = randomInteger(10);
            if (!(faceObj.rerolls[0].keepBest && reroll < face) &&
                 (faceObj.rerolls[0].recursive || !item.wasRerolled)) {
                rerolled = true;
                toNextRollRerolled = {
                    v: reroll,
                    wasRerolled: true,
                    wasEverRerolled: true,
                    wasExploded: false,
                    title: `RollTurn (${turn+1 < 10 ? turn+1 + '  ' : turn+1}). R->Face=${reroll < 10 ? reroll + '  ' : reroll}.`
                };
            }
            faceObj.rerolls[0].done++;
            titleText += `Rerolled to a ${reroll < 10 ? reroll + '  ' : reroll}` + (faceObj.rerolls[0].limit != 0 ? ` (Done${faceObj.rerolls[0].done}/${faceObj.rerolls[0].limit}).` : '.');
            if (faceObj.rerolls[0].limit != 0 && faceObj.rerolls[0].limit == faceObj.rerolls[0].done) {
                log(`handleRollTurn::REROLL SECTION DONE=${JSON.stringify(faceObj.rerolls[0])}`);
                faceObj.rerolls.shift();
            }
        }
        if (faceObj.explosives.length) {
            log(`handleRollTurn::face(${face}) EXPLOSIVE TO DO ! section=${JSON.stringify(faceObj.explosives[0])} rerolled=${rerolled}`);
            var newDie = randomInteger(10);
            var iterator = 0;
            for (; iterator < faceObj.explosives.length && !(!faceObj.explosives[iterator].ignoreRerolled || (!rerolled && !item.wasEverRerolled)); iterator++);
            if (iterator == faceObj.explosives.length) {
                log(`handleRollTurn::NO EXPLO MATCHING IN ${iterator} ITEMS. explosives=${JSON.stringify(faceObj.explosives)}`);
            } else {
                log(`handleRollTurn::EXPLO iterator=${iterator} TEST=${!faceObj.explosives[iterator].ignoreRerolled || (!rerolled && !item.wasRerolled)}, part1=${!faceObj.explosives[iterator].ignoreRerolled}, part2=${!rerolled}, part3=${!item.wasRerolled}`)
                if (!faceObj.explosives[iterator].ignoreRerolled || (!rerolled && !item.wasEverRerolled)) {
                    exploded = true;
                    toNextRollExploded = {
                        v: newDie,
                        wasRerolled: false,
                        wasEverRerolled: item.rerolled || true,
                        wasExploded: true,
                        title: `RollTurn (${turn+1 < 10 ? turn+1 + '  ' : turn+1}). E->Face=${newDie < 10 ? newDie + '  ' : newDie}.`
                    };
                    faceObj.explosives[iterator].done++;
                    titleText += `Explode to a ${newDie < 10 ? newDie + '  ' : newDie}` + (faceObj.explosives[iterator].limit != 0 ? ` (Done${faceObj.explosives[iterator].done}/${faceObj.explosives[iterator].limit}).` : '.');
                    if (faceObj.explosives[iterator].limit != 0 && faceObj.explosives[iterator].limit == faceObj.explosives[iterator].done) {
                        log(`handleRollTurn::EXPLOSIVE SECTION DONE=${JSON.stringify(faceObj.explosives[iterator])}`)
                        faceObj.explosives.shift();
                    }
                }
            }
        }
        var finalObj = {
            v: face,
            wasRerolled: item.wasRerolled || false,
            wasEverRerolled: item.wasEverRerolled || false,
            wasExploded: item.wasExploded || false,
            rerolled: rerolled,
            exploded: exploded,
            doubled: false,
            tags: tagList,
            title: (item.title ? item.title + titleText : `Roll Initial.            Face=${face < 10 ? face + '  ' : face}.${titleText}`)
        };
        if (rerolled) {
            toNextRollRerolled.title = finalObj.title + '&#013;&#010;' + toNextRollRerolled.title || '.';
            nextRollsToProcess.push(toNextRollRerolled);
        }
        if (exploded) {
            toNextRollExploded.title = finalObj.title + '&#013;&#010;' + toNextRollExploded.title || '.';
            nextRollsToProcess.push(toNextRollExploded);
        }
        log(`handleRollTurn::finalObj=${JSON.stringify(finalObj)}`);
        result.rollSetup.finalResults.push(finalObj);

    }
    log(`handleRollTurn::END nextRollsToProcess=${JSON.stringify(nextRollsToProcess)}`);
    result.rollSetup.rollToProcess = nextRollsToProcess;
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
	// Putting everythign in smaller variables that it's easier to type. ;P
    var vals = result.rolls[0].results;
    var succ = result.total;
    log(`buildHTML::buildHTML vals=${vals.map(i => i.v)}, succ=${succ}`);

    // Add manually added successes from original command
    var patt = /^.*\#(?:\[[^\]]+\])?((?:[\+-]\d+[^\]]*\]?)+)?/;
    var innerPatt = /(([\+-]\d+)(?:[^\]\+-]*\]?))/g;
    var ret, addedSuccessesLabel = '', addedSuccesses = 0;
    if (ret = origCmd.match(patt)) {
        // log('buildHTML::ret='+JSON.stringify(ret));
        // log('buildHTML::succ='+succ);
        if (ret[1]) {
            // log('buildHTML::ret[1]='+ret[1]);
            var arrayAddedSuccesses = [...ret[1].matchAll(innerPatt)];
            // log('buildHTML::arrayAddedSuccesses='+JSON.stringify(arrayAddedSuccesses));
            for (const [,,item] of arrayAddedSuccesses) {
                // log('buildHTML::item='+item);
                addedSuccessesLabel += item;
                addedSuccesses += Number(item);
            }
        }
    }

    log(`buildHTML::updating total successes=${succ+addedSuccesses}, old=${succ} + ${addedSuccesses}`);
    succ += addedSuccesses;
    if (succ < 0) succ = 0;
    var succTxt = addedSuccessesLabel ? `${result.total}${addedSuccesses >=0 ? '+'+addedSuccesses : addedSuccesses}=${succ}` : succ;

	// Roll20 doesn't let us piggyback off of most of their classes. Any script-defined HTML classes automatically have "userscript-" attached to the front
	// of them. The Roll20 CSS has some compatible styling for this already, but it's not complete, so we have to do the rest ourselves.

    var outerStyle = "background: url('https://app.roll20.net/images/quantumrollsm.png') no-repeat bottom left; margin: 0 0 -7px -45px",
        innerStyle = "margin: 0 0 7px 45px; padding-bottom: 7px;",
        formulaStyle = "font-size:inherit;background:white;border-radius:3px;",
        totalStyle = formulaStyle; // The styling for the total box at the end of the message.
    totalStyle += "padding:4px;display:inline;border:1px solid #d1d1d1;cursor:move;font-size:1.4em;font-weight:bold;color:black;line-height:2.0em;";
    formulaStyle += "padding-left:4px;border:1px solid #d1d1d1;font-size:1.1em;line-height:2.0em;word-wrap:break-word;";
    var formattedFormulaStyle = "display:block;float:left;",
        uidraggableStyle = "cursor:move",
        diceBackgroundStyle = "position: absolute; top: 1px; left: 0%;",
        diceIconStyle = "";
    // use font from character sheet
    var planeWalkerFont = "font-family: 'Planewalker';",
        diceRollStyle = planeWalkerFont + " letter-spacing: -2px; top: 4px;",
        // ME
        baseColor = 'black',
        successColor = '#23b04f',
        doubleColor = '#950015',
        // rerolledColor = 'rgba(0, 42, 255, 1)',
        rerolledColor = 'rgba(0, 100, 255, 1)',
        explodedColor = 'rgba(255, 235, 0, 1)',
        // KIA
        // baseColor = '#181e22',
        // successColor = "#4c872a",
        // doubleColor = "#86293a",
        // rerolledColor = '#2547a0',
        // explodedColor = '#219a7e',
        successColorStyle = " color: "+successColor+"; text-shadow: 0 0 0.03em "+successColor,
        doubleColorStyle = " color: "+doubleColor+"; text-shadow: 0 0 0.03em "+doubleColor,
        rerolledStyle = 'opacity: 0.4;',
        rerolledTextShadow = `, 5px -5px 3px ${rerolledColor}`,
        wasAffectedTextShadow = ', -3px 0 0.03em ',
        explodedTextShadow = `, 0.08em 0.05em 0px ${explodedColor}`,
        maxRecursionStyle = 'color: red; font-size: larger; font-weight: bold; padding-top: 10px;';


	// Building the output.
    var html = "";
    html += "<div style=\"" + outerStyle + "\">";
    html += "<div style=\"" + innerStyle + "\">";
    html += "<div class=\"formula\" style=\"display:inline;" + formulaStyle + "\"> rolling " + origRoll + " </div>";
    html += "<div style=\"clear: both;\"></div>";
    if (!result.rollSetup.onlyResult) {
        html += "<div class=\"formula formattedformula\" style=\"" + formulaStyle + ";" + formattedFormulaStyle + "\">";
        html +=   "<div class=\"dicegrouping ui-sortable\" data-groupindex=\"0\">";
        html +=   "(";

        var isDouble;
        _.each(vals, function(item, idx) {
            if (result.rollSetup.verbosity == 0 && item.rerolled) return;
            isDouble = item.doubled;
            var affectedTextShadow = '';
            if (item.wasRerolled || item.wasExploded) {
                affectedTextShadow = wasAffectedTextShadow
                if (item.wasRerolled)
                    affectedTextShadow += rerolledColor;
                else if (item.wasExploded)
                    affectedTextShadow += explodedColor;
            }
            if (item.exploded) affectedTextShadow += explodedTextShadow;
            if (item.rerolled) affectedTextShadow += rerolledTextShadow;
            html +=     `<div data-origindex="${idx}" class="diceroll d10" style="padding: 3px 0;${item.rerolled ? rerolledStyle : ''}">`;
            html +=       '<div class="dicon" style="' + diceIconStyle + (item.v == 10 ? ' top: -1px;' : '') + (item.title ? '" title="'+item.title : '') +'">';
            html +=         '<div class="didroll" style="' + diceRollStyle
                        + ((isDouble ? doubleColorStyle : ((item.v >= 7) ? successColorStyle : ` text-shadow: 0 0 0.03em ${baseColor}`))
                            + (result.rollSetup.colored ? affectedTextShadow : '') + ';')
                        + ([4,8,10].includes(item.v) ? ' left: 0px;' : ' left: 1.5px;')
                        + ' font-size: ' + (item.v == 10 ? '31' : '40') + 'px;">' + item.v + '</div>';
            html +=         "<div class=\"backing\" style=\"opacity: 1;\"><img src=\"https://s3.amazonaws.com/files.d20.io/images/263689904/B-bmVPv5NQIDKEbHObaOmg/max.png?1641622935\" style=\"" + diceBackgroundStyle + "\"></div>";
            html +=       "</div>";
            html += (idx + 1 != vals.length) ? "+" : "";
            html +=     "</div>";
        });

        html +=   ")";
        if (addedSuccessesLabel) html += addedSuccessesLabel;
        html +=   "</div>";
        html += "</div>";
        html += "<div style=\"clear: both;\"></div>";
    }
    if (result.rollSetup.maxRecursiveAchieved) {
        html += "<p style='"+maxRecursionStyle+"'>MAX RECURSION ACHIEVED</p>";
        html += "<div style=\"clear: both;\"></div>";
    }
    html += "<strong> = </strong>";
    html += "<div class=\"rolled ui-draggable\" style=\"" + totalStyle + ";" + uidraggableStyle + "\">" + succTxt + " Success" + ((succ != 1) ? "es" : "") + "</div>";
    html += "</div>";
    html += "</div>";

	// Sending back the complete HTML string.
    return html;
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
    log('Error!');

    if (result.type == 'error' ) {
        sendChat('EX3Dice API', '/w ' + sender + ' I tried, but Roll20 had a problem with this. They said: ' + result.content);
    } else {
        sendChat('EX3Dice API', '/w ' + sender + ' Sorry, I didn\'t understand your input. Please try again.');
    }
}
