/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */

/*
 * Version 3.0E
 * Original By Robin Kuiper
 * Changes in Version 0.3.0 and before by Victor B
 * Changes in forked and prior versions by The Aaron
 * fork from 2.44 to adapt to Exalted 3 by Groch
 * Change version number to 3.0E for clarity
 * Changes in Version 3.0E until current version by Groch
 * Discord: Vic#5196H
 * Discord: Groch#0102
 * Roll20: https://app.roll20.net/users/3135709/victor-b
 * Github: https://github.com/vicberg/CombatMaster
 * Github: https://github.com/groch/roll20_exalted_stuff
*/
var CombatMaster = CombatMaster || (function() {
    'use strict';

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

    let round = 1,
        version = '3.01E',
        timerObj,
        intervalHandle,
        animationHandle,
        paused = false,
        who = 'gm',
        playerID = null,
        markers = [],
        observers = {
            tokenChange: []
        },
		whisper,
        // handled = [],
        // extensions = {
        //     StatusInfo: true // This will be set to true automatically if you have StatusInfo
        // },
        startImage = '4',
		pauseImage = '5',
        stopImage = '6',
        tagImage = '3',
        // noTagImage = 'd',
        deleteImage = '#',
        // shuffleImage = ';',
        // randomSingleImage = '`',
        // randomLoopImage = '?',
        // togetherImage = 'J',
        // loopImage = 'r',
        sortImage = '1',
        // lockImage = ')',
        // unlockImage = '(',
        backImage = 'y',
        nextImage = ']',
        prevImage = '[',
        // decreaseImage = '<',
        // increaseImage = '>',
        timerImage = 't',
        favoriteImage = 'S',
        allConditionsImage = 'G',
        addImage = '&',
        doneImage = '3',
        showImage = 'v',
        delayImage = '}',
        // sortConditionsImage = '0',
        holdImage = 'L',
        helpImage = 'i';
        // conditionsImage = ':',
        // spellsImage = 'C';

    //Styling for the chat responses.
    const LogLvl = LOGLEVEL.INFO, // EDIT THIS TO CHANGE LOG LEVEL
    logger = (level, ...logged) => {
        if (!(level instanceof LOGLEVEL)) {
            logged.unshift(level);
            level = LOGLEVEL.DEBUG;
        }
    
        if (level <= LogLvl)
            log(...logged);
    },
    styles = {
        reset:           'padding: 0; margin: 0;',
        menu:            'background-color: #fff; border: 1px solid #000; padding: 5px; border-radius: 5px;',
        title:           'font-size:14px;font-weight:bold;background-color:black;padding:3px;border-top-left-radius:3px;border-top-right-radius:3px',
        baseTitle:       'font-size:14px;font-weight:bold;padding:3px;border-top-left-radius:3px;border-top-right-radius:3px',
        titleText:       'color:white',
        titleSpacer:     'font-weight: bold; border-bottom: 1px solid black;font-size: 100%;style="float:left;',
        version:         'font-size:10px;',
        header:          'margin-top:10px;margin-bottom:5px;font-weight:bold;font-style:italic;display:inline-block;',
        button:          'background-color: #000; border: 1px solid #292929; border-radius: 3px; padding: 5px; color: #fff; text-align: center;width:100%',
        textButton:      'background-color:#fff; color: #000; text-align: center; float: right;',
        conditionButton: 'background-color:#fff; color: #000;margin-left:1px;',
        linkButton:      'background-color:#fff; color: #000; text-align: center;vertical-align:middle',
        textLabel:       'background-color:#fff;float:left;text-align:center;margin-top:8px',
        bigButton:       'width:80%;border-radius:5px;text-align:center;margin-left:15px',
        bigButtonLink:   'background-color:#000000; border-radius: 5px; padding: 5px; color: #fff; text-align: center;width:100%',
        wrapBox:         ' border: 1px solid #292929; border-radius: 3px;margin-top:3px;margin-bottom:3px',
        body:            'background-color:#fff',
        list:            'list-style: none;padding:2px',
        float: {
            right: 'float: right;',
            left:  'float: left;'
        },
        overflow:        'overflow: hidden;',
        fullWidth:       'width: 100%;',
        underline:       'text-decoration: underline;',
        strikethrough:   'text-decoration: strikethrough',
        background:      'background-color:lightgrey',
        buttonRight:     'display:inline-block;float:right;vertical-aligh:middle',
        announcePlayer:  'display:inline-block;vertical-align:middle;',
    },
    // Styling for the chat responses.
    // style = "overflow: hidden; background-color: #fff; border: 1px solid #000; padding: 5px; border-radius: 5px;",
    // buttonStyle = "background-color: #000; border: 1px solid #292929; border-radius: 3px; padding: 5px; color: #fff; text-align: center; float: right;",
    // conditionStyle = "background-color: #fff; border: 1px solid #000; padding: 5px; border-radius: 5px;",
    // conditionButtonStyle = "text-decoration: underline; background-color: #fff; color: #000; padding: 0",
    // listStyle = 'list-style: none; padding: 0; margin: 0;',
    mainMarkerName =  'MainMarker',
    nextMarkerName =  'NextMarker',
    rangeMarkerName = 'RangeMarker',
    markerType = {ROUND:'round', MAIN: 'main', NEXT: 'next', RANGE: 'range'},
    invisibleImage = 'https://s3.amazonaws.com/files.d20.io/images/255367527/BLuBSgz14Tx_IGSPAPM6vw/max.png?1636797848',
    icon_image_positions = {red:"#C91010",blue:"#1076C9",green:"#2FC910",brown:"#C97310",purple:"#9510C9",pink:"#EB75E1",yellow:"#E5EB75",dead:"X",skull:0,sleepy:34,"half-heart":68,"half-haze":102,interdiction:136,snail:170,"lightning-helix":204,spanner:238,"chained-heart":272,"chemical-bolt":306,"death-zone":340,"drink-me":374,"edge-crack":408,"ninja-mask":442,stopwatch:476,"fishing-net":510,overdrive:544,strong:578,fist:612,padlock:646,"three-leaves":680,"fluffy-wing":714,pummeled:748,tread:782,arrowed:816,aura:850,"back-pain":884,"black-flag":918,"bleeding-eye":952,"bolt-shield":986,"broken-heart":1020,cobweb:1054,"broken-shield":1088,"flying-flag":1122,radioactive:1156,trophy:1190,"broken-skull":1224,"frozen-orb":1258,"rolling-bomb":1292,"white-tower":1326,grab:1360,screaming:1394,grenade:1428,"sentry-gun":1462,"all-for-one":1496,"angel-outfit":1530,"archery-target":1564},
    icon_custom_token = {"clashlost::5271616": 'https://s3.amazonaws.com/files.d20.io/images/5271616/Kl55cKKOq-v4AoBUsAynrQ/max.png?1656706679'},
    ctMarkers = ['blue', 'brown', 'green', 'pink', 'purple', 'red', 'yellow', '-', 'all-for-one', 'angel-outfit', 'archery-target', 'arrowed', 'aura', 'back-pain', 'black-flag', 'bleeding-eye', 'bolt-shield', 'broken-heart', 'broken-shield', 'broken-skull', 'chained-heart', 'chemical-bolt', 'cobweb', 'dead', 'death-zone', 'drink-me', 'edge-crack', 'fishing-net', 'fist', 'fluffy-wing', 'flying-flag', 'frozen-orb', 'grab', 'grenade', 'half-haze', 'half-heart', 'interdiction', 'lightning-helix', 'ninja-mask', 'overdrive', 'padlock', 'pummeled', 'radioactive', 'rolling-bomb', 'screaming', 'sentry-gun', 'skull', 'sleepy', 'snail', 'spanner',   'stopwatch','strong', 'three-leaves', 'tread', 'trophy', 'white-tower'],
    // shaped_conditions = ['blinded', 'charmed', 'deafened', 'frightened', 'grappled', 'incapacitated', 'invisible', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'stunned', 'unconscious'],
    script_name = 'CombatMaster',
    combatState = 'COMBATMASTER',

    inputHandler = (msg_orig) => {
        logger('inputHandler::inputHandler turnorder=' + JSON.stringify(Campaign().get('turnorder')));

        let status = state[combatState].config.status;
        if (status.autoAddSpells) {
            if (status.sheet == 'OGL') {
                if (msg_orig && (msg_orig.rolltemplate && msg_orig.rolltemplate === 'spell') ) {
                    logger(`inputHandler::msg_orig=${msg_orig}`);
                    handleSpellCast(msg_orig);
                }
            } else if (status.sheet == 'Shaped')
                if (msg_orig && msg_orig.content.includes("{{spell=1}}"))   handleSpellCast(msg_orig);
            else if (status.sheet == 'PF2')
                if (msg_orig && msg_orig.content.includes("{cast}"))        handleSpellCast(msg_orig);
        }

        if (msg_orig.content.indexOf('!cmaster')!==0) {
            logger('inputHandler::inputHandler NOT OUR MESSAGE ==> OUT');
            return;
        }

        var msg = _.clone(msg_orig),args,restrict;

        playerID = msg.playerid;
        if (msg.playerid === 'API') {
            who = 'API';
        } else if (playerIsGM(msg.playerid)) {
            state[combatState].config.gmPlayerID = msg.playerid;
            who = 'gm';
        } else
            who = getObj('player', msg.playerid).get('displayname');

		if (_.has(msg,'inlinerolls')) //calculates inline rolls
			msg.content = inlineExtract(msg);

		//splits the message contents into discrete arguments, special handling for import
        let cmdDetails = {details: {}};

        if (msg.content.indexOf('import') >= 0) {
            cmdDetails.action = 'import';
            msg.content = msg.content.replace('!cmaster ','');
            cmdDetails.details['config'] = msg.content.replace('--import,','');
            commandHandler(cmdDetails,msg,restrict,who,playerID);
        } else {
            args = msg.content.split(/\s+--/);
            if (args[0] === '!cmaster' && args[1]){
                _.each(_.rest(args,1),(cmd) =>{
                    cmdDetails = cmdExtract(cmd);
                    logger(cmdDetails);
                    commandHandler(cmdDetails,msg,restrict,who,playerID);
                });
            }
        }
        logger('inputHandler::inputHandler END');
	},

	//Extracts inline rolls
	inlineExtract = (msg) => {
        return _.chain(msg.inlinerolls)
				.reduce(function(m,v,k){
					m['$[['+k+']]']=v.results.total || 0;
					return m;
				},{})
				.reduce((m,v,k) => m.replace(k,v), msg.content)
				.value();
	},

    //Extracts the command details from a command string passed from handleInput
	cmdExtract = (cmd) => {
        var cmdSep = {details: {}}, vars, temp;
        logger(`cmdExtract::cmdExtract cmd=${cmd}`);

        let values = parseLine(cmd);
        let lookup = values.lookup;
        let tokens = values.tokens;
        logger('cmdExtract::Lookup:' + lookup);
        logger('cmdExtract::Tokens:' + tokens);

        //find the action and set the cmdSep Action
        cmdSep.action = String(tokens).match(/turn|show|config|back|reset|main|remove|add|new|delete|import|export|help|spell|ignore|clear|onslaught|toggleVision|createDecisiveAbilities|moteAdd|togglePageSize|announceCrashAndSendInitGainButton|applyInitBonusToCrasherSelected|announceCrashOff|rstInitToSelected|applyGrabDefPen|remGrabDefPen|applyProneDefPen|remProneDefPen|applyLightCoverDefBonus|applyHeavyCoverDefBonus|remCoverDefBonus|applyClashDefPen|remClashDefPen/);
        //the ./ is an escape within the URL so the hyperlink works.  Remove it
        cmd.replace('./', '');

        //split additional command actions
        _.each(String(tokens).replace(cmdSep.action+',','').split(','),(d) => {
            vars=d.match(/(who|next|main|previous|delay|start|stop|hold|timer|pause|show|all|favorites|setup|conditions|condition|sort|combat|turnorder|accouncements|timer|macro|status|list|export|import|type|key|value|setup|tracker|confirm|direction|duration|message|initiative|config|assigned|type|action|description|target|id|started|stopped|held|addAPI|remAPI|concentration|view|qty|revert|tok|)(?::|=)([^,]+)/) || null;
            if (vars) {
                if (vars[2].includes('INDEX')) {
                    let key, result;
                    for (key in lookup) {
                        result = lookup[key].replace(/{/g, '');
                        result = result.replace(/}/g, '');
                        vars[2] = vars[2].replace('{INDEX:' + key + '}',result);
                    }
                }
                temp = (vars[2] === 'true') ? true : (vars[2] === 'false') ? false : vars[2];
                cmdSep.details[vars[1]]=temp;
            } else
                cmdSep.details[d]=d;
        });

        return cmdSep;
	},

    parseLine = (cmd) => {
        let lookup  = [];
        let depth   = 0;
        let lastc   = '';
        let capture = '';
        let line    = '';

        [...cmd].forEach((c,i,o)=>{
            if ('{' === lastc && '{' === c) ++depth;
            if ('}' === lastc && '}' === c) {
                if (!--depth && capture.length) {
                    line+=`INDEX:${lookup.length}`;
                    lookup.push(capture);
                    capture='';
                }
            }

            if (depth)  capture+=c;
            else        line   +=c;

            lastc = c;
        });

        let tokens = line.split(/\s+--/);
        return {lookup, tokens};
    },

    IsSenderGmOrTokenOwner = (who, playerID) => {
        logger('IsSenderGmOrTokenOwner::IN who='+who+', playerId='+playerID);
        let currentTurnTokenObj = findObjs({_id:getCurrentTurnObject().id, _pageid:Campaign().get("playerpageid"), _type: 'graphic'})[0],
            tokenControlledBy = (getObj('character', currentTurnTokenObj.get('represents')) || currentTurnTokenObj).get('controlledby').split(',');
        if (!Array.isArray(tokenControlledBy)) tokenControlledBy = [tokenControlledBy];
        logger('IsSenderGmOrTokenOwner::tokenControlledBy='+tokenControlledBy);
        logger('IsSenderGmOrTokenOwner::OUT ret='+(tokenControlledBy.includes(playerID) || who === 'gm'));
        return tokenControlledBy.includes(playerID) || who === 'gm';
    },

	//Processes the commands based on Delay Time (if any)
    /*
     * WHO = STRING     Displayed Name
     */
	commandHandler = (cmdDetails,msg,restrict,who,playerID) => {
        logger(`commandHandler::commandHandler cmdDetails=${JSON.stringify(cmdDetails)}, msg=${JSON.stringify(msg)}`);
        if (who)        logger('commandHandler::who=' + JSON.stringify(who));
        if (playerID)   logger('commandHandler::playerID=' + JSON.stringify(playerID));
        //logger('commandHandler !!!!!!! campaign=' + JSON.stringify(Campaign()));

        if (cmdDetails.action == 'back') {
            if (cmdDetails.details.setup) {
                cmdDetails.action = 'show';
                cmdDetails.details['setup'] = true;
            } else if (cmdDetails.details.tracker) {
                cmdDetails.action = 'main';
            } else {
                if (state[combatState].config.previousPage == 'main') {
                    cmdDetails.action = 'main';
                } else {
                    cmdDetails.action = 'show';
                    cmdDetails.details['conditions'] = true;
                }
            }
        }

        if (cmdDetails.action == 'main' || !cmdDetails.action)
            sendMainMenu(who);
        if (cmdDetails.action == 'turn') {
            if (cmdDetails.details.next && IsSenderGmOrTokenOwner(who, playerID))
                changeTurnOrderToNext();
            if (cmdDetails.details.delay && IsSenderGmOrTokenOwner(who, playerID))
                delayTurn();
            if (cmdDetails.details.previous)            changeTurnOrderToPrevious();
            if (cmdDetails.details.start)               startCombat(msg.selected, who);
            if (cmdDetails.details.stop)                stopCombat(who);
            if (cmdDetails.details.hold)                holdCombat(who);
            if (cmdDetails.details.timer == 'pause')    pauseTimer();
            if (cmdDetails.details.timer == 'stop')     stopTimer();
            if (cmdDetails.details.sort)                sortTurnorder();
        }

        if (cmdDetails.action == 'show') {
            if (cmdDetails.details.view)            editShowState(cmdDetails.details.value);
            if (cmdDetails.details.setup)           sendConfigMenu();
            if (cmdDetails.details.initiative)      sendInitiativeMenu();
            if (cmdDetails.details.turnorder)       sendTurnorderMenu();
            if (cmdDetails.details.timer)           sendTimerMenu();
            if (cmdDetails.details.announce)        sendAnnounceMenu();
            if (cmdDetails.details.macro)           sendMacroMenu();
            if (cmdDetails.details.status)          sendStatusMenu();
            if (cmdDetails.details.concentration)   sendConcentrationMenu();
            if (cmdDetails.details.conditions)      sendConditionsMenu();
            if (cmdDetails.details.export)          exportConditions();
            if (cmdDetails.details.condition) {
                if (cmdDetails.details.addAPI)
                    sendConditionAddAPIMenu(cmdDetails.details.condition);
                else if (cmdDetails.details.remAPI)
                    sendConditionRemAPIMenu(cmdDetails.details.condition);
                else
                    sendConditionMenu(cmdDetails.details.condition);
            }
            if (cmdDetails.details.assigned)    showConditions(msg.selected);
            if (cmdDetails.details.description) sendConditionToChat(cmdDetails.details.key);
        }

        if (cmdDetails.action == 'add') {
            if (cmdDetails.details.target)
                addTargetsToCondition(msg.selected,cmdDetails.details.id,cmdDetails.details.condition);
            else if (cmdDetails.details.condition)
                addCondition(cmdDetails,msg.selected,playerID);
        }

        if (cmdDetails.action == 'remove' && cmdDetails.details.condition)
            removeCondition(cmdDetails, msg.selected);
        if (cmdDetails.action == 'config')
            editCombatState(cmdDetails);
        if (cmdDetails.action == 'new'){
            if (cmdDetails.details.condition)   newCondition(cmdDetails.details.condition);
            else if (cmdDetails.details.macro)  newSubstitution(cmdDetails);
        }
        if (cmdDetails.action == 'delete'){
            if (cmdDetails.details.condition)   deleteCondition(cmdDetails.details.condition,cmdDetails.details.confirm);
            else if (cmdDetails.details.macro)  removeSubstitution(cmdDetails);
        }
        if (cmdDetails.action == 'import')      importCombatMaster(cmdDetails.details.config);
        if (cmdDetails.action == 'spell') {
            if (cmdDetails.details.confirm)     addSpell(cmdDetails.details.key);
            else                                ignoreSpell(cmdDetails.details.key);
        }
        if (cmdDetails.action == 'reset') {
			state[combatState] = {};
			setDefaults(true);
			sendMainMenu(who);
        }
        if (cmdDetails.action == 'ignore') {
			state[combatState].ignores = [];
			sendMainMenu(who);
        }
        if (cmdDetails.action == 'clear') {
			clearTokenStatuses(msg.selected);
			sendMainMenu(who);
        }
        if (cmdDetails.action == 'help')        showHelp(cmdDetails);

        const simpleCastList = [
                {key:'announceCrashAndSendInitGainButton',  fxName:'announceCrashAndSendInitGainButton',  fx: announceCrashAndSendInitGainButton},
                {key:'announceCrashOff',                    fxName:'announceCrashOff',                    fx: announceCrashOff},
                {key:'applyGrabDefPen',                     fxName:'applyGrabDefPen',                     fx: applyGrabDefPen},
                {key:'remGrabDefPen',                       fxName:'remGrabDefPen',                       fx: remGrabDefPen},
                {key:'applyProneDefPen',                    fxName:'applyProneDefPen',                    fx: applyProneDefPen},
                {key:'remProneDefPen',                      fxName:'remProneDefPen',                      fx: remProneDefPen},
                {key:'applyLightCoverDefBonus',             fxName:'applyLightCoverDefBonus',             fx: applyLightCoverDefBonus},
                {key:'applyHeavyCoverDefBonus',             fxName:'applyHeavyCoverDefBonus',             fx: applyHeavyCoverDefBonus},
                {key:'remCoverDefBonus',                    fxName:'remCoverDefBonus',                    fx: remCoverDefBonus},
                {key:'applyClashDefPen',                    fxName:'applyClashDefPen',                    fx: applyClashDefPen},
                {key:'remClashDefPen',                      fxName:'remClashDefPen',                      fx: remClashDefPen},
            ],
            checkedCastList = [
                {key:'onslaught',                           fxName:'addOnslaughtToPlayer',                fx: addOnslaughtToPlayer},
                {key:'toggleVision',                        fxName:'toggleTokenVision',                   fx: toggleTokenVision},
                {key:'createDecisiveAbilities',             fxName:'createDecisiveAbilities',             fx: createDecisiveAbilities},
                {key:'moteAdd',                             fxName:'addMotesCommand',                     fx: addMotesCommand},
                {key:'togglePageSize',                      fxName:'togglePageSize',                      fx: togglePageSize},
                {key:'applyInitBonusToCrasherSelected',     fxName:'applyInitBonusToCrasherSelected',     fx: applyInitBonusToCrasherSelected},
                {key:'rstInitToSelected',                   fxName:'rstInitToSelected',                   fx: rstInitToSelected}
            ];

        for (const fxObj of checkedCastList) {
            if (cmdDetails.action == fxObj.key) {
                if (!playerIsGM(playerID)) {
                    logger(LOGLEVEL.NOTICE, `commandHandler::${fxObj.key} received but user is not GM`);
                    return;
                }
                logger(`commandHandler::before ${fxObj.fxName}`);
                fxObj.fx(cmdDetails, msg.selected);
            }    
        }

        for (const fxObj of simpleCastList) {
            if (cmdDetails.action == fxObj.key) {
                logger(`commandHandler::before ${fxObj.fxName}`);
                fxObj.fx(cmdDetails, msg.selected);
            }    
        }
	},

    clearTokenStatuses = (selectedTokens) => {
        if (!selectedTokens) return;
        let tokenObj;
        selectedTokens.forEach(token => {
            if (token._type == 'graphic') {
                tokenObj = getObj('graphic', token._id);
                if (tokenObj) tokenObj.set('statusmarkers', "");
            }
        });
    },

    //*************************************************************************************************************
    //NEW ACTIONS
    //*************************************************************************************************************

    setInitToSelected = (cmdDetails, selected, confObj) => {
        logger(`${confObj.name}::${confObj.name} cmdDetails=${JSON.stringify(cmdDetails)}, selected=${JSON.stringify(selected)}`);

        if (!selected) {
            logger(`${confObj.name}:: NO SELECTED, RETURN`);
            sendGMStandardScriptMessage('Please select a token on the page for the script to work !');
            return;
        }

        let turnorder = getTurnorder(), appliedCount = 0, appliedName;
        logger(`${confObj.name}:: turnorder=${JSON.stringify(turnorder)}`);

        _.chain(selected)
        .map(o => getObj('graphic',o._id))
        .compact()
        .each(function(t){
            if (appliedCount) return;

            for (var i = 0; i < turnorder.length; i++) {
                if (turnorder[i].pr === '-420' || turnorder[i].id !== t.get('id')) continue;
                let tokenObj    = findObjs({_id:turnorder[i].id, _pageid:Campaign().get("playerpageid"), _type: 'graphic'})[0];
                turnorder[i].pr = confObj.getInitToSetFx(cmdDetails.details['initiative'], turnorder[i].pr);
                let imgurl = tokenObj.get('imgsrc');
                let image  = (imgurl) ? '<img src="'+imgurl+'" width="50px" height="50px" />' : '';
                appliedName = tokenObj.get('name');
                sendStandardScriptMessage(`${appliedName} ${confObj.getMessageFx(turnorder[i].pr)}`, image, 'display:inline-block;vertical-align:middle;', false);
                appliedCount++;
            }
        });
        if (appliedCount) {
            logger(LOGLEVEL.INFO, `${confObj.name}:: ${confObj.debugMessageOnSet} to '${appliedName}'`);
            setTurnorder(turnorder);
        }
    },

    announceAndExec = (cmdDetails, confObj) => {
        logger(`${confObj.name}::${confObj.name} cmdDetails=${JSON.stringify(cmdDetails)}`);

        if (confObj.charAttrToSet) {
            const charObj = getObj('character', cmdDetails.details['id']);
            if (!charObj) {
                logger(LOGLEVEL.ERROR, `${confObj.name}:: NO CharID FROM CONDITIONS AUTO ACTION ?!`)
            }
            if (confObj.debugMessage) logger(LOGLEVEL.INFO, `${confObj.name}:: charObj.name=${charObj.get('name')} got ${confObj.debugMessage}`);
            setAttrs(charObj.get('id'), confObj.charAttrToSet);
        }

        let tokenObj    = getObj('graphic', cmdDetails.details['tok']);
        let name        = tokenObj.get('name');
        logger(`${confObj.name}:: name=${name}, actual statuses=${tokenObj.get('statusmarkers')}`);
        let imgurl      = tokenObj.get('imgsrc');
        let image       = (imgurl) ? `<img src="${imgurl}" width="50px" height="50px"  />` : '';
        name            = (state[combatState].config.announcements.handleLongName) ? handleLongString(name) : name;
        let contents    = `<div style="${styles.announcePlayer}">${image}</div>`;
        contents   += `<div style="${styles.announcePlayer}max-width: 67%;">${name} ${confObj.contentString}</div>`;

        if (tokenObj.get('layer') == 'gmlayer')
            makeAndSendMenu(contents,confObj.title,'gm', false, `background-color:${confObj.bgColor};${styles.specialTitle}`);
        else
            makeAndSendMenu(contents,confObj.title,'', false, `background-color:${confObj.bgColor};${styles.specialTitle}`);
    },

    remClashDefPen = (cmdDetails) => {
        announceAndExec(cmdDetails, {
            name: 'remCoverDefBonus',                   debugMessage: 'removed CLASH def Penalty',        charAttrToSet: {'clash-def-penalty':0},
            contentString: 'recovered from Clash Lost', title: 'Out of Clash Lost Penalty',               bgColor: 'darkgreen'
        });
    },

    applyClashDefPen = (cmdDetails) => {
        announceAndExec(cmdDetails, {
            name: 'applyClashDefPen',                   debugMessage: 'applied CLASH def Penalty',      charAttrToSet: {'clash-def-penalty':2},
            contentString: 'has failed the Clash',      title: 'Clash Lost Defense Penalty',            bgColor: 'darkred'
        });
    },

    remCoverDefBonus = (cmdDetails) => {
        announceAndExec(cmdDetails, {
            name: 'remCoverDefBonus',                   debugMessage: 'removed COVER def Bonus',        charAttrToSet: {'cover-def-bonus':0},
            contentString: 'is out of Cover',           title: 'Out of Cover',                          bgColor: 'black'
        });
    },

    applyHeavyCoverDefBonus = (cmdDetails) => {
        announceAndExec(cmdDetails, {
            name: 'applyHeavyCoverDefBonus',            debugMessage: 'applied HEAVY COVER def Bonus',  charAttrToSet: {'cover-def-bonus':2},
            contentString: 'is now behind Heavy Cover', title: 'Heavy Cover',                           bgColor: 'green'
        });
    },

    applyLightCoverDefBonus = (cmdDetails) => {
        announceAndExec(cmdDetails, {
            name: 'applyLightCoverDefBonus',            debugMessage: 'applied LIGHT COVER def Bonus',  charAttrToSet: {'cover-def-bonus':1},
            contentString: 'is now behind Light Cover', title: 'Light Cover',                           bgColor: 'darkgreen'
        });
    },

    remProneDefPen = (cmdDetails) => {
        announceAndExec(cmdDetails, {
            name: 'remProneDefPen',                     debugMessage: 'removed PRONE def Penalty',      charAttrToSet: {'prone-def-penalty':0},
            contentString: 'got on his feet',           title: 'Out of Prone',                          bgColor: 'darkgreen'
        });
    },

    applyProneDefPen = (cmdDetails) => {
        announceAndExec(cmdDetails, {
            name: 'applyProneDefPen',                   debugMessage: 'applied PRONE def Penalty',      charAttrToSet: {'prone-def-penalty':1},
            contentString: 'is now prone',              title: 'Prone',                                 bgColor: 'darkred'
        });
    },

    remGrabDefPen = (cmdDetails) => {
        announceAndExec(cmdDetails, {
            name: 'remGrabDefPen',                      debugMessage: 'removed GRAB def Penalty',       charAttrToSet: {'grab-def-penalty':0},
            contentString: 'is out of grab',            title: 'Out of Grab',                           bgColor: 'darkgreen'
        });
    },

    applyGrabDefPen = (cmdDetails) => {
        announceAndExec(cmdDetails, {
            name: 'applyGrabDefPen',                    debugMessage: 'applied GRAB def Penalty',       charAttrToSet: {'grab-def-penalty':2},
            contentString: 'has been grabbed',          title: 'Grab',                                  bgColor: 'darkred'
        });
        sendMainMenu('gm');
    },

    rstInitToSelected = (cmdDetails, selected) => {
        setInitToSelected(cmdDetails, selected, {
            name: 'rstInitToSelected',
            getInitToSetFx: cmdInit => Number(cmdInit),
            getMessageFx: (init) => `<b>reset init to ${init}</b> for getting out of Crash status`,
            debugMessageOnSet: 'Reseting init'
        });
    },

    announceCrashOff = (cmdDetails) => {
        let tokenObj    = getObj('graphic', cmdDetails.details['tok']);
        let doneButton  = makeImageButton('!cmaster --rstInitToSelected,initiative=?{Reset to ?|3}',doneImage,'Reset Init (GM Only)','transparent',18,'white');
        let title       = 'Out of Crash';

        let turnorder = getTurnorder(), isStillCrashed = false;
        for (var i = 0; i < turnorder.length; i++) {
            if (turnorder[i].pr === '-420' || turnorder[i].id !== tokenObj.get('id')) continue;
            if (turnorder[i].pr <= 0) isStillCrashed = true;
            break;
        }
        if (isStillCrashed) title += '<div style="'+styles.buttonRight+'">'+doneButton+'</div>';

        announceAndExec(cmdDetails, {
            name: 'announceCrashOff',
            contentString: 'is out of crash status', title: title, bgColor: 'darkgreen'
        });
    },

    applyInitBonusToCrasherSelected = (cmdDetails, selected) => {
        setInitToSelected(cmdDetails, selected, {
            name: 'applyInitBonusToCrasher',
            getInitToSetFx: (cmdInit, init) => Number(init) + 5,
            getMessageFx: () => '<b>gain 5 init</b> for having crashed someone',
            debugMessageOnSet: 'Applying init bonus'
        });
    },

    announceCrashAndSendInitGainButton = (cmdDetails) => {
        let doneButton  = makeImageButton('!cmaster --applyInitBonusToCrasherSelected',doneImage,'Apply Init Bonus (GM Only)','transparent',18,'white');
        let title       = 'Crashed<div style="'+styles.buttonRight+'">'+doneButton+'</div>';

        announceAndExec(cmdDetails, {
            name: 'announceCrashAndSendInitGainButton',
            contentString: 'has been crashed',          title: title, bgColor: 'darkred'
        });
    },

    togglePageSize = (cmdDetails, selected) => {
        logger(LOGLEVEL.INFO, `togglePageSize::togglePageSize cmdDetails=${JSON.stringify(cmdDetails)}, selected=${JSON.stringify(selected)}`);

        const revert = cmdDetails.details['revert'] ? true : false;
        logger(`togglePageSize::togglePageSize revert=${revert}`);

        if (!selected) {
            logger(`addMotesCommand::NO SELECTED, RETURN`);
            sendGMStandardScriptMessage('Please select a token on the page for the script to work !');
            return;
        }
        const tokenObj = getObj('graphic', selected[0]['_id']);
        const pageObj = getObj('page', tokenObj.get('_pageid'));
        let scale_number = Number(pageObj.get('scale_number')), // grid cell distance
            snapping_increment = Number(pageObj.get('snapping_increment')); // cell width
        logger(`togglePageSize::togglePageSize scale_number=${scale_number}, snapping_increment=${snapping_increment}`);

        scale_number =       revert ? scale_number * 70             : scale_number / 70;
        snapping_increment = revert ? 1                             : 1 / 70;
        pageObj.set({diagonaltype: "pythagorean", showgrid: true, grid_opacity: 0, scale_number: scale_number, snapping_increment: snapping_increment});
        sendGMStandardScriptMessage(`Script DONE ! ${revert ? 'REVERT =>' : ' =>'}<br/> scale_number=${scale_number},<br/> snapping_increment=${snapping_increment}`);
    },

    addMotesCommand = (cmdDetails, selected) => {
        logger(LOGLEVEL.INFO, `addMotesCommand::addMotesCommand cmdDetails=${JSON.stringify(cmdDetails)}, selected=${JSON.stringify(selected)}`);

        let qty = cmdDetails.details['qty'] ? parseInt(cmdDetails.details['qty']) : state[combatState].config.turnorder.moteQtyToAdd,
            charAddedList = [];

        if (!selected) {
            let charList = findObjs({_type: 'character'}).filter(i => getAttrByName(i.get('id'), 'caste') !== 'Mortal');
            logger(`addMotesCommand::NO SELECTED, ADDING TO ALL CHAR: ${charList.map(i => i.get('name'))}`);
            for (const obj of charList)
                if (addMotesToNonMortalCharacter(obj, qty)) charAddedList.push(makeCharacterLink(obj));
        } else {
            _.chain(selected)
            .map(o => getObj('graphic',o._id))
            .compact()
            .each(function(t){
                var characterId = t.get('represents'), finalcharacterObj = getObj('character',characterId);
                if (addMotesToNonMortalCharacter(finalcharacterObj, qty))
                    charAddedList.push(makeCharacterLink(finalcharacterObj, characterId));
            });
        }
        logger(`addMotesCommand::charAddedList.length=${charAddedList.length}, announceMoteRegen=${state[combatState].config.announcements.announceMoteRegen}`);
        if (charAddedList.length && state[combatState].config.announcements.announceMoteRegen)
            sendStandardScriptMessage(`Adding up to ${qty} motes to these Tokens : ${charAddedList.join(', ')}`);
    },

    addMotesToNonMortalCharacters = (turnorder) => {
        logger(`addMotesToNonMortalCharacters::addMotesToNonMortalCharacters`);
        const playerPageId = Campaign().get("playerpageid");
        var charAddedList = [];
        for (const turn of turnorder) {
            logger(`addMotesToNonMortalCharacters::turn=${JSON.stringify(turn)}`);
            if (turn.pr === -420) continue;
            let tokenObj = findObjs({_id:turn.id, _pageid:playerPageId, _type: 'graphic'})[0];
            if (!tokenObj) {
                logger(LOGLEVEL.NOTICE, 'PLAYER TOKEN POSSIBLY NOT ON COMBAT PAGE !!!');
                continue;
            }
            let characterId = tokenObj.get('represents'),
                characterObj = getObj('character', characterId),
                characterCaste = getAttrByName(characterId, 'caste'),
                added = false;
            logger(`addMotesToNonMortalCharacters::characterId=${characterId}, characterObj=${JSON.stringify(characterObj)}, caste=${characterCaste}`);
            if (tokenObj && characterObj && characterCaste !== 'Mortal')
                added = addMotesToNonMortalCharacter(characterObj);
            if (added)
                charAddedList.push(makeCharacterLink(tokenObj, characterId));
        }
        logger(`addMotesToNonMortalCharacters::END charAddedList.length=${charAddedList.length}, announceMoteRegen=${state[combatState].config.announcements.announceMoteRegen}`);
        if (charAddedList.length && state[combatState].config.announcements.announceMoteRegen)
            sendStandardScriptMessage(`Adding up to ${state[combatState].config.turnorder.moteQtyToAdd} motes to these Tokens : ${charAddedList.join(', ')}`);
    },

    addMotesToNonMortalCharacter = (characterObj, qty = state[combatState].config.turnorder.moteQtyToAdd) => {
        logger(LOGLEVEL.INFO, `addMotesToNonMortalCharacter::addMotesToNonMortalCharacter NON MORTAL FOUND:${characterObj.get('name')}`);
        let characterId = characterObj.get('id'), attrList = findObjs({_characterid:characterId, _type: 'attribute'}), controlledBy = characterObj.get('controlledby');
        controlledBy = (controlledBy !== '') ? controlledBy.split(',') : [];

        logger(`addMotesToNonMortalCharacter::found ${attrList.length} objects, ${JSON.stringify(attrList.map(i => i.get('name')).sort())}`);
        attrList = attrList
            .filter(i => ['personal-essence', 'peripheral-essence'].includes(i.get('name')))
            .sort((a, b) => {
                if (a.get('name') === 'personal-essence' && b.get('name') !== 'personal-essence') return 1;
                if (a.get('name') !== 'personal-essence' && b.get('name') === 'personal-essence') return -1;
                return a.get('name').localeCompare(b.get('name'));
            });

        logger(`addMotesToNonMortalCharacter::found ${attrList.length} objects, ${JSON.stringify(attrList)}`);
        var added = 0;
        for (const attr of attrList) {
            if (!attr) continue;
            let current = parseInt(attr.get('current')), max = parseInt(attr.get('max'));
            if (isNaN(current))  current = 0;
            if (isNaN(max))      max = updateMaxAttr(characterId, attr);
            if (current === max) continue;
            logger(`addMotesToNonMortalCharacter::qty=${qty}, added=${added}, current=${current}, max=${max}`);
            let toAdd = qty - added < max - current ? qty - added : max - current;
            added += toAdd;
            logger(LOGLEVEL.INFO, `addMotesToNonMortalCharacter::adding ${toAdd} to ${characterObj.get('name')}, current=${current}, max=${JSON.stringify(max)}`);
            let total = (current + toAdd);
            if (!isNaN(total)) {
                const outString = `${makeCharacterLink(characterObj, characterId)}:> Adding ${toAdd} motes to ${attr.get('name')}`;
                attr.set('current', current + toAdd);
                if (!state[combatState].config.announcements.announceMoteRegen) {
                    logger(`addMotesToNonMortalCharacter::controlledBy=${JSON.stringify(controlledBy)}, characterObj=${JSON.stringify(characterObj)}`);
                    for (const idPlayer of controlledBy) {
                        const playerObj = getObj('player', idPlayer);
                        if (!playerObj) {
                            logger(LOGLEVEL.ERROR, `ERROR NO PLAYEROBJ FOR THIS ID:${idPlayer} probably imported character`);
                            continue;
                        }
                        sendWhisperStandardScriptMessage(playerObj.get('_displayname'), outString);
                    }
                }
                if (!state[combatState].config.announcements.announceMoteRegen || controlledBy.length === 0) {
                    sendGMStandardScriptMessage(`${outString}${controlledBy.length ? ` (whispered to: [${controlledBy.map(i => {
                        const playerObj = getObj('player', i);
                        if (playerObj) return playerObj.get('_displayname');
                        logger(LOGLEVEL.ERROR, `ERROR NO PLAYEROBJ FOR THIS ID:${i} probably imported character`);
                        return false;
                    }).filter(i => i).join(', ')}])`:''}`);
                }
            }
            if (added >= qty) break;
        }
        return added && controlledBy.length ? true : false;
    },

    updateMaxAttr = (characterId, attr) => {
        let test = (attr.get('name') === 'personal-essence' ? 'personal-equation' : 'peripheral-equation'),
            equationStr         = getAttrByName(characterId, test),
            committedesstotal   = parseInt(getAttrByName(characterId, 'committedesstotal')),
            essence             = parseInt(getAttrByName(characterId, 'essence'));
        logger(`updateMaxAttr::updateMaxAttr essence=${essence}`);
        equationStr = equationStr.replace('@{essence}', isNaN(essence) ? 1 : essence);
        equationStr = equationStr.replace('@{committedesstotal}', isNaN(committedesstotal) ? 0 : committedesstotal);
        let pattern = /[^0-9\(\)\+\-\*\/\.]/g;
        equationStr = equationStr.replace(pattern, '');
        let calculatedMax = eval(equationStr);
        logger(`updateMaxAttr::equationStr=${equationStr}, essence=${essence}, calculatedMax=${calculatedMax}`);
        if (isNaN(calculatedMax)) {
            logger('updateMaxAttr::ERROR IN FORMULA => setting to 0');
            calculatedMax = 0;
        }
        attr.set('max', calculatedMax);
        return calculatedMax;
    },

    createDecisiveAbilities = (cmdDetails, selected) => {
        logger(`createDecisiveAbilities::createDecisiveAbilities cmdDetails=${JSON.stringify(cmdDetails)}, selected=${JSON.stringify(selected)}`);

        _.chain(selected)
        .map(o => getObj('graphic',o._id))
        .compact()
        .each(function(t){
            let finalcharacterObj = getObj('character',t.get('represents')),
                finalcharacterId  = finalcharacterObj.get('id'),
                abilities         = findObjs({type:'ability',characterid:finalcharacterId}),
                expectedAbilities = {
                    dd:false,
                    ddGm:false
                },
                abilityTemplates  = {
                    dd:{
                        name:          'HLP-Decisive-Damage',
                        description:   'Exalted HLP Decisive Ability:dd',
                        characterid:   finalcharacterId,
                        action:        '/em confirme son attaque Decisive et inflige :\n!exr @{tracker|'+t.get('name')+'}# ?{Type de Jet|Jet Standard,-D|Custom Roll,?{Commande a Ajouter :&#125;}\n/r 3[RESETING INIT] &{tracker}',
                        istokenaction: true
                    },
                    ddGm:{
                        name:          'HLP-Decisive-Damage-ToGM',
                        description:   'Exalted HLP Decisive Ability:ddGm',
                        characterid:   finalcharacterId,
                        action:        '/w gm @{character_name} confirme son attaque Decisive et inflige :\n!exr @{tracker|'+t.get('name')+'}# ?{Type de Jet|Jet Standard,-D|Custom Roll,?{Commande a Ajouter :&#125;} -gm\n/gr 3[RESETING INIT] &{tracker}',
                        istokenaction: true
                    }
                };
            _.each(abilities,(abi)=>{
                abi.get('description').replace(/^Exalted HLP Decisive Ability:(.+)/,(match,keyword)=>{
                    expectedAbilities[keyword]=true;
                });
            });
            _.each(_.keys(expectedAbilities),(key)=>{
                if (!expectedAbilities[key]){
                    logger(LOGLEVEL.INFO, 'createDecisiveAbilities:: Creating Ability:"'+abilityTemplates[key].name+'" for token named "'+t.get('name')+'"');
                    createObj('ability',abilityTemplates[key]);
                } else {
                    let finalAbi = findObjs({type:'ability',characterid:finalcharacterId, description:`Exalted HLP Decisive Ability:${key}`})[0];
                    if (!finalAbi) logger(LOGLEVEL.ALERT, 'ABILITY PRESENT BUT NOT FOUND !?!?');
                    logger(LOGLEVEL.INFO, 'createDecisiveAbilities:: Setting Ability:"'+abilityTemplates[key].name+'" for token named "'+t.get('name')+'"');
                    finalAbi.set(abilityTemplates[key]);
                }
            });
        });
    },

    toggleTokenVision = (cmdDetails, selected) => {
        logger(LOGLEVEL.INFO, `toggleTokenVision::toggleTokenVision cmdDetails=${JSON.stringify(cmdDetails)} selected=${JSON.stringify(selected)}`);

        _.chain(selected)
        .map(o => getObj('graphic',o._id))
        .compact()
        .each(function(t){
            var valLight = t.get('has_bright_light_vision');
            logger('toggleTokenVision::FOREACH SELECTED t.get(\'has_bright_light_vision\')=' + JSON.stringify(valLight));
            t.set({'has_bright_light_vision': !valLight, 'has_night_vision': !valLight});
        });
    },

    addOnslaughtToPlayer = (cmdDetails, selected) => {
        logger('addOnslaughtToPlayer::addOnslaughtToPlayer cmdDetails=' + JSON.stringify(cmdDetails));

        let turnorder   = getTurnorder();
        if (!turnorder.length) {
            logger(LOGLEVEL.INFO, 'addOnslaughtToPlayer::No Turn Order1 = QUITTING');
            return;
        }
        let currentTurn = turnorder.shift();
        if (!currentTurn) {
            logger(LOGLEVEL.INFO, 'addOnslaughtToPlayer::No Turn Order2 = QUITTING');
            return;
        }

        let tokenNameArray = [];
        _.chain(selected)
        .map(o => getObj('graphic',o._id))
        .compact()
        .each(function(t){
            var finalcharacterObj = getObj('character',t.get('represents'));
            if (finalcharacterObj) {
                let currentOnslaught = parseInt(getAttrByName(finalcharacterObj.get('id'), 'onslaught', 'current'));
                currentOnslaught = isNaN(currentOnslaught) ? 1 : currentOnslaught + 1;
                setAttrs(finalcharacterObj.get('id'), {'onslaught':currentOnslaught});
                if (t.get('layer') == 'objects' && !(getObj('character', t.get('represents')).get('name').includes('Vision'))) {
                    let imgurl = t.get('imgsrc');
                    let image  = (imgurl) ? '<img src="'+imgurl+'" width="50px" height="50px" />' : '';
                    tokenNameArray.push({name: t.get('name'), image: image});
                }
            }
        });

        if (tokenNameArray.length) {
            let images = tokenNameArray.map(i => i.image).join(),
                name_list = tokenNameArray.map(i => '<b>'+i.name+'</b>').join(', ').replace(/, ([^,]*)$/, ' and $1');
            logger(LOGLEVEL.INFO, `addOnslaughtToPlayer:: Add Onslaught to Player${tokenNameArray.length > 1 ? 's' : ''}:${JSON.stringify(tokenNameArray.map(i => i.name))}`);
            sendStandardScriptMessage(name_list+' ' + ((tokenNameArray.length == 1) ? 'get' : 'got') + ' 1 point of onslaught from the attack', images, false);
        }
    },

    resetOnslaught = (tokenObj) => {
        logger('resetOnslaught::resetOnslaught');
        let characterObj = getObj('character', tokenObj.get('represents'));
        logger(LOGLEVEL.INFO, 'resetOnslaught:: characterObj=' + JSON.stringify(characterObj));
        if (characterObj) setAttrs(characterObj.get('id'), {'onslaught':0});
    },

    //*************************************************************************************************************
    //MENUS
    //*************************************************************************************************************

    sendMainMenu = (who) => {
        logger('Send Main Menu');

        let nextButton          = makeImageButton('!cmaster --turn,next',nextImage,'Next Turn','transparent',18);
        let prevButton          = makeImageButton('!cmaster --turn,previous',prevImage,'Previous Turn','transparent',18);
        let stopButton          = makeImageButton('!cmaster --turn,stop --main',stopImage,'Stop Combat','transparent',18);
        let holdButton          = makeImageButton('!cmaster --turn,hold',holdImage,'Hold Combat','transparent',18);
        let startButton         = makeImageButton('!cmaster --turn,start --main',startImage,'Start Combat','transparent',18);
        let pauseTimerButton    = makeImageButton('!cmaster --turn,timer=pause',pauseImage,'Pause Timer','transparent',18);
        let stopTimerButton     = makeImageButton('!cmaster --turn,timer=stop',timerImage,'Stop Timer','transparent',18);
        let configButton        = makeImageButton('!cmaster --show,setup',backImage,'Show Setup','transparent',18);
        let showButton          = makeImageButton('!cmaster --show,assigned',showImage,'Show Conditions','transparent',18);
        let sortButton          = makeImageButton('!cmaster --turn,sort',sortImage,'Sort Turnorder','transparent',18);
        let helpButton;

        if (state[combatState].config.hold.held)
            helpButton          = makeImageButton('!cmaster --help,held',helpImage,'Help','transparent',18,'white');
        else if (inFight())
            helpButton          = makeImageButton('!cmaster --help,started',helpImage,'Help','transparent',18,'white');
        else
            helpButton          = makeImageButton('!cmaster --help,stopped',helpImage,'Help','transparent',18,'white');

        let listItems           = [];
        let titleText           = 'CombatMaster Menu<span style="'+styles.version+'"> ('+version+')</span>'+'<span style='+styles.buttonRight+'>'+helpButton+'</span>';
        let contents, key, condition, conditions, conditionButton, addButton, removeButton, favoriteButton, listContents, rowCount=1;

        if (state[combatState].config.hold.held)
            contents = '<div style="background-color:yellow">'+startButton;
        else if (inFight())
            contents = '<div style="background-color:green;width:100%;padding:2px;vertical-align:middle">'+stopButton + holdButton + prevButton + nextButton + pauseTimerButton + stopTimerButton + showButton + sortButton;
        else
            contents = '<div style="background-color:red">'+startButton;

        contents += configButton;
        contents += '</div>';

        conditions = sortObject(state[combatState].config.conditions);
        for (key in conditions) {
            condition       = getConditionByKey(key);

            let installed = verifyInstalls(condition.iconType);
            if (!installed) return;
            conditionButton = makeImageButton('!cmaster --show,condition='+key,backImage,'Edit Condition','transparent',12);
            removeButton    = makeImageButton('!cmaster --remove,condition='+key,deleteImage,'Remove Condition','transparent',12);

            if (condition.override) {
                if (state[combatState].config.status.useMessage)
                    addButton = makeImageButton('!cmaster --add,condition='+key +',duration=?{Duration|'+condition.duration+'},direction=?{Direction|'+condition.direction + '},message=?{Message}',addImage,'Add Condition','transparent',12);
                else
                    addButton = makeImageButton('!cmaster --add,condition='+key +',duration=?{Duration|'+condition.duration+'},direction=?{Direction|'+condition.direction + '}',addImage,'Add Condition','transparent',12);
            } else {
                if (state[combatState].config.status.useMessage)
                    addButton = makeImageButton('!cmaster --add,condition='+key+',duration='+condition.duration+',direction='+condition.direction+',message='+condition.message,addImage,'Add Condition','transparent',12);
                else
                    addButton = makeImageButton('!cmaster --add,condition='+key+',duration='+condition.duration+',direction='+condition.direction,addImage,'Add Condition','transparent',12);
            }

            if (condition.favorite)
                favoriteButton = makeImageButton('!cmaster --config,condition='+key+',key=favorite,value='+!condition.favorite+' --tracker',favoriteImage,'Remove from Favorites','transparent',12);
            else
                favoriteButton = makeImageButton('!cmaster --config,condition='+key+',key=favorite,value='+!condition.favorite+' --tracker',allConditionsImage,'Add to Favorites','transparent',12);

			if (rowCount == 1) {
                listContents = '<div>';
                rowCount = 2;
			} else {
                listContents = '<div style='+styles.background+'>';
                rowCount = 1;
			}
            listContents += getDefaultIcon(condition.iconType,condition.icon,'display:inline-block;margin-right:3px');
            listContents += '<span style="vertical-align:middle">'+condition.name+'</span>';
            if (state[combatState].config.status.userChanges && who != 'gm')
                listContents += '<span style="float:right;vertical-align:middle">'+addButton+removeButton+'</span>';
            else
                listContents += '<span style="float:right;vertical-align:middle">'+addButton+removeButton+favoriteButton+conditionButton+'</span>';
            listContents += '</div>';

            if (state[combatState].config.status.showConditions == 'favorites'  && condition.favorite)
                listItems.push(listContents);
            if (state[combatState].config.status.showConditions == 'conditions' && condition.type == 'Condition')
                listItems.push(listContents);
            if (state[combatState].config.status.showConditions == 'spells'     && condition.type == 'Spell')
                listItems.push(listContents);
            if (state[combatState].config.status.showConditions == 'all')
                listItems.push(listContents);
        }

        let viewButton = makeBigButton('Change View', '!cmaster --show,view,value=?{View|All,all|Conditions,conditions|Spells,spells|Favorites,favorites} --main');

        state[combatState].config.previousPage = 'main';

        if (state[combatState].config.status.access && who != 'None' && who != 'gm') {
            let playerIDs = state[combatState].config.status.access.split(',');
            playerIDs.forEach((player) => {
                makeAndSendMenu(contents+makeList(listItems)+viewButton,titleText,player);
            });
        }

        if (who == 'gm' || who == 'None')
            makeAndSendMenu(contents+makeList(listItems)+viewButton,titleText,'gm');
        else
            makeAndSendMenu(makeList(listItems)+viewButton,titleText,who);
    },

    sortObject = (obj) => {
        return Object.keys(obj).sort().reduce(function (result, key) {
            result[key] = obj[key];
            return result;
        }, {});
    },

    sendConfigMenu = () => {
		let configIntiativeButton       = makeBigButton('Initiative',           '!cmaster --show,initiative');
        let configTurnorderButton       = makeBigButton('Turnorder',            '!cmaster --show,turnorder');
		let	configTimerButton           = makeBigButton('Timer',                '!cmaster --show,timer');
		let	configAnnouncementsButton   = makeBigButton('Announce',             '!cmaster --show,announce');
		let	configMacroButton           = makeBigButton('Macro & API',          '!cmaster --show,macro');
		let	configConcentrationButton   = makeBigButton('Concentration',        '!cmaster --show,concentration');
		let	configStatusButton          = makeBigButton('Status',               '!cmaster --show,status');
		let	configConditionButton       = makeBigButton('Conditions',           '!cmaster --show,conditions');
		let	exportButton                = makeBigButton('Export',               '!cmaster --show,export');
		let	importButton                = makeBigButton('Import',               '!cmaster --import,config=?{Config}');
		let	resetButton                 = makeBigButton('Reset',                '!cmaster --reset');
		let	ignoreButton                = makeBigButton('Remove Ignores',       '!cmaster --ignore');
		let	clearButton                 = makeBigButton('Clear Token Statuses', '!cmaster --clear');
		let	backToTrackerButton         = makeBigButton('Back',                 '!cmaster --back,tracker');
		let helpButton                  = makeImageButton('!cmaster --help,setup',helpImage,'Help','transparent',18,'white');
		let	titleText                   = 'Setup'+'<span style='+styles.buttonRight+'>'+helpButton+'</span>';
		let	combatHeaderText            = '<div style="'+styles.header+'">Combat Setup</div>';
		let	statusHeadersText           = '<div style="'+styles.header+'">Status Setup</div>';
		let	resetHeaderText             = '<div style="'+styles.header+'">Reset CombatMaster</div>';
		let	backToTrackerText           = '<div style="'+styles.header+'">Return</div>';
		let contents;

        contents  = combatHeaderText;
		contents += configIntiativeButton;
		contents += configTurnorderButton;
		contents += configTimerButton;
		contents += configAnnouncementsButton;
		contents += configMacroButton;
		contents += statusHeadersText;
		contents += configStatusButton;
		contents += configConditionButton;
		contents += configConcentrationButton;
		contents += exportButton;
		contents += importButton;
		contents += resetHeaderText;
		contents += resetButton;
		contents += ignoreButton;
		contents += clearButton;
        contents += backToTrackerText;
        contents += backToTrackerButton;

        makeAndSendMenu(contents, titleText, 'gm');
    },

    sendInitiativeMenu = () => {
        const banner = makeBanner('initiative','Initiative','setup');
        let listItems  = [];
        let initiative = state[combatState].config.initiative;

		listItems.push(makeTextButton('Roll Initiative', initiative.rollInitiative, '!cmaster --config,initiative,key=rollInitiative,value=?{Initiative|None,None|CombatMaster,CombatMaster|Group-Init,Group-Init} --show,initiative'));
        listItems.push(makeTextButton('Roll Each Round', initiative.rollEachRound,  '!cmaster --config,initiative,key=rollEachRound,value='+!initiative.rollEachRound + ' --show,initiative'));

        if (initiative.rollInitiative == 'CombatMaster') {
            listItems.push(makeTextButton('Initiative Attr',         initiative.initiativeAttributes, '!cmaster --config,initiative,key=initiativeAttributes,value=?{Attribute|'+initiative.initiativeAttributes+'} --show,initiative'));
            listItems.push(makeTextButton('Initiative Die',          'd' + initiative.initiativeDie,  '!cmaster --config,initiative,key=initiativeDie,value=?{Die (without the d)'+initiative.initiativeDie+'} --show,initiative'));
            listItems.push(makeTextButton('Show Initiative in Chat', initiative.showInitiative,       '!cmaster --config,initiative,key=showInitiative,value='+!initiative.showInitiative + ' --show,initiative'));
        }

		if (initiative.rollInitiative == 'Group-Init') {
			listItems.push(makeTextButton('Target Tokens',           initiative.apiTargetTokens,      '!cmaster --config,initiative,key=apiTargetTokens,value=?{Target Tokens|} --show,initiative'));
            if (!initiative.apiTargetTokens > '') listItems.push('<div>'+initiative.apiTargetTokens+'</div>');
		}

        makeAndSendMenu(makeList(listItems,banner.backButton),banner.titleText,'gm');
    },

	sendTurnorderMenu = () => {
        const banner = makeBanner('turnorder','Turnorder','setup');
        let listItems = [];
        let turnorder = state[combatState].config.turnorder;

        let installed;
        installed = verifyInstalls(turnorder.nextMarkerType);
        if (!installed) return;
        installed = verifyInstalls(turnorder.markerType);
        if (!installed) return;
		listItems.push(makeTextButton('Sort Turnorder',              turnorder.sortTurnOrder,                               '!cmaster --config,turnorder,key=sortTurnOrder,value='+!turnorder.sortTurnOrder + ' --show,turnorder'));
        listItems.push(makeTextButton('Center Map on Token',         turnorder.centerToken,                                 '!cmaster --config,turnorder,key=centerToken,value='+!turnorder.centerToken + ' --show,turnorder'));
        listItems.push(makeTextButton('Add Motes to Exalteds',       turnorder.addMotesEachTurnToNonMortal,                 '!cmaster --config,turnorder,key=addMotesEachTurnToNonMortal,value='+!turnorder.addMotesEachTurnToNonMortal + ' --show,turnorder'));
        listItems.push(makeTextButton('Mote qty to add to Exalteds', turnorder.moteQtyToAdd,                                '!cmaster --config,turnorder,key=moteQtyToAdd,value=?{Quantity ?|5} --show,turnorder'));

        listItems.push(makeTextButton('Use Marker',                  turnorder.useMarker,                                   '!cmaster --config,turnorder,key=useMarker,value='+!turnorder.useMarker + ' --show,turnorder'));
        listItems.push(makeTextButton('Marker Type',                 turnorder.markerType,                                  '!cmaster --config,turnorder,key=markerType,value=?{Marker Type|External URL,External URL|Token Marker,Token Marker|Token Condition,Token Condition} --show,turnorder'));
        if      (turnorder.markerType == 'External URL')
            listItems.push(makeTextButton('Marker',                 makeImageButtonHtml(turnorder.externalMarkerURL),       '!cmaster --config,turnorder,key=externalMarkerURL,value=?{Image Url} --show,turnorder'));
        else if (turnorder.markerType == 'Token Marker')	{
            listItems.push(makeTextButton('Marker Name',            turnorder.tokenMarkerName,                              '!cmaster --config,turnorder,key=tokenMarkerName,value=?{Marker Name|} --show,turnorder'));
            listItems.push(getDefaultIcon('Token Marker',turnorder.tokenMarkerName));
		}

		listItems.push(makeTextButton('Use Next Marker',            turnorder.nextMarkerType,                               '!cmaster --config,turnorder,key=nextMarkerType,value=?{Next Marker Type|None,None|External URL,External URL|Token Marker,Token Marker|Token Condition,Token Condition} --show,turnorder'));
		if      (turnorder.nextMarkerType == 'External URL')
            listItems.push(makeTextButton('Next Marker',            makeImageButtonHtml(turnorder.nextExternalMarkerURL),   '!cmaster --config,turnorder,key=nextExternalMarkerURL,value=?{Image Url} --show,turnorder'));
		else if (turnorder.nextMarkerType == 'Token Marker')	{
            listItems.push(makeTextButton('Next Marker Name',       turnorder.nextTokenMarkerName,                          '!cmaster --config,turnorder,key=nextTokenMarkerName,value=?{Next Marker Name|} --show,turnorder'));
            listItems.push(getDefaultIcon('Token Marker', turnorder.nextTokenMarkerName));
		}
        listItems.push(makeTextButton('Marker Size',                turnorder.markerSize,                                   '!cmaster --config,turnorder,key=markerSize,value=?{Marker Size (2.1 default)} --show,turnorder'));

        listItems.push(makeTextButton('Use Range Marker',           turnorder.useRangeMarker,                               '!cmaster --config,turnorder,key=useRangeMarker,value=?{Next Marker Type|None,None|External URL,External URL} --show,turnorder')); // |Token Marker,Token Marker|Token Condition,Token Condition
		if      (turnorder.useRangeMarker == 'External URL')
            listItems.push(makeTextButton('Range Marker',           makeImageButtonHtml(turnorder.rangeExternalMarkerURL),  '!cmaster --config,turnorder,key=rangeExternalMarkerURL,value=?{Image Url} --show,turnorder'));
		else if (turnorder.useRangeMarker == 'Token Marker')
            logger('balec'); //LEGACYTODO: a voir plus tard > ????
        listItems.push(makeTextButton('Range Marker Width',         turnorder.rangeMarkerWidth,                             '!cmaster --config,turnorder,key=rangeMarkerWidth,value=?{Marker Size (6000 default (px))} --show,turnorder'));
        listItems.push(makeTextButton('Range Marker Size',          turnorder.rangeMarkerHeight,                            '!cmaster --config,turnorder,key=rangeMarkerHeight,value=?{Marker Size (6000 default (px))} --show,turnorder'));

        listItems.push(makeTextButton('Animate Marker',             turnorder.animateMarker,                                '!cmaster --config,turnorder,key=animateMarker,value='+!turnorder.animateMarker + ' --show,turnorder'));
        listItems.push(makeTextButton('Animation Angle Step',       turnorder.animateMarkerDegree,                          '!cmaster --config,turnorder,key=animateMarkerDegree,value=?{Degrees to rotate every tick (1 default)} --show,turnorder'));
        listItems.push(makeTextButton('Animation Angle Wait',       turnorder.animateMarkerWait,                            '!cmaster --config,turnorder,key=animateMarkerWait,value=?{milliseconds per tick (25 default)} --show,turnorder'));

		listItems.push('<div style="margin-top:3px"><i><b>Beginning of Each Round</b></i></div>' );
        listItems.push(makeTextButton('API',                        turnorder.roundAPI,                                     '!cmaster --config,turnorder,key=roundAPI,value={{?{API Command|}}} --show,turnorder'));
        listItems.push(makeTextButton('Roll20AM',                   turnorder.roundRoll20AM,                                '!cmaster --config,turnorder,key=roundRoll20AM,value={{?{Roll20AM Command|}}} --show,turnorder'));
        listItems.push(makeTextButton('FX',                         turnorder.roundFX,                                      '!cmaster --config,turnorder,key=roundFX,value=?{FX Command|} --show,turnorder'));
        listItems.push(makeTextButton('Characters Macro',           turnorder.characterRoundMacro,                          '!cmaster --config,turnorder,key=characterRoundMacro,value=?{Macro Name|} --show,turnorder'));
        listItems.push(makeTextButton('All Tokens Macro',           turnorder.allRoundMacro,                                '!cmaster --config,turnorder,key=allRoundMacro,value=?{Macro Name|} --show,turnorder'));

		listItems.push('<div style="margin-top:3px"><i><b>Beginning of Each Turn</b></i></div>' );
        listItems.push(makeTextButton('API',                        turnorder.turnAPI,                                      '!cmaster --config,turnorder,key=turnAPI,value={{?{API Command|}}} --show,turnorder'));
        listItems.push(makeTextButton('Roll20AM',                   turnorder.turnRoll20AM,                                 '!cmaster --config,turnorder,key=turnRoll20AM,value={{?{Roll20AM Command|}}} --show,turnorder'));
        listItems.push(makeTextButton('FX',                         turnorder.turnFX,                                       '!cmaster --config,turnorder,key=turnFX,value=?{FX Command|} --show,turnorder'));
        listItems.push(makeTextButton('Macro',                      turnorder.turnMacro,                                    '!cmaster --config,turnorder,key=turnMacro,value=?{Macro Name|} --show,turnorder'));

        makeAndSendMenu(makeList(listItems,banner.backButton),banner.titleText,'gm');
    },

    sendTimerMenu = () => {
        const banner = makeBanner('timer','Timer','setup');
        let listItems = [];
        let timer = state[combatState].config.timer;

        listItems.push(makeTextButton('Turn Timer',             timer.useTimer,         '!cmaster --config,timer,key=useTimer,value='+!timer.useTimer + ' --show,timer'));

        if (timer.useTimer) {
            listItems.push(makeTextButton('Time',               timer.time,             '!cmaster --config,timer,key=time,value=?{Time|'+timer.time+'} --show,timer'));
            listItems.push(makeTextButton('Skip Turn',          timer.skipTurn,         '!cmaster --config,timer,key=skipTurn,value='+!timer.skipTurn + ' --show,timer'));
            listItems.push(makeTextButton('Send to Chat',       timer.sendTimerToChat,  '!cmaster --config,timer,key=sendTimerToChat,value='+!timer.sendTimerToChat + ' --show,timer'));
            listItems.push(makeTextButton('Show on Token',      timer.showTokenTimer,   '!cmaster --config,timer,key=showTokenTimer,value='+!timer.showTokenTimer + ' --show,timer'));
            listItems.push(makeTextButton('Token Font',         timer.timerFont,        '!cmaster --config,timer,key=timerFont,value=?{Font|Arial|Patrick Hand|Contrail|Light|Candal} --show,timer'));
            listItems.push(makeTextButton('Token Font Size',    timer.timerFontSize,    '!cmaster --config,timer,key=timerFontSize,value=?{Font Size|'+timer.timerFontSize+'} --show,timer'));
        }

        makeAndSendMenu(makeList(listItems,banner.backButton),banner.titleText,'gm');
    },

    sendAnnounceMenu = () => {
        const banner = makeBanner('announcements','Announcements','setup');
		let	announcements = state[combatState].config.announcements;

		let	listItems = [
				makeTextButton('Announce Rounds',       announcements.announceRound,     '!cmaster --config,announcements,key=announceRound,value='+!announcements.announceRound + ' --show,announce'),
				makeTextButton('Announce Turns',        announcements.announceTurn,      '!cmaster --config,announcements,key=announceTurn,value='+!announcements.announceTurn + ' --show,announce'),
				makeTextButton('Whisper GM Only',       announcements.whisperToGM,       '!cmaster --config,announcements,key=whisperToGM,value='+!announcements.whisperToGM + ' --show,announce'),
				makeTextButton('Shorten Long Names',    announcements.handleLongName,    '!cmaster --config,announcements,key=handleLongName,value='+!announcements.handleLongName + ' --show,announce'),
                makeTextButton('Show NPC Conditions',   announcements.showNPCTurns,      '!cmaster --config,announcements,key=showNPCTurns,value='+!announcements.showNPCTurns + ' --show,announce'),
                makeTextButton('Announce Mote Regen',   announcements.announceMoteRegen, '!cmaster --config,announcements,key=announceMoteRegen,value='+!announcements.announceMoteRegen + ' --show,announce'),
			];

		makeAndSendMenu(makeList(listItems,banner.backButton),banner.titleText,'gm');
    },

	sendMacroMenu = () => {
        const banner = makeBanner('macro','Macro & API','setup');
        let addButton = makeBigButton('Add Substiution', '!cmaster --new,macro,type=?{Type|CharID,CharID|CharName,CharName|TokenID,TokenID|PlayerID,PlayerID},action=?{Action|}');
        let substitutions = state[combatState].config.macro.substitutions;
        let listItems=[],deleteButton,listContents;

        substitutions.forEach((substitution) => {
            deleteButton = makeImageButton('!cmaster --delete,macro,action='+substitution.action,deleteImage,'Delete Substitution','transparent',12);

            listContents ='<div>';
            listContents +='<span style="vertical-align:middle">'+substitution.type+ '-'+substitution.action+'</span>';
            listContents +='<span style="float:right;vertical-align:middle">'+deleteButton+'</span>';
            listContents +='</div>';

            listItems.push(listContents);
        });

        makeAndSendMenu(addButton+makeList(listItems,banner.backButton),banner.titleText,'gm');
	},

	sendStatusMenu = () => {
        const banner = makeBanner('status','Status','setup');
        let	status = state[combatState].config.status;

        let listItems = [
				makeTextButton('Whisper GM Only',           status.sendOnlyToGM,    '!cmaster --config,status,key=sendOnlyToGM,value='+!status.sendOnlyToGM+' --show,status'),
				makeTextButton('Player Allowed Changes',    status.userChanges,     '!cmaster --config,status,key=userChanges,value='+!status.userChanges+' --show,status'),
				makeTextButton('Send Changes to Chat',      status.sendConditions,  '!cmaster --config,status,key=sendConditions,value='+!status.sendConditions+' --show,status'),
				makeTextButton('Clear Conditions on Close', status.clearConditions, '!cmaster --config,status,key=clearConditions,value='+!status.clearConditions + ' --show,status'),
				makeTextButton('Use Messages',              status.useMessage,      '!cmaster --config,status,key=useMessage,value='+!status.useMessage + ' --show,status'),
				makeTextButton('Auto Add Spells',           status.autoAddSpells,   '!cmaster --config,status,key=autoAddSpells,value='+!status.autoAddSpells+' --show,status'),
		];

        if (status.autoAddSpells)
            listItems.push(makeTextButton('Sheet',          status.sheet,           '!cmaster --config,status,key=sheet,value=?{Sheet|D&D5E OGL,OGL|D&D5E Shaped,Shaped|PF2,PF2|} --show,status'));
		makeAndSendMenu(makeList(listItems,banner.backButton),banner.titleText,'gm');
	},

	sendConcentrationMenu = () => {
        const banner = makeBanner('concentration','Concentration','setup');
        let	concentration = state[combatState].config.concentration;
        let listItems = [];

		listItems.push(makeTextButton('Use Concentration (5E)', concentration.useConcentration, '!cmaster --config,concentration,key=useConcentration,value='+!concentration.useConcentration + ' --show,concentration'));

		if (concentration.useConcentration) {
            listItems.push(makeTextButton('Add Marker',         concentration.autoAdd,          '!cmaster --config,concentration,key=autoAdd,value='+!concentration.autoAdd+' --show,concentration'));
            listItems.push(makeTextButton('Check for Save',     concentration.autoRoll,         '!cmaster --config,concentration,key=autoRoll,value='+!concentration.autoRoll+' --show,concentration'));
            listItems.push(makeTextButton('Notify',             concentration.notify,           '!cmaster --config,concentration,key=notify,value=?{Notify|Everyone,Everyone|Character,Character|GM,GM} --show,concentration'));
        }

		if (concentration.autoRoll) {
            listItems.push(makeTextButton('Wound Bar',          concentration.woundBar,         '!cmaster --config,concentration,key=woundBar,value=?{Wound Bar|Bar1,bar1|Bar2,bar2|Bar3,bar3} --show,concentration'));
            listItems.push(makeTextButton('Attribute',          concentration.attribute,        '!cmaster --config,concentration,key=attribute,value=?{Attribute|} --show,concentration'));

		}

		makeAndSendMenu(makeList(listItems,banner.backButton),banner.titleText,'gm');
	},

    sendConditionsMenu = (message) => {
        let key, condition, conditionButton,
        // favorite, icon, output,
        rowCount=1;
        let backButton = makeBigButton('Back',          '!cmaster --back,setup');
		let	addButton  = makeBigButton('Add Condition', '!cmaster --new,condition=?{Name}');
        let helpButton = makeImageButton('!cmaster --help,conditions',helpImage,'Help','transparent',18,'white');
        let	titleText  = 'Conditions Setup'+'<span style='+styles.buttonRight+'>'+helpButton+'</span>';
		let	listItems = [];
		let	listContents;
        let icons = [];
        let check = true;

        for (key in state[combatState].config.conditions) {
            condition       = getConditionByKey(key);
            if (!verifyInstalls(condition.iconType)) return;

			conditionButton = makeImageButton('!cmaster --show,condition=' + key,backImage,'Edit Condition','transparent',12);

			if (rowCount == 1) {
                listContents = '<div>';
                rowCount = 2;
			} else {
                listContents = '<div style='+styles.background+'>';
                rowCount = 1;
			}

            listContents += getDefaultIcon(condition.iconType,condition.icon,'display:inline-block;margin-right:3px');
            listContents += '<span style="vertical-align:middle">'+condition.name+'</span>';
            listContents += '<span style="float:right;vertical-align:middle">'+conditionButton+'</span>';
            listContents += '</div>';

            listItems.push(listContents);

            if (check && icons.includes(condition.icon)){
                message || (message = '' + '<br>Multiple conditions use the same icon');
                check = false;
            }
        }

        message = (message) ? '<p style="color: red">'+message+'</p>' : '';
        let contents = message + makeList(listItems, backButton, addButton);

        state[combatState].config.previousPage = 'conditions';
        makeAndSendMenu(contents,titleText,'gm');
    },

    sendConditionMenu = (key) => {
        let condition  = state[combatState].config.conditions[key];
        let listItems = [];
        // let markerDropdown = '';
        let helpButton = makeImageButton('!cmaster --help,condition',helpImage,'Help','transparent',18,'white');
        let	titleText  = 'Condition Setup'+'<span style='+styles.buttonRight+'>'+helpButton+'</span>';

        if (typeof condition.description == 'undefined') condition.description = ' ';
        let removeButton        = makeBigButton('Delete Condition', '!cmaster --delete,condition='+key+',confirm=?{Are you sure?|Yes,yes|No,no}');
		let descriptionButton   = makeBigButton('Edit Description', '!cmaster --config,condition='+key+',key=description,value={{?{Description|'+condition.description+'}}} --show,condition='+key);
		let backButton          = makeBigButton('Back',             '!cmaster --back');

		listItems.push(makeTextButton('Name',             condition.name,                            '!cmaster --config,condition='+key+',key=name,value=?{Name}'));
		listItems.push(makeTextButton('Type',             condition.type,                            '!cmaster --config,condition='+key+',key=type,value=?{Type|Condition,Condition|Spell,Spell} --show,condition='+key));
		listItems.push(makeTextButton('Icon Type',        condition.iconType,                        '!cmaster --config,condition='+key+',key=iconType,value=?{Icon Type|Combat Master,Combat Master|Token Marker,Token Marker|Token Condition,Token Condition} --show,condition='+key));

        if (!verifyInstalls(condition.iconType)) return;

        if (condition.iconType == 'Token Condition')
            listItems.push(makeTextButton('Icon', condition.icon,                                    '!cmaster --config,condition='+key+',key=icon,value=?{Token Condition|} --show,condition='+key));
        else
            listItems.push(makeTextButton('Icon', getDefaultIcon(condition.iconType,condition.icon), '!cmaster --config,condition='+key+',key=icon,value='+buildMarkerDropdown(condition.iconType)+' --show,condition='+key));

		listItems.push(makeTextButton('Duration',         condition.duration,                        '!cmaster --config,condition='+key+',key=duration,value=?{Duration|1} --show,condition='+key));
		listItems.push(makeTextButton('Direction',        condition.direction,                       '!cmaster --config,condition='+key+',key=direction,value=?{Direction|0} --show,condition='+key));
		listItems.push(makeTextButton('Override',         condition.override,                        '!cmaster --config,condition='+key+',key=override,value='+!condition.override+' --show,condition='+key));
		listItems.push(makeTextButton('Favorites',        condition.favorite,                        '!cmaster --config,condition='+key+',key=favorite,value='+!condition.favorite+' --show,condition='+key));
		listItems.push(makeTextButton('Message',          condition.message,                         '!cmaster --config,condition='+key+',key=message,value={{?{Message}}} --show,condition='+key));
        listItems.push(makeTextButton('Targeted',         condition.targeted,                        '!cmaster --config,condition='+key+',key=targeted,value='+!condition.targeted+' --show,condition='+key));
        if (condition.targeted)
            listItems.push(makeTextButton('Targeted API', condition.targetedAPI,                     '!cmaster --config,condition='+key+',key=targetedAPI,value=?{Targeted API|Caster&Targets,casterTargets|Targets(Only),targets} --show,condition='+key));

        listItems.push(makeTextButton('Concentration',    condition.concentration,                   '!cmaster --config,condition='+key+',key=concentration,value='+!condition.concentration+' --show,condition='+key));
        listItems.push('<div style="margin-top:3px"><i><b>Adding Condition</b></i></div>' );
		listItems.push(makeBigButton('Add APIs',    '!cmaster --show,condition='+key+',addAPI'));
        listItems.push('<div style="margin-top:3px"><i><b>Removing Condition</b></i></div>' );
		listItems.push(makeBigButton('Remove APIs', '!cmaster --show,condition='+key+',remAPI'));

		let contents = makeList(listItems)+'<hr>'+descriptionButton+'<b>Description:</b>'+condition.description+removeButton+'<hr>'+backButton;
        makeAndSendMenu(contents,titleText,'gm');
    },

    sendConditionAddAPIMenu = (key) => {
        const banner = makeBanner('addAPI','Add API','condition='+key);
        let listItems = [];
        let condition  = state[combatState].config.conditions[key];

        listItems = [
            makeTextButton('API',              condition.addAPI,             '!cmaster --config,condition='+key+',key=addAPI,value=?{API Command|} --show,condition='+key),
            makeTextButton('Roll20AM',         condition.addRoll20AM,        '!cmaster --config,condition='+key+',key=addRoll20AM,value=?{Roll20AM Command|} --show,condition='+key),
            makeTextButton('FX',               condition.addFX,              '!cmaster --config,condition='+key+',key=addFX,value=?{FX|} --show,condition='+key),
            makeTextButton('Macro',            condition.addMacro,           '!cmaster --config,condition='+key+',key=addMacro,value=?{Macro|} --show,condition='+key),
            makeTextButton('Persistent Macro', condition.addPersistentMacro, '!cmaster --config,condition='+key+',key=addPersistentMacro,value='+!condition.addPersistentMacro+' --show,condition='+key)
		];

		makeAndSendMenu(makeList(listItems,banner.backButton),banner.titleText,'gm');
    },

    sendConditionRemAPIMenu = (key) => {
        const banner = makeBanner('remAPI','Remove API','condition='+key);
        let listItems = [];
        let condition  = state[combatState].config.conditions[key];

        listItems = [
            makeTextButton('API',      condition.remAPI,      '!cmaster --config,condition='+key+',key=remAPI,value=?{API Command|} --show,condition='+key),
            makeTextButton('Roll20AM', condition.remRoll20AM, '!cmaster --config,condition='+key+',key=remRoll20AM,value=?{Roll20AM Command|} --show,condition='+key),
            makeTextButton('FX',       condition.remFX,       '!cmaster --config,condition='+key+',key=remFX,value=?{FX|} --show,condition='+key),
            makeTextButton('Macro',    condition.remMacro,    '!cmaster --config,condition='+key+',key=remMacro,value=?{Macro|} --show,condition='+key)
		];

		makeAndSendMenu(makeList(listItems,banner.backButton),banner.titleText,'gm');
    },

    buildMarkerDropdown = (iconType) => {
        let markerDropdown = '?{Marker';
        if (iconType == 'Combat Master')
            ctMarkers.forEach((marker) => markerDropdown += '|'+ucFirst(marker).replace(/-/g, ' ')+','+marker);
        else if (iconType == 'Token Marker') {
            if (markers.length == 0) markers = getTokenMarkers();
            markers.forEach((marker) => markerDropdown += '|'+marker.name+','+marker.name);
        }
        markerDropdown += '}';

        return markerDropdown;
    },

    showConditions = (selectedTokens) => {
        // let tokenObj, characterObj, target;

        logger('showConditions::showConditions');

        if (selectedTokens)
            selectedTokens.forEach(token => {
                if (token._type == 'graphic' && token._id != getOrCreateMarker().get('id'))
                    announcePlayer(getObj('graphic', token._id), false, false, true);
            });
    },

    importCombatMaster = (config) => {
        let json;
        let backButton = makeBigButton('Back', '!cmaster --back,setup');

        json = JSON.parse(config.replace('config=',''));
        if (['cmaster','cm'].includes(json.command)) {
            state[combatState].config = json;
            state[combatState].conditions = [];
            setDefaults();
            makeAndSendMenu('Current Combat Master detected and imported.' + backButton, 'Import Setup');
        } else if (json.config.command == 'condition') {
            state[combatState].config.conditions = json.conditions;
            setDefaults();
            makeAndSendMenu('Prior Combat Tracker detected and conditions were imported.' + backButton, 'Import Setup');
        }
    },

    exportConditions = () => {
        const banner = makeBanner('export','Export CM','setup');
        makeAndSendMenu('<p>Copy the entire content above and save it on your pc.</p><pre>'+HE(JSON.stringify(state[combatState].config))+'</pre><div>'+banner.backButton+'</div>', banner.titleText);
    },

    targetedCondition = (id, key) => {
        logger('targetedCondition::targetedCondition');

        let condition    = getConditionByKey(key);
        let title        = 'Select Targets';
        let addButton    = makeImageButton('!cmaster --add,target,id='+id+',condition='+key,tagImage,'Targeted Icons','transparent',18,'white');
        title           += '<div style="display:inline-block;float:right;vertical-aligh:middle">'+addButton+'</div>';
        let contents     = 'Select target tokens to assign **' + condition.name + '** and hit the button above when ready';
        makeAndSendMenu(contents,title,'gm');
    },

    targetedSpell = (key) => {
        logger('targetedSpell::targetedSpell');

        let condition    = getConditionByKey(key);
        let title        = 'Select Origin';
        let addButton    = makeImageButton(`!cmaster --add,condition=${key},duration=${condition.duration},direction=${condition.direction}`,tagImage,'Spell Targets','transparent',18,'white');
        title           += '<div style="display:inline-block;float:right;vertical-aligh:middle">'+addButton+'</div>';
        let contents     = 'Select the token to track the duration of **' + condition.name + '** and hit the button above when ready';
        makeAndSendMenu(contents,title,'gm');
    },

    targetedCaster = (key,duration,direction,message) => {
        logger('targetedCaster::targetedCaster');


        let title        = 'Select Caster';
        // let condition    = getConditionByKey(key);
        let addButton    = makeImageButton(`!cmaster --add,condition=${key},duration=${duration},direction=${direction},message=${message}`,tagImage,'Spell Caster','transparent',18,'white');
        title           += '<div style="display:inline-block;float:right;vertical-aligh:middle">'+addButton+'</div>';
        let contents     = 'Select the caster to assign concentration and hit the button above when ready';
        makeAndSendMenu(contents,title,'gm');
    },

    //*************************************************************************************************************
    //SESSION STATE MAINTENANCE
    //*************************************************************************************************************

	editCombatState = (cmdDetails) => {
		if        (cmdDetails.details.initiative)
			state[combatState].config.initiative[cmdDetails.details.key]    = cmdDetails.details.value;
		else if   (cmdDetails.details.timer)
			state[combatState].config.timer[cmdDetails.details.key]         = cmdDetails.details.value;
		else if   (cmdDetails.details.turnorder) {
			if (cmdDetails.details.key === 'initiativeDie') cmdDetails.details.value = parseInt(cmdDetails.details.value);
			state[combatState].config.turnorder[cmdDetails.details.key]     = cmdDetails.details.value;
		} else if (cmdDetails.details.announcements)
			state[combatState].config.announcements[cmdDetails.details.key] = cmdDetails.details.value;
		else if   (cmdDetails.details.status)
			state[combatState].config.status[cmdDetails.details.key]        = cmdDetails.details.value;
		else if   (cmdDetails.details.concentration)
			state[combatState].config.concentration[cmdDetails.details.key] = cmdDetails.details.value;
		else {
            if (cmdDetails.details.key === 'name' && cmdDetails.details.value.replace(/\s/g, '').toLowerCase() !== state[combatState].config.conditions[cmdDetails.details.condition]) {
                state[combatState].config.conditions[cmdDetails.details.value.toLowerCase()] = state[combatState].config.conditions[cmdDetails.details.condition];
                state[combatState].config.conditions[cmdDetails.details.value.toLowerCase()].key = cmdDetails.details.value.toLowerCase();
                state[combatState].config.conditions[cmdDetails.details.value.toLowerCase()].name = cmdDetails.details.value;
                delete state[combatState].config.conditions[cmdDetails.details.condition];
                sendConditionMenu(cmdDetails.details.value.toLowerCase());
            } else {
                // if (cmdDetails.details.key == 'description') {
                //     cmdDetails.details.value = cmdDetails.details.value;
                // }
                state[combatState].config.conditions[cmdDetails.details.condition][cmdDetails.details.key] = cmdDetails.details.value;
            }
		}
	},

	editShowState = (value) => {
		state[combatState].config.status.showConditions = value;
	},

    //*************************************************************************************************************
    //CONDITIONS
    //*************************************************************************************************************

	newCondition = (name, type='Condition', concentration=false, description='None') => {
        logger('Create Condition');

		if (!name)
			sendConditionsMenu('You didn\'t give a condition name, eg. <i>!cmaster --new,condition=Prone</i>.');
		else if (state[combatState].config.conditions[name.toLowerCase()])
			sendConditionsMenu('The condition `'+name+'` already exists.');
		else {
			state[combatState].config.conditions[name.toLowerCase()] = {
				name:               name,
				key:                name.toLowerCase(),
				type:               type,
				icon:               'red',
				iconType:           'Combat Master',
				description:        ' ',
				duration:           1,
				direction:          0,
				message:            'None',
				concentration:      concentration,
				targeted:           false,
				addAPI:             'None',
				addRoll20AM:        'None',
				addFX:              'None',
				addMacro:           'None',
				addPersistentMacro: false,
				remAPI:             'None',
				remRoll20AM:        'None',
				remFX:              'None',
				remMacro:           'None'
			};
            sendConditionMenu(name.toLowerCase());
		}
	},

	deleteCondition = (key, confirm) => {
        logger('deleteCondition::deleteCondition');

		if (confirm === 'yes') {
			if (!key)
				sendConditionsMenu('You didn\'t give a condition name, eg. <i>!cmaster --delete,condition=Prone</i>.');
			else if ( !state[combatState].config.conditions[key])
				sendConditionsMenu('The condition `'+key+'` does\'t exist.');
			else {
				delete state[combatState].config.conditions[key];
				sendConditionsMenu('The condition `'+key+'` is removed.');
			}
		}
		sendConditionsMenu('Condition was deleted');
	},

    getConditionByMarker = (marker) => {
        logger('getConditionByMarker::getConditionByMarker');

        let key;
        for (key in state[combatState].config.conditions)
            if (marker.includes(state[combatState].config.conditions[key].icon))
                return state[combatState].config.conditions[key];
        return false;
    },

    getConditionByKey = key => state[combatState].config.conditions[key],

    getConditions = () => state[combatState].config.conditions,

    // findAssignedCondition = (id, key) => {
    //     return state[combatState].conditions.filter(el => el.key == key && el.id == id);
    // },

    verifyCondition = (token,key) => {
        logger('verifyCondition::verifyCondition');
        let condition  = getConditionByKey(key);

        if (!condition) return true;
        if (typeof condition.direction == 'undefined' || typeof condition.duration == 'undefined') {
			makeAndSendMenu('The condition you are trying to use has not be setup yet', '', 'gm');
			return false;
        }
		if (!key) {
			makeAndSendMenu('No condition name was given.', '', 'gm');
			return false;
		}
		if (!token || !token.length) {
			makeAndSendMenu('No tokens were selected.', '', 'gm');
			return false;
        }
        // if (token == getOrCreateMarker().get('id')) {
        //     return false;
        // }
        // if (token == getOrCreateMarker(true).get('id')) {
        //     return false;
        // }
        return true;
    },

    addCondition = (cmdDetails,selectedTokens,playerID) => {
        logger('addCondition::addCondition');

        // let condition;
        if (selectedTokens)
            selectedTokens.forEach(token => {
                if (token._type == 'graphic')
                    addConditionToToken(getObj(token._type, token._id),cmdDetails.details.condition,cmdDetails.details.duration,cmdDetails.details.direction,cmdDetails.details.message);
            });
        else
            makeAndSendMenu('No tokens were selected.', '', 'gm');
    },

     removeCondition = (cmdDetails,selectedTokens) => {
        logger('removeCondition::removeCondition');

        if (cmdDetails.details.id)
            removeConditionFromToken(getObj('graphic', cmdDetails.details.id), cmdDetails.details.condition, true);
        else if (selectedTokens)
            selectedTokens.forEach(token => {
                if (token._type == 'graphic')
                    removeConditionFromToken(getObj(token._type, token._id),cmdDetails.details.condition, true);
            });
    },

    addConditionToToken = (tokenObj,key,duration,direction,message) => {
        let	defaultCondition = getConditionByKey(key);
        let newCondition = {};

        if (!tokenObj) return;
        logger(`addConditionToToken::addConditionToToken defaultCondition=${JSON.stringify(defaultCondition)}`);

        if (verifyCondition(tokenObj.get("_id"), key)) {
            let remove = removeConditionFromToken(tokenObj, key, false);

            newCondition.id                 = tokenObj.get("_id");
            newCondition.key                = key;
            newCondition.target             = remove.targets;
            newCondition.tokenConditionID   = null;

            if (defaultCondition) {
                newCondition.name               = defaultCondition.name;
                newCondition.icon               = defaultCondition.icon;
                newCondition.iconType           = defaultCondition.iconType;
                newCondition.addMacro           = defaultCondition.addMacro;
                newCondition.addPersistentMacro = defaultCondition.addPersistentMacro;
                newCondition.concentration      = defaultCondition.concentration;
                newCondition.override           = defaultCondition.override;
                newCondition.message            = defaultCondition.message;
                newCondition.type               = defaultCondition.type;
                newCondition.targeted           = defaultCondition.targeted;
                newCondition.targetedAPI        = defaultCondition.targetedAPI;
            } else {
                newCondition.name               = key;
                newCondition.icon               = null;
                newCondition.iconType           = null;
                newCondition.addMacro           = null;
                newCondition.addPersistentMacro = null;
                newCondition.concentration      = false;
                newCondition.override           = false;
                newCondition.message            = null;
                newCondition.type               = 'Condition';
                newCondition.targeted           = false;
                newCondition.targetedAPI        = null;
            }

            if (newCondition.iconType == 'Token Condition') {
                let characterObj = findObjs({name: newCondition.icon, _type: 'character'})[0];
                characterObj.get("defaulttoken", function(defaulttoken) {
                    let newToken  = JSON.parse(defaulttoken);
                    let condition = createObj('graphic', {
                            subtype:    'token',
                            name:       newToken.name,
                            imgsrc:     getCleanImgsrc(newToken.imgsrc),
                            pageid:     tokenObj.get('pageid'),
                            represents: characterObj.id,
                            layer:      tokenObj.get('layer'),
                            left:       tokenObj.get('left'),
                            top:        tokenObj.get('top'),
                            width:      tokenObj.get('width'),
                            height:     tokenObj.get('height')
                        });
                    let result = TokenCondition.AttachConditionToToken(condition.id,tokenObj.id);
                    if (result.success)
                        newCondition.tokenConditionID = condition.id;
                    else
                        logger(LOGLEVEL.CRITICAL, `addConditionToToken::Attach failed. Message: ${result.reason}`);
                });
            }

            newCondition.duration  = parseInt((!duration  && defaultCondition) ? defaultCondition.duration  : duration);
            newCondition.direction = parseInt((!direction && defaultCondition) ? defaultCondition.direction : direction);
            newCondition.message   =          (!message   && defaultCondition) ? defaultCondition.message   : message;

            setTimeout(() => state[combatState].conditions.push(newCondition), 500);

            addMarker(tokenObj, newCondition.iconType, newCondition.icon, newCondition.duration, newCondition.direction, newCondition.key);

            if (newCondition.target.length > 0)
                newCondition.target.forEach((targets) => {
                    if (newCondition.key != 'dead')
                    	addMarker(getObj('graphic', targets),newCondition.iconType,newCondition.icon,newCondition.duration, newCondition.direction, newCondition.key);
                });

            if (!remove.removed) {
                if (state[combatState].config.status.sendConditions && defaultCondition)
                	sendConditionToChat(newCondition.key);
                if (newCondition.targeted)
                	targetedCondition(newCondition.id, key);
                if (newCondition.concentration == true && newCondition.override == true)
                	targetedCaster('concentration',newCondition.duration,newCondition.direction,'Concentrating on ' + newCondition.name);
                if (!newCondition.targeted || (newCondition.targeted && newCondition.targetedAPI == 'casterTargets'))
                	doAddConditionCalls(tokenObj,key);
            }
        }
    },

    getCleanImgsrc =  function (imgsrc) {
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/);
        if (parts) return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
        return;
    },

    removeConditionFromToken = (tokenObj,key,removeAPI) => {
        logger(`removeConditionFromToken::removeConditionFromToken tokenObj=${JSON.stringify(tokenObj)} key=${JSON.stringify(key)} conditions=${JSON.stringify(state[combatState].conditions)}`);

        if (!tokenObj) return;
        let removed = false;
        let targets = [];
        // let target;

        [...state[combatState].conditions].forEach((condition, i) => {
            if (condition.id == tokenObj.get('_id') && condition.key == key) {
                if (condition.hasOwnProperty('target') && condition.target.length > 0) {
                    targets = condition.target;
                    targets.forEach((target, j) => {
                        if (condition.iconType == 'Token Condition')
                            removeTokenCondition(condition.tokenConditionID);
                        else {
                            removeMarker(getObj('graphic', target), condition.iconType, condition.icon);
                            if (condition.targeted && removeAPI)
                                doRemoveConditionCalls(getObj('graphic', target),condition.key);
                        }
                    });
                }

                if (condition.iconType == 'Token Condition')
                    removeTokenCondition(condition.tokenConditionID);
                else
                    removeMarker(tokenObj, condition.iconType, condition.icon);
                if (condition.concentration == true) {
                    let concentration = getConditionByKey('concentration');
                    removeMarker(tokenObj, concentration.iconType, concentration.icon);
                }
                if ((!condition.targeted || (condition.targeted && condition.targetedAPI == 'casterTargets')) && removeAPI)
                    doRemoveConditionCalls(tokenObj,condition.key);

                state[combatState].conditions.splice(i,1);
                removed = true;
            }
        });

        return {removed, targets};
    },

    removeTokenCondition = (id) => {
        logger('Remove Token Condition');

        let conditionToken = findObjs({_id:id,_pageid:Campaign().get("playerpageid"), _type: 'graphic'})[0];
        conditionToken.remove();
    },

    sendConditionToChat = (key) => {
        logger("Send Condition To Chat");


        let condition = getConditionByKey(key);
        if (!condition) return;
        let icon;
        if (['Combat Master','Token Marker'].includes(condition.iconType))
        	icon  = getDefaultIcon(condition.iconType,condition.icon, 'margin-right: 5px; margin-top: 5px; display: inline-block;');
        makeAndSendMenu(condition.description,icon+condition.name,(state[combatState].config.status.sendOnlyToGM) ? 'gm' : '');
    },

    addTargetsToCondition = (selectedTokens,id,key) => {
        logger("Add Targets to Condition");

        if (!selectedTokens || selectedTokens.length == 0) {
            makeAndSendMenu('No tokens selected.  Condition not added',' ', whisper);
            return;
        }
        [...state[combatState].conditions].forEach((condition,i) => {
            if (condition.id == id && condition.key == key) {
                selectedTokens.forEach(token => {
                    state[combatState].conditions[i].target.push(token._id);
                    addMarker(getObj('graphic', token._id), condition.iconType, condition.icon, condition.duration, condition.direction, condition.key);
                    doAddConditionCalls(getObj('graphic', token._id), condition.key);
                });
            }
        });
        makeAndSendMenu('Selected Tokens Added',"Selected Tokens",'gm');
    },

    //*************************************************************************************************************
    //START/STOP COMBAT
    //*************************************************************************************************************

    verifyCombatSetup = (selectedTokens, initiative) => {
        logger('verifyCombatSetup::verifyCombatSetup');
        let turnorder, whisper, characterObj, verified=true, tokenObj;

        if ((!selectedTokens || selectedTokens.length == 0) && !state[combatState].config.hold.held) {
            makeAndSendMenu('No tokens selected.  Combat not started',' ', whisper);
            return false;
        }

        if (initiative.rollInitiative == 'None') {
            turnorder = getTurnorder();
            if (turnorder.length == 0) {
                makeAndSendMenu('Auto Roll Initiative has been set to None and your turn order is currently empty',' ', whisper);
                verified=false;
                return;
            }
        }

        if (initiative.rollInitiative == 'CombatMaster' && !state[combatState].config.hold.held) {
            selectedTokens.forEach(token => {
                if (token._type == 'graphic') {
                    tokenObj = getObj('graphic', token._id);
                    if (tokenObj) {
                        whisper      = (tokenObj.layer == 'gmlayer') ? 'gm ' : '';
                        characterObj = getObj('character', tokenObj.get('represents'));
                        if (!characterObj) makeAndSendMenu('A token was found not assigned to a character sheet',' ', whisper);
                    }
                }
			});
        }

        return verified;
    },

    startCombat = (selectedTokens, who) => {
        logger('startCombat::startCombat');

        let initiative  = state[combatState].config.initiative;
        // let turnorder   = state[combatState].config.turnorder;
        let verified    = verifyCombatSetup(selectedTokens, initiative);
        let hold        = state[combatState].config.hold;

        if (!verified && !hold.held) return;
        Campaign().set('initiativepage', Campaign().get('playerpageid'));
        paused = false;

        if (hold.held)
            restartCombat(hold, who);
        else {
            if      (initiative.rollInitiative == 'CombatMaster')
                rollInitiative(selectedTokens, initiative);
            else if (initiative.rollInitiative == 'Group-Init')
                rollGroupInit(selectedTokens);
            else if (!getTurnorder()) {
                makeAndSendMenu('You must have a populated turnorder before starting Combat Master','');
                return;
            }
        }

        setTimeout(function() {
            sortTurnorder();
            doRoundCalls();
            changeToNextTurn();
        },2000);
    },

    restartCombat = (hold,who) => {
        logger('restartCombat::restartCombat');

        round = hold.round;
        setTurnorder(hold.turnorder);
        state[combatState].conditions = hold.conditions;

        setTimeout(function() {
            clearHold(hold);
            sendMainMenu(who);
        },2000);
    },

    stopCombat = (who) => {
        logger('stopCombat::stopCombat');


        makeAndSendMenu('<span style="font-size: 12pt; font-weight: bold;text-decoration: underline;">End of combat !</span>', ' ', undefined, false);

        Campaign().set({initiativepage:false});
        clearHold(state[combatState].config.hold);

        if (state[combatState].config.status.clearConditions) {
            [...state[combatState].conditions].forEach((condition) => {
                if (condition.id != getOrCreateMarker().get('id'))
                	removeConditionFromToken(getObj('graphic',condition.id), condition.key, true);
            });
        }

        removeMarkers();
        stopTimer();
        stopMarkerAnimation();
        Campaign().set({turnorder:''});
        round = 1;

        setTimeout(() => state[combatState].conditions = [], 2000);
    },

    holdCombat = (who) => {
        logger('holdCombat::holdCombat');

        let hold        = state[combatState].config.hold;
        hold.held       = true;
        hold.turnorder  = getTurnorder();
        hold.round      = round;
        hold.conditions = [...state[combatState].conditions];

        Campaign().set({initiativepage:false,turnorder:''});
        pauseTimer();

        setTimeout(function() {
            state[combatState].conditions = [];
            sendMainMenu(who);
        }, 2000);
    },

    clearHold = (hold) => {
        logger('clearHold::clearHold');

        hold.held = false;
        hold.round = 1;
        hold.turnorder = [];
        hold.conditions = [];
    },

    rollInitiative = (selectedTokens, initiative) => {
        let tokenObj, whisper, initiativeTemp, initiativeRoll, characterObj, initAttributes, initiativeMod, advantageAttrib, initiativeAdv1, initiativeAdv2;

        //loop through selected tokens
        selectedTokens.forEach(token => {
            if (token._type == 'graphic') {
                tokenObj                       = getObj('graphic', token._id);
                if (tokenObj) {
                    characterObj               = getObj('character', tokenObj.get('represents'));

                    if (characterObj) {
                        whisper                = (tokenObj.get('layer') === 'gmlayer') ? 'gm ' : '';
                        initiativeRoll         = (initiative.initiativeDie) ? randomInteger(initiative.initiativeDie) : 0;
                        initAttributes         = initiative.initiativeAttributes.split(',');
                        initiativeMod          = 0;

                        initAttributes.forEach((attributes) => {
                            initiativeTemp     = getAttrByName(characterObj.id,attributes,'current');
                            initiativeMod     += parseFloat(initiativeTemp);
                        });

                        //check for advantage initiative rolling (OGL)
                        advantageAttrib        = getAttrByName(characterObj.id, 'initiative_style', 'current');
                        if (typeof advantageAttrib != 'undefined') { // roll advantage for initiative
                            initiativeAdv1     = (initiative.initiativeDie) ? randomInteger(initiative.initiativeDie) : 0;
                            initiativeAdv2     = (initiative.initiativeDie) ? randomInteger(initiative.initiativeDie) : 0;
                            
                            if (advantageAttrib == '{@{d20},@{d20}}kh1') { // this is the value if in OGL if rolling advantage
                                initiativeRoll = (initiativeAdv1 >= initiativeAdv2) ? initiativeAdv1 : initiativeAdv2;
                                //pass in both values and modifier for display
                                if (initiative.showInitiative) sendInitiativeChat(tokenObj.get('name'),initiativeAdv1,initiativeMod,initiativeAdv2,whisper);
                            } else if (initiative.showInitiative) { // if not rolling advantage, use first roll
                                initiativeRoll = initiativeAdv1;
                                sendInitiativeChat(tokenObj.get('name'),initiativeRoll,initiativeMod,null,whisper);
                            }
                        } else if     (initiative.showInitiative) // if everything else then pass in for display
                             sendInitiativeChat(tokenObj.get('name'),initiativeRoll,initiativeMod,null,whisper);
                        addToTurnorder({id:tokenObj.id,pr:Number.isInteger(initiativeMod+initiativeRoll) ? (initiativeMod+initiativeRoll) : (initiativeMod+initiativeRoll).toFixed(2),custom:'',_pageid:tokenObj.get("pageid")});
                    }
                }
            }
        });

        if (state[combatState].config.turnorder.sortTurnOrder)
            sortTurnorder();
    },

    rollGroupInit = (selectedTokens) => {
        // let giRoll = () => sendChat('',`/w gm <code>GroupInitiative.RollForTokenIDs()</code> is not supported.`);

        if ('undefined' !== typeof GroupInitiative && GroupInitiative.RollForTokenIDs){
			GroupInitiative.RollForTokenIDs(
				(selectedTokens||[]).map(s=>s._id),{manualBonus: 0}
			);
        }
    },

    sendInitiativeChat = (name,rollInit,bonus,rollInit1,whisper) => {
        let contents = '';

        if (rollInit1) {
            contents = '<table style="width: 50%; text-align: left; float: left;"> \
                            <tr> \
                                <th>Modifier</th> \
                                <td>'+bonus+'</td> \
                            </tr> \
                        </table> \
                        <div style="text-align: center"> \
                            <b style="font-size: 14pt;"> \
                                <span style="border: 1px solid green; padding-bottom: 2px; padding-top: 4px;">[['+rollInit+'+'+bonus+']]</span><br><br> \
                            </b> \
                        </div> \
                        <div style="text-align: center"> \
                            <b style="font-size: 10pt;"> \
                                <span style="border: 1px solid red; padding-bottom: 2px; padding-top: 4px;">[['+rollInit1+'+'+bonus+']]</span><br><br> \
                            </b> \
                        </div>';
        } else {
             contents = '<table style="width: 50%; text-align: left; float: left;"> \
                            <tr> \
                                <th>Modifier</th> \
                                <td>'+bonus+'</td> \
                            </tr> \
                        </table> \
                        <div style="text-align: center"> \
                            <b style="font-size: 14pt;"> \
                                <span style="border: 1px solid green; padding-bottom: 2px; padding-top: 4px;">[['+rollInit+'+'+bonus+']]</span><br><br> \
                            </b> \
                        </div>';

        }

        makeAndSendMenu(contents, name + ' Initiative', whisper);
    },

    //*************************************************************************************************************
    //MARKERS
    //*************************************************************************************************************

    addMarker = (tokenObj, markerType, marker, duration, direction, key) => {
        logger(`addMarker::addMarker marker='${marker}'`);

        if (!verifyInstalls(markerType)) {
             makeAndSendMenu('You are missing an API required by an Icon Type you are using.  Install libTokenMarker or TokenConditions.');
             return;
        }

        let icon = getIconTag(markerType, marker);
        if (!icon) return;
        removeMarker(tokenObj, markerType, marker);

        setTimeout(() => {
            let statusMarkers = returnStatusMarkers(tokenObj), statusMarker;
            statusMarker = icon;
            if (!(key == 'dead' || duration <= 0 || duration >= 10 || (duration == 1 && direction == 0)))
                statusMarker += '@'+duration;

            statusMarkers.push(statusMarker);
            tokenObj.set('statusmarkers', statusMarkers.join());
        }, 500);
    },

    removeMarker = (tokenObj, markerType, marker) => {
        logger(`removeMarker::removeMarker marker='${marker}'`);

        let installed = verifyInstalls(markerType);
        if (!installed) {
             makeAndSendMenu('You are missing an API required by an Icon Type you are using.  Install libTokenMarker or TokenConditions.');
             return;
        }

        let iconTag = getIconTag(markerType, marker);
        if (!iconTag) return;
        let statusMarkers = returnStatusMarkers(tokenObj);
        statusMarkers.forEach((a, i) => {
            if (a.indexOf(iconTag) > -1) statusMarkers.splice(i,1);
        });
        tokenObj.set('statusmarkers', statusMarkers.join());
    },

    returnStatusMarkers = (tokenObj) => {
        return tokenObj.get('statusmarkers').split(',');
    },

    resetMarker = (type=markerType.ROUND) => {
        let marker = getOrCreateMarker(type),
            turnorder = state[combatState].config.turnorder;

        logger('resetMarker::resetMarker');


        let markerName, imgUrl, markerWidth, markerHeight, scale_number = findObjs({_id: Campaign().get('playerpageid'), type: 'page'})[0].get('scale_number');
        switch (type) {
            case markerType.ROUND:
                markerName   = 'Round ' + round; imgUrl = getCleanImgsrc(turnorder.externalMarkerURL);
                markerWidth  = 2;                markerHeight = 2; break;
            case markerType.MAIN:
                markerName   = mainMarkerName;   imgUrl = getCleanImgsrc(invisibleImage);
                markerWidth  = 70;               markerHeight = 70; break;
            case markerType.NEXT:
                markerName   = nextMarkerName;   imgUrl = getCleanImgsrc(turnorder.nextExternalMarkerURL);
                markerWidth  = 70;               markerHeight = 70; break;
            case markerType.RANGE:
                markerName   = rangeMarkerName;  imgUrl = getCleanImgsrc(turnorder.rangeExternalMarkerURL);
                markerWidth  = parseInt(turnorder.rangeMarkerWidth / scale_number);
                markerHeight = parseInt(turnorder.rangeMarkerHeight / scale_number); break;
        }

        const newMarkerAttr = {
            name:   markerName,
            imgsrc: imgUrl,
            pageid: Campaign().get('playerpageid'),
            layer:  'gmlayer',
            left:   Math.ceil(markerWidth / 2),
            top:    Math.ceil(markerHeight / 2),
            width:  markerWidth, height: markerHeight
        };
        logger('resetMarker::RESETING MARKER !!! newMarkerAttr=' + JSON.stringify(newMarkerAttr));
        marker.set(newMarkerAttr);

        return marker;
    },

    getOrCreateMarker = (type=markerType.ROUND) => {
        let pageid    = Campaign().get('playerpageid');
		let	turnorder = state[combatState].config.turnorder;

        logger('getOrCreateMarker::getOrCreateMarker type=' + type);

		let markerName, imgsrc, markerLayer, markerWidth, markerHeight, scale_number = findObjs({_id: pageid, type: 'page'})[0].get('scale_number');
        switch (type) {
            case markerType.ROUND:
                markerName  = 'Round 1';        markerLayer = 'objects'; imgsrc = (turnorder.markerType == 'External URL') ? turnorder.externalMarkerURL : turnorder.tokenMarkerURL;
                markerWidth = 2;                markerHeight = 2; break;
            case markerType.MAIN:
                markerName  = mainMarkerName;   markerLayer = 'map';     imgsrc = (turnorder.markerType == 'External URL') ? turnorder.externalMarkerURL : turnorder.tokenMarkerURL;
                markerWidth = 70;               markerHeight = 70; break;
            case markerType.NEXT:
                markerName  = nextMarkerName;   markerLayer = 'map';     imgsrc = (turnorder.markerType == 'External URL') ? turnorder.nextExternalMarkerURL : turnorder.nextTokenMarkerURL;
                markerWidth = 70;               markerHeight = 70; break;
            case markerType.RANGE:
                markerName   = rangeMarkerName; markerLayer = 'map';     imgsrc = turnorder.rangeExternalMarkerURL;
                markerWidth  = parseInt(state[combatState].config.turnorder.rangeMarkerWidth / scale_number);
                markerHeight = parseInt(state[combatState].config.turnorder.rangeMarkerHeight / scale_number);
        }

        logger('getOrCreateMarker::imgsrc=' + imgsrc);
        let markers = (markerType.ROUND === type) ? findObjs({pageid,imgsrc:getCleanImgsrc(imgsrc)}) : findObjs({pageid,imgsrc:getCleanImgsrc(imgsrc),name: markerName});

        let marker = markers.shift();
        if (!marker) {
            const newMarkerAttr = {
                name:             markerName,
                imgsrc:           getCleanImgsrc(imgsrc),
                pageid:           pageid,
                layer:            markerLayer,
                showplayers_name: true,
                left:             Math.ceil(markerWidth / 2), top: Math.ceil(markerHeight / 2),
                width:            markerWidth,
                height:           markerHeight
            };
            logger(LOGLEVEL.INFO, 'getOrCreateMarker::CREATING NEW MARKER !!! newMarkerAttr=' + JSON.stringify(newMarkerAttr));
            marker = createObj('graphic', newMarkerAttr);
        }

        if (type === markerType.ROUND)   insertMarkerTurnIfNotInTurnOrder(marker);
        if (type === markerType.MAIN)    handleMarkerAnimation(marker);

        if (type === markerType.ROUND)  toBack(marker);
        else                            toFront(marker);

        return marker;
    },

    insertMarkerTurnIfNotInTurnOrder = (marker) => {
        let turnorder = getTurnorder(),
            hasTurn = false;

        logger('insertMarkerTurnIfNotInTurnOrder::insertMarkerTurnIfNotInTurnOrder');

        turnorder.forEach(turn => {
            if (turn.id === marker.get('id')) hasTurn = true;
        });

        if (!hasTurn){
            turnorder.push({ id: marker.get('id'), pr: -420, custom: '', _pageid: marker.get('pageid') });
            Campaign().set('turnorder', JSON.stringify(turnorder));
        }
    },

    removeMarkers = () => {
        stopMarkerAnimation();
        getOrCreateMarker().remove();
        getOrCreateMarker(markerType.MAIN).remove();
        getOrCreateMarker(markerType.NEXT).remove();
        getOrCreateMarker(markerType.RANGE).remove();
    },

   updateMarker = function (token, type=markerType.ROUND)  {
        let typeMarker = getOrCreateMarker(type);

        logger('updateMarker::updateMarker type=' + type);

        if (!token){
            logger(LOGLEVEL.CRITICAL, 'updateMarker::!!! NO token ?!?!?!?!?!? GONNA DO resetMarker(type)');
            resetMarker(type);
            return;
        }
        let markerWidth, markerHeight;
        const pageObj = findObjs({_id: Campaign().get('playerpageid'), type: 'page'})[0];
        logger(`updateMarker:: pageObj.snapping_increment=${Number(pageObj.get('snapping_increment'))}, pageObj.showgrid=${pageObj.get('showgrid')}`);
        const scale_number = Number(pageObj.get('scale_number')) * (!pageObj.get('showgrid') || Number(pageObj.get('snapping_increment')) === 1 ? 1 : 70);
        logger(`updateMarker:: !! scale_number=${scale_number}`);
        switch (type) {
            case markerType.ROUND:
                markerWidth  = 2;
                markerHeight = 2; break;
            case markerType.RANGE:
                markerWidth  = parseInt(state[combatState].config.turnorder.rangeMarkerWidth / scale_number);
                markerHeight = parseInt(state[combatState].config.turnorder.rangeMarkerHeight / scale_number); break;
            case markerType.MAIN:
            case markerType.NEXT:
                markerWidth  = token.get('width')*state[combatState].config.turnorder.markerSize;
                markerHeight = token.get('height')*state[combatState].config.turnorder.markerSize;
        }
        let position = {
            top:    token.get('top'),
            left:   token.get('left'),
            width:  markerWidth,
            height: markerHeight,
        };

        setTimeout(() => {
            if (state[combatState].config.turnorder.useMarker || (state[combatState].config.turnorder.useRangeMarker !== 'None' && markerType.RANGE === type)) {
                let isBattleGroup = token.get('represents') && getAttrByName(token.get('represents'), 'battlegroup', 'current') === '1' ? true : false;
                let typeMarkerNewAttributes = { ...position, layer: markerType.ROUND === type ? 'objects' : isBattleGroup && markerType.RANGE !== type ? 'gmlayer' : 'map' };
                logger(LOGLEVEL.INFO, `updateMarker::Moving marker type=${type}, isBattleGroup=${isBattleGroup}, pos=${JSON.stringify(position)}, setting to=${JSON.stringify(typeMarkerNewAttributes)}`);
                typeMarker.set(typeMarkerNewAttributes);
            }
        }, 50);

        if (markerType.ROUND === type)  toBack(typeMarker);
        else                            toFront(typeMarker);
    },

    sendPingOnToken = (token) => {
        if (state[combatState].config.turnorder.centerToken && token.get('layer') == 'objects') {
            logger(LOGLEVEL.INFO, `sendPingOnToken:: centering on token name=${token.get('name')}`);
            sendPing(token.get('left'), token.get('top'), token.get('pageid'), null, true);
        }
    },

    handleStatusMarkerChange = (obj, prev) => {
        logger(LOGLEVEL.INFO, '-------------Handle Status Marker Change-------------');
        logger('handleStatusMarkerChange::handleStatusMarkerChange');


        prev.statusmarkers = (typeof prev.get === 'function') ? prev.get('statusmarkers') : prev.statusmarkers;

        if (typeof prev.statusmarkers === 'string'){
            if (obj.get('statusmarkers') !== prev.statusmarkers){

                var prevstatusmarkers = prev.statusmarkers.split(",");
                var newstatusmarkers  = obj.get('statusmarkers').split(",");
                logger(`handleStatusMarkerChange:: prev=${JSON.stringify(prevstatusmarkers)}`);
                logger(`handleStatusMarkerChange:: new=${JSON.stringify(newstatusmarkers)}`);
                
                if (prevstatusmarkers.length > 0) {
                    prevstatusmarkers.forEach((marker) => {
                        let condition = getConditionByMarker(marker);
                        if (!condition) return;
                        if (marker !== '' && !newstatusmarkers.includes(marker))
                            removeConditionFromToken(obj, condition.key, true);
                    });
                }

                if (newstatusmarkers.length > 0 ) {
                    newstatusmarkers.forEach(function(marker){
                        let condition = getConditionByMarker(marker);
                        const duration = marker.indexOf('@') > 0 ? marker.split('@')[1] : condition.duration;
                        if (!condition) return;
                        if (marker !== "" && !prevstatusmarkers.includes(marker))
                            addConditionToToken(obj,condition.key,duration,condition.direction,condition.message);
                    });
                }
            }
        }
    },

    handleMarkerAnimation = (marker) => {
        if (state[combatState].config.turnorder.animateMarker) {
            startMarkerAnimation(marker);
        } else {
            stopMarkerAnimation(marker);
        } 
    },

    startMarkerAnimation = (marker) => {
        clearInterval(animationHandle);
        animateMarker(marker);
    },

    stopMarkerAnimation = () => {
        clearInterval(animationHandle);
    },

    animateMarker = (marker) => {
		animationHandle = setInterval(() => {
		   	marker.set('rotation',parseInt(marker.get('rotation'))+state[combatState].config.turnorder.animateMarkerDegree);
		}, state[combatState].config.turnorder.animateMarkerWait);
    },

    rotateMarkerCallback = (marker) => {
        if (!animationHandle) return;
        if (!state[combatState].config.turnorder.animateMarker) {
            animationHandle = null;
            return;
        }
        //let newRotation = ();
        //logger('new rotation='+newRotation);
        marker.set('rotation',parseInt(marker.get('rotation'))+parseInt(state[combatState].config.turnorder.animateMarkerDegree));
        setTimeout(function() {rotateMarkerCallback(marker);}, state[combatState].config.turnorder.animateMarkerWait);
    },

    //*************************************************************************************************************
    //TURNORDER
    //*************************************************************************************************************

    clearTurnorder = () => {
        Campaign().set({ turnorder: '' });
        state[combatState].turnorder = {};
    },

    isCombatActiveAndTriggerStopIfNot = () => {
        logger('isCombatActiveAndTriggerStopIfNot::isCombatActiveAndTriggerStopIfNot');
        let turnorder = getTurnorder();
        logger(`isCombatActiveAndTriggerStopIfNot::return=${(turnorder.length == 0) ? false : true}`);

        if (turnorder.length == 0) {
            makeAndSendMenu('The Turnorder is empty.  Combat not started',null,'gm');
            stopCombat();
            return false;
        }

        return true;
    },

    changeToNextTurn = (prev=false, delay=false, turnOrderUnmodified=true, preventAnnounceTurn=false) => {
        logger('changeToNextTurn::changeToNextTurn Do TurnOrder Change !!!!!!!!!!!!!!!!!!!!!!!!!!!! announceTurn=' + preventAnnounceTurn);

        let verified    = isCombatActiveAndTriggerStopIfNot();
        if (!verified) return;
        let turn        = getCurrentTurnObject();
        let marker      = getOrCreateMarker();
        let tokenObj    = findObjs({_id:turn.id, _pageid:Campaign().get("playerpageid"), _type: 'graphic'})[0];

        if (turn.id === '-420') {
            doRoundCalls();
            changeTurnOrderToNext();
            return;
        }

        if (turn.id === marker.id) {
            logger(LOGLEVEL.INFO, 'changeToNextTurn::TURN MARKER => Change TURN');
            if (prev)   handlePreviousRound();
            else        handleNextRound();
            return;
        }

		if (tokenObj) {
            if (state[combatState].config.timer.useTimer) startTimer(tokenObj);

            let tmpTurnOrder = getTurnorder(), tmpTurn, lastVisibleToken;
            do {
                tmpTurn = tmpTurnOrder.pop();
                if (tmpTurn) lastVisibleToken = getObj('graphic', tmpTurn.id);
            } while (tmpTurnOrder.length && (parseInt(tmpTurn.pr) == -420 || lastVisibleToken.get('layer') != 'objects'));

            if (tmpTurnOrder.length == 0 && !tmpTurn) {
                stopCombat();
                return;
            }

            logger('changeToNextTurn::tmpTurn.pr='+tmpTurn.pr);

            if (state[combatState].config.turnorder.useRangeMarker != 'None')
                updateMarker((tokenObj.get('layer') != 'gmlayer') ? tokenObj : lastVisibleToken, markerType.RANGE);
            updateMarker((tokenObj.get('layer') != 'gmlayer') ? tokenObj : lastVisibleToken);
            updateMarker((tokenObj.get('layer') != 'gmlayer') ? tokenObj : lastVisibleToken, markerType.MAIN);

            logger('changeToNextTurn::============== sameFirstTurn='+preventAnnounceTurn);
            if (!preventAnnounceTurn)
                announcePlayer(tokenObj, prev, delay, false);
            resetOnslaught(tokenObj);
            sendPingOnToken(tokenObj);
            setTimeout(() => doTurnCalls(tokenObj), 1000);
        } else
            resetMarker();

        if (state[combatState].config.turnorder.nextMarkerType != 'None') {
            let nextTurn = getNextTurnObject();
            if (nextTurn) {
                let nextToken = getObj('graphic', nextTurn.id);
                logger('changeToNextTurn::turnOrderUnmodified='+turnOrderUnmodified+', nextToken.layer='+JSON.stringify(nextToken.get('layer')));
                if (nextToken && turnOrderUnmodified ||
                    (!turnOrderUnmodified &&   (nextToken.get('top')  != getOrCreateMarker(markerType.NEXT).get('top') ||
                                                nextToken.get('left') != getOrCreateMarker(markerType.NEXT).get('left')))) {
                    updateMarker(nextToken || false, markerType.NEXT);
                    toFront(getOrCreateMarker(markerType.MAIN));
                }
            }
        }
    },

    handleTurnorderChange = (obj, prev) => {
        logger(LOGLEVEL.INFO, "handleTurnorderChange::-------------Handle Turnorder Change-------------");
        logger('handleTurnorderChange::obj='+JSON.stringify(obj));
        logger('handleTurnorderChange::prev='+JSON.stringify(prev));

        if (obj.get('turnorder') === prev.turnorder) return;

        let turnorder         = (obj.get('turnorder') === "") ? [] : JSON.parse(obj.get('turnorder')),
            prevTurnorder     = (prev.turnorder === "")       ? [] : JSON.parse(prev.turnorder),
            theoricalNewOrder = [...prevTurnorder],
            currentTurn       = theoricalNewOrder.shift();
        theoricalNewOrder.push(currentTurn);


        if (obj.get('turnorder') == [] || (prevTurnorder.length && turnorder.filter(turn => turn.pr != -420).length <= 1)){
            stopCombat();
            return;
        }

        let test= JSON.stringify(turnorder)==JSON.stringify(theoricalNewOrder);
        logger('handleTurnorderChange::JSON.stringify(turnorder)==JSON.stringify(theoricalNewOrder)='+test);

        let callFirstTurn = (prevTurnorder.length === 1 && turnorder.length === 2);
        logger(`handleTurnorderChange::prevTurnorder.length=${prevTurnorder.length}, turnorder.length=${turnorder.length}`);
        logger(`handleTurnorderChange::callFirstTurn=${callFirstTurn}`);

        if (callFirstTurn) makeAndSendMenu('<span style="font-size: 12pt; font-weight: bold;">Round 1 - Start of combat !</span>', ' ', undefined, false);
        if (turnorder.length && prevTurnorder.length)//  && turnorder[0].id !== prevTurnorder[0].id
            changeToNextTurn(false, false, test, callFirstTurn ? false : turnorder[0].id === prevTurnorder[0].id);
    },

    sortTurnorder = (order='DESC') => {
        logger('sortTurnorder::sortTurnorder');
        let turnorder = getTurnorder();
        turnorder.sort((a,b) => (order === 'ASC') ? a.pr - b.pr : b.pr - a.pr);
        setTurnorder(turnorder);
    },

    getTurnorder = () => (Campaign().get('turnorder') === '') ? [] : Array.from(JSON.parse(Campaign().get('turnorder'))),

    // {id:tokenObj.id,pr:INT_NUMBER,custom:'',pageid:tokenObj.get("pageid")}
    addToTurnorder = (turn) => {
        logger('addToTurnorder::addToTurnorder');
        let turnorder = getTurnorder();

        turnorder.push(turn);
        setTurnorder(turnorder);
    },

    setTurnorder = (turnorder) => Campaign().set('turnorder', JSON.stringify(turnorder)),

    //*************************************************************************************************************
    //TURNS
    //*************************************************************************************************************

    changeTurnOrderToNext = () => {
        logger('changeTurnOrderToNext::changeTurnOrderToNext');

        let turnorder, currentTurn;
        turnorder   = getTurnorder(),
        currentTurn = turnorder.shift();
        turnorder.push(currentTurn);
        setTurnorder(turnorder);
        changeToNextTurn();
    },

    delayTurn = () => {
        logger('delayTurn::delayTurn');
        let turnorder, currentTurn;

        turnorder   = getTurnorder();
        currentTurn = turnorder.shift();
        currentTurn.pr -= 2;

        let tokenObj    = findObjs({_id:currentTurn.id, _pageid:Campaign().get("playerpageid"), _type: 'graphic'})[0];
        if (tokenObj) {
            let characterObj = getObj('character',tokenObj.get('represents'));
            if (tokenObj.get('layer') == 'objects' && characterObj) {
                let imgurl = tokenObj.get('imgsrc');
                let image  = (imgurl) ? '<img src="'+imgurl+'" width="50px" height="50px" />' : '';
                sendStandardScriptMessage(tokenObj.get('name')+' delays her actions', image, 'display:inline-block;width:74%;vertical-align:middle;font-weight:bold;', false);
            }
        }

        turnorder.unshift(currentTurn);
        setTurnorder(turnorder);

        logger('delayTurn::before changeTurnOrderToNext');

        changeTurnOrderToNext();
    },

    changeTurnOrderToPrevious = () => {
        let turnorder = getTurnorder(),
            last_turn = turnorder.pop();
        turnorder.unshift(last_turn);

        setTurnorder(turnorder);
        changeToNextTurn(true);
    },

    handleNextRound = () => {
        logger('handleNextRound::handleNextRound');
        let marker     = getOrCreateMarker(),
            initiative = state[combatState].config.initiative;

        round++;
        marker.set({name: 'Round ' + round});

        if (state[combatState].config.announcements.announceRound){
            let text = '<span style="font-size: 12pt; font-weight: bold;">'+marker.get('name')+'</span>';
            makeAndSendMenu(text, ' ', undefined, false);
        }

        if (initiative.rollEachRound){
            let turnorder = getTurnorder();
            clearTurnorder();
            insertMarkerTurnIfNotInTurnOrder(marker);
            rollInitiative(turnorder.map(t => { return (t.id) ? { _type: 'graphic', _id: t.id } : false; }), initiative);
            changeToNextTurn();
        } else {
            let turnorder, currentTurn;
            turnorder   = getTurnorder(),
            currentTurn = turnorder.shift();
            turnorder.push(currentTurn);
            setTurnorder(turnorder);

            if (state[combatState].config.turnorder.sortTurnOrder)
                sortTurnorder();
            if (state[combatState].config.turnorder.addMotesEachTurnToNonMortal)
                addMotesToNonMortalCharacters(turnorder);
            changeToNextTurn();
        }
    },

    getCurrentTurnObject = () => getTurnorder().shift(),

    getNextTurnObject = (skipId=-1) => {
        logger('getNextTurnObject::getNextTurnObject');
        let returnturn;
        getTurnorder().every((turn, i) => {
            let turnMarker = getOrCreateMarker();
            let turnToken = getObj('graphic', turn.id);
            if (i > 0 && turn.id !== '-420' && turn.id !== turnMarker.get('id') && turnToken && turnToken.get('layer') !== 'gmlayer' && turn.id !== skipId){
                returnturn = turn;
                return false;
            } else return true;
        });
        return returnturn;
    },

    // getVeryNextTurn = () => {
    //     let turnorder, turn;
    //     turnorder = getTurnorder();
    //     turn = turnorder.shift();
    //     turn = turnorder.shift();
    //     return turn;
    // },

    handlePreviousRound = () => {
        let marker = getOrCreateMarker();
        round--;
        marker.set({name: 'Round ' + round});

        if (state[combatState].config.announcements.announceRound){
            let text = '<span style="font-size: 12pt; font-weight: bold;">'+marker.get('name')+'</span>';
            makeAndSendMenu(text, '', undefined, false);
        }

        changeTurnOrderToPrevious();
    },

    //*************************************************************************************************************
    //TIMER
    //*************************************************************************************************************

    startTimer = (token) => {
        let timer       = state[combatState].config.timer,
            config_time = parseInt(timer.time),
            time        = config_time;
        paused = false;

        clearInterval(intervalHandle);
        if (timerObj) timerObj.remove();

        if (token && timer.showTokenTimer){
            timerObj = createObj('text', {
                text:        'Timer: ' + time,
                font_size:   timer.timerFontSize,
                font_family: timer.timerFont,
                color:       timer.timerFontColor,
                pageid:      token.get('pageid'),
                layer:       'gmlayer'
            });
        }

        intervalHandle = setInterval(() => {
            if (paused) return;

            if (timerObj && timer.showTokenTimer) timerObj.set({
                top:   token.get('top')+token.get('width')/2+40,
                left:  token.get('left'),
                text:  'Timer: ' + time,
                layer: token.get('layer')
            });

            if (state[combatState].config.timer.sendTimerToChat && (time === config_time || config_time/2 === time || config_time/4 === time || time === 10 || time === 5))
                makeAndSendMenu('', 'Time Remaining: ' + time);

            if (time <= 0){
                if (timerObj) timerObj.remove();
                clearInterval(intervalHandle);
                if (timer.skipTurn) changeTurnOrderToNext();
                else if (token.get('layer') !== 'gmlayer') makeAndSendMenu(token.get('name') + "'s time ran out!", '');
            }

            time--;
        }, 1000);
    },

    stopTimer = () => {
        clearInterval(intervalHandle);
        if (timerObj) timerObj.remove();
    },

    pauseTimer = () => paused = !paused,

    //*************************************************************************************************************
    //ANNOUNCE
    //*************************************************************************************************************

    announcePlayer = (tokenObj, prev, delay=false, show=false) => {
        if (!tokenObj) return;
        let name        = tokenObj.get('name');
        logger(LOGLEVEL.INFO, `announcePlayer::announcePlayer name=${name} statuses=${tokenObj.get('statusmarkers')}`);
        let imgurl      = tokenObj.get('imgsrc');
        let conditions  = getAnnounceConditions(tokenObj, prev, delay, show);
        let image       = (imgurl) ? '<img src="'+imgurl+'" width="50px" height="50px"  />' : '';
        name            = (state[combatState].config.announcements.handleLongName) ? handleLongString(name) : name;

        let title         = 'Conditions';
        let doneButton    = makeImageButton('!cmaster --turn,next',doneImage,'Done with Round','transparent',18,'white');
        let delayButton   = makeImageButton('!cmaster --turn,delay',delayImage,'Delay your Turn','transparent',18, 'white');

        if (!show) {
            title   += '<div style="'+styles.buttonRight+'">'+doneButton+'</div>';
            title   += '<div style="'+styles.buttonRight+'">'+delayButton+'</div>';
        }

        let contents     = '<div style="'+styles.announcePlayer+'">'+image+'</div>',
            characterObj = getObj('character', tokenObj.get('represents')),
            onslaught    = 0;
        if (characterObj && characterObj.id)
            onslaught = getAttrByName(characterObj.id, 'onslaught', 'current');
        let resetedOnslaughtMessage = ' <b>and reseted his onslaught (was <u>' + onslaught + '</u>) !</b>';

        if (!show)
            contents   += '<div style="'+styles.announcePlayer+'max-width: 76%;">'+name+'\'s Turn' + ((onslaught != 0) ? resetedOnslaughtMessage : '') + '</div>';
        else
            contents   += '<div style="'+styles.announcePlayer+'max-width: 76%;">'+name+'</div>';
        contents += conditions;

        if (characterObj) {
            let controlledBy = characterObj.get('controlledby');
            let players      = controlledBy.split(",");

            if (state[combatState].config.status.userChanges) {
                if (players.length > 1) {
                    let playerObj, displayName;
                    players.forEach((playerID) => {
                        playerObj = getObj('player', playerID);
                        if (playerObj) {
                            displayName = playerObj.get('displayname');
                            sendMainMenu(displayName);
                        }
                    });
                }
            }

            if (state[combatState].config.announcements.announceTurn) {
                let target;
                if (tokenObj.get('layer') == 'gmlayer') {
                    makeAndSendMenu(contents,title,'gm', false);
                    makeAndSendMenu('It\'s not your turn yet, sorry','Something is coming','', false);
                } else {
                    if (players[0] != "")
                        target = (state[combatState].config.announcements.whisperToGM) ? 'gm' : '';
                    else
                        target = (!state[combatState].config.announcements.showNPCTurns) ? 'gm' : '';
                    makeAndSendMenu(contents,title,target, false);
                }
            }
        }
    },

    getAnnounceConditions = (tokenObj, prev, delay, show) => {
        logger('getAnnounceConditions::getAnnounceConditions');

        let removeButton;
        let descriptionButton;
        let removed = false;
        let output = '<div>';
        let target;

        if (state[combatState].conditions) {
            [... state[combatState].conditions].forEach(condition => {
                if (condition.id == tokenObj.get("_id") || condition.target.includes(tokenObj.get("_id"))) {
                    if (condition.target.includes(tokenObj.get("_id"))) target = true;
                    descriptionButton = makeButton(condition.name, '!cmaster --show,description,key='+condition.key);
                    if (!target) {
                        if (!delay && !show) {
                            if (!prev)
                                condition.duration += condition.direction;
                            else
                                condition.duration -= condition.direction;
                        }
                    }

                    if (condition.duration <= 0 && condition.direction != 0) {
                        output += '<div style="display:inline-block;"><strong>'+descriptionButton+'</strong> removed</div>';
                        if (!delay && !show && !target) {
                            removeConditionFromToken(tokenObj, condition.key, true);
                            removed = true;
                        }
                    } else if (condition.duration > 0 && condition.direction != 0) {
                        output += '<div style="display:inline-block;"><strong>'+descriptionButton+'</strong> '+condition.duration+' Rounds Left</div>';

                        if (!delay && !show && !target) {
                            // addMarker(tokenObj, condition.iconType, condition.icon, condition.duration, condition.direction, condition.key)
                            addConditionToToken(tokenObj,condition.key,condition.duration,condition.direction,condition.message);
                        }
                        if (condition.hasOwnProperty('message') && condition.message != 'None' && condition.message.length > 0)
                            output += '<div style="display:inline-block;"><strong>Message: </strong>'+condition.message + '</div>';
                    } else if (condition.direction == 0) {
                        output += '<div style="display:inline-block;"><strong>'+descriptionButton+'</strong> '+condition.duration+' Permanent</div>';
                        if (condition.hasOwnProperty('message') && condition.message != 'None' && condition.message.length > 0)
                            output += '<div style="display:inline-block;"<strong>Message: </strong> '+condition.message+ '</div>';
                    }

                    if (!removed) {
                        removeButton  = makeImageButton('!cmaster --remove,condition='+condition.key+',id='+tokenObj.get("_id"),deleteImage,'Remove Condition','transparent',18);
                        output += '<div style="display:inline-block;float:right;vertical-aligh:middle">'+removeButton+'</div>';
                    }
                }

            });
        }
        output += '</div>';

        return output;
    },

    //*************************************************************************************************************
    //MAKES
    //*************************************************************************************************************

    makeAndSendMenu = (contents, title = undefined, whisper = undefined, noarchive = true, titleStyle = false) => {
        whisper = (whisper && whisper !== '') ? '/w ' + whisper + ' ' : '';
		title = makeTitle(title, titleStyle ? titleStyle : styles.title);
        sendChat(script_name, whisper + '<div style="'+styles.menu+styles.overflow+'">'+title+contents+'</div>', null, {noarchive:noarchive});
    },

    makeBanner = (command,title,previous) => {
        let backButton = makeBigButton('Back', '!cmaster --back,'+previous);
        let helpButton = makeImageButton('!cmaster --help,'+command,helpImage,'Help','transparent',18,'white');
        let titleText  = title+' Setup'+'<span style='+styles.buttonRight+'>'+helpButton+'</span>';

        return {
            backButton,
            titleText
        };
    },

    makeImageButton = (command, image, toolTip, backgroundColor,size,color) => {
        if (!color) color = 'black';
        return '<div style="display:inline-block;margin-right:3px;padding:1px;vertical-align:middle;"><a href="'+command+'" title= "'+toolTip+'" style="margin:0px;padding:0px;border:0px solid;background-color:'+backgroundColor+'"><span style="color:'+color+';padding:0px;font-size:'+size+'px;font-family: \'Pictos\'">'+image+'</span></a></div>';
    },

    makeList = (items, backButton, extraButton) => {
        let list;

        list  = '<ul style="'+styles.reset + styles.list + styles.overflow+'">';
		items.forEach((item) => {
            list += '<li style="'+styles.overflow+'">'+item+'</li>';
        });
		list += '</ul>';
        
		if (extraButton) list += extraButton;
		if (backButton) list += '<hr>'+backButton;
        return list;
    },

    makeTitle           = (title, titleStyle)                                  => `<div style="${titleStyle}"><span style=${styles.titleText}>${title}</span></div>`,
    makeBigButton       = (title, href)                                        => `<div style="${styles.bigButton}"><a style="${styles.bigButtonLink}" href="${href}">${title}</a></div>`,
    makeButton          = (title, href)                                        => `<a style="${styles.conditionButton}" href="${href}">${title}</a>`,
    makeTextButton      = (label, value, href)                                 => `<span style="${styles.textLabel}">${label}</span><a style="${styles.textButton}" href="${href}">${value}</a>`,
    makeCharacterLink   = (characterObj, characterId = characterObj.get('id')) => `<b><a href="http://journal.roll20.net/character/${characterId}">${characterObj.get('name')}</a></b>`,
    makeImageButtonHtml = txt                                                  => `<img src="${txt}" width="20px" height="20px" />`,

    //*************************************************************************************************************
    //ICONS
    //*************************************************************************************************************

    getDefaultIcon = (iconType, icon, style='', height, width) => {
        if (iconType == 'None') return 'None';
        let installed = verifyInstalls(iconType);

        if      (iconType == 'Token Marker' && installed)
            return libTokenMarkers.getStatus(icon).getHTML(1.7);
        else if (iconType == 'Combat Master') {
            let X = '';
            let iconStyle = '';
            // let iconSize = '';

            iconStyle += (width) ? 'width: '+width+'px;height: '+height+'px;' : 'width: 24px; height: 24px;';
            if (typeof icon_custom_token[icon] !== 'undefined') {
                iconStyle += `background-image: url(${icon_custom_token[icon]}); background-size: 24px;`;
                iconStyle += style;
                return '<div style="vertical-align:middle;'+iconStyle+'">'+X+'</div>';
            }
            if (typeof icon_image_positions[icon] === 'undefined') return false;

            if (Number.isInteger(icon_image_positions[icon])){
                iconStyle += 'background-image: url(https://roll20.net/images/statussheet.png);';
                iconStyle += 'background-repeat: no-repeat;';
                iconStyle += 'background-position: -'+icon_image_positions[icon]+'px 0;';
            } else if (icon_image_positions[icon] === 'X') {
                iconStyle += 'color: red; margin-right: 0px;';
                X = 'X';
            } else {
                iconStyle += 'background-color: ' + icon_image_positions[icon] + ';';
                iconStyle += 'border: 1px solid white; border-radius: 50%;';
            }

            iconStyle += style;

            return '<div style="vertical-align:middle;'+iconStyle+'">'+X+'</div>';
        } else if (iconType == 'Token Condition')
            return '<b>TC </b> ';
    },

    getTokenMarkers = () => libTokenMarkers.getOrderedList(),

    // findIcon = (icon) => {
    //     markers.forEach((marker) => {
    //         if (marker.name == icon) {
    //             return marker.url;
    //         }
    //     });
    // },

    getIconTag = (iconType,iconName) => {
        logger('getIconTag::getIconTag');

        if (!verifyInstalls(iconType)) return;
        let iconTag = null;
        if      (iconType == 'Token Marker')
            iconTag = libTokenMarkers.getStatus(iconName).getTag();
        else if (iconType == 'Combat Master')
            iconTag = iconName;

        return iconTag;
    },

    verifyInstalls = (iconType) => {
        if (iconType == 'Token Marker' && 'undefined' == typeof libTokenMarkers) {
            makeAndSendMenu('libTokenMarker API must be installed if using Custom Icons.', '', 'gm');
            return false;
        } else if (iconType == 'Token Condition' && 'undefined' == typeof TokenCondition) {
            makeAndSendMenu('Token Condition API must be installed if using Token Condition.', '', 'gm');
            return false;
        }
        return true;
    },

    //*************************************************************************************************************
    //EXTERNAL CALLS
    //*************************************************************************************************************

    doRoundCalls = () => {
        logger("doRoundCalls::doRoundCalls");

        let verified    = isCombatActiveAndTriggerStopIfNot();
        if (!verified) return;
        let config     = state[combatState].config.turnorder,
            turnorder  = getTurnorder(),
            tokenObj, characterObj, macro;

        turnorder.forEach((turn) => {
            if (turn.id !== getOrCreateMarker().get('id')) {
                tokenObj     = getObj('graphic',turn.id);
                if (tokenObj) {
                    characterObj = getObj('character',tokenObj.get('represents'));
                    if (characterObj) {
                        if (!['None',''].includes(config.allRoundMacro)) {
                            macro = getMacro(tokenObj, config.allRoundMacro);
                            sendCalltoChat(tokenObj,characterObj,macro.get('action'));
                        }
                        if ( !['None',''].includes(config.characterRoundMacro) && characterObj.get('controlledby') != '') {
                            macro = getMacro(tokenObj, config.characterRoundMacro);
                            sendCalltoChat(tokenObj,characterObj,macro.get('action'));
                        }
                        if (!['None',''].includes(config.roundAPI))
                        	sendCalltoChat(tokenObj,characterObj,config.roundAPI);
                        if (!['None',''].includes(config.roundRoll20AM))
                        	sendCalltoChat(tokenObj,characterObj,config.roundRoll20AM);
                        if (!['None',''].includes(config.roundFX))
                        	doFX(tokenObj,config.roundFX);
                    }
                }
            }
        });
    },

    doTurnCalls = (tokenObj) => {
        logger("doTurnCalls::doTurnCalls Do Turn External Calls");

        let config = state[combatState].config.turnorder,
            characterObj = getObj('character',tokenObj.get('represents')),
            key, condition, ability, macro;

        if (characterObj) {
            if (Object.entries(characterObj).length > 0) {
                if (!['None',''].includes(config.turnMacro)) {
                    ability = findObjs({_characterid:tokenObj.get('represents'), _type:'ability', name:config.turnMacro})[0];
                    if (ability)
                        sendCalltoChat(tokenObj,characterObj,ability.get('action'));
                    else {
                        macro = findObjs({_type:'macro', name:config.turnMacro})[0];
                        if (macro) sendCalltoChat(tokenObj,characterObj,macro.get('action'));
                    }
                }

                for (key in state[combatState].conditions) {
                    condition = state[combatState].conditions[key];
                    if (tokenObj.get('_id') == condition.id && condition.addPersistentMacro) {
                        ability = findObjs({_characterid:tokenObj.get('represents'), _type:'ability', name:condition.addMacro})[0];
                        if (ability)
                            sendCalltoChat(tokenObj,characterObj,ability.get('action'));
                        else {
                            macro = findObjs({_type:'macro', name:condition.addMacro})[0];
                            if (macro) sendCalltoChat(tokenObj,characterObj,macro.get('action'));
                        }
                    }
                }
                if (!['None',''].includes(config.turnAPI))      sendCalltoChat(tokenObj,characterObj,config.turnAPI);
                if (!['None',''].includes(config.turnRoll20AM)) sendCalltoChat(tokenObj,characterObj,config.roundRoll20AM);
                if (!['None',''].includes(config.turnFX))       doFX(tokenObj,config.turnFX);
            }

        }
    },

    doAddConditionCalls = (tokenObj,key) => {
        logger("doAddConditionCalls::doAddConditionCalls");

        let condition = getConditionByKey(key);
        if (!condition) return;
        let characterObj = getObj('character',tokenObj.get('represents')),
            macro;

        if (characterObj) {
            if (!['None',''].includes(condition.addMacro)) {
                macro = findObjs({_type:'macro', name:condition.addMacro})[0];
                if (macro) sendCalltoChat(tokenObj,characterObj,macro.get('action'));
            }
            if (!['None',''].includes(condition.addAPI))      sendCalltoChat(tokenObj,characterObj,condition.addAPI);
            if (!['None',''].includes(condition.addRoll20AM)) sendCalltoChat(tokenObj,characterObj,condition.addRoll20AM);
            if (!['None',''].includes(condition.addFX))       doFX(tokenObj,condition.addFX);
        }
    },

    doRemoveConditionCalls = (tokenObj,key) => {
        logger("doRemoveConditionCalls::doRemoveConditionCalls");

        let condition = getConditionByKey(key);
        if (!condition) return;
        let characterObj = getObj('character',tokenObj.get('represents')),
            macro;

        if (characterObj) {
            if (!['None',''].includes(condition.remMacro)) {
                macro = findObjs({_type:'macro', name:condition.remMacro})[0];
                if (macro) sendCalltoChat(tokenObj,characterObj,macro.get('action'));
            }
            if (!['None',''].includes(condition.remAPI))      sendCalltoChat(tokenObj,characterObj,condition.remAPI);
            if (!['None',''].includes(condition.remRoll20AM)) sendCalltoChat(tokenObj,characterObj,condition.remRoll20AM);
            if (!['None',''].includes(condition.remFX))       doFX(tokenObj,condition.remFX);
        }
    },

    sendCalltoChat = (tokenObj,characterObj,action) => {
        logger("sendCalltoChat::sendCalltoChat");

        let substitutions = state[combatState].config.macro.substitutions,
            replaceString;

        if (substitutions) {
            substitutions.forEach((substitution) => {
                replaceString = new RegExp(substitution.action, "g");
                if      (substitution.type == 'CharName') 
                    action = action.replace(replaceString, characterObj.get('name'), 'g');
                else if (substitution.type == 'CharID')
                    action = action.replace(replaceString, characterObj.get('_id'), 'g');
                else if (substitution.type == 'TokenID')
                    action = action.replace(replaceString, tokenObj.get('_id'), 'g');
                else if (substitution.type == 'PlayerID')
                    action = action.replace(replaceString, state[combatState].config.gmPlayerID, 'g');
            });
        }

        sendChat(tokenObj.get('name'), action, null, {noarchive:true});
    },

    doFX = (tokenObj, fx) => {
        if (tokenObj.get('layer') === 'gmlayer') return;

        let pos = {x: tokenObj.get('left'), y: tokenObj.get('top')};
        spawnFxBetweenPoints(pos, pos, fx, tokenObj.get('pageid'));
    },

    getMacro = (tokenObj, name) => {
        let macro = findObjs({_characterid:tokenObj.get('represents'), _type:'ability', name:name})[0];
        if (!action) macro = findObjs({_type:'macro', name:config.turnMacro})[0];
        return macro;
    },

    //*************************************************************************************************************
    //SUBSTITUTIONS
    //*************************************************************************************************************

    newSubstitution = (cmdDetails) => {
        logger('newSubstitution::newSubstitution');

        let substitution = {
            type:   cmdDetails.details.type,
            action: cmdDetails.details.action
        };

        state[combatState].config.macro.substitutions.push(substitution);
		sendMacroMenu();
    },

    removeSubstitution = (cmdDetails) => {
        logger('removeSubstitution::removeSubstitution');

        state[combatState].config.macro.substitutions.forEach((substitution, i) => {
            if (substitution.action == cmdDetails.details.action) state[combatState].config.macro.substitutions.splice(i,1);
        });
		sendMacroMenu();
    },

    //*************************************************************************************************************
    //SPELLS
    //*************************************************************************************************************

    handleSpellCast = (msg) => {
        logger('handleSpellCast::handleSpellCast');
        logger(msg);

        let status          = state[combatState].config.status;
        let concentration   = state[combatState].config.concentration;
        let spellName;
        let description;
        let concentrate     = false;
        let spellLevel;
        let duration        = 1;
        let durationmult;
        let direction       = 0;

        if (status.sheet == 'OGL') {
            spellName       = msg.content.match(/name=([^\n{}]*[^"\n{}])/);
            spellName       = RegExp.$1;
            description     = msg.content.match(/description=([^\n{}]*[^"\n{}])/);
            description     = RegExp.$1;
            spellLevel      = msg.content.match(/spelllevel=([^\n{}]*[^"\n{}])/);
            spellLevel      = RegExp.$1;
            durationmult    = 1;
            if (msg.content.includes("{{concentration=1}}"))
                concentrate = true;
            if (!spellLevel && !concentrate) return;
        } else if (status.sheet == 'Shaped') {
            spellName       = msg.content.match(/title=([^\n{}]*[^"\n{}])/);
            spellName       = RegExp.$1;
            description     = msg.content.match(/{{content=([^\n{}]*[^"\n{}])/);
            description     = RegExp.$1;
            duration        = msg.content.match(/duration=[^}\d]*([0-9]+)_([A-Z]+[^"\n{}_ ])/);
            duration        = RegExp.$1;
            durationmult    = msg.content.match(/duration=[^}\d]*([0-9]+)_([A-Z]+[^"\n{}_ ])/);
            durationmult    = RegExp.$2;
            if      (durationmult.includes("ROUND"))
                durationmult = 1;
            else if (durationmult.includes("MINUTE"))
                durationmult = 10;
            else
                durationmult = 0; //ONLY ACCOUNT FOR ROUND AND MINUTE DURATIONS, EVERYTHING ELSE IS 0
            duration = (durationmult == 0) ? 1 : (duration * durationmult);
            if (msg.content.includes("CONCENTRATION"))
                concentrate = true;
        } else if (status.sheet == 'PF2') {
            spellName    = msg.content.match(/header=([^\n{}]*[^"\n{}])/);
            spellName    = RegExp.$1;
            description  = msg.content.match(/desc=([^\n{}]*[^"\n{}])/);
            description  = RegExp.$1;
        }

        if (!spellName) return;

        logger('handleSpellCast::Spell Name:'+spellName);
        logger('handleSpellCast::Description:'+description);
        logger('handleSpellCast::Concentrate:'+concentrate);
        logger('handleSpellCast::Duration:'+duration);
        logger('handleSpellCast::Duration Multiplier:'+durationmult);
        description || (description = 'None');
        duration    || (duration    = 1);
        direction   || (direction   = 0);
        if (status.autoAddSpells) {
            let key = spellName.toLowerCase(),
                condition = getConditionByKey(key);
            direction = (duration >= 1) ? -1 : 0;
            if (typeof condition == 'undefined' && !getIgnoresByKey(key)) {
                state[combatState].spells[key] = {
                    name:               spellName,
                    key:                key,
                    type:               'Spell',
                    icon:               'red',
                    iconType:           'Combat Master',
                    description:        description,
                    duration:           duration,
                    direction:          direction,
                    message:            'None',
                    targeted:           false,
                    favorite:           false,
                    concentration:      concentrate,
                    addAPI:             'None',
                    addRoll20AM:        'None',
                    addFX:              'None',
                    addMacro:           'None',
                    addPersistentMacro: false,
                    remAPI:             'None',
                    remRoll20AM:        'None',
                    remFX:              'None',
                    remMacro:           'None'
                };

                let addSpellButton      = makeBigButton(`Add Spell to Combat Master`, `!cmaster --spell,confirm=true,key=${key}`);
                let ignoreSpellButton   = makeBigButton(`Ignore this Spell`, `!cmaster --spell,confirm=false,key=${key}`);
                makeAndSendMenu(`A new spell - ${spellName} - was detected<br>`+addSpellButton+ignoreSpellButton ,`New Spell Found`,`gm`);
            } else if (condition) {
                targetedSpell(key);
                if (concentration.useConcentration && concentrate == true && condition.override == false) {
                    let characterName;
                    if (status.sheet == 'OGL') {
                        characterName = msg.content.match(/charname=([^\n{}]*[^"\n{}])/);
                        characterName = RegExp.$1;
                    }
                    else if (status.sheet == 'Shaped') {
                        characterName = msg.content.match(/{{character_name=([\w\d ]+[^"\n{}]?)/);
                        characterName = RegExp.$1;
                    }
                    let characterID     = findObjs({ name: characterName, _type: 'character' }).shift().get('id');
                    let tokenObj        = findObjs({ represents: characterID, _pageid:Campaign().get("playerpageid"), _type: 'graphic' })[0];
                    addConditionToToken(tokenObj,'concentration',condition.duration,condition.direction,'Concentrating on ' +spellName);
                }
            }
        }
    },

    addSpell = (key) => {
        logger('addSpell::addSpell');
        logger(key);
        state[combatState].config.conditions[key] = state[combatState].spells[key];
        let index = state[combatState].spells.indexOf(key);
        if (index > -1) state[combatState].spells.splice(index, 1);
        sendConditionMenu(key);
    },

    ignoreSpell = (key) => {
        logger('ignoreSpell::ignoreSpell');
        logger(key);

        state[combatState].ignores.push(key);
        makeAndSendMenu('Spell has been added to Ignore List','Spell Ignored','gm');
    },

    getIgnoresByKey = (key) => {
        logger('getIgnoresByKey::getIgnoresByKey');
        logger('getIgnoresByKey::Key:'+key);
        logger('getIgnoresByKey::Exists:'+state[combatState].ignores.includes(key));

        return state[combatState].ignores.includes(key);
    },

    handleConstitutionSave = (obj, prev) => {
        logger(LOGLEVEL.INFO, 'handleConstitutionSave::handleConstitutionSave-------------Handle Constitution Save-------------');

        let tokenID = obj.get('id'), found = false;
        state[combatState].conditions.forEach((condition) => {
            if (condition.id == tokenID && condition.key == 'concentration')
                found = true;
        });

        if (!found) return;

        // let conditions = obj.get('statusmarkers').split(',');
        // let condition = state[combatState].conditions.map(id => obj.get('statusmarkers'));
        let concentration = state[combatState].config.concentration,
            bar = concentration.woundBar+'_value',
            target = concentration.notify;

        if (obj.get(bar) < prev[bar]) {
            let calcDC = Math.floor((prev[bar] - obj.get(bar))/2),
                DC = (calcDC > 10) ? calcDC : 10;
            // let conSave = parseInt(getAttrByName(obj.get('represents'), concentration.attribute, 'current')) || 0;
            let contents;

            if (target === 'Character') {
                contents = "Make a Concentration Check - <b>DC " + DC + "</b>.";
                target = obj.get('name').split(' ').shift();
            } else if (target === 'Everyone') {
                contents = '<b>'+obj.get('name')+'</b> must make a Concentration Check - <b>DC ' + DC + '</b>.';
                target = '';
            } else {
                contents = '<b>'+obj.get('name')+'</b> must make a Concentration Check - <b>DC ' + DC + '</b>.';
                target = 'gm';
            }
            makeAndSendMenu(contents, '', target);
            // if (concentration.autoRoll){
            //     roll(obj.get('represents'), DC, conSave, obj.get('name'), target);
            // }else{
                // makeAndSendMenu(contents, '', target);
            // }

            // let length = checked.push(obj.get('represents'));
            // setTimeout(() => {
            //     checked.splice(length-1, 1);
            // }, 1000);
        }
    },

    //*************************************************************************************************************
    //MISC
    //*************************************************************************************************************

    sendStandardScriptMessage = (innerHtml, image = '', divStyle = 'display:inline-block;width:100%;vertical-align:middle;', noarchive = false) => {
        sendChat(script_name, '<div style="'+styles.menu+'"><div style="display:inherit;">'+(image!='' ? '<div style="text-align:center;">'+image+'</div>' : '')+'<div style="'+divStyle+'">'+innerHtml+'</div></div></div>', null, {noarchive:noarchive});
    },

    sendWhisperStandardScriptMessage = (whisperName, innerHtml, image = '', divStyle = 'display:inline-block;width:100%;vertical-align:middle;', noarchive = false) => {
        sendChat(script_name, '/w '+whisperName+' <div style="'+styles.menu+'"><div style="display:inherit;">'+(image!='' ? '<div style="text-align:center;">'+image+'</div>' : '')+'<div style="'+divStyle+'">'+innerHtml+'</div></div></div>', null, {noarchive:noarchive});
    },

    sendGMStandardScriptMessage = (innerHtml, image = '', divStyle = 'display:inline-block;width:100%;vertical-align:middle;', noarchive = false) => {
        sendWhisperStandardScriptMessage('gm', innerHtml, image, divStyle, noarchive);
    },

    inFight = () => (Campaign().get('initiativepage') !== false),

    handleLongString = (str, max=8) => {
        str = str.split(' ')[0];
        return (str.length > max) ? str.slice(0, max) + '...' : str;
    },

    // randomBetween = (min, max) => {
    //     return Math.floor(Math.random()*(max-min+1)+min);
    // },

    handleInitiativePageChange = (obj,prev) => {
        logger(`handleInitiativePageChange::handleInitiativePageChange -------------Handle Initiative Page Change------------- turnorder=${JSON.stringify(getTurnorder())}`);

        if ((obj.get('initiativepage') !== prev.initiativepage && !obj.get('initiativepage'))){
            //stopCombat();
        }
    },

    observeTokenChange = (handler) => {
        if (handler && _.isFunction(handler))
            observers.tokenChange.push(handler);
    },

    // notifyObservers = (event,obj,prev) => {
    //     _.each(observers[event],function(handler){
    //         handler(obj,prev);
    //     });
    // },

    getCurrentTurnObjectOrLastVisibleIfHidden = (idSkip = -1) => {
        logger('getCurrentTurnObjectOrLastVisibleIfHidden::getCurrentTurnObjectOrLastVisibleIfHidden idSkip='+idSkip);

        let turns = getTurnorder(), turn = turns.shift(), first = {...turn},
        tokenObj = findObjs({_id:turn.id, _pageid:Campaign().get("playerpageid"), _type: 'graphic'})[0],
        lastVisibleToken;
        if (tokenObj && tokenObj.get('layer') != 'objects') {
            do {
                turn = turns.pop();
                if (turn) lastVisibleToken = getObj('graphic', turn.id);
            } while (turns.length && (turn.id == idSkip || parseInt(turn.pr) == -420 || !lastVisibleToken || lastVisibleToken.get('layer') != 'objects'));

            if (turns.length == 0 && !turn) return first;
        }
        return turn;
    },

    actualizeNextMarker = (obj) => {
        logger('actualizeNextMarker::actualizeNextMarker obj='+JSON.stringify(obj));
        const nextTurnObject = getNextTurnObject(obj.get('id'));
        if (!nextTurnObject)
            resetMarker(markerType.NEXT);
        else
            updateMarker(getObj('graphic', nextTurnObject.id), markerType.NEXT);
    },

    handleGraphicDelete = (obj) => {
        logger(LOGLEVEL.INFO, '-------------Handle Graphic Delete-------------');
        logger('handleGraphicDelete::handleGraphicDelete');
        logger('handleGraphicDelete::obj='+JSON.stringify(obj));

        if (!inFight()) return;

        let turnorder =  getTurnorder();
        const newTurnorder = turnorder.filter(turn => turn.id !== obj.get('_id'));
        if (JSON.stringify(newTurnorder) != JSON.stringify(turnorder)) { // delete an item which is in the roll20 combat/turnorder
            logger('handleGraphicDelete::Setting newTurnorder !!! (token deleted was part of turn order) turnorder='+JSON.stringify(newTurnorder.map(turn => turn.pr).filter(turn => turn != -420)));
            setTurnorder(newTurnorder);
        }
        const filteredTurnorder = turnorder.map(turn => turn.pr).filter(turn => turn != -420);
        logger('handleGraphicDelete::without turns turnorder='+JSON.stringify(filteredTurnorder));

        if (filteredTurnorder.length - 1 <= 1) {
            logger('handleGraphicDelete::No More Token to Fight with, closing combat !! /!\\');
            stopCombat();
            logger('handleGraphicDelete::-----END-----');
            return;
        }

        if (obj.get('layer') != 'gmlayer' && obj.hasOwnProperty("id") && turnorder.length > 0) {
            let curretMarker = getOrCreateMarker(), nextMarker = getOrCreateMarker(markerType.NEXT);
            if (curretMarker.get('top') === obj.get('top') && curretMarker.get('left') === obj.get('left')){
                logger('handleGraphicDelete::Actual Player Deleted !');
                let currentFocus = getObj('graphic', getCurrentTurnObjectOrLastVisibleIfHidden(obj.get('id')).id);
                updateMarker(currentFocus);
                updateMarker(currentFocus, markerType.RANGE);
                updateMarker(currentFocus, markerType.MAIN);
                if (nextMarker.get('top') === currentFocus.get('top') && nextMarker.get('left') === currentFocus.get('left')) {
                    logger('handleGraphicDelete::Main marker will be on NEXT, need to move NEXT !!!');
                    actualizeNextMarker(obj);
                }
            } else if (nextMarker.get('top') === obj.get('top') && nextMarker.get('left') === obj.get('left')) {
                logger('handleGraphicDelete::Next Player Deleted !');
                actualizeNextMarker(obj);
            }
        }
    },

    handleGraphicMovement = (obj) => { //(obj, prev )
        logger(LOGLEVEL.INFO, '-------------Handle Graphic Movement-------------');
        logger('handleGraphicMovement::handleGraphicMovement');
        logger('handleGraphicMovement::obj='+JSON.stringify(obj));

        if (!inFight()) return;

        let turnorder =  getTurnorder();
        if (obj.get('layer') != 'gmlayer' && obj.hasOwnProperty("id") && turnorder.length > 0) {
            const nextTurnObject = getNextTurnObject();
            if (getCurrentTurnObjectOrLastVisibleIfHidden().id === obj.get('id')){
                logger(LOGLEVEL.INFO, 'handleGraphicMovement::Actual Player Moved !');
                updateMarker(obj);
                //updateMarker(obj, markerType.RANGE);
                updateMarker(obj, markerType.MAIN);
            } else if (nextTurnObject && nextTurnObject.id === obj.get('id')) {
                logger(LOGLEVEL.INFO, 'handleGraphicMovement::Next Player Moved !');
                updateMarker(obj, markerType.NEXT);
                toFront(getOrCreateMarker(markerType.MAIN));
            }
        }
    },

    //return an array of objects according to key, value, or key and value matching
    // getObjects = (obj, key, val) => {
    //     var objects = [];
    //     for (var i in obj) {
    //         if (!obj.hasOwnProperty(i)) continue;
    //         if (typeof obj[i] == 'object') {
    //             objects = objects.concat(getObjects(obj[i], key, val));
    //         } else
    //         //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
    //         if (i == key && obj[i] == val || i == key && val == '') { //
    //             objects.push(obj);
    //         } else if (obj[i] == val && key == ''){
    //             //only add if the object is not already in the array
    //             if (objects.lastIndexOf(obj) == -420){
    //                 objects.push(obj);
    //             }
    //         }
    //     }
    //     return objects;
    // },


    esRE = (s) => {
        var escapeForRegexp = /(\\|\/|\[|\]|\(|\)|\{|\}|\?|\+|\*|\||\.|\^|\$)/g;
        return s.replace(escapeForRegexp,"\\$1");
    },

    HE = (function(){
        var entities={
                //' ' : '&'+'nbsp'+';',
                '<' : '&'+'lt'+';',
                '>' : '&'+'gt'+';',
                "'" : '&'+'#39'+';',
                '@' : '&'+'#64'+';',
                '{' : '&'+'#123'+';',
                '|' : '&'+'#124'+';',
                '}' : '&'+'#125'+';',
                '[' : '&'+'#91'+';',
                ']' : '&'+'#93'+';',
                '"' : '&'+'quot'+';',
                "&" : '&'+'amp'+';'
            },
            re=new RegExp('('+_.map(_.keys(entities),esRE).join('|')+')','g');
        return function(s){
            return s.replace(re, function(c){ return entities[c] || c; });
        };
    }()),

    ucFirst = (string) => string.charAt(0).toUpperCase() + string.slice(1),

    // buildPartyList = () => {
	// 	var partyList = '|All,all';
    //     _.each(findObjs({type:'player'}),player=>{
    //         let who = getObj('player', player.id).get('displayname');
    //         if (playerIsGM(player.id)){
    //           who = 'gm';
    //         }
    //         partyList += '|'+who+','+who;
    //     });
    //     return partyList;
    // },

    testAndSetDefault = (propertyKey, propertyName, state, defaults) => {
        if (!state[combatState].config[propertyKey].hasOwnProperty(propertyName)){
            logger(`testAndSetDefault::SETTING DEFAULT TO propertyName=${propertyName} = ${defaults.config[propertyKey][propertyName]}`);
            state[combatState].config[propertyKey][propertyName] = defaults.config[propertyKey][propertyName];
        }
    },

    testAndSetDefaults = (propertyKey, propertyList, state, defaults) => {
        if (!Array.isArray(propertyList)) {
            logger(LOGLEVEL.CRITICAL, 'testAndSetDefaults::propertyList IS NOT AN ARRAY ! propertyList=' + JSON.stringify(propertyList));
            return;
        }

        logger('testAndSetDefaults::testAndSetDefaults list=' + JSON.stringify(propertyList));
        propertyList.forEach(prop => testAndSetDefault(propertyKey, prop, state, defaults));
    },

    setDefaults = (reset) => {
        let key, condition;

        logger('setDefaults::setDefaults');

        const combatDefaults = {
            conditions: [],
            ignores:    [],
            spells:     [],
			config: {
                command:        'cmaster',
				duration:       false,
				favorite:       false,
				previousPage:   null,
				gmPlayerID:     null,
				hold: {
                    held:       false,
                    turnorder:  [],
                    conditions: [],
                    round:      1
				},
				initiative: {
                    rollInitiative:         'None',
                    initiativeDie:          20,
					initiativeAttributes:   'initiative_bonus',
                    showInitiative:         false,
                    rollEachRound:          false,
                    apiTargetTokens:        'None'
				},
                turnorder: {
                    useMarker:                   true,
					markerType:                  'External URL',
					externalMarkerURL:           'https://s3.amazonaws.com/files.d20.io/images/257728638/PJfoTQlIm5B_VVYz4zWnsw/max.png?1638083794',
					nextMarkerType:              'External URL',
					nextExternalMarkerURL:       'https://s3.amazonaws.com/files.d20.io/images/258296907/KnaGUNbcaB9r-JMQ2RvX1g/max.png?1638419188',
					tokenMarkerName:             'None',
					tokenMarkerURL:              null,
					nextTokenMarkerName:         'None',
					nextTokenMarkerURL:          null,
					markerSize:                  2.1,
					animateMarker:               false,
					animateMarkerDegree:         1,
					animateMarkerWait:           25,
                    sortTurnOrder:               true,
					centerToken:                 false,
					turnAPI:                     'None',
					turnRoll20AM:                'None',
					turnFX:                      'None',
                    turnMacro:                   'None',
					roundAPI:                    'None',
					roundRoll20AM:               'None',
					roundFX:                     'None',
					roundMacro:                  'None',
					characterRoundMacro:         'None',
					allRoundMacro:               'None',

                    useRangeMarker:              'External URL',
                    rangeExternalMarkerURL:      'https://s3.amazonaws.com/files.d20.io/images/286593209/iKIw8-n03SYQmCG93s47Iw/max.png?1653389150',
                    rangeMarkerWidth:            6000,
                    rangeMarkerHeight:           6000,

                    addMotesEachTurnToNonMortal: true,
                    moteQtyToAdd:                5
                },
                timer: {
                    useTimer:        false,
                    time:            120,
                    skipTurn:        true,
                    sendTimerToChat: true,
                    showTokenTimer:  true,
                    timerFont:       'Candal',
                    timerFontSize:   16,
                    timerFontColor:  'rgb(255, 0, 0)'
                },
                announcements: {
                    announceTurn:       true,
                    whisperToGM:        false,
                    announceRound:      true,
                    handleLongName:     true,
					showNPCTurns:       true,
                    announceMoteRegen:  false
                },
                macro: {
                    substitutions: [
                        { type: 'CharID',   action: 'CharID' },
                        { type: 'CharName', action: 'CharName' },
                        { type: 'TokenID',  action: 'TokenID' },
                        { type: 'PlayerID', action: 'PlayerID' }
                    ],
                },
				status: {
					userAllowed:        false,
					userChanges:        false,
					sendOnlyToGM:       false,
					sendConditions:     true,
					clearConditions:    false,
					showConditions:     'all',
					useMessage:         false,
					access:             'None',
					autoAddSpells:      false,
					sheet:              'OGL',
				},
				concentration: {
					useConcentration:   false,
					notify:             'GM',
					autoAdd:            false,
					autoRoll:           false,
					woundBar:           'Bar1',
					attribute:          'None'
				},
                conditions: {
					// concentration: {
					// 	name:               'Concentration',
					// 	key:                'concentration',
					// 	type:               'Spell',
					// 	description:        "<p>In order to keep their magic active. If you lose concentration, such a spell ends. If a spell must be maintained with concentralion, that fact appears in its Duration entry, and the spell specifics how long you can concentrate on it. You can end concentration at any time (no action required)..</p>",
					// 	icon:               'trophy',
					// 	iconType:           'Combat Master',
					// 	duration:           1,
					// 	direction:          0,
					// 	override:           true,
					// 	favorite:           false,
					// 	message:            'None',
					// 	targeted:           false,
					// 	targetedAPI:        'casterTargets',
					// 	concentration:      false,
					// 	addAPI:             'None',
					// 	addRoll20AM:        'None',
					// 	addFX:              'None',
					// 	addMacro:           'None',
					// 	addPersistentMacro: false,
					// 	remAPI:             'None',
					// 	remRoll20AM:        'None',
					// 	remFX:              'None',
					// 	remMacro:           'None',
					// },
					grappled: {
						name:               'Grappled',
						key:                'grappled',
						type:               'Condition',
						description:        "<p>A grappled creature have a penalty of 2 to both his defenses.</p>",
						icon:               'grab',
						iconType:           'Combat Master',
						duration:           1,
						direction:          -1,
						override:           true,
						favorite:           false,
						message:            'None',
						targeted:           false,
						targetedAPI:        'casterTargets',
						concentration:      false,
						addAPI:             '!cmaster --applyGrabDefPen,id=CharID,tok=TokenID',
						addRoll20AM:        'None',
						addFX:              'None',
						addMacro:           'None',
						addPersistentMacro: false,
						remAPI:             '!cmaster --remGrabDefPen,id=CharID,tok=TokenID',
						remRoll20AM:        'None',
						remFX:              'None',
						remMacro:           'None',
					},
					crashed: {
						name:               'Crashed',
						key:                'crashed',
						type:               'Condition',
						description:        "<p>A Crashed opponent cannot take Decisive Attacks nor make Gambits.</p>",
						icon:               'broken-shield',
						iconType:           'Combat Master',
						duration:           3,
						direction:          -1,
						override:           true,
						favorite:           false,
						message:            'None',
						targeted:           false,
						targetedAPI:        'casterTargets',
						concentration:      false,
						addAPI:             '!cmaster --announceCrashAndSendInitGainButton,tok=TokenID',
						addRoll20AM:        'None',
						addFX:              'None',
						addMacro:           'None',
						addPersistentMacro: false,
						remAPI:             '!cmaster --announceCrashOff,tok=TokenID',
						remRoll20AM:        'None',
						remFX:              'None',
						remMacro:           'None',
					},
					prone: {
						name:               'Prone',
						key:                'prone',
						type:               'Condition',
						description:        "<p>A prone creature has a penalty of 1 to parry and a penalty of 2 to evasions.</p>",
						icon:               'back-pain',
						iconType:           'Combat Master',
						duration:           1,
						direction:          0,
						override:           true,
						favorite:           false,
						message:            'None',
						targeted:           false,
						targetedAPI:        'casterTargets',
						concentration:      false,
						addAPI:             '!cmaster --applyProneDefPen,id=CharID,tok=TokenID',
						addRoll20AM:        'None',
						addFX:              'None',
						addMacro:           'None',
						addPersistentMacro: false,
						remAPI:             '!cmaster --remProneDefPen,id=CharID,tok=TokenID',
						remRoll20AM:        'None',
						remFX:              'None',
						remMacro:           'None',
					},
					coverT1: {
						name:               'Cover Light',
						key:                'coverT1',
						type:               'Condition',
						description:        "<p>Light Cover provides 1point bonus to defenses.</p>",
						icon:               'bolt-shield',
						iconType:           'Combat Master',
						duration:           1,
						direction:          0,
						override:           true,
						favorite:           false,
						message:            'None',
						targeted:           false,
						targetedAPI:        'casterTargets',
						concentration:      false,
						addAPI:             '!cmaster --applyLightCoverDefBonus,id=CharID,tok=TokenID',
						addRoll20AM:        'None',
						addFX:              'None',
						addMacro:           'None',
						addPersistentMacro: false,
						remAPI:             '!cmaster --remCoverDefBonus,id=CharID,tok=TokenID',
						remRoll20AM:        'None',
						remFX:              'None',
						remMacro:           'None',
					},
                    coverT2: {
						name:               'Cover Heavy',
						key:                'coverT2',
						type:               'Condition',
						description:        "<p>Heavy Cover provides 2points bonus to defenses.</p>",
						icon:               'white-tower',
						iconType:           'Combat Master',
						duration:           1,
						direction:          0,
						override:           true,
						favorite:           false,
						message:            'None',
						targeted:           false,
						targetedAPI:        'casterTargets',
						concentration:      false,
						addAPI:             '!cmaster --applyHeavyCoverDefBonus,id=CharID,tok=TokenID',
						addRoll20AM:        'None',
						addFX:              'None',
						addMacro:           'None',
						addPersistentMacro: false,
						remAPI:             '!cmaster --remCoverDefBonus,id=CharID,tok=TokenID',
						remRoll20AM:        'None',
						remFX:              'None',
						remMacro:           'None',
					},
                    poison: {
						name:               'Poison',
						key:                'poison',
						type:               'Condition',
						description:        '',
						icon:               'skull',
						iconType:           'Combat Master',
						duration:           1,
						direction:          -1,
						override:           true,
						favorite:           false,
						message:            'None',
						targeted:           false,
						targetedAPI:        'casterTargets',
						concentration:      false,
						addAPI:             'None',
						addRoll20AM:        'None',
						addFX:              'None',
						addMacro:           'None',
						addPersistentMacro: false,
						remAPI:             'None',
						remRoll20AM:        'None',
						remFX:              'None',
						remMacro:           'None',
					},
                    clashlost: {
						name:               'Clash Lost',
						key:                'clashlost',
						type:               'Condition',
						description:        '',
						icon:               'clashlost::5271616',
						iconType:           'Combat Master',
						duration:           1,
						direction:          -1,
						override:           true,
						favorite:           false,
						message:            'None',
						targeted:           false,
						targetedAPI:        'casterTargets',
						concentration:      false,
						addAPI:             '!cmaster --applyClashDefPen,id=CharID,tok=TokenID',
						addRoll20AM:        'None',
						addFX:              'None',
						addMacro:           'None',
						addPersistentMacro: false,
						remAPI:             '!cmaster --remClashDefPen,id=CharID,tok=TokenID',
						remRoll20AM:        'None',
						remFX:              'None',
						remMacro:           'None',
					}
				}
            },
        };


        if (!state[combatState].config || typeof state[combatState].config == 'undefined' || reset) state[combatState].config = combatDefaults.config;
        else {
            if (!state[combatState].config.hasOwnProperty('command'))        state[combatState].config.command = combatDefaults.config.command;
			if (!state[combatState].config.hasOwnProperty('favorite'))       state[combatState].config.favorite = combatDefaults.config.favorite;
			if (!state[combatState].config.hasOwnProperty('previousPage'))   state[combatState].config.previousPage = combatDefaults.config.previousPage;

            if (!state[combatState].config.hasOwnProperty('hold'))           state[combatState].config.hold = combatDefaults.config.hold;
            else
                testAndSetDefaults('hold', [
                    'held',
                    'turnorder',
                    'conditions',
                    'round'
                ], state, combatDefaults);

            if (!state[combatState].config.hasOwnProperty('initiative'))     state[combatState].config.initiative = combatDefaults.config.initiative;
            else
                testAndSetDefaults('initiative', [
                    'initiativeAttributes',
                    'rollInitiative',
                    'initiativeDie',
                    'rollEachRound',
                    'apiTargetTokens'
                ], state, combatDefaults);

            if (!state[combatState].config.hasOwnProperty('turnorder'))      state[combatState].config.turnorder = combatDefaults.config.turnorder;
            else
                testAndSetDefaults('turnorder', [
                    'useMarker',
                    'markerType',               'externalMarkerURL',
                    'nextMarkerType',           'nextExternalMarkerURL',
                    'tokenMarkerName',          'tokenMarkerURL',
                    'nextTokenMarkerName',      'nextTokenMarkerURL',
                    'markerSize',
                    'animateMarker',            'animateMarkerDegree',      'animateMarkerWait',
                    'centerToken',
                    'sortTurnOrder',
                    'turnAPI',
                    'turnRoll20AM',
                    'turnFX',
                    'turnMacro',
                    'roundAPI',
                    'roundFX',
                    'characterRoundMacro',
                    'allRoundMacro',
                    'useRangeMarker',
                    'rangeExternalMarkerURL',
                    'rangeMarkerWidth',
                    'rangeMarkerHeight',
                    'addMotesEachTurnToNonMortal',
                    'moteQtyToAdd'
                ], state, combatDefaults);

            if (!state[combatState].config.hasOwnProperty('timer'))          state[combatState].config.timer = combatDefaults.config.timer;
            else
                testAndSetDefaults('timer', [
                    'useTimer',
                    'time',
                    'skipTurn',
                    'sendTimerToChat',
                    'showTokenTimer',
                    'timerFont',
                    'timerFontSize',
                    'timerFontColor'
                ], state, combatDefaults);

            if (!state[combatState].config.hasOwnProperty('announcements'))  state[combatState].config.announcements = combatDefaults.config.announcements;
            else
                testAndSetDefaults('announcements', [
                    'announceTurn',
                    'whisperToGM',
                    'announceRound',
                    'handleLongName',
                    'showNPCTurns',
                    'announceMoteRegen'
                ], state, combatDefaults);

            if (!state[combatState].config.hasOwnProperty('macro') || reset) state[combatState].config.macro = combatDefaults.config.macro;
			if (!state[combatState].config.hasOwnProperty('status'))         state[combatState].config.status = combatDefaults.config.status;
            else
                testAndSetDefaults('status', [
                    'userChanges',
                    'sendOnlyToGM',
                    'sendConditions',
                    'clearConditions',
                    'useMessage',
                    'showConditions',
                    'access',
                    'autoAddSpells',
                    'sheet'
                ], state, combatDefaults);

			if (!state[combatState].config.hasOwnProperty('concentration'))  state[combatState].config.concentration = combatDefaults.config.concentration;
            else
                testAndSetDefaults('concentration', [
                    'useConcentration',
                    'notify',
                    'autoAdd',
                    'autoRoll',
                    'woundBar',
                    'attribute'
                ], state, combatDefaults);
        }

        if (!state[combatState].hasOwnProperty('conditions'))                state[combatState].conditions = [];
        if (!state[combatState].hasOwnProperty('ignores'))                   state[combatState].ignores = [];
        if (!state[combatState].hasOwnProperty('spells'))                    state[combatState].spells = [];

        if (state[combatState].config.hasOwnProperty('conditions') && !reset){
            for (key in state[combatState].config.conditions) {
                condition = getConditionByKey(key);
                if (!condition.hasOwnProperty('key'))                   condition.key                   = key;
                if (!condition.hasOwnProperty('type'))                  condition.type                  = 'Condition';
                if (!condition.hasOwnProperty('duration'))              condition.duration              = 1;
                if (!condition.hasOwnProperty('direction'))             condition.direction             = 0;
                if (!condition.hasOwnProperty('override'))              condition.override              = true;
                if (!condition.hasOwnProperty('favorite'))              condition.favorite              = false;
                if (!condition.hasOwnProperty('message'))               condition.message               = 'None';
                if (!condition.hasOwnProperty('targeted'))              condition.targeted              = false;
                if (!condition.hasOwnProperty('targetedAPI'))           condition.targetedAPI           = 'casterTargets';
                if (!condition.hasOwnProperty('concentration'))         condition.concentration         = false;
                if (!condition.hasOwnProperty('iconType'))              condition.iconType              = 'Combat Master'
                if (!condition.hasOwnProperty('addAPI'))                condition.addAPI                = 'None';
                if (!condition.hasOwnProperty('addRoll20AM'))           condition.addRoll20AM           = 'None';
                if (!condition.hasOwnProperty('addFX'))                 condition.addFX                 = 'None';
                if (!condition.hasOwnProperty('addMacro'))              condition.addMacro              = 'None';
                if (!condition.hasOwnProperty('addPersistentMacro'))    condition.addPersistentMacro    = false;
                if (!condition.hasOwnProperty('remAPI'))                condition.remAPI                = 'None';
                if (!condition.hasOwnProperty('remRoll20AM'))           condition.remRoll20AM           = 'None';
                if (!condition.hasOwnProperty('remFX'))                 condition.remFX                 = 'None';
                if (!condition.hasOwnProperty('remMacro'))              condition.remMacro              = 'None';
            }
        } else if (reset || !state[combatState].config.hasOwnProperty('conditions'))
            state[combatState].config.conditions = combatDefaults.config.conditions;

        if (!state[combatState].config.conditions.hasOwnProperty('concentration') && state[combatState].config.concentration.useConcentration)
            state[combatState].config.conditions.concentration = combatDefaults.config.conditions.concentration;
    },

    showHelp = (cmdDetails) => {
        let handout;
        let title;
        if (cmdDetails.details.held)                title = 'Main Menu Held';
        else if (cmdDetails.details.started)        title = 'Main Menu Started';
        else if (cmdDetails.details.stopped)        title = 'Main Menu Stopped';
        else if (cmdDetails.details.setup)          title = 'Setup Menu';
        else if (cmdDetails.details.initiative)     title = 'Initiative Menu';
        else if (cmdDetails.details.turnorder)      title = 'Turnorder Menu';
        else if (cmdDetails.details.timer)          title = 'Timer Menu';
        else if (cmdDetails.details.announcements)  title = 'Announcements Menu';
        else if (cmdDetails.details.macro)          title = 'Macro & API Menu';
        else if (cmdDetails.details.status)         title = 'Status Menu';
        else if (cmdDetails.details.concentration)  title = 'Concentration Menu';
        else if (cmdDetails.details.conditions)     title = 'Conditions Menu';
        else if (cmdDetails.details.condition)      title = 'Condition Menu';
        else if (cmdDetails.details.addAPI)         title = 'Add API Menu';
        else if (cmdDetails.details.remAPI)         title = 'Remove API Menu';
        else if (cmdDetails.details.export)         title = 'Export Menu';
        handout = findHandout(title);
        makeAndSendMenu(`<a href="http://journal.roll20.net/handout/${handout[0].id}">View Help</a>`,title,'gm');
    },

    buildHelp = () => {
        logger('Building Help');

        let mainStarted         = createHandout('Main Menu Started');
        let mainStopped         = createHandout('Main Menu Stopped');
        let mainHeld            = createHandout('Main Menu Held');
        let menuSetup           = createHandout('Setup Menu');
        let menuInitiative      = createHandout('Initiative Menu');
        let menuTurnorder       = createHandout('Turnorder Menu');
        let menuTimer           = createHandout('Timer Menu');
        let menuAnnouncements   = createHandout('Announcements Menu');
        let menuMacro           = createHandout('Macro & API Menu');
        let menuStatus          = createHandout('Status Menu');
        let menuConcentration   = createHandout('Concentration Menu');
        let menuConditions      = createHandout('Conditions Menu');
        let menuCondition       = createHandout('Condition Menu');
        let menuAddAPI          = createHandout('Add API Menu');
        let menuRemoveAPI       = createHandout('Remove API Menu');
        let menuExport          = createHandout('Export Menu');

        setTimeout(function() {
            buildMainMenuStarted(mainStarted,menuSetup.id,menuCondition.id);
            buildMainMenuStopped(mainStopped,menuSetup.id,menuCondition.id);
            buildMainMenuHeld(mainHeld,menuSetup.id,menuCondition.id);
            buildSetupMenu(menuSetup,menuInitiative.id,menuTurnorder.id,menuTimer.id,menuAnnouncements.id,menuMacro.id,menuStatus.id,menuConcentration.id,menuConditions.id,menuExport.id);
            buildInitiativeMenu(menuInitiative,menuSetup.id);
            buildTurnorderMenu(menuTurnorder,menuSetup.id);
            buildTimerMenu(menuTimer,menuSetup.id);
            buildAnnouncementsMenu(menuAnnouncements,menuSetup.id);
            buildMacroMenu(menuMacro,menuSetup.id);
            buildStatusMenu(menuStatus,menuSetup.id);
            buildConcentrationMenu(menuConcentration,menuSetup.id);
            buildConditionsMenu(menuConditions,menuSetup.id);
            buildConditionMenu(menuCondition,menuSetup.id);
            buildAddAPIMenu(menuAddAPI);
            buildRemoveAPIMenu(menuRemoveAPI);
            buildExportMenu(menuExport);
        },1000);

    },

    findHandout = (title) => findObjs({_type:'handout', name:title}),

    createHandout = (title) => {
        let handout = findHandout(title);
        if (handout[0]) handout[0].remove();
        handout = createObj('handout', {
            name:title,
            archived:true
        });
        return handout;
    },

    buildMainMenuStarted = (handout,setupID,conditionID) => {
        let notes;

        notes = `<div class="content note-editor notes">
                    <p>
                        <img src="https://s3.amazonaws.com/files.d20.io/images/152155102/i5BnjEmv8VSsfpoK44jaKw/original.png?15953856105">
                    </p>
                    <h4><i>Started Combat (Green Bar)</i> - Icons in order from Left to Right </h4>
                    <ul>
                        <li><b>Stop Combat </b>— Ends Combat and clears Turnorder.</li>
                        <li><b>Hold Combat </b>— Sets Combat to Hold and saves off everything for a restart</li>
                        <li><b>Previous Player </b>— Sets Active Player to previous player in Turnorder</li>
                        <li><b>Next Player </b>— Sets Active Player to Next Player in Turnorder</li>
                        <li><b>Pause Timer </b>— Pauses Timer. Click again to restart Timer</li>
                        <li><b>Stop Timer </b>— Stops Timer. Clears Timer.  Can't be restarted until next Combat</li>
                        <li><b>Show Conditions </b>— Shows all Conditions assigned to all Players & NPCs</li>
                        <li><b>Sort Turnorder </b>— Sorts Turnorder in ascending sequence</li>
                        <li><b>Setup  </b>— Shows the <a href="http://journal.roll20.net/handout/${setupID}">Setup Menu</a></li>
                    </ul>`;
        notes += buildMainConditions('https://s3.amazonaws.com/files.d20.io/images/133804430/JJ--U559pOgsd9UBpUb06g/original.png?15892970605',conditionID);
        notes += `</div>`;

        handout.set({notes:notes});
    },

    buildMainMenuStopped = (handout,setupID,conditionID) => {
        let notes;

        notes = `<div class="content note-editor notes">
                    <p>
                        <img src="https://s3.amazonaws.com/files.d20.io/images/152155096/Yb0jQ-AqPsjXPAN4F0OHVA/original.png?15953856105">
                    </p>
                    <h4><i>Start Combat (Red Bar)</i> - Icons in order from Left to Right </h4>
                    <ul>
                        <li><b>Start Combat </b>— Starts up combat. Must have tokens selected if using CM to roll initiative.</li>
                        <li><b>Setup </b>— Shows the <a href="http://journal.roll20.net/handout/${setupID}">Setup Menu</a>.</li>
                    </ul>`;
        notes += buildMainConditions('https://s3.amazonaws.com/files.d20.io/images/133804645/pmJuadcB01opW3Lg8lyOYA/original.png?15892970725',conditionID);
        notes += `</div>`;

        handout.set({notes:notes});
    },

    buildMainMenuHeld = (handout,setupID,conditionID) => {
        let notes;

        notes = `<div class="content note-editor notes">
                    <p>
                        <img src="https://s3.amazonaws.com/files.d20.io/images/152155100/DcEfpVBdzKz9t-SS23KZhA/original.png?15953856105">
                    </p>
                    <h4><i>Held Combat (Yellow Bar)</i> - Icons in order from Left to Right </h4>
                    <ul>
                        <li><b>Start Combat </b>— Restarts Combat from where it was previous held</li>
                        <li><b>Setup </b>— Shows the <a href="http://journal.roll20.net/handout/${setupID}">Setup Menu</a>.</li>
                    </ul>`;
        notes += buildMainConditions('https://s3.amazonaws.com/files.d20.io/images/133804415/0Te1DEzFMolSiIj7DfZfTw/original.png?15892970575', conditionID);
        notes += `</div>`;

        handout.set({notes:notes});
    },

    buildMainConditions = (image,conditionID) => {
        let notes = `<h4><i>Conditions</i> - From Left to Right </h4>
                    <ul>
                        <li><b>Icon </b>— The default or custom token marker assigned to the condition is displayed here. If the condition uses the Token Condition script, it will simply show "TC" here.</li>
                        <li><b>Name </b>— The name of the condition.</li>
                        <li><b>Add </b>— Add the condition to the selected token(s). Will use the conditions settings for Duration, Default, Override, and Messages. Will invoke any API commands and/or Macros assigned to the condition.</li>
                        <li><b>Remove </b>— Removes the condition from the selected token(s).</li>
                        <li><b>Favorite </b>— If a star is displayed, the condition will show in the favorites menu. If a globe is displayed, the condition will only show in the all conditions menu. Clicking on either the star or globe icon for each condition will toggle if it's a favorite or not.</li><li><b>Edit </b>— Shows the <a href="http://journal.roll20.net/handout/${conditionID}">Condition Menu</a> for that condition.</li>
                    </ul>
                    <h4><i>Change View</i></h4>
                    <ul>
                        <li><b>All </b>— Shows all Spells and Conditions</li>
                        <li><b>Conditions </b>— Shows all Conditions (Condition Type = Condition)</li>
                        <li><b>Spells </b>— Shows all Spells (Condition Type = Spell)</li>
                        <li><b>Favorites </b>— Shows all Favorites</li>
                    </ul>`;

        return notes;
    },

    buildSetupMenu = (handout,initiativeID,turnorderID,timerID,announceID,macroID,statusID,concentrationID,conditionsID,exportID) => {
        let notes = `<div class="content note-editor notes">
                        <p>
                            <img src="https://s3.amazonaws.com/files.d20.io/images/152155095/jC-VGZKJY2kweDvEfeIKRA/original.png?15953856105">
                        </p>
                        <h4><i>Combat Setup</i></h4>
                        <ul>
                            <ul>
                                <li><b><a href="http://journal.roll20.net/handout/${initiativeID}">Initiative</a></b> — Configure how CombatMaster will roll Initiative.<br></li>
                                <li><b><a href="http://journal.roll20.net/handout/${turnorderID}">Turnorder</a></b> — Configure how the turnorder is managed.<br></li>
                                <li><b><a href="http://journal.roll20.net/handout/${timerID}">Timer</a></b> — Configure a timer, its length, and how it is displayed.<br></li>
                                <li><b><a href="http://journal.roll20.net/handout/${announceID}">Announce</a></b> — Configure how turns are announced in chat.<br></li>
                                <li><b><a href="http://journal.roll20.net/handout/${macroID}">Macro &amp; API</a></b> — Configure substitution strings for use in macros and API commands.<br></li>
                            </ul>
                        </ul>
                        <h4><i>Status Setup</i></h4>
                        <ul>
                            <ul>
                                <li><b><a href="http://journal.roll20.net/handout/${statusID}">Status</a></b> — Configure how conditions are managed and displayed.<br></li>
                                <li><b><a href="http://journal.roll20.net/handout/${concentrationID}">Concentration</a></b> — Configure how Concentration is managed and displayed<br></li>
                                <li><b><a href="http://journal.roll20.net/handout/${conditionsID}">Conditions</a></b> — A list of all conditions in CombatMaster; here, you can edit existing conditions or add new ones.<br></li>
                                <li><b><a href="http://journal.roll20.net/handout/${exportID}">Export</a></b> — Puts a configuration code in chat to copy so you can import your conditions and settings into another game with CombatMaster. Simply triple-click the code to select it entirely (this also avoids selecting anything outside the code block). Save it in a handout to easily transmogrify to other games, or save it as a file on your computer.<br></li>
                                <li><b>Import </b>— Import your configuration from another game.<br><b>NOTE:</b> <i>If migrating from CombatMaster to another CombatMaster, it will copy the entire CombatMaster configuration.  If coming from CombatTracker, it will only copy the conditions and you’ll have to reconfigure everything else. Importing from StatusInfo is not supported.<br></i></li>
                            </ul>
                        </ul>
                        <h4><i>Resets</i></h4>
                        <ul>
                            <li><b>Reset </b>— This resets the entire session state. It defaults the conditions to D&amp;D 5e.<br></li>
                            <li><b>Remove Ignores </b>— This Removes all Spells from the ignore list<br></li>
                            <li><b>Clear Token Statuses</b>— This Removes all Conditions/Spells assigned to selected tokens<br></li>
                        </ul>
                    </div>`;

        handout.set({notes:notes});
    },

    buildInitiativeMenu = (handout,setupID) => {
        let notes = `<div class="content note-editor notes">
                        <p>
                            <img src="https://s3.amazonaws.com/files.d20.io/images/152155099/rjAlxljzxTzHNp94R3FQaQ/original.png?15953856105">
                        </p>
                        <h4><i>Initiative Setup</i></h4>
                        <ul>
                            <ul>
                                <li><b>None </b>— CombatMaster may be configured to not roll initiative.  You can have each character roll initiative on their own.<br><b>NOTE: </b><i>If you choose to not roll initiative from CombatMaster, the turn order will need to be set before starting combat.</i></li>
                                <li><b>CombatMaster </b>— CombatMaster has its own initiative roller. To use it, select the tokens involved in the encounter, then click the Start button in the Main Menu.<br></li>
                                <ul>
                                    <li><b>Roll Each Round </b>— Rerolls initiative at the end of each round.<br></li>
                                    <li><b>Initiative Attr </b>— Accepts a comma delimited list of attributes that make up initiative. The attribute name must match the attribute names in the character sheet.</li>
                                    <li><b>Initiative Die </b>— Set the type of dice that CombatMaster will roll for each character.<br></li>
                                    <li><b>Show Initiative in Chat </b>— Displays the initiative rolls in chat.<br></li>
                                </ul>
                                <li><b>Group-Init </b>— Calls on GroupInitiative to build the turnorder when you click the Start button in the Main Menu.<br><b>NOTE: </b><i>If you choose Group-Init, the GroupInitiative script must be installed in your game and configured outside of CombatMaster.</i></li><ul><li><b>Roll Each Round </b>— Rerolls initiative at the end of each round.</li>
                                <li><b>Target Tokens </b>— Not functional yet></li>
                            </ul>
                        </ul>
                    </div>`;

        handout.set({notes:notes});
    },

    buildTurnorderMenu = (handout,setupID) => {
        let notes = `<div class="content note-editor notes">
                        <p>
                            <img src="https://s3.amazonaws.com/files.d20.io/images/152155089/ITDSxgaL_xtJ7w_jiNg0gA/original.png?15953856105">
                        </p>
                        <h4><i>Turnorder Setup</i></h4>
                        <ul>
                            <ul>
                                <li><b>Sort Turnorder </b>— Sorts the turnorder in descending sequence (only) once created.<br></li>
                                <li><b>Center Map on Token </b>— Will center the map for all players on the token currently active in the turnorder using the Ping function. This will not center the map if the token is on the GM Layer.<br></li>
                                <li><b>Add Motes to Exalteds </b>— Will try to add 5 motes to each combat member if "Caste" is other than "Mortal".<br></li>
                                <li><b>Use Marker </b>— Determines if the marker is visible to players or always stays on the GM Layer. If visible, the marker will only move to the GM Layer if a token in the turnorder is on the GM Layer. It will do switch layers before moving to that token, and after moving to the next token, so as not to give away the position of any tokens hidden from players.<br></li><li><b>Marker Type </b>— Set to External URL (default) or can be set to Token Marker.  If Token Marker is selected a suitable token must be uploaded to your game.</li><li><b>Marker </b>— A thumbnail of what will be used to highlight the current active character.</li><li><b>Use Next Marker </b>— If set to true will display another marker around the player that is next in the turnorder.  If set to false, then the next player up is not highlighted.</li>
                                <li><b>Use Next Marker </b>— A thumbnail of what will be used to highlight the next active character. Set to None if you don't need it</li>
                                <li><b>Use Range Marker </b>— A thumbnail of what will be used to highlight the range under the active character. Set to None if you don't need it</li>
                            </ul>
                        </ul>`;
            notes +=    buildExternalCallMenu('<b>Beginning of Each Round</b>');
            notes +=    buildExternalCallMenu("<b>Beginning of Each Turn</b>");
            notes +=    `</div>`;

        handout.set({notes:notes});
    },

    buildExternalCallMenu = (title,round,condition) => {
        let notes = `<h4><i>${title}</i></h4>
                     <h5><i> Set various external calls which will be invoked</i></h5>
                     <ul>
                        <li><b>API </b>— Must be a full API command. You must use brackets {{ and }} around the command and around each parameter when entering the command. Any inline rolls must be written like [#[1d6]#] instead of [[1d6]].</li>
                        <li><b>Roll20AM </b>— Must be a full Roll20AM command. You must use brackets {{ and }} around the command and around each parameter when entering the command.</li>
                        <li><b>FX </b>— Must be a valid FX command.</li>`;
        if (round) {
            notes +=    `<li><b>Characters Macro </b>— This uses a global macro substituting in all player characters on the map. Follows other macro rules (see below)</li>
                         <li><b>All Tokens Macro </b>— This uses a global macro substituting in all tokens on the map. Follows other macro rules (see below)</li>`;
        } else
            notes +=    `<li><b>Macro </b>— Must be the full macro name (without the #). Any inline rolls within the macro must be written like [#[1d6]#] instead of [[1d6]].</li>`;
        if (condition) notes +=    `<li><b>Persistent Macro</b> — Determines if the assigned macro is repeated at the start of an affected token's turn.`;
        notes +=    `</ul>`;

        return notes;
    },

    buildTimerMenu = (handout,setupID) => {
        let notes = `<div class="content note-editor notes">
                        <p>
                            <img src="https://s3.amazonaws.com/files.d20.io/images/152155088/xni0bvuiAktNfbrTbUAPog/original.png?15953856105">
                        </p>
                        <h4><i>Timer Setup</i></h4>
                        <ul>
                            <li><b>Turn Timer </b>— Setting to true turns on the timer. The timer displays a red second by second countdown under the current active token in turnorder.<br>&lt;Image of a token with the timer below it&gt;<br></li>
                            <li><b>Time </b>— Determine the total time in seconds that the active token has to complete the turn.<br></li><li><b>Skip Turn </b>— Automatically advances to the next turn when the timer reaches 0.<br></li>
                            <li><b>Send to Chat </b>— Sends intermittent alerts to chat when the timer starts, when it reaches the halfway point, when it reaches 10 seconds, and when it reaches 5 seconds.<br></li>
                            <li><b>Show on Token </b>— Choose whether to display the timer underneath the active token.<br></li>
                            <li><b>Token Font </b>— Set the font for the displayed timer.<br></li>
                            <li><b>Token Font Size </b>—  Set the font size for the displayed timer.</li>
                        </ul>
                    </div>`;

        handout.set({notes:notes});
    },

    buildAnnouncementsMenu = (handout,setupID) => {
        let notes = `<div class="content note-editor notes">
                        <p>
                            <img src="https://s3.amazonaws.com/files.d20.io/images/152155098/7i1LPHIZ87fVB56cUMcvhw/original.png?15953856105">
                        </p>
                        <h4><i>Announcements Setup</i></h4>
                        <ul>
                            <li><b>Announce Rounds </b>— Sends a message to chat when a new round has started.</li>
                            <li><b>Announce Turns </b>— Sends a message to chat with the current active token if it is not on the GM Layer, plus any assigned conditions or messages.<br>
                                <ul>
                                    <li><img src="https://s3.amazonaws.com/files.d20.io/images/152224865/IupB8psepZNaKPSkDB1UhA/original.png?15954302265"></li>
                                    <li><b>Down Arrow Icon </b>— Delays Player Turn.</li>
                                    <li><b>CheckBox Icon </b>— Ends Player Turn.</li>
                                    <li><b>Condition Name </b>— Click on it to view Condition Description.</li>
                                    <li><b>Trashcan Icon </b>— Click on it to remove Condition from Token.</li>
                                </ul>
                            </li>
                            <li><b>Whisper GM Only </b>— Choose whether all announcements are only sent to the GM.<br></li>
                            <li><b>Shorten Long Names </b>— Shortens the token name as displayed in the turn announcement.<br></li>
                            <li><b>Show NPC Conditions </b>— Choose whether NPC turn announcements are only sent to the GM.<br></li>
                            <li><b>Announce Mote Regen </b>— Choose whether all player see mote regen of each essence wielder.
                        </ul>
                    </div>`;
        handout.set({notes:notes});
    },

    buildMacroMenu = (handout,setupID) => {
        let notes = `<div class="content note-editor notes"><p>This menu is for setting up strings to substitute for various types of calls in Macros and APIs. For example, if you want CombatMaster to run a macro that would normally use @{selected|character_id}, you would need to set up a substitution string for CharID, then use that string in place of @{selected|character_id} in the macro itself.</p><p>Substitution strings work best as unique terms that won't be used elsewhere in a command or macro, otherwise CombatMaster may insert a substituted call somewhere it doesn't belong. So you'd want the TokenID substitute to be something like 'tokenidentifier' since that isn't likely to be used anywhere else, whereas 'name' is not a good substitute, because it is a word that is likely to be used in other contexts.</p><p>The PlayerID substitution string is specifically for use in TokenMod commands. If you set the PlayerID substitution to something like 'playeridentifier', then a TokenMod command in CombatMaster would look like this:</p><pre>!token-mod --api-as playeridentifier --ids tokenidentifier --on showname<br></pre>
                        <p>
                            <img src="https://s3.amazonaws.com/files.d20.io/images/152155094/0ZAC_3VwnVxEL_ZLfgo-iA/original.png?15953856105">
                        </p>
                        <h4><i>Macro & API Setup</i></h4>
                        <ul>
                            <li><b>Type </b>— The type of call being substituted.<br></li>
                            <li><b>String </b>— The substitution string you have set up, for use in API commands and macros.<br></li>
                            <li><b>Delete </b>— Delete the substitution on this line.<br></li>
                            <li><b>Add Substitution </b>— Create a new substitution string.<br></li>
                        </ul>
                    </div>`;
        handout.set({notes:notes});
    },

    buildStatusMenu = (handout,setupID) => {
        let notes = `<div class="content note-editor notes">
                        <p>
                            <img src="https://s3.amazonaws.com/files.d20.io/images/152155103/WF7QJJUMbfTjTjPWyd8SYQ/original.png?15953856105">
                        </p>
                        <h4><i>Status Setup</i></h4>
                        <ul>
                            <li><b>Whisper GM Only </b>— Choose whether condition descriptions are only sent to the GM.<br></li>
                            <li><b>Player Allowed Changes </b>— When this is turned on, the player active in the turnorder receives a Menu where they can add or remove conditions from their token.<br></li>
                            <li><b>Send Changes to Chat </b>— Choose whether condition descriptions are sent to chat when a condition is added to a token.<br></li>
                            <li><b>Clear Conditions on Close </b>— Choose whether stopping combat removes conditions from all tokens.<br></li>
                            <li><b>Use Messages </b>— Enables messages to be included with conditions; will query for a message whenever a condition is added to a token.<br></li>
                            <li><b>Auto Add Spells </b>— Enables Combat Master to detect spells and add them to Combat Master.  Note: Not all spells can be detected due to programming of that sheet<br></li>
                            <li><b>Sheet </b>— Current Supported Sheets (OGL, Shaped, PF2, PF1)<br></li>
                        </ul>
                    </div>`;
        handout.set({notes:notes});
    },

    buildConcentrationMenu = (handout,setupID) => {
         let notes = `<div class="content note-editor notes">
                        <p>
                            <img src="https://s3.amazonaws.com/files.d20.io/images/152155091/gy3wl9H_uHBHWeQXcRk5cw/original.png?15953856105">
                        </p>
                        <h4><i>Concentration Setup</i></h4>
                        <ul>
                            <li><b>Use Concentration </b>— Enables Concentration process<br></li>
                            <li><b>Add Marker </b>— Automatically adds your concentration marker to token.  Concentration spell has to exist in Combat Master<br></li>
                            <li><b>Check for Save </b>— Notifies that a save is needed when damage is applies and concentration exists on token<br></li>
                            <li><b>Notify </b>— Notify everyone or GM when concentration save is needed<br></li>
                            <li><b>Wound Bar </b>— Identifies which bar in the token is tracking wounds for purposes of concentration save and notification<br></li>
                            <li><b>Auto Add Spells </b>— Enables Combat Master to detect spells and add them to Combat Master.  Note: Not all spells can be detected due to programming of that sheet<br></li>
                            <li><b>Sheet </b>— Current Supported Character Sheet (OGL, Shaped, PF2, PF1)<br></li>
                        </ul>
                    </div>`;
        handout.set({notes:notes});
    },

    buildConditionsMenu = (handout,setupID) => {
        let notes = `<div class="content note-editor notes">
                        <p>
                            <img src="https://s3.amazonaws.com/files.d20.io/images/152155101/zyFZLPVbsoAT7a1CI9bVEg/original.png?15953856105">
                        </p>
                        <h4><i>Conditions Menu</i></h4>
                        <ul>
                            <li><b>Icon </b>— The default or custom token marker assigned to the condition is displayed here. If the condition uses the TokenCondition script, it will simply show "TC" here.</li><li><b>Name </b>— The name of the condition.</li>
                            <li><b>Edit </b>— Shows the <a href="http://journal.roll20.net/handout/-M5yiGl9bj-bn0V-72pd">Condition Editing Menu</a> for that condition.</li>
                            <li><b>Add Condition </b>— Create a new condition. You will first be prompted for a condition name, then it will show you the new condition's Editing Menu.<br></li>
                        </ul>
                    </div>`;
        handout.set({notes:notes});

    },

    buildConditionMenu = (handout,setupID) => {
        let notes = `<div class="content note-editor notes">
                        <p>
                            <img src="https://s3.amazonaws.com/files.d20.io/images/152155092/bngB_blWo6C8bSBvU6ytGw/original.png?15953856105">
                        </p>
                        <h4><i>Condition Menu</i></h4>
                        <ul>
                            <li><b>Name </b>— The name of the condition<br></li>
                            <li><b>Type </b>— Determines if a Spell or Condition.  Set to spell if using concentration<br></li>
                            <li><b>Icon Type </b>— Determines what options are presented when clicking <b>Icon</b>.<br></li>
                            <ul>
                                <li>CombatMaster — Lets you pick from Roll20 default markers only.</li>
                                <li>TokenMarker — Requires the libTokenMarker script; lets you pick from any marker sets in your game, including Roll20 default.<br><b>NOTE:</b> <i>Token marker names with spaces may cause issues, it is recommended to avoid spaces in token marker names.</i></li>
                                <li>TokenCondition — Requires the TokenCondition script; lets you pick from any characters used by this script.<br></li>
                            </ul>
                            <li><b>Icon </b>— Thumbnail of the marker that will be used by the current condition; click to change (options based on your selection for <b>Icon Type</b>). If using TokenCondition for the condition, thumbnail will be replaced by "TC".<br></li>
                            <li><b>Duration </b>— Defines the length of the condition before it is removed.<br></li>
                            <li><b>Direction </b>— Defines how quickly the duration is reduced each round.  Set to a negative number to reduce the duration, positive number if it increases over time, or 0.  If 0, it remains permanently on the token until manually removed.</li>
                            <li><b>Override </b>— Determines if the direction/duration can be overridden when assigning the condition to the token.  For conditions that do not change, set override to  false and the direction/duration roll queries do not display when assigning the condition.</li>
                            <li><b>Favorites </b>— Determines if the condition shows in the Favorites menu.  This can also be set on the Main Menu.  The Favorites menu shows only conditions marked as Favorite.<br></li>
                            <li><b>Message </b>— Set a default message that will show along with the condition. It can be overridden when assigning the condition. If you have commas in the description, use brackets {{ and }} around it when entering it.<br></li>
                            <li><b>Targeted </b>— Determines if the condition applies to another token; useful for effects that affect one or more targets but have a duration based on the caster's turn. Applies the condition's marker to the target token(s). Rather than using the @{target} feature, the GM will see the following message in chat:<br>&lt;Image of the Select Targets message&gt;<br></li>
                            <li><b>Concentration </b>— Set to true if a Spell and Spell causes concentration on the caster<br></li>
                            <li><b>Add API </b>— Displays the Add API Menu.  Click on this if you want an external API call when adding a condition to a token(s)<br></li>
                            <li><b>Remove API </b>— Displays the Remove API Menu.  Click on this if you want an external API call when removing a condition from a token(s)<br></li>
                            <li><b>Edit Description </b>— Add a description to condition.  Use {{ }} if there's periods or commas in descrription<br></li>
                            <li><b>Delete Condition </b>— Delete the condition from CombatMaster.<br></li>
                        </ul>
                     </div>`;

        handout.set({notes:notes});
    },

    buildAddAPIMenu = (handout,setupID) => {
        let notes = `<div class="content note-editor notes"><p>Use the Macro & API menu to setup Substitution Strings if needed. For example, if you want CombatMaster to run a macro that would normally use @{selected|character_id}, you would need to set up a substitution string for CharID, then use that string in place of @{selected|character_id} in the macro itself.</p><p>Substitution strings work best as unique terms that won't be used elsewhere in a command or macro, otherwise CombatMaster may insert a substituted call somewhere it doesn't belong. So you'd want the TokenID substitute to be something like 'tokenidentifier' since that isn't likely to be used anywhere else, whereas 'name' is not a good substitute, because it is a word that is likely to be used in other contexts.</p><p>The PlayerID substitution string is specifically for use in TokenMod commands. If you set the PlayerID substitution to something like 'playeridentifier', then a TokenMod command in CombatMaster would look like this:</p><pre>!token-mod --api-as playeridentifier --ids tokenidentifier --on showname<br></pre>
                        <p>
                            <img src="https://s3.amazonaws.com/files.d20.io/images/152155097/fpdZk-v1a2C7miDJmJ1NIA/original.png?15953856105">
                        </p>`;
        notes += buildExternalCallMenu('<b>Add API</b>');

        handout.set({notes:notes});
    },

    buildRemoveAPIMenu = (handout,setupID) => {
        let notes = `<div class="content note-editor notes"><p>Use the Macro & API menu to setup Substitution Strings if needed. For example, if you want CombatMaster to run a macro that would normally use @{selected|character_id}, you would need to set up a substitution string for CharID, then use that string in place of @{selected|character_id} in the macro itself.</p><p>Substitution strings work best as unique terms that won't be used elsewhere in a command or macro, otherwise CombatMaster may insert a substituted call somewhere it doesn't belong. So you'd want the TokenID substitute to be something like 'tokenidentifier' since that isn't likely to be used anywhere else, whereas 'name' is not a good substitute, because it is a word that is likely to be used in other contexts.</p><p>The PlayerID substitution string is specifically for use in TokenMod commands. If you set the PlayerID substitution to something like 'playeridentifier', then a TokenMod command in CombatMaster would look like this:</p><pre>!token-mod --api-as playeridentifier --ids tokenidentifier --on showname<br></pre>
                        <p>
                            <img src="https://s3.amazonaws.com/files.d20.io/images/152155093/xt61MIhDuu93ZCOu7Tt8xA/original.png?15953856105">
                        </p>`;
        notes += buildExternalCallMenu('<b>Remove API</b>');

        handout.set({notes:notes});
    },

    buildExportMenu = (handout) => {
        let notes = `<div class="content note-editor notes">
                        <p>
                            <img src="https://s3.amazonaws.com/files.d20.io/images/152155090/ilEH0Pon0ovgR1LMmKEAag/original.png?15953856105">
                        </p>
                        <h4><i>Export Menu</i></h4>
                        <p>This configuration code can be copied so you can import your conditions and settings into another game with CombatMaster. Simply triple-click the code to select it entirely (this also avoids selecting anything outside the code block). Save it in a handout to easily transmogrify to other games, or save it as a file on your computer.</p>
                        <p><b>NOTE:</b> <i>If migrating from CombatMaster to another CombatMaster, it will copy the entire CombatMaster configuration.  If coming from CombatTracker, it will only copy the conditions and you’ll have to reconfigure everything else. Importing from StatusInfo is not supported.</i></p>
                    </div>`;

        handout.set({notes:notes});
    },

    checkInstall = () => {
        state[combatState] || (state[combatState] = {});
        setDefaults();
        buildHelp();
        logger(script_name + ' Ready! Command: !cmaster --main');
    },

    registerEventHandlers = () => {
        //logger('registerEventHandlers !!!');
        //logger('registerEventHandlers turnorder=' + JSON.stringify(Campaign().get('turnorder')));
        on('chat:message', inputHandler);
        on('close:campaign:turnorder', handleTurnorderChange);
        on('change:campaign:turnorder', handleTurnorderChange);
        on('change:graphic:statusmarkers', handleStatusMarkerChange);
        on('change:campaign:initiativepage', handleInitiativePageChange);
        on('change:graphic:top', handleGraphicMovement);
        on('change:graphic:left', handleGraphicMovement);
        on('change:graphic:layer', handleGraphicMovement);
        on('destroy:graphic', handleGraphicDelete);
        on('change:graphic:'+state[combatState].config.concentration.woundBar+'_value', handleConstitutionSave);

        for (const item of [DeathTracker, InspirationTracker, TokenMod])
            if ('undefined' !== typeof item && item.ObserveTokenChange)
                item.ObserveTokenChange(handleStatusMarkerChange);
    };

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers,
        ObserveTokenChange: observeTokenChange,
        addConditionToToken,
        removeConditionFromToken,
        addTargetsToCondition,
        getConditions,
        getConditionByKey,
        sendConditionToChat,
        getDefaultIcon
    };
})();

on('ready',function() {
    'use strict';

    CombatMaster.CheckInstall();
    CombatMaster.RegisterEventHandlers();
});
