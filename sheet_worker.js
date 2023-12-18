    const version = 2.62, debug = 1;
    var TAS;

    /**
     *
     *  FROM https://github.com/onyxring/Roll20Async
     *
     */
    function setActiveCharacterId(charId){
        var oldAcid=getActiveCharacterId();
        var ev = new CustomEvent("message");
        ev.data={"id":"0", "type":"setActiveCharacter", "data":charId};
        self.dispatchEvent(ev);
        return oldAcid;
    }
    var _sIn=setInterval;
    setInterval=function(callback, timeout){
        var acid=getActiveCharacterId();
        _sIn(
            function(){
                var prevAcid=setActiveCharacterId(acid);
                callback();
                setActiveCharacterId(prevAcid);
            }
        ,timeout);
    }
    var _sto=setTimeout;
    setTimeout=function(callback, timeout){
        var acid=getActiveCharacterId();
        _sto(
            function(){
                var prevAcid=setActiveCharacterId(acid);
                callback();
                setActiveCharacterId(prevAcid);
            }
        ,timeout);
    }
    async function getAttrsAsync(props){
        var acid=getActiveCharacterId(); //save the current activeCharacterID in case it has changed when the promise runs
        var prevAcid=null;               //local variable defined here, because it needs to be shared across the promise callbacks defined below
        try {
            return await new Promise((resolve, reject) => {
                prevAcid = setActiveCharacterId(acid); //in case the activeCharacterId has changed, restore it to what we were expecting and save the current value to restore later
                try {
                    getAttrs(props, (values) => { resolve(values); });
                }
                catch { reject(); }
            });
        } finally {
            setActiveCharacterId(prevAcid); //restore activeCharcterId to what it was when the promise first ran
        }
    }
    //use the same pattern for each of the following...
    async function setAttrsAsync(propObj, options){
        var acid=getActiveCharacterId();
        var prevAcid=null;
        try {
            return await new Promise((resolve, reject) => {
                prevAcid = setActiveCharacterId(acid);
                try {
                    setAttrs(propObj, options, (values) => { resolve(values); });
                }
                catch { reject(); }
            });
        } finally {
            setActiveCharacterId(prevAcid);
        }
    }

    async function getSectionIDsAsync(sectionName){
        var acid=getActiveCharacterId();
        var prevAcid=null;
        try {
            return await new Promise((resolve, reject) => {
                prevAcid = setActiveCharacterId(acid);
                try {
                    getSectionIDs(sectionName, (values) => { resolve(values); });
                }
                catch { reject(); }
            });
        } finally {
            setActiveCharacterId(prevAcid);
        }
    }
    async function getSingleAttrAsync(prop){
        var acid=getActiveCharacterId();
        var prevAcid=null;
        try {
            return await new Promise((resolve, reject) => {
                prevAcid = setActiveCharacterId(acid);
                try {
                    getAttrs([prop], (values) => { resolve(values[prop]); });
                }
                catch { reject(); }
            });
        } finally {
            setActiveCharacterId(prevAcid);
        }
    }
    ///////////////////////// from Chris D.(https://app.roll20.net/users/633707) and Jakob (https://app.roll20.net/users/726129)
    // a version of getSectionIDs that returns the IDs in the order that they are displayed.
	// getSectionIDs returns in the order the repeating section lines were created. The user has the ability to reorder the lines.
	// getAttrs( [ "_reporder_repeating_" + section_name] , ... ) returns an empty object if the lines were not reordered,
	// and may return an incomplete list or a list with items that were since deleted.
	// This returns a complete and accurate list in the order that they are displayed.
    ///
    // I personally added the Async version so i could use the await keyword, and tweaked for my use
    async function getSectionIDsOrderedAsync(sectionName) {
        var acid=getActiveCharacterId();
        var prevAcid=null;
        try {
            return await new Promise((resolve, reject) => {
                prevAcid = setActiveCharacterId(acid);
                try { getSectionIDsOrdered(sectionName, (values) => { resolve(values); }); }
                catch { reject(); }
            });
        } finally {
            setActiveCharacterId(prevAcid);
        }
    }
    function getSectionIDsOrdered(sectionName, callback) {
        'use strict';
        getAttrs([`_reporder_repeating_${sectionName}`], function (values) {
            let reporder = values[`_reporder_repeating_${sectionName}`];
            if (!reporder) // There is no ordering, so just call the standard getSectionIDs and tell it to run the callback passed to us.
                getSectionIDs(sectionName, callback);
            else
                getSectionIDs(sectionName, function (idArray) {
                    callback([...new Set(reporder.toLowerCase().split(",").filter(x => idArray.includes(x)).concat(idArray))]);
                });
        });
    };

    /////////////////////////

    function setDebugWrapper(fx) { return debug === 2 ? TAS._fn(fx) : fx }
    function cleanAttrs(attrs)  { return _.mapObject(attrs, function(e) { return e === undefined ? '' : e; }); };

    initTAS();
    if (debug) TAS.debugMode();
    on('sheet:opened', setDebugWrapper(updateWound));
    on('change:pain-tolerance', TAS._fn(updateWound));
    on('change:repeating_health remove:repeating_health', TAS._fn(updateWound));
    on('change:combat-crippling-pen change:combat-disable-pen change:woundpenalty-add', TAS._fn(updateWound));

    async function sortHealthRepeatableSection(idHealthArray, healthFieldNames) {
        var attribs = ["_reporder_repeating_health", ...healthFieldNames];
        if (!healthFieldNames) for (const id of idHealthArray) attribs.push(`repeating_health_${id}_hl-damage`, `repeating_health_${id}_hl-penalty`);
        const v = await getAttrsAsync(attribs);
        var final_array = _(idHealthArray).chain().sortBy(function(id) {
            return v[`repeating_health_${id}_hl-penalty`] === 'I' ? 5 : -1 * Number(v[`repeating_health_${id}_hl-penalty`]);
        }).value();
        if(final_array && final_array.length > 0) {
            setSectionOrder("health", final_array);
        };
    }

    async function updateWound(e) {
        if (e.sourceType !== "player") {
            if (debug === 2) TAS.debug(`updateWound:: TRIGGER FROM SCRIPT => CANCEL`);
            return;
        }
        if (debug === 2) TAS.debug(`Updating wound penalty e=${JSON.stringify(e)}`);

        const idHealthArray = await getSectionIDsAsync("health");
        let finalAttr = {};
        const healthFieldNames = [];
        idHealthArray.forEach(id => healthFieldNames.push(`repeating_health_${id}_hl-damage`, `repeating_health_${id}_hl-penalty`));
        sortHealthRepeatableSection(idHealthArray, healthFieldNames);

        const valuesSections = await getAttrsAsync([...healthFieldNames, 'wound-penalty', 'health-displayed', 'health-displayed_max', 'combat-crippling-pen', 'combat-disable-pen', 'woundpenalty-add', 'pain-tolerance', 'battlegroup']);
        let sortedIdHealthArray = _(idHealthArray).chain().sortBy(function(id) {
            return valuesSections[`repeating_health_${id}_hl-penalty`] === 'I' ? 5 : -1 * Number(valuesSections[`repeating_health_${id}_hl-penalty`]);
        }).value();

        const oldPen = Number(valuesSections['wound-penalty']) || 0,
              oldActual = Number(valuesSections['health-displayed']) || 0,
              oldMax = Number(valuesSections['health-displayed_max']) || 0,
              disablePen = Number(valuesSections['combat-disable-pen']) || 0;
        let pen = 0, actualHealth = 0, maxHealth = sortedIdHealthArray.length;
        for (const id of sortedIdHealthArray.reverse()) {
            let dmg =       valuesSections[`repeating_health_${id}_hl-damage`],
                localPen =  valuesSections[`repeating_health_${id}_hl-penalty`];
            if (dmg && (!dmg || dmg !== 'healthy')) {
                if (localPen)    pen = localPen;
                else             pen = 0;
                if (pen === 'I') pen = -4;
                if (pen === '')  pen = 0;
                break;
            } else
                actualHealth++;
        }
        pen = Math.abs(Number(pen));
        if (pen > 1 && Number(valuesSections['pain-tolerance'])) pen--;
        pen = Number(valuesSections['combat-crippling-pen'])
            ? Math.abs(Number(valuesSections['woundpenalty-add'])) + pen * 2
            : Math.abs(Number(valuesSections['woundpenalty-add'])) + pen;
        if (disablePen) pen = 0;
        if (oldPen !== pen) finalAttr = { 'wound-penalty': pen };
        if (!Number(valuesSections['battlegroup'])) {
            if (debug === 2) TAS.debug(`updateWound:: maxHealth=${maxHealth} actualHealth=${actualHealth}`);
            if (oldActual !== actualHealth) finalAttr = { ...finalAttr, 'health-displayed': actualHealth};
            if (oldMax !== maxHealth)       finalAttr = { ...finalAttr, 'health-displayed_max': maxHealth };
        }
        if (Object.keys(finalAttr).length !== 0) {
            TAS.debug('updateWound:: UPDATE WOUNDPEN & Health Displayed', finalAttr);
            setAttrs(finalAttr);
        }

        if (oldPen !== pen) {
            TAS.debug('updateWound:: PEN CHANGED ! calling updateParry');
            updateParry(e);
        }
    }

    on('sheet:opened', setDebugWrapper(updateParry));
    on('change:dexterity change:brawl change:melee', TAS._fn(updateParry));
    on('change:ma-snake change:ma-tiger change:ma-void change:ma-reaper change:ma-ebon change:ma-crane change:ma-nightingale '
      +'change:ma-devil change:ma-claw change:ma-pearl change:ma-steel', TAS._fn(updateParry));
    on('change:repeating_martialarts remove:repeating_martialarts change:repeating_weapon:repweapondef change:repeating_weapon:repweaponabi remove:repeating_weapon', TAS._fn(updateParry));
    on('change:qc-parry', TAS._fn(updateParry));

    async function updateParry(e) {
        if (e.sourceType !== "player" && e.triggerName !== 'wound-penalty') {
            if (debug === 2) TAS.debug(`updateParry:: TRIGGER FROM SCRIPT => CANCEL`);
            return;
        }
        const values = await getAttrsAsync(['wound-penalty', 'qc', 'brawl', 'melee', 'dexterity', 'qc-parry']);
        const pen = values['wound-penalty'] || 0;
        var finalAttr = {};
        if (debug === 2) TAS.debug('updateParry:: Testing qc=' + values['qc'] + ', values=' + JSON.stringify(values) + ', e=' + JSON.stringify(e));
        TAS.repeating('martialarts').fields('repmartialarts').attrs('ma-snake', 'ma-tiger', 'ma-void', 'ma-reaper', 'ma-ebon', 'ma-crane',
            'ma-nightingale', 'ma-devil', 'ma-claw', 'ma-pearl', 'ma-steel').tap(setDebugWrapper(async function getMaxMaAndApply(rows, attrs) {
            var ma = Math.max(0, attrs.I['ma-snake'], attrs.I['ma-tiger'], attrs.I['ma-void'], attrs.I['ma-reaper'],
                                attrs.I['ma-ebon'], attrs.I['ma-crane'], attrs.I['ma-nightingale'], attrs.I['ma-devil'],
                                attrs.I['ma-claw'], attrs.I['ma-pearl'], attrs.I['ma-steel']);
            const dex = Number(values['dexterity']),
                brawl = Number(values['brawl']),
                melee = Number(values['melee']),
                qcParry = Number(values['qc-parry']),
                isQc = Number(values['qc']),
                correspondingTable = {
                    'brawl': brawl,
                    'melee': melee,
                    'snake': attrs.I['ma-snake'],
                    'tiger': attrs.I['ma-tiger'],
                    'void': attrs.I['ma-void'],
                    'reaper': attrs.I['ma-reaper'],
                    'ebon': attrs.I['ma-ebon'],
                    'crane': attrs.I['ma-crane'],
                    'nightingale': attrs.I['ma-nightingale'],
                    'devil': attrs.I['ma-devil'],
                    'claw': attrs.I['ma-claw'],
                    'pearl': attrs.I['ma-pearl'],
                    'steel': attrs.I['ma-steel']
                };

            if (debug === 2) TAS.debug(`updateParry:: values=${JSON.stringify(values)}, attrs=${JSON.stringify(attrs)}, rows=${JSON.stringify(rows)}`);
            _.each(rows, function(v, k) {
                if (debug === 2) TAS.debug(`updateParry:: v=${JSON.stringify(v)}, k=${k}`);
                ma = Math.max(ma, Number(v.repmartialarts));
            });

            if (debug === 2) TAS.debug(`updateParry:: Max MA=${ma}, isQc=${isQc}, qcParry=${qcParry}`);
            if (debug === 2) TAS.debug('updateParry:: Parry calc:', (isQc ? qcParry : 'Math.ceil((' + dex + ' + Math.max(' + brawl + ', ' + ma + ', ' + melee + ')) / 2)') + ' - ' + pen);
            var newParry = (isQc ? qcParry : Math.ceil((dex + brawl) / 2)) - pen;
            if (debug === 2) TAS.debug('updateParry:: Parry w/specialty calc:', (isQc ? qcParry+1 : 'Math.ceil((' + dex + ' + Math.max(' + brawl + ', ' + ma + ', ' + melee + ') + 1) / 2)') + ' - ' + pen);
            var newParrySpe = (isQc ? qcParry+1 : Math.ceil((dex + brawl + 1) / 2)) - pen;
            if (debug === 2) TAS.debug('updateParry:: setAttrs!parry='+newParry+', parry-specialty='+newParrySpe);
            finalAttr = {...finalAttr, 'parry': newParry, 'parry-specialty': newParrySpe, 'max-ma': ma};

            if (debug === 2) TAS.debug('updateParry:: Updating Weapon Parry value');
            const idarray = await getSectionIDsAsync("weapon");
            const weaponFieldNames = [];
            idarray.forEach(id => weaponFieldNames.push(`repeating_weapon_${id}_repweapondef`, `repeating_weapon_${id}_repweaponabi`));

            const valuesSections = await getAttrsAsync(weaponFieldNames);
            if (debug === 2) TAS.debug(`updateParry:: valuesSections=${JSON.stringify(valuesSections)}`);
            for (const id of idarray) {
                let row = 'repeating_weapon_' + id,
                    def = valuesSections[`${row}_repweapondef`] || 0,
                    abi = valuesSections[`${row}_repweaponabi`] || 'brawl';
                finalAttr[`${row}_repweaponparry`] = abi === 'noParry' ? -420 : Math.ceil((dex + (Object.keys(correspondingTable).includes(abi) ? correspondingTable[abi] : Number(abi))) / 2) + Number(def) - pen;
                finalAttr[`${row}_repweaponparryspe`] = abi === 'noParry' ? -420 : Math.ceil((dex + (Object.keys(correspondingTable).includes(abi) ? correspondingTable[abi] : Number(abi)) + 1) / 2) + Number(def) - pen;
            }
            if (debug === 2) TAS.debug('updateParry:: UPDATE WEAPONS PARRY', finalAttr);
            setAttrs(finalAttr);
        })).execute();
    }

    on('change:rollpenalty-input', TAS._fn(updateRollPenalty));

    async function updateRollPenalty() {
        const rollPenInput = await getSingleAttrAsync('rollpenalty-input');
        TAS.debug(`updateRollPenalty:: ${JSON.stringify(rollPenInput)}`);
        const rollPen = isNaN(Number(rollPenInput)) ? 0 : Math.abs(Number(rollPenInput));
        setAttrs({'roll-penalty': rollPen, ...await repeatGlobalToRepeatableAttrToValue('roll-penalty', rollPen)});
    }

    on('sheet:opened', onCraftChange);
    on('change:craft-armoring change:craft-artifact change:craft-cooking change:craft-artifice change:craft-gemcutting '
        + 'change:craft-geomancy change:craft-jewelry change:craft-tailoring change:craft-forging change:repeating_crafts '
        + 'remove:repeating_crafts', TAS._fn(onCraftChange));

    function onCraftChange(e) {
        if (debug === 2) TAS.debug(`craft changed, e=${JSON.stringify(e)}`);
        TAS.repeating('crafts').fields('repcrafts').attrs('craft-armoring', 'craft-artifact', 'craft-cooking', 'craft-artifice', 'craft-gemcutting', 'craft-geomancy',
            'craft-jewelry', 'craft-tailoring', 'craft-forging').tap(setDebugWrapper(function getMaxCraftAndSet(rows, attrs) {
            var craft = Math.max(0, attrs.I['craft-armoring'], attrs.I['craft-artifact'], attrs.I['craft-cooking'], attrs.I['craft-artifice'],
                                    attrs.I['craft-gemcutting'], attrs.I['craft-geomancy'], attrs.I['craft-jewelry'], attrs.I['craft-tailoring'],
                                    attrs.I['craft-forging']);

            if (debug === 2) TAS.debug(`getMaxCraftAndSet:: attrs=${JSON.stringify(attrs)}, rows=${JSON.stringify(rows)}`);
            _.each(rows, function(v, k) {
                if (debug === 2) TAS.debug(`getMaxCraftAndSet:: v=${JSON.stringify(v)}, k=${k}`);
                craft = Math.max(craft, Number(v.repcrafts));
            });

            if (debug === 2) TAS.debug(`getMaxCraftAndSet:: set Max Craft=${craft}`);
            setAttrs({'max-craft': craft});
        })).execute();
    }

    on('sheet:opened change:battlegroup change:battlegroup-size change:battlegroup-health-levels change:battlegroup-perfect-morale', async function updateBattleGroupMagnitude(e) {
        const idHealthArray = await getSectionIDsAsync("health");
        const values = await getAttrsAsync(["battlegroup-size", "battlegroup-size_max", "battlegroup-health-levels", "battlegroup-perfect-morale"]);
        let bgSize =    Number(values["battlegroup-size"]),
            bgSizeMax = Number(values["battlegroup-size_max"]),
            bgHL =      Number(values["battlegroup-health-levels"]),
            bgPM =      Number(values["battlegroup-perfect-morale"]);
        const objSet = {};
        if (e.sourceAttribute === 'battlegroup' && e.newValue === '1') {
            bgHL = idHealthArray.length;
            objSet['battlegroup-health-levels'] = bgHL;
            bgSize = bgSizeMax;
            objSet['battlegroup-size'] = bgSizeMax;
        }
        objSet["battlegroup-magnitude_max"] = bgSize + bgHL + (bgPM == 1 ? 3 : 0);
        if (e.sourceAttribute === 'battlegroup' && e.newValue === '1') {
            objSet['battlegroup-magnitude'] = objSet["battlegroup-magnitude_max"];
            await addBGDmgRestrictionIfNeeded(objSet);
        } else if (e.sourceAttribute === 'battlegroup' && e.newValue === '0')
            await removeBGDmgRestriction(objSet);
        if (debug === 2) TAS.debug('BG:: perfect-morale=' + JSON.stringify(values["battlegroup-perfect-morale"]));
        if (debug === 2) TAS.debug(`BG:: Setting=`, objSet);
        setAttrs(objSet);
    });

    async function addBGDmgRestrictionIfNeeded(objSet) {
        if (debug === 2) TAS.debug(`addBGDmgRestriction::addBGDmgRestriction`);
        const idCombatAttacks = await getSectionIDsAsync("combat-attack");
        const combatFieldNames = [];
        idCombatAttacks.forEach(id => combatFieldNames.push(`repeating_combat-attack_${id}_repcombat-wdmg-final-macro-options`));
        const valuesSections = await getAttrsAsync([...combatFieldNames]);
        for (const id of idCombatAttacks) {
            const val = valuesSections[`repeating_combat-attack_${id}_repcombat-wdmg-final-macro-options`];
            if (val) {
                if (val.indexOf('-D') === -1) valuesSections[`repeating_combat-attack_${id}_repcombat-wdmg-final-macro-options`] += ' -D';
            } else
                valuesSections[`repeating_combat-attack_${id}_repcombat-wdmg-final-macro-options`] = ' -D';
        }
        Object.assign(objSet, valuesSections);
    }

    async function removeBGDmgRestriction(objSet) {
        if (debug === 2) TAS.debug(`removeBGDmgRestriction::removeBGDmgRestriction`);
        const idCombatAttacks = await getSectionIDsAsync("combat-attack");
        const combatFieldNames = [];
        idCombatAttacks.forEach(id => combatFieldNames.push(`repeating_combat-attack_${id}_repcombat-wdmg-final-macro-options`));
        const valuesSections = await getAttrsAsync([...combatFieldNames]);
        for (const id of idCombatAttacks) {
            valuesSections[`repeating_combat-attack_${id}_repcombat-wdmg-final-macro-options`] = valuesSections[`repeating_combat-attack_${id}_repcombat-wdmg-final-macro-options`] ? valuesSections[`repeating_combat-attack_${id}_repcombat-wdmg-final-macro-options`].replace(' -D', '') : '';
        }
        Object.assign(objSet, valuesSections);
    }

    function triangularNumberSum(nb) { return (nb * (nb+1) / 2);}

    on('sheet:opened change:battlegroup change:battlegroup-size change:battlegroup-health-levels change:battlegroup-perfect-morale change:battlegroup-magnitude', async function updateBattleGroupHealthDisplayed(e) {
        const idHealthArray = await getSectionIDsAsync("health");
        const healthFieldNames = [];
        idHealthArray.forEach(id => healthFieldNames.push(`repeating_health_${id}_hl-damage`, `repeating_health_${id}_hl-penalty`));

        const valuesSections = await getAttrsAsync([...healthFieldNames, "battlegroup", "battlegroup-size", "battlegroup-size_max", "battlegroup-health-levels", "battlegroup-perfect-morale", "battlegroup-magnitude"]);
        if (e.sourceAttribute === 'battlegroup' && e.newValue === '0') {
            TAS.debug(`updateBattleGroupHealthDisplayed:: setting Health to NORMAL Char Display`);
            var sortedIdHealthArray = _(idHealthArray).chain().sortBy(function(id) {
                return valuesSections[`repeating_health_${id}_hl-penalty`] === 'I' ? 5 : -1 * Number(valuesSections[`repeating_health_${id}_hl-penalty`]);
            }).value();

            let actualHealth = 0;
            for (const id of sortedIdHealthArray.reverse()) {
                let dmg =       valuesSections[`repeating_health_${id}_hl-damage`];
                if (dmg && (!dmg || dmg !== 'healthy')) break;
                else                                    actualHealth++;
            }

            let maxHealth = sortedIdHealthArray.length;
            TAS.debug(`updateBattleGroupHealthDisplayed:: maxHealth=${maxHealth} actualHealth=${actualHealth}`);
            setAttrs({'health-displayed': actualHealth, 'health-displayed_max': maxHealth});
        } else if (Number(valuesSections['battlegroup'])) {
            TAS.debug(`updateBattleGroupHealthDisplayed:: normal trigger`);
            let bgSize =    Number(valuesSections["battlegroup-size"]),
                bgSizeMax = Number(valuesSections["battlegroup-size_max"]),
                bgHL =      Number(valuesSections["battlegroup-health-levels"]),
                bgPM =      Number(valuesSections["battlegroup-perfect-morale"]),
                bgMag =     Number(valuesSections["battlegroup-magnitude"]);
            const displayedHealth = bgSize === 0 ? 0 : (bgSize - 1) * bgHL + triangularNumberSum(bgSize - 1) + (bgPM ? (bgSize - 1) * 3 : 0) + bgMag;
            const displayedHealthMax =                    bgSizeMax * bgHL + triangularNumberSum(bgSizeMax)  + (bgPM ? bgSizeMax    * 3 : 0);
            TAS.debug(`updateBattleGroupHealthDisplayed:: maxHealth=${displayedHealthMax} actualHealth=${displayedHealth}`);
            setAttrs({"health-displayed": displayedHealth, "health-displayed_max": displayedHealthMax});
        }
    });

    on('sheet:opened change:battlegroup change:battlegroup-drill change:battlegroup-might', async function setOrDisableBattleGroupSpecialAttrs(e) {
        if (e.sourceType !== "player") {
            if (debug === 2) TAS.debug(`setOrDisableBattleGroupSpecialAttrs:: TRIGGER FROM SCRIPT => CANCEL`);
            return;
        }
        if (e.sourceAttribute === 'battlegroup' && e.newValue === '0') {
            if (debug === 2) TAS.debug(`setOrDisableBattleGroupSpecialAttrs:: setting DEFAULT bg attrs`);
            setAttrs({
                "battlegroup-size": 0,
                "battlegroup-drill": 'Poor',
                "battlegroup-might": 0,
                "battlegroup-def-boost": 0,
                "battlegroup-acc-boost": 0,
                "battlegroup-dmg-boost": 0
            });
        } else {
            const values = await getAttrsAsync(["battlegroup-drill", "battlegroup-might"]);
            if (debug === 2) TAS.debug(`setOrDisableBattleGroupSpecialAttrs:: battlegroup-drill=${JSON.stringify(values["battlegroup-drill"])} battlegroup-might=${JSON.stringify(values["battlegroup-might"])}`);
            if (debug === 2) TAS.debug(`setOrDisableBattleGroupSpecialAttrs:: updating special bg attrs`);
            setAttrs({
                "battlegroup-def-boost": (values["battlegroup-drill"] === 'Average' ? 1 : values["battlegroup-drill"] === 'Elite' ? 2 : 0) + (['1','2'].includes(values["battlegroup-might"]) ? 1 : values["battlegroup-might"] === '3' ? 2 : 0),
                "battlegroup-acc-boost": Number(values["battlegroup-might"]),
                "battlegroup-dmg-boost": Number(values["battlegroup-might"])
            });
        }
    });

    on('sheet:opened', async function testEssenceValue(e) {
        const values = await getAttrsAsync(['essence', 'caste']);
        if (debug === 2) TAS.debug(`testEssenceValue:: essence=${JSON.stringify(values['essence'])}`);
        if (!values['essence']) {
            TAS.debug(`testEssenceValue:: SETTING ESSENCE !`);
            setAttrs({'essence': 1});
        }
        if (debug === 2) TAS.debug(`testEssenceValue:: caste=${JSON.stringify(values['caste'])}`);
        if (!values['caste']) {
            TAS.debug(`testEssenceValue:: SETTING DEFAULT CASTE !`);
            setAttrs({
                'caste': 'Mortal',
                'personal-equation': '0',
                'peripheral-equation': '0',
                'showanimadiv': 0,
                'showsupdiv': 0,
                'showlimit': 0
            });
        }
    });

    on('change:essence change:personal-equation change:peripheral-equation change:committedessperso change:committedesstotal', TAS._fn(async function updateMaxPeripheral(e) {
        const values = await getAttrsAsync(['essence', 'personal-equation', 'peripheral-equation', 'committedessperso', 'committedesstotal']);
        let periEquationStr = values['peripheral-equation'],
            persoEquationStr = values['personal-equation'],
            essence = Number(values['essence']),
            committedPerso = Number(values['committedessperso']),
            committedPeri = Number(values['committedesstotal']),
            pattern = /[^0-9\(\)\+\-\*\/\.]/g;

        if (isNaN(committedPerso) || String(values['committedessperso']).trim() === "") {
            committedPerso = 0;
            setAttrs({'committedessperso':0});
        }
        if (isNaN(committedPeri) || String(values['committedesstotal']).trim() === "") {
            committedPeri = 0;
            setAttrs({'committedesstotal':0});
        }

        persoEquationStr = persoEquationStr.replace('@{essence}', isNaN(essence) ? 1 : essence);
        persoEquationStr = persoEquationStr.replace('@{committedessperso}', committedPerso);
        persoEquationStr = persoEquationStr.replace(pattern, '');

        periEquationStr = periEquationStr.replace('@{essence}', isNaN(essence) ? 1 : essence);
        periEquationStr = periEquationStr.replace('@{committedesstotal}', committedPeri);
        periEquationStr = periEquationStr.replace(pattern, '');
        let finalPerso = eval(persoEquationStr), finalPeri = eval(periEquationStr), maxDisplayed = Number(finalPerso) + Number(finalPeri);
        TAS.debug(`SETTING personal-essence_max=${finalPerso} peripheral-essence_max=${finalPeri}`);
        TAS.debug(`SETTING displayed-essence_max=${maxDisplayed}`);
        setAttrs({'personal-essence_max': finalPerso, 'peripheral-essence_max': finalPeri, 'displayed-essence_max': maxDisplayed});
    }));

    on('change:personal-essence change:peripheral-essence', TAS._fn(async function updateDisplayedMotes(e) {
        const values = await getAttrsAsync(['personal-essence', 'personal-essence_max', 'peripheral-essence', 'peripheral-essence_max']);
        let perso = Number(values['personal-essence']),
            persoMax = Number(values['personal-essence_max']),
            peri = Number(values['peripheral-essence']);
            periMax = Number(values['peripheral-essence_max']);

        if (isNaN(perso)) {
            perso = 0;
            TAS.error(`NaN Value ! SETTING personal-essence=0`);
            setAttrs({'personal-essence':0});
        }
        if (isNaN(persoMax)) persoMax = 0;
        if (isNaN(periMax))  periMax = 0;
        if (isNaN(peri)) {
            peri = 0;
            TAS.error(`NaN Value ! SETTING peripheral-essence=0`);
            setAttrs({'peripheral-essence':0});
        }

        let displayedMotes = perso + peri;
        TAS.debug(`SETTING displayed-essence=[${perso}+${peri} ==> ${displayedMotes}]`);
        setAttrs({'displayed-essence': (displayedMotes === 0 && persoMax === 0 && periMax === 0) ? '' : displayedMotes});
    }));

    const casteTree = {
        Solar:      ["Dawn",        "Zenith",           "Twilight",     "Night",        "Eclipse"],
        Abyssal:    ["Dusk",        "Midnight",         "Daybreak",     "Day",          "Moonshadow"],
        Infernal:   ["Defiler",     "Fiend",            "Malefactor",   "Scourge",      "Slayer"],
        DB:         ["Air",         "Earth",            "Fire",         "Water",        "Wood"],
        Lunar:      ["Full Moon",   "Changing Moon",    "No Moon",      "Casteless"],
        Alchemical: ["Adamant",     "Jade",             "Moonsilver",   "Orichalcum",   "Soulsteel", "Starmetal"],
        Sidereal:   ["Journeys",    "Serenity",         "Battles",      "Secrets",      "Endings"],
        Liminal:    ["Blood",       "Breath",           "Flesh",        "Marrow",       "Soil"]
    };
    function isSolar(caste)               { return (caste && typeof caste === 'string' && casteTree.Solar.includes(caste)); }
    function isAbyssal(caste)             { return (caste && typeof caste === 'string' && casteTree.Abyssal.includes(caste)); }
    function isInfernal(caste)            { return (caste && typeof caste === 'string' && casteTree.Infernal.includes(caste)); }
    function isDB(caste)                  { return (caste && typeof caste === 'string' && casteTree.DB.includes(caste)); }
    function isLunar(caste)               { return (caste && typeof caste === 'string' && casteTree.Lunar.includes(caste)); }
    function isAlchemical(caste)          { return (caste && typeof caste === 'string' && casteTree.Alchemical.includes(caste)); }
    function isSidereal(caste)            { return (caste && typeof caste === 'string' && casteTree.Sidereal.includes(caste)); }
    function isLiminal(caste)             { return (caste && typeof caste === 'string' && casteTree.Liminal.includes(caste)); }

    function isSpirit(caste)              { return (caste && typeof caste === 'string' && ["God", "Elemental", "Demon", "Undead"].includes(caste)); }

    function isSolarBasedExalt(caste)     { return (caste && typeof caste === 'string' && [...casteTree.Solar, ...casteTree.Abyssal, ...casteTree.Infernal].includes(caste)); }
    function isAttributeBasedExalt(caste) { return (caste && typeof caste === 'string' && [...casteTree.Lunar, ...casteTree.Alchemical].includes(caste)); }

    on('change:caste', TAS._fn(function updateMotePool(e){
        if (!e.newValue) {
            TAS.debug(`updateMotePool:: No settings found, stay as is !`);
            return;
        }
        const caste = e.newValue;
        const finalObj = {
            "personal-equation": "0", "peripheral-equation": "0",
            "showanimadiv": 1, "showsupdiv": 0, "showlimit": 0,
            "caste-low": 'unknown',
            "diceex": 1, "succex": 0, "canspendmote": 0
        };
        if (isSolarBasedExalt(caste)) {
            finalObj["personal-equation"]   = "@{essence} * 3 + 10 - @{committedessperso}";
            finalObj["peripheral-equation"] = "@{essence} * 7 + 26 - @{committedesstotal}";
            finalObj["showsupdiv"] = 1;
            finalObj["showlimit"] = 1;
        } else if (isDB(caste)){
            finalObj["personal-equation"]   = "@{essence} * 1 + 11 - @{committedessperso}";
            finalObj["peripheral-equation"] = "@{essence} * 4 + 23 - @{committedesstotal}";
            finalObj["succex"] = 1;
        } else if (isAttributeBasedExalt(caste)){
            finalObj["personal-equation"]   = "@{essence} * 1 + 15 - @{committedessperso}";
            finalObj["peripheral-equation"] = "@{essence} * 4 + 34 - @{committedesstotal}";
            finalObj["showlimit"] = 1;
            finalObj["succex"] = 1;
        } else if (isSidereal(caste)){
            finalObj["personal-equation"]   = "@{essence} * 2 + 9 - @{committedessperso}";
            finalObj["peripheral-equation"] = "@{essence} * 6 + 25 - @{committedesstotal}";
            finalObj["showlimit"] = 1;
        } else if (isLiminal(caste)){
            finalObj["personal-equation"]   = "@{essence} * 3 + 10 - @{committedessperso}";
            finalObj["peripheral-equation"] = "@{essence} * 4 + 23 - @{committedesstotal}";
            finalObj["succex"] = 1;
        } else if (isSpirit(caste)){
            finalObj["personal-equation"]   = "@{essence} * 10 + 50 - @{committedessperso}";
            finalObj["peripheral-equation"] = "@{essence} * 0 - @{committedesstotal}";
            finalObj["showanimadiv"] = 0;
            finalObj["diceex"] = 0;
            finalObj["canspendmote"] = 1;
        } else if (caste === "God-Blooded"){
            finalObj["personal-equation"]   = "@{essence} * 0 - @{committedessperso}";
            finalObj["peripheral-equation"] = "@{essence} * 10 - @{committedesstotal}";
            finalObj["showanimadiv"] = 0;
            finalObj["diceex"] = 0;
        } else if (caste === "Mortal"){
            finalObj["showanimadiv"] = 0;
            finalObj["diceex"] = 0;
        } else {
            TAS.debug(`updateMotePool:: No settings found, stay as is !`);
            return;
        }

        for (const exaltTypeName of Object.keys(casteTree)) {
            if (casteTree[exaltTypeName].includes(caste)) {
                finalObj["exalt-type"] = exaltTypeName;
                break;
            }
        }

        if (hasCasteImg(caste))
            finalObj["caste-low"] = caste.toLowerCase();
        finalObj["caste-have-exc"] = finalObj["succex"] || finalObj["diceex"];

        TAS.debug(`updateMotePool:: Setting=`, finalObj);
        setAttrs(finalObj);
    }));

    on('change:diceex change:succex', TAS._fn(async function updateCasteHaveExc(eventInfo){
        const finalObj = {"caste-have-exc": Number(await getSingleAttrAsync('diceex')) || Number(await getSingleAttrAsync('succex'))};
        TAS.debug(`updateCasteHaveExc:: Setting=`, finalObj);
        setAttrs(finalObj);
    }));

    const updateList = [
        {version: 1, fn: upgradeHealthBars},
        {version: 2.27, fn: upgradeto228},
        {version: 2.29, fn: upgradeto230},
        {version: 2.30, fn: upgradeto231},
        {version: 2.31, fn: upgradeto232},
        {version: 2.32, fn: upgradeto233},
        {version: 2.34, fn: upgradeto235},
        {version: 2.35, fn: upgradeto236},
        {version: 2.36, fn: upgradeto237},
        {version: 2.37, fn: upgradeto238},
        {version: 2.38, fn: upgradeto239},
        {version: 2.39, fn: upgradeto240},
        {version: 2.45, fn: upgradeto242},
        {version: 2.46, fn: upgradeto247},
        {version: 2.47, fn: upgradeto248},
        {version: 2.48, fn: upgradeto249},
        {version: 2.49, fn: upgradeto250},
        {version: 2.50, fn: upgradeto251},
        {version: 2.51, fn: upgradeto252},
        {version: 2.52, fn: upgradeto253},
        {version: 2.53, fn: upgradeto254},
        {version: 2.54, fn: upgradeto255},
        {version: 2.55, fn: upgradeto256},
        {version: 2.56, fn: upgradeto257},
        {version: 2.57, fn: upgradeto258},
        {version: 2.60, fn: upgradeto261},
        {version: 2.61, fn: upgradeto262},
    ];

    on('sheet:opened', async function versionCheck(e) {
        const values = await getAttrsAsync(['version', 'init-intimacies']);
        if (debug === 2) TAS.debug(`versionCheck:: values=${JSON.stringify(values)}`);
        if (!values.version) {
            TAS.debug('versionCheck:: NO VERSION FOUND !!!!!!');
            // TAS.debug('NO VERSION FOUND => INITIALIZING A NEW SHEET');
            // initCharacterSheet();
        } else {
            const v = parseFloat(values.version);
            if (debug === 2) TAS.debug(`versionCheck:: Actual version v = ${v}`);

            if (!values['init-intimacies'] || !Number(values['init-intimacies']))
                initIntimacies()

            const upgradeRemaining = updateList.filter(i => i.version >= v).sort((a,b) => a.version - b.version);
            if (upgradeRemaining.length) {
                for (const u of upgradeRemaining) {
                    TAS.debug(`versionCheck:: Upgrade to do = v=${u.version} fx=${u.fn.name}`);
                    await u.fn();
                }
                TAS.debug(`versionCheck:: All Upgrade done !`);
            }
        }
    });

    function addGenericCharmsToObj(caste, charmObj, old = false) {
        const aspectStr = isDB(caste) ? 'none' : caste.toLowerCase();
        const idNewCharms = [];
        addNewCharmToFinalObj(charmObj, generateNewRowId(idNewCharms), {name:'Generic Excellency', type:'Supplemental',
            cost:'[[?{Dice Added ?|1}]]', cost_mote:'?{Dice Added ?|1}', cost_macro:'=COST:@{character_id}:peri=?{Spend Peripheral First ?|Yes,1|No,0};?{Dice Added ?|1}',
            short_d: 'add Dices', skill:'Exalted Power', duration:'Instant', aspect:aspectStr,
            description: 'The Exalt infuse her essence inside the action to magnify it.', effect:'The Exalt add [[?{Dice Added ?|1}]] dices to the action.'}, old);
            
        addNewCharmToFinalObj(charmObj, generateNewRowId(idNewCharms), {name:'Generic Defense Excellency', type:'Supplemental',
            cost:'[[?{Defense Added ?|1} * 2]]', cost_mote:'[[?{Defense Added ?|1} * 2]]', cost_macro:'=COST:@{character_id}:peri=?{Spend Peripheral First ?|Yes,1|No,0};[[?{Defense Added ?|1} * 2]]',
            short_d: 'bonus to defensive static values', skill:'Exalted Power', duration:'Instant', aspect:aspectStr,
            description: 'The Exalt infuse her essence inside her defenses to appear impenetrable.', effect:'The Exalt add [[?{Defense Added ?|1}]] to the static value of the related defense.'}, old);
    }

    function hasCasteImg(caste) {
        if ([...casteTree.Solar,
             ...casteTree.Abyssal,
             ...casteTree.Infernal,
             ...casteTree.Alchemical,
             ...casteTree.Lunar,
             ...casteTree.DB,
             ...casteTree.Sidereal,
             ...casteTree.Liminal].includes(caste))
            return true;
        return false;
    }

    const convMap = {
        '@{strength}': '@{strength}[Strength]',
        '@{dexterity}': '@{dexterity}[Dexterity]',
        '@{stamina}': '@{stamina}[Stamina]',
        '@{charisma}': '@{charisma}[Charisma]',
        '@{manipulation}': '@{manipulation}[Manipulation]',
        '@{appearance}': '@{appearance}[Appearance]',
        '@{perception}': '@{perception}[Perception]',
        '@{intelligence}': '@{intelligence}[Intelligence]',
        '@{wits}': '@{wits}[Wits]',
        '@{archery}': '@{archery}[Archery]',
        '@{athletics}': '@{athletics}[Athletics]',
        '@{awareness}': '@{awareness}[Awareness]',
        '@{brawl}': '@{brawl}[Brawl]',
        '@{bureaucracy}': '@{bureaucracy}[Bureaucracy]',
        '@{dodge}': '@{dodge}[Dodge]',
        '@{integrity}': '@{integrity}[Integrity]',
        '@{investigation}': '@{investigation}[Investigation]',
        '@{larceny}': '@{larceny}[Larceny]',
        '@{linguistics}': '@{linguistics}[Linguistics]',
        '@{lore}': '@{lore}[Lore]',
        '@{medicine}': '@{medicine}[Medicine]',
        '@{melee}': '@{melee}[Melee]',
        '@{occult}': '@{occult}[Occult]',
        '@{performance}': '@{performance}[Performance]',
        '@{presence}': '@{presence}[Presence]',
        '@{resistance}': '@{resistance}[Resistance]',
        '@{ride}': '@{ride}[Ride]',
        '@{sail}': '@{sail}[Sail]',
        '@{socialize}': '@{socialize}[Socialize]',
        '@{stealth}': '@{stealth}[Stealth]',
        '@{survival}': '@{survival}[Survival]',
        '@{thrown}': '@{thrown}[Thrown]',
        '@{war}': '@{war}[War]',
        '@{craft-armoring}': '@{craft-armoring}[Armoring]',
        '@{craft-artifact}': '@{craft-artifact}[Artifact]',
        '@{craft-cooking}': '@{craft-cooking}[Cooking]',
        '@{craft-artifice}': '@{craft-artifice}[First Age Artifice]',
        '@{craft-gemcutting}': '@{craft-gemcutting}[Gemcutting]',
        '@{craft-geomancy}': '@{craft-geomancy}[Geomancy]',
        '@{craft-jewelry}': '@{craft-jewelry}[Jewelry]',
        '@{craft-tailoring}': '@{craft-tailoring}[Tailoring]',
        '@{craft-forging}': '@{craft-forging}[Weapon Forging]',
        '@{ma-snake}': '@{ma-snake}[Snake Style]',
        '@{ma-tiger}': '@{ma-tiger}[Tiger Style]',
        '@{ma-void}': '@{ma-void}[Single Point Shining Into The Void Style]',
        '@{ma-reaper}': '@{ma-reaper}[White Reaper Style]',
        '@{ma-ebon}': '@{ma-ebon}[Ebon Shadow Style]',
        '@{ma-crane}': '@{ma-crane}[Crane Style]',
        '@{ma-nightingale}': '@{ma-nightingale}[Silver-voiced Nightingale Style]',
        '@{ma-devil}': '@{ma-devil}[Righteous Devil Style]',
        '@{ma-claw}': '@{ma-claw}[Black Claw Style]',
        '@{ma-pearl}': '@{ma-pearl}[Dreaming Pearl Courtesan Style]',
        '@{ma-steel}': '@{ma-steel}[Steel Devil Style]',
        '0': '0[RAW]',
        '1': '1[RAW]',
        '2': '2[RAW]',
        '3': '3[RAW]',
        '4': '4[RAW]',
        '5': '5[RAW]',
        '6': '6[RAW]',
        '7': '7[RAW]',
        '8': '8[RAW]',
        '9': '9[RAW]',
        '10': '10[RAW]',
        '11': '11[RAW]',
        '12': '12[RAW]',
        '13': '13[RAW]',
        '14': '14[RAW]',
        '15': '15[RAW]',
        '16': '16[RAW]',
        '17': '17[RAW]',
        '18': '18[RAW]',
        '19': '19[RAW]',
        '20': '20[RAW]',
        '?{Custom Attribute}': '?{Custom Attribute}[Custom]'
    };
    const complexConvMap = {
        '?{Craft|': '?{Craft|Armoring (@{craft-armoring}),@{craft-armoring}[Armoring]|Artifact (@{craft-artifact}),@{craft-artifact}[Artifact]|Cooking (@{craft-cooking}),@{craft-cooking}[Cooking]|First Age Artifice (@{craft-artifice}),@{craft-artifice}[First Age Artifice]|Gemcutting (@{craft-gemcutting}),@{craft-gemcutting}[Gemcutting]|Geomancy (@{craft-geomancy}),@{craft-geomancy}[Geomancy]|Jewelry (@{craft-jewelry}),@{craft-jewelry}[Jewelry]|Tailoring (@{craft-tailoring}),@{craft-tailoring}[Tailoring]|Weapon Forging (@{craft-forging}),@{craft-forging}[Weapon Forging]|Other,?{Enter the number of Craft dots&#124;0&#125;[Other-Craft]}',
        '?{Martial Arts|': '?{Martial Arts|Snake Style (@{ma-snake}),@{ma-snake}[Snake Style]|Tiger Style (@{ma-tiger}),@{ma-tiger}[Tiger Style]|Single Point Shining Into The Void Style (@{ma-void}),@{ma-void}[Single Point Shining Into The Void Style]|White Reaper Style (@{ma-reaper}),@{ma-reaper}[White Reaper Style]|Ebon Shadow Style (@{ma-ebon}),@{ma-ebon}[Ebon Shadow Style]|Crane Style (@{ma-crane}),@{ma-crane}[Crane Style]|Silver-voiced Nightingale Style (@{ma-nightingale}),@{ma-nightingale}[Silver-voiced Nightingale Style]|Righteous Devil Style (@{ma-devil}),@{ma-devil}[Righteous Devil Style]|Black Claw Style (@{ma-claw}),@{ma-claw}[Black Claw Style]|Dreaming Pearl Courtesan Style (@{ma-pearl}),@{ma-pearl}[Dreaming Pearl Courtesan Style]|Steel Devil Style (@{ma-steel}),@{ma-steel}[Steel Devil Style]|Other,?{Enter the number of M.A. dots of this style&#124;0&#125;[Other-MA]}',
        '?{Ability|': `?{Ability|
                                                            Archery (@{archery}),@{archery}[Archery]|
                                                            Athletics (@{athletics}),@{athletics}[Athletics]|
                                                            Awareness (@{awareness}),@{awareness}[Awareness]|
                                                            Brawl (@{brawl}),@{brawl}[Brawl]|
                                                            Bureaucracy (@{bureaucracy}),@{bureaucracy}[Bureaucracy]|
                                                            Craft (...),?{Craft&#124;
                                                                Armoring (@{craft-armoring})&#44;@{craft-armoring}[Armoring]&#124;
                                                                Artifact (@{craft-artifact})&#44;@{craft-artifact}[Artifact]&#124;
                                                                Cooking (@{craft-cooking})&#44;@{craft-cooking}[Cooking]&#124;
                                                                First Age Artifice (@{craft-artifice})&#44;@{craft-artifice}[First Age Artifice]&#124;
                                                                Gemcutting (@{craft-gemcutting})&#44;@{craft-gemcutting}[Gemcutting]&#124;
                                                                Geomancy (@{craft-geomancy})&#44;@{craft-geomancy}[Geomancy]&#124;
                                                                Jewelry (@{craft-jewelry})&#44;@{craft-jewelry}[Jewelry]&#124;
                                                                Tailoring (@{craft-tailoring})&#44;@{craft-tailoring}[Tailoring]&#124;
                                                                Weapon Forging (@{craft-forging})&#44;@{craft-forging}[Weapon Forging]&#124;
                                                                Other&#44;?{Enter the number of Craft dots&amp;#124;0&amp;#125;&#125;[Other-Craft]|
                                                            Dodge (@{dodge}),@{dodge}[Dodge]|
                                                            Integrity (@{integrity}),@{integrity}[Integrity]|
                                                            Investigation (@{investigation}),@{investigation}[Investigation]|
                                                            Larceny (@{larceny}),@{larceny}[Larceny]|
                                                            Linguistics (@{linguistics}),@{linguistics}[Linguistics]|
                                                            Lore (@{lore}),@{lore}[Lore]|
                                                            Martial Arts (...),?{Martial Arts&#124;
                                                                Snake Style (@{ma-snake})&#44;@{ma-snake}[Snake Style]&#124;
                                                                Tiger Style (@{ma-tiger})&#44;@{ma-tiger}[Tiger Style]&#124;
                                                                Single Point Shining Into The Void Style (@{ma-void})&#44;@{ma-void}[Single Point Shining Into The Void Style]&#124;
                                                                White Reaper Style (@{ma-reaper})&#44;@{ma-reaper}[White Reaper Style]&#124;
                                                                Ebon Shadow Style (@{ma-ebon})&#44;@{ma-ebon}[Ebon Shadow Style]&#124;
                                                                Crane Style (@{ma-crane})&#44;@{ma-crane}[Crane Style]&#124;
                                                                Silver-voiced Nightingale Style (@{ma-nightingale})&#44;@{ma-nightingale}[Silver-voiced Nightingale Style]&#124;
                                                                Righteous Devil Style (@{ma-devil})&#44;@{ma-devil}[Righteous Devil Style]&#124;
                                                                Black Claw Style (@{ma-claw})&#44;@{ma-claw}[Black Claw Style]&#124;
                                                                Dreaming Pearl Courtesan Style (@{ma-pearl})&#44;@{ma-pearl}[Dreaming Pearl Courtesan Style]&#124;
                                                                Steel Devil Style (@{ma-steel})&#44;@{ma-steel}[Steel Devil Style]&#124;
                                                                Other&#44;?{Enter the number of M.A. dots of this style&amp;#124;0&amp;#125;&#125;[Other-MA]|
                                                            Medicine (@{medicine}),@{medicine}[Medicine]|
                                                            Melee (@{melee}),@{melee}[Melee]|
                                                            Occult (@{occult}),@{occult}[Occult]|
                                                            Performance (@{performance}),@{performance}[Performance]|
                                                            Presence (@{presence}),@{presence}[Presence]|
                                                            Resistance (@{resistance}),@{resistance}[Resistance]|
                                                            Ride (@{ride}),@{ride}[Ride]|
                                                            Sail (@{sail}),@{sail}[Sail]|
                                                            Socialize (@{socialize}),@{socialize}[Socialize]|
                                                            Stealth (@{stealth}),@{stealth}[Stealth]|
                                                            Survival (@{survival}),@{survival}[Survival]|
                                                            Thrown (@{thrown}),@{thrown}[Thrown]|
                                                            War (@{war}),@{war}[War]|
                                                            Other,?{Enter the number of dots of this attribute&#124;0&#125;[Other]
                                                        }`,
        "?{Physical Attribute 2 ?|": "?{Physical Attribute 2 ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]}",
        "?{Social Attribute 2 ?|": "?{Social Attribute 2 ?|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]}",
        "?{Mental Attribute 2 ?|": "?{Mental Attribute 2 ?|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}",
        "?{Full Attribute 2 ?|": "?{Full Attribute 2 ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}",
        "?{Physical Attribute ?|": "?{Physical Attribute ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]}",
        "?{Social Attribute ?|": "?{Social Attribute ?|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]}",
        "?{Mental Attribute ?|": "?{Mental Attribute ?|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}",
        "?{Full Attribute ?|": "?{Full Attribute ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}"
    };

    async function upgradeto262() {
        const finalObj = {
            'appearancefav': await getSingleAttrAsync('apperancefav'),
            'version': 2.62
        };
        TAS.debug(`upgradeto262:: finalObj=`, finalObj);
        setAttrs(finalObj);
    }

    function upgradeto261() {
        setAttrs({'version': 2.61});
        computeAllDamageRolls();
    }

    async function upgradeto258() {
        const finalObj = {'version': 2.58};
        const charmAttrs = [
            'charm-learnt',
            'charm-name',
            'charm-type',
            'charm-cost',
            'charm-buttons-isextended',
            'rep-cost-macro',
            'charm-short-desc',
            'charm-effect-display',
            'charm-book',
            'charm-page',
            'charm-duration',
            'charm-keywords',
            'charm-mute',
            'charm-aspect',
            'charm-balanced',
            'charm-can-cycle-aspects',
            'rep-cost-mote',
            'rep-cost-mote-pool',
            'rep-cost-mote-commit',
            'rep-cost-will',
            'rep-cost-init',
            'charm-description',
            'charm-effect',
            'charm-buttons-isextended',
            'charm-rollexpr',
        ];
        TAS.debug(`upgradeto258::upgradeto258`);
        const arrayAttrName = [], memorySectionIds = {};
        for (const section of charmRepeatableSectionArrayOld) {
            let orderedSectionIds = await getSectionIDsOrderedAsync(section);
            memorySectionIds[section] = orderedSectionIds;
            for (const id of orderedSectionIds)
                arrayAttrName.push(...['charm-skill', ...charmAttrs].map(i => `repeating_${section}_${id}_${i}`));
        }
        const repeatingAttrs = await getAttrsAsync(arrayAttrName);
        const arrayIdOrdered = [], arrayNewIds = [];
        for (const section of charmRepeatableSectionArrayOld) {
            for (const id of memorySectionIds[section]) {
                const newId = generateNewRowId(arrayNewIds);
                arrayIdOrdered.push(newId);
                for (const attr of charmAttrs) {
                    if (repeatingAttrs[`repeating_${section}_${id}_${attr}`])
                        finalObj[`repeating_charms-all_${newId}_${attr}`] = repeatingAttrs[`repeating_${section}_${id}_${attr}`];
                }
                if (section !== 'charms-evocations' && section !== 'charms')
                    finalObj[`repeating_charms-all_${newId}_charm-skill`] = correspondingCharmSectionValue[section];
                else if (section === 'charms')
                    finalObj[`repeating_charms-all_${newId}_charm-skill`] = repeatingAttrs[`repeating_${section}_${id}_charm-skill`] || '';
                finalObj[`repeating_charms-all_${newId}_isEvoc`] = (section === 'charms-evocations') ? 'Evocation' : '';
                if (['charms-ma-airdragon', 'charms-ma-earthdragon', 'charms-ma-firedragon', 'charms-ma-waterdragon', 'charms-ma-wooddragon'].includes(section))
                    finalObj[`repeating_charms-all_${newId}_charm-aspect`] = section.replace('charms-ma-','').replace('dragon','');
                removeRepeatingRow(`repeating_${section}_${id}`);
            }
        }
        TAS.debug(`upgradeto258:: finalObj=`,finalObj);
        await setAttrsAsync(finalObj);
        TAS.debug(`upgradeto258:: new arrayIdOrdered=`,arrayIdOrdered);
        setSectionOrder('charms-all', arrayIdOrdered);
    }

    async function upgradeto257() {
        const finalObj = {'version': 2.57};
        const usecommitsystem = await getSingleAttrAsync('usecommitsystem');
        if (!Number(usecommitsystem)) finalObj['usecommitsystem'] = '1';
        TAS.debug(`upgradeto257:: finalObj=`,finalObj);
        await setAttrsAsync(finalObj);
    }

    async function upgradeto256() {
        const finalObj = {'version': 2.56};
        const idCommitList = await getSectionIDsAsync('commited-list');

        const arrayAttr = [];
        for (const id of idCommitList)
            arrayAttr.push(`repeating_commited-list_${id}_commited-pool-type`, `repeating_commited-list_${id}_commited-cost`);
        const val = await getAttrsAsync(arrayAttr);
        for (const id of idCommitList) {
            if (val[`repeating_commited-list_${id}_commited-pool-type`] === '1') {
                finalObj[`repeating_commited-list_${id}_commited-cost-peri`] = val[`repeating_commited-list_${id}_commited-pool-cost`] || '0';
                finalObj[`repeating_commited-list_${id}_commited-cost-perso`] = '0';
            } else {
                finalObj[`repeating_commited-list_${id}_commited-cost-perso`] = val[`repeating_commited-list_${id}_commited-pool-cost`] || '0';
                finalObj[`repeating_commited-list_${id}_commited-cost-peri`] = '0';
            }
        }
        TAS.debug(`upgradeto256:: finalObj=`,finalObj);
        await setAttrsAsync(finalObj);
    }

    async function upgradeto255() {
        const finalObj = {'version': 2.55};
        const arrayDuration = [];
        for (const section of charmRepeatableSectionArrayOld)
            for (const id of await getSectionIDsAsync(section))
                arrayDuration.push(`repeating_${section}_${id}_charm-duration`);
        const val = await getAttrsAsync(arrayDuration);
        for (const [key, value] of Object.entries(val)) {
            const keyParts = key.split('_');
            if (value?.trim() && !['instant','permanent'].includes(value.toLowerCase()))
                finalObj[`repeating_${keyParts[1]}_${keyParts[2]}_rep-cost-mote-commit`] = '1';
            else
                finalObj[`repeating_${keyParts[1]}_${keyParts[2]}_rep-cost-mote-commit`] = '0';
        }
        TAS.debug(`upgradeto255:: finalObj=`,finalObj);
        await setAttrsAsync(finalObj);
    }

    async function upgradeto254() {
        const finalObj = {'version': 2.54};
        const idOtherCharms = await getSectionIDsAsync("charms");
        for (const id of idOtherCharms) {
            const valuesSections = await getAttrsAsync([`repeating_charms_${id}_charm-name`, `repeating_charms_${id}_charm-skill`]);
            if (!valuesSections[`repeating_charms_${id}_charm-skill`] && ['Generic Excellency', 'Generic Defense Excellency'].includes(valuesSections[`repeating_charms_${id}_charm-name`]))
                finalObj[`repeating_charms_${id}_charm-skill`] = 'Exalted Power';
        }
        await setAttrsAsync(finalObj);
    }

    async function upgradeto253() {
        const finalObj = {'version': 2.53};
        const isBG = await getSingleAttrAsync('battlegroup') === '1';
        if (isBG) await addBGDmgRestrictionIfNeeded(finalObj);

        await setAttrsAsync(finalObj);
        const idCombatAttacks = await getSectionIDsAsync("combat-attack");
        for (const id of idCombatAttacks)
            computeIdRepeatingRoll("combat-attack", id, 'repcombat-', wDmgAttrsToBind, defaultWDamageFinalExpr, 'wdmg-');
    }

    async function upgradeto252() {
        const idRollsArray = await getSectionIDsAsync("rolls");
        const rollFieldNames = [], rollAttrs = ['reprolls-attr', 'reprolls-abi'];
        idRollsArray.forEach(id => rollFieldNames.push(...rollAttrs.map(i => `repeating_rolls_${id}_${i}`)));

        const valuesSections = await getAttrsAsync([...rollFieldNames]);
        const finalObj = {'version': 2.52};
        const allowedValued = attrNAbi.map(i => '@{'+i+'}');
        const convMapKeys = Object.keys(convMap);
        for (let i = 0; i <= 20; i++) allowedValued.push(i);
        idRollsArray.forEach(id => {
            rollAttrs.forEach(i => {
                if (convMapKeys.includes(valuesSections[`repeating_rolls_${id}_${i}`]))
                    finalObj[`repeating_rolls_${id}_${i}`] = convMap[valuesSections[`repeating_rolls_${id}_${i}`]];
                let found;
                if ((found = Object.keys(complexConvMap).find(complexItem => valuesSections[`repeating_rolls_${id}_${i}`].indexOf(complexItem) === 0)))
                    finalObj[`repeating_rolls_${id}_${i}`] = complexConvMap[found];
            });
            finalObj[`repeating_rolls_${id}_reprolls-specialty`] = '0';
        })
        await setAttrsAsync(finalObj);
        for (const id of idRollsArray)
            computeIdRepeatingRoll('rolls', id, 'reprolls-', rollWidgetSectionsToBind, defaultRollWidgetFinalExpr, '', false);
    }

    async function upgradeto251() {
        let exaltType = 'None';
        const caste = await getSingleAttrAsync('caste');
        for (const exaltTypeName of Object.keys(casteTree)) {
            if (casteTree[exaltTypeName].includes(caste)) {
                exaltType = exaltTypeName;
                break;
            }
        }
        setAttrs({"exalt-type": exaltType, 'version': 2.51});
    }

    async function upgradeto250() {
        setAttrs({
            "caste-have-exc": !["God", "Elemental", "Demon", "Undead", "God-Blooded", "Mortal"].includes(await getSingleAttrAsync("caste")) ? 1 : 0,
            'version': 2.50
        });
    }

    async function upgradeto249() {
        const idRollsArray = await getSectionIDsAsync("rolls-widget");
        setAttrs({'version': 2.49});
        for (const id of idRollsArray)
            computeIdRepeatingRoll('rolls-widget', id, 'reprolls-', rollWidgetSectionsToBind, defaultRollWidgetFinalExpr, '', false);
    }

    async function upgradeto248() {
        const idRollsArray = await getSectionIDsAsync("rolls-widget");
        const rollFieldNames = [], rollAttrs = ['reprolls-attr', 'reprolls-abi'];
        idRollsArray.forEach(id => rollFieldNames.push(...rollAttrs.map(i => `repeating_rolls-widget_${id}_${i}`)));

        const valuesSections = await getAttrsAsync([...rollFieldNames]);
        const finalObj = {'version': 2.48};
        const allowedValued = attrNAbi.map(i => '@{'+i+'}');
        const convMapKeys = Object.keys(convMap);
        for (let i = 0; i <= 20; i++) allowedValued.push(i);
        idRollsArray.forEach(id => {
            rollAttrs.forEach(i => {
                if (convMapKeys.includes(valuesSections[`repeating_rolls-widget_${id}_${i}`]))
                    finalObj[`repeating_rolls-widget_${id}_${i}`] = convMap[valuesSections[`repeating_rolls-widget_${id}_${i}`]];
            });
            finalObj[`repeating_rolls-widget_${id}_reprolls-specialty`] = '0';
        })
        setAttrs(finalObj);
        for (const id of idRollsArray)
            computeIdRepeatingRoll('rolls-widget', id, 'reprolls-', rollWidgetSectionsToBind, defaultRollWidgetFinalExpr, '', false);
    }

    async function upgradeto247() {
        const idRollsArray = await getSectionIDsAsync("rolls");
        const rollFieldNames = [], rollAttrs = ['reprolls-name', 'reprolls-attr', 'reprolls-abi', 'reprolls-final-macro-options'];
        idRollsArray.forEach(id => rollFieldNames.push(...rollAttrs.map(i => `repeating_rolls_${id}_${i}`)));

        const valuesSections = await getAttrsAsync([...rollFieldNames]);
        const finalObj = {'version': 2.47}, arrayNewRollsWidget = [];
        const allowedValued = attrNAbi.map(i => '@{'+i+'}');
        for (let i = 0; i <= 20; i++) allowedValued.push(i);
        idRollsArray.forEach(id => {
            let newId = generateNewRowId(arrayNewRollsWidget);
            rollAttrs.forEach(i => finalObj[`repeating_rolls-widget_${newId}_${i}`] = valuesSections[`repeating_rolls_${id}_${i}`]);
            if (!allowedValued.includes(finalObj[`repeating_rolls-widget_${newId}_reprolls-attr`]))
                finalObj[`repeating_rolls-widget_${newId}_reprolls-attr`] = '0';
            if (!allowedValued.includes(finalObj[`repeating_rolls-widget_${newId}_reprolls-abi`]))
                finalObj[`repeating_rolls-widget_${newId}_reprolls-abi`] = '0';
        })
        setAttrs(finalObj);
        for (const id of arrayNewRollsWidget)
            computeIdRepeatingRoll('rolls-widget', id, 'reprolls-', rollWidgetSectionsToBind, defaultRollWidgetFinalExpr, '', false);
    }

    function upgradeto242() {
        setAttrs({'version': 2.42});
        verifyAllCharmsRollExpr({sourceType: 'player'}, false);
    }

    async function upgradeto240() {
        const bg = await getSingleAttrAsync("battlegroup");
        if (bg && Number(bg))
            verifyAllCharmsRollExpr({sourceType: 'player'}, false);
        setAttrs({'version': 2.40});
    }

    async function upgradeto239() {
        setAttrs({
            'wound-penalty': Math.abs(await getSingleAttrAsync("wound-penalty")),
            'version': 2.39
        });
        verifyAllCharmsRollExpr({sourceType: 'player'}, false);
    }

    function upgradeto238() {
        setAttrs({
            'roll-penalty': 0,
            'rollpenalty-input': 0,
            'version': 2.38
        });
        verifyAllCharmsRollExpr({sourceType: 'player'}, false);
    }

    async function upgradeto237() {
        const valuesSections = await getAttrsAsync(['personal-essence', 'personal-essence_max', 'peripheral-essence', 'peripheral-essence_max']);
        let perso =     Number(valuesSections['personal-essence']),
            persoMax =  Number(valuesSections['personal-essence_max']),
            peri =      Number(valuesSections['peripheral-essence']);
            periMax =   Number(valuesSections['peripheral-essence_max']);
        for (const [variable, attrToSet] of [[perso, 'personal-essence'], [peri, 'peripheral-essence'], [persoMax, 'peripheral-essence_max'], [periMax, 'peripheral-essence_max']]) {
            if (isNaN(variable)) {
                perso = 0;
                TAS.error(`NaN Value ! SETTING ${attrToSet}=0`);
                setAttrs({[attrToSet]:0});
            }
        }
        let displayedMotes = perso + peri, maxDisplayed = persoMax + periMax;
        if (maxDisplayed === 0 && displayedMotes === 0)
            displayedMotes = '';
        TAS.debug(`SETTING displayed-essence=[${perso}+${peri} ==> ${displayedMotes}]`);

        const finalAttr = {
            'displayed-essence': displayedMotes,
            'displayed-essence_max': maxDisplayed,
            'version': 2.37
        };
        setAttrs(finalAttr);
    }

    async function upgradeto236() {
        const personalEq = await getSingleAttrAsync("personal-equation") || '0',
              stringToCheck = ' - @{committedessperso}',
              attrObj = {};

        if (personalEq.slice(personalEq.length - stringToCheck.length) !== stringToCheck && personalEq !== '0' && personalEq !== '')
            attrObj['personal-equation'] = personalEq + stringToCheck;
        attrObj['committedessperso'] = 0;
        attrObj['version'] = 2.36;

        TAS.debug(`upgradeto236:: Setting=`, attrObj);
        setAttrs(attrObj);
    }

    async function upgradeto235() {
        const caste = await getSingleAttrAsync("personal-equation") || 'Unknown',
              charmObj = {}

        if (hasCasteImg(caste))
            charmObj['caste-low'] = caste.toLowerCase();
        else
            charmObj['caste-low'] = 'unknown';
        charmObj['version'] = 2.35;

        TAS.debug(`upgradeto235:: Setting=`, charmObj);
        setAttrs(charmObj);
    }

    async function upgradeto233() {
        const caste = await getSingleAttrAsync("personal-equation") || 'Unknown',
              charmObj = {};

        addGenericCharmsToObj(caste, charmObj, true);
        if (values['caste'] !== 'Mortal') {
            charmObj['charm-old'] = 1;
            charmObj['_charm_sheet'] = 28;
        }
        charmObj['version'] = 2.33;

        TAS.debug(`upgradeto233:: Setting=`, charmObj);
        setAttrs(charmObj);
    }

    async function upgradeto232() {
        const idHealthArray = await getSectionIDsAsync("health");
        const healthFieldNames = [];
        idHealthArray.forEach(id => healthFieldNames.push(`repeating_health_${id}_hl-damage`, `repeating_health_${id}_hl-penalty`));

        const valuesSections = await getAttrsAsync([...healthFieldNames, 'personal-essence', 'personal-essence_max', 'peripheral-essence', 'peripheral-essence_max']);
        var sortedIdHealthArray = _(idHealthArray).chain().sortBy(function(id) {
            return valuesSections[`repeating_health_${id}_hl-penalty`] === 'I' ? 5 : -1 * Number(valuesSections[`repeating_health_${id}_hl-penalty`]);
        }).value();

        let actualHealth = 0;
        for (const id of sortedIdHealthArray.reverse()) {
            let dmg = valuesSections[`repeating_health_${id}_hl-damage`];
            if (dmg && (!dmg || dmg !== 'healthy')) break;
            else                                    actualHealth++;
        }
        let maxHealth = sortedIdHealthArray.length;
        TAS.debug(`getHealthFields:: maxHealth=${maxHealth} actualHealth=${actualHealth}`);

        let perso =     Number(valuesSections['personal-essence']),
            persoMax =  Number(valuesSections['personal-essence_max']),
            peri =      Number(valuesSections['peripheral-essence']);
            periMax =   Number(valuesSections['peripheral-essence_max']);
        for (const [variable, attrToSet] of [[perso, 'personal-essence'], [peri, 'peripheral-essence'], [persoMax, 'peripheral-essence_max'], [periMax, 'peripheral-essence_max']]) {
            if (isNaN(variable)) {
                perso = 0;
                TAS.error(`NaN Value ! SETTING ${attrToSet}=0`);
                setAttrs({[attrToSet]:0});
            }
        }
        let displayedMotes = perso + peri, maxDisplayed = persoMax + periMax;
        TAS.debug(`SETTING displayed-essence=[${perso}+${peri} ==> ${displayedMotes}]`);

        const finalAttr = {
            'health-displayed': actualHealth,
            'health-displayed_max': maxHealth,
            'displayed-essence': displayedMotes,
            'displayed-essence_max': maxDisplayed,
            'version': 2.32
        };
        setAttrs(finalAttr);
    }

    function upgradeto231() {
        setAttrs({
            'clash-def-penalty': 0,
            'version': 2.31
        });
    }

    function upgradeto230() {
        setAttrs({
            'grab-def-penalty': 0,
            'prone-def-penalty': 0,
            'cover-def-bonus': 0,
            'version': 2.30
        });
    }

    function upgradeto228() {
        setAttrs({
            'battlegroup-def-boost': 0,
            'battlegroup-acc-boost': 0,
            'battlegroup-dmg-boost': 0,
            'version': 2.28
        });
    }

    async function upgradeHealthBars() {
        TAS.debug('Upgrade Health Bars v1 => 2.25');
        var healthList = [];
        for (var i = 1; i <= 32; i++)
            healthList.push(`hl${i}-damage`, `hl${i}-penalty`);
        const values = await getAttrsAsync(healthList);
        var attrs = {}, healthValues = [];
        for (var i = 1; i <= 32; i++) {
            if (values[`hl${i}-damage`] !== 'healthy' || values[`hl${i}-penalty`])
                healthValues.push({damage:values[`hl${i}-damage`],penalty:values[`hl${i}-penalty`]});
        }

        const healthIndexes = [];
        var indexesIntimacies = _.times(healthValues.length, () => generateNewRowId(healthIndexes));
        TAS.debug('Creating new intimacies', indexesIntimacies);
        _.each(indexesIntimacies, function(id, k) {
            attrs['repeating_health_' + id + '_hl-damage'] = healthValues[k].damage;
            attrs['repeating_health_' + id + '_hl-penalty'] = healthValues[k].penalty;
        });

        attrs.version = 2.25;
        attrs = cleanAttrs(attrs);
        TAS.debug('Saving attributes!', attrs);
        setAttrs(cleanAttrs(attrs));
    }

    async function initIntimacies() {
        TAS.debug(`initIntimacies::initIntimacies Initializing 1st time Intimacies`);
        const idIntimaciesArray = await getSectionIDsAsync("intimacies");
        const values = await getAttrsAsync(['init-intimacies']);
        if (idIntimaciesArray.length || Number(values['init-intimacies']) !== 0) {
            TAS.debug(`ALREADY DONE => CANCEL init-intimacies=${Number(values['init-intimacies'])} len=${idIntimaciesArray.length}`);
            return;
        }

        var attrs = {}, indexesIntimacies = _.times(4, () => generateNewRowId(idIntimaciesArray));
        TAS.debug('Creating new intimacies', indexesIntimacies);
        _.each(indexesIntimacies, function(id, k) {
            attrs[`repeating_intimacies_${id}_intimacyrepeatingtype`] = (k === 0) ? 'Defining' : (k === 1) ? 'Major' : 'Minor';
        });
        attrs['init-intimacies'] = 1;
        setAttrs(attrs);
    }

    function initCharacterSheet() {
        TAS.debug('Initializing 1st time attributes');
        setAttrs({
            'version': version,
            'essence': '1',
            'apply-onslaught': 1,
            'onslaught': 0,
            'willpower': 5,
            'willpower_max': 5,
            'strength': 1,
            'dexterity': 1,
            'stamina': 1,
            'charisma': 1,
            'manipulation': 1,
            'appearance': 1,
            'perception': 1,
            'intelligence': 1,
            'wits': 1,
            'awareness': 0,
            'dodge': 0,
            'integrity': 0,
            'socialize': 0,
            'parry': 0,
            'naturalsoak': 0,
            'armorsoak': 0,
            'charmwhispergm': 0,
            'charmwhisperboth': 0,
            'caste': 'Mortal',
            'caste-low': 'unknown',
            'personal-equation': '0',
            'peripheral-equation': '0',
            'showanimadiv': 0,
            'showsupdiv': 0,
            'showlimit': 0,
            'committedesstotal': 0,
            'battlegroup-def-boost': 0,
            'battlegroup-acc-boost': 0,
            'battlegroup-dmg-boost': 0,
            'grab-def-penalty': 0,
            'prone-def-penalty': 0,
            'full-def-bonus': 0,
            'cover-def-bonus': 0,
            'clash-def-penalty': 0,
            'roll-penalty': 0
        });

        let healthAttrs = {}, idHealthArray = [], healthIndexes = _.times(7, () => generateNewRowId(idHealthArray));
        _.each(healthIndexes, function(id, k) {
            var pen;
            if (k === 0) pen = '0';
            else if ([1,2].includes(k)) pen = '-1';
            else if ([3,4].includes(k)) pen = '-2';
            else if (k === 5) pen = '-4';
            else pen = 'I';
            TAS.debug(`id=${id}, k=${k}, pen=${pen}`);
            healthAttrs['repeating_health_' + id + '_hl-damage'] = 'healthy';
            healthAttrs['repeating_health_' + id + '_hl-penalty'] = pen;
        });
        TAS.debug(`Setting Health levels :`, healthAttrs);
        setAttrs(healthAttrs);

        let defaultWeapon = {}, indexeWeapon = generateRowID();
        defaultWeapon[`repeating_weapon_${indexeWeapon}_repweaponname`] = 'Unarmed';
        defaultWeapon[`repeating_weapon_${indexeWeapon}_repweaponacc`] = '4';
        defaultWeapon[`repeating_weapon_${indexeWeapon}_repweapondam`] = '7';
        defaultWeapon[`repeating_weapon_${indexeWeapon}_repweapondef`] = '0';
        defaultWeapon[`repeating_weapon_${indexeWeapon}_repweaponparry`] = '0';
        defaultWeapon[`repeating_weapon_${indexeWeapon}_repweaponparryspe`] = '0';
        defaultWeapon[`repeating_weapon_${indexeWeapon}_repweaponov`] = '1';
        defaultWeapon[`repeating_weapon_${indexeWeapon}_repweaponatt`] = '0';
        defaultWeapon[`repeating_weapon_${indexeWeapon}_repweapontags`] = 'Bashing, Brawl, Grappling, Natural';
        setAttrs(defaultWeapon);

        const charmObj = {};
        addGenericCharmsToObj('Mortal', charmObj);
        TAS.debug(`initCharacterSheet:: Setting Default Charms=`, charmObj);
        setAttrs(charmObj);

        initIntimacies();
    }

    /* ********** */
    /* *** QC *** */
    /* ********** */

    async function changeJoinResolve() {
        let valJb = Number(await getSingleAttrAsync('qc-join-battle')),
            valRes = Number(await getSingleAttrAsync('qc-resolve')),
            valWits = 0,
            valIntegrity = 0,
            valAwareness = 0;
        TAS.debug('changeJoinResolve valJb=' + valJb + ', valRes=' + valRes);
        if (valJb <= valRes) {
            valWits = valJb;
            valIntegrity = valWits + (valRes - valJb) * 2;
        } else {
            valWits = valRes;
            valIntegrity = valRes;
            valAwareness = valJb - valRes;
        }
        TAS.debug('set wits=' + valWits + ', integrity=' + valIntegrity + ', awareness=' + valAwareness);
        setAttrs({
            'wits': valWits,
            'integrity': valIntegrity,
            'awareness': valAwareness
        });
    }

    on('change:qc-guile', TAS._fn(async function quickGuileChange(e) {
        const val = Number(await getSingleAttrAsync('qc-guile'));
        setAttrs({'manipulation': val, 'socialize': val});
    }));

    on('change:qc-resolve change:qc-join-battle', TAS._fn(function quickResolveChange(e) {
        changeJoinResolve();
    }));

    on('change:qc-evasion', TAS._fn(async function quickEvasionChange(e) {
        const val = Number(await getSingleAttrAsync('qc-evasion'));
        setAttrs({'dexterity': val, 'dodge': val});
    }));

    on('change:qc-soak', TAS._fn(async function quickSoakChange(e) {
        const val = Number(await getSingleAttrAsync('qc-soak'));
        setAttrs({'naturalsoak': val > 0 ? val - 1 : 0});
    }));

    on('change:repeating_qcattacks remove:repeating_qcattacks', setDebugWrapper(async function qcAttacksChange() {
        const idSections = await getSectionIDsAsync('qcattacks');
        let idWeaponSections = await getSectionIDsAsync('weapon');
        const qcFieldNames = [];
        idSections.forEach(id => qcFieldNames.push(`caste-have-exc`, `repeating_qcattacks_${id}_repqcattackname`, `repeating_qcattacks_${id}_repqcattackdice`, `repeating_qcattacks_${id}_repqcattackdice-exc`, `repeating_qcattacks_${id}_repqcattackdamage`, `repeating_qcattacks_${id}_repqcattackovw`));

        const valuesSections = await getAttrsAsync(qcFieldNames);
        // remove weapons
        idWeaponSections.forEach(id => removeRepeatingRow(`repeating_weapon_${id}`));
        idWeaponSections = [];

        const weaponFieldToSet = {};
        for (const id of idSections) {
            const name_attr = `repeating_qcattacks_${id}_repqcattackname`,
                atk_attr  = `repeating_qcattacks_${id}_repqcattackdice`,
                exc_attr  = `repeating_qcattacks_${id}_repqcattackdice-exc`,
                have_exc  = Boolean(valuesSections['caste-have-exc']),
                dam_attr  = `repeating_qcattacks_${id}_repqcattackdamage`,
                ovw_attr  = `repeating_qcattacks_${id}_repqcattackovw`,
                newWeapIndex = generateNewRowId(idWeaponSections),
                weap_name_attr = `repeating_weapon_${newWeapIndex}_repweaponname`,
                weap_acc_attr  = `repeating_weapon_${newWeapIndex}_repweaponacc`,
                weap_dam_attr  = `repeating_weapon_${newWeapIndex}_repweapondam`,
                weap_ovw_attr  = `repeating_weapon_${newWeapIndex}_repweaponov`,
                qcAccSplit = valuesSections[atk_attr].split('+');
            weaponFieldToSet[weap_name_attr] = `${valuesSections[name_attr]} (P:${qcAccSplit[0]}${have_exc && valuesSections[exc_attr] ? `(+${valuesSections[exc_attr]})`:''})`;
            weaponFieldToSet[weap_acc_attr] = qcAccSplit[1] ? Number(qcAccSplit[1]) : 0;
            weaponFieldToSet[weap_dam_attr] = valuesSections[dam_attr];
            weaponFieldToSet[weap_ovw_attr] = valuesSections[ovw_attr];
        }

        TAS.debug(`GetQCAttacksFieldsAndUpdateWeaponFields:: Setting:${JSON.stringify(weaponFieldToSet)}`);
        setAttrs(weaponFieldToSet);

        updateParry({sourceType: "player", triggerName: "qc-parry"});
    }));

    /* ************** */
    /* *** CHARMS *** */
    /* ************** */

    const correspondingCharmSectionValue = {
        'charms-archery': 'Archery',
        'charms-athletics': 'Athletics',
        'charms-awareness': 'Awareness',
        'charms-brawl': 'Brawl',
        'charms-bureaucracy': 'Bureaucracy',
        'charms-craft': 'Craft',
        'charms-dodge': 'Dodge',
        'charms-integrity': 'Integrity',
        'charms-investigation': 'Investigation',
        'charms-larceny': 'Larceny',
        'charms-linguistics': 'Linguistics',
        'charms-lore': 'Lore',
        'charms-medicine': 'Medicine',
        'charms-melee': 'Melee',
        'charms-occult': 'Occult',
        'charms-performance': 'Performance',
        'charms-presence': 'Presence',
        'charms-resistance': 'Resistance',
        'charms-ride': 'Ride',
        'charms-sail': 'Sail',
        'charms-socialize': 'Socialize',
        'charms-stealth': 'Stealth',
        'charms-survival': 'Survival',
        'charms-thrown': 'Thrown',
        'charms-war': 'War',
        'charms-universal': 'Universal',
        'charms-str-offense': 'Strength - Offense',
        'charms-str-mobility': 'Strength - Mobility',
        'charms-str-fos': 'Strength - Feats of Strength',
        'charms-dex-offensive': 'Dexterity - Offensive',
        'charms-dex-defense': 'Dexterity - Defense',
        'charms-dex-subterfuge': 'Dexterity - Subterfuge',
        'charms-dex-mobility': 'Dexterity - Mobility',
        'charms-dex-swarm': 'Dexterity - Swarm',
        'charms-sta-defense': 'Stamina - Defense',
        'charms-sta-endurance': 'Stamina - Endurance',
        'charms-sta-berserker': 'Stamina - Berserker',
        'charms-cha-influence': 'Charisma - Influence',
        'charms-cha-territory': 'Charisma - Territory',
        'charms-cha-warfare': 'Charisma - Warfare',
        'charms-man-influence': 'Manipulation - Influence',
        'charms-man-subterfuge': 'Manipulation - Subterfuge',
        'charms-man-guile': 'Manipulation - Guile',
        'charms-app-influence': 'Appearance - Influence',
        'charms-app-subterfuge': 'Appearance - Subterfuge',
        'charms-app-warfare': 'Appearance - Warfare',
        'charms-per-senses': 'Perception - Senses',
        'charms-per-scrutiny': 'Perception - Scrutiny',
        'charms-per-mysticism': 'Perception - Mysticism',
        'charms-int-knowledge': 'Intelligence - Knowledge',
        'charms-int-mysticism': 'Intelligence - Mysticism',
        'charms-int-crafting': 'Intelligence - Crafting',
        'charms-int-warfare': 'Intelligence - Warfare',
        'charms-int-sorcery': 'Intelligence - Sorcery',
        'charms-wit-resolve': 'Wits - Resolve',
        'charms-wit-animalken': 'Wits - Animal Ken',
        'charms-wit-navigation': 'Wits - Navigation',
        'charms-wit-cache': 'Wits - Cache',
        'charms-wit-territory': 'Wits - Territory',
        'charms-ma-snake': 'Snake Style',
        'charms-ma-tiger': 'Tiger Style',
        'charms-ma-spsitv': 'Single Point Shining Into The Void Style',
        'charms-ma-whitereaper': 'White Reaper Style',
        'charms-ma-ebonshadow': 'Ebon Shadow Style',
        'charms-ma-crane': 'Crane Style',
        'charms-ma-silvervoice': 'Silver-Voiced Nightingale Style',
        'charms-ma-righteousdevil': 'Righteous Devil Style',
        'charms-ma-blackclaw': 'Black Claw Style',
        'charms-ma-dreamingpearl': 'Dreaming Pearl Courtesan Style',
        'charms-ma-steeldevil': 'Steel Devil Style',
        'charms-ma-centipede': 'Centipede Style',
        'charms-ma-falcon': 'Falcon Style',
        'charms-ma-laughingmonster': 'Laughing Monster Style',
        'charms-ma-swayinggrass': 'Swaying Grass Dance Style',
        'charms-ma-airdragon': 'Air Dragon Style',
        'charms-ma-earthdragon': 'Earth Dragon Style',
        'charms-ma-firedragon': 'Fire Dragon Style',
        'charms-ma-waterdragon': 'Water Dragon Style',
        'charms-ma-wooddragon': 'Wood Dragon Style',
        'charms-ma-goldenjanissary': 'Golden Janissary Style',
        'charms-ma-mantis': 'Mantis Style',
        'charms-ma-whiteveil': 'White Veil Style',
        'charms-ma-other': 'MA - Other',
        'charms-evocation': 'Evocation',
        'charms-old': 'Other'
    };
    const charmDBMaRepeatableSectionArray = [
        'charms-ma-airdragon',
        'charms-ma-earthdragon',
        'charms-ma-firedragon',
        'charms-ma-waterdragon',
        'charms-ma-wooddragon'
    ];
    const charmMaRepeatableSectionArray = [
        'charms-ma-snake',
        'charms-ma-tiger',
        'charms-ma-spsitv',
        'charms-ma-whitereaper',
        'charms-ma-ebonshadow',
        'charms-ma-crane',
        'charms-ma-silvervoice',
        'charms-ma-righteousdevil',
        'charms-ma-blackclaw',
        'charms-ma-dreamingpearl',
        'charms-ma-steeldevil',
        'charms-ma-centipede',
        'charms-ma-falcon',
        'charms-ma-laughingmonster',
        'charms-ma-swayinggrass',
        ...charmDBMaRepeatableSectionArray,
        'charms-ma-goldenjanissary',
        'charms-ma-mantis',
        'charms-ma-whiteveil',
        'charms-ma-other'
    ];
    const charmSolarRepeatableSectionArray = [
        'charms-archery',
        'charms-athletics',
        'charms-awareness',
        'charms-brawl',
        'charms-bureaucracy',
        'charms-craft',
        'charms-dodge',
        'charms-integrity',
        'charms-investigation',
        'charms-larceny',
        'charms-linguistics',
        'charms-lore',
        'charms-medicine',
        'charms-melee',
        'charms-occult',
        'charms-performance',
        'charms-presence',
        'charms-resistance',
        'charms-ride',
        'charms-sail',
        'charms-socialize',
        'charms-stealth',
        'charms-survival',
        'charms-thrown',
        'charms-war'
    ];
    const charmLunarRepeatableSectionArray = [
        'charms-universal',
        'charms-str-offense',
        'charms-str-mobility',
        'charms-str-fos',
        'charms-dex-offensive',
        'charms-dex-defense',
        'charms-dex-subterfuge',
        'charms-dex-mobility',
        'charms-dex-swarm',
        'charms-sta-defense',
        'charms-sta-endurance',
        'charms-sta-berserker',
        'charms-cha-influence',
        'charms-cha-territory',
        'charms-cha-warfare',
        'charms-man-influence',
        'charms-man-subterfuge',
        'charms-man-guile',
        'charms-app-influence',
        'charms-app-subterfuge',
        'charms-app-warfare',
        'charms-per-senses',
        'charms-per-scrutiny',
        'charms-per-mysticism',
        'charms-int-knowledge',
        'charms-int-mysticism',
        'charms-int-crafting',
        'charms-int-warfare',
        'charms-int-sorcery',
        'charms-wit-resolve',
        'charms-wit-animalken',
        'charms-wit-navigation',
        'charms-wit-cache',
        'charms-wit-territory'
    ];
    const charmRepeatableSectionArrayOld = [
        ...charmSolarRepeatableSectionArray,
        ...charmLunarRepeatableSectionArray,
        ...charmMaRepeatableSectionArray,
        'charms-evocations',
        'charms'
    ];
    const charmRepeatableSectionArray = ['charms-all'];
    const charmRollExprRegexp = /^!exr (?:(?:\d+|\(.+\))#|-set)/;
    [...charmRepeatableSectionArray, 'spells'].forEach(section => {
        on(`change:repeating_${section}:charm-rollexpr`, TAS._fn(function clickGMCharmCast(e) {
            if (debug === 2) TAS.debug(`CHANGING charm-rollexpr, e=`, e);
            const attr_name = `repeating_${section}_${e.sourceAttribute.split('_')[2]}_charm-buttons-isextended`;
            let test = e.newValue ? e.newValue.match(charmRollExprRegexp) : false;
            const obj = {[attr_name] : test ? 1 : 0};
            setAttrs(obj);
        }));
    });

    charmRepeatableSectionArray.forEach(section => {
        on(`change:repeating_${section}`, setDebugWrapper(async function setAspectAndBalancedDefault(e) {
            if (debug === 2) TAS.debug(`setAspectAndBalancedDefault::setAspectAndBalancedDefault e=`, e);
            if (e.sourceType !== "player") return;
            const id = e.sourceAttribute.split('_')[2];
            const val = await getAttrsAsync([`caste`,`repeating_${section}_${id}_charm-aspect`,`repeating_${section}_${id}_charm-balanced`]);
            let objSet = {};
            if (!val[`repeating_${section}_${id}_charm-aspect`] ||
                !isDB(val['caste']) && val['caste'].toLowerCase() !== val[`repeating_${section}_${id}_charm-aspect`] ||
                 isDB(val['caste']) && !['air', 'earth', 'fire', 'water', 'wood', 'none'].includes(val[`repeating_${section}_${id}_charm-aspect`])) {
                objSet[`repeating_${section}_${id}_charm-aspect`] = val['caste'].toLowerCase();
                objSet[`repeating_${section}_${id}_charm-balanced`] = 0;
                setAttrs(objSet);
            }
        }));
    });

    charmRepeatableSectionArray.forEach(section => {
        on(`change:repeating_${section}:charm-duration`, setDebugWrapper(async function autosetCommitFromDuration(e) {
            if (debug === 2) TAS.debug(`autosetCommitFromDuration::autosetCommitFromDuration e=`, e);
            if (e.sourceType !== "player") return;
            const id = e.sourceAttribute.split('_')[2];
            const duration = await getSingleAttrAsync(`repeating_${section}_${id}_charm-duration`);
            if (debug === 2) TAS.debug(`autosetCommitFromDuration:: duration=`, duration);
            if (duration?.trim() && !['instant','permanent'].includes(duration.toLowerCase()))
                setAttrs({[`repeating_${section}_${id}_rep-cost-mote-commit`]: '1'});
            else
                setAttrs({[`repeating_${section}_${id}_rep-cost-mote-commit`]: '0'});
        }));
    });

    async function setCasteToAllCharms(casteStr) {
        if (debug === 2) TAS.debug(`setCasteToAllCharms::setCasteToAllCharms casteStr=${casteStr}`);
        var objSet = {};
        for (const section of charmRepeatableSectionArray) {
            const idSections = await getSectionIDsAsync(section);
            for (const id of idSections) {
                objSet[`repeating_${section}_${id}_charm-aspect`] = casteStr.toLowerCase();
                objSet[`repeating_${section}_${id}_charm-balanced`] = 0;
            }
        }
        TAS.debug(`UPDATING charms, objSet=`, objSet);
        setAttrs(objSet);
    }

    const costAttrs = [
        'charm-name',
        'rep-cost-mote',
        'rep-cost-mote-pool',
        'rep-cost-mote-commit',
        'rep-cost-will',
        'rep-cost-init'
    ];
    [...charmRepeatableSectionArray, 'spells'].forEach(section => costAttrs.forEach(attr => on(`change:repeating_${section}:${attr}`, setDebugWrapper(computeRepeatingRollCost))));

    function computeRepeatingRollCostAsync(e) {
        return new Promise((resolve,reject)=>{
            try  { computeRepeatingRollCost(e,()=>{ resolve(); });}
            catch{ reject(); }});
    }
    async function computeRepeatingRollCost(e, cb) {
        if (debug === 2) TAS.debug('computeRepeatingRollCost::computeRepeatingRollCost e=', JSON.stringify(e));
        const sourceAttrSplit = e.sourceAttribute.split('_'),
              repSectionName = sourceAttrSplit[1],
              id = sourceAttrSplit[2];
        const attr_name = `repeating_${repSectionName}_${id}_`;

        if (debug === 2) TAS.debug(`computeRepeatingRollCost:: attr_name=${attr_name}`);
        const val = await getAttrsAsync([...costAttrs.map(attr => attr_name + attr), attr_name + 'charm-name']);
        if (debug === 2) TAS.debug(`computeRepeatingRollCost:: getAttrsAsync(COST ATTRS) val=${JSON.stringify(val)}`);
        const mote = val[attr_name + 'rep-cost-mote'],
            motePool = val[attr_name + 'rep-cost-mote-pool'] || '?{Spend Peripheral First ?|Yes,1|No,0}',
            moteCommit = Number(val[attr_name + 'rep-cost-mote-commit']),
            charmName = val[attr_name + 'charm-name'],
            will = val[attr_name + 'rep-cost-will'],
            init = val[attr_name + 'rep-cost-init'];
        if (!mote && !will && !init) {
            TAS.debug(`computeRepeatingRollCost:: NOTHING TO DO => RESET & QUIT`);
            await setAttrsAsync({[attr_name+'rep-cost-macro']: ''});
            if (cb) cb();
            return;
        }
        let finalMacro = '=COST:@{character_id}';
        if (mote && String(mote).trim()) finalMacro += `:peri=${motePool};${mote}${moteCommit ? `;${charmName};end` : ''}`;
        if (will && String(will).trim()) finalMacro += `:will;${will}`;
        if (init) finalMacro += `:init;${init}`;
        TAS.debug(`computeRepeatingRollCost:: setting ATTR='${attr_name+'rep-cost-macro'}'=${finalMacro}`);
        if (finalMacro.indexOf('@{') !== -1)
            finalMacro = await replaceRoll20AttrsAsync(finalMacro);
        await setAttrsAsync({[attr_name+'rep-cost-macro']: finalMacro});
        if (cb) cb();
    }

    /* Combat Tab Standard Binds */
    const attrNAbi = [
        'essence',
        // attributes
        'strength',     'dexterity',    'stamina',
        'charisma',     'manipulation', 'appearance',
        'perception',   'intelligence', 'wits',
        // abilities
        'archery',      'athletics',    'awareness',
        'brawl',        'bureaucracy',  'dodge',
        'integrity',    'investigation','larceny',
        'linguistics',  'lore',         'medicine',
        'melee',        'occult',       'performance',
        'presence',     'resistance',   'ride',
        'sail',         'socialize',    'stealth',
        'survival',     'thrown',       'war',
        // battlegroup
        'battlegroup',
        'battlegroup-size',
        'battlegroup-dmg-boost'
    ];

    const initSectionsToBind =  ['attr',        'abi',      'bonus-dices',      'bonus-successes',          'final-macro-options'],
          wAtkAttrsToBind =     ['watk-attr',   'watk-abi', 'weap-atk',         'watk-bonus-dices',         'watk-bonus-successes',     'watk-final-macro-options'],
          wDmgAttrsToBind =     ['wdmg-attr',   'weap-dmg', 'wdmg-bonus-dices', 'wdmg-bonus-successes',     'wdmg-final-macro-options', 'weap-ovw'],
          dAtkAttrsToBind =     ['datk-attr',   'datk-abi', 'datk-bonus-dices', 'datk-bonus-successes',     'datk-final-macro-options'],
          dDmgAttrsToBind =     ['ddmg-dices',  'ddmg-bonus-successes',         'ddmg-final-macro-options'],
          dDmgInitResetAttrsToBind =           ['init-to-set'];

    on('clicked:repeating_rolls:roll-cast clicked:repeating_rolls:roll-gmcast clicked:repeating_combat-init:init-cast clicked:repeating_combat-init:init-gmcast', setDebugWrapper(async function castRoll(e){
        if (debug === 2) TAS.debug(`castRoll::castRoll e=${JSON.stringify(e)}`);
        const section = e.sourceAttribute.split('_')[1];
        const id = e.sourceAttribute.split('_')[2];
        const buttonClickedIsGm = e.sourceAttribute.split('_')[3].split('-')[1] === 'gmcast';
        const subSection = section === 'rolls' ? 'reprolls-' : 'repinit-';
        const attr_name = `repeating_${section}_${id}_`;
        await computeRepeatingRollCostAsync(e);
        await computeIdRepeatingRollAsync(section, id, subSection, initSectionsToBind, defaultInitFinalExpr, '', false);
        const values = await getAttrsAsync([`${attr_name}${subSection}final-macro-replaced`, `${attr_name}rep-cost-macro`]);
        let queryRoll = `!exr ${values[`${attr_name}${subSection}final-macro-replaced`]}`;
        if (buttonClickedIsGm) queryRoll += ' -gm';
        if (section !== 'rolls') queryRoll += ' -turn';
        queryRoll += ` ${values[`${attr_name}rep-cost-macro`]}`;
        if (debug === 2) TAS.debug(`castRoll:: queryRoll=${queryRoll}`);
        const results = await startRoll(queryRoll);
        finishRoll(results.rollId);
    }));

    on('clicked:repeating_combat-attack:cbt-watk-cast clicked:repeating_combat-attack:cbt-watk-gmcast '
      +'clicked:repeating_combat-attack:cbt-wdmg-cast clicked:repeating_combat-attack:cbt-wdmg-gmcast '
      +'clicked:repeating_combat-attack:cbt-datk-cast clicked:repeating_combat-attack:cbt-datk-gmcast '
      +'clicked:repeating_combat-attack:cbt-ddmg-cast-std clicked:repeating_combat-attack:cbt-ddmg-gmcast-std '
      +'clicked:repeating_combat-attack:cbt-ddmg-cast-rst clicked:repeating_combat-attack:cbt-ddmg-gmcast-rst', setDebugWrapper(async function combatCastRoll(e){
        if (debug === 2) TAS.debug(`combatCastRoll::combatCastRoll e=${JSON.stringify(e)}`);
        const section = e.sourceAttribute.split('_')[1];
        const id = e.sourceAttribute.split('_')[2];
        const split = e.sourceAttribute.split('_')[3].split('-');
        const subSection = split[1];
        const buttonClickedIsGm = split[2] === 'gmcast';
        const doReset = split[3] && split[3] === 'rst';
        const attr_name = `repeating_${section}_${id}_`;
        if (['watk', 'datk'].includes(subSection)) await computeRepeatingRollCostAsync(e);
        if (subSection === 'watk') await computeIdRepeatingRollAsync(section, id, 'repcombat-', wAtkAttrsToBind, defaultWAttackFinalExpr, 'watk-', false);
        if (subSection === 'wdmg') await computeIdRepeatingRollAsync(section, id, 'repcombat-', wDmgAttrsToBind, defaultWDamageFinalExpr, 'wdmg-', false);
        if (subSection === 'datk') await computeIdRepeatingRollAsync(section, id, 'repcombat-', dAtkAttrsToBind, defaultDAttackFinalExpr, 'datk-', false);
        if (subSection === 'ddmg') await computeIdRepeatingRollAsync(section, id, 'repcombat-', dDmgAttrsToBind, defaultDDamageFinalExpr, 'ddmg-', false);

        let queryRoll = `!exr ${await getSingleAttrAsync(`${attr_name}repcombat-${subSection}-final-macro-replaced`)}`;
        if (buttonClickedIsGm) queryRoll += ' -gm';
        if (['watk', 'datk'].includes(subSection)) queryRoll += ` ${await getSingleAttrAsync(`${attr_name}rep-cost-macro`)} ==atk==`;

        if (debug === 2) TAS.debug(`combatCastRoll:: queryRoll=${queryRoll}`);
        const results = await startRoll(queryRoll);
        finishRoll(results.rollId);

        if (doReset) {
            await computeIdRepeatingRollAsync(section, id, `repcombat-${subSection}-`, dDmgInitResetAttrsToBind, defaultInitToResetFinalExpr, 'init-to-set-', false);
            queryRoll = `/${buttonClickedIsGm ? 'g' : ''}r ${await getSingleAttrAsync(`${attr_name}repcombat-ddmg-init-to-set-final-macro-replaced`)} &{tracker}`;
            if (debug === 2) TAS.debug(`combatCastRoll:: queryRoll=${queryRoll}`);
            const resultsReset = await startRoll(queryRoll);
            finishRoll(resultsReset.rollId);
        }
    }));

    //backup for companion
    ['combat-init', 'combat-attack'].forEach(i => on(`change:repeating_${i}:combat-toggle-desc`, setDebugWrapper(fullCompute)));
    on(`change:repeating_rolls:reprolls-toggle-desc`, setDebugWrapper(fullCompute));

    function fullCompute(e) {
        const repeatingSectionName = e.sourceAttribute.split('_')[1];
        computeRepeatingRollCost(e);
        if (repeatingSectionName !== 'combat-attack') {
            computeRepeatingRoll(e, initSectionsToBind, defaultInitFinalExpr, repeatingSectionName === 'rolls' ? 'reprolls-' : 'repinit-');
        } else {
            computeRepeatingRoll(e, wAtkAttrsToBind, defaultWAttackFinalExpr, 'repcombat-', 'watk-');
            computeRepeatingRoll(e, wDmgAttrsToBind, defaultWDamageFinalExpr, 'repcombat-', 'wdmg-');
            computeRepeatingRoll(e, dAtkAttrsToBind, defaultDAttackFinalExpr, 'repcombat-', 'datk-');
            computeRepeatingRoll(e, dDmgAttrsToBind, defaultDDamageFinalExpr, 'repcombat-', 'ddmg-');

            computeRepeatingRoll(e, dDmgInitResetAttrsToBind, defaultInitToResetFinalExpr, 'repcombat-ddmg-', 'init-to-set-');
        }
    }

    function computeRepeatingRoll(e, sectionToBind, finalExprCb, attributePrefix = '', finalAttrNameAttrPrefix = '') {
        const repeatingSectionName = e.sourceAttribute.split('_')[1];
        const id = e.sourceAttribute.split('_')[2];
        if (id[0] !== '-') {
            if (debug === 2) TAS.debug(`computeRepeatingRoll:: 3rd slice is not an ID e=${JSON.stringify(e)}`);
            return;
        }
        if (debug === 2) TAS.debug(`computeRepeatingRoll::computeRepeatingRoll e=${JSON.stringify(e)}`);
        computeIdRepeatingRoll(repeatingSectionName, id, attributePrefix, sectionToBind, finalExprCb, finalAttrNameAttrPrefix);
    }

    function computeIdRepeatingRollAsync(repeatingSectionName, id, attributePrefix, sectionToBind, finalExprCb, finalAttrNameAttrPrefix, setIfReplaced = false) {
        return new Promise((resolve,reject)=>{
            try  { computeIdRepeatingRoll(repeatingSectionName, id, attributePrefix, sectionToBind, finalExprCb, finalAttrNameAttrPrefix, setIfReplaced,()=>{ resolve(); }); }
            catch{ reject(); }});
    }
    async function computeIdRepeatingRoll(repeatingSectionName, id, attributePrefix, sectionToBind, finalExprCb, finalAttrNameAttrPrefix, setIfReplaced = false, cb) {
        const attr_name = `repeating_${repeatingSectionName}_${id}_${attributePrefix}`;

        const val = await getAttrsAsync([...attrNAbi, ...sectionToBind.map(i => `${attr_name}${i}`)]);
        if (debug === 2) TAS.debug(`computeIdRepeatingRoll::getAllValuesForRoll val=${JSON.stringify(val)}`);
        const replaced = replaceRoll20AttrInArray(attr_name, sectionToBind, val);

        if (!setIfReplaced || replaced) {
            if (debug === 2) TAS.debug(`computeIdRepeatingRoll:: OUT val=${JSON.stringify(val)}`);
            let finalExpr = finalExprCb(val, attr_name);
            let finalAttrName = attr_name + finalAttrNameAttrPrefix + 'final-macro-replaced';
            TAS.debug(`computeIdRepeatingRoll:: finalAttrName=${finalAttrName} finalExpr=${finalExpr}`);
            await setAttrsAsync({ [finalAttrName]: finalExpr });
        } else {
            TAS.debug(`computeIdRepeatingRoll:: NOT SETTING ! setIfReplaced=${setIfReplaced} replaced=${replaced}`);
        }
        if (cb) cb();
    }

    function replaceRoll20AttrInArray(repeatable_name_base, repeatable_name_end_array, array) {
        let ret = false;
        for (const end of repeatable_name_end_array) {
            for (const attr_tested of attrNAbi) {
                const testedAttr = `@{${attr_tested}}`;
                if (array[`${repeatable_name_base}${end}`] && array[`${repeatable_name_base}${end}`].includes(testedAttr)) {
                    array[`${repeatable_name_base}${end}`] = array[`${repeatable_name_base}${end}`].replaceAll(testedAttr, array[attr_tested]);
                    ret = true;
                }
            }
        }
        return ret;
    }

    function replaceRoll20AttrsAsync(string) {
        return new Promise((resolve,reject)=>{
            try  { replaceRoll20Attrs(string,(values)=>{ resolve(values);}); }
            catch{ reject(); }});
    }

    async function replaceRoll20Attrs(string, cb) {
        const val = await getAttrsAsync(attrNAbi);
        for (const attr_tested of attrNAbi) {
            const testedAttr = `@{${attr_tested}}`;
            if (string && string.includes(testedAttr)) string = string.replaceAll(testedAttr, val[attr_tested]);
        }
        if (cb) cb(string);
    }

    async function computeAllDamageRolls() {
       TAS.debug('computeAllDamageRolls::computeAllDamageRolls');

        if (debug === 2) TAS.debug('computeAllDamageRolls:: UPDATING DAMAGE ROLLS');
        const arrayIdCharmSection = await getSectionIDsAsync('combat-attack');
        for (const id of arrayIdCharmSection) {
            const fakeEvent = {sourceAttribute:`repeating_combat-attack_${id}_fake-attr`};
            computeRepeatingRoll(fakeEvent, wDmgAttrsToBind, defaultWDamageFinalExpr, 'repcombat-', 'wdmg-');
            computeRepeatingRoll(fakeEvent, dDmgAttrsToBind, defaultDDamageFinalExpr, 'repcombat-', 'ddmg-');
        }
    }

    /* ALL Binds to update charms */
    attrNAbi.forEach(section => on(`change:${section}`, setDebugWrapper(verifyAllCharmsRollExpr)));

    async function verifyAllCharmsRollExpr(e, setIfReplaced = true) {
        if (e.sourceType !== "player") {
            TAS.debug(`TRIGGER FROM SCRIPT => CANCEL`);
            return;
        }
        TAS.debug('computeAllRolls::computeAllRolls e=', JSON.stringify(e));

        if (debug === 2) TAS.debug('computeAllRolls:: UPDATING CHARMS');
        for (const repeatableCharmSection of charmRepeatableSectionArray) {
            const arrayIdCharmSection = await getSectionIDsAsync(repeatableCharmSection);
            for (const id of arrayIdCharmSection) {
                const attr_name = `repeating_${repeatableCharmSection}_${id}_charm-buttons-isextended`;
                const val = await getSingleAttrAsync(`repeating_${repeatableCharmSection}_${id}_charm-rollexpr`);
                if (!(val && val.match(charmRollExprRegexp))) return;
                TAS.debug(`SETTING attr_name=${attr_name}`);
                setAttrs({[attr_name] : 1});
            }
        }
    }

    function defaultInitFinalExpr(val, attr_name)        { return `(${val[attr_name+'attr']}+ ${val[attr_name+'abi']} ${checkValReturnValidString(val[attr_name+'bonus-dices'], ' ')}-@{roll-penalty}[RollPen] -@{wound-penalty}[Wound Pen])#${checkValReturnValidString(val[attr_name+'bonus-successes'])} ${val[attr_name+'final-macro-options']}`; }
    function defaultWAttackFinalExpr(val, attr_name)     { return `(${val[attr_name+'watk-attr']} +${val[attr_name+'watk-abi']}${checkValReturnValidString(val[attr_name+'weap-atk'], '', ' +')}[Accuracy] ${checkValReturnValidString(val[attr_name+'watk-bonus-dices'], ' ')}${val['battlegroup'] && Number(val['battlegroup']) ? '+@{battlegroup-size}[BG Size] +@{battlegroup-acc-boost}[BG Acc] ':''}-@{roll-penalty}[RollPen] -@{wound-penalty}[Wound Pen])#${checkValReturnValidString(val[attr_name+'watk-bonus-successes'])} ${val[attr_name+'watk-final-macro-options']}`; }
    function defaultWDamageFinalExpr(val, attr_name)     { return `([[{${val[attr_name+'wdmg-attr']} +${val[attr_name+'weap-dmg']} ${checkValReturnValidString(val[attr_name+'wdmg-bonus-dices'], ' ')}${val['battlegroup'] && Number(val['battlegroup']) ? `${checkValReturnValidString(val['battlegroup-size'])} ${checkValReturnValidString(val['battlegroup-dmg-boost'])} `:''}+?{Threshold ?|0} -[[@{target|YOUR_TARGET|totalsoak}]],${val[attr_name+'weap-ovw']}}kh1]])#${checkValReturnValidString(val[attr_name+'wdmg-bonus-successes'])} [({${val[attr_name+'wdmg-attr']} +${val[attr_name+'weap-dmg']} ${checkValReturnValidString(val[attr_name+'wdmg-bonus-dices'], ' ')}${val['battlegroup'] && Number(val['battlegroup']) ? `${checkValReturnValidString(val['battlegroup-size'])} ${checkValReturnValidString(val['battlegroup-dmg-boost'])} `:''}+?{Threshold ?|0} -SOAK(@{target|YOUR_TARGET|totalsoak}),${val[attr_name+'weap-ovw']}}kh1)D${checkValReturnValidString(val[attr_name+'wdmg-bonus-successes'], 'S', ' +')}] ${val[attr_name+'wdmg-final-macro-options']} -NB`; }
    function defaultDAttackFinalExpr(val, attr_name)     { return `(${val[attr_name+'datk-attr']} +${val[attr_name+'datk-abi']} ${checkValReturnValidString(val[attr_name+'datk-bonus-dices'], ' ', '+')}${val['battlegroup'] && Number(val['battlegroup']) ? '+@{battlegroup-size}[BG Size] ':''}-@{roll-penalty}[RollPen] -@{wound-penalty}[Wound Pen])#${checkValReturnValidString(val[attr_name+'datk-bonus-successes'])} ${val[attr_name+'datk-final-macro-options']}`; }
    function defaultDDamageFinalExpr(val, attr_name)     { return `(${val[attr_name+'ddmg-dices']})#${checkValReturnValidString(val[attr_name+'ddmg-bonus-successes'])} ${val[attr_name+'ddmg-final-macro-options']} -NB`; }
    function defaultInitToResetFinalExpr(val, attr_name) { return `${checkValReturnValidString(val[attr_name+'init-to-set'], ')', '(')}`; }

    function checkValReturnValidString(str, suffix = '', prefix = '+') { return str ? prefix+str+suffix : ''; }
    function checkNumberReturnValidString(str, suffix = '', prefix = '+') { return str && Number(str) ? prefix+str+suffix : ''; }

    var defaultRoll20AddedDicePrompt = '?{Bonus Dices ? (Stunt, Situational, ...)|0}[Stunt,Spe,...]';
    var baseInit = '3[Base Init]+';
    var wpPrompt = `?{Willpower ?|No,0|Yes,1}`;
    var defaultRoll20AddedSuccPrompt = `?{Bonus Success ? (Stunt 2, ...)|0}[Stunt/...]+${wpPrompt}[WP]`;
    const moteCostDiceDefault = '?{Dices from Motes (Excellency)|0}';
    const moteCostSuccBase = '?{Success from Motes (Excellency), COST 2 PER POINTS|0}';
    const moteCostSuccDefault = `[[ ${moteCostSuccBase} * 2 ]]`;
    const moteCostBothDefault = `[[ ${moteCostDiceDefault} + ${moteCostSuccBase} * 2 ]]`;
    var diceExAddedPrompt = `+${moteCostDiceDefault}[Dices from Motes]`;
    var succExAddedPrompt = `+${moteCostSuccBase}[Success from Motes]`;

    function getMoteCostToSet(diceExTest, succExTest) {
        if (diceExTest || succExTest) {
            if (diceExTest && succExTest) return moteCostBothDefault;
            else if (diceExTest) return moteCostDiceDefault;
            else if (succExTest) return moteCostSuccDefault;
        }
        return '';
    }

    /* Combat Tab Roll Section '+' Triggers */
    on('clicked:repeating_combat-attack:default-macro-watk-d', setDebugWrapper(async function clickPlusWAtkDice(e) {
        if (debug === 2) TAS.debug(`CLICK watk-d !!! e=${JSON.stringify(e)}`);
        const {attr_name, repeatingSectionName, id, section} = setupVar(e);
        const tested_attr = `${attr_name}repcombat-watk-abi`,
              written_attr = `${attr_name}repcombat-watk-bonus-dices`,
              mote_attr = `${attr_name}rep-cost-mote`;
        const val = await getAttrsAsync([tested_attr, 'diceex', 'succex']);
        const diceExTest = val['diceex'] === '1', succExTest = val['succex'] === '1';
        setAttrs({[mote_attr] : getMoteCostToSet(diceExTest, succExTest)});
        let writtenValue = defaultRoll20AddedDicePrompt + (diceExTest ? diceExAddedPrompt : '');
        if (val[tested_attr].indexOf('@{archery}') === 0)     writtenValue = `?{Range ?|Close,-2|Short,4|Medium,2|Long,0|Extreme,-2}[Archery Range]+${writtenValue}`;
        else if (val[tested_attr].indexOf('@{thrown}') === 0) writtenValue = `?{Range ?|Close,4|Short,3|Medium,2|Long,-1|Extreme,-2}[Thrown Range]+${writtenValue}`;
        await setCb(written_attr, writtenValue);
        setDefaultsOnDAtkDice(e);
    }));

    on('clicked:repeating_combat-attack:default-macro-datk-d', setDebugWrapper(function clickDefaultMacroDAtkDice(e) {
        if (debug === 2) TAS.debug(`CLICK datk-d !!! e=${JSON.stringify(e)}`);
        setDefaultsOnDAtkDice(e);
    }));

    async function setDefaultsOnDAtkDice(e) {
        const val = await getAttrsAsync(['diceex']);
        const {attr_name, repeatingSectionName, id, section} = setupVar(e);
        await setCb(`${attr_name}repcombat-datk-bonus-dices`, defaultRoll20AddedDicePrompt + (val['diceex'] === '1' ? diceExAddedPrompt : ''));
    }

    on('clicked:repeating_combat-attack:default-macro-watk-s', setDebugWrapper(function clickDefaultMacroWAtkDice(e) {
        setDefaultsOnAtkSuccType(e, true);
    }));

    on('clicked:repeating_combat-attack:default-macro-datk-s', setDebugWrapper(function clickDefaultMacroWAtkDice(e) {
        setDefaultsOnAtkSuccType(e);
    }));

    async function setDefaultsOnAtkSuccType(e, setWill = false) {
        if (debug === 2) TAS.debug(`CLICK watk-s & datk-s !!! e=${JSON.stringify(e)}`);
        const val = await getAttrsAsync(['succex']);
        const succExTest = val['succex'] === '1';

        const {attr_name, repeatingSectionName, id, section} = setupVar(e);
        if (setWill) setAttrs({[`${attr_name}rep-cost-will`] : '?{Willpower ?|No,0|Yes,1}'});

        await setCb(`${attr_name}repcombat-${section}-bonus-successes`, defaultRoll20AddedSuccPrompt + (succExTest ? succExAddedPrompt : ''));

        TAS.debug(`setDefaultsOnAtkSuccType:: SECTION=${e.sourceAttribute.split('_')[3].split('-')[2]}`);
        if (e.sourceAttribute.split('_')[3].split('-')[2] === 'watk')
            await setCb(`${attr_name}repcombat-datk-bonus-successes`, defaultRoll20AddedSuccPrompt + (succExTest ? succExAddedPrompt : ''));
    }

    on('clicked:repeating_combat-attack:default-macro-datk-set-name', setDebugWrapper(async function clickDefaultMacroSetName(e) {
        if (debug === 2) TAS.debug(`CLICK roll-set-name !!! e=${JSON.stringify(e)}`);
        const {attr_name, repeatingSectionName, id, section} = setupVar(e);
        const values = await getAttrsAsync(["character_name"]);
        await setCb(`${attr_name}repcombat-ddmg-dices`, `@{tracker|${values["character_name"]}}`);
    }));

    /* QC special trigger when changing attr for withering damage => simulate all '+' pressed to gain time */
    on('change:repeating_combat-attack:repcombat-wdmg-attr', setDebugWrapper(async function testQCSetup(e) {
        if (debug === 2) TAS.debug(`CLICK watk-s & datk-s !!! e=${JSON.stringify(e)}`);
        const values = await getAttrsAsync(['qc', 'diceex', 'succex']);
        TAS.debug(`ifQCSetupAll:: values=${JSON.stringify(values)} values.qc=${values.qc}`);
        if (values.qc) {
            const id = e.sourceAttribute.split('_')[2];
            const attr_name = `repeating_combat-attack_${id}_`;
            const diceExTest = values['diceex'] === '1', succExTest = values['succex'] === '1';
            setAttrs({
                [`${attr_name}repcombat-watk-bonus-dices`]: defaultRoll20AddedDicePrompt + (diceExTest ? diceExAddedPrompt : ''),
                [`${attr_name}repcombat-datk-bonus-dices`]: defaultRoll20AddedDicePrompt + (diceExTest ? diceExAddedPrompt : ''),
                [`${attr_name}repcombat-watk-bonus-successes`]: defaultRoll20AddedSuccPrompt + (succExTest ? succExAddedPrompt : ''),
                [`${attr_name}repcombat-datk-bonus-successes`]: defaultRoll20AddedSuccPrompt + (succExTest ? succExAddedPrompt : ''),
                [`${attr_name}repcombat-ddmg-init-to-set`]: '3',
                [`${attr_name}rep-cost-mote`]: getMoteCostToSet(diceExTest, succExTest),
                [`${attr_name}rep-cost-will`]: '?{Willpower ?|No,0|Yes,1}'
            });
        }
    }));

    /* Roll Section & Init '+' Triggers */
    on('clicked:repeating_rolls:default-macro-d clicked:repeating_combat-init:default-macro-d', setDebugWrapper(async function clickDefaultMacroRollsDice(e) {
        if (debug === 2) TAS.debug(`CLICK roll-d !!! e=${JSON.stringify(e)}`);
        const {attr_name, repeatingSectionName, id, section} = setupVar(e);
        const val = await getAttrsAsync(['diceex', 'succex']);
        const diceExTest = val['diceex'] === '1', succExTest = val['succex'] === '1';
        setAttrs({[`${attr_name}rep-cost-mote`] : getMoteCostToSet(diceExTest, succExTest)});
        const prefix = repeatingSectionName === 'combat-init' ? 'repinit-' : 'reprolls-';
        await setCb(`${attr_name}${prefix}bonus-dices`, defaultRoll20AddedDicePrompt + (diceExTest ? diceExAddedPrompt : ''));
    }));

    on('clicked:repeating_rolls:default-macro-s clicked:repeating_combat-init:default-macro-s', setDebugWrapper(async function clickDefaultMacroRollsDice(e) {
        if (debug === 2) TAS.debug(`CLICK roll-s !!! e=${JSON.stringify(e)}`);
        const {attr_name, repeatingSectionName, id, section} = setupVar(e);
        const val = await getAttrsAsync(['succex']);
        setAttrs({[`${attr_name}rep-cost-will`] : '?{Willpower ?|No,0|Yes,1}'});
        const prefix = repeatingSectionName === 'combat-init' ? 'repinit-' : 'reprolls-';
        await setCb(`${attr_name}${prefix}bonus-successes`, (repeatingSectionName === "combat-init" ? baseInit : '') + defaultRoll20AddedSuccPrompt + (val['succex'] === '1' ? succExAddedPrompt : ''));
    }));

    /* replicate withering to decisive */
    on('change:repeating_combat-attack:repcombat-watk-attr change:repeating_combat-attack:repcombat-watk-abi', setDebugWrapper(async function qcDamageAttacksChange(e) {
        const id = e.sourceAttribute.split('_')[2];
        const repAttr = e.sourceAttribute.split('_')[3].split('-')[2];
        const values = await getSingleAttrAsync(`repeating_combat-attack_${id}_repcombat-watk-${repAttr}`);
        const finalObj = {[`repeating_combat-attack_${id}_repcombat-datk-${repAttr}`]: values};
        setAttrs(finalObj);
    }));

    /* trigger sheet initialize manually */
    on('clicked:init-sheet-btn', setDebugWrapper(function qcDamageAttacksChange(e) {
        initCharacterSheet();
    }));

    on('clicked:init-charm-img', TAS._fn(async function updateMotePool(eventInfo){
        const caste = await getSingleAttrAsync(`caste`);
        setCasteToAllCharms(caste);
    }));

    /* multiple HL add mechanism */
    on('clicked:add-multiple-hl', TAS._fn(async function updateMotePool(eventInfo){
        const values = await getAttrsAsync(["add-multiple-qty", "add-multiple-penalty"]);
        const qty     = values["add-multiple-qty"] || 1,
              penalty = values["add-multiple-penalty"] || "0";
        const idHealthArray = await getSectionIDsAsync("health");
        const healthIndexes = {};
        for (let i = 0; i < qty; i++) {
            TAS.debug(`before generateNewRowId idHealthArray=${idHealthArray}`);
            let newId = generateNewRowId(idHealthArray);
            TAS.debug(`id=${newId}, i=${i}, penalty=${penalty}`);
            healthIndexes['repeating_health_' + newId + '_hl-damage'] = 'healthy';
            healthIndexes['repeating_health_' + newId + '_hl-penalty'] = penalty;
        }
        TAS.debug(`add-multiple-hl:: Setting Health levels :`, healthIndexes);
        setAttrs(healthIndexes);
        updateWound({sourceType: "player", triggerName: "other"});
    }));

    function generateNewRowId(array_existing) {
        let ret;
        do {
            ret = generateRowID();
        } while (array_existing.includes(ret))
        array_existing.push(ret);
        return ret;
    }

    /* heal HL button */
    on('clicked:heal-hl', TAS._fn(async function updateMotePool(eventInfo){
        const idHealthArray = await getSectionIDsAsync("health");
        const healthIndexes = {};
        idHealthArray.forEach(id => healthIndexes['repeating_health_' + id + '_hl-damage'] = 'healthy');
        TAS.debug(`heal-hl:: Setting Health levels :`, healthIndexes);
        setAttrs(healthIndexes);
        updateWound({sourceType: "player", triggerName: "other"});
    }));

    on('change:show-charname-in-charms', TAS._fn(async function updateShowCharm(eventInfo){
        TAS.debug(`change:show-charname-in-charms`);
        const value = await getSingleAttrAsync(`show-charname-in-charms`);
        TAS.debug(`values["show-charname-in-charms"]=${value}`);
        const obj = {'show_character_name': (value === "1" ? "1" : "")};
        TAS.debug(`obj=${JSON.stringify(obj)}`);
        setAttrs(obj);
    }));

    /* Add Spirit Charms button */
    on('clicked:add-spirit-charms-btn', TAS._fn(async function addSpiritCharms(eventInfo){
        const caste = await getSingleAttrAsync(`caste`);
        const idsCharms = await getSectionIDsAsync("charms");
        const aspectStr = isDB(caste) ? 'none' : caste.toLowerCase();
        const charmObj = {};
        addNewCharmToFinalObj(charmObj, generateNewRowId(idsCharms), {name:'Hurry Home', type:'Simple',
            cost:'10m, 1wp', cost_mote:'10', cost_pool:'0', cost_will: '1', cost_macro:'=COST:@{character_id}:peri=0;10:will;1',
            short_d: 'Back to Sanctuary', skill:'Spirit Charm', duration:'Instant', aspect:aspectStr,
            effect:'The spirit fades away and vanishes on its next turn, drawn instantly back to its sanctum.'});

        addNewCharmToFinalObj(charmObj, generateNewRowId(idsCharms), {name:'Materialize', type:'Simple',
            cost:'[[ceil((@{personal-essence_max}) / 2)]]m, 1wp', cost_mote:'[[ceil((@{personal-essence_max}) / 2)]]', cost_pool:'0', cost_will: '1', cost_macro:'=COST:@{character_id}:peri=0;[[ceil((@{personal-essence_max}) / 2)]]:will;1',
            skill:'Spirit Charm', duration:'Instant', aspect:aspectStr,
            effect:'Allows the spirit to take on flesh and appear in front of everyone present.'});

        addNewCharmToFinalObj(charmObj, generateNewRowId(idsCharms), {name:'Measure the Wind', type:'Simple', cost:'5m', cost_mote:'5', cost_pool:'0', cost_macro:'=COST:@{character_id}:peri=0;5',
            short_d:'Sense the Nature of Someone', skill:'Spirit Charm', duration:'Instant', aspect:aspectStr,
            effect:'Allows the spirit to sense the nature of an individual depending on the scope of his own attribution.'});

        addNewCharmToFinalObj(charmObj, generateNewRowId(idsCharms), {name:'Apparition', type:'Simple', cost:'1m', cost_mote:'1', cost_pool:'0', cost_macro:'=COST:@{character_id}:peri=0;1',
            short_d:'Appear for a scene', skill:'Spirit Charm', duration:'Instant', aspect:aspectStr,
            effect:'Allows the spirit to take on flesh and appear in front of everyone present for the duration of the scene.'});

        setAttrs(charmObj);
    }));

    function addNewCharmToFinalObj(charmObj, id, setObj, section_old = false) {
        const section = section_old ? 'charms' : 'charms-all';
        const attrMap = {
            'name': 'charm-name',
            'type': 'charm-type',
            'cost': 'charm-cost',
            'cost_mote': 'rep-cost-mote',
            'cost_pool': 'rep-cost-mote-pool',
            'cost_will': 'rep-cost-will',
            'cost_macro': 'rep-cost-macro',
            'short_d': 'charm-short-desc',
            'skill': 'charm-skill',
            'duration': 'charm-duration',
            'aspect': 'charm-aspect',
            'description': 'charm-description',
            'effect': 'charm-effect',
        };
        for (const [k, v] of Object.entries(setObj)) {
            if (attrMap[k]) charmObj[`repeating_${section}_${id}_${attrMap[k]}`] = v;
        }
    }

    /* Set Spirit Charms Name button */
    on('clicked:set-spirit-charms-skill-btn', TAS._fn(async function setSpiritCharmsName(eventInfo){
        const charName = await getSingleAttrAsync(`character_name`);
        const idsCharms = await getSectionIDsAsync("charms");
        const charmObj = {};
        for (const id of idsCharms)
            charmObj[`repeating_charms-all_${id}_charm-skill`] = `${charName} Charm`;

        setAttrs(charmObj);
    }));

    /* Add Usefull Intimacies button */
    on('clicked:add-default-intimacy-categories', TAS._fn(async function addSpiritCharms(eventInfo){
        const idsIntimacies = await getSectionIDsAsync("intimacies");
        const intiObj = {};
        const idInti1 = generateNewRowId(idsIntimacies);
        intiObj[`repeating_intimacies_${idInti1}_intimacyrepeatingname`] = '---=== PRINCIPLES ===---';
        intiObj[`repeating_intimacies_${idInti1}_intimacyrepeatingtype`] = 'none';

        const idInti2 = generateNewRowId(idsIntimacies);
        intiObj[`repeating_intimacies_${idInti2}_intimacyrepeatingname`] = '---=== TIES ===---';
        intiObj[`repeating_intimacies_${idInti2}_intimacyrepeatingtype`] = 'none';

        const idInti3 = generateNewRowId(idsIntimacies);
        intiObj[`repeating_intimacies_${idInti3}_intimacyrepeatingname`] = ' --- CERCLE --- ';
        intiObj[`repeating_intimacies_${idInti3}_intimacyrepeatingtype`] = 'none';

        const idInti4 = generateNewRowId(idsIntimacies);
        intiObj[`repeating_intimacies_${idInti4}_intimacyrepeatingname`] = '---- INSPIRE ---- :';
        intiObj[`repeating_intimacies_${idInti4}_intimacyrepeatingtype`] = 'Major';

        setAttrs(intiObj);
    }));

    /* Commit List feature (auto set commited motes) */
    on('change:usecommitsystem remove:repeating_commited-list change:repeating_commited-list:commited-state change:repeating_commited-list:commited-cost-peri change:repeating_commited-list:commited-cost-perso', TAS._fn(async function handleCommitListChange(e){
        const idsCommited = await getSectionIDsAsync("commited-list");
        const val = await getAttrsAsync([...idsCommited.map(id => [
            `repeating_commited-list_${id}_commited-state`,
            `repeating_commited-list_${id}_commited-cost-peri`,
            `repeating_commited-list_${id}_commited-cost-perso`]).flat()]);
        TAS.debug(`change:usecommitsystem val=`, val);
        const intiObj = {};
        let comPerso = 0, comPeri = 0;
        for (const id of idsCommited) {
            const costPeri = cleanAndEval(val[`repeating_commited-list_${id}_commited-cost-peri`], intiObj, `repeating_commited-list_${id}_commited-cost-peri`)
            const costPerso = cleanAndEval(val[`repeating_commited-list_${id}_commited-cost-perso`], intiObj, `repeating_commited-list_${id}_commited-cost-perso`)
            if (Number(val[`repeating_commited-list_${id}_commited-state`]) && (costPeri || costPerso)) {
                if (costPeri && costPerso)  intiObj[`repeating_commited-list_${id}_commited-pool-type`] = 'mixed';
                else if (costPeri)          intiObj[`repeating_commited-list_${id}_commited-pool-type`] = '1';
                else if (costPerso)         intiObj[`repeating_commited-list_${id}_commited-pool-type`] = '0';
                comPeri += costPeri;
                comPerso += costPerso;
            }
        }
        intiObj[`committedessperso`] = comPerso;
        intiObj[`committedesstotal`] = comPeri;
        if (e.sourceAttribute === 'usecommitsystem' && e.newValue === '0') intiObj[`commit-list-shown`] = 0;
        TAS.debug(`handleCommitListChange:: BEFORE SET val=`, intiObj);

        setAttrs(intiObj);
    }));

    function cleanAndEval(val, setObj, keyName) {
        const cleanerReg = /[^\d\+]+/g;
        if (debug === 2) TAS.debug(`cleanAndEval:: val="${val}" key=${keyName}`);
        let str = String(val).replaceAll(cleanerReg, '');
        if (debug === 2) TAS.debug(`cleanAndEval:: str="${str}"`);
        if (str !== val) setObj[keyName] = str;
        let final = Number(eval(str));
        if (debug === 2) TAS.debug(`cleanAndEval:: final=${final}`);
        return final;
    }

    /* Sage Beast Virtue toggle */
    on('change:sbv-activated', TAS._fn(async function changeSBVActivation(eventInfo){
        TAS.debug(`changeSBVActivation:: eventInfo=`, eventInfo);
        const attrs = ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception', 'intelligence', 'wits'];
        const valAttrs = await getAttrsAsync(attrs);
        const attrObj = {};
        let added = 1;
        if (eventInfo.newValue === '0') added = -1;

        for (const attr of attrs)
            attrObj[attr] = Number(valAttrs[attr]) + added;

        TAS.debug(`changeSBVActivation:: attrObj=`, attrObj);
        setAttrs(attrObj);
    }));

    /* Add a new charm to charms-all */
    async function addGenericCharm(name){
        const idsCharms = await getSectionIDsAsync("charms-all");
        const caste = await getSingleAttrAsync("caste");
        const actualSection = await getSingleAttrAsync("charm_sheet");
        const charmObj = {};
        const idNewCharm = generateNewRowId(idsCharms);
        if (actualSection === 'Evocation')
            charmObj[`repeating_charms-all_${idNewCharm}_isEvoc`] = 'Evocation';
        else if (actualSection === 'other')
            charmObj[`repeating_charms-all_${idNewCharm}_charm-skill`] = `${caste} Power`;
        else
            charmObj[`repeating_charms-all_${idNewCharm}_charm-skill`] = actualSection;

        if (actualSection.indexOf(' Dragon Style') > 0)
            charmObj[`repeating_charms-all_${idNewCharm}_charm-aspect`] = actualSection.split(' ')[0].toLowerCase();
        else if (isDB(caste))
            charmObj[`repeating_charms-all_${idNewCharm}_charm-aspect`] = 'none';
        else
            charmObj[`repeating_charms-all_${idNewCharm}_charm-aspect`] = caste.toLowerCase();

        if (name)
            charmObj[`repeating_charms-all_${idNewCharm}_charm-name`] = name;

        if (debug === 2) TAS.debug(`addGenericCharm:: charmObj=`, charmObj);
        setAttrs(charmObj);
    }
    on('clicked:add-charm-to-all', () => setDebugWrapper(addGenericCharm)());

    on('change:_reporder:charms-all', setDebugWrapper(async function forceTriggerRefresh(e){
        if (debug === 2) TAS.debug(`forceTriggerRefresh:: e.sourceType=${e.sourceType}`);
        if (e.sourceType !== "player") {
            if (debug === 2) TAS.debug(`clicked:add-charm-to-all:: TRIGGER FROM SCRIPT => CANCEL`);
            return;
        }
        if (debug === 2) TAS.debug(`forceTriggerRefresh:: FORCE_REFRESH`);
        await addGenericCharm('FORCE_REFRESH');
    }));

    on('change:repeating_charms-all:charm-name', setDebugWrapper(function detectTriggerRefresh(eventInfo){
        if (debug === 2) TAS.debug(`detectTriggerRefresh::detectTriggerRefresh`);
        if (eventInfo.sourceType === "player") {
            if (debug === 2) TAS.debug(`detectTriggerRefresh:: TRIGGER FROM PLAYER => CANCEL`);
            return;
        }
        if (eventInfo.newValue === 'FORCE_REFRESH') {
            const id = eventInfo.sourceAttribute.split('_')[2];
            if (debug === 2) TAS.debug(`detectTriggerRefresh:: FORCE_REFRESH => DELETE ROW id=${id}`);
            removeRepeatingRow(`repeating_charms-all_${id}`);
        }
    }));

    /* ***************** */
    /* * Rolls Widgets * */
    /* ***************** */

    /* COST */
    const widgetCostAttrs = [
        'rep-cost-mote-offset',
        'reprolls-willpower-toggle',
        'reprolls-ycharm-dices',
        'reprolls-ycharm-successes',
        'reprolls-pool-starting'
    ];

    for (const attr of widgetCostAttrs) {
        on(`change:repeating_rolls-widget:${attr}`, updateRollWidgetForCostAsync);
    };

    function updateRollWidgetForCostAsync(e) {
        return new Promise((resolve,reject)=>{
            try  { updateRollWidgetForCost(e,()=>{ resolve(); });}
            catch{ reject(); }});
    }
    async function updateRollWidgetForCost(e, cb) {
        if (debug === 2) TAS.debug('updateWidgetRollForCost::updateWidgetRollForCost e=', JSON.stringify(e));

        const attr_name = `repeating_rolls-widget_${e.sourceAttribute.split('_')[2]}_`;
        if (debug === 2) TAS.debug(`updateWidgetRollForCost:: attr_name=${attr_name}`);

        if (e.sourceType === "sheetworker") {
            if (debug === 2) TAS.debug('updateWidgetRollForCost:: SHEETWORKER TRIGGER ?!?!?!?');
            return;
        }

        const val = await getAttrsAsync(widgetCostAttrs.map(attr => attr_name + attr));
        if (debug === 2) TAS.debug(`updateWidgetRollForCost:: getAttrsAsync(COST ATTRS) val=${JSON.stringify(val)}`);
        const moteOffset = Number(val[attr_name + 'rep-cost-mote-offset']),
              will = Number(val[attr_name + 'reprolls-willpower-toggle']) || 0,
              starting = Number(val[attr_name + 'reprolls-pool-starting']);
        let moteDices = Number(val[attr_name + 'reprolls-ycharm-dices']),
            moteSuccs = Number(val[attr_name + 'reprolls-ycharm-successes']),
            finalMacro = '=COST:@{character_id}',
            finalObj = {};
        if (moteDices < 0) {
            moteDices = 0;
            finalObj = {...finalObj, [attr_name + 'reprolls-ycharm-dices']: 0};
        }
        if (moteSuccs < 0) {
            moteSuccs = 0;
            finalObj = {...finalObj, [attr_name + 'reprolls-ycharm-successes']: 0};
        }
        let moteCost = moteOffset + moteDices + moteSuccs * 2;
        if (moteCost < 0) moteCost = 0;
        if (moteCost) finalMacro += `:peri=${starting};${moteCost}`;
        if (will) finalMacro += `:will;${will}`;
        TAS.debug(`updateWidgetRollForCost:: setting ATTR='${attr_name+'rep-cost-macro'}'=${finalMacro}`);
        finalObj = {
            ...finalObj,
            [attr_name+'rep-cost-macro']: finalMacro,
            [attr_name+'rep-cost-total-taint']: moteCost >= 5 ? starting : 0
        };
        await setAttrsAsync(finalObj);
        if (cb) cb();
    }

    /**
     * Reset negative value that doesnt have sense
     */
    const resetOnNegAttrs = [
        'reprolls-ycharm-dices',
        'reprolls-ycharm-paid-dices',
        'reprolls-ycharm-successes',
        'reprolls-ycharm-paid-successes',
        'reprolls-ncharm-successes'
    ];
    resetOnNegAttrs.forEach(attr => on(`change:repeating_rolls-widget:${attr}`, resetAttrOnNeg));
    function resetAttrOnNeg(e) {
        if (e.sourceType !== "player") return;
        const sourceAttrSplit = e.sourceAttribute.split('_'),
              id = sourceAttrSplit[2],
              baseAttr = sourceAttrSplit[3];
        const finalAttr = `repeating_rolls-widget_${id}_${baseAttr}`;
        if (debug === 2) TAS.debug(`resetAttrOnNeg::resetAttrOnNeg e=${JSON.stringify(e)}`);
        if (Number(e.newValue) < 0) setAttrs({[finalAttr]: 0});
    }

    /**
     * Roll Widget Compute and startRoll !!!
     */
    const rollWidgetSectionsToBind =  ['toggle-desc', 'attr', 'abi', 'stunt-dices', 'specialty', 'ycharm-dices', 'ycharm-paid-dices', 'ncharm-dices', 'willpower-toggle', 'ycharm-successes', 'ycharm-paid-successes', 'ncharm-successes', 'final-macro-options'];
    function defaultRollWidgetFinalExpr(val, attr_name)        { return `(${val[attr_name+'attr']}+ ${val[attr_name+'abi']}${checkNumberReturnValidString(val[attr_name+'stunt-dices'], '[Stunt]', '+ ')}${checkNumberReturnValidString(val[attr_name+'specialty'], '[Specialty]', '+ ')}${checkNumberReturnValidString(val[attr_name+'ycharm-dices'], '[Charm Dices]', '+ ')}${checkNumberReturnValidString(val[attr_name+'ycharm-paid-dices'], '[Paid Dices]', '+ ')}${checkNumberReturnValidString(val[attr_name+'ncharm-dices'], '[Non-Charm Dices]', '+ ')} -@{roll-penalty}[RollPen] -@{wound-penalty}[Wound Pen])#${checkNumberReturnValidString(val[attr_name+'willpower-toggle'], '[WP]')}${checkNumberReturnValidString(val[attr_name+'ycharm-successes'], '[Charm Successes]')}${checkNumberReturnValidString(val[attr_name+'ycharm-paid-successes'], '[Paid Successes]')}${checkNumberReturnValidString(val[attr_name+'ncharm-successes'], '[Non-Charm Successes]')} ${val[attr_name+'final-macro-options']}`; }

    on('clicked:repeating_rolls-widget:roll-widget-cast clicked:repeating_rolls-widget:roll-widget-gmcast', setDebugWrapper(async function castRoll(e){
        if (debug === 2) TAS.debug(`castRoll::castRoll e=${JSON.stringify(e)}`);
        const id = e.sourceAttribute.split('_')[2];
        const buttonClicked = e.sourceAttribute.split('_')[3];
        const attr_name = `repeating_rolls-widget_${id}_`;
        await updateRollWidgetForCostAsync(e);
        await computeIdRepeatingRollAsync('rolls-widget', id, 'reprolls-', rollWidgetSectionsToBind, defaultRollWidgetFinalExpr, '', false);
        const values = await getAttrsAsync([`${attr_name}reprolls-final-macro-replaced`, `${attr_name}rep-cost-macro`]);
        let queryRoll = buttonClicked === 'roll-widget-cast' ?
            `!exr ${values[`${attr_name}reprolls-final-macro-replaced`]} ${values[`${attr_name}rep-cost-macro`]}` :
            `!exr ${values[`${attr_name}reprolls-final-macro-replaced`]} -gm ${values[`${attr_name}rep-cost-macro`]}`;
        if (debug === 2) TAS.debug(`castRoll:: queryRoll=${queryRoll}`);
        const results = await startRoll(queryRoll);
        const resetObj = {
            [`${attr_name}reprolls-stunt-dices`]: 0,
            [`${attr_name}reprolls-willpower-toggle`]: 0
        };
        setAttrs(resetObj);
        finishRoll(results.rollId);
    }));

    //backup for companion
    on(`change:repeating_rolls-widget:reprolls-toggle-desc`, setDebugWrapper((e) => {
        updateRollWidgetForCost(e);
        computeIdRepeatingRoll('rolls-widget', e.sourceAttribute.split('_')[2], 'reprolls-', rollWidgetSectionsToBind, defaultRollWidgetFinalExpr, '', false);
    }));

    charmRepeatableSectionArray.forEach(section => {
        on(`clicked:repeating_${section}:learn-charm`, TAS._fn(async function clickGMCharmCast(e) {
            if (debug === 2) TAS.debug(`CLICKED "LEARN!", e=`, e);
            const id = e.sourceAttribute.split('_')[2];
            setAttrs({[`repeating_${section}_${id}_charm-learnt`] : 1});
        }));

        on(`change:repeating_${section}:charm-learnt`, TAS._fn(async function changedCharmLearnt(e) {
            if (debug === 2) TAS.debug(`CHANGED "LEARN!", e=`, e);
            if (e.newValue === '0') return;
            const id = e.sourceAttribute.split('_')[2];
            const values = await getAttrsAsync(["character_name", `repeating_${section}_${id}_charm-name`, `repeating_${section}_${id}_charm-skill`]);
            const results = await startRoll(`/w gm **${values['character_name']}** is Learning a NEW CHARM called *"${values[`repeating_${section}_${id}_charm-name`]}"* for skill *"${values[`repeating_${section}_${id}_charm-skill`]}"* !`);
            finishRoll(results.rollId);
        }));
    });

    charmRepeatableSectionArray.forEach(section => {
        on(`clicked:repeating_${section}:change-aspect`, TAS._fn(async function clickGMCharmCast(e) {
            if (debug === 2) TAS.debug(`CLICKED ChangeAspect !, e=`, e);
            const id = e.sourceAttribute.split('_')[2];
            const values = await getAttrsAsync([`repeating_${section}_${id}_charm-aspect`]);
            const aspectList = ['air', 'earth', 'fire', 'water', 'wood'];
            let aspectNumber = aspectList.indexOf(values[`repeating_${section}_${id}_charm-aspect`]);
            TAS.debug(`CLICKED ChangeAspect !, aspectNumber=`, aspectNumber);
            if (aspectNumber === -1) return;
            aspectNumber++;
            if (aspectNumber >= 5) aspectNumber = 0;
            TAS.debug(`CLICKED ChangeAspect !, final aspectNumber=${aspectNumber}, aspect=${aspectList[aspectNumber]}`);
            setAttrs({[`repeating_${section}_${id}_charm-aspect`] : aspectList[aspectNumber]});
        }));
    });

    /* *************************** */
    /* * Inputs to Spans SECTION * */
    /* *************************** */

    const attrToPushOnUpdate = [];
    const allRepeatablesToPush = ['rolls-widget'];

    // attrToPushOnUpdate.forEach(attrName => on(`change:${attrName}`, setDebugWrapper(e => {
    //     repeatGlobalToRepeatableAttr(attrName, e);
    // })));

    function repeatGlobalToRepeatableAttr(attrName, e) {
        if (debug === 2) TAS.debug(`repeatGlobalToRepeatableAttr::repeatGlobalToRepeatableAttr e=${JSON.stringify(e)}`);
        if (isNaN(e.newValue) && isNaN(e.previousValue)) return;
        const value = Number(e.newValue) || 0;
        setAttrs(repeatGlobalToRepeatableAttrToValue(attrName, value));
    }

    async function repeatGlobalToRepeatableAttrToValue(attrName, value) {
        if (debug === 2) TAS.debug(`repeatGlobalToRepeatableAttrToValue::repeatGlobalToRepeatableAttrToValue`);
        let finalSetObj = {};
        for (const sectionName of allRepeatablesToPush) {
            const sectionIds = await getSectionIDsAsync(sectionName);
            for (const id of sectionIds)
                finalSetObj[`repeating_${sectionName}_${id}_${attrName}`] = value;
        }
        if (debug === 2) TAS.debug(`pushGlobalToRepeatables:: finalSetObj=${JSON.stringify(finalSetObj)}`);
        return finalSetObj;
    }

    /* ****************** */
    /* * UTILIY SECTION * */
    /* ****************** */

    on('change:token-size-percent', function changeTokenSizePercent(e) {
        if (debug === 2) TAS.debug(`changeTokenSizePercent::changeTokenSizePercent e=`, e);
        if (isNaN(e.newValue)) setAttrs({'token-size-percent':100})
        const value = Number(e.newValue) || 100;
        const finalObj = {'token-size': value / 100};
        setAttrs(finalObj);
    });

    /**
     * 2 functions used for '+' hidden buttons
     */

    function setupVar(e) {
        if (debug === 2) TAS.debug(`setupVar::setupVar e=${JSON.stringify(e)}`);
        const split = e.sourceAttribute.split('_'),
              repeatingSectionName = split[1], id = split[2],
              section = split[3].split('-')[2];
        const attr_name = `repeating_${repeatingSectionName}_${id}_`;
        return {attr_name: attr_name, repeatingSectionName: repeatingSectionName, id: id, section: section};
    }

    function setCb(written_attr, writtenValue) {
        TAS.debug(`setupVarSetCBThenFinaliseCB:: setting ${written_attr} = ${writtenValue}`);
        return setAttrsAsync({[written_attr]: writtenValue});
    }

    /**
     * get/set repeatable section size vars
     */

    on('sheet:opened', saveAllRepeatableSectionSize);
    async function saveAllRepeatableSectionSize(e) {
        if (debug === 2) TAS.debug(`saveAllRepeatableSectionSize::saveAllRepeatableSectionSize e=`, e);
        const finalObj = {
            ...await getMeritsRepeatableSectionSize(),
            ...await getAbilitiesRepeatableSectionSize(),
            ...await getCraftsRepeatableSectionSize(),
            ...await getMARepeatableSectionSize(),
        };
        if (debug === 2) TAS.debug(`saveAllRepeatableSectionSize:: set=`, finalObj);
        setAttrs(finalObj);
    }

    on('change:repeating_merits remove:repeating_merits', saveMeritsRepeatableSectionSize);
    async function saveMeritsRepeatableSectionSize(e) {
        if (debug === 2) TAS.debug(`saveMeritsRepeatableSectionSize::saveMeritsRepeatableSectionSize e=`, e);
        const oldVal = await getAttrsAsync(['merits-length']);
        const finalObj = {...await getMeritsRepeatableSectionSize()};
        if (finalObj['merits-length'] === oldVal) return;
        setAttrs(finalObj);
    }

    async function getMeritsRepeatableSectionSize() {
        const meritIdArray = await getSectionIDsAsync("merits");
        return {'merits-length': meritIdArray.length > 10 ? 1 : 0};
    }

    on('change:repeating_abilities remove:repeating_abilities', saveAbilitiesRepeatableSectionSize);
    async function saveAbilitiesRepeatableSectionSize(e) {
        if (debug === 2) TAS.debug(`saveMeritsRepeatableSectionSize::saveMeritsRepeatableSectionSize e=`, e);
        const oldVal = await getAttrsAsync(['rep-abi-enabled']);
        const finalObj = {...await getAbilitiesRepeatableSectionSize()};
        if (finalObj['rep-abi-enabled'] === oldVal) return;
        setAttrs(finalObj);
    }

    async function getAbilitiesRepeatableSectionSize() {
        const abilitiesIdArray = await getSectionIDsAsync("abilities");
        return {'rep-abi-enabled': abilitiesIdArray.length ? 1 : 0};
    }

    on('change:repeating_crafts remove:repeating_crafts', saveCraftsRepeatableSectionSize);
    async function saveCraftsRepeatableSectionSize(e) {
        if (debug === 2) TAS.debug(`saveCraftsRepeatableSectionSize::saveCraftsRepeatableSectionSize e=`, e);
        const oldVal = await getAttrsAsync(['rep-crafts-enabled']);
        const finalObj = {...await getCraftsRepeatableSectionSize()};
        if (finalObj['rep-crafts-enabled'] === oldVal) return;
        setAttrs(finalObj);
    }

    async function getCraftsRepeatableSectionSize() {
        const craftsIdArray = await getSectionIDsAsync("crafts");
        return {'rep-crafts-enabled': craftsIdArray.length ? 1 : 0};
    }

    on('change:repeating_martialarts remove:repeating_martialarts', saveMARepeatableSectionSize);
    async function saveMARepeatableSectionSize(e) {
        if (debug === 2) TAS.debug(`saveMARepeatableSectionSize::saveMARepeatableSectionSize e=`, e);
        const oldVal = await getAttrsAsync(['rep-ma-enabled']);
        const finalObj = {...await getMARepeatableSectionSize()};
        if (finalObj['rep-ma-enabled'] === oldVal) return;
        setAttrs(finalObj);
    }

    async function getMARepeatableSectionSize() {
        const masIdArray = await getSectionIDsAsync("martialarts");
        return {'rep-ma-enabled': masIdArray.length ? 1 : 0};
    }

    /* Not used, but help if i want to used button[type="action"] instead of button[type="roll"] + start playing with async */
    [...charmRepeatableSectionArray, 'spells'].forEach(section => {
        on(`clicked:repeating_${section}:charmcast-show`, TAS._fn(async function clickShowCharm(e) {
            if (debug === 2) TAS.debug(`clickShowCharm::clickShowCharm e=${JSON.stringify(e)}`);
            const split = e.sourceAttribute.split('_'), section = split[1], id = split[2], buttonClicked = split[3];
            const attr_name = `repeating_${section}_${id}_`;
            const orig_roll = e.htmlAttributes.value, regexp = /@\{([^\}]+)\}/g;
            const roll20Attrs = [...orig_roll.matchAll(regexp)].map(i => i[1]).filter(i => i.includes('charm-'));
            const finalRoll20Attrs = roll20Attrs.map(i => `${attr_name}${i}`);
            if (debug === 2) TAS.debug(`clickShowCharm:: roll20Attrs=${JSON.stringify(finalRoll20Attrs)}`);

            let final_roll = orig_roll;
            roll20Attrs.forEach((attr, index) => { final_roll = final_roll.replaceAll(`@{${attr}}`, `@{${finalRoll20Attrs[index]}}`); });
            if (debug === 2) TAS.debug(`clickShowCharm:: final_roll=${final_roll}`);

            const results = await startRoll(final_roll);
            if (debug === 2) TAS.debug(`clickShowCharm:: results=${JSON.stringify(results)}`, results);
            finishRoll(results.rollId);
        }));
    });

    /* ---- BEGIN: TheAaronSheet.js ---- */
    // Github:   https://github.com/shdwjk/TheAaronSheet/blob/master/TheAaronSheet.js
    // By:       The Aaron, Arcane Scriptomancer
    // Contact:  https://app.roll20.net/users/104025/the-aaron
    // Minified with http://jscompress.com/
    function initTAS() {
    TAS=TAS||function(){"use strict";var e="0.2.4",n=1457098091,t={debug:{key:"debug",title:"DEBUG",color:{bgLabel:"#7732A2",label:"#F2EF40",bgText:"#FFFEB7",text:"#7732A2"}},error:{key:"error",title:"Error",color:{bgLabel:"#C11713",label:"white",bgText:"#C11713",text:"white"}},warn:{key:"warn",title:"Warning",color:{bgLabel:"#F29140",label:"white",bgText:"#FFD8B7",text:"black"}},info:{key:"info",title:"Info",color:{bgLabel:"#413FA9",label:"white",bgText:"#B3B2EB",text:"black"}},notice:{key:"notice",title:"Notice",color:{bgLabel:"#33C133",label:"white",bgText:"#ADF1AD",text:"black"}},log:{key:"log",title:"Log",color:{bgLabel:"#f2f240",label:"black",bgText:"#ffff90",text:"black"}},callstack:{key:"TAS",title:"function",color:{bgLabel:"#413FA9",label:"white",bgText:"#B3B2EB",text:"black"}},callstack_async:{key:"TAS",title:"ASYNC CALL",color:{bgLabel:"#413FA9",label:"white",bgText:"#413FA9",text:"white"}},TAS:{key:"TAS",title:"TAS",color:{bgLabel:"grey",label:"black;background:linear-gradient(#304352,#d7d2cc,#d7d2cc,#d7d2cc,#304352)",bgText:"grey",text:"black;background:linear-gradient(#304352,#d7d2cc,#d7d2cc,#d7d2cc,#304352)"}}},o={debugMode:!1,logging:{log:!0,notice:!0,info:!0,warn:!0,error:!0,debug:!1}},r=[],c={},a=function(e){switch(typeof e){case"string":return"string";case"boolean":return"boolean";case"number":return _.isNaN(e)?"NaN":e.toString().match(/\./)?"decimal":"integer";case"function":return"function: "+(e.name?e.name+"()":"(anonymous)");case"object":return _.isArray(e)?"array":_.isArguments(e)?"arguments":_.isNull(e)?"null":"object";default:return typeof e}},i=function(e,n,t){_.each(t,function(t){var o=a(t);switch(o){case"string":e(t);break;case"undefined":case"null":case"NaN":e("["+o+"]");break;case"number":case"not a number":case"integer":case"decimal":case"boolean":e("["+o+"]: "+t);break;default:e("["+o+"]:========================================="),n(t),e("=========================================================")}})},u=function(e){var n,t=e.key,r=e.title||"TAS",c=e.color&&e.color.bgLabel||"blue",a=e.color&&e.color.label||"white",u=e.color&&e.color.bgText||"blue",l=e.color&&e.color.text||"white";return n=function(e){console.log("%c "+r+": %c "+e+" ","background-color: "+c+";color: "+a+"; font-weight:bold;","background-color: "+u+";color: "+l+";")},function(){("TAS"===t||o.logging[t])&&i(n,function(e){console.log(e)},_.toArray(arguments))}},l=u(t.debug),f=u(t.error),g=u(t.warn),b=u(t.info),s=u(t.notice),d=u(t.log),p=u(t.TAS),h=u(t.callstack),m=u(t.callstack_async),y=function(e,n){var t=_.findIndex(r,function(t){return _.difference(t.stack,e).length===_.difference(e,t.stack).length&&0===_.difference(t.stack,e).length&&t.label===n});return-1===t&&(t=r.length,r.push({stack:e,label:n})),t},k=function(e){var n=_.defaults(e,o);n.logging=_.defaults(e&&e.logging||{},o.logging),o=n},x=function(){o.logging.debug=!0,o.debugMode=!0},A=function(){var e=new Error("dummy"),n=_.map(_.rest(e.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@").split("\n")),function(e){return e.replace(/\s+.*$/,"")});return n},w=function(e){var n,t;_.find(e,function(e){return(n=e.match(/TAS_CALLSTACK_(\d+)/))?(t=r[n[1]],m("===================="+(t.label?"> "+t.label+" <":"")+"===================="),w(t.stack),!0):(h(e),!1)})},F=function(){var e;o.debugMode&&(e=A(),e.shift(),p("==============================> CALLSTACK <=============================="),w(e),p("========================================================================="))},S=function(e,n,t){var r;return"function"==typeof e&&(t=n,n=e,e=void 0),o.debugMode?(r=A(),r.shift(),function(e,n,t,o){var r=y(t,o);return new Function("cb","ctx","TASlog","return function TAS_CALLSTACK_"+r+"(){TASlog('Entering: '+(cb.name||'(anonymous function)'));cb.apply(ctx||{},arguments);TASlog('Exiting: '+(cb.name||'(anonymous function)'));};")(e,n,p)}(n,t,r,e)):function(e,n){return function(){e.apply(n||{},arguments)}}(n,t)},T=function(e,n){c[e]=n},v=function(){setAttrs(c),c={}},L=function(e,n){return _.chain(e).reduce(function(n,t){return"string"==typeof t?n.push(t):(_.isArray(e)||_.isArguments(e))&&(n=L(t,n)),n},_.isArray(n)&&n||[]).uniq().value()},j=function(e,n){Object.defineProperty(e,"id",{value:n,writeable:!1,enumerable:!1})},C=function(e,n,t,o){!function(){var r=_.contains(["S","F","I","D"],n)?"_"+n:n,c=o||n,a=t;_.each(["S","I","F"],function(n){_.has(e,n)||Object.defineProperty(e,n,{value:{},enumerable:!1,readonly:!0})}),_.has(e,"D")||Object.defineProperty(e,"D",{value:_.reduce(_.range(10),function(e,n){return Object.defineProperty(e,n,{value:{},enumerable:!0,readonly:!0}),e},{}),enumerable:!1,readonly:!0}),Object.defineProperty(e,r,{enumerable:!0,set:function(e){e!==a&&(a=e,T(c,e))},get:function(){return a}}),Object.defineProperty(e.S,r,{enumerable:!0,set:function(e){var n=e.toString();n!==a&&(a=n,T(c,n))},get:function(){return a.toString()}}),Object.defineProperty(e.I,r,{enumerable:!0,set:function(e){var n=parseInt(e,10)||0;n!==a&&(a=n,T(c,n))},get:function(){return parseInt(a,10)||0}}),Object.defineProperty(e.F,r,{enumerable:!0,set:function(e){var n=parseFloat(e)||0;n!==a&&(a=n,T(c,n))},get:function(){return parseFloat(a)||0}}),_.each(_.range(10),function(n){Object.defineProperty(e.D[n],r,{enumerable:!0,set:function(e){var t=(parseFloat(e)||0).toFixed(n);t!==a&&(a=t,T(c,t))},get:function(){return(parseFloat(a)||0).toFixed(n)}})})}()},O=function(e){return function(e){var n=e,t=[],o=[],r=[],c=[],a=function(){return t=L(arguments,t),this},i=function(){return o=L(arguments,o),this},u=function(e,n,t,o){return r.push({type:"reduce",func:e&&_.isFunction(e)&&e||_.noop,memo:_.isUndefined(n)&&0||n,"final":t&&_.isFunction(t)&&t||_.noop,context:o||{}}),this},l=function(e,n,t){return r.push({type:"map",func:e&&_.isFunction(e)&&e||_.noop,"final":n&&_.isFunction(n)&&n||_.noop,context:t||{}}),this},f=function(e,n,t){return r.push({type:"each",func:e&&_.isFunction(e)&&e||_.noop,"final":n&&_.isFunction(n)&&n||_.noop,context:t||{}}),this},g=function(e,n){return r.push({type:"tap","final":e&&_.isFunction(e)&&e||_.noop,context:n||{}}),this},b=function(e,n){return c.push({callback:e&&_.isFunction(e)&&e||_.noop,context:n||{}}),this},s=function(e,a){var i={},u={},l=[],f=[];b(e,a),getSectionIDs("repeating_"+n,function(e){l=e,f=_.reduce(l,function(e,t){return e.concat(_.map(o,function(e){return"repeating_"+n+"_"+t+"_"+e}))},[]),getAttrs(_.uniq(t.concat(f)),function(e){_.each(t,function(n){e.hasOwnProperty(n)&&C(u,n,e[n])}),i=_.reduce(l,function(t,r){var c={};return j(c,r),_.each(o,function(t){var o="repeating_"+n+"_"+r+"_"+t;C(c,t,e[o],o)}),t[r]=c,t},{}),_.each(r,function(e){var n;switch(e.type){case"tap":_.bind(e["final"],e.context,i,u)();break;case"each":_.each(i,function(n){_.bind(e.func,e.context,n,u,n.id,i)()}),_.bind(e["final"],e.context,i,u)();break;case"map":n=_.map(i,function(n){return _.bind(e.func,e.context,n,u,n.id,i)()}),_.bind(e["final"],e.context,n,i,u)();break;case"reduce":n=e.memo,_.each(i,function(t){n=_.bind(e.func,e.context,n,t,u,t.id,i)()}),_.bind(e["final"],e.context,n,i,u)()}}),v(),_.each(c,function(e){_.bind(e.callback,e.context)()})})})};return{attrs:a,attr:a,column:i,columns:i,field:i,fields:i,reduce:u,inject:u,foldl:u,map:l,collect:l,each:f,forEach:f,tap:g,"do":g,after:b,last:b,done:b,execute:s,go:s,run:s}}(e)},D=function(e,n,t){O(e).attr(t).field(n).reduce(function(e,t){return e+t.F[n]},0,function(e,n,o){o.S[t]=e}).execute()};return console.log("%c?.??.?*??`*?.??.?*??`*?.?  The Aaron Sheet  v"+e+"  ?.?*??`*?.??.?*??`*?.??.?","background: linear-gradient(to right,green,white,white,green); color:black;text-shadow: 0 0 8px white;"),console.log("%c?.??.?*??`*?.??.?*??`*?.?  Last update: "+new Date(1e3*n)+"  ?.?*??`*?.??.?*??`*?.??.?","background: linear-gradient(to right,green,white,white,green); color:black;text-shadow: 0 0 8px white;"),{repeatingSimpleSum:D,repeating:O,config:k,callback:S,callstack:F,debugMode:x,_fn:S,debug:l,error:f,warn:g,info:b,notice:s,log:d}}();
    }