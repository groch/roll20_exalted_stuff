// Based on this work, edited to handle multiple twins per token

// Github:   https://github.com/shdwjk/Roll20API/blob/master/Twins/Twins.js
// By:       The Aaron, Arcane Scriptomancer
// Contact:  https://app.roll20.net/users/104025/the-aaron

var MultiTwins = MultiTwins || (function() {
    'use strict';

    var version = '0.1.0',
        lastUpdate = 1722378715979,
        schemaVersion = 0.1,
        script_name = 'MultiTwins',

        props = [
            'left', 'top', 'width', 'height', 'rotation', 'layer', 'isdrawing',
            'flipv', 'fliph', 'bar1_value', 'bar1_max', 'bar1_link',
            'bar2_value', 'bar2_max', 'bar2_link', 'bar3_value', 'bar3_max',
            'bar3_link', 'aura1_radius', 'aura1_color', 'aura1_square',
            'aura2_radius', 'aura2_color', 'aura2_square', 'tint_color',
            'statusmarkers', 'showplayers_name', 'showplayers_bar1',
            'showplayers_bar2', 'showplayers_bar3', 'showplayers_aura1',
            'showplayers_aura2', 'playersedit_name', 'playersedit_bar1',
            'playersedit_bar2', 'playersedit_bar3', 'playersedit_aura1',
            'playersedit_aura2', 'light_radius', 'light_dimradius',
            'light_otherplayers', 'light_hassight', 'light_angle',
            'light_losangle', 'lastmove'
        ],



    checkInstall = function() {
        log('-=> MultiTwins v'+version+' <=-  ['+(new Date(lastUpdate*1000))+']');

        if( ! _.has(state,'MTwins') || state.MTwins.version !== schemaVersion) {
            log('  > Updating Schema to v'+schemaVersion+' <');
            state.MTwins = {
                version: schemaVersion,
                twins: {}
            };
        }
    },

    removeTwins = function(id) {
        _.chain(state.MTwins.twins)
            .map(function(v,k){
                if(id === k || id === v || Array.isArray(v) && v.includes(id)) {
                    return k;
                }
                return undefined;
            })
            .reject(_.isUndefined)
            .each(function(k){
                let v = state.MTwins.twins[k];
                if (typeof v === 'string' || k === id) {
                    sendChat(script_name, '/w gm Removing twins : '+v);
                    delete state.MTwins.twins[k];
                } else if (Array.isArray(v)) {
                    sendChat(script_name, '/w gm Removing twin for : '+v);
                    v.splice(v.indexOf(id), 1);
                    if (v.length === 0) {
                        sendChat(script_name, '/w gm Empty twin list for : '+v+'=> REMOVING KEY');
                        delete state.MTwins.twins[k];
                    }
                } else {
                    log('removeTwins:: ?!?! Error, v is not string nor array !?!?!?!');
                }
            });
    },

    createOrPushTwin = function(id1, id2) {
        let storedTwinArray = state.MTwins.twins[id1];
        if (!storedTwinArray || typeof storedTwinArray === 'string') {
            sendChat(script_name, '/w gm Created new Twins.');
            state.MTwins.twins[id1] = [id2];
        } else {
            sendChat(script_name, `/w gm Added Twin ${id2} to ${id1}.`);
            storedTwinArray.push(id2);
        }
        return state.MTwins.twins[id1];
    },

    addTwins = function(args) {
        const id1 = args[0], id2 = args[1];

        let linkedTo1 = createOrPushTwin(id1, id2);
        let linkedTo2 = createOrPushTwin(id2, id1);
        _.chain(linkedTo2)
            .reject(i => i === id1)
            .each(id => {
                sendChat(script_name, `/w gm Added other Twins from ${id2} to ${id1}.:${id}`);
                linkedTo1.push(id)
            });
        // update & add to existing twins if include 1 or 2 & add backward
        _.chain(state.MTwins.twins)
            .map(function(v,k){
                if(v === id1 || v === id2 || Array.isArray(v) && (v.includes(id1) || v.includes(id2))) {
                    return k;
                }
                return undefined;
            })
            .reject(_.isUndefined)
            .each(function(k){
                const v = state.MTwins.twins[k];
                if (typeof v === 'string') {
                    sendChat(script_name, '/w gm Updating twin : '+k);
                    state.MTwins.twins[k] = [state.MTwins.twins[k]];
                }
                if (Array.isArray(v)) {
                    if (!v.includes(id1) && k !== id1) {
                        sendChat(script_name, '/w gm Adding twin 1 for : '+v);
                        state.MTwins.twins[k].push(id1);
                        if (!linkedTo1.includes(k))
                            linkedTo1.push(k);
                    }
                    if (!v.includes(id2) && k !== id2) {
                        sendChat(script_name, '/w gm Adding twin 2 for : '+v);
                        state.MTwins.twins[k].push(id2);
                        if (!linkedTo2.includes(k))
                            linkedTo2.push(k);
                    }
                } else {
                    log('addTwin:: ?!?! Error, v is not string nor array !?!?!?!');
                }
            });
    },

    handleInput = function(msg) {
        var args,t1,t2;

        if (msg.type !== "api" || !playerIsGM(msg.playerid)) {
            return;
        }

        args = msg.content.split(/\s+/);
        switch(args.shift()) {
            case '!mtwins':
                if(args.length !== 2) {
                   sendChat(script_name, '/w gm Please specify two token IDs as argument to !mtwins');
                   return;
                }

                if (args[0] === args[1]) {
                    sendChat(script_name, '/w gm Please specify two DIFFERENT IDs to !mtwins');
                    return;
                }

                t1 = getObj('graphic', args[0]);
                t2 = getObj('graphic', args[1]);

                if(t1 && t2){
                    addTwins(args);
                } else {
                    if(!t1) {
                       sendChat(script_name, '/w gm Could not find a token for: '+args[0]);
                    }
                    if(!t2) {
                       sendChat(script_name, '/w gm Could not find a token for: '+args[1]);
                    }
                }

                break;

            case '!not-mtwins':
                if(args.length !== 1) {
                   sendChat(script_name, '/w gm Please specify one token ID to remove.');
                   return;
                }
                removeTwins(args[0]);
                break;

            case '!reset-mtwins':
                log ('reset twins obj')
                state.MTwins.twins = {};

            case '!print-mtwins':
                log(`twins obj=${JSON.stringify(state.MTwins.twins)}`)
                break;
        }
    },

    handleRemoveToken = function(obj) {
        removeTwins(obj.id);
    },

    handleTwinChange = function(obj) {
        const id = obj.id;
        if (id in state.MTwins.twins) {
            _.chain(state.MTwins.twins[id]).each(id => {
                let twin = getObj('graphic', id);
                twin.set(_.reduce(props,function(m,p){
                    m[p]=obj.get(p);
                    return m;
                },{}));
            });
        }
    },

    registerEventHandlers = function() {
        on('chat:message', handleInput);
        on('change:graphic', handleTwinChange);
        on('destroy:graphic', handleRemoveToken);
    };

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers
    };
    
}());

on("ready",function(){
	'use strict';

    MultiTwins.CheckInstall();
    MultiTwins.RegisterEventHandlers();
});