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
	        } else { // If there are no commands passed, the script defaults to doubling 10s, which is what this call represents.
	            doDoubles(result, true, 0);
	        }

            //finalizeRoll(result);

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
        face: [null],
        conditionals: [],
        rollToProcess: [],
        finalResults: []
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

    var patt = /^[rRdDgt](l?\d*)?/i;
    if (patt.test(item)) {
        var cmdArr = trim.split(' ');

 	 	// We end up, here, with an object that has two properties: cmd, which contains the command string, and args, which is an array of number
		// values that will be used for that command.
        var cmdObj = {
            cmd: cmdArr[0],
            args: (!_.isUndefined(cmdArr[1])) ? cmdArr[1].split(',').map(i => Number(i)) : []
        };

        log('parseCmds::cmdObj='+JSON.stringify(cmdObj));
 	 	// That object is then pushed to the cmd array, above.
        this.push(cmdObj);
    }

    // patt = /^(r|R)(l\d*)?(?:\s([\d,]+))?$/;
    var objRet, match = false;
    patt = /^(d|r|R)(l\d*)?(?:\s([\d,]+))?$/;
    if (ret = trim.match(patt)) {
        match = true;
        log('parseCmds::MATCH1 = rerolls & doubles');
        log('parseCmds::ret='+JSON.stringify(ret));
        objRet = {
            cmd: ret[1],
            faces: [...ret[3].split(',').filter(i => i).map(i => Number(i))],
            limit: ret[2] ? Number(ret[2].substring(1)) : ret[1] == 'r' ? 1 : 0
        };
    }
    patt = /^(gm|D|target|turn)$/;
    if (ret = trim.match(patt)) {
        match = true;
        log('parseCmds::MATCH2 - gm');
        log('parseCmds::ret='+JSON.stringify(ret));
        objRet = {
            cmd: ret[1],
            args: null
        };
    }

    log('parseCmds::FINAL objRet='+JSON.stringify(objRet));
    // if (match) this.push(objRet);
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
 	// Iterating through the list twice isn't terribly efficient, but this ensures that the rerolls have been completed before the doubled successes
	// are evaluated. The result argument is passed as the context for the _.each() function here.
    for (const item of cmds) {
		// Defaults to pass to the doRerolls() function.
        var recReroll = false;
        var keepHigh = true; // remove

        switch (item.cmd[0]) { // The only thing different about the '-R' command is that it turns on recursion, and turns off the keeping of the higher result.
            case 'R':
                recReroll = true;
                keepHigh = false; //remove
            case 'r':
                if (!_.isUndefined(item.cmd[1]) && item.cmd[1] == 'l') 
                    keepHigh = false;
                doRerolls(result, item.args, recReroll, keepHigh);
                // for (const face of item.faces) {
                //     result.rollSetup.face[face].rerolls.push({
                //         limit: item.limit,
                //         done: 0,
                //         keepBest: item.keepBest ? item.keepBest : false,
                //         recursive: recReroll
                //     });
                // }
                break;
            default:
                break;
        }
    }

 	// Makes sure we do the doubles, in case someone passes a reroll command without a double command (the script is supposed to double 10s by default).
    var doneDoubles = false;
    for (const item of cmds) {
		// Again, setting defaults, which are only changed in a few cases in the switch, below.
        var limit = 0;
        var do10s = true;

        // switch (String(item.cmd)) {
        switch (item.cmd[0]) {
            case 'D':
                do10s = false;
                result.rollSetup.has10doubled = false;
            case 'd':
                if (!_.isUndefined(item.cmd[1]) && item.cmd[1] == 'l')
                    limit = (!_.isUndefined(item.cmd[2])) ? item.cmd[2] : 0;
                doDoubles(result, do10s, limit, item.args);
                
                // for (const face of item.faces) result.rollSetup.face[face].doubles.push({limit: item.limit, done: 0});

                doneDoubles = true;
                break;
            case 't':
            case 'turn':
            case 'target':
                result.setTurn = true;
                break;
            case 'g':
            case 'gm':
                result.toGm = true;
                break;
            default:
                break;
        }
    }

    log(`processCmds::processCmds before doDoubles`);
    if (!doneDoubles) doDoubles(result, true, 0);
    log(`processCmds::processCmds END`);
}


/**
 * Handles actually performing the rerolls. Rerolls the passed values once, keeping the highest, unless told to do otherwise.
 *
 * @param JavaScript Object Reference	result		The content of the rollresult message, as above.
 * @param Array <string>				args		The array of die values to reroll.
 * @param Boolean						rec			Whether or not the rerolls are recursive.
 * @param Boolean						keepHigh	Whether or not to keep the higher result.
 *
 * @return void
 */
function doRerolls(result, args, rec, keepHigh) {
    log(`doRerolls::doRerolls result=${JSON.stringify(result)}, args=${JSON.stringify(args)}, rec=${rec}, keepHigh=${keepHigh}`);
	// If we don't have values to reroll, then we don't need to waste our time.
    if (_.isEmpty(args))
        return result;

	// Put the values in a temporary container, so we can mess with them.
    var vals = result.rolls[0].results;

	// Setting the stop condition for the loop. If rec is set to false, the loop will run once, then stop.
    var stop = !rec;
	// This is one of the few cases where I've found a do...while loop to be just about exactly what I needed. Exciting. :D
    do {
        //TODO Add reroll to final roll but tagged as reroll

		// There's probably a better way to do this, but this made the most sense to me at the time.
        for (var i = 0; i < vals.length; i++) {
            if (args.includes(vals[i].v)) {
                var reroll = randomInteger(10);
                vals[i].v = (keepHigh && reroll < vals[i].v) ? vals[i].v : reroll;
            }
        }

		// This bit determines if we've run out of values to recursively reroll. In the interest of not wasting time, as soon as
		// count iterates once, the whole thing breaks out and continues. If count makes it through and is still 0, stop is set to
		// true, so the while loop will finish.
        if (!stop) {
            var count = 0;
            for (var i = 0; i < vals.length; i++) {
                if (args.includes(vals[i].v)) {
                    count++;
                    break;
                }
            }

            if (count == 0) stop = true;
        }
    } while (!stop);

    var newTotal = 0;
    for (const dice of vals)
        if (dice.v >= 7) newTotal++;

	// Update with the new success total.
    log(`doRerolls::result.total=${newTotal}`);
    result.total = newTotal;

	// Update the reults with the new values, so doDoubles() has the right ones.
    log(`doRerolls::result.rolls[0].results=${JSON.stringify(vals)}`);
    result.rolls[0].results = vals;
}


/**
 * This function handles doubling the values. This one is called pretty much every time the script runs, as it's one of the most common things
 * that any roll in Exalted is expected to do.
 *
 * @param JavaScript Object Reference	result		The content of the rollresult message, as above.
 * @param Boolean						do10s		Whether or not to reroll 10s by default.
 * @param integer						limit		The maximum number of doubles to count. "0" means there is no limit.
 * @param Array <string>				args		The values to double. Since this function often doubles just 10s, this can be null.
 *
 * @return void
 */
function doDoubles(result, do10s, limit, args = null) {
    log(`doDoubles::doDoubles do10s=${do10s}, limit=${limit}, args=${args}, result=${JSON.stringify(result)}`);
	// Set our count, if we have a limit.
    if (limit > 0) var count = 0;
    log(`doDoubles::limit=${limit}, count=${count}`);

	// Create an empty array for our values to double.
    var doubles = [];

	// Get 10 in there, if we need it.
    if (do10s) doubles.push(10);

	// Also get the rest of the values. I probably don't have to parseInt() here, but I'm just being safe.
    if (!_.isNull(args) && !_.isEmpty(args))
        _.each(args, function(item) { this.push(Number(item)); }, doubles);

    // Storing doubles for visual render
    result.doubles = doubles;

	// As doRerolls(), above, putting the roll results in a container.
    var vals = result.rolls[0].results;
	
	if (typeof vals == 'undefined') return;

	// Initializing the number of successes we'll add.
    var addSucc = 0;

	// Assuming we're doubling anything, do that.
    if (!_.isEmpty(doubles)) {
		// The for loops here are so I can break out of them once our count equals our limit.
        for (var i = 0; i < vals.length; i++) {
            for (var j = 0; j < doubles.length; j++) {
                if (vals[i].v == doubles[j]) {
					// Some charms allow the doubling of results that aren't normally successes. If so, this one will count them as two extra, rather
					// than just one.
                    addSucc += (doubles[j] >= 7) ? 1 : 2;
					if (!_.isUndefined(count))
						count++;
                }
                if (!_.isUndefined(count) && count == limit) break;
            }

            if (!_.isUndefined(count) && count == limit) break;
        }
    }

    log(`doDoubles::addSucc=${addSucc}, count=${count}`);

	// Add the extra successes to the total.
    result.total += addSucc;
}


/**
 * This function handles doubling the values. This one is called pretty much every time the script runs, as it's one of the most common things
 * that any roll in Exalted is expected to do.
 *
 * @param JavaScript Object Reference	result		The content of the rollresult message, as above.
 *
 * @return void
 */
function doDoublesNEW(result) {
    log(`doDoublesNEW::doDoublesNEW do10s=${result.rollSetup.has10doubled}, result=${JSON.stringify(result)}`);

    if (result.rollSetup.has10doubled) {
        result.rollSetup.faces[10].doubles.push({limit: 0, done: 0});
    }
	// Create an empty array for our values to double.
    var doubles = result.rollSetup.faces.filter(i => i).map(i => ({v:i.v, dbl: i.doubles.length ? true : false}));
    log(`doDoublesNEW::doubles=${JSON.stringify(doubles)}`);

    // TMP
    // Storing doubles for visual render
    result.doubles = result.rollSetup.doubles.map(i => i.face);
    log(`doDoublesNEW::result.doubles=${JSON.stringify(result.doubles)}`);


	// Initializing the number of successes we'll add.
    var addSucc = 0;

	// Assuming we're doubling anything, do that.
    if (!_.isEmpty(doubles)) {
		// The for loops here are so I can break out of them once our count equals our limit.
        for (const item of result.rollSetup.finalResults) {
            if (item.rerolled) {
                continue;
            }
            //
            // let faceObj = result.rollSetup.faces[item.v];
            // if (faceObj.double.length) {
            //     if (!item.rerolled) addSucc += (double >= 7) ? 1 : 2;
            //     item.doubled = true;
            //     faceObj.doubles[0].done++;
            //     if (faceObj.doubles[0].limit != 0 && faceObj.doubles[0].limit == faceObj.doubles[0].done) {
            //         log(`handleRollTurn::DOUBLE SECTION DONE=${JSON.stringify(faceObj.doubles[0])}`)
            //         faceObj.doubles[0].shift();
            //     }
            // }
            //
            for (const double of doubles) {
                if (item.v == double) {
                    addSucc += (double >= 7) ? 1 : 2;
					if (!_.isUndefined(count))
						count++;
                }
                if (!_.isUndefined(count) && count == limit) break;
            }

            if (!_.isUndefined(count) && count == limit) break;
        }
    }

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
        var face = result.rollSetup.faces[i];
        face.rerolls.sort((a, b) => {
            if (a.recursive && !b.recursive) return 1;
            if (!a.recursive && b.recursive) return -1;
            return a.limit - b.limit;
        });
        face.explosives.sort((a, b) => a.limit - b.limit);
    }

    var turn = 1;
    do {
        handleRollTurn(result, turn++);
    } while (result.rollSetup.rollToProcess.length > 0)

    doDoublesNEW(result);
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
            toNextRollRerolled = [],
            toNextRollExploded = [],
            tagList = [],
            face = item.v,
            faceObj = result.rollSetup.faces[face];
        log(`handleRollTurn::face(${face}).rerolls.length=${faceObj.rerolls.length}`);
        if (faceObj.rerolls.length) {
            log(`handleRollTurn::face(${face}) REROLL TO DO ! section=${JSON.stringify(faceObj.rerolls[0])}`);
            var reroll = randomInteger(10);
            if (!(faceObj.rerolls[0].keepBest && reroll < face) &&
                 (faceObj.rerolls[0].recursive || !item.wasRerolled)) {
                rerolled = true;
                toNextRolls.push({
                    v: face,
                    wasRerolled: true,
                    wasExploded: (item.wasExploded) ? item.wasExploded : false
                });
            }
            faceObj.rerolls[0].done++;
            if (faceObj.rerolls[0].limit != 0 && faceObj.rerolls[0].limit == faceObj.rerolls[0].done) {
                log(`handleRollTurn::REROLL SECTION DONE=${JSON.stringify(faceObj.rerolls[0])}`);
                faceObj.rerolls[0].shift();
            }
        }
        if (faceObj.explosives.length) {
            log(`handleRollTurn::face(${face}) EXPLOSIVE TO DO !`);
            var newDie = randomInteger(10);
            exploded = true;
            nextRollsToProcess.push({
                v: newDie,
                wasRerolled: (item.wasRerolled) ? item.wasRerolled : rerolled,
                wasExploded: true
            });
            faceObj.explosives[0].done++;
            if (faceObj.explosives[0].limit != 0 && faceObj.explosives[0].limit == faceObj.explosives[0].done) {
                log(`handleRollTurn::EXPLOSIVE SECTION DONE=${JSON.stringify(faceObj.explosives[0])}`)
                faceObj.explosives[0].shift();
            }
        }
        if (rerolled && exploded) toNextRollRerolled[0].wasExploded = true;
        if (rerolled) nextRollsToProcess.concat(toNextRollRerolled);
        if (exploded) nextRollsToProcess.concat(toNextRollExploded);
        var finalObj = {
            v: face,
            wasRerolled: (item.wasRerolled) ? item.wasRerolled : false,
            wasExploded: (item.wasExploded) ? item.wasExploded : false,
            rerolled: rerolled,
            exploded: exploded,
            doubled: false,
            tags: tagList
        };
        log(`handleRollTurn::finalObj=${JSON.stringify(finalObj)}`);
        result.rollSetup.finalResults.push(finalObj);

    }
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

    // Add manually added successes from original command
    var patt = /^.*\#(?:\[[^\]]+\])?((?:[\+-]\d+[^\]]*\]?)+)?/;
    var innerPatt = /(([\+-]\d+)(?:[^\]\+-]*\]?))/g;
    var ret, addedSuccess = '';
    if (ret = origCmd.match(patt)) {
        // log('buildHTML::ret='+JSON.stringify(ret));
        // log('buildHTML::succ='+succ);
        if (ret[1]) {
            // log('buildHTML::ret[1]='+ret[1]);
            var arrayAddedSuccesses = [...ret[1].matchAll(innerPatt)];
            // log('buildHTML::arrayAddedSuccesses='+JSON.stringify(arrayAddedSuccesses));
            for (const [,,item] of arrayAddedSuccesses) {
                // log('buildHTML::item='+item);
                addedSuccess += item;
            }
        }
    }

	// Roll20 doesn't let us piggyback off of most of their classes. Any script-defined HTML classes automatically have "userscript-" attached to the front
	// of them. The Roll20 CSS has some compatible styling for this already, but it's not complete, so we have to do the rest ourselves.

	// This will set the QuantumRoll icon in a container div, with a negative margin so it will appear in the right place.
    var outerStyle = "background: url('https://app.roll20.net/images/quantumrollsm.png') no-repeat bottom left; margin: 0 0 -7px -45px";
	// This offsets the div immediately inside the one above, so it doesn't overlap the icon.
    var innerStyle = "margin: 0 0 7px 45px; padding-bottom: 7px;";

	// The styling for the .formula class.
    var formulaStyle = "font-size:inherit;background:white;border-radius:3px;";
	// The styling for the total box at the end of the message.
    var totalStyle = formulaStyle;
    totalStyle += "padding:4px;display:inline;border:1px solid #d1d1d1;cursor:move;font-size:1.4em;font-weight:bold;color:black;line-height:2.0em;";

	// The rest of the .formula style.
    formulaStyle += "padding-left:4px;border:1px solid #d1d1d1;font-size:1.1em;line-height:2.0em;word-wrap:break-word;";
	// The styling for the .formattedformula class.
    var formattedFormulaStyle = "display:block;float:left;";
	// The styling for the .ui-draggable class, though it doesn't work as it would if it were an official roll.
    var uidraggableStyle = "cursor:move";

    var diceBackgroundStyle = "position: absolute; top: 1px; left: 0%;";
    var diceIconStyle = "";
    // use font from character sheet
    var planeWalkerFont = "font-family: 'Planewalker';";
    var diceRollStyle = planeWalkerFont + " letter-spacing: -2px; top: 4px;"
    var successColor = "#23b04f";
    var successColorStyle = " color: "+successColor+"; text-shadow: 0px 0px 1px "+successColor+";";
    var doubleColor = "#950015";
    var doubleColorStyle = " color: "+doubleColor+"; text-shadow: 0px 0px 1px "+doubleColor+";";
    var rerolledStyle = 'opacity: 0.4;';


	// Building the output.
    var html = "";
    html += "<div style=\"" + outerStyle + "\">";
    html += "<div style=\"" + innerStyle + "\">";
    html += "<div class=\"formula\" style=\"display:inline;" + formulaStyle + "\"> rolling " + origRoll + " </div>";
    html += "<div style=\"clear: both;\"></div>";

    html += "<div class=\"formula formattedformula\" style=\"" + formulaStyle + ";" + formattedFormulaStyle + "\">";
    html +=   "<div class=\"dicegrouping ui-sortable\" data-groupindex=\"0\">";
    html +=   "(";

    log('buildHTML::result.doubles='+JSON.stringify(result.doubles));
    var isDouble;

	// Making a little die result for each die rolled.
    _.each(vals, function(item, idx) {
        isDouble = result.doubles.includes(item.v);
        html +=     '<div data-origindex="' + idx + '" class="diceroll d10" style="padding: 3px 0;">';
        html +=       '<div class="dicon" style="' + diceIconStyle + (item.v == 10 ? ' top: -1px;' : '') + '">';
        html +=         '<div class="didroll" style="' + diceRollStyle
                    + (isDouble ? doubleColorStyle : ((item.v >= 7) ? successColorStyle : ' text-shadow: 0 0 1px black;'))
                    + (item.v == 4 ? ' left: 0px;' : ' left: 1.5px;')
                    + ' font-size: ' + (item.v == 10 ? '31' : '40') + 'px;">' + item.v + '</div>';

		// Normally the little d10-shaped icons in the back are handled with a combination of CSS classes and in the .backing:after pseudo class.
		// We don't have access to any of that from here, so we have to fudge it. "dicefontd10" is the name of the custom icon font, and "0"
		// corresponds to the outline used in a normal rollresult.
        // html += "        <div class=\"backing\"><span style=\"font-family: 'dicefontd10'; color: " + color + ";\">0</span></div>";
        html +=         "<div class=\"backing\" style=\"opacity: 1;\"><img src=\"https://s3.amazonaws.com/files.d20.io/images/263689904/B-bmVPv5NQIDKEbHObaOmg/max.png?1641622935\" style=\"" + diceBackgroundStyle + "\"></div>";
        html +=       "</div>";
        html += (idx + 1 != vals.length) ? "+" : "";
        html +=     "</div>";
    });

    html +=   ")";
    if (addedSuccess) html += addedSuccess;
    html +=   "</div>";
    html += "</div>";

    html += "<div style=\"clear: both;\"></div>";
    html += "<strong> = </strong>";
    html += "<div class=\"rolled ui-draggable\" style=\"" + totalStyle + ";" + uidraggableStyle + "\">" + succ + " Success" + ((succ != 1) ? "es" : "") + "</div>";
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
