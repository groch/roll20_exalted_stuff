/* eslint-disable no-undef */
/* eslint-disable no-sparse-arrays */
/**
 * Exalted 3rd Edition Dice Roller
 * @author Mike Leavitt
 * Forked after 1.0 to modify heavily
 * @author Sylvain "Groch" CLIQUOT
 * Discord: Groch#0102
 * Github: https://github.com/groch/roll20_exalted_stuff
 * @version 1.2
 */
var EX3Dice = EX3Dice || (function () {//let scriptStart = new Error;//Generates an error to localize the start of the script
    //converts the line number in the error to be line 1
    //  scriptStart = scriptStart.stack.match(/apiscript\.js:(\d+)/)[1]*1;
    'use strict';

    /**
     * Logger "Enum", followed by Log Threshold levelm and the logger method
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

    const LogLvl = LOGLEVEL.INFO;
    const logger = (level, ...logged) => {
        if (!(level instanceof LOGLEVEL)) {
            logged.unshift(level);
            level = LOGLEVEL.DEBUG;
        }

        if (level <= LogLvl)
            log(...logged);
    };

    const objExistInArray = (obj, array) => {
        for (const item of array)
            if (_.isEqual(item, obj)) return true;
        return false;
    };

    const ex3DiceState = "EX3DICECUSTOM";
    const checkStateOrDefault = () => {
        state[ex3DiceState] || (state[ex3DiceState] = {commandStoredOnce:[], commandStored:[]});
    };
    const commandExistInStored = (obj, once = false) => {
        const commandAttribute = once ? 'commandStoredOnce' : 'commandStored';
        checkStateOrDefault();
        return objExistInArray(obj, state[ex3DiceState][commandAttribute]);
    };

    // CONSTANTS for HTML
    const   outerStyleNoBack = "margin: 0 0 -7px -45px; color: black",
            outerStyle = `background: url('https://app.roll20.net/images/quantumrollsm.png') no-repeat bottom left; ${outerStyleNoBack}`,
            innerStyle = "margin: 0 0 7px 45px; padding-bottom: 7px;",
            baseColor = 'black',
            successColor = '#23b04f',
            doubleColor = '#950015',
            rerolledColor = 'rgba(0, 100, 255, 1)',
            explodedColor = 'rgba(255, 235, 0, 1)',
            conditionalColor = 'cyan',
            initialRollColor = '#f06292',
            formulaStyleBase = "font-size:inherit;background:white;border:1px solid #d1d1d1;",
            formulaStyle = formulaStyleBase +   'border-radius:12px;padding:4px;font-size:1.0em;line-height:1.0em;word-wrap:break-word;',
            diceStyle = formulaStyleBase +      'border-radius:3px;padding-left:4px;font-size:1.1em;line-height:2.0em;word-wrap:break-word;',
            totalStyle = formulaStyleBase +     'border-radius:3px;padding:4px;display:inline;cursor:move;font-size:1.4em;font-weight:bold;color:black;line-height:2.0em;',
            uidraggableStyle = "cursor:move",
            diceBackgroundStyle = "position: absolute; top: 1px; left: 0%;",
            planeWalkerFont = "font-family: 'Planewalker';", // use font from character sheet css
            diceRollStyle = planeWalkerFont + " letter-spacing: -1px; top: 8px;",
            successColorStyle = " color: " + successColor + "; text-shadow: 0 0 0.03em " + successColor,
            doubleColorStyle = " color: " + doubleColor + "; text-shadow: 0 0 0.03em " + doubleColor,
            rerolledStyle = 'opacity: 0.4;',
            wasAffectedTextShadow = ', -3px 0 0.03em ',
            rerolledTextShadow = `, 5px -5px 3px `,
            explodedTextShadow = `, 0.08em 0.05em 0px ${explodedColor}`,
            condTriggeredTextShadowBase = ', 0.15em 0em 2px ',
            maxRecursionStyle = 'color: red; font-size: larger; font-weight: bold; padding-top: 10px;',
            sectionDoneStyle = 'position:relative;padding: 3px 0;width: 3px;height:1em;top:0.33em;border-radius:1em;border: 1px solid black;',
            condiPadder = '              ';

    /**
     * CONDITIONAL SECTIONS, used in later array for special roll rules
     *      -----
     * Parse Conditionals
     */
    const parseCondCRStarter = (defaultConditionObj, parsedReturn) => {
        logger(`parseCRStarter::parseCRStarter parsedReturn=${JSON.stringify(parsedReturn)}`);
        defaultConditionObj.starterCount = Number(parsedReturn[1]);
        logger(LOGLEVEL.NOTICE, `parseCRStarter:: Setting CRStarter dice count to ${defaultConditionObj.starterCount}`);
        return defaultConditionObj;
    },

    parseCondRSuccLTHon1 = (defaultConditionObj, parsedReturn) => {
        logger(`parseRSuccLTHon1::parseRSuccLTHon1 parsedReturn=${JSON.stringify(parsedReturn)}`);
        defaultConditionObj.limit = Number(parsedReturn[1]);
        logger(LOGLEVEL.NOTICE, `parseRSuccLTHon1:: Setting RSuccLTHon1 limit to ${defaultConditionObj.limit}`);
        return defaultConditionObj;
    },

    /**
     * CONDITIONALS face Handling
     */
    handleFaceConditionals = (result, setup, item, turn) => {
        logger(LOGLEVEL.INFO, `handleRollTurn::face(${setup.face}) CONDITIONAL-ALL-TESTS ! rerolled=${setup.rerolled} exploded=${setup.exploded}`);

        var condIterator = 0;
        do {
            for (; condIterator < result.rollSetup.conditionalActivated.length; condIterator++) {
                var condConfig = ConditionalList[result.rollSetup.conditionalActivated[condIterator].name];
                logger(`handleRollTurn::face(${setup.face}) section=${JSON.stringify(condConfig)}`);
                var localToNextRollCondi = null, localCondiSectionDone;
                if (condConfig && condConfig.faceTrigger(setup, result, result.rollSetup.conditionalActivated[condIterator])) {
                    ({ localToNextRollCondi, localCondiSectionDone } = condConfig.handleFaceMethod(result, setup, item, turn, condIterator));
                    logger(`handleRollTurn::after handleFaceMethod, localToNextRollCondi=${JSON.stringify(localToNextRollCondi)}`);
                    if (localToNextRollCondi) {
                        if (condConfig.tagAssociated) localToNextRollCondi.tagList = [condConfig.tagAssociated];
                        setup.toNextRollCondi.push(localToNextRollCondi);
                    }
                    if (localCondiSectionDone) {
                        setup.condiSectionDone.push(localCondiSectionDone);
                        break;
                    }
                }
            }
        } while (condIterator != result.rollSetup.conditionalActivated.length);

        logger(LOGLEVEL.INFO, `handleRollTurn::face(${setup.face}) END CONDITIONAL-ALL-TESTS ! toNextRollCondi.length=${setup.toNextRollCondi.length}`);
    },

    handleFaceCondition1MotD = (result, setup, item, turn, condIterator) => {
        var toNextRollCondi, condiSectionDone = null, cond = result.rollSetup.conditionalActivated[condIterator];
        logger(LOGLEVEL.INFO, `handleFaceCondition1MotD::face(${setup.face}) CONDITIONAL-1MotD TO DO ! rerolled=${setup.rerolled} exploded=${setup.exploded} section=${JSON.stringify(cond)}`);
        if (setup.success)
            cond.status[setup.face]++;
        logger(`handleFaceCondition1MotD::CONDI (cond.status[${setup.face}]=${cond.status[setup.face]} === 3)=${cond.status[setup.face] === 3}`);
        if (setup.success && cond.status[setup.face] === 3) {
            cond.status[setup.face] = 0;
            cond.remainingToDo++;
            setup.condTriggered = true;
        }
        if (cond.remainingToDo) {
            if (setup.success) {
                logger(LOGLEVEL.INFO, `handleFaceCondition1MotD::remainingToDo=${cond.remainingToDo}`);
                var diceNb = 1;
                for (var i = 0; i < result.rollSetup.finalResults.length && cond.remainingToDo > 0; i++) {
                    const dieTesting = result.rollSetup.finalResults[i];
                    if (dieTesting.v === 'SECTIONDONE') continue;
                    if (!dieTesting.success && !dieTesting.rerolled) {
                        logger(LOGLEVEL.INFO, `handleFaceCondition1MotD::found a die to reroll ! turning into a 10 die no=${diceNb++} dieTesting=${JSON.stringify(dieTesting)}`);
                        toNextRollCondi = {
                            v: 10, wasEverRerolled: true,
                            wasRerolled: true, wasExploded: false, wasConditionallyAffected: true,
                            title: [`RollTurn (${strFill(turn + 1)}). C(1MotD) ->Face=10F.`],
                            alternatePrevObjForTitle: dieTesting
                        };
                        dieTesting.condTriggered = false; //1MotD produce normal reroll but tagging for clarity
                        dieTesting.rerolled = true, dieTesting.condRerolled = true, dieTesting.wasEverRerolled = true;
                        logger(`handleFaceCondition1MotD::die rerolled =${JSON.stringify(result.rollSetup.finalResults[i])}`);
                        cond.remainingToDo--, cond.statusTotal[setup.face]++, cond.totalRerolled++;
                        dieTesting.title = makeNewTitleFromOld(result, dieTesting.title, ` 1MotD rerolled to a 10F (` + (cond.remainingToDo != 0 ? `Remaining:${cond.remainingToDo}, ` : '') + `Total=${cond.statusTotal[setup.face]}(${setup.face})/${cond.totalRerolled}).`);
                        setup.titleText += ` triggered a 1MotD reroll (` + (cond.remainingToDo != 0 ? `Rem.=${cond.remainingToDo}, ` : '') + `Total=${cond.statusTotal[setup.face]}(${setup.face})/${cond.totalRerolled}).`;
                    }
                }
                if (cond.remainingToDo) cond.remainingFaceStored.push(setup.face);
            } else {
                logger(LOGLEVEL.INFO, `handleFaceCondition1MotD:: Rerolling THIS dice ! turning into a 10F`);
                toNextRollCondi = {
                    v: 10, wasEverRerolled: true,
                    wasRerolled: true, wasExploded: false, wasConditionallyAffected: true,
                    title: [`RollTurn (${strFill(turn + 1)}). C(1MotD) ->Face=10F.`]
                };
                setup.rerolled = true;
                setup.wasEverRerolled = true;
                setup.condRerolled = true;
                const firstRemaining = cond.remainingFaceStored.shift();
                cond.remainingToDo--, cond.statusTotal[firstRemaining]++, cond.totalRerolled++;
                setup.titleText += ` 1MotD rerolled to a 10F (` + (cond.remainingToDo != 0 ? `Remaining:${cond.remainingToDo}, ` : '') + `Total=${cond.statusTotal[firstRemaining]}(${firstRemaining})/${cond.totalRerolled}).`;
            }
        }
        // if (condition of removing section) condiSectionDone = removeIteratorCondSectionMethod(result, condIterator, true);
        logger(`handleFaceCondition1MotD::QUITTING ! producedADie=${toNextRollCondi !== undefined}, titleText="${setup.titleText}", toNextRollCondi=${JSON.stringify(toNextRollCondi)}, condiSectionDone=${JSON.stringify(condiSectionDone)}`);
        return { localToNextRollCondi: toNextRollCondi, localCondiSectionDone: condiSectionDone };
    },

    handleFaceConditionDIT = (result, setup, item, turn, condIterator) => {
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
            toNextRollCondi = {
                v: newDie, wasEverRerolled: false,
                wasRerolled: false, wasExploded: true, wasConditionallyAffected: true,
                title: [`RollTurn (${strFill(turn + 1)}). C(DIT)       ->Face=${strFill(newDie)}.`],
                conditionalColor: cond.conditionalColor
            };
            setup.condTriggered = true;
            setup.conditionalColor = cond.conditionalColor;
            cond.done++;
            setup.titleText += ` DIT created a ${strFill(newDie)} ( Done${strFill(cond.done)}).`;
        }
        // if (condition of removing section) condiSectionDone = removeIteratorCondSectionMethod(result, condIterator, true);
        logger(LOGLEVEL.INFO, `handleFaceConditionDIT::QUITTING ! producedADie=${toNextRollCondi !== undefined}, titleText="${setup.titleText}", toNextRollCondi=${JSON.stringify(toNextRollCondi)}, condiSectionDone=${JSON.stringify(condiSectionDone)}`);
        return { localToNextRollCondi: toNextRollCondi, localCondiSectionDone: condiSectionDone };
    },

    handleFaceConditionRerollOn10 = (result, setup, item, turn, condIterator) => {
        var toNextRollCondi, cond = result.rollSetup.conditionalActivated[condIterator];
        logger(LOGLEVEL.INFO, `handleFaceConditionRerollOn10::face(${setup.face}) CONDITIONAL-REROLL POOL ON 10 TO DO ! rerolled=${setup.rerolled} exploded=${setup.exploded} section=${JSON.stringify(cond)}`);

        if (setup.face === 10) {
            cond.remainingToDo++;
            setup.condTriggered = true;
        }

        if (cond.remainingToDo && setup.face === 10) {
            logger(LOGLEVEL.INFO, `handleFaceConditionRerollOn10::remainingToDo=${cond.remainingToDo} result.rollSetup.finalResults.length=${result.rollSetup.finalResults.length}`);
            var diceNb = 1;
            for (var i = 0; i < result.rollSetup.finalResults.length && cond.remainingToDo > 0; i++) {
                const dieTesting = result.rollSetup.finalResults[i];
                if (dieTesting.v === 'SECTIONDONE') continue;
                if (!dieTesting.success && !dieTesting.rerolled) {
                    var newDie = randomInteger(10);
                    logger(LOGLEVEL.INFO, `handleFaceConditionRerollOn10::found a die to reroll ! turning a ${dieTesting.v} into a ${newDie} die no=${diceNb++} dieTesting=${JSON.stringify(dieTesting)}`);
                    toNextRollCondi = {
                        v: newDie, wasEverRerolled: true,
                        wasRerolled: true, wasExploded: false, wasConditionallyAffected: false,
                        title: [`RollTurn (${strFill(turn + 1)}). C(Ron10) ->Face=${newDie}.`],
                        alternatePrevObjForTitle: dieTesting
                    };
                    dieTesting.condTriggered = false;
                    dieTesting.rerolled = true, dieTesting.condRerolled = false, dieTesting.wasEverRerolled = true;
                    logger(`handleFaceConditionRerollOn10::die rerolled =${JSON.stringify(result.rollSetup.finalResults[i])}`);
                    cond.remainingToDo--, cond.done++;
                    dieTesting.title = makeNewTitleFromOld(result, dieTesting.title, ` Ron10 rerolled to a ${newDie} (Rem.=${cond.remainingToDo}, Done=${cond.done}).`);
                    setup.titleText += ` Ron10 rerolled a ${dieTesting.v} to a ${newDie} (Rem.=${cond.remainingToDo}, Done=${cond.done}).`;
                }
            }
        } else if (cond.remainingToDo && !setup.rerolled && !(setup.success || setup.doubled)) {
            var newDie = randomInteger(10);
            logger(LOGLEVEL.INFO, `handleFaceConditionRerollOn10:: Rerolling THIS dice ! turning into a ${newDie}`);
            toNextRollCondi = {
                v: newDie, wasEverRerolled: true,
                wasRerolled: true, wasExploded: false, wasConditionallyAffected: false,
                title: [`RollTurn (${strFill(turn + 1)}). C(Rn1on10) ->Face=${newDie}.`]
            };
            setup.rerolled = true;
            cond.remainingToDo--, cond.done++;
            setup.titleText += ` Rn1on10 rerolled to a ${newDie} (Rem.=${cond.remainingToDo}, Done=${cond.done}).`;
        }
        logger(`handleFaceConditionRerollOn10::QUITTING ! producedADie=${toNextRollCondi !== undefined}, titleText="${setup.titleText}", toNextRollCondi=${JSON.stringify(toNextRollCondi)}, condiSectionDone=null`);
        return { localToNextRollCondi: toNextRollCondi, localCondiSectionDone: null };
    },

    handleFaceConditionRerollNon1On10 = (result, setup, item, turn, condIterator) => {
        var toNextRollCondi, cond = result.rollSetup.conditionalActivated[condIterator];
        logger(LOGLEVEL.INFO, `handleFaceConditionRerollPoolNon1On10::face(${setup.face}) CONDITIONAL-REROLL POOL ON 10 TO DO ! rerolled=${setup.rerolled} exploded=${setup.exploded} section=${JSON.stringify(cond)}`);

        if (setup.face === 10) {
            cond.remainingToDo++;
            setup.condTriggered = true;
        }

        if (cond.remainingToDo && setup.face === 10) {
            logger(LOGLEVEL.INFO, `handleFaceConditionRerollPoolNon1On10::remainingToDo=${cond.remainingToDo} result.rollSetup.finalResults.length=${result.rollSetup.finalResults.length}`);
            var diceNb = 1;
            for (var i = 0; i < result.rollSetup.finalResults.length && cond.remainingToDo > 0; i++) {
                const dieTesting = result.rollSetup.finalResults[i];
                if (dieTesting.v === 'SECTIONDONE') continue;
                if (!dieTesting.success && !dieTesting.rerolled && dieTesting.v !== 1) {
                    var newDie = randomInteger(10);
                    logger(LOGLEVEL.INFO, `handleFaceConditionRerollPoolNon1On10::found a die to reroll ! turning a ${dieTesting.v} into a ${newDie} die no=${diceNb++} dieTesting=${JSON.stringify(dieTesting)}`);
                    toNextRollCondi = {
                        v: newDie, wasEverRerolled: true,
                        wasRerolled: true, wasExploded: false, wasConditionallyAffected: false,
                        title: [`RollTurn (${strFill(turn + 1)}). C(Rn1on10) ->Face=${newDie}.`],
                        alternatePrevObjForTitle: dieTesting
                    };
                    dieTesting.condTriggered = false;
                    dieTesting.rerolled = true, dieTesting.condRerolled = false, dieTesting.wasEverRerolled = true;
                    logger(`handleFaceConditionRerollPoolNon1On10::die rerolled =${JSON.stringify(result.rollSetup.finalResults[i])}`);
                    cond.remainingToDo--, cond.done++;
                    dieTesting.title = makeNewTitleFromOld(result, dieTesting.title, ` Rn1on10 rerolled to a ${newDie} (Rem.=${cond.remainingToDo}, Done=${cond.done}).`);
                    setup.titleText += ` Rn1on10 rerolled a ${dieTesting.v} to a ${newDie} (Rem.=${cond.remainingToDo}, Done=${cond.done}).`;
                }
            }
        } else if (cond.remainingToDo && !setup.rerolled && !(setup.success || setup.doubled) && setup.face !== 1) {
            var newDie = randomInteger(10);
            logger(LOGLEVEL.INFO, `handleFaceConditionRerollPoolNon1On10:: Rerolling THIS dice ! turning into a ${newDie}`);
            toNextRollCondi = {
                v: newDie, wasEverRerolled: true,
                wasRerolled: true, wasExploded: false, wasConditionallyAffected: false,
                title: [`RollTurn (${strFill(turn + 1)}). C(Rn1on10) ->Face=${newDie}.`]
            };
            setup.rerolled = true;
            cond.remainingToDo--, cond.done++;
            setup.titleText += ` Rn1on10 rerolled to a ${newDie} (Rem.=${cond.remainingToDo}, Done=${cond.done}).`;
        }
        logger(`handleFaceConditionRerollPoolNon1On10::QUITTING ! producedADie=${toNextRollCondi !== undefined}, titleText="${setup.titleText}", toNextRollCondi=${JSON.stringify(toNextRollCondi)}, condiSectionDone=null`);
        return { localToNextRollCondi: toNextRollCondi, localCondiSectionDone: null };
    },

    handleFaceConditionExplodeSuccesses = (result, setup, item, turn, condIterator) => {
        var toNextRollCondi, cond = result.rollSetup.conditionalActivated[condIterator];
        logger(LOGLEVEL.INFO, `handleFaceConditionExplodeSuccesses::face(${setup.face}) CONDITIONAL-EXPLODE SUCCESSES TO DO ! rerolled=${setup.rerolled} exploded=${setup.exploded} section=${JSON.stringify(cond)}`);

        var newDie = randomInteger(10);
        logger(LOGLEVEL.INFO, `handleFaceConditionExplodeSuccesses::producing a die`);
        toNextRollCondi = {
            v: newDie, wasEverRerolled: false,
            wasRerolled: false, wasExploded: true, wasConditionallyAffected: true, conditionalColor: cond.conditionalColor,
            title: [`RollTurn (${strFill(turn + 1)}). C(ES) ->Face=${newDie}.`]
        };
        setup.condTriggered = true;
        setup.conditionalColor = cond.conditionalColor;
        cond.done++;
        setup.titleText += ` ES produced a ${newDie} (Done=${cond.done}).`;

        logger(`handleFaceConditionExplodeSuccesses::QUITTING ! producedADie=${toNextRollCondi !== undefined}, titleText="${setup.titleText}", toNextRollCondi=${JSON.stringify(toNextRollCondi)}, condiSectionDone=null`);
        return { localToNextRollCondi: toNextRollCondi, localCondiSectionDone: null };
    },

    handleFaceConditionCR = (result, setup, item, turn, condIterator) => {
        var toNextRollCondi, cond = result.rollSetup.conditionalActivated[condIterator];
        logger(LOGLEVEL.INFO, `handleFaceConditionCR::face(${setup.face}) CONDITIONAL-REROLL POOL ON 10 TO DO ! rerolled=${setup.rerolled} exploded=${setup.exploded} section=${JSON.stringify(cond)}`);

        if (setup.success) {
            cond.remainingToDo++;
            setup.condTriggered = true;
        }

        if (cond.remainingToDo && setup.success) {
            logger(LOGLEVEL.INFO, `handleFaceConditionCR::remainingToDo=${cond.remainingToDo} result.rollSetup.finalResults.length=${result.rollSetup.finalResults.length}`);
            var diceNb = 1;
            for (var i = 0; i < result.rollSetup.finalResults.length && cond.remainingToDo > 0; i++) {
                const dieTesting = result.rollSetup.finalResults[i];
                if (dieTesting.v === 'SECTIONDONE') continue;
                if (!dieTesting.success && !dieTesting.rerolled) {
                    var newDie = randomInteger(10);
                    logger(LOGLEVEL.INFO, `handleFaceConditionCR::found a die to reroll ! turning a ${dieTesting.v} into a ${newDie} die no=${diceNb++} dieTesting=${JSON.stringify(dieTesting)}`);
                    toNextRollCondi = {
                        v: newDie, wasEverRerolled: true,
                        wasRerolled: true, wasExploded: false, wasConditionallyAffected: false,
                        title: [`RollTurn (${strFill(turn + 1)}). C(CR) ->Face=${newDie}.`],
                        alternatePrevObjForTitle: dieTesting
                    };
                    dieTesting.condTriggered = false;
                    dieTesting.rerolled = true, dieTesting.condRerolled = false, dieTesting.wasEverRerolled = true;
                    logger(`handleFaceConditionCR::die rerolled =${JSON.stringify(result.rollSetup.finalResults[i])}`);
                    cond.remainingToDo--, cond.done++;
                    dieTesting.title = makeNewTitleFromOld(result, dieTesting.title, ` CR rerolled to a ${newDie} (Rem.=${cond.remainingToDo}, Done=${cond.done}).`);
                    setup.titleText += ` CR rerolled a ${dieTesting.v} to a ${newDie} (Rem.=${cond.remainingToDo}, Done=${cond.done}).`;
                }
            }
        } else if (cond.remainingToDo && !setup.rerolled && !(setup.success || setup.doubled)) {
            var newDie = randomInteger(10);
            logger(LOGLEVEL.INFO, `handleFaceConditionCR:: Rerolling THIS dice ! turning into a ${newDie}`);
            toNextRollCondi = {
                v: newDie, wasEverRerolled: true,
                wasRerolled: true, wasExploded: false, wasConditionallyAffected: false,
                title: [`RollTurn (${strFill(turn + 1)}). C(CR) ->Face=${newDie}.`]
            };
            setup.rerolled = true;
            cond.remainingToDo--, cond.done++;
            setup.titleText += ` CR rerolled to a ${newDie} (Rem.=${cond.remainingToDo}, Done=${cond.done}).`;
        }
        logger(`handleFaceConditionCR::QUITTING ! producedADie=${toNextRollCondi !== undefined}, titleText="${setup.titleText}", toNextRollCondi=${JSON.stringify(toNextRollCondi)}, condiSectionDone=null`);
        return { localToNextRollCondi: toNextRollCondi, localCondiSectionDone: null };
    },

    handleFaceConditionRSuccLTHon1 = (result, setup, item, turn, condIterator) => {
        var cond = result.rollSetup.conditionalActivated[condIterator];
        if (cond.triggerDisplayed < cond.limit) {
            logger(LOGLEVEL.INFO, `handleFaceConditionRSuccLTHon1::face(${setup.face}) CONDITIONAL-REROLL SUCCESS ON 1 TO DO ! section=${JSON.stringify(cond)}`);

            setup.condTriggered = true;
            setup.conditionalColor = cond.conditionalColor;
            cond.remainingToDo++;
            cond.triggerDisplayed++;
            setup.titleText += ` RSuccLTHon1 triggered.`;

            logger(`handleFaceConditionRSuccLTHon1::QUITTING ! cond.remainingToDo=${cond.remainingToDo} toNextRollCondi=null, condiSectionDone=null`);
        }
        return { localToNextRollCondi: null, localCondiSectionDone: null };
    },

    /**
     * Turn Hook for Conditionals
     */
    handleTurnConditionalHook = (result, turn, nextRollsToProcess) => {
        logger(LOGLEVEL.INFO, `handleTurnConditionalHook::TURN CONDITIONAL-ALL-TESTS !`);

        var condIterator = 0;
        do {
            for (; condIterator < result.rollSetup.conditionalActivated.length; condIterator++) {
                var condConfig = ConditionalList[result.rollSetup.conditionalActivated[condIterator].name];
                logger(`handleRollTurn::testing section=${JSON.stringify(condConfig)}`);
                if (condConfig.turnHook) {
                    logger(LOGLEVEL.INFO, `handleRollTurn::HANDLING TURN ON Section=${JSON.stringify(condConfig)}`);
                    condConfig.turnHook(result, turn, nextRollsToProcess, condIterator);
                }
            }
        } while (condIterator != result.rollSetup.conditionalActivated.length);

        logger(LOGLEVEL.INFO, `handleTurnConditionalHook::END TURN CONDITIONAL-ALL-TESTS`);
    },

    handleTurnConditionalHookHMU = (result, turn, nextRollsToProcess, condIterator) => {
        if (turn !== 2) return;
        var cond = result.rollSetup.conditionalActivated[condIterator];
        if (cond.firstTurnSuccesses >= 3) {
            result.rollSetup.finalResults.push(makeSectionDoneObj('Cond-HMU', conditionalColor, `&#013;&#010; DIT generated 3 or more success (${cond.firstTurnSuccesses}) => Adding 3 dices`));
            for (var i = 0; i < 3; i++) {
                var newDie = randomInteger(10);
                nextRollsToProcess.push({
                    v: newDie, wasEverRerolled: false,
                    wasRerolled: false, wasExploded: true, wasConditionallyAffected: true,
                    title: [`RollTurn (${strFill(turn + 1)}). C(HMU)    ->Face=${strFill(newDie)}.`],
                    tagList: ['HMU']
                });
                cond.done++;
            }
        }
    },

    handleTurnConditionalHookCRStarter = (result, turn, nextRollsToProcess, condIterator) => {
        if (turn !== 1) return;
        var cond = result.rollSetup.conditionalActivated[condIterator];
        if (cond.starterCount > 0) {
            result.rollSetup.finalResults.push(makeSectionDoneObj('Cond-CRStarter', conditionalColor, `&#013;&#010; CRStarter generate ${cond.starterCount} dices that could start a Cascading Reroll`));
        }
        for (var i = 0; i < cond.starterCount; i++) {
            var newDie = randomInteger(10);
            nextRollsToProcess.push({
                v: newDie, wasEverRerolled: false,
                wasRerolled: false, wasExploded: true, wasConditionallyAffected: true,
                title: [`RollTurn (${strFill(turn + 1)}). C(CRStarter)    ->Face=${strFill(newDie)}.`],
                tagList: ['CRStarter']
            });
        }
    },

    /**
     * Final Hook for Conditionals, after all rolls have been done, but can start another dice roll
     */
    handleFinalConditionalHook = (result, turn, nextRollsToProcess) => {
        logger(LOGLEVEL.INFO, `handleFinalConditionalHook::FINAL CONDITIONAL-ALL-TESTS !`);

        var condIterator = 0, nextRollsToProcess = [];
        do {
            for (; condIterator < result.rollSetup.conditionalActivated.length; condIterator++) {
                var condConfig = ConditionalList[result.rollSetup.conditionalActivated[condIterator].name];
                logger(`handleRollTurn::testing section=${JSON.stringify(condConfig)}`);
                if (condConfig.finalHook) {
                    logger(LOGLEVEL.INFO, `handleRollTurn::HANDLING FINAL ON Section=${JSON.stringify(condConfig)}`);
                    condConfig.finalHook(result, turn, nextRollsToProcess, condIterator);
                }
            }
        } while (condIterator != result.rollSetup.conditionalActivated.length);

        logger(LOGLEVEL.INFO, `handleFinalConditionalHook::END nextRollsToProcess=${nextRollsToProcess.map(i => i.v)} FULL=${JSON.stringify(nextRollsToProcess)}`);
        result.rollSetup.rollToProcess = nextRollsToProcess;

        logger(LOGLEVEL.INFO, `handleTurnConditionalHook::END TURN CONDITIONAL-ALL-TESTS`);
    },

    handleTurnConditionalHookRSuccLTHon1 = (result, turn, nextRollsToProcess, condIterator) => {
        var cond = result.rollSetup.conditionalActivated[condIterator];
        if (cond.remainingToDo > 0) {
            result.rollSetup.finalResults.push(makeSectionDoneObj('Cond-RSuccLTHon1', conditionalColor, `&#013;&#010; RSuccLTHon1 need to reroll ${cond.limit} dices that shows as Success.`));
        }
        // find succes
        let succTable = [null];
        for (const face of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            succTable.push((result.rollSetup.face[face] && result.rollSetup.face[face].successes.length) ? { face: face, found: [] } : null);
        for (var i = 0; i < result.rollSetup.finalResults.length; i++) {
            const dieTesting = result.rollSetup.finalResults[i];
            if (dieTesting.v === 'SECTIONDONE') continue;
            if (dieTesting.success && !dieTesting.rerolled) {
                succTable[dieTesting.v].found.push(i);
            }
        }
        succTable = succTable.filter(a => a && a.found.length).sort((a, b) => a.face - b.face);
        logger(LOGLEVEL.INFO, `handleTurnConditionalHookRSuccLTHon1:: sorted succTable=${JSON.stringify(succTable)}`);
        // reroll
        while (cond.done < cond.limit && cond.remainingToDo && succTable.length) {
            const rerolledId = succTable[0].found.shift();
            if (!succTable[0].found.length) succTable.shift();
            const dieTesting = result.rollSetup.finalResults[rerolledId];
            var newDie = randomInteger(10);
            logger(LOGLEVEL.INFO, `handleTurnConditionalHookRSuccLTHon1::found a die to reroll ! turning a ${dieTesting.v} into a ${newDie} dieTesting=${JSON.stringify(dieTesting)}`);
            let toNextRollCondi = {
                v: newDie, wasEverRerolled: true,
                wasRerolled: true, wasExploded: false, wasConditionallyAffected: true, conditionalColor: cond.conditionalColor,
                title: [`RollTurn (${strFill(turn + 1)}). C(RSuccLTHon1) ->Face=${newDie}.`],
                alternatePrevObjForTitle: dieTesting
            };
            dieTesting.condTriggered = false;
            dieTesting.conditionalColor = cond.conditionalColor;
            dieTesting.rerolled = true, dieTesting.condRerolled = true, dieTesting.wasEverRerolled = true;
            logger(`handleTurnConditionalHookRSuccLTHon1::die rerolled =${JSON.stringify(result.rollSetup.finalResults[i])}`);
            cond.remainingToDo--, cond.done++;
            dieTesting.title = makeNewTitleFromOld(result, dieTesting.title, ` RSuccLTHon1 rerolled to a ${newDie} (Rem.=${cond.remainingToDo}, Done=${cond.done}).`);
            nextRollsToProcess.push(toNextRollCondi);
        }
    },

    /**
     * Detail title per conditions
     */
    detailsCond1MotDSectionDone = (condObj, showDone = false) => {
        logger(LOGLEVEL.NOTICE, `detailsCond1MotDSectionDone::COND-1MotD Detail SECTION DONE=${JSON.stringify(condObj)}`);
        var detail = `&#013;&#010; Remaining To DO=${condObj.remainingToDo}&#013;&#010; Total Rerolled =${condObj.totalRerolled}`;
        const faceList = condObj.statusTotal.map((i, index) => Number.isInteger(i) ? index : null).filter(i => i);
        logger(`detailsCond1MotDSectionDone::faceList=${faceList}`);
        if (showDone)
            for (const i of faceList) detail += `&#013;&#010; ${strFill(i)}: ${condObj.status[i]}/3-RerollTriggered=${condObj.statusTotal[i]}`;
        return detail;
    },

    detailsCondDITSectionDone = (condObj, showDone = false) => {
        logger(LOGLEVEL.NOTICE, `detailsCondDITSectionDone::COND-DIT Detail SECTION DONE=${JSON.stringify(condObj)}`);
        var detail = `&#013;&#010; Success stocked=${condObj.status}/3&#013;&#010; Total generated =${condObj.done}`;
        return detail;
    },

    detailsCondRerollsOn10SectionDone = (condObj, showDone = false) => {
        logger(LOGLEVEL.NOTICE, `detailsCondRn1on10SectionDone::COND-R(n1)on10 Detail SECTION DONE=${JSON.stringify(condObj)}`);
        var detail = `&#013;&#010; Total rerolled =${condObj.done}&#013;&#010; Remaining =${condObj.remainingToDo}`;
        return detail;
    },

    detailsCondESSectionDone = (condObj, showDone = false) => {
        logger(LOGLEVEL.NOTICE, `detailsCondESSectionDone::COND-ES Detail SECTION DONE=${JSON.stringify(condObj)}`);
        var detail = `&#013;&#010; Total produced =${condObj.done}`;
        return detail;
    },

    detailsCondCRSectionDone = (condObj, showDone = false) => {
        logger(LOGLEVEL.NOTICE, `detailsCondCRSectionDone::COND-CR Detail SECTION DONE=${JSON.stringify(condObj)}`);
        var detail = `&#013;&#010; Total rerolled =${condObj.done}&#013;&#010; Remaining =${condObj.remainingToDo}`;
        return detail;
    },

    detailsCondRSuccLTHon1SectionDone = (condObj, showDone = false) => {
        logger(LOGLEVEL.NOTICE, `detailsCondRSuccLTHon1SectionDone::COND-REROLL SUCCESS Detail SECTION DONE=${JSON.stringify(condObj)}`);
        var detail = `&#013;&#010; Limit =${condObj.limit}&#013;&#010; Total rerolled =${condObj.done}&#013;&#010; Remaining =${condObj.remainingToDo}`;
        return detail;
    },

    makeSectionDoneObj = (typeTxt, color, detailsTxt = '') => {
        return { v: 'SECTIONDONE', sectionType: typeTxt, color: color, details: detailsTxt };
    };

    // CONDITIONAL HANDLING ARRAY
    const ConditionalList = {
        '1MotD': {
            faceTrigger: (setup, result, cond) => !setup.rerolled && (setup.success || cond.remainingToDo),
            handleFaceMethod: handleFaceCondition1MotD, //(result, setup, item, turn, condIterator)
            getDetailMethod: detailsCond1MotDSectionDone, //f(condObj, showDone = false)
            defaultConditionObj: {
                name: '1MotD',
                status: [, , , , , , , 0, 0, 0, 0],
                remainingToDo: 0,
                remainingFaceStored: [],
                statusTotal: [, , , , , , , 0, 0, 0, 0],
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
            faceTrigger: (setup, result, cond) => setup.success,
            handleFaceMethod: handleFaceConditionDIT, //(result, setup, item, turn, condIterator)
            getDetailMethod: detailsCondDITSectionDone, //f(condObj, showDone = false)
            defaultConditionObj: {
                name: 'DIT',
                status: 0,
                done: 0,
                conditionalColor: '#00ff70'
            },
            finalizeDefaultConditionObj: null, //finalizeDefaultConditionObjDIT
            tagAssociated: 'DIT'
        },
        'HMU': {
            faceTrigger: (setup, result, cond) => setup.success,
            handleFaceMethod: handleFaceConditionDIT, //(result, setup, item, turn, condIterator)
            turnHook: handleTurnConditionalHookHMU, //f(result, turn, nextRollsToProcess, condIterator)
            getDetailMethod: detailsCondDITSectionDone, //f(condObj, showDone = false)
            defaultConditionObj: {
                name: 'HMU',
                status: 0,
                done: 0,
                firstTurnSuccesses: 0,
                conditionalColor: '#00ff70'
            },
            finalizeDefaultConditionObj: null, //finalizeDefaultConditionObjDIT
            tagAssociated: 'DIT'
        },
        'Ron10': {
            faceTrigger: (setup, result, cond) => setup.face === 10 || (cond.remainingToDo && !setup.success),
            handleFaceMethod: handleFaceConditionRerollOn10, //(result, setup, item, turn, condIterator)
            turnHook: null, //f(result, turn, nextRollsToProcess, condIterator)
            getDetailMethod: detailsCondRerollsOn10SectionDone, //f(condObj, showDone = false)
            defaultConditionObj: {
                name: 'Ron10',
                remainingToDo: 0,
                done: 0
            },
            finalizeDefaultConditionObj: null //finalizeDefaultConditionObjDIT
        },
        'Rn1on10': {
            faceTrigger: (setup, result, cond) => setup.face === 10 || (cond.remainingToDo && setup.face !== 1 && !setup.success),
            handleFaceMethod: handleFaceConditionRerollNon1On10, //(result, setup, item, turn, condIterator)
            turnHook: null, //f(result, turn, nextRollsToProcess, condIterator)
            getDetailMethod: detailsCondRerollsOn10SectionDone, //f(condObj, showDone = false)
            defaultConditionObj: {
                name: 'Rn1on10',
                remainingToDo: 0,
                done: 0
            },
            finalizeDefaultConditionObj: null //finalizeDefaultConditionObjDIT
        },
        'ES': {
            faceTrigger: (setup, result, cond) => setup.success,
            handleFaceMethod: handleFaceConditionExplodeSuccesses, //(result, setup, item, turn, condIterator)
            getDetailMethod: detailsCondESSectionDone, //f(condObj, showDone = false)
            defaultConditionObj: {
                name: 'ES',
                done: 0,
                conditionalColor: explodedColor
            },
            finalizeDefaultConditionObj: null //finalizeDefaultConditionObjDIT
        },
        'CR': {
            faceTrigger: (setup, result, cond) => setup.success || cond.remainingToDo,
            handleFaceMethod: handleFaceConditionCR, //(result, setup, item, turn, condIterator)
            getDetailMethod: detailsCondCRSectionDone, //f(condObj, showDone = false)
            defaultConditionObj: {
                name: 'CR',
                remainingToDo: 0,
                done: 0
            },
            finalizeDefaultConditionObj: null //finalizeDefaultConditionObjDIT
        },
        'CRStarter': {
            regPattern: /CRStarter\s(\d+)/,
            parseCommand: parseCondCRStarter, //f(defaultConditionObj, parsedReturn)
            faceTrigger: (setup, result, cond) => setup.success && setup.tagList.includes('CRStarter') || !setup.success && cond.remainingToDo,
            handleFaceMethod: handleFaceConditionCR, //(result, setup, item, turn, condIterator)
            turnHook: handleTurnConditionalHookCRStarter, //f(result, turn, nextRollsToProcess, condIterator)
            getDetailMethod: detailsCondCRSectionDone, //f(condObj, showDone = false)
            defaultConditionObj: {
                name: 'CRStarter',
                starterCount: 0,
                remainingToDo: 0,
                done: 0
            },
            finalizeDefaultConditionObj: null, //finalizeDefaultConditionObjDIT
            tagAssociated: 'CRStarter'
        },
        'RSuccLTHon1': {
            regPattern: /RSuccLTHon1\s(\d+)/,
            parseCommand: parseCondRSuccLTHon1, //f(defaultConditionObj, parsedReturn)
            faceTrigger: (setup, result, cond) => setup.face === 1,
            handleFaceMethod: handleFaceConditionRSuccLTHon1, //(result, setup, item, turn, condIterator)
            finalHook: handleTurnConditionalHookRSuccLTHon1, //f(result, turn, nextRollsToProcess, condIterator)
            getDetailMethod: detailsCondRSuccLTHon1SectionDone, //f(condObj, showDone = false)
            defaultConditionObj: {
                name: 'RSuccLTHon1',
                limit: 1,
                triggerDisplayed: 0,
                remainingToDo: 0,
                done: 0,
                conditionalColor: '#FF0000'
            },
            finalizeDefaultConditionObj: null, //finalizeDefaultConditionObjDIT
            tagAssociated: 'CRStarter'
        }
    };

    const DefaultRollObj = {
        hasRecursiveOrExplosiveFeature: false,
        has10doubled: true,
        verbosity: 0,
        colored: false,
        onlyResult: false,
        noBotch: false,
        revertTitleOrder: false,
        face: [null],
        rerollPool: [],
        conditionalActivated: [],
        rollToProcess: [],
        finalResults: [],
        maxRecursiveAchieved: false,
        hasAtLeastOneFaceOne: false
    },
    DefaultTurnObj = {
        face: null,
        faceObj: null, // link to rollSetup corresponding face obj {face: i,rerolls: [],explosives: [],successes: [],doubles: []}
        titleText: '',
        tagList: [],
        rerolled: false,
        condTriggered: false,
        condRerolled: false,
        conditionalColor: undefined,
        exploded: false,
        success: false,
        doubled: false,
        toNextRollRerolled: null,
        toNextRollExploded: null,
        toNextRollCondi: [],
        rerollSnapshot: null, // snapshot of the actual reroll section for this face value if available
        rerollSectionDone: null,
        successSnapshot: null, // snapshot of the actual success section for this face value if available
        successSectionDone: null,
        doubleSnapshot: null, // snapshot of the actual double section for this face value if available
        doubleSectionDone: null,
        explodeSnapshot: null, // snapshot of the actual explode section for this face value if available
        explodeSectionDone: null,
        condiSectionDone: []
    };

    const ParserConfig = [{
        categoryName: 'Rerolls',
        pattern: /^(r|R)(l\d*)?(k|K)?\s([\d,]+)(?:\sTAGS=([(?:\w)+,]+))?$/,
        getCmdObj: (matchReturn) => ({
            cmd:        matchReturn[1],
            limit:      matchReturn[2] ? Number(matchReturn[2].substring(1)) : 0,
            keepBest:   matchReturn[3] ? true : false,
            faces:      [...matchReturn[4].split(',').filter(i => i).map(i => Number(i))],
            tagList:    matchReturn[5] ? [...matchReturn[5].split(',').filter(i => i)] : []
        })
    }, {
        categoryName: 'Reroll Pools',
        pattern: /^(rP)\s([\d,]+)(?:\sIGNORE=([\d,]+))?(?:\sTAGS=([(?:\w)+,]+))?$/,
        getCmdObj: (matchReturn) => ({
            cmd:        matchReturn[1],
            limit:      Number(matchReturn[2]),
            ignoreList: matchReturn[3] ? [...matchReturn[3].split(',').filter(i => i).map(i => Number(i))] : [],
            tagList:    matchReturn[4] ? [...matchReturn[4].split(',').filter(i => i)] : []
        }),
    }, {
        categoryName: 'Successes, Doubles & Explodes',
        pattern: /^(d|e|E|s)(l\d*)?\s([\d,]+)$/,
        getCmdObj: (matchReturn) => ({
            cmd:        matchReturn[1],
            limit:      matchReturn[2] ? Number(matchReturn[2].substring(1)) : 0,
            faces:      [...matchReturn[3].split(',').filter(i => i).map(i => Number(i))]
        })
    }, {
        categoryName: 'Fails',
        pattern: /^(f|F)\s([\d,]+)$/,
        getCmdObj: (matchReturn) => ({
            cmd:        matchReturn[1],
            faces:      [...matchReturn[2].split(',').filter(i => i).map(i => Number(i))]
        })
    }, {
        categoryName: 'Arcane Fate',
        pattern: /^([^:]+):(AF)(\d):peri=(\d)$/,
        getCmdObj: (matchReturn) => ({
            cmd:        matchReturn[2],
            option:     Number(matchReturn[3]),
            periFirst:  matchReturn[4] === '1',
            charId:     '-' + matchReturn[1]
        })
    }, {
        categoryName: 'GM, D, Turn, Verbosity, color, onlyResult, reverseTitle',
        pattern: /^(g|gm|D|target|turn|v|V|c|o|onlyResult|rev|reverseTitle|NB|NoBotch)$/,
        getCmdObj: (matchReturn) => ({
            cmd: matchReturn[1]
        })
    }];

    // HELP Handout
    const tableStyle = 'border-collapse: collapse; width: 100%; color: black;',
        thStyle = 'text-align: center;',
        tdStyle = 'padding: 5px; border: 1px solid rgb(200,200,200);',
        divStyle = 'border: 1px solid rgb(200,200,200); border-radius: 3px; background-color: white; padding: 5px; margin: 10px 0px; color: black;',
        pStyle = 'margin: 5px 0px; line-height: 1.5;',
        helpData = [
            {
                arrayfirstCol: ['-d NB,...', '-d[lNB] NB,...', '-D'],
                arraySecondCol: [
                    '<b>These commands cover doubling of all successful corresponding face(s).</b>',
                    '<code style="white-space: nowrap">-d</code>, followed by a comma-delimited list of values to double, automatically doubles 10s.',
                    '<code style="white-space: nowrap">-D</code> prevent this (mostly useful for damage rolls).',
                    '<code style="white-space: nowrap">-d</code> without arguments is unnecessary, as the script will double 10s by default.',
                    'You <em>may</em> pass <code style="white-space: nowrap">-D</code> by itself, to double nothing.',
                    'The optional <code>l</code> signals the script to limit the number of doubles.',
                    'Example :<code style="white-space: nowrap">!exr 10# -dl1 8,9</code>.',
                    'The optional <code>l</code> modifier covers cases where a charm or effect offers limited doubled results.\
        Just add <code>l</code> and the maximum number of doubles after the command, <em>e.g.,</em> <code style="white-space: nowrap">-dl5 8</code>.',
                    '---------',
                    "These command can be stacked, consuming smallest limit first and trying to do all the limit,\
        <em>e.g.,</em> <code style=\"white-space: nowrap\">-dl3 8,9 -dl2 9</code> would try to reroll 5 9s, first consuming the limit '2' then '3'\
        This is the case for each command using the <code>l</code> optional code"
                ],
            },
            {
                arrayfirstCol: ['-s NB,...', '-s[lNB] NB,...'],
                arraySecondCol: [
                    '<b>These commands cover adding faces as success.</b>',
                    '<code style="white-space: nowrap">-s</code>, followed by a comma-delimited list of values to add as success, useless without arguments.',
                    'The optional <code>l</code> signals the script to limit the number of this/these faces counting as success.',
                    'Example :<code style="white-space: nowrap">!exr 10# -sl3 2,5,6</code>.',
                    'The optional <code>l</code> modifier covers really rare cases where a charm or effect enable other sides as succes (sidereals for example).\
        Follow rules described in first command',
                    '---------',
                    "These command can be stacked, consuming smallest limit first and trying to do all the limit,\
        <em>e.g.,</em> <code style=\"white-space: nowrap\">-dl3 8,9 -dl2 9</code> would try to reroll 5 9s, first consuming the limit '2' then '3'\
        This is the case for each command using the <code>l</code> optional code"
                ],
            },
            {
                arrayfirstCol: ['-r NB,...', '-r[lNB] NB,...', '-r[k|K] NB,...', '-r NB TAGS=LABEL,...', '-R NB,...', '-R[lNB] NB,...', '-R[k|K] NB,...', '-R NB TAGS=LABEL,...'],
                arraySecondCol: [
                    '<b>These commands cover rerolls, followed by a comma-delimited list of values to reroll.</b>',
                    '<code style="white-space: nowrap">-r</code> provides single rerolls—once the values have been rerolled once.',
                    '<code style="white-space: nowrap">-R</code> is a <em>recursive</em> reroll, and covers the cases where a charm or effect instructs you to "reroll [x]s until [x]s fail to appear."\
        It will keep rerolling the results in the comma-delimited list of arguments until those values are no longer in the pool, for better or for worse.\
        By default, rerolled dice are hidden, see <code style="white-space: nowrap">-v|V</code> below.',
                    'The optional <code>l</code> signals the script to limit the number of rerolls. Example :<code style="white-space: nowrap">!exr 10# -rl 6,4</code>.',
                    'The optional <code style="white-space: nowrap">k|K</code> signals the script that you want to keep the highest rerolled value. Example :<code style="white-space: nowrap">!exr 10# -rk 1</code>.',
                    'The optional <code style="white-space: nowrap">TAGS=LABEL,LABEL,...</code> signals the script that you tag the rerolled dice with some label (usefull for some specific charms). Example :<code>!exr 10# -r 1,2 TAGS=charm1</code>.',
                    'Everything above can be combined.',
                    'Example :<code style="white-space: nowrap">!exr 10# -Rl3K 1,2,3 TAGS=charm42OP</code>.',
                    '---------',
                    "These command can be stacked, consuming smallest limit first and trying to do all the limit,\
        <em>e.g.,</em> <code style=\"white-space: nowrap\">-dl3 8,9 -dl2 9</code> would try to reroll 5 9s, first consuming the limit '2' then '3'\
        This is the case for each command using the <code>l</code> optional code"
                ],
            },
            {
                arrayfirstCol: ['-rP NB', '-rP NB IGNORE=NB,...', '-rP NB TAGS=LABEL,...', '-rP NB IGNORE=NB,... TAGS=LABEL,...'],
                arraySecondCol: [
                    '<b>This command cover reroll pools, or reroll of fails not specific to one face, followed by the limit/number of faces to reroll.</b>',
                    'This command follows the rules of recursive reroll (see previous section) as you would reroll fails until limit has been reached or all has become successes.\
        By default, rerolled dice are hidden, see <code style="white-space: nowrap">-v|V</code> below.',
                    'The optional <code style="white-space: nowrap">IGNORE=NB,NB,...</code> signals the script that you don\'t want the reroll pool to affect these numbers.',
                    'Example :<code>!exr 10# -rP 4 IGNORE=1</code>.',
                    'The optional <code style="white-space: nowrap">TAGS=LABEL,LABEL,...</code> signals the script that you tag the rerolled dice with some label (usefull for some specific charms).',
                    'Example :<code>!exr 10# -rP 4 TAGS=charm1</code>.',
                    '---------',
                    "These command can be stacked, consuming smallest limit first and trying to do all the limit,\
        <em>e.g.,</em> <code style=\"white-space: nowrap\">-dl3 8,9 -dl2 9</code> would try to reroll 5 9s, first consuming the limit '2' then '3'\
        This is the case for each command using the <code>l</code> optional code"
                ],
            },
            {
                arrayfirstCol: ['-e NB,...', '-e[lNB]', '-E NB,...', '-E[lNB]'],
                arraySecondCol: [
                    '<b>These commands cover exploding of faces, creating new dice when happening.</b>',
                    '<code style=\"white-space: nowrap\">-e</code>, followed by a comma-delimited list of values to explode, not exploding on rerolled dices.',
                    '<code style=\"white-space: nowrap\">-E</code> works the same as above but ignore if dice is rerolled, exploding each time the face is encountered.',
                    '<code style=\"white-space: nowrap\">-e/E</code> without arguments is useless.',
                    'The optional <code>l</code> signals the script to limit the number of explodes.',
                    'Example :<code style="white-space: nowrap">!exr 10# -el1 8,9</code>.',
                    "The optional <code>l</code> modifier covers cases where a charm or effect offers limited doubled results. Follow rules described in first command",
                    '---------',
                    "These command can be stacked, consuming smallest limit first and trying to do all the limit,\
        <em>e.g.,</em> <code style=\"white-space: nowrap\">-dl3 8,9 -dl2 9</code> would try to reroll 5 9s, first consuming the limit '2' then '3'\
        This is the case for each command using the <code>l</code> optional code"
                ],
            },
            {
                arrayfirstCol: ['-f', '-F'],
                arraySecondCol: ["<b>This commands cover failing of faces, removing success normally awarded on this face.</b>", "Used almost only by sidereals.", "Example :<code style=\"white-space: nowrap\">!exr 42#+2 -f 8,9</code>."],
            },
            {
                arrayfirstCol: ['@{character_id}:AF1:peri=1', '@{character_id}:AF2:peri=0', '@{character_id}:AF3:peri=0'],
                arraySecondCol: ["<b>This commands cover Arcane Fate for Sidereals.</b>", "- AF1: Same usage than <code style=\"white-space: nowrap\">-s 6</code> plus deduct 1 mote automatically.", "- AF2: Same usage than <code style=\"white-space: nowrap\">-s 6,5</code> plus deduct 2 mote automatically.", "- AF3: Same usage than <code style=\"white-space: nowrap\">-s 6,5,4</code> plus deduct 3 mote automatically.", "The <code style=\"white-space: nowrap\">peri=</code> is there to specify if it's from peripheral first, all value different than '1' will be interpreted as Personal Essence first"],
            },
            {
                arrayfirstCol: ['-v', '-V', '-c'],
                arraySecondCol: [
                    '<b>These commands are used to increase visual information included in the roll.</b>',
                    "<code style=\"white-space: nowrap\">-v</code> is 1st level of verbosity, including 'roll turns' markers to track limits and rerolls.",
                    "<code style=\"white-space: nowrap\">-c</code> is color shadows, used to track visually which dice is rerolled, which come from a reroll, same for exploding & conditionals.",
                    "<code style=\"white-space: nowrap\">-V</code> is a short hand for -v -c",
                    "Example :<code style=\"white-space: nowrap\">!exr 42#+2 -v -c -gm</code>."
                ],
            },
            {
                arrayfirstCol: ['-g', '-gm'],
                arraySecondCol: ["<b>This commands is used to hide roll to other players.</b>", "Example :<code style=\"white-space: nowrap\">!exr 42#+2 -el1 8,9 -gm</code>."],
            },
            {
                arrayfirstCol: ['-target', '-turn'],
                arraySecondCol: ["<b>This command is used to set result as turn tracker value for selected token.</b> Do nothing more than a roll if no token is selected"],
            },
            {
                arrayfirstCol: ['-rev', '-reverseTitle'],
                arraySecondCol: ["<b>This command is used to reverse order of title (hover text on each dice) informations.</b>"],
            },
            {
                arrayfirstCol: ['-o', '-onlyResult'],
                arraySecondCol: ["<b>This command is used to hide dices and only show result.</b>"],
            },
            {
                arrayfirstCol: ['-NB', '-NoBotch'],
                arraySecondCol: ["<b>This command is used to hide the botch message.</b>"],
            },
            {
                arrayfirstCol: ['-setOnce COMMANDS', '-set COMMANDS'],
                arraySecondCol: [
                    "<b>These commands are used to store the following commands for next roll(s).</b>",
                    "<code style=\"white-space: nowrap\">-set</code> store the commands until a <code style=\"white-space: nowrap\">-clearStored</code> or <code style=\"white-space: nowrap\">-clearAllStored</code> is used.",
                    "Example :<code style=\"white-space: nowrap\">!exr -setOnce -d 9 -CRStarter @{essence}</code>.",
                    "<hr>",
                    "<b><u>Beware</u></b>",
                    "The commands are recomposed sequentially, starting from <b>stored</b>, then <b>storedOnce</b>, then the <b>provided ones</b>.",
                    "Then commands are processed sequentially, if same commands are stored and sent in the roll, stored will be executed before what you had prepared in the roll."
                ],
            },
            {
                arrayfirstCol: ['-clearStored', '-clearAllStored'],
                arraySecondCol: [
                    "<b>These commands are used to clear the stored commands.</b>",
                    "<code style=\"white-space: nowrap\">-clearAllStored</code> clear also what has been set with <code style=\"white-space: nowrap\">-setOnce</code>.",
                ],
            },
            {
                arrayfirstCol: ['-listAllStored'],
                arraySecondCol: ["<b>This command is used to list the stored commands for later rolls.</b>"],
            },
            {
                arrayfirstCol: [...Object.keys(ConditionalList).map(i => `-${i}`)],
                arraySecondCol: [
                    "<b>These commands are conditionals triggers</b>, name are abreviation from book, you should refer to the book for these ones and contact the developper if something feel off.",
                    "Actually there is :",
                    '-1MotD : CRAFT=> First Movement of the Demiurge, Exalted Core, p298',
                    '-DIT : CRAFT=> Divine Inspiration Technique, Exalted Core, p298',
                    '-HMU : CRAFT=> Holistic Miracle Understanding (improved version of DIT), Exalted Core, p299',
                    '-Ron10 : on 10 Reroll 1 non success',
                    '-Rn1on10 : on 10 Reroll 1 non success which is not a 1; used in: DB ATHLETICS=> Soaring Leap Technique, Exalted Dragon-Blooded, p169',
                    '-RSuccLTHon1 NB : on 1 Reroll 1 success from lowest (usually 7) to highest; used in: DB SOCIALIZE=> Smoke-Wreathed Mien, Exalted Dragon-Blooded, p261',
                    '-ES : Explode on success. NOT USED IN CHARMS',
                    '-CR : Cascading Reroll, reroll one failed dice for one dice that turn as a success. used for Ambush Predator Style + Familiar Honing Instruction (Solar Survival)',
                    '-CRStarter NB : Example <code style=\"white-space: nowrap\">!exr 10#+1 -CRStarter 5 -gm</code> Cascading Reroll Starter, reroll one failed dice for one dice that turn as a success from these starter.'
                ],
            }
        ],
        defaultTokenImage = 'https://s3.amazonaws.com/files.d20.io/images/284130603/IQ6eBu9uZ9SJqIcXlQaF9A/max.png?1651969373',
        helpVersion = 1.22;

    // Attacks & Lack of Ressource message/GmWhisper styles
    const styles = {
        menu:            'background-color: #fff; border: 1px solid #000; padding: 5px; border-radius: 5px;',
        buttonStyle:     'display: inline-block; '
                        +'border: 2px solid gold; '
                        +'border-radius: 4px; '
                        +'background: gray; '
                        +'color: goldenrod; '
                        +'font-weight: bold; '
                        +'line-height: 19px; '
                        +'text-align: center;',

        title:           'font-size:14px;font-weight:bold;background-color:black;padding:3px;border-top-left-radius:3px;border-top-right-radius:3px',
        titleText:       'color:white',
        overflow:        'overflow: hidden;',
        buttonRight:     'display:inline-block;float:right;vertical-aligh:middle',
        defaultDivStyle: 'display:inline-block;width:100%;vertical-align:middle;'
    };

    // Script specific CONST
    const   script_name = 'EX3Dice',
            script_version = 1.2,
            lastUpdate = 1662051343;

    // Methods
    const setupRollStructure = (result) => {
        result.rollSetup = JSON.parse(JSON.stringify(DefaultRollObj));

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
            result.rollSetup.face[i].successes.push({ limit: 0, done: 0 });

        logger(`setupRollStructure::result.rollSetup=${JSON.stringify(result.rollSetup)}`);
    },

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

    /**
     * The core functionality of the script. Intercepts API messages meant for it, extracts the core of the command, and passes it to
     * the appropriate function for handling.
     */
    onChatMessage = (msg) => {
        logger(`onChatMessage::onChatMessage msg=${JSON.stringify(msg)}`);
        replaceInlineRolls(msg);

        var apiWake = '!exr ';
        if (['api', 'general'].includes(msg.type) && msg.content.indexOf(apiWake) === 0) {
            var slc = msg.content.slice(msg.content.indexOf(apiWake) + apiWake.length);
            var rawCmd = slc.trim();
            rawCmd = sliceSpecials(rawCmd, msg);

            logger(`onChatMessage:: after sliceSpecials rawCmd='${rawCmd}'`);

            var patt = /^.*#/;
            if (patt.test(rawCmd)) {
                var parseCmd = rawCmd.replace('#', 'd10>7');
                var finalParseCmd = sliceComments(parseCmd);
                var rollStr = '/roll ' + finalParseCmd;
                performRoll(msg, rollStr, parseCmd);
            } else if (rawCmd.indexOf('-help') != -1) {
                var outHTML = buildHelp();
                sendChat(script_name, '/w ' + msg.who + ' ' + outHTML);
            } else if (rawCmd === '') {
                logger(LOGLEVEL.INFO, `onChatMessage:: NO COMMAND REMAINING => assume its a cost only for charms`);
            } else {
                printError(msg, msg.who);
            }
        }
    },

    sliceComments = (str) => {
        while (str.match(/\[[^\]]+\]/)) str = str.replace(/\[[^\]]+\]/g, '');
        return str;
    },

    replaceInlineRolls = (msg) => {
        if (msg.inlinerolls && msg.inlinerolls.length !== 0) {
            for (let i = 0; i < msg.inlinerolls.length; i++) {
                logger(`onChatMessage::onChatMessage REPLACING $[[${i}]] by ${msg.inlinerolls[i].results.total}`);
                msg.content = msg.content.replace(`$[[${i}]]`, msg.inlinerolls[i].results.total);
            }
            logger(`onChatMessage::onChatMessage msg.content=${JSON.stringify(msg)}`);
        }
    },

    sendOnslaughtWhisperToGm = () => {
        sendChat(script_name, `/w gm <a style="${styles.buttonStyle}" href="!cmaster --onslaught"> &gt; Set Onslaught to Selected &lt; </a>`);
    },

    setCostCallback = (rawCmd, costSlice) => {
        logger(LOGLEVEL.INFO, `setCostCallback:: costSlice=${costSlice} rawCmd='${rawCmd}'`);
        setCosts(costSlice);
    },

    setCommandsToNextRollOnceCallback = (rawCmd, commandSlice) => {
        logger(LOGLEVEL.INFO, `setCommandsToNextRollOnceCallback:: commandSlice='${commandSlice}' rawCmd='${rawCmd}'`);
        setCommandsToNextRoll(commandSlice);
    },

    setCommandsToNextRollCallback = (rawCmd, commandSlice) => {
        logger(LOGLEVEL.INFO, `setCommandsToNextRollCallback:: commandSlice='${commandSlice}' rawCmd='${rawCmd}'`);
        setCommandsToNextRoll(commandSlice, true);
    },

    clearStoredCommandCallback = () => {
        logger(LOGLEVEL.INFO, `clearAllStoredCommandCallback:: CLEARING STORED CMDS`);
        checkStateOrDefault();
        state[ex3DiceState].commandStored = [];
    },

    clearAllStoredCommandCallback = () => {
        logger(LOGLEVEL.INFO, `clearAllStoredCommandCallback:: CLEARING ALL STORED CMDS`);
        checkStateOrDefault();
        state[ex3DiceState].commandStored = [];
        state[ex3DiceState].commandStoredOnce = [];
    },

    listAllStoredCommandCallback = () => {
        checkStateOrDefault();
        logger(LOGLEVEL.INFO, `listAllStoredCommandCallback:: stored once cmds='${JSON.stringify(state[ex3DiceState].commandStoredOnce)}'`);
        logger(LOGLEVEL.INFO, `listAllStoredCommandCallback:: stored lingering cmds='${JSON.stringify(state[ex3DiceState].commandStored)}'`);
        var html = "";
        html += "<div style=\"" + outerStyleNoBack + "\"><div style=\"" + innerStyle + "\">";
        html +=     "<div class=\"formula\" style=\"" + formulaStyle + "\">";
        if (state[ex3DiceState].commandStored.length)
            html +=     "stored cmd: <code style=\"font-size:0.8em;\">" + state[ex3DiceState].commandStored.map(i => i.origCmd).join(' ') + "</code><br>";
        if (state[ex3DiceState].commandStoredOnce.length)
            html +=     "storedOnce cmd: <code style=\"font-size:0.8em;\">" + state[ex3DiceState].commandStoredOnce.map(i => i.origCmd).join(' ') + "</code>";
        if (!state[ex3DiceState].commandStored.length && !state[ex3DiceState].commandStoredOnce.length)
            html +=     "No command has been stored yet.";
        html +=     "</div>";
        html += "</div>";
        return html;
    },

    arraySliceSpecials = [
        {slice:'==atk==', callback:sendOnslaughtWhisperToGm},
        {slice:'=COST:', callback:setCostCallback},
        {slice:'-setOnce ', callback:setCommandsToNextRollOnceCallback},
        {slice:'-set ', callback:setCommandsToNextRollCallback},
        {slice:'-clearStored', callback:clearStoredCommandCallback},
        {slice:'-clearAllStored', callback:clearAllStoredCommandCallback},
        {slice:'-listAllStored', callback:listAllStoredCommandCallback},
    ],

    sliceSpecials = (rawCmd, msg) => {
        logger(`sliceSpecials:: rawCmd='${rawCmd}'`);
        let lastIndex, sliceSelected;

        while (arraySliceSpecials.map(i => i.slice).some(slice => rawCmd.includes(slice))) {
            lastIndex = -1;
            sliceSelected = undefined;
            for (const sliceObj of arraySliceSpecials) {
                let testIndex = rawCmd.indexOf(sliceObj.slice);
                if (testIndex > lastIndex) {
                    logger(`sliceSpecials:: FOUND SLICE sliceObj.slice='${sliceObj.slice}'`);
                    lastIndex = testIndex;
                    sliceSelected = sliceObj;
                }
            }
            if (sliceSelected) {
                logger(`sliceSpecials:: CUTTING&CALLING SLICE sliceObj.slice='${sliceSelected.slice}'`);
                let slice = rawCmd.slice(lastIndex + sliceSelected.slice.length);
                rawCmd = rawCmd.slice(0, lastIndex);
                let ret = sliceSelected.callback(rawCmd, slice);
                if (ret) {
                    const player = msg.playerid === 'API' ? { get: () => 'API' } : getObj("player", msg.playerid);
                    sendChat(msg.who, `/w ${player.get('displayname')} ${ret}`);
                }
            }
        }
        return rawCmd;
    },

    /**
     * COMMANDS STORED SECTION
     */

    setCommandsToNextRoll = (commandSlice, linger = false) => {
        logger(LOGLEVEL.INFO, `setCommandsToNextRoll:: commandSlice='${commandSlice}'`);
        var strSplit = commandSlice.split('-');
        var cmds = [];
        for (const i of strSplit) parseCmds(i, cmds);
        logger(LOGLEVEL.INFO, `setCommandsToNextRoll:: parsed cmds='${JSON.stringify(cmds)}'`);
        checkStateOrDefault();
        const commandAttribute = linger ? 'commandStored' : 'commandStoredOnce';
        for (const cmd of cmds) {
            if (!commandExistInStored(cmd, !linger))
                state[ex3DiceState][commandAttribute].push(cmd);
        }
        logger(LOGLEVEL.INFO, `setCommandsToNextRoll:: ${commandAttribute}='${JSON.stringify(state[ex3DiceState][commandAttribute])}'`);
    },

    applyStoredCommands = (cmds) => {
        const backup = cmds, objStr = {storedStr:[], storedOnce:[]};
        cmds = [];
        checkStateOrDefault();

        if (state[ex3DiceState].commandStored.length) {
            logger(LOGLEVEL.INFO, `applyStoredCommands:: stored cmds='${JSON.stringify(state[ex3DiceState].commandStored)}'`);
            for (const cmd of state[ex3DiceState].commandStored) {
                cmds.push(cmd);
                objStr.storedStr.push(cmd.origCmd);
            }
            cmds.push(...state[ex3DiceState].commandStored);
        }

        if (state[ex3DiceState].commandStoredOnce.length) {
            logger(LOGLEVEL.INFO, `applyStoredCommands:: stored once cmds='${JSON.stringify(state[ex3DiceState].commandStoredOnce)}'`);
            for (const cmd of state[ex3DiceState].commandStoredOnce) {
                if (!objExistInArray(cmd, cmds)) {
                    cmds.push(cmd);
                    objStr.storedOnce.push(cmd.origCmd);
                }
            }
            state[ex3DiceState].commandStoredOnce = [];
        }

        for (const cmd of backup) {
            if (!objExistInArray(cmd, cmds))
                cmds.push(cmd);
        }
        return [cmds, objStr];
    },

    /**
     * COST SECTION
     */

    setCosts = (costStr) => {
        const parsedCost = costStr.split(':'), playerId = parsedCost[0], characterObj = getObj('character', playerId),
            willObj = findObjs({ _characterid: playerId, _type: 'attribute', name: 'willpower' })[0];
        for (let i = 1; i < parsedCost.length; i++) {
            const data = parsedCost[i].split(';'), val = Math.abs(Number(data[1]));
            if (!val) {
                logger(`setCosts:: val is empty or =0 => skip`);
                continue;
            }
            if (data[0] === 'will') {
                let actualVal = Number(willObj.get('current'));
                sendWillWhispers(characterObj, playerId, actualVal, val);
                willObj.set('current', actualVal - val);
            } else if (data[0].indexOf('peri') !== -1) {
                logger(`setCosts:: calling removeMotesToCharacter, data[0][5]='${data[0][5]}'`);
                if (data.length > 2)
                    removeMotesToCharacter(characterObj, val, data[0][5] === '1', data[2]);
                else
                    removeMotesToCharacter(characterObj, val, data[0][5] === '1');
            } else if (data[0] === 'init') {
                reduceInitForId(playerId, val);
            }
        }
    },

    reduceInitForId = (tokenId, toRemove) => {
        logger(LOGLEVEL.INFO, `reduceInitForId::INSIDE !!! tokenId=${tokenId}, toRemove=${toRemove}`);

        var turnOrder = (Campaign().get('turnorder') === '') ? [] : Array.from(JSON.parse(Campaign().get('turnorder')));
        logger('reduceInitForId::turnOrder=' + JSON.stringify(turnOrder));

        const idTurnOrder = turnOrder.map(o => o.id);
        logger('reduceInitForId::idTurnOrder=' + JSON.stringify(idTurnOrder));

        for (var i = 0; i < turnOrder.length; i++) {
            const tokenObj = getObj('graphic', turnOrder[i].id);
            if (tokenObj.get('represents') === tokenId) {
                logger(`reduceInitForId::setting id=${turnOrder[i].id} to pr=${Number(turnOrder[i].pr) - toRemove}`);
                turnOrder[i].pr = Number(turnOrder[i].pr) - toRemove;
                sendStandardScriptMessage(`Removing <b>${toRemove}</b> Initiative to <b>${tokenObj.get('name')}</b>`);

                logger(LOGLEVEL.INFO, `reduceInitForId::FINAL setting turnOrder=${JSON.stringify(turnOrder)}`);
                Campaign().set('turnorder', JSON.stringify(turnOrder));
                return;
            }
        }

        const charObj = getObj('character', tokenId);
        sendGMStandardScriptMessage(`NO INIT FOR CHAR=${charObj.get('name')}, CREATE TURN WITH INIT=-${toRemove}`);
        sendChat(script_name, `<a style="${styles.buttonStyle}" href="\`/gr -${toRemove} &amp;{tracker}"> &gt; Set Selected to -${toRemove} Init &lt; </a>`);

        /* TEST IN PROGRESS => SEND THE LINK TO GM ONLY
        let title         = ' &gt; Set Init to Selected Token &lt; ';
        const testCommand = `\`\`/gr -${toRemove} &amp;{tracker}`;
        let doneButton    = makeImageButton(testCommand,'S','SET INIT','transparent',18,'white');
        // let delayButton   = makeImageButton('!cmaster --turn,delay',delayImage,'Delay your Turn','transparent',18, 'white');

        title   += '<div style="'+styles.buttonRight+'">'+doneButton+'</div>';
        // title   += '<div style="'+styles.buttonRight+'">'+delayButton+'</div>';
        makeAndSendMenu('',title, 'gm', false);*/
    },

    removeMotesToCharacter = (characterObj, qty, periFirst, commitName) => {
        logger(LOGLEVEL.INFO, `removeMotesToCharacter::removeMotesToCharacter qty=${qty}, periFirst=${periFirst}`);
        let characterId = characterObj.get('id'), attrList = findObjs({ _characterid: characterId, _type: 'attribute' });

        const displayedEssenceObj = attrList.filter(i => 'displayed-essence' === i.get('name'))[0];
        logger(`removeMotesToCharacter::displayedEssenceObj=${JSON.stringify(displayedEssenceObj.get('current'))}`);

        logger(`removeMotesToCharacter::found ${attrList.length} objects, ${JSON.stringify(attrList.map(i => i.get('name')).sort())}`);
        const moteAttrList = sortMoteAttr(attrList, periFirst);

        logger(`removeMotesToCharacter::found ${attrList.length} objects, ${JSON.stringify(attrList)}`);
        const removedTo = {'personal-essence': 0, 'peripheral-essence': 0};
        var removed = 0;
        for (const attr of moteAttrList) {
            if (!attr) continue;
            let current = Number(attr.get('current')), max = Number(attr.get('max'));
            if (isNaN(current))  current = 0;
            if (isNaN(max))      max = updateMaxAttr(characterId, attr);
            if (current === 0) continue;
            logger(`removeMotesToCharacter::qty=${qty}, added=${removed}, current=${current}, max=${max}`);
            let toRemove = qty - removed < current ? qty - removed : current;
            removedTo[attr.get('name')] = toRemove;
            removed += toRemove;
            logger(`removeMotesToCharacter::removing ${toRemove} to ${characterObj.get('name')}, current=${current}, max=${JSON.stringify(max)}`);
            let total = (current - toRemove);
            if (!isNaN(total))
                sendMoteWhispers(characterObj, characterId, attr, current, toRemove, commitName);
            if (removed >= qty) break;
        }
        const useCommitSystem = Number(getAttrByName(characterId, 'usecommitsystem'));
        logger(`removeMotesToCharacter:: useCommitSystem=${useCommitSystem} commitName=${commitName}`);
        if (useCommitSystem && commitName) {
            let commitedList = attrList.filter(i => i.get('name').indexOf('repeating_commited-list_') !== -1);
            logger(`removeMotesToCharacter::COMMITED ${commitedList.length} objects found`);
            updateOrCreateCommitedListId(characterId, commitedList, commitName, removedTo);
            logger(`removeMotesToCharacter::AFTER LOCAL UPDATE: COMMITED ${commitedList.length} objects`);
            updateMaxCommitedEssTotal(characterId, attrList, commitedList);
        }
        if (removed < qty)
            sendGMStandardScriptMessage(`MOTE ERROR WHEN ${makeCharacterLink(characterObj, characterId)} CASTED<br /><b>ASKED=</b>${qty} <b>REMOVED=</b>${removed} !!! NO MORE MOTE TO SPEND`, undefined, undefined, undefined, 'background-color: red;');
        let displayedEssenceTest = displayedEssenceObj.get('current') - removed;
        if (displayedEssenceTest < 0) displayedEssenceTest = 0;
        let displayedEssenceTestMax = displayedEssenceObj.get('max') - removed;
        if (displayedEssenceTestMax < 0) displayedEssenceTestMax = 0;
        if (useCommitSystem && commitName) displayedEssenceObj.set('max', displayedEssenceTestMax);
        if (displayedEssenceTest === 0 && displayedEssenceObj.get('max') === 0) displayedEssenceTest = '';
        displayedEssenceObj.set('current', displayedEssenceTest);
    },

    sortMoteAttr = (attrList, periFirst = true) => {
        return attrList
            .filter(i => ['personal-essence', 'peripheral-essence'].includes(i.get('name')))
            .sort((a, b) => {
                if (a.get('name') === 'personal-essence' && b.get('name') !== 'personal-essence') return periFirst ? 1 : -1;
                if (a.get('name') !== 'personal-essence' && b.get('name') === 'personal-essence') return periFirst ? -1 : 1;
                return a.get('name').localeCompare(b.get('name'));
            });
    },

    updateOrCreateCommitedListId = (characterId, commitedList, commitName, removedTo) => {
        let commitedCorrespondingId = commitedList.filter(i => i.get('current') === commitName).map(i => i.get('name').split('_')[2])[0];
        if (!commitedCorrespondingId) {
            createCommitedListId(characterId, commitedList, commitName, removedTo);
        } else {
            logger(LOGLEVEL.INFO, `updateOrCreateCommitedListId::COMMITED CORRESPONDING id=${commitedCorrespondingId}`);
            try {
                updateCommitedListId(commitedList, removedTo, commitedCorrespondingId)
            } catch {
                logger(LOGLEVEL.ERROR, `updateOrCreateCommitedListId:: !! ERROR ON COMMITED id=${commitedCorrespondingId} !! DELETE & RECREATE !!!`);
                deleteRepeatingSectionRow('commited-list', commitedCorrespondingId);
                createCommitedListId(characterId, commitedList, commitName, removedTo);
            }
        }
    },

    deleteRepeatingSectionRow = (section, rowid, characterid) => {
        logger(LOGLEVEL.INFO, `deleteRepeatingSectionRow:: !! DELETING SECTION "${section}" ROW id=${rowid} !!`);
        const regex = new RegExp(`^repeating_${section}_${rowid}_.*?$`);
        try {
            const attrsInRow = findObjs({ _characterid: characterid, _type: 'attribute' }).filter((obj) => regex.test(obj.get('name')));
            for (const attribute of attrsInRow)
                attribute.remove();
        } catch {
            logger(LOGLEVEL.ERROR, `updateOrCreateCommitedListId:: !! ERROR ON DELETING SECTION "${section}" ROW id=${rowid} !!`);
        }
    },

    createCommitedListId = async (characterId, commitedList, commitName, removedTo) => {
        const uniqCommitedListIds = [...new Set(commitedList.map(i => i.get('name').split('_')[2]))];
        const commitedCorrespondingId = generateNewRowID(uniqCommitedListIds);
        let poolType;
        logger(LOGLEVEL.INFO, `createCommitedListId:: !! CREATING COMMITED id=${commitedCorrespondingId} !!`);
        const name = createObj('attribute', {name: `repeating_commited-list_${commitedCorrespondingId}_commited-name`, current: commitName, characterid: characterId});
        const commitedCorrespondingState = createObj('attribute', {name: `repeating_commited-list_${commitedCorrespondingId}_commited-state`, current: '1', characterid: characterId});
        const commitedCorrespondingPeri  = createObj('attribute', {name: `repeating_commited-list_${commitedCorrespondingId}_commited-cost-peri`, current: `${removedTo['peripheral-essence']}`, characterid: characterId});
        const commitedCorrespondingPerso = createObj('attribute', {name: `repeating_commited-list_${commitedCorrespondingId}_commited-cost-perso`, current: `${removedTo['personal-essence']}`, characterid: characterId});
        if (removedTo['peripheral-essence'] && removedTo['personal-essence'])   poolType = 'mixed';
        else if (removedTo['peripheral-essence'])                               poolType = '1';
        else if (removedTo['personal-essence'])                                 poolType = '0';
        const commitedCorrespondingPool  = createObj('attribute', {name: `repeating_commited-list_${commitedCorrespondingId}_commited-pool-type`, current: poolType, characterid: characterId});
        commitedList.push(name, commitedCorrespondingState, commitedCorrespondingPool, commitedCorrespondingPeri, commitedCorrespondingPerso);
    },

    updateCommitedListId = (commitedList, removedTo, commitedCorrespondingId) => {
        let poolType;
        const commitedCorrespondingState = commitedList.filter(i => i.get('name') === `repeating_commited-list_${commitedCorrespondingId}_commited-state`)[0];
        const commitedCorrespondingPeri  = commitedList.filter(i => i.get('name') === `repeating_commited-list_${commitedCorrespondingId}_commited-cost-peri`)[0];
        const commitedCorrespondingPerso = commitedList.filter(i => i.get('name') === `repeating_commited-list_${commitedCorrespondingId}_commited-cost-perso`)[0];
        const commitedCorrespondingPool  = commitedList.filter(i => i.get('name') === `repeating_commited-list_${commitedCorrespondingId}_commited-pool-type`)[0];
        logger(`updateOrCreateCommitedListId:: calc newPeri & newPerso`);
        const newPeri = (Number(commitedCorrespondingState.get('current'))) ? `${commitedCorrespondingPeri.get('current')}+${removedTo['peripheral-essence']}` : `${removedTo['peripheral-essence']}`;
        const newPeriVal = cleanAndEval(newPeri);
        const newPerso = (Number(commitedCorrespondingState.get('current'))) ? `${commitedCorrespondingPerso.get('current')}+${removedTo['personal-essence']}` : `${removedTo['personal-essence']}`;
        const newPersoVal = cleanAndEval(newPerso);
        if (commitedCorrespondingState.get('current') === '0')
            commitedCorrespondingState.set('current', '1');
        logger(`updateOrCreateCommitedListId:: newPeri=${newPeri}, newPerso=${newPerso}`);
        if (newPeriVal && newPersoVal) poolType = 'mixed';
        else if (newPeriVal)           poolType = '1';
        else if (newPersoVal)          poolType = '0';
        if (commitedCorrespondingPool.get('current') !== poolType)
            commitedCorrespondingPool.set('current', poolType);
        commitedCorrespondingPeri.set('current', newPeri);
        commitedCorrespondingPerso.set('current', newPerso);
    },

    updateMaxCommitedEssTotal = (characterId, attrList, commitedList) => {
        const uniqCommitedListIds = [...new Set(commitedList.map(i => i.get('name').split('_')[2]))];

        let periSum = 0, persoSum = 0;
        for (const commitedListId of uniqCommitedListIds) {
            const commitedCorrespondingState = getAttrByName(characterId, `repeating_commited-list_${commitedListId}_commited-state`, 'current');
            if (!Number(commitedCorrespondingState)) continue;
            const commitedCorrespondingPerso = getAttrByName(characterId, `repeating_commited-list_${commitedListId}_commited-cost-perso`, 'current');
            persoSum += cleanAndEval(commitedCorrespondingPerso);
            const commitedCorrespondingPeri = getAttrByName(characterId, `repeating_commited-list_${commitedListId}_commited-cost-peri`, 'current');
            periSum += cleanAndEval(commitedCorrespondingPeri);
        }
        // set committedesstotal & committedessperso
        logger(`updateMaxCommitedEssTotal:: persoSum=${persoSum}, periSum=${periSum}`);
        const commitedPerso = attrList.filter(i => i.get('name') === 'committedessperso')[0];
        commitedPerso.set('current', persoSum);
        const commitedPeri = attrList.filter(i => i.get('name') === 'committedesstotal')[0];
        commitedPeri.set('current', periSum);

        // set real essence obj
        const perso = attrList.filter(i => i.get('name') === 'personal-essence')[0];
        const peri = attrList.filter(i => i.get('name') === 'peripheral-essence')[0];
        logger(`updateMaxCommitedEssTotal:: final perso/peri set, perso=${JSON.stringify(perso)}, peri=${JSON.stringify(peri)}`);
        perso.set('max', cleanEqEvalMaxReturn(characterId, 'personal-equation'));
        peri.set('max', cleanEqEvalMaxReturn(characterId, 'peripheral-equation'));
    },

    cleanAndEval = (val) => {
        const cleanerReg = /[^\d\+]+/g;
        let str = String(val).replaceAll(cleanerReg, '');
        let final = Number(eval(str));
        logger(`cleanAndEval:: val="${val}" str="${str}" final=${final}`);
        return final;
    },

    updateMaxAttr = (characterId, attr) => {
        let test = (attr.get('name') === 'personal-essence' ? 'personal-equation' : 'peripheral-equation');
        let ret = cleanEqEvalMaxReturn(characterId, test);
        attr.set('max', ret);
        return ret;
    },

    cleanEqEvalMaxReturn = (characterId, equationName) => {
        let equationStrVal   = getAttrByName(characterId, equationName);
        const committedPersototal = Number(getAttrByName(characterId, 'committedessperso')),
              committedPeritotal  = Number(getAttrByName(characterId, 'committedesstotal')),
              essence             = Number(getAttrByName(characterId, 'essence'));
        logger(`cleanEvalReturn::cleanEvalReturn essence=${essence}`);
        equationStrVal = equationStrVal.replace('@{essence}', isNaN(essence) ? 1 : essence);
        equationStrVal = equationStrVal.replace('@{committedesstotal}', isNaN(committedPeritotal) ? 0 : committedPeritotal);
        equationStrVal = equationStrVal.replace('@{committedessperso}', isNaN(committedPersototal) ? 0 : committedPersototal);
        let pattern = /[^0-9\(\)\+\-\*\/\.]/g;
        equationStrVal = equationStrVal.replace(pattern, '');
        let calculatedMax = eval(equationStrVal);
        logger(`cleanEvalReturn::equationStr=${equationStrVal}, essence=${essence}, calculatedMax=${calculatedMax}`);
        if (isNaN(calculatedMax)) {
            logger('cleanEvalReturn::ERROR IN FORMULA => setting to 0');
            calculatedMax = 0;
        }
        return calculatedMax;
    },

    generateUUID = (() => {
        let a = 0;
        let b = [];
        return () => {
            let c = (new Date()).getTime() + 0;
            let f = 7;
            let e = new Array(8);
            let d = c === a;
            a = c;
            for (; 0 <= f; f--) {
                e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
                c = Math.floor(c / 64);
            }
            c = e.join("");
            if (d) {
                for (f = 11; 0 <= f && 63 === b[f]; f--) {
                    b[f] = 0;
                }
                b[f]++;
            } else {
                for (f = 0; 12 > f; f++) {
                    b[f] = Math.floor(64 * Math.random());
                }
            }
            for (f = 0; 12 > f; f++) {
                c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
            }
            return c;
        };
    })(),

    generateRowID = () => generateUUID().replace(/_/g, "Z"),

    generateNewRowID = (array_existing) => {
        let ret;
        do {
            ret = generateRowID();
        } while (array_existing.includes(ret))
        array_existing.push(ret);
        return ret;
    },

    sendMoteWhispers = (characterObj, characterId, attr, current, toRemove, commitName) => {
        const useCommitSystem = Number(getAttrByName(characterId, 'usecommitsystem'));
        const attrName = attr.get('name');
        const attrNameStylised = attrName.indexOf('personal') !== -1 ? 'personal' : `<u>peripheral</u>`;
        const outString = `${makeCharacterLink(characterObj, characterId)}:> <b>-${toRemove}</b> motes to <b>${attrNameStylised}</b>`;
        const controlledByNames = getControlledByNamesWithoutGM(characterObj);
        attr.set('current', current - toRemove);

        logger(`removeMotesToCharacter::controlledByNames=${JSON.stringify(controlledByNames)}, characterObj=${JSON.stringify(characterObj)}`);
        for (const playerName of controlledByNames) sendStylizedMoteWhisper(outString, attrName, playerName);
        // sendStylizedMoteWhisper(`${outString}${controlledByNames.length ? ` (whispered to: [${controlledByNames.join(', ')}])` : ''}${useCommitSystem && commitName ? '<div style="text-align: center; font-weight: bold; text-decoration: underline;">COMMITED</div>' : ''}`, attrName);
        sendStylizedMoteWhisper(`${outString}${useCommitSystem && commitName ? '<div style="text-align: center; font-weight: bold; text-decoration: underline;">COMMITED</div>' : ''}`, attrName);

        if (attr.get('name') === 'peripheral-essence' && toRemove >= 5)
            sendGMStandardScriptMessage('<b>>>> ANIMA UP ! CHECK IF MUTE</b>', undefined, 'color: white;', false, 'background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);');
    },

    sendStylizedMoteWhisper = (outString, attrName, playerStrName = 'gm') => {
        if (attrName.indexOf('personal') !== -1) sendWhisperStandardScriptMessage(playerStrName, outString, '', `${styles.defaultDivStyle}font-style:italic;`, false, 'background: #333;');// linear-gradient(transparent, gray, transparent)
        else                                     sendWhisperStandardScriptMessage(playerStrName, outString, '', `${styles.defaultDivStyle}color:orange;`, false, 'background: darkred;');// linear-gradient(transparent, darkred)
    },

    getControlledByNamesWithoutGM = (characterObj) => {
        let controlledBy = characterObj.get('controlledby');
        controlledBy = (controlledBy !== '') ? controlledBy.split(',') : [];
        return controlledBy.map(id => {
            const playerObj = getObj('player', id);
            if (playerObj && !playerIsGM(id)) return playerObj.get('_displayname');
            if (!playerObj) logger(LOGLEVEL.ERROR, `ERROR NO PLAYEROBJ FOR THIS ID:${id}`);
            return false;
        }).filter(i => i);
    },

    sendWillWhispers = (characterObj, playerId, actualVal, val) => {
        const charLink = makeCharacterLink(characterObj, playerId);
        const controlledByNames = getControlledByNamesWithoutGM(characterObj);

        if (actualVal - val < 0) {
            sendGMStandardScriptMessage(`WILLPOWER ERROR WHEN ${charLink} CASTED<br /><b>ACTUAL=</b>${actualVal} <b>COST=</b>${val} !!!`, undefined, undefined, undefined, 'background-color: red;');
            for (const playerName of controlledByNames) sendWhisperStandardScriptMessage(playerName, `WILLPOWER ERROR WHEN ${charLink} CASTED<br /><b>ACTUAL=</b>${actualVal} <b>COST=</b>${val} !!!`, undefined, undefined, undefined, 'background-color: red;');
        } else {
            sendGMStandardScriptMessage(`${charLink}:> Removing ${val} <b>WP</b>`);
            for (const playerName of controlledByNames) sendWhisperStandardScriptMessage(playerName, `${charLink}:> Removing ${val} <b>WP</b>`);
        }
    },

    /**
     * GENERIC MAKE FUNCTION
     */

    makeAndSendMenu = (contents, title = undefined, whisper = undefined, noarchive = true) => {
        whisper = (whisper && whisper !== '') ? '/w ' + whisper + ' ' : '';
        title = makeTitle(title);
        sendChat(script_name, whisper + '<div style="' + styles.menu + styles.overflow + '">' + title + contents + '</div>', null, { noarchive: noarchive });
    },

    makeTitle = (title) => {
        return `<div style="${styles.title}"><span style=${styles.titleText}>${title}</span></div>`;
    },

    makeImageButton = (command, image, toolTip, backgroundColor, size, color) => {
        if (!color) color = 'black';
        return '<div style="display:inline-block;margin-right:3px;padding:1px;vertical-align:middle;"><a href="' + command + '" title= "' + toolTip + '" style="margin:0px;padding:0px;border:0px solid;background-color:' + backgroundColor + '"><span style="color:' + color + ';padding:0px;font-size:' + size + 'px;font-family: \'Pictos\'">' + image + '</span></a></div>';
    },

    makejournalLink = (journalType, id, outerText) => {
        return `<b><a href="http://journal.roll20.net/${journalType}/${id}">${outerText}</a></b>`;
    },

    makeCharacterLink = (characterObj, characterId = characterObj.get('id')) => {
        return makejournalLink('character', characterId, characterObj.get('name'));
    },

    makeHandoutLink = (handoutId, handoutLinkText) => {
        return makejournalLink('handout', handoutId, handoutLinkText);
    },

    cleanImgSrc = (imgsrc) => {
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/);
        if (parts) return parts[1] + 'thumb' + parts[3] + (parts[4] ? parts[4] : `?${Math.round(Math.random() * 9999999)}`);
        return;
    },

    /**
     * GENERIC SEND WHISPER FUNCTIONS
     */

    sendStandardScriptMessage = (innerHtml, image = '', divStyle = styles.defaultDivStyle, noarchive = false) => {
        sendChat(script_name, '<div style="' + styles.menu + '"><div style="display:inherit;">' + (image != '' ? '<div style="text-align:center;">' + image + '</div>' : '') + '<div style="' + divStyle + '">' + innerHtml + '</div></div></div>', null, { noarchive: noarchive });
    },

    sendWhisperStandardScriptMessage = (whisperName, innerHtml, image = '', divStyle = styles.defaultDivStyle, noarchive = false, rootDivStyle = '') => {
        sendChat(script_name, '/w ' + whisperName + ' <div style="' + styles.menu + rootDivStyle + '"><div style="display:inherit;">' + (image != '' ? '<div style="text-align:center;">' + image + '</div>' : '') + '<div style="' + divStyle + '">' + innerHtml + '</div></div></div>', null, { noarchive: noarchive });
    },

    sendGMStandardScriptMessage = (innerHtml, image = '', divStyle = styles.defaultDivStyle, noarchive = false, rootDivStyle = '') => {
        sendWhisperStandardScriptMessage('gm', innerHtml, image, divStyle, noarchive, rootDivStyle);
    },

    /**
     * The rolling function. Handles making the roll and passing the results to the anonymous callback function. Extracts the commands from
     * the original roll string, and sends them along to be parsed and executed by the appropriate functions in the script.
     *
     * @param Roll20 Message Object		msg		The original message object.
     * @param string					cmd		The properly parsed /roll command, to pass to the QuantumRoller.
     *
     * @return void
     */
    performRoll = (msg, cmd, realOrigRoll) => {
        logger(`performRoll:: CALLING ROLL20 'sendChat' with cmd=${cmd}`);
        sendChat(msg.who, cmd, function (ops) {
            logger(`performRoll:: RETURN FROM ROLL20 ops=${JSON.stringify(ops)}`);
            if (ops[0].type == 'rollresult') {
                var result = JSON.parse(ops[0].content);
                result.toGm = false;
                result.setTurn = false;

                setupRollStructure(result);

                logger(`performRoll:: origRoll=${JSON.stringify(ops[0].origRoll)}`);
                logger(`performRoll:: RealRoll=${JSON.stringify(realOrigRoll)}`);
                ops[0].origRoll = realOrigRoll;
                var strSplit = ops[0].origRoll.split('-');
                var cmds = [], storedCommandsStrObj;
                for (const i of strSplit) parseCmds(i, cmds);

                logger(LOGLEVEL.NOTICE, 'performRoll::parseCmds DONE !');
                logger('performRoll::ops=' + JSON.stringify(ops));
                logger('performRoll::result=' + ops[0].content);
                logger(LOGLEVEL.INFO, 'performRoll::cmds=' + JSON.stringify(cmds));

                [cmds, storedCommandsStrObj] = applyStoredCommands(cmds);
                logger(LOGLEVEL.INFO, 'performRoll:: after including stored cmds=' + JSON.stringify(cmds));

                parseAddedSuccesses(result, msg.content);

                if (cmds && cmds.length) processCmds(cmds, result);
                if (result.rollSetup.has10doubled) result.rollSetup.face[10].doubles.push({ limit: 0, done: 0 });
                finalizeRoll(result);

                const player = msg.playerid === 'API' ? { get: () => 'API' } : getObj("player", msg.playerid);
                var outHTML = buildHTML(result, ops[0].origRoll, storedCommandsStrObj, player);
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
    },

    /**
     * Set Initiative value of selected tokens to result of roll
     *
     * @param Array     selected    Array of the seleted tokens
     * @param integer   successes   Value to set
     */
    setSelectedTurnOrder = (selected, successes) => {
        logger(LOGLEVEL.INFO, 'setTurnOrder::INSIDE !!!');
        if (!selected || !selected.length) {
            logger(LOGLEVEL.WARNING, 'setTurnOrder::NO SELECTEDS ! RETURN');
            return;
        }
        var turnOrder = (Campaign().get('turnorder') === '') ? [] : Array.from(JSON.parse(Campaign().get('turnorder')));
        logger('setTurnOrder::turnOrder=' + JSON.stringify(turnOrder));

        logger(LOGLEVEL.INFO, 'setTurnOrder::selected=' + JSON.stringify(selected));
        var selectedTokenId = selected.map(o => getObj('graphic', o._id)).filter(n => n).map(o => o.get('id'));
        if (!Array.isArray(selectedTokenId)) selectedTokenId = [selectedTokenId];
        if (selectedTokenId.length && Array.isArray(selectedTokenId[0])) selectedTokenId.map(o => o[0]);
        logger('setTurnOrder::selectedTokenId=' + JSON.stringify(selectedTokenId));

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
                turnOrder.push({ id: id, pr: successes, custom: '', _pageid: pageId });
            }
        }

        logger(LOGLEVEL.INFO, `setTurnOrder::FINAL setting turnOrder=${JSON.stringify(turnOrder)}`);
        Campaign().set('turnorder', JSON.stringify(turnOrder));
    },

    /**
     * This is the function called by _.each(), above, to parse each command string into the command and its arguments (if any). In the
     * _.each() call of performRoll, the cmds array is passed as the function's context.
     *
     * @param Array element <string>	item	Passed by the Underscore.js _.each() function; is the value of the element that corresponds to the
     *												current pointer in the collection.
     * @return void.
     */
    parseCmds = (item, list) => {
        var trim = item.trim();
        if (!item) return;
        logger(LOGLEVEL.INFO, `parseCmds::item="${trim}", list=${JSON.stringify(list)}`);

        var objRet, match = false, ret, patt;
        for (var i = 0; i < ParserConfig.length; i++) {
            if ((ret = trim.match(ParserConfig[i].pattern))) {
                match = true;
                logger(LOGLEVEL.NOTICE, `parseCmds::MATCH${i + 1} = ${ParserConfig[i].categoryName}`);
                logger('parseCmds::ret=' + JSON.stringify(ret));
                objRet = ParserConfig[i].getCmdObj(ret);
                objRet.origCmd = `-${trim}`;
                break;
            }
        }

        if (!match) {
            for (const condItem of Object.keys(ConditionalList)) {
                patt = ConditionalList[condItem].regPattern || new RegExp(`^(${condItem})$`);
                if ((ret = trim.match(patt))) {
                    match = true;
                    logger(LOGLEVEL.NOTICE, `parseCmds::MATCH - Conditional Item = ${condItem}`);
                    logger('parseCmds::ret=' + JSON.stringify(ret));
                    objRet = { cmd: condItem, condiFullParsed: ret, origCmd: `-${trim}`};
                }
            }
        }

        logger(LOGLEVEL.INFO, `parseCmds::FINAL match=${match} objRet=${JSON.stringify(objRet)}`);
        if (match) list.push(objRet);
    },

    randomUUID = () => {
        let dt = new Date().getTime();

        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (dt + Math.random() * 16) % 16 | 0
            dt = Math.floor(dt / 16)
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
        });

        return uuid;
    },

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
    processCmds = (cmds, result) => {
        logger(LOGLEVEL.INFO, `processCmds::processCmds cmds=${JSON.stringify(cmds)}, result=${JSON.stringify(result)}`);
        for (const item of cmds) {
            var recReroll = false,
                exploIgnore = true,
                verbosityToSet = 1,
                uuid = randomUUID();
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
                case 'rP':
                    while (result.rollSetup.rerollPool.some(i => i.uuid === uuid)) uuid = randomUUID();
                    result.rollSetup.rerollPool.push({ uuid: uuid, limit: item.limit, ignoreList: item.ignoreList, tagList: item.tagList });
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
                    for (const face of item.faces) result.rollSetup.face[face].doubles.push({ limit: item.limit, done: 0 });
                    break;
                case 's':
                    logger(LOGLEVEL.INFO, `processCmds::adding success on faces=${item.faces}, limit=${item.limit}`);
                    for (const face of item.faces) result.rollSetup.face[face].successes.push({ limit: item.limit, done: 0 });
                    break;
                case 'f':
                case 'F':
                    logger(LOGLEVEL.INFO, `processCmds::removing success on faces=${item.faces}`);
                    for (const face of item.faces) result.rollSetup.face[face].successes = [];
                    break;
                case 'AF':
                    logger(LOGLEVEL.INFO, `processCmds::Arcane Fate=${item.option}, PeriFirst=${item.periFirst}`);
                    if ([1, 2, 3].includes(item.option)) {
                        if (item.option === 1)                               result.rollSetup.face[6].successes.push({limit: item.limit, done: 0});
                        if (item.option === 2) for (const face of [6, 5])    result.rollSetup.face[face].successes.push({limit: item.limit, done: 0});
                        if (item.option === 3) for (const face of [6, 5, 4]) result.rollSetup.face[face].successes.push({limit: item.limit, done: 0});
                        removeMotesToCharacter(getObj('character', item.charId), item.option, item.periFirst);
                    }
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
                case 'NB':
                case 'NoBotch':
                    result.rollSetup.noBotch = true;
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
            if (item.condiFullParsed) {
                var dupedDefaultConditionObj = JSON.parse(JSON.stringify(ConditionalList[item.cmd].defaultConditionObj));
                if (ConditionalList[item.cmd].parseCommand)
                    dupedDefaultConditionObj = ConditionalList[item.cmd].parseCommand(dupedDefaultConditionObj, item.condiFullParsed);
                logger(LOGLEVEL.NOTICE, `processCmds::COND ENABLING obj=${JSON.stringify(dupedDefaultConditionObj)}`);
                result.rollSetup.conditionalActivated.push(dupedDefaultConditionObj);
                continue;
            }
        }

        logger(`processCmds::processCmds END`);
    },

    recountSuccesses = (result) => {
        logger(LOGLEVEL.INFO, `doDoubles::doDoubles do10s=${result.rollSetup.has10doubled}, result=${JSON.stringify(result)}`);

        var newTotal = 0, addSucc = 0;
        for (const item of result.rollSetup.finalResults) {
            if (item.v === 'SECTIONDONE') continue;
            if (!item.rerolled && item.success) newTotal++;
            if (!item.rerolled && item.success && item.doubled) addSucc += 1;
        }
        logger(LOGLEVEL.INFO, `doDoubles::NEW result.total=${newTotal} + ${addSucc}`);
        result.total = newTotal + addSucc;
    },

    /**
     * Perform the roll with settings created during previous steps.
     *
     * @param JavaScript Object reference	result		The content of the rollresult message, as above; now in its final version, with all rolls and successes
     *														accurately calculated.
    */
    finalizeRoll = (result) => {
        logger(LOGLEVEL.INFO, `finalizeRoll::finalizeRoll result=${JSON.stringify(result)}`);

        result.rollSetup.rollToProcess = result.rolls[0].results;
        logger(`finalizeRoll::finalizeRoll rollToProcess=${JSON.stringify(result.rollSetup.rollToProcess)}`);
        if (typeof result.rollSetup.rollToProcess == 'undefined') {
            logger(LOGLEVEL.ERROR, `finalizeRoll::finalizeRoll ERROR QUITTING !!!!`);
            return;
        }

        addRerollPoolsAndFinalSort(result);

        logger(`finalizeRoll::FINAL rollSetup=${JSON.stringify(result.rollSetup)}`)
        var turn = 1;
        do {
            logger(LOGLEVEL.NOTICE, `MEGATURN(${turn}) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
            do {
                handleRollTurn(result, turn++);
                if (turn > 420) break;
            } while (result.rollSetup.rollToProcess.length > 0)
            handleFinalConditionalHook(result, turn - 1);
            if (turn > 420) break;
        } while (result.rollSetup.rollToProcess.length > 0)
        if (turn >= 420) result.rollSetup.maxRecursiveAchieved = true;

        handleSectionCleaning(result, true);
        recountSuccesses(result);

        logger(`finalizeRoll::rewriting result.rolls[0].results=${JSON.stringify(result.rollSetup.finalResults)}`);
        result.rolls[0].results = result.rollSetup.finalResults;
    },

    addRerollPoolsAndFinalSort = (result) => {
        for (const rp of result.rollSetup.rerollPool) {
            for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
                if (!rp.ignoreList.includes(i) && !result.rollSetup.face[i].successes.length) {
                    result.rollSetup.face[i].rerolls.push({
                        uuid: rp.uuid,
                        limit: rp.limit,
                        done: 0,
                        keepBest: false,
                        recursive: true,
                        ignoreList: rp.ignoreList,
                        tagList: rp.tagList,
                    });
                }
            }
        }
        sortRerollsAndExplosives(result);
    },

    sortRerollsAndExplosives = (result) => {
        for (var i = 1; i <= 10; i++) {
            var face = result.rollSetup.face[i];
            face.rerolls.sort((a, b) => {
                if ((!a.uuid && b.uuid) || (a.recursive && !b.recursive) || (!a.limit && b.limit)) return 1;
                if ((a.uuid && !b.uuid) || (!a.recursive && b.recursive) || (a.limit && !b.limit)) return -1;
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
    },

    strFill = (number) => {
        return number < 10 ? number + '  ' : number;
    },

    updateTitleAndPushToNextRolls = (result, toNextRoll, finalObj, nextRollsToProcess, sectionDone) => {
        logger(`updateTitleAndPushToNextRolls::revert=${result.rollSetup.revertTitleOrder}, pushing:${finalObj.title}, to:${toNextRoll.title}`);
        if (Array.isArray(toNextRoll)) {
            for (const item of toNextRoll) updateTitle(result, item, item.alternatePrevObjForTitle || finalObj);
        } else {
            updateTitle(result, toNextRoll, toNextRoll.alternatePrevObjForTitle || finalObj);
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
    },

    updateTitle = (result, toNextRoll, finalObj) => {
        if (result.rollSetup.revertTitleOrder)
            toNextRoll.title.unshift(...finalObj.title);
        else
            toNextRoll.title.push(...finalObj.title);
    },

    makeNewTitleFromOld = (result, prevTitleArray, actionsOfThisRoll) => {
        var ret = prevTitleArray, lastItem = prevTitleArray.length - 1;
        var titleToChange = result.rollSetup.revertTitleOrder ? lastItem : 0;
        ret[titleToChange] = ret[titleToChange] + actionsOfThisRoll;
        return ret;
    },

    /**
     * Process the rolls with settings created during previous steps, trigger sections that could effect the dice and/or produce one.
     *
     * @param JavaScript Object reference	result		The content of the rollresult message, as above; now in its final version, with all rolls and successes
     *														accurately calculated.
    * @param Number                        turn        number for turn, 1 = initial roll
    */
    handleRollTurn = (result, turn) => {
        logger(LOGLEVEL.INFO, `handleROllTurn::handleROllTurn turn=${turn}, rollToProcess=${JSON.stringify(result.rollSetup.rollToProcess)}`);
        var nextRollsToProcess = [];

        if (turn === 1)
            for (const confObj of result.rollSetup.conditionalActivated)
                if (ConditionalList[confObj.name].finalizeDefaultConditionObj) ConditionalList[confObj.name].finalizeDefaultConditionObj(confObj, result, nextRollsToProcess);

        for (const item of result.rollSetup.rollToProcess) {
            var setup = JSON.parse(JSON.stringify(DefaultTurnObj));
            setup.face = item.v;
            setup.faceObj = result.rollSetup.face[setup.face];
            setup.wasConditionallyAffected = item.wasConditionallyAffected;
            setup.conditionalColorIN = item.conditionalColor || undefined;
            if (item.tagList && item.tagList.length) for (const tag of item.tagList) setup.tagList.push(tag);
            handleRoll(result, setup, item, turn);
            var finalObj = {
                v:                  setup.face,                    tags:                     setup.tagList,
                success:            setup.success,                 doubled:                  setup.doubled,
                wasEverRerolled:    item.wasEverRerolled || false, wasRerolled:              item.wasRerolled || false,
                wasExploded:        item.wasExploded || false,     wasConditionallyAffected: item.wasConditionallyAffected || false,
                rerolled:           setup.rerolled,                exploded:                 setup.exploded,
                condTriggered:      setup.condTriggered,           condRerolled:             setup.condRerolled,
                conditionalColor:   setup.conditionalColor,        conditionalColorIN:       setup.conditionalColorIN,
                title: item.title ? makeNewTitleFromOld(result, item.title, setup.titleText) : [`Roll Initial.${result.rollSetup.conditionalActivated.length ? condiPadder : ''}            Face=${strFill(setup.face)}.${setup.titleText}`]
            };
            logger(LOGLEVEL.NOTICE, `handleRollTurn::face(${setup.face}) =>finalObj=${finalObj.v} rerolled=${setup.rerolled} exploded=${setup.exploded} FULL=${JSON.stringify(finalObj)}`);
            result.rollSetup.finalResults.push(finalObj);
            if (setup.toNextRollRerolled && (setup.rerolled || setup.rerollSnapshot && setup.rerollSnapshot.recursive))
                updateTitleAndPushToNextRolls(result, setup.toNextRollRerolled, finalObj, nextRollsToProcess, setup.rerollSectionDone);
            if (setup.successSectionDone)
                result.rollSetup.finalResults.push(setup.successSectionDone);
            if (setup.doubleSectionDone)
                result.rollSetup.finalResults.push(setup.doubleSectionDone);
            if (setup.exploded)
                updateTitleAndPushToNextRolls(result, setup.toNextRollExploded, finalObj, nextRollsToProcess, setup.explodeSectionDone);
            if (setup.toNextRollCondi && setup.toNextRollCondi.length)
                updateTitleAndPushToNextRolls(result, setup.toNextRollCondi,    finalObj, nextRollsToProcess, setup.condiSectionDone);
        }

        if (turn === 1 || result.rollSetup.verbosity >= 1)
            result.rollSetup.finalResults.push({ v: 'SECTIONDONE', sectionType: (turn === 1 ? 'Initial Roll' : `Additional Rolls n${turn - 1}`), color: initialRollColor, details: '' });

        handleTurnConditionalHook(result, turn, nextRollsToProcess);

        logger(LOGLEVEL.INFO, `handleRollTurn::END nextRollsToProcess=${nextRollsToProcess.map(i => i.v)} FULL=${JSON.stringify(nextRollsToProcess)}`);
        result.rollSetup.rollToProcess = nextRollsToProcess;
        if (turn === 1 || result.rollSetup.verbosity >= 1)
            handleSectionCleaning(result);
    },

    /**
     * Process one dice rolled
     */
    handleRoll = (result, setup, item, turn) => {
        logger(`handleRollTurn::face(${setup.face}) rerolls.length=${setup.faceObj.rerolls.length}, explosives.length=${setup.faceObj.explosives.length}, doubles.length=${setup.faceObj.doubles.length}, conditionalActivated.length=${result.rollSetup.conditionalActivated.length}`);
        if (setup.faceObj.rerolls.length)
            handleFaceReroll(setup, item, turn, result);
        if (!setup.rerolled && setup.faceObj.successes.length)
            handleFaceSuccess(setup);
        if (setup.faceObj.doubles.length && !setup.rerolled)
            handleFaceDouble(setup);
        if (setup.faceObj.explosives.length)
            handleFaceExplode(setup, item, turn, result.rollSetup.conditionalActivated.length);
        if (result.rollSetup.conditionalActivated.length)
            handleFaceConditionals(result, setup, item, turn);
    },

    /**
     * Standard Reroll Section
     */
    handleFaceReroll = (setup, item, turn, result) => {
        setup.rerollSnapshot = setup.faceObj.rerolls[0];
        var reroll = randomInteger(10);
        logger(LOGLEVEL.INFO, `handleRollTurn::face(${setup.face}) REROLL TO DO ! section=${JSON.stringify(setup.faceObj.rerolls[0])}`);
        if (setup.faceObj.rerolls[0].recursive || (!(setup.faceObj.rerolls[0].keepBest && reroll < setup.face) && !item.wasRerolled)) {
            setup.rerolled = !setup.faceObj.rerolls[0].keepBest || reroll > setup.face;
            var rerolledVal = (setup.faceObj.rerolls[0].keepBest && reroll < setup.face) ? setup.face : reroll;
            setup.toNextRollRerolled = {
                v: rerolledVal, wasEverRerolled: true,
                wasRerolled: true, wasExploded: false, wasConditionallyAffected: false,
                title: [`RollTurn (${strFill(turn + 1)}). R${result.rollSetup.conditionalActivated.length ? condiPadder : ''} ->Face=${strFill(rerolledVal)}.`]
            };
        }
        increaseDoneToAllNeededRerollSections(setup, result);
        setup.titleText += ` ${setup.rerolled ? 'Rerolled to a' : 'Not Reroll to'} ${strFill(reroll)}`
            + (setup.faceObj.rerolls[0].limit != 0
                ? ` (Done${setup.faceObj.rerolls[0].done}/${setup.faceObj.rerolls[0].limit} ).`
                : ` ( Done${strFill(setup.faceObj.rerolls[0].done)} ).`);
        if (setup.faceObj.rerolls[0].limit != 0 && setup.faceObj.rerolls[0].limit == setup.faceObj.rerolls[0].done) {
            setup.rerollSectionDone = removeFirstRerollSection(result, setup.faceObj);
        }
    },

    increaseDoneToAllNeededRerollSections = (setup, result) => {
        setup.faceObj.rerolls[0].done++;
        if (setup.faceObj.rerolls[0].uuid) {
            for (const faceTested of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
                if (faceTested === setup.faceObj.face) continue;
                if (result.rollSetup.face[faceTested].rerolls.some(i => (i.uuid === setup.faceObj.rerolls[0].uuid))) {
                    const index = result.rollSetup.face[faceTested].rerolls.findIndex(r => r.uuid === setup.faceObj.rerolls[0].uuid);
                    logger(`removeRerollPoolSections::REROLLPOOL increasing i=${index}`);
                    result.rollSetup.face[faceTested].rerolls[index].done++;
                }
            }
        }
    },

    /**
     * Standard Success Section
     */
    handleFaceSuccess = (setup) => {
        setup.successSnapshot = setup.faceObj.successes[0];
        logger(LOGLEVEL.INFO, `handleRollTurn::face(${setup.face}) SUCCESS ! section=${JSON.stringify(setup.faceObj.successes[0])}`);
        setup.success = true;
        setup.faceObj.successes[0].done++;
        if (setup.faceObj.successes[0].limit != 0 && setup.faceObj.successes[0].limit == setup.faceObj.successes[0].done)
            setup.successSectionDone = removeFirstSuccessSection(setup.faceObj);
    },

    /**
     * Standard Double Section
     */
    handleFaceDouble = (setup) => {
        setup.doubleSnapshot = setup.faceObj.doubles[0];
        logger(LOGLEVEL.INFO, `handleRollTurn::face(${setup.face}) DOUBLE  ! section=${JSON.stringify(setup.faceObj.doubles[0])}`);
        setup.doubled = true;
        setup.faceObj.doubles[0].done++;
        if (setup.faceObj.doubles[0].limit != 0 && setup.faceObj.doubles[0].limit == setup.faceObj.doubles[0].done)
            setup.doubleSectionDone = removeFirstDoubleSection(setup.faceObj);
    },

    /**
     * Standard Explode Section
     */
    handleFaceExplode = (setup, item, turn, condiLength) => {
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
    },

    /**
     * SECTION CLEANING AFTER 1ST ROLL TURN, OR AT THE COMPLETE END OF THE ROLL
     */
    handleSectionCleaning = (result, lastTurnClean = false) => {
        logger(LOGLEVEL.INFO, 'handleSectionCleaning::CLEANING !');
        for (const faceClearing of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
            var faceObj = result.rollSetup.face[faceClearing];
            // remove non recursive reroll && push section accordingly
            while (faceObj.rerolls.length && (!faceObj.rerolls[0].recursive || lastTurnClean))
                result.rollSetup.finalResults.push(removeFirstRerollSection(result, faceObj, true));
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
    },

    removeFirstSuccessSection = (faceObj, showDone = false) => {
        logger(LOGLEVEL.NOTICE, `doDoubles::SUCCESS SECTION DONE=${JSON.stringify(faceObj.successes[0])}`);
        var removedSuccessSection = {
            v: 'SECTIONDONE',
            sectionType: 'Success',
            color: successColor,
            details: `&#013;&#010; face: ${faceObj.face}&#013;&#010; limit: ${showDone ? faceObj.successes[0].done + '/' + faceObj.successes[0].limit : faceObj.successes[0].limit}`
        };
        faceObj.successes.shift();
        return removedSuccessSection;
    },

    removeFirstDoubleSection = (faceObj, showDone = false) => {
        logger(LOGLEVEL.NOTICE, `doDoubles::DOUBLE SECTION DONE=${JSON.stringify(faceObj.doubles[0])}`);
        var removedDoubleSection = {
            v: 'SECTIONDONE',
            sectionType: 'Double',
            color: doubleColor,
            details: `&#013;&#010; face: ${faceObj.face}&#013;&#010; limit: ${showDone ? faceObj.doubles[0].done + '/' + faceObj.doubles[0].limit : faceObj.doubles[0].limit}`
        };
        faceObj.doubles.shift();
        return removedDoubleSection;
    },

    removeFirstRerollSection = (result, faceObj, showDone = false) => {
        logger(LOGLEVEL.NOTICE, `removeFirstRerollSection::REROLL SECTION DONE=${JSON.stringify(faceObj.rerolls[0])}`);
        var rerollSectionDone = {
            v: 'SECTIONDONE',
            sectionType: faceObj.rerolls[0].uuid ? 'RerollPool' : 'Reroll',
            color: rerolledColor,
            details: `${faceObj.rerolls[0].uuid ? '' : `&#013;&#010; face: ${faceObj.face}`}&#013;&#010; limit: ${showDone ? faceObj.rerolls[0].done + '/' + faceObj.rerolls[0].limit : faceObj.rerolls[0].limit}${faceObj.rerolls[0].uuid ? '' : `&#013;&#010; keepBest: ${faceObj.rerolls[0].keepBest}&#013;&#010; recursive: ${faceObj.rerolls[0].recursive}`}${faceObj.rerolls[0].ignoreList ? `&#013;&#010; ignoreList: ${faceObj.rerolls[0].ignoreList.join(', ')}` : ''}${faceObj.rerolls[0].tagList.length ? `&#013;&#010; tagList: '${faceObj.rerolls[0].ignoreList.join('\', \'')}'` : ''}`
        };
        if (faceObj.rerolls[0].uuid) removeRerollPoolSections(result, faceObj)
        faceObj.rerolls.shift();
        return rerollSectionDone;
    },

    removeRerollPoolSections = (result, faceObj) => {
        logger(LOGLEVEL.NOTICE, `removeRerollPoolSections::REROLLPOOL SECTION DONE=${JSON.stringify(faceObj.rerolls[0])}`);
        for (const faceTested of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
            if (faceTested === faceObj.face) continue;
            if (result.rollSetup.face[faceTested].rerolls.some(i => (i.uuid === faceObj.rerolls[0].uuid))) {
                logger(`removeRerollPoolSections::REROLLPOOL splicing i=${result.rollSetup.face[faceTested].rerolls.findIndex(r => r.uuid === faceObj.rerolls[0].uuid)}`);
                result.rollSetup.face[faceTested].rerolls.splice(result.rollSetup.face[faceTested].rerolls.findIndex(r => r.uuid === faceObj.rerolls[0].uuid), 1);
            }
        }
    },

    removeIteratorExplodeSection = (faceObj, iterator, showDone = false) => {
        logger(LOGLEVEL.NOTICE, `removeIteratorExplodeSection::EXPLOSIVE SECTION DONE=${JSON.stringify(faceObj.explosives[iterator])}`);
        var explodeSectionDone = {
            v: 'SECTIONDONE',
            sectionType: 'Explode',
            color: explodedColor,
            details: `&#013;&#010; face: ${faceObj.face}&#013;&#010; limit: ${showDone ? faceObj.explosives[iterator].done + '/' + faceObj.explosives[iterator].limit : faceObj.explosives[iterator].limit}&#013;&#010; ignoreRerolled: ${faceObj.explosives[iterator].ignoreRerolled}`
        };
        faceObj.explosives.splice(iterator, 1);
        return explodeSectionDone;
    },

    removeIteratorCondSectionMethod = (result, iterator, showDone = false) => {
        var condObj = result.rollSetup.conditionalActivated[iterator];
        logger(LOGLEVEL.NOTICE, `removeIteratorCondSectionMethod::Global COND SECTION id=${iterator} to Remove=${JSON.stringify(condObj)}`);
        var condSectionDone = makeSectionDoneObj(`Cond-${condObj.name}`, conditionalColor, ConditionalList[condObj.name].getDetailMethod(condObj, showDone));
        result.rollSetup.conditionalActivated.splice(iterator, 1);
        return condSectionDone;
    },

    /* Build HTML */

    parseAddedSuccesses = (result, origCmd) => {
        logger(`parseAddedSuccesses::parseAddedSuccesses origCmd=${origCmd}, result=${JSON.stringify(result)}`);
        var patt = /^.*#(?:\[[^\]]+\])?((?:[+-]\d+(?:\[[^\]+-]*\]?)?)*)/;
        var innerPatt = /(([+-]\d+)(?:[^\]+-]*\]?))/g;
        var ret, succ = result.total, addedSuccessesLabel = '', addedSuccesses = 0;
        if ((ret = origCmd.match(patt))) {
            logger('parseAddedSuccesses::ret=' + JSON.stringify(ret));
            logger('parseAddedSuccesses::succ=' + succ);
            if (ret[1]) {
                logger('parseAddedSuccesses::ret[1]=' + ret[1]);
                var arrayAddedSuccesses = [...ret[1].matchAll(innerPatt)];
                logger('parseAddedSuccesses::arrayAddedSuccesses=' + JSON.stringify(arrayAddedSuccesses));
                for (const [, , item] of arrayAddedSuccesses) {
                    logger('parseAddedSuccesses::item=' + item);
                    addedSuccessesLabel += item;
                    addedSuccesses += Number(item);
                }
            }
        }
        if (addedSuccesses !== 0 || addedSuccessesLabel !== '') {
            result.addedSuccesses = addedSuccesses;
            result.addedSuccessesLabel = addedSuccessesLabel;
        }
    },

    recalculateSuccesses = (result) => {
        var succ = result.total;
        logger(LOGLEVEL.INFO, `recalculateSuccesses::updating total successes=${succ + result.addedSuccesses}, old=${succ} + ${result.addedSuccesses}`);
        if (result.addedSuccesses) succ += result.addedSuccesses;
        if (succ < 0)
            succ = 0;
        var succTxt = result.addedSuccessesLabel ? `${result.total}${result.addedSuccesses >= 0 ? '+' + result.addedSuccesses : result.addedSuccesses}=${succ}` : succ;
        if (result.total !== succ) result.total = succ;
        return { succTxt, succ };
    },

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
    buildHTML = (result, origRoll, storedCommandsStrObj, player) => {
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
        html +=     "<div class=\"formula\" style=\"" + formulaStyle + "\">";
        html +=         player.get('displayname') + " roll <code style=\"font-size:0.8em;\">" + origRoll + "</code>";
        if (storedCommandsStrObj.storedStr.length)
            html +=     " stored cmd: <code style=\"font-size:0.8em;\">" + storedCommandsStrObj.storedStr.join(' ') + "</code>";
        if (storedCommandsStrObj.storedOnce.length)
            html +=     " storedOnce cmd: <code style=\"font-size:0.8em;\">" + storedCommandsStrObj.storedOnce.join(' ') + "</code>";
        html +=     " </div>";
        html +=     "<div style=\"clear: both;\"></div>";
        if (!result.rollSetup.onlyResult) {
            html += "<div class=\"formula formattedformula\" style=\"" + diceStyle + "\">";
            html +=     "<div class=\"dicegrouping ui-sortable\" data-groupindex=\"0\">";
            html = displayRolls(vals, result, html);
            if (result.addedSuccessesLabel) html += result.addedSuccessesLabel;
            html +=     "</div>";
            html += "</div>";
            html += "<div style=\"clear: both;\"></div>";
        }
        if (result.rollSetup.maxRecursiveAchieved) {
            html += "<p style='" + maxRecursionStyle + "'>MAX RECURSION ACHIEVED</p>";
            html += "<div style=\"clear: both;\"></div>";
        }
        html +=     "<strong> = </strong>";
        html +=     "<div class=\"rolled\" style=\"" + totalStyle + ";" + uidraggableStyle + "\">" + succTxt + " Success" + ((succ != 1) ? "es" : "") + "</div>";
        if (!result.rollSetup.noBotch && !succ && result.rollSetup.hasAtLeastOneFaceOne)
            html += "<p style='" + maxRecursionStyle + "'>YOU'VE BEEN BOTCHED</p>";
        html += "</div></div>";
        return html;
    },

    displayRolls = (vals, result, html) => {
        var diceNumber = 1;
        html += '(';
        vals.forEach(function (item, idx) {
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
                if (item.wasRerolled)       affectedTextShadow += item.wasConditionallyAffected ? (item.conditionalColorIN ? item.conditionalColorIN : conditionalColor) : rerolledColor;
                else if (item.wasExploded)  affectedTextShadow += item.wasConditionallyAffected ? (item.conditionalColorIN ? item.conditionalColorIN : conditionalColor) : explodedColor;
            }
            if (item.exploded)      affectedTextShadow += explodedTextShadow;
            if (item.rerolled)      affectedTextShadow += rerolledTextShadow + (item.condRerolled ? (item.conditionalColor ? item.conditionalColor : conditionalColor) : rerolledColor);
            if (item.condTriggered) affectedTextShadow += `${condTriggeredTextShadowBase}${(item.conditionalColor ? item.conditionalColor : conditionalColor)}`;
            if (item.exploded || item.rerolled || item.condTriggered)
                affectedTextShadow += ';';
            html += `<div data-origindex="${idx}" class="diceroll d10" style="padding: 3px 0;${item.rerolled ? rerolledStyle : ''}">`;
            logger(`displayRolls::title =\n${item.title.join('\n')}\nJSON=${JSON.stringify(item.title)}`);
            html += '<div class="dicon" style="min-width: 36px;' + (item.v == 10 ? ' top: -3px;' : '') + (item.title.length ? '" title="' + item.title.join('&#013;&#010;') : '') + '">';
            html += '<div class="didroll" style="' + diceRollStyle
                + ((item.success ? (item.doubled ? doubleColorStyle : successColorStyle) : ` text-shadow: 0 0 0.03em ${baseColor}`)
                    + (result.rollSetup.colored ? affectedTextShadow : '') + ';')
                + ([1, 10].includes(item.v) ? ' left: 1.5px;' : ' left: 0px;')
                + ' font-size: ' + (item.v == 10 ? '39' : '50') + 'px;">' + item.v + '</div>';
            html += "<div class=\"backing\" style=\"opacity: 1;\"><img src=\"https://s3.amazonaws.com/files.d20.io/images/263689904/B-bmVPv5NQIDKEbHObaOmg/max.png?1641622935\" style=\"" + diceBackgroundStyle + "\"></div>";
            html += "</div>";
            html += (idx + 1 != vals.length) ? "+" : "";
            html += "</div>";
            if (!item.rerolled && !result.rollSetup.hasAtLeastOneFaceOne && item.v === 1) result.rollSetup.hasAtLeastOneFaceOne = true;
        });
        return html + ')';
    },

    buildTableRow = (arrayfirstCol, arraySecondCol) => {
        var outhtml =  '<tr>';
            outhtml +=    `<td style="${tdStyle}">`;
            outhtml +=      `<p style="${pStyle}">`
        for (const [i, code] of arrayfirstCol.entries())
            outhtml +=        `<code style="white-space: nowrap">${code}</code>${i < arrayfirstCol.length - 1 ? '<br>' : ''}`;
            outhtml +=      `</p>`;
            outhtml +=    '</td>';
            outhtml +=    `<td style="${tdStyle}">`;
        for (const paragraph of arraySecondCol)
            outhtml +=      `<p style="${pStyle}">${paragraph}</p>`;
            outhtml +=    '</td>';
            outhtml +=  '</tr>';
        return outhtml;
    },

    /**
     * This builds the HTML for the message that is sent when the user passes the -help command. It's all pretty standard; if you know HTML already, it should
     * be fairly self-explanatory.
     *
     * @return string		outhtml, outhtml2, outhtml3		I know I probably shouldn't have to return three separate strings, but I kept getting errors
     *															when I did it as one string earlier that I couldn't explain, and so once I got it working,
    *															I stopped touching it.
    */
    buildHelp = () => {
        assureHelpHandout();
        return makeHandoutLink(state[script_name].handout_id, `${script_name} Help Handout`);
    },

    assureHelpHandout = (create = false) => {
        // find handout
        let props = { type: 'handout', name: `Help: ${script_name}`, inplayerjournals: 'all' };
        let hh = findObjs(props)[0];
        if (!hh) {
            hh = createObj('handout', Object.assign(props, { avatar: defaultTokenImage }));
            create = true;
        }
        if (create || helpVersion !== state[script_name].lastHelpVersion) {
            var outhtml = '';
            outhtml +=  `<div style="${divStyle}">`;
            outhtml +=      `<p style="${pStyle}"><strong>Exalted 3rd Edition Dice Roller Help</strong></p>`;
            outhtml +=      `<p style="${pStyle}">The basic syntax of most rolls you will make is:</p>`;
            outhtml +=      `<p style="${pStyle}"><code>!exr [no. of dice]#</code> Ex: <code>!exr 10#</code></p>`;
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

            outhtml +=         '</tbody>';
            outhtml +=      '</table>';
            outhtml +=  '</div>';
            logger(`buildHelp::buildHelp outhtml=${outhtml}`);

            hh.set({ notes: outhtml });
            state[script_name].lastHelpVersion = helpVersion;
            log('  > Updating Help Handout to v' + helpVersion + ' <');
        }
        state[script_name].handout_id = hh.id;
    },

    checkInstall = () => {
        log(`-=> ${script_name} v${script_version} <=-  [${new Date(lastUpdate * 1000)}]`);

        if (!state.hasOwnProperty(script_name) || state[script_name].version !== script_version) {
            log(`  > Updating Schema to v${script_version} <`);
            switch (state[script_name] && state[script_name].version) {

                case 1.0:
                /* break; // intentional dropthrough */ /* falls through */

                case 'UpdateSchemaVersion':
                    state[script_name].version = script_version;
                    break;

                default:
                    state[script_name] = {
                        version: script_version
                    };
                    break;
            }
        }
        assureHelpHandout();
    },

    /**
     * This PMs an error message to the user in the event that it doesn't understand something.
     *
     * @param JavaScript Object Reference	result		The content of the rollresult message, as above.
     * @param string						sender		The name of the player who sent the command. Corresponds to msg.who in the original on() function call.
     *
     * @return void
     */
    printError = (result, sender) => {
        logger(LOGLEVEL.ERROR, 'Error!');

        if (result.type == 'error') {
            sendChat(script_name, '/w ' + sender + ' I tried, but Roll20 had a problem with this. They said: ' + result.content);
        } else {
            sendChat(script_name, '/w ' + sender + ' Sorry, I didn\'t understand your input. Please try again.');
        }
    },

    registerEventHandlers = () => {
        on('chat:message', onChatMessage);
    },

    startup = () => {
        logger('-- Loaded EX3Dice! --');
        sendChat(script_name, 'Thanks for using EX3Dice (Groch Version)! For instructions, type <code>!exr -help</code>');
    };

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers,
        onChatMessage: onChatMessage,
        Startup: startup
    };
}());

on("ready", function () {
    'use strict';

    EX3Dice.CheckInstall();
    EX3Dice.RegisterEventHandlers();
    EX3Dice.Startup();
});
