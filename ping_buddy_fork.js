// dirty fork from https://gist.github.com/keithcurtis1/536c5e575e4ef6ba40a519eca17b392a
// from user https://gist.github.com/keithcurtis1

on("ready", function() {

    const theGM = findObjs({
            type: 'player'
        })
        .find(o => playerIsGM(o.id)),
        defaultColor = '#ffcc00';
    let originalColor, intervalId;
        
    // When page loads, ping pull to "Player" Token
    on("change:campaign:playerpageid", function() {
        setTimeout(function() {
                pingPlayerToken();
            },
            1500);
    });

    on("change:campaign:playerspecificpages", function(objNew, old) {
        let newPages = JSON.parse(JSON.stringify(objNew)); // ??? dunno why but i need to do that
        for (const key in newPages.playerspecificpages) {
            if (old.playerspecificpages[key] && newPages.playerspecificpages[key] !== old.playerspecificpages[key]) {
                log(`DIFF ON key=${key}, NEW=${newPages.playerspecificpages[key]}`);
                setTimeout(() => pingPlayerToken(newPages.playerspecificpages[key]), 1500);
            }
        }
    });

    function getPlayerPageOrDefault(playerId) {
        const pages = Campaign().get("playerspecificpages");
        if (playerId === theGM.get('_id'))
            return theGM.get('_lastpage');
        return (pages && (playerId in pages)) ? pages[playerId] : Campaign().get("playerpageid");
    }

    // !pingplayer - Finds and Ping Pulls player token
    on("chat:message", function(msg) {
        if (msg.type == "api" && msg.content.indexOf("!pingplayer") == 0)
            pingPlayerToken(getPlayerPageOrDefault(msg.playerid), "Party", (theGM.get('_id') === msg.playerid) ? undefined : msg.playerid);
    });


    // !pingpme - Finds and Ping Pulls first found token belonging to a player
    on("chat:message", function(msg) {
        if (msg.type === "api" && msg.content.indexOf("!pingme") === 0) {
            const rektMode = msg.content.indexOf('REKT') !== -1;
            let tokens = findObjs({
                _type: "graphic",
                _pageid: getPlayerPageOrDefault(msg.playerid)
            });
            if (undefined === tokens) {
                return;
            }

            myTokens = [];
            let char = [];
            tokens.forEach(t => {
                //log("player id = " + msg.playerid);
                if (t && t.get("represents").length > 0) {
                    char = findObjs({
                        type: 'character',
                        id: t.get("represents")
                    })[0];
                    if (char && char.get('controlledby').includes(msg.playerid))
                        myTokens.push(t);
                }
            });

            const player = findObjs({
                id: msg.playerid
            })[0],
                  playerName = player.get("_displayname"),
                  playerAs = player.get("speakingas");
            if (myTokens.length > 0) {
                let myToken = myTokens[0];
                if (myTokens.length > 1) {
                    log(`Logging all token founds`);
                    for (const token of myTokens)
                        log(`token name=${token.get('name')}, layer=${token.get('layer')}, top=${token.get('top')}, left=${token.get('left')}`);
                    // handle remove for AS too
                    if (rektMode && myToken.get('layer') === 'gmlayer') {
                        log(`Deleting Token !`);
                        myToken.remove();
                        myToken = myTokens[1];
                    }
                    if (playerAs.indexOf('character|') === 0) {
                        const slice = playerAs.slice(10);
                        let myToken2 = myTokens.filter(i => i.get('represents') === slice)[0];
                        log(`slice=${slice}, myToken2=${JSON.stringify(myToken2)}`);

                        if (myToken2) myToken = myToken2
                        else          sendChat("Ping Buddy", `/w "${playerName}" There is no Token representing "${getObj('character', slice).get('name')}" (the Character selected) belonging to ${playerName} at this moment but another you represent has been found ! Pinging to this one.`, null, {noarchive: true});
                    }
                }
                if (myToken.get('layer') === 'gmlayer') {
                    log(`ABORT PING: GMLAYER ! TokenName=${myToken.get('name')}, player=${playerName}`);
                    sendChat("Ping Buddy", `/w "${playerName}" Character belonging to ${playerName} can be found on GM Layer, ask GM if its normal.`, null, {noarchive: true});
                    return;
                }
                sendPing(myToken.get("left"), myToken.get("top"), myToken.get("pageid"), theGM.id, true, msg.playerid);
                log(`PINGED player=${msg.playerid}, page=${myToken.get("pageid")}, tokenName=${myToken.get('name')}`);
            } else {
                sendChat("Ping Buddy", `/w "${playerName}" No character belonging to ${playerName} can be found on this page.`, null, {noarchive: true});
            }
        }
    });



    // When "Player" token moves, invisibly ping pull all players to it
    on("change:graphic", function(obj, prev) {
        if (['Party', 'LookHere'].includes(obj.get("name"))) {
            const localGmCol = theGM.get("color");
            if (!originalColor || localGmCol !== 'transparent')
                originalColor = localGmCol === 'transparent' ? defaultColor : localGmCol;
            theGM.set("color", "transparent");

            pingPlayerToken(obj.get("_pageid"), obj.get("name"));

            if (intervalId) clearInterval(intervalId);
            intervalId = setTimeout(() => {
                theGM.set("color", originalColor);
                intervalId = undefined;
            }, 2000);
        }

    });

    //Pulls to token named "Player"
    function pingPlayerToken(page = Campaign().get("playerpageid"), name = "Party", whisperTo) {
        var tokens = findObjs({
            _name: name,
            _type: "graphic",
            _pageid: page
        });
        if (tokens.length < 1) {
            sendChat("Ping Buddy", `/w gm No Token named '${name}' can be found on this page (${getObj('page', page).get('name')}).`, null, {noarchive: true});
            return;
        }
        if (tokens.length > 1)
            log("Ping Buddy> Multiple Party token on this map, pinging Last one created(??, its the last in the findObj array)");
        var playerStartToken = tokens[tokens.length - 1];
        if (playerStartToken === undefined) return;

        sendPing(playerStartToken.get("left"), playerStartToken.get("top"), playerStartToken.get("pageid"), theGM.id, true, whisperTo);
    }
});