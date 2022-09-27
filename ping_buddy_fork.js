// dirty fork from https://gist.github.com/keithcurtis1/536c5e575e4ef6ba40a519eca17b392a
// from user https://gist.github.com/keithcurtis1

on("ready", function() {

    const theGM = findObjs({
            type: 'player'
        })
        .find(o => playerIsGM(o.id));
        
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

    // !pingplayer - Finds and Ping Pulls player token
    on("chat:message", function(msg) {
        if (msg.type == "api" && msg.content.indexOf("!pingplayer") == 0) {
            pingPlayerToken();
        }
    });


    // !pingpme - Finds and Ping Pulls first found token belonging to a player
    on("chat:message", function(msg) {
        if (msg.type === "api" && msg.content.indexOf("!pingme") === 0) {

            let pages = Campaign().get("playerspecificpages");
            let page = (pages && (msg.playerid in pages)) ? pages[msg.playerid] : Campaign().get("playerpageid");
            //log(`page=${page}, playerPageId=${Campaign().get("playerpageid")}`);
            let tokens = findObjs({
                _type: "graphic",
                _pageid: page
            });
            if (undefined === tokens) {
                return;
            }

            myTokens = [];
            let char = [];
            tokens.forEach(t => {
                //log("player id = " + msg.playerid);
                if (t.get("represents").length > 0) {
                    char = findObjs({
                        type: 'character',
                        id: t.get("represents")
                    })[0];
                    if (char.get('controlledby').includes(msg.playerid))
                        myTokens.push(t)
                }
            });

            if (myTokens.length > 0) {
                if (myTokens.length > 1) log(`tokenfound length=${myTokens.length} !!! found=${JSON.stringify(myTokens)}`);
                let myToken = myTokens[0];
                sendPing(myToken.get("left"), myToken.get("top"), myToken.get("pageid"), theGM.id, true, msg.playerid);
                log(`PINGED player=${msg.playerid}, page=${myToken.get("pageid")}`);
            } else {
                let playerName = findObjs({
                    id: msg.playerid
                })[0].get("_displayname");

                sendChat("Ping Buddy", `/w "${playerName}" No character belonging to ${playerName} can be found on this page.`, null, {noarchive: true});
            }
        }
    });



    // When "Player" token moves, invisibly ping pull all players to it
    on("change:graphic", function(obj, prev) {
        if (obj.get("name") === "Party") {
            let originalColor = theGM.get("color");
            theGM.set("color", "transparent");

            pingPlayerToken(obj.get("_pageid"));
            setTimeout(() => theGM.set("color", originalColor), 1200);
        }

    });


    //Pulls to token named "Player"
    function pingPlayerToken(page = Campaign().get("playerpageid")) {
        var tokens = findObjs({
            _name: "Party",
            _type: "graphic",
            _pageid: page
        });
        var playerStartToken = tokens[0];
        if (playerStartToken === undefined) return;

        sendPing(playerStartToken.get("left"), playerStartToken.get("top"), playerStartToken.get("pageid"), theGM.id, true);
    }
});