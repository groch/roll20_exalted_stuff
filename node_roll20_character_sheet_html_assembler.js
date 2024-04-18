var fs = require('fs');

const sheetWorkerStr = fs.readFileSync('sheet_worker.js');
const commonInc = fs.readFileSync('node_roll20_common_include.js');

eval(sheetWorkerStr+commonInc);

const pad = (p) => `${" ".repeat(p)}`;
const brPad = (p) => `\n${pad(p)}`;

function getHiddenInputs(array, p = 0) {
    let ret = '', i = 0;
    for (const charmSection of array) {
        const outStr = charmSection.replace('charms-','charm-').toLowerCase();
        ret += `<input class="sheet-${outStr}" name="attr_${outStr}" type="hidden" value="0">`;
        if (i++ != array.length - 1) ret += brPad(p);
    }
    return ret;
}

let outHtml = /*html*/
`<script type="text/worker">\n${sheetWorkerStr}\n</script>\n
<div class="sheet-content">
    <!-- 0 WARNING HEADER -->
    <div class="sheet-warning-header">
        <h1 class="sheet-message-firefox">Your Firefox doesn't have the CSS selector <code style="white-space: nowrap">:has()</code> enabled</h1>
        <h2 class="sheet-message-firefox">Most usefull feature in this sheet uses it, please enable it by following this <a href="https://stackoverflow.com/questions/73936048/how-do-you-enable-has-selector-on-firefox">link</a>.</h2>
        <h1 class="sheet-message-generic">Your Browser doesn't have the CSS selector <code style="white-space: nowrap">:has()</code> enabled or available</h1>
        <h2 class="sheet-message-generic">Please search how to enable it or use a different browser to use all the features available on this Exalted Sheet.</h2>
    </div>
    <div class="sheet-main-content">
        <input type="hidden" name="attr_token-size" value="1">
        <input type="hidden" name="attr_pain-tolerance" value="0">
        <input class="roll-diceex-check" name="attr_diceex" type="hidden" value="0">
        <input class="roll-succex-check" name="attr_succex" type="hidden" value="0">
        <input name="attr_show-charname-in-charms" type="hidden" value="1">
        <input name="attr_show_character_name" type="hidden">
        <input name="attr_hide-not-learnt-charms-in-reminders" type="hidden">
        <input name="attr_def-exc-cost-multiplier" type="hidden" value="2">
        <input class="ride-mode-check" name="attr_ride-for-evasion" type="hidden" value="0">

        <input class="sheet-show-combat-tab" type="hidden" name="attr_combattab" value="1">
        <input class="sheet-show-antisocial-tab" type="hidden" name="attr_antisocialtab" value="0">
        <input checked="checked" class="sheet-tab sheet-tab-character-sheet" name="sheet" title="Character Sheet" type="radio" value="1">
        <input class="sheet-tab sheet-tab-rolls sheet-tab-rolls-sheet" name="sheet" title="Rolls" type="radio" value="9">
        <input class="sheet-tab sheet-tab-intimacies sheet-tab-intimacies-sheet" name="sheet" title="Social" type="radio" value="5">
        <input class="sheet-tab sheet-tab-antisocial sheet-tab-antisocial-sheet" name="sheet" title="Tu perds ton Sang froid !" type="radio" value="7">
        <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet" name="sheet" title="Charms" type="radio" value="2">
        <input class="sheet-tab sheet-tab-spells sheet-tab-spell-sheet" name="sheet" title="Sorceries" type="radio" value="3">
        <input class="sheet-tab sheet-tab-combat sheet-tab-combat-sheet" name="sheet" title="Combat" type="radio" value="6">
        <input class="sheet-tab sheet-tab-settings sheet-tab-settings-sheet" name="sheet" title="y" type="radio" value="4">

        ${getHiddenInputs(solarCharmArray, 8)}\n
        ${getHiddenInputs(lunarCharmArray, 8)}\n
        ${getHiddenInputs(sidCharmArray, 8)}\n
        ${getHiddenInputs(maCharmArray, 8)}

        <input class="sheet-charm-evocation" name="attr_charm-evocation" type="hidden" value="0">
        <input class="sheet-charm-old" name="attr_charm-old" type="hidden" value="0">

        <input class="sheet-quick-character" name="attr_qc" type="hidden" value="0">
        <input class="sheet-battle-group" name="attr_battlegroup" type="hidden" value="0">
        <input class="sheet-long-merit" name="attr_longmerit" type="hidden" value="1">
        <input class="charm-whisper-gm-check" name="attr_charmwhispergm" type="hidden" value="0">
        <input class="charm-whisper-both-check" name="attr_charmwhisperboth" type="hidden" value="0">
        <input class="caste-check" name="attr_caste" type="hidden">
        <input class="roll-can-spend-motes" name="attr_canspendmote" type="hidden" value="0">
        <input class="caste-have-exc-check" name="attr_caste-have-exc" type="hidden" value="0">
        <input class="exalt-type-check" name="attr_exalt-type" type="hidden" value="None">
        <input class="dicecap-type-check" name="attr_dicecap-type" type="hidden" value="None">
        <input type="hidden" name="attr_usecommitsystem" class="use-commit-system" value="1">
        <input type="hidden" name="attr_commit-list-shown" value="0">
        <input type="hidden" name="attr_roll-penalty" class="roll-penalty-check">
        <input type="hidden" name="attr_wound-penalty" class="wound-penalty-check">
        <input type="hidden" name="attr_full-def-bonus" class="full-def-bonus-check" value="0">
        <input type="hidden" name="attr_cover-def-bonus" class="cover-bonus-check" value="0">
        <input type="hidden" name="attr_clash-def-penalty" class="clash-penalty-check" value="0">
        <input type="hidden" name="attr_grab-def-penalty" class="grab-penalty-check" value="0">
        <input type="hidden" name="attr_prone-def-penalty" class="prone-penalty-check" value="0">

        <div class="flex main-page">
            <!-- 1 CHARACTER PAGE -->

            <div class="sheet-body sheet-tab-content sheet-tab-character-sheet">
                <div class="sheet-3colrow">
                    <div class="sheet-col"><img src="https://imgsrv.roll20.net?src=http%3A//i.imgur.com/JqdPTxp.png"></div>

                    <!-- 1.1 Header -->\n`;

function getSupernalList(p = 0) {
    const length = Object.keys(sheetCasteTree).length;
    let ret = ``, i = 0;
    for (const sectionHeader of Object.keys(sheetCasteTree)) {
        let j = 0;
        ret += `<option value="${sectionHeader.toLowerCase()}" disabled>--- ${sectionHeader} ---</option>\n`;
        for (const line of sheetCasteTree[sectionHeader]) {
            ret += `${pad(p)}<option value="${line}"${line === 'Mortal' ? ' selected="selected"' : ''}>${line}</option>`;
            if (i != length - 1 || j++ != sheetCasteTree[sectionHeader].length - 1) ret += `\n`;
        }
        if (i++ != length - 1) ret += brPad(p);
    }
    return ret;
}

function returnOptions(p, array, checked = 0, addedClass = undefined) {
    const getOption = (item, selected) => `<option value="${item.val}"${addedClass ? ` class=\"${addedClass}\"` : ''}${selected ? ' selected' : ''}>${item.label}</option>`;
    let retStr = '', i = 0;
    for (const item of array) {
        retStr += getOption(item, i === checked);
        if (i++ <= array.length - 2) retStr += brPad(p);
    }
    return retStr;
}

const filteredAbilities = [...abilities.slice(0,abilities.indexOf('Sorcery')),...abilities.slice(abilities.indexOf('Sorcery')+1)];

outHtml += /*html*/`
                    <div class="sheet-col"><!-- 1.1.1 1st column (Name, Player, SELECT Caste) -->
                        <div class="sheet-flexbox-h"><label>Name: <input type="text" name="attr_character_name" placeholder="Karal Fire Orchid"></label></div>
                        <div class="sheet-flexbox-h"><label>Player: <input type="text" name="attr_player-name" placeholder="John Smith"></label></div>
                        <div class="sheet-flexbox-h">
                            <label>Caste/Aspect:
                            <select class="player-caste" name="attr_caste">
                                <option value=""></option>\n
                                ${getSupernalList(32)}
                            </select></label>
                        </div>
                    </div>
                    <div class="sheet-col"><!-- 1.1.2 2nd column (Concept, Anima, SELECT Supernal) -->
                        <div class="sheet-flexbox-h"><label>Concept: <input type="text" name="attr_concept" placeholder="Inspirational Teacher"></label></div>
                        <input type="hidden" name="attr_showanimadiv" class="show-anima" value="1">
                        <div class="sheet-flexbox-h anima-box"><label>Anima: <input type="text" name="attr_anima" placeholder="Orchid of golden fire"></label></div>
                        <input type="hidden" name="attr_showsupdiv" class="show-sup" value="0">
                        <div class="sheet-flexbox-h supernal-box">
                            <label>Supernal Trait:
                            <select name="attr_supattr">
                                <option value="" selected="selected"></option>\n
                                ${returnOptions(32, filteredAbilities.map(i => typeof i !== 'string' ? i.name : i).map(i => ({val: i, label: i})), -1)}\n
                                <option disabled>-------OTHER------</option>
                                <option value="Custom">Custom</option>
                            </select></label>
                        </div>
                    </div>
                </div>

                <!-- 1.2 1st BLOCK = ATTRIBUTES -->\n`;

function returnDotsRadio(p, attrName, checked = 0, count = 10) {
    const getRadio = (val, checked) => `<input type="radio" class="sheet-dots${val}" name="attr_${attrName}" value="${val}"${checked ? ' checked="checked"' : ''}><span></span>`;
    let retStr = '';
    for (let i = 0; i <= count; i++) {
        retStr += getRadio(i, i === checked);
        if (i <= count - 1) retStr += brPad(p);
    }
    return retStr;
}

function getAttributeBlock(p = 0) {
    let ret = '', i = 0;
    for (const attribute of attributes) {
        ret += /*html*/`<div class="sheet-trait" title="@{${attribute.toLowerCase()}}">
${pad(p)}    <label>
${pad(p)}        <input type="checkbox" name="attr_${attribute.toLowerCase()}fav" value="1"><span></span>
${pad(p)}        <span>${attribute}</span>
${pad(p)}    </label>
${pad(p)}    <div class="sheet-dots">
${pad(p)}        ${returnDotsRadio(p+8, attribute.toLowerCase(), 1)}
${pad(p)}    </div>
${pad(p)}</div>`;
        if (i++ != attributes.length - 1) ret += brPad(p);
    }
    return ret;
}

outHtml += /*html*/`
                <h1 class="sheet-attributes"><span>Attributes</span></h1>
                <div class="sheet-attributes sheet-3colrow"><!-- Attributes -->
                    ${getAttributeBlock(20)}
                </div>

                <!-- 1.3 SPLIT -->\n`;

function getComplexAbi(ability, p = 0) {
    const favName = ability.name.replace(' ','').toLowerCase();
    let ret = /*html*/`<div class="sheet-trait">
${pad(p)}    <label>
${pad(p)}        <input type="checkbox" name="attr_${favName}fav" value="1"><span></span>
${pad(p)}        <span>${ability.name}</span>
${pad(p)}    </label>
${pad(p)}    <div class="sheet-dots">
${pad(p)}        <input class="sheet-max-${ability.shortName}-val" name="attr_max-${ability.shortName}" type="hidden" value="0">
${pad(p)}        <input type="checkbox" class="sheet-unnamed-toggle"><span title="${ability.toggleStr}" class="sheet-layer${ability.sheetLayer+1}"></span>
${pad(p)}        <div class="sheet-layer${ability.sheetLayer}">`;

    for (const [k,v] of Object.entries(ability.subSections)) {
        ret += /*html*/`
${pad(p)}            <div class="sheet-trait" title="${v}">
${pad(p)}                <label>${k}</label>
${pad(p)}                <div class="sheet-dots">
${pad(p)}                    ${returnDotsRadio(p+20, v.substr(2, v.length - 3))}
${pad(p)}                </div>
${pad(p)}            </div>`;
    }

    let repeatingSectionName = ability.name.replace(' ','').toLowerCase();
    if (repeatingSectionName.charAt(repeatingSectionName.length - 1) !== 's') repeatingSectionName += 's';

    ret += /*html*/`
${pad(p)}            <fieldset class="repeating_${repeatingSectionName}" style="display: none;">
${pad(p)}                <div class="sheet-trait">
${pad(p)}                    <input type="text" name="attr_rep${repeatingSectionName}name" placeholder="${ability.placeholderStr}">
${pad(p)}                    <div class="sheet-dots">
${pad(p)}                        ${returnDotsRadio(p+24, `rep${repeatingSectionName}`)}
${pad(p)}                    </div>
${pad(p)}                </div>
${pad(p)}            </fieldset>
${pad(p)}        </div>
${pad(p)}    </div>
${pad(p)}</div>`;

    return ret;
}
function getAbilitiesBlock(p = 0) {
    const getSimpleAbi = (ability) => /*html*/`<div class="sheet-trait" title="@{${ability.toLowerCase()}}">
${pad(p)}    <label>
${pad(p)}        <input type="checkbox" name="attr_${ability.toLowerCase()}fav" value="1"><span></span>
${pad(p)}        <span>${ability}</span>
${pad(p)}    </label>
${pad(p)}    <div class="sheet-dots">
${pad(p)}        ${returnDotsRadio(p+8, ability.toLowerCase())}
${pad(p)}    </div>
${pad(p)}</div>`;
    let ret = '', i = 0;
    for (const ability of filteredAbilities) {
        ret += (typeof ability === 'string') ? getSimpleAbi(ability) : getComplexAbi(ability, p);
        if (i++ != filteredAbilities.length - 1) ret += brPad(p);
    }
    return ret;
}

outHtml += /*html*/`
                <div class="sheet-3colrow sheet-centerblock">
                    <div class="sheet-abilities sheet-col"><!-- 1.3.1 LEFT COLUMN -->
                        <h1><span>Abilities</span></h1>
                        ${getAbilitiesBlock(24)}
                        <fieldset class="repeating_abilities" style="display: none;">
                            <div class="sheet-trait">
                                <label>
                                    <input type="checkbox" name="attr_repabilityfav" value="1"><span></span>
                                    <input type="text" name="attr_repabilityname" placeholder="Astrology">
                                </label>
                                <div class="sheet-dots">
                                    ${returnDotsRadio(36, `repability`)}
                                </div>
                            </div>
                        </fieldset>

                        <h1><span>Specialties</span></h1>
                        <fieldset class="repeating_specialty" style="display: none;">
                            <div class="sheet-flexbox-h sheet-flexbox0">
                                <input type="text" name="attr_repspecialty" style="margin-top: 3px" placeholder="Pirate Tactics">
                                <select name="attr_repspecialtyability">
                                    <option value=""></option>\n
                                    ${returnOptions(36, filteredAbilities.map(i => typeof i !== 'string' ? i.name : i).map(i => ({val: i, label: i})), -1)}\n
                                    <option disabled>-------OTHER------</option>
                                    <option value="Custom">Custom</option>\n
                                    <option disabled>----ATTRIBUTES---</option>
                                    ${returnOptions(36, attributes.map(i => ({val: i, label: i})), -1)}\n
                                </select>
                            </div>
                        </fieldset>\n`;

function buildPrompt(promptStr, hashMap, addedOtherVal, multiLine = false, p = 36) {
    let retStr = `?{${promptStr}`;
    for (const [k,v] of Object.entries(hashMap))
        retStr += `|${multiLine ? `${brPad(p+4)}` : ''}${k} (${v}), ${v}[${k}]`;
    if (addedOtherVal)
        retStr += `|${multiLine ? `${brPad(p+4)}` : ''}Other, ${addedOtherVal}`;
    retStr += `${multiLine ? brPad(p) : ''}}`;
    return retStr;
}

function getHashMapFromArray(array, fxVal = (i) => `@{${i.toLowerCase()}}`) {
    const objRet = {};
    for (const item of array)
        objRet[item] = fxVal(item);
    return objRet;
}

const attributePrompt = buildPrompt('Attribute', {...getHashMapFromArray(attributes)});
const abilityPromptBASE = `?{Ability|\n`;
function buildAbilityPrompt(p = 36) {
    let retStr = `${abilityPromptBASE}`;
    for (const ability of filteredAbilities) {
        if (typeof ability === 'string') {
            retStr += `${pad(p+4)}${ability} (@{${ability.toLowerCase()}}),@{${ability.toLowerCase()}}[${ability}]|\n`;
        } else {
            retStr += `${pad(p+4)}${ability.name} (...),?{${ability.name}&amp;#124;\n`;
            for (const [k, v] of Object.entries(ability.subSections)) {
                retStr += `${pad(p+8)}${k} (${v})&amp;#44;${v}[${k}]&amp;#124;\n`;
            }
            const roll20CommentName = ability.shortName.length === 2 ? ability.shortName.toUpperCase() : ability.shortName.charAt(0).toUpperCase() + ability.shortName.slice(1);
            retStr += `${pad(p+8)}Other&amp;#44;?{${ability.customPrompt}&amp;amp;#124;0&amp;amp;#125;[Other-${roll20CommentName}]&amp;#125;|\n`;
        }
    }
    retStr += `${pad(p+4)}Other,?{Enter the number of dots of this attribute&amp;#124;0&amp;#125;[Other]\n`;
    retStr += `${pad(p)}}`;
    return retStr;
}
function buildBigExRollPromptDiceBase(p = 36) {
    return `${attributePrompt} +${buildAbilityPrompt(p)} +${defaultRoll20AddedDicePrompt}`;
}
const bigExRollPromptDiceEnd = ` -@{roll-penalty}[RollPen] -@{wound-penalty}[Wound Pen]`;
const bigExRollPromptSuccBase = `+${defaultRoll20AddedSuccPrompt}`;
const bigExRollPromptSuccEnd = ` ?{Command to Add :| }`;
const moteCostBase = `=COST:@{character_id}`;
const moteCostPromptBase = `:peri=?{Spend Peripheral First ?|Yes,1|No,0};`;
const fullWpPrompt = `:will;${wpPrompt}`;

function getAllMoteCost(diceEx, succEx) {
    return `${(diceEx || succEx) ? moteCostPromptBase : ''}${getMoteCostToSet(diceEx, succEx)}`;
}
function getExRoll(diceEx, succEx, gm, p) {
    let retStr = `!exr (${buildBigExRollPromptDiceBase(p)}${diceEx ? ` ${diceExAddedPrompt}` : ''}${bigExRollPromptDiceEnd})#`;
    retStr += `${bigExRollPromptSuccBase}${succEx ? succExAddedPrompt : ''}${bigExRollPromptSuccEnd}${gm ? ' -gm' : ''}`;
    retStr += `\\n!exr ${moteCostBase}${getAllMoteCost(diceEx, succEx)}${fullWpPrompt}`;
    return retStr;
}
function getQCRoll(diceEx, succEx, gm) {
    let retStr = `!exr (?{Pool}[QCPool] +${defaultRoll20AddedDicePrompt}${diceEx ? ` ${diceExAddedPrompt}` : ''}${bigExRollPromptDiceEnd})#`;
    retStr += `${bigExRollPromptSuccBase}${succEx ? succExAddedPrompt : ''}${bigExRollPromptSuccEnd}${gm ? ' -gm' : ''}`;
    retStr += `\\n!exr ${moteCostBase}${getAllMoteCost(diceEx, succEx)}${fullWpPrompt}`;
    return retStr;
}
const getDefaultRollButton = (buttonLabel, type, addedClass, name, value) => /*html*/`<button type="${type}" class="sheet-roll btn ui-draggable ${addedClass}" name="${name}" value="${value}">${buttonLabel}</button>`;
function getExRolls(qc = false, p = 28) {
    const getTitle = (diceEx, succEx) => `Generic Roll with prompts for ${qc ? 'Pool' : 'Attribute+Ability'}+BonusDices${diceEx ? '+DiceExcellency' : ''} and BonusSucces${succEx ? '+SuccessExcellency' : ''}, and finally an optionnal Custom Macro`;
    const classArray = ['vanilla','diceex','succex','full'], nameArray = ['','-diceex','-succex','-fullex'];
    const finalName = (i, gm) => `roll_${qc ? 'QCRoll' : 'ExRoll'}${gm ? '-GM' : ''}${nameArray[i]}`;
    const fx = qc ? getQCRoll : getExRoll;
    let retStr = '';
    for (let i = 0; i < 4; i++) {
        const diceEx = i % 2, succEx = Math.floor(i / 2);
        retStr += `<div class="sheet-exroll exroll-${classArray[i]}">\n`;
        retStr += `${pad(p+4)}<div class="header-section" title="${getTitle(diceEx, succEx)}">ExRoll</div>\n`;
        retStr += `${pad(p+4)}<div class="sheet-grouped-buttons end" title="Cast Generic Roll">\n`;
        retStr += `${pad(p+8)}${getDefaultRollButton('Cast', 'roll', 'default-whisper', finalName(i), fx(diceEx, succEx, false, p+8))}\n`;
        retStr += `${pad(p+8)}${getDefaultRollButton('to GM', 'roll', 'gm-whisper', finalName(i, true), fx(diceEx, succEx, true, p+8))}\n`;
        retStr += `${pad(p+4)}</div>\n`;
        retStr += `${pad(p)}</div>`;
        if (i < 3) retStr += brPad(p);
    }
    return retStr;
}

function getQCAttr(p, name, label, opt) {
    const opts = {
        ...opt,
        ...(opt?.labelCustomInputType === undefined && {labelCustomInputType: false}),
        ...(opt?.includeLabelInTitle === undefined && {includeLabelInTitle: false}),
        ...(opt?.includeFoS === undefined && {includeFoS: false}),
        ...(opt?.includeTitle === undefined && {includeTitle: true}),
        ...(opt?.excNotVisible === undefined && {excNotVisible: false}),
    };
    const getFoSLine = () => /*html*/`<input type="number" name="attr_strength" title="Strength Cap for FoS">${brPad(p+8)}`;
    const getSimple = () => /*html*/`<span>${label}</span>`;
    const getDouble = () => /*html*/`<span class="flex">
${pad(p)}        <span>${label} :</span>
${pad(p)}        <input type="text" name="attr_${name}-type" placeholder="Threaten" class="sheet-${name}-type grow-normal" title="Type of ${opts.labelCustomInputType}">
${pad(p)}    </span>`;
    return /*html*/`<div class="sheet-trait">
${pad(p)}    ${opts.labelCustomInputType ? getDouble() : getSimple()}
${pad(p)}    <span>
${pad(p)}        ${opts.includeFoS ? getFoSLine() : ''}<input type="number" name="attr_${name}"${opts.includeTitle ? ` title="${opts.includeLabelInTitle ? `${label} ` : opts.includeFoS ? `FoS ` : ''}Dice Pool"` : ''}>
${pad(p)}        <input ${opts.excNotVisible ? `type="number" class="not-visible qc-have-exc"` : `type="text" name="attr_${name}-exc" class="qc-have-exc" title="${opts.includeFoS ? `FoS ` : ''}Excellency cap"`}>
${pad(p)}    </span>
${pad(p)}</div>`;
}

const TITLE_BR = '&#013;&#010;';

outHtml += /*html*/`
                        <div class="sheet-rolls-main"><!-- 1.3.1.1 ROLLS LEFT COLUMN -->
                            <h1><span>Quick Roll</span></h1>
                            ${getExRolls()}
                        </div>
                    </div>
                    <div class="sheet-qc-pools sheet-col"><!-- 1.3.2 QUICK CHAR LEFT COLUMN -->
                        <h1><span>Actions</span></h1>
                        ${getQCAttr(24, 'qc-read-intentions', 'Read Intentions')}
                        ${getQCAttr(24, 'qc-social-influence', 'S. Infl.', {labelCustomInputType: 'Social Influence'})}
                        ${getQCAttr(24, 'qc-stealth-larc', 'Stealth/Larceny')}
                        ${getQCAttr(24, 'qc-senses', 'Senses')}
                        ${getQCAttr(24, 'qc-fos-pool', 'Feats of Strength', {includeFoS: true})}
                        <fieldset class="repeating_qcactions" style="display: none;">
                            <div class="sheet-trait">
                                <input type="text" name="attr_repqcactionname" placeholder="Senses">
                                <span>
                                    <input type="number" name="attr_repqcactiondice" title="Dice Pool">
                                    <input type="text" name="attr_repqcactiondice-exc" class="qc-have-exc" title="Excellency cap">
                                </span>
                            </div>
                        </fieldset>
                        <h1><span>Combat</span></h1>
                        ${getQCAttr(24, 'qc-join-battle', 'Join Battle', {includeLabelInTitle: true})}
                        ${getQCAttr(24, 'qc-move', 'Combat Movement')}
                        <div class="sheet-trait four-cell">
                            <span>Grapple/Control</span>
                            <span>
                                <input type="number" name="attr_qc-grapple" title="Grapple Dice pool">
                                <input type="text" name="attr_qc-grapple-exc" class="qc-have-exc" title="Grapple Excellency cap">
                                <input type="number" name="attr_qc-grapple-control" title="Grapple Control Dice pool">
                                <input type="text" name="attr_qc-grapple-control-exc" class="qc-have-exc" title="Grapple Control Excellency cap">
                            </span>
                        </div>
                        <fieldset class="repeating_qcattacks" style="display: none;">
                            <div class="sheet-trait four-cell">
                                <input type="text" name="attr_repqcattackname" placeholder="Unarmed">
                                <span>
                                    <input type="text" name="attr_repqcattackdice" class="sheet-qc-attack-pool" title="Attack pool">
                                    <input type="text" name="attr_repqcattackdice-exc" class="qc-have-exc" title="Attack Excellency cap">
                                    <input type="number" name="attr_repqcattackdamage" title="Damage pool">
                                    <input type="number" name="attr_repqcattackovw" title="Overwhelming" value="1" min="1">
                                </span>
                            </div>
                        </fieldset>

                        <div class="sheet-rolls-main"><!-- 1.3.1.1 ROLLS LEFT COLUMN -->
                            <h1><span>QC Rolls</span></h1>
                            ${getExRolls(true)}
                        </div>
                    </div>
                    <div class="sheet-2col"><!-- 1.3.3 RIGHT COLUMNS -->
                        <div><!-- 1.3.3.1 BATTLE GROUP TOGGLEABLE AREA -->
                            <h1 class="sheet-battle-group-header"><span>Battle Group</span></h1>
                            <div class="sheet-battle-group-body sheet-2colrow">
                                <div class="sheet-col">
                                    <div class="sheet-battle-group-row" title="@{battlegroup-drill}${TITLE_BR}Represent how much training the BG have.${TITLE_BR}Give bonus to Defenses">
                                        <span>Drill</span>:
                                        <select name="attr_battlegroup-drill">
                                            ${returnOptions(44, ['Poor', 'Average', 'Elite'].map(i => ({val: i, label: i})), 0)}
                                        </select>
                                    </div>
                                    <div class="sheet-battle-group-row" title="@{battlegroup-might}${TITLE_BR}Represent how much supernatural features the BG is composed of.${TITLE_BR}Give bonus to Defenses and Attacks&Damage">
                                        <span>Might</span>:
                                        <select name="attr_battlegroup-might">
                                            ${returnOptions(44, [...Array(4).keys()].map(i => ({val: i, label: i})), 0)}
                                        </select>
                                    </div>
                                    <div class="sheet-battle-group-row" title="@{battlegroup-perfect-morale}${TITLE_BR}Represent a BG trained to never surrender.${TITLE_BR}Give bonus Magnitude & Prevent Rout">
                                        <label>
                                            <input type="checkbox" name="attr_battlegroup-perfect-morale" value="1"><span></span>
                                            <span>Perfect Morale</span>
                                            <span></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="sheet-col">
                                    <div class="sheet-battle-group-row" title="@{battlegroup-magnitude} & @{battlegroup-magnitude_max}${TITLE_BR}Represent a BG 'health'.">
                                        <span>Magnitude</span>:
                                        <span>
                                            <input type="number" name="attr_battlegroup-magnitude" value="8"> |
                                            <input type="number" name="attr_battlegroup-magnitude_max" readonly="readonly">
                                        </span>
                                    </div>
                                    <div class="sheet-battle-group-row" title="@{battlegroup-size} & @{battlegroup-size_max}">
                                        <span>Size</span>:
                                        <span>
                                            <input type="number" name="attr_battlegroup-size" value="0"> |
                                            <input type="number" name="attr_battlegroup-size_max" value="1">
                                        </span>
                                    </div>
                                    <div class="sheet-battle-group-row" title="@{battlegroup-health-levels}${TITLE_BR}Represent the health levels of a single unit before transforming into a BG.">
                                        <span>Health Levels</span>:
                                        <span>
                                            <input type="number" name="attr_battlegroup-health-levels" value="7">
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div><!-- 1.3.3.2 MERITS AREA -->
                            <h1><span>Merits</span></h1>
                            <input type="hidden" name="attr_merits-length" class="merits-length-check">
                            <fieldset class="repeating_merits" style="display: none;">
                                <input type="hidden" name="attr_repmerits-toggle-desc" class="merits-toggle-desc" value="0">
                                <div class="merit-input-area">
                                    <input type="hidden" name="attr_repmerits-toggle-desc" class="merits-toggle-desc" value="0">
                                    <div class="inline-merits-name">
                                        <input class="sheet-short-merit-section" type="text" name="attr_repmerits-name" placeholder="Artifact">
                                    </div>
                                    <div class="inline-merits-desc">
                                        <textarea name="attr_repmerits-desc" class="merit-textarea" placeholder="An item of great power (more info p XXX)."></textarea>
                                    </div>
                                </div>
                                <div class="merit-dot-toggle-wrapper">
                                    <div class="sheet-dots merits-dots">
                                        ${returnDotsRadio(40, `repmerits`)}
                                    </div>
                                    <div class="merits-div-cast">
                                        <label>
                                            <button type="roll" name="roll_merit-cast" class="sheet-roll btn ui-draggable merit-cast" value="&amp;{template:exalted3e_combatcast} {{name=Merit : @{repmerits-name}}} {{description=@{repmerits-desc}}}" title="Cast in chat for All Players">Cast</button>
                                        </label>
                                    </div>
                                    <div class="merits-div-checkbox">
                                        <label>
                                            <input type="checkbox" name="attr_repmerits-toggle-desc" class="merits-checkbox"><strong></strong>
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>\n`;

function getMotesBlock(p) {
    const getMoteBlock = (spanLabel, costPool, baseAttr, commitedAttr) => /*html*/`<div class="sheet-motes">
${pad(p)}    <span>${spanLabel}<button type="roll" class="btn gm-only add-mote" value="!cmaster --moteAdd,qty:?{How many ?|5},perso:${costPool},setTo:@{character_id}">+</button></span>
${pad(p)}    <span><!-- Remove readonly & after in the next line to have manual mote edition -->
${pad(p)}        <input type="number" name="attr_${baseAttr}-essence" title="@{${baseAttr}-essence}" readonly tabindex="-1"> /
${pad(p)}        <input type="number" name="attr_${baseAttr}-essence_max" value="@{${baseAttr}-equation}" disabled="disabled" data-formula="@{${baseAttr}-equation}" title="@{${baseAttr}-essence_max}"> C:
${pad(p)}        <input type="number" name="attr_${commitedAttr}" title="@{${commitedAttr}}${TITLE_BR}${spanLabel} Commited" class="free-commit"><input type="number" name="attr_${commitedAttr}" title="@{${commitedAttr}}${TITLE_BR}${spanLabel} Commited" class="commit-system" readonly tabindex="-1">
${pad(p)}    </span>
${pad(p)}</div>`;
    let ret = ``, i = 0;
    for (const item of [['Personal', 1, 'personal', 'committedessperso'],['Peripheral', 0, 'peripheral', 'committedesstotal']])
        ret += `${i++ !== 0 ? brPad(p) : ''}${getMoteBlock(...item)}`;
    return ret;
}

outHtml += /*html*/
`                        <div><!-- 1.3.3.3 WILLPOWER & ESSENCE & LIMIT AREA; OR QC RIGHT COLUMN -->
                            <input type="hidden" name="attr_showlimit_final" class="show-limit" value="(@{showlimit}+@{qc})" disabled="disabled" data-formula="(@{showlimit}+@{qc})">
                            <div class="sheet-2colrow sheet-resize-to-mortal">
                                <div class="sheet-col"><!-- 1.3.3.3.1 WILLPOWER & ESSENCE -->
                                    <h1><span>Willpower</span></h1>
                                    <div style="padding: 0 6px 6px 6px;" title="@{willpower}${TITLE_BR}Actual Willpower">
                                        <input type="number" name="attr_willpower" value="5" min="0" max="15" style="width: 100%;">
                                    </div>
                                    <div style="padding-left: 6px" title="@{willpower_max}${TITLE_BR}Max Willpower">
                                        <div class="sheet-dots-full">
                                            ${returnDotsRadio(44, `willpower_max`, 5)}
                                        </div>
                                    </div>
                                    <h1><span>Essence</span></h1>
                                    <div style="padding-left: 6px" title="@{essence}">
                                        <div class="sheet-dots-full">
                                            ${returnDotsRadio(44, `essence`, 1)}
                                        </div>
                                    </div>
                                    <div class="sheet-hide-to-mortal">
                                        ${getMotesBlock(40)}
                                    </div>
                                </div>

                                <div class="sheet-col"><!-- 1.3.3.3.2 LIMIT BREAK & TRIGGER; OR QC RIGHT COLUMN -->
                                    <!-- 1.3.3.3.2.1 LIMIT BREAK & TRIGGER -->
                                    <div class="limit-box">
                                        <h1 class="sheet-limit"><span>Limit Break</span></h1>
                                        <div class="sheet-limit" style="padding-left: 6px ; margin: 9px 0 9px 0" title="@{limit}">
                                            <div class="sheet-dots-full">
                                                ${returnDotsRadio(48, `limit`)}
                                            </div>
                                        </div>
                                        <h1 class="sheet-limit"><span>Limit Trigger</span></h1>
                                        <textarea name="attr_limittrigger" class="sheet-6rows sheet-limit" placeholder="Karal is insulted, belittled, or deliberately frustrated by another character."></textarea>
                                    </div>
                                    <!-- 1.3.3.3.2.2 QC RIGHT COLUMN -->
                                    <h1 class="sheet-qc-defenses"><span>Defenses</span></h1>
                                    <div class="sheet-qc-defenses">
                                        <input type="hidden" class="hideous-check" name="attr_qc-hideous" value="0">
                                        <div class="sheet-trait qc-appearance-trait">
                                            <span>Appearance</span>
                                            <span>
                                                <div style="display: inline-block;" title="Hideous Merit">
                                                    <input type="checkbox" value="1" class="onslaught-checkbox" name="attr_qc-hideous"><span></span>
                                                </div>
                                                <input type="number" name="attr_appearance">
                                            </span>
                                        </div>
                                        ${getQCAttr(40, 'qc-resolve', 'Resolve', {includeTitle: false})}
                                        ${getQCAttr(40, 'qc-guile', 'Guile', {includeTitle: false})}
                                        ${getQCAttr(40, 'qc-evasion', 'Evasion', {includeTitle: false})}
                                        ${getQCAttr(40, 'qc-parry', 'Parry', {includeTitle: false})}
                                        ${getQCAttr(40, 'qc-soak', 'Soak', {includeTitle: false, excNotVisible: true})}
                                        ${getQCAttr(40, 'hardness', 'Hardness', {includeTitle: false, excNotVisible: true})}
                                    </div>
                                </div>
                            </div>
                        </div>\n`;

const getLabelBlock = (p, spanLabel, attr) => /*html*/`<label>
${pad(p)}    <span>${spanLabel}XP:</span>
${pad(p)}    <input type="number" name="attr_${attr}">
${pad(p)}</label>`;
function getXpsBlock(p) {
    const getXpBlock = (spanLabel, baseAttr) => /*html*/`<label>
${pad(p)}    ${getLabelBlock(p+4, `Spent ${spanLabel}`, `${baseAttr}`)}
${pad(p)}    ${getLabelBlock(p+4, `Total ${spanLabel}`, `${baseAttr}_max`)}
${pad(p)}</label>`;
    let ret = ``, i = 0;
    for (const item of [['', 'xp'],['Role ', 'rxp']])
        ret += `${i++ !== 0 ? brPad(p) : ''}${getXpBlock(...item)}`;
    return ret;
}
function getCraftXpsBlock(p) {
    let ret = ``, i = 0;
    for (const item of ['Silver','Gold', 'White'])
        ret += `${i++ !== 0 ? brPad(p) : ''}${getLabelBlock(p, `${item} `, `${item.toLowerCase()}-xp`)}`;
    return ret;
}

function getDefaultProjectsBlock(p) {
    const getProjectBlock = (i) => /*html*/`<div class="sheet-flexbox-h sheet-flexbox0">
${pad(p)}    <input type="text" name="attr_major-project${i}-name" placeholder="Longsword">
${pad(p)}    <select disabled="disabled"><option>Major</option></select>
${pad(p)}</div>`;
    let ret = ``;
    for (let i = 0; i < 3; i++)
        ret += `${i !== 0 ? brPad(p) : ''}${getProjectBlock(i+1)}`;
    return ret;
}

outHtml += /*html*/
`                        <div><!-- 1.3.3.4 EXPERIENCE & CRAFTING -->
                            <h1><span class="sheet-experience">Experience &amp; Crafting</span></h1>
                            <div class="sheet-experience sheet-flexbox-h sheet-flexbox-inline">
                                ${getXpsBlock(32)}
                            </div>
                            <div class="sheet-experience sheet-2colrow">
                                <div class="sheet-col sheet-flexbox-h">
                                    ${getCraftXpsBlock(36)}
                                </div>
                                <div class="sheet-crafting-projects sheet-col">
                                    ${getDefaultProjectsBlock(36)}
                                    <fieldset class="repeating_crafting-projects" style="display: none;">
                                        <div class="sheet-flexbox-h sheet-flexbox0">
                                            <input type="text" name="attr_project-name" placeholder="Longsword">
                                            <select name="attr_project-type">
                                                ${returnOptions(48, ['','Major','Superior','Legendary'].map(i => ({val: i, label: i})), -1)}
                                            </select>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>\n`;

const dodgeAddedVariables = '@{battlegroup-def-boost} - (@{apply-onslaught} * @{onslaught}) - @{grab-def-penalty} - (@{prone-def-penalty} * 2) + @{cover-def-bonus} + @{full-def-bonus} - @{clash-def-penalty} + @{sbv-activated}';
const parryAddedVariables = '@{battlegroup-def-boost} - (@{apply-onslaught} * @{onslaught}) - @{grab-def-penalty} - @{prone-def-penalty} + @{cover-def-bonus} + @{full-def-bonus} - @{clash-def-penalty} + @{sbv-activated}';
function getWeaponsLine(p = 0) {
    return /*html*/`<div class="sheet-gear sheet-table">
${pad(p)}    <input type="hidden" name="attr_wound-penalty" value="-4">
${pad(p)}    <div class="sheet-table-header">
${pad(p)}        <div class="sheet-table-row">
${pad(p)}            <div class="sheet-table-cell" style="width: 25%;">Weapon Name</div>
${pad(p)}            <div class="sheet-table-cell" style="width: 2em;" title="Accuracy"><span class="sheet-dotted">Acc</span></div>
${pad(p)}            <div class="sheet-table-cell" style="width: 2em;" title="Damage"><span class="sheet-dotted">Dmg</span></div>
${pad(p)}            <div class="sheet-table-cell" style="width: 2em;" title="Defense"><span class="sheet-dotted">Def</span></div>
${pad(p)}            <div class="sheet-table-cell" style="width: 4em;" title="Ability"><span class="sheet-dotted">Ability</span></div>
${pad(p)}            <div class="sheet-table-cell" style="width: 3em;" title="Parry including Defense"><span class="sheet-dotted">Par</span></div>
${pad(p)}            <div class="sheet-table-cell" style="width: 3em;" title="Parry with specialty including Defense"><span class="sheet-dotted">ParS</span></div>
${pad(p)}            <div class="sheet-table-cell" style="width: 2em;" title="Overwhelming"><span class="sheet-dotted">Over.</span></div>
${pad(p)}            <div class="sheet-table-cell" style="width: 2em;" title="Attune"><span class="sheet-dotted">Att.</span></div>
${pad(p)}            <div class="sheet-table-cell">Tags</div>
${pad(p)}        </div>
${pad(p)}    </div>
${pad(p)}    <fieldset class="repeating_weapon sheet-table-body" style="display: none;">
${pad(p)}        <div class="sheet-table-cell"><input type="text" name="attr_repweaponname" placeholder="Unarmed"></div>
${pad(p)}        <div class="sheet-table-cell"><input type="number" name="attr_repweaponacc" value="4"></div>
${pad(p)}        <div class="sheet-table-cell"><input type="number" name="attr_repweapondam" value="7"></div>
${pad(p)}        <div class="sheet-table-cell"><input type="number" name="attr_repweapondef" value="0"></div>
${pad(p)}        <div class="sheet-table-cell">
${pad(p)}            <select name="attr_repweaponabi" class="select-abi">
${pad(p)}                <option value="brawl" selected>Brawl</option>
${pad(p)}                <option value="melee">Melee</option>
${pad(p)}                ${returnOptions(p+16, maAttrsArray.map(i => ({val: i, label: hashCharmName[`charms-${i}`]})), -1)}
${pad(p)}                <option disabled>-------RAW------</option>
${pad(p)}                ${returnOptions(p+16, [...Array(11).keys()].map(i => ({val: i, label: i})), -1)}
${pad(p)}                <option disabled>-------SPECIAL------</option>
${pad(p)}                <option value="noParry">Can't Parry with this weapon</option>
${pad(p)}            </select>
${pad(p)}        </div>
${pad(p)}        <div class="sheet-table-cell">
${pad(p)}            <input type="hidden" name="attr_onslaught-applied" value="(@{onslaught} * @{apply-onslaught})" class="apply-onslaught-check" disabled>
${pad(p)}            <input type="hidden" name="attr_wound-penalty" class="wound-penalty-check" value="@{wound-penalty}" disabled="disabled">
${pad(p)}            <input type="number" value="(@{repweaponparry} + ${parryAddedVariables})" name="attr_repweaponparryfinal" title="Parry without specialty" disabled="disabled" class="wound-taint onslaught-taint cover-taint grab-taint prone-taint clash-taint">
${pad(p)}        </div>
${pad(p)}        <div class="sheet-table-cell">
${pad(p)}            <input type="hidden" name="attr_onslaught-applied" value="(@{onslaught} * @{apply-onslaught})" class="apply-onslaught-check" disabled>
${pad(p)}            <input type="hidden" name="attr_wound-penalty" class="wound-penalty-check" value="@{wound-penalty}" disabled="disabled">
${pad(p)}            <input type="number" value="(@{repweaponparryspe} + ${parryAddedVariables})" name="attr_repweaponparryspefinal" title="Parry with specialty" disabled="disabled" class="wound-taint onslaught-taint cover-taint grab-taint prone-taint clash-taint">
${pad(p)}        </div>
${pad(p)}        <div class="sheet-table-cell"><input type="number" name="attr_repweaponov" value="1" min="1"></div>
${pad(p)}        <div class="sheet-table-cell"><input type="number" name="attr_repweaponatt" value="0"></div>
${pad(p)}        <div class="sheet-table-cell"><input type="text" name="attr_repweapontags" placeholder="Bashing, Brawl, Grappling, Natural"></div>
${pad(p)}    </fieldset>
${pad(p)}</div>`;
}

outHtml += /*html*/
`                        <div><!-- 1.3.3.5 WEAPONS & GEAR -->
                            <h1><span class="sheet-gear">Weapons &amp; Gear</span></h1>
                            ${getWeaponsLine(28)}
                        </div>
                        <div><!-- 1.3.3.5.1 MISC ITEMS -->
                            <div class="sheet-gear">
                                <div class="sheet-text-center sheet-txt-lg" style="margin-top: 8px"><strong>Miscellaneous Items</strong></div>
                                <fieldset class="repeating_gear" style="display: none;">
                                    <input type="text" name="attr_repgear" style="width: 100%" placeholder="Fancy scarf">
                                </fieldset>
                            </div>
                        </div>
                        <div><!-- 1.3.3.6 ARMOR -->
                            <h1><span class="sheet-gear">Armor</span></h1>
                            <div class="sheet-gear sheet-table sheet-armor">
                                <div class="sheet-table-header">
                                    <div class="sheet-table-row">
                                        <div class="sheet-table-cell" style="width: 25%;">Armor</div>
                                        <div class="sheet-table-cell" style="width: 3em;">Soak</div>
                                        <div class="sheet-table-cell" style="width: 3em;">Hardness</div>
                                        <div class="sheet-table-cell" style="width: 3em;">Mobility</div>
                                        <div class="sheet-table-cell" style="width: 3em;">Attune</div>
                                        <div class="sheet-table-cell">Tags</div>
                                    </div>
                                </div>
                                <div class="sheet-table-body">
                                    <div class="sheet-table-row">
                                        <div class="sheet-table-cell"><input type="text" name="attr_armor-name" placeholder="Chain Shirt"></div>
                                        <div class="sheet-table-cell"><input type="number" name="attr_armorsoak" value="0"></div>
                                        <div class="sheet-table-cell"><input type="number" name="attr_hardness" value="0"></div>
                                        <div class="sheet-table-cell"><input type="number" name="attr_armor-mobility" value="0"></div>
                                        <div class="sheet-table-cell"><input type="number" name="attr_armor-attune" value="0"></div>
                                        <div class="sheet-table-cell"><input type="text" name="attr_armor-tags" placeholder="Concealable"></div>
                                    </div>
                                    <div class="sheet-table-row sheet-mount-armor">
                                        <div class="sheet-table-cell"><input type="text" name="attr_mount-armor-name" placeholder="Mount Barding"></div>
                                        <div class="sheet-table-cell"><input type="number" name="attr_mount-armorsoak" value="" readonly></div>
                                        <div class="sheet-table-cell"><input type="number" name="attr_mount-hardness" value="" readonly></div>
                                        <div class="sheet-table-cell"><input type="number" name="attr_mount-armor-mobility" value="0"></div>
                                        <div class="sheet-table-cell"><input type="number" name="attr_mount-armor-attune" value="" readonly></div>
                                        <div class="sheet-table-cell"><input type="text" name="attr_armor-tags" placeholder="Concealable"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 1.4 JOINED AGAIN = HEALTH & DEFENSE -->
\n`;

const defaultDefExcPrompt = `?{Defense Added ? (1def = @{def-exc-cost-multiplier}mote)|1}`;
function getDefExcDiv(p) {
    return /*html*/`<div class="flex-col def-exc">
${pad(p)}    <button type="roll" class="sheet-roll btn ui-draggable default-whisper" name="act_defexc" title="quick access to Generic Defense Excellency (!NOT the one editable in Other!)" value="&amp;{template:exalted3e_cast} {{charm-name=Generic Defense Excellency}} {{character-name=@{character_name}}} {{aspect=@{caste-low}}} {{balanced=0}} {{type=Supplemental}} {{cost=[[${defaultDefExcPrompt} * @{def-exc-cost-multiplier}]]}} {{duration=Instant}} {{description=The Exalt infuse her essence inside her defenses to appear impenetrable.}} {{effect=The Exalt add [[${defaultDefExcPrompt}]] to the static value of the related defense.}}\\n!exr ${moteCostBase}${moteCostPromptBase}[[${defaultDefExcPrompt} * @{def-exc-cost-multiplier}]]">Def Exc</button>
${pad(p)}</div>`;
}

function getDefenseLine(p = 0) {
    return /*html*/`<div class="sheet-defenses flex-wrap">
${pad(p)}    <div class="flex-col">
${pad(p)}        <div class="flex grow-normal" style="margin-left: 1em;">
${pad(p)}            <span title="Onslaught is by default penalty to defenses which reset at your turn, you get 1 each time you get hit">Onslaught</span>:
${pad(p)}        </div>
${pad(p)}        <div class="flex grow-normal">
${pad(p)}            <div style="display: inline-block;"><input type="checkbox" value="1" class="onslaught-checkbox" name="attr_apply-onslaught"><span></span></div>
${pad(p)}            <input type="hidden" name="attr_onslaught" class="onslaught-check">
${pad(p)}            <input type="hidden" name="attr_onslaught-applied" value="(@{onslaught} * @{apply-onslaught})" class="apply-onslaught-check" disabled>
${pad(p)}            <input type="number" value="0" class="onslaught-input" name="attr_onslaught" style="width: 70px; cursor: text;" title="@{onslaught-applied}${TITLE_BR}Onslaught is by default penalty to defenses which reset at your turn, you get 1 each time you get hit">
${pad(p)}        </div>
${pad(p)}    </div>
${pad(p)}    <div class="flex-col">
${pad(p)}        <div class="flex">
${pad(p)}            <span title="Natural Soak (Stamina + manual Modifier)">Nat. Soak</span>:
${pad(p)}            <span name="attr_stamina" style="margin-left: 7px; margin-right: 3px; width: 1.55em; text-align: center;" title="Stamina">3</span>+<input type="number" value="0" name="attr_naturalsoak" style="width: 28px" title="Natural Soak Additional">
${pad(p)}        </div>
${pad(p)}        <div class="flex">
${pad(p)}            <span title="Unarmed Parry= (Dex + Brawl)/2">UnA. Parry</span>:
${pad(p)}            <input type="hidden" name="attr_onslaught-applied" value="(@{onslaught} * @{apply-onslaught})" class="apply-onslaught-check" disabled>
${pad(p)}            <input type="hidden" class="onslaught-check" name="attr_onslaught">
${pad(p)}            <input type="hidden" class="qc-panel-check" name="attr_qc">
${pad(p)}            <input type="number" value="(@{parry} + ${parryAddedVariables})" disabled="disabled" name="attr_parryfinal" data-i18n-title="parry-without-specialty" title="@{parryfinal}${TITLE_BR}Parry without specialty" class="wound-taint onslaught-taint cover-taint grab-taint prone-taint clash-taint"><input type="number" value="(@{parry-specialty} + ${parryAddedVariables})" disabled="disabled" name="attr_parryfinal-specialty" data-i18n-title="parry-with-specialty" title="@{parryfinal-specialty}${TITLE_BR}Parry with specialty" class="wound-taint onslaught-taint cover-taint grab-taint prone-taint clash-taint qc-toggle-display last-visible"><input type="text" name="attr_qc-parry-exc" class="qc-have-exc qc-toggle-display-inv" title="Excellency cap" readonly tabindex="-1">
${pad(p)}        </div>
${pad(p)}    </div>
${pad(p)}    <div class="flex-col">
${pad(p)}        <input type="hidden" class="qc-panel-check" name="attr_qc">
${pad(p)}        <div class="flex qc-toggle-visibility">
${pad(p)}            <span title="Armored Soak, come from your armor">Ar. Soak</span>:
${pad(p)}            <input type="number" readonly tabindex="-1" name="attr_armorsoak" title="Come from your armor">
${pad(p)}        </div>
${pad(p)}        <div class="flex">
${pad(p)}            <div style="display: inline-block;"><input type="checkbox" value="1" class="ride-checkbox" name="attr_ride-for-evasion" title="Ride Mode (use Dex+Ride instead of Dex+Dodge)"><span></span></div>
${pad(p)}            <span title="Dexterity + Dodge">Evasion</span>:
${pad(p)}            <input type="hidden" name="attr_onslaught-applied" value="(@{onslaught} * @{apply-onslaught})" class="apply-onslaught-check" disabled>
${pad(p)}            <input type="hidden" class="qc-panel-check" name="attr_qc">
${pad(p)}            <input type="number" value="(@{evasion-base} + ${dodgeAddedVariables})" disabled="disabled" data-i18n-title="evasion-without-specialty" title="@{evasion}${TITLE_BR}Evasion without specialty" name="attr_evasion" class="wound-taint onslaught-taint cover-taint grab-taint prone-taint-doubled clash-taint"><input type="number" value="(@{evasion-base-specialty} + ${dodgeAddedVariables})" disabled="disabled" data-i18n-title="evasion-with-specialty" title="@{evasion-specialty}${TITLE_BR}Evasion with specialty" name="attr_evasion-specialty" class="wound-taint onslaught-taint cover-taint grab-taint prone-taint-doubled clash-taint qc-toggle-display last-visible"><input type="text" name="attr_qc-evasion-exc" class="qc-have-exc qc-toggle-display-inv" title="Excellency cap" readonly tabindex="-1">
${pad(p)}        </div>
${pad(p)}    </div>
${pad(p)}    ${getDefExcDiv(p+4)}
${pad(p)}    <div class="flex-col">
${pad(p)}        <div class="flex">
${pad(p)}            <strong><span title="Your capacity to reduce withering damage to you">Total Soak</span>:</strong>
${pad(p)}            <input type="number" value="@{stamina}+@{naturalsoak}+@{armorsoak}+@{battlegroup-size}" disabled="disabled" name="attr_totalsoak" data-formula="@{stamina}+@{naturalsoak}+@{armorsoak}+@{battlegroup-size}" title="@{totalsoak}${TITLE_BR}Represent the capacity to reduce withering damage.">
${pad(p)}        </div>
${pad(p)}        <div class="flex">
${pad(p)}            <span title="Wits + Integrity">Resolve</span>:
${pad(p)}            <input type="hidden" class="qc-panel-check" name="attr_qc">
${pad(p)}            <input type="number" value="(ceil((@{wits} + @{integrity}) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="resolve-without-specialty" title="@{resolve}${TITLE_BR}Resolve without specialty" name="attr_resolve" class="wound-taint"><input type="number" value="(ceil(((@{wits} + @{integrity}) + 1) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="resolve-with-specialty" title="@{resolve-specialty}${TITLE_BR}Resolve with specialty" name="attr_resolve-specialty" class="wound-taint qc-toggle-display last-visible"><input type="text" name="attr_qc-resolve-exc" class="qc-have-exc qc-toggle-display-inv" title="Excellency cap" readonly tabindex="-1">
${pad(p)}        </div>
${pad(p)}    </div>
${pad(p)}    <div class="flex-col">
${pad(p)}        <div class="flex">
${pad(p)}            <span title="The minimum damage dice the enemy need to roll to do Decisive Damage to you (not substracted though)">Hardness</span>:
${pad(p)}            <input type="number" readonly tabindex="-1" name="attr_hardness" title="@{hardness}${TITLE_BR}Come from your armor">
${pad(p)}        </div>
${pad(p)}        <div class="flex">
${pad(p)}            <span title="Manipulation + Socialize">Guile</span>:
${pad(p)}            <input type="hidden" class="qc-panel-check" name="attr_qc">
${pad(p)}            <input type="number" value="(ceil((@{manipulation} + @{socialize}) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="guile-without-specialty" title="@{guile}${TITLE_BR}Guile without specialty" name="attr_guile" class="wound-taint"><input type="number" value="(ceil(((@{manipulation} + @{socialize}) + 1) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="guile-with-specialty" title="@{guile-specialty}${TITLE_BR}Guile with specialty" name="attr_guile-specialty" class="wound-taint qc-toggle-display last-visible"><input type="text" name="attr_qc-guile-exc" class="qc-have-exc qc-toggle-display-inv" title="Excellency cap" readonly tabindex="-1">
${pad(p)}        </div>
${pad(p)}    </div>
${pad(p)}</div>`;
}

function getHealthLine(p = 0) {
    return /*html*/`<input type="hidden" name="attr_wound-penalty" value="-4">
${pad(p)}<fieldset class="repeating_health">
${pad(p)}    <div class="sheet-health-level">
${pad(p)}        <div class="sheet-damage-box">
${pad(p)}            <input type="radio" name="attr_hl-damage" value="healthy" class="sheet-dots0" checked="checked"><span>&nbsp;</span>
${pad(p)}            <input type="radio" name="attr_hl-damage" value="bashing" class="sheet-dots1"><span>&nbsp;</span>
${pad(p)}            <input type="radio" name="attr_hl-damage" value="lethal" class="sheet-dots2"><span>&nbsp;</span>
${pad(p)}            <input type="radio" name="attr_hl-damage" value="aggravated" class="sheet-dots3"><span>&nbsp;</span>
${pad(p)}        </div>
${pad(p)}        <select class="sheet-wound-penalty" name="attr_hl-penalty">
${pad(p)}            ${returnOptions(p+12, [{val: '', label: ''}, ...[0,-1,-2,-4].map(i => ({val: i, label: `-${Math.abs(i)}`})),{val: 'I', label: 'Incapacitated'}], 0)}
${pad(p)}        </select>
${pad(p)}    </div>
${pad(p)}</fieldset>`;
}

outHtml += /*html*/
`                <h1 class="sheet-health-defenses"><span>Health &amp; Defense</span></h1><!-- Healt & Defense -->
                ${getDefenseLine(16)}
                <div class="sheet-health-header sheet-text-center sheet-txt-lg" style="margin-top: 8px"><strong>Health Levels</strong></div>
                <div class="sheet-health-track"><!-- Health Levels -->
                    ${getHealthLine(20)}
                    <div class="add-multiple-div">
                        <input type="checkbox" class="sheet-unnamed-toggle add-multiple btn"><span title="Add Multiple" class="sheet-layer6"></span>
                        <div class="sheet-layer5">
                            <input type="number" class="add-multiple-qty" name="attr_add-multiple-qty" min="1" value="1">
                            <select class="sheet-wound-penalty" name="attr_add-multiple-penalty">
                                ${returnOptions(32, [...[0,-1,-2,-4].map(i => ({val: i, label: `-${Math.abs(i)}`})),{val: 'I', label: 'Incapacitated'}], 0)}
                            </select>
                            <button type="action" name="act_add-multiple-hl" class="btn add-multiple">Add</button>
                        </div>
                    </div>
                    <div class="heal-hl-div">
                        <button type="action" name="act_heal-hl" class="btn heal-hl" style="display: none;">Heal</button>
                    </div>
                </div>
            </div>

            <!-- 2 CHARMS PAGE -->\n`;

const costArray = {
    'Mote':{name:'Mote',titleBase:'Atome of Essence'},
    'Will':{name:'Will',titleBase:'Willpower'},
    'Init':{name:'Init',titleBase:'Initiative Points'},
};

const getCostLine = (item, defaultWill, double = false) => /*html*/`<label>${item.name}:<input type="text" name="attr_rep-cost-${item.name.toLowerCase()}" class="sheet-cost-${item.name.toLowerCase()} grow-${double ? 'double' : 'normal'}" title="Cost as ${item.titleBase}${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations"${defaultWill ? ' value="?{Willpower ?|No,0|Yes,1}"' : ''}></label>`;

function getIndexCostRows(index, p = 0, defaultWill = false) {
    return /*html*/`<p class="${costArray[index].name.toLowerCase()}-color-down rounded-box grow-${index === 'Mote' ? 'double' : 'normal'} flex${index === 'Mote' ? ' caste-have-exc-toggle' : ''}">
${pad(p)}    ${getCostLine(costArray[index], defaultWill, false)}
${pad(p)}</p>`;
}

function getCostRows(p = 0, includeInit = true, defaultWill = false) {
    let ret = `${getIndexCostRows('Mote', p)}
${pad(p)}${getIndexCostRows('Will', p, defaultWill)}`;
    if (includeInit) ret += `${brPad(p)}${getIndexCostRows('Init', p)}`;
    return ret;
}

function getCharmInputLinesFromArray(p = 0, array) {
    const getCharmInputLine = (attrName, val, title = val) => /*html*/`<input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-${attrName} sheet-tab-charm-${attrName}" name="attr_charm_sheet" title="${title}" type="radio" value="${val}">`;
    let ret = ``, i = 0;
    for (const item of array) {
        ret += getCharmInputLine(item, hashCharmName[`charms-${item}`], hashCharmTitle[`charms-${item}`]);
        if (i++ <= array.length - 2) ret += brPad(p);
    }
    return ret;
}

function getCharmTitleLinesFromArray(p = 0, array) {
    const getCharmTitleLine = (className, label) => /*html*/`<h1 class="sheet-tab-charm-sheet-${className}"><span>${label}</span></h1>`;
    let ret = `<div class="sheet-body sheet-tab-content">\n`, i = 0;
    for (const item of array)
        ret += `${pad(p+4)}${getCharmTitleLine(item, hashCharmName[`charms-${item}`])}\n`;
    ret += `${pad(p)}</div>`;
    return ret;
}

const basecharmExpr = '&amp;{template:exalted3e_cast}', startcharmExpr = '{{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}}';
const charmExpr = `${basecharmExpr} {{charm-name=@{charm-name}}} ${startcharmExpr} {{skill=@{charm-skill}}} {{keywords=@{charm-keywords}}} {{type=@{charm-type}}} {{cost=@{charm-cost}}} {{duration=@{charm-duration}}} {{description=@{charm-description}}} {{effect=@{charm-effect}}} {{mute=@{charm-mute}}}`;
const spellExpr = `${basecharmExpr} {{spell-name=@{repspell-name}}} {{is-shaping-ritual=@{charm-shaping-ritual}}} ${startcharmExpr} {{skill=Sorcery}} {{keywords=@{spell-keywords}}} {{circle=@{repspell-circle}}} {{cost=@{repspell-cost}}} {{duration=@{repspell-dur}}} {{description=@{spell-description}}} {{effect=@{repspell-effect}}}`;
function generateCastButtons(p, rollStr, includeShow = true) {
    const getLine = (buttonLabel, classAdded, nameAdded, value, title = false) => /*html*/`<button type="roll" class="sheet-roll btn ui-draggable${classAdded}" name="act_charmcast${nameAdded}" value="${value}"${title ? ' title="Cast the Charm without the cost nor the macro"' : ''}>${buttonLabel}</button>`;
    let ret = ``;
    for (const section of [{baseClass: 'default', addedName: '', baseExpr: '\\n!exr '},{baseClass: 'extended', addedName: '-ex', baseExpr: '\\n@{charm-rollexpr} '}]) {
        ret += /*html*/`<div class="charm-buttons charm-buttons-show-${section.baseClass} sheet-grouped-buttons">${brPad(p)}`;
        for (const line of [{baseClass: 'default', addedName: '', baseVal: '', str: 'Cast'},{baseClass: 'gm', addedName: '-gm', baseVal: '/w gm ', str: 'to GM'}])
            ret += `    ${getLine(line.str, ` ${line.baseClass}-whisper`, section.addedName + line.addedName, `${line.baseVal}${rollStr}${section.baseExpr}${section.baseClass === 'extended' && line.baseClass === 'gm' ? `-gm ` : ''}@{rep-cost-macro}`)}${brPad(p)}`;
        if (includeShow)
            ret += `    ${getLine('Show', '', '-show', rollStr, true)}${brPad(p)}`;
        ret += /*html*/`</div>`;
        if (section.baseClass !== 'extended') ret += brPad(p);
    }
    return ret;
}

function getTemplateCharmsOptions(p) {
    let ret = /*html*/`<option value=""></option>`, i = 0;
    for (const exalt of Object.keys(charmCompendiumPerExalt)) {
        for (const abi of Object.keys(charmCompendiumPerExalt[exalt])) {
            for (const [id, charm] of charmCompendiumPerExalt[exalt][abi].entries()) {
                ret += /*html*/`${brPad(p)}<option value="${id}" class="${exalt}-charm" title="${abi}">${charm['charm-name']}</option>`;
                // if (i++ >= 42) return ret;
            }
        }
    }
    return ret;
}

outHtml += /*html*/`
            <div class="sheet-tab-content sheet-tab-charm-sheet">
                <h1><span>Charms &amp; Evocations</span></h1>

                <div class="charm-tab-list">
                    <input class="sheet-tab-charms-check" name="attr_charm_sheet" type="hidden">
                    ${getCharmInputLinesFromArray(20, allCharmArray.map(i => i.replace('charms-', '')))}\n
                    ${getCharmTitleLinesFromArray(20, allCharmArray.map(i => i.replace('charms-', '')))}\n
                    <div class="sheet-body sheet-tab-content charm-sheet-all">
                        <fieldset class="repeating_charms-all" style="display: none;">
                            <input type="hidden" name="attr_isEvoc" class="sheet-tab-charms-inside-check" value="">
                            <input type="hidden" name="attr_charm-skill" class="sheet-tab-charms-inside-check" value="">
                            <input type="hidden" name="attr_charm-name" class="sheet-tab-charms-name-check" value="">
                            <div class="flex flex-col sheet-body">
                                <div class="flex flex-wrap">
                                    <input type="hidden" name="attr_charm-learnt" class="charm-learnt-check" value="1">
                                    <input type="text" name="attr_charm-name" class="sheet-charms-spells-trait-name" placeholder="Excellent Solar Larceny"><span> </span>
                                    <select name="attr_charm-type" style="width: 109px">
                                        ${returnOptions(40, [...['','Simple','Supplemental','Reflexive'].map(i => ({val: i, label: i})), {val: 'Double', label: 'Suppl. ou Reflex.'}, ...['Permanent','Enchantment'].map(i => ({val: i, label: i}))], -1)}
                                    </select>
                                    <div class="flex grow-normal"><label><span>Cost: </span><input type="text" name="attr_charm-cost" class="sheet-charms-spells-trait sheet-charms-spells-trait-cost" placeholder="1m/die"></label></div>
                                    <input type="hidden" name="attr_charm-buttons-isextended" class="charm-buttons-include-check" value="0">
                                    <input type="hidden" name="attr_rep-cost-macro">
                                    ${generateCastButtons(36, charmExpr)}
                                    <input type="text" name="attr_charm-short-desc" class="sheet-charms-spells-trait sheet-charms-spells-trait-short-desc" placeholder="short desc">
                                    <input type="checkbox" name="attr_charm-learnt" class="sheet-charms-spells-trait sheet-charms-spells-trait-learnt" title="Learnt" value="1" checked>
                                </div>
                                <div class="sheet-table-row" style="width: 100%">
                                    <input type="checkbox" name="attr_charm-effect-display" class="sheet-charmeffect" value="1"><span class="sheet-charmeffect" title="Show Description &amp; Effect"></span>
                                    <div class="sheet-charm-effect">
                                        <div class="flex grow-max"><label><span>Book: </span><input type="text" name="attr_charm-book" class="sheet-charms-spells-trait grow-normal" placeholder="Core"><span> </span></label></div>
                                        <div class="flex"><label><span>Page #: </span><input type="number" name="attr_charm-page" class="sheet-charms-spells-trait" placeholder="255"><span> </span></label></div>
                                        <div class="flex"><label><span>Duration: </span><input type="text" name="attr_charm-duration" class="sheet-charms-spells-trait" placeholder="Instant"><span> </span></label></div>
                                        <div class="flex trait-div"><label><span class="default-trait">Trait: </span><span class="artifact-trait">Artifact Name: </span><input type="text" name="attr_charm-skill" class="sheet-charms-spells-trait" placeholder="Fire form"><span> </span></label></div>
                                        <div class="flex grow-max"><label><span>Keywords: </span><input type="text" name="attr_charm-keywords" class="sheet-charms-spells-trait grow-normal" placeholder="Uniform, Psyche"></label></div>
                                        <label title="Mute"><span>Mute: </span><div class="flex"><input type="checkbox" name="attr_charm-mute" class="sheet-charms-spells-trait" value="1"></div></label>
                                        <div class="flex grow-normal"><label><span class="show-to-db-only">Aspect: </span><select name="attr_charm-aspect" class="show-to-db-only sheet-charms-spells-trait grow-normal"><option value="unknown" hidden>Unknown</option><option value="none">None</option><option value="air">Air</option><option value="earth">Earth</option><option value="fire">Fire</option><option value="water">Water</option><option value="wood">Wood</option><option value="dawn" hidden>Dawn</option><option value="zenith" hidden>Zenith</option><option value="twilight" hidden>Twilight</option><option value="night" hidden>Night</option><option value="eclipse" hidden>Eclipse</option><option value="full moon" hidden>Full Moon</option><option value="changing moon" hidden>Changing Moon</option><option value="no moon" hidden>No Moon</option><option value="casteless" hidden>Casteless</option><option value="journeys" hidden>Journeys</option><option value="serenity" hidden>Serenity</option><option value="battles" hidden>Battles</option><option value="secrets" hidden>Secrets</option><option value="endings" hidden>Endings</option><option value="adamant" hidden>Adamant</option><option value="jade" hidden>Jade</option><option value="moonsilver" hidden>Moonsilver</option><option value="orichalcum" hidden>Orichalcum</option><option value="soulsteel" hidden>Soulsteel</option><option value="starmetal" hidden>Starmetal</option><option value="daybreak" hidden>Daybreak</option><option value="day" hidden>Day</option><option value="dusk" hidden>Dusk</option><option value="midnight" hidden>Midnight</option><option value="moonshadow" hidden>Moonshadow</option><option value="defiler" hidden>Defiler</option><option value="fiend" hidden>Fiend</option><option value="malefactor" hidden>Malefactor</option><option value="scourge" hidden>Scourge</option><option value="slayer" hidden>Slayer</option><option value="blood" hidden>Blood</option><option value="breath" hidden>Breath</option><option value="flesh" hidden>Flesh</option><option value="marrow" hidden>Marrow</option><option value="soil" hidden>Soil</option><option value="sorceries" hidden>Sorceries</option></select></label></div>
                                        <label title="Balanced"><span class="show-to-db-only">Balanced: </span><div class="flex"><input type="checkbox" name="attr_charm-balanced" class="show-to-db-only sheet-charms-spells-trait"></div></label>
                                        <label title="Can Change Aspect"><span class="show-to-db-only">Multi: </span><div class="flex"><input type="checkbox" name="attr_charm-can-cycle-aspects" class="show-to-db-only sheet-charms-spells-trait"></div></label>
                                        <div class="cost-section grow-max flex flex-wrap">
                                            <p class="mote-color-down rounded-box grow-double flex caste-have-exc-toggle">
                                                ${getCostLine(costArray['Mote'])}
                                                <select name="attr_rep-cost-mote-pool">
                                                    ${returnOptions(52, [{val: '?{Spend Peripheral First ?|Yes,1|No,0}', label: 'Prompt'},{val: '1', label: 'Peripheral'},{val: '0', label: 'Personal'}])}
                                                </select>
                                                <input type="hidden" name="attr_rep-cost-mote-commit" value="0">
                                                <label title="Commit on Cast ?"><span>C: </span><div class="flex caste-have-exc-toggle"><input type="checkbox" name="attr_rep-cost-mote-commit" class="sheet-charms-spells-trait" value="1" title="Commit on Cast ?"></div></label>
                                            </p>
                                            ${getIndexCostRows('Will', 44)}
                                            ${getIndexCostRows('Init', 44)}
                                        </div>
                                    </div>
                                    <div class="sheet-charm-effect">
                                        <textarea name="attr_charm-description" class="desc" placeholder="Harnessing the great power of The Unconquered Sun, Karal focuses his efforts!"></textarea>
                                    </div>
                                    <div class="sheet-charm-effect">
                                        <textarea name="attr_charm-effect" class="effect" placeholder="Add dice to a Larceny roll"></textarea>
                                    </div>
                                    <div class="sheet-charm-effect">
                                        <input type="hidden" name="attr_charm-buttons-isextended" class="charm-buttons-include-check" value="0">
                                        <input type="text" name="attr_charm-rollexpr" placeholder="EX: '!exr -setOnce -d 9 -CRStarter @{essence}', '!exr 15# -d 8,9 -r 6 -v', '!exr (10+?{Motes?|5})#+?{Succes ?|0}', ..."/>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <div class="charm-special-add-div">
                            <button type="action" name="act_add-charm-to-all" class="btn repcontrol_add">+Add</button>
                            <div class="select-add-template-charms">
                                <select name="attr_template-charm-name-selected">
                                    ${getTemplateCharmsOptions(36)}
                                </select>
                                <input type="hidden" name="attr_template-charm-name-selected" class="template-charm-name-selected-check" value="">
                                <button type="action" name="act_add-template-charm-to-all" class="btn repcontrol_add">Add Selected</button>
                            </div>
                        </div>
                        <div class="charm-sheet-all-footer"></div>
                    </div>

                </div>

            </div>

            <!-- 3 SORCERIES PAGE -->

            <div class="sheet-body sheet-tab-content sheet-tab-spell-sheet">
                <h1><span>Sorceries</span></h1>
                <fieldset class="repeating_spells" style="display: none;">
                    <div class="flex flex-col sheet-body">
                        <input type="hidden" name="attr_charm-shaping-ritual" class="shaping-ritual-check">
                        <div class="flex flex-wrap">
                            <input type="text" name="attr_repspell-name" style="width: 32% ; color: #9f0b10 ; font-weight: bold ; margin-right: 2px;" placeholder="Cirrus Skiff" class="grow-normal"><span> </span>
                            <input type="checkbox" name="attr_charm-shaping-ritual" class="sheet-charms-spells-trait sheet-charms-spells-trait-shaping-ritual" title="is a Shaping Ritual" value="1">
                            <select name="attr_repspell-circle" style="width: 109px">
                                ${returnOptions(32, ['','Terrestrial','Celestial','Solar'].map(i => ({val: i, label: i})), -1)}
                            </select>
                            <input type="hidden" name="attr_charm-buttons-isextended" class="charm-buttons-include-check" value="0">
                            <input type="hidden" name="attr_rep-cost-macro">
                            ${generateCastButtons(28, spellExpr, false)}
                            <input type="text" name="attr_charm-short-desc" class="sheet-charms-spells-trait sheet-charms-spells-trait-short-desc" placeholder="short desc">
                        </div>
                        <div class="flex flex-wrap sheet-charms-spells-trait">
                            <label><span>Book: </span><input type="text" name="attr_spell-book" style="width: 5em" class="sheet-charms-spells-trait grow-normal" placeholder="Core"><span> </span></label>
                            <label><span>Page #: </span><input type="number" name="attr_spell-page" class="sheet-charms-spells-trait" placeholder="471" style="width: 5em;"><span> </span></label>
                            <label class="duration"><span>Duration: </span><input type="text" name="attr_repspell-dur" class="sheet-charms-spells-trait" placeholder="Until ended"><span> </span></label>
                            <div class="flex cost"><label><span>Cost: </span><input type="text" name="attr_repspell-cost" class="sheet-charms-spells-trait" placeholder="15m, 1wp"></label></div>
                            <div class="flex control"><label><span>Control: </span><div class="flex"><input type="checkbox" style="margin: 15 ; z-index: 15" name="attr_repspell-control" value="1"><span></span></div></label></div>
                            <div class="cost-section grow-normal">
                                ${getIndexCostRows('Will', 32)}
                            </div>
                            <input type="hidden" name="attr_charm-aspect" value="sorceries">
                            <input type="hidden" name="attr_charm-balanced" value="0">
                        </div>
                        <div class="flex flex-wrap sheet-charms-spells-trait">
                            <label><span class="not-shaping-ritual">Keywords: </span><span class="shaping-ritual">Origin: </span><input type="text" name="attr_spell-keywords" class="sheet-charms-spells-trait grow-normal" placeholder="None"></label>
                        </div>
                        <div class="sheet-table-row" style="width: 100%">
                            <input type="checkbox" name="attr_spell-effect-display" class="sheet-spelleffect" value="1"><span class="sheet-spelleffect" title="Show Description &amp; Effect"></span>
                            <div class="sheet-spell-effect">
                                <textarea name="attr_spell-description" class="desc" placeholder="Karal calls upon the winds to form a small cloud under his command!"></textarea>
                            </div>
                            <div class="sheet-spell-effect">
                                <textarea name="attr_repspell-effect" class="effect" placeholder="Call a small cloud to ride on"></textarea>
                            </div>
                            <div class="sheet-spell-effect">
                                <input type="hidden" name="attr_charm-buttons-isextended" class="charm-buttons-include-check" value="0">
                                <input type="text" name="attr_charm-rollexpr" placeholder="EX: '!exr 15# -d 8,9 -r 6 -v', '!exr (10+?{Motes?|5})#+?{Succes ?|0}', ..."/>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>

            <!-- 4 CONFIG PAGE -->\n`;

const getConfigOptionLabel = (name, label = name, spanStyle) => /*html*/`<label><input type="checkbox" name="attr_charm-${name.toLowerCase()}" value="1"><span${spanStyle ? ` style="${spanStyle}"` : ''}> ${label}</span></label>`;

function getAbiConfigOptionList(p = 0) {
    const separators = [8,17], abilitiesFiltered = abilities.map(i => typeof i !== 'string' ? i.name : i).filter(i => i !== 'Martial Arts');
    let ret = /*html*/`<div class="sheet-checklist sheet-col">\n`, i = 0;
    for (const abilitie of abilitiesFiltered) {
        ret += `${pad(p+4)}${getConfigOptionLabel(abilitie)}\n`;
        if (separators.includes(i++)) ret += /*html*/`${pad(p)}</div>${brPad(p)}<div class="sheet-checklist sheet-col">\n`;
    }
    ret += /*html*/`${pad(p)}</div>`;
    return ret;
}

function getAttrConfigOptionList(p = 0) {
    const separators = [10,19], lunarFiltered = lunarCharmArray.slice(2).map(i => i.replace('charms-',''));
    let ret = /*html*/`<div class="sheet-checklist sheet-col">\n`, i = 0;
    for (const abilitie of lunarFiltered) {
        ret += `${pad(p+4)}${getConfigOptionLabel(abilitie, hashCharmName[`charms-${abilitie}`])}\n`;
        if (separators.includes(i++)) ret += /*html*/`${pad(p)}</div>${brPad(p)}<div class="sheet-checklist sheet-col">\n`;
    }
    ret += /*html*/`${pad(p)}</div>`;
    return ret;
}

function getSidConfigOptionList(p = 0) {
    const sidFiltered = sidCharmArray.map(i => i.replace('charms-',''));
    let ret = /*html*/``, i = 0;
    for (const abilitie of sidFiltered) {
        ret += `${i++ > 0 ? brPad(p) : ''}${getConfigOptionLabel(abilitie, hashCharmName[`charms-${abilitie}`])}`;
    }
    return ret;
}

function getMAConfigOptionList(p = 0) {
    const separators = [7,15], maFiltered = maCharmArray.map(i => i.replace('charms-',''));
    let ret = /*html*/`<div class="sheet-checklist sheet-col">\n`, i = 0;
    for (const abilitie of maFiltered) {
        ret += `${pad(p+4)}${getConfigOptionLabel(abilitie, hashCharmName[`charms-${abilitie}`].replace(' Style', '').replace('MA - ', ''))}\n`;
        if (separators.includes(i++)) ret += /*html*/`${pad(p)}</div>${brPad(p)}<div class="sheet-checklist sheet-col">\n`;
    }
    ret += /*html*/`${pad(p)}</div>`;
    return ret;
}

function getCheckboxLabel(p, attrName, spanLabel, checked, labelClass) {
    return  /*html*/ `<label${labelClass ? ` class="${labelClass}"` : ''}>
${pad(p)}    <input type="checkbox" name="attr_${attrName}" value="1"${checked ? ` checked` : ''}><span></span>
${pad(p)}    <span>${spanLabel}</span>
${pad(p)}</label>`;
}

outHtml += /*html*/
`
            <div class="sheet-body sheet-tab-content sheet-tab-settings-sheet">
                <h1><span>Character Type</span></h1>
                <div class="sheet-checklist sheet-2colrow sheet-main-config">
                    <div class="sheet-checklist sheet-col">
                        ${getCheckboxLabel(24, 'qc', 'Quick Character')}
                        ${getCheckboxLabel(24, 'battlegroup', 'Battle Group')}
                        ${getCheckboxLabel(24, 'charmwhispergm', 'Whisper to GM instead of CAST in charm tab', false, 'sheet-cast-to-gm')}
                        ${getCheckboxLabel(24, 'charmwhisperboth', 'Show both buttons in Charm Tab')}
                        ${getCheckboxLabel(24, 'antisocialtab', 'Show 2nd Social Tab')}
                        ${getCheckboxLabel(24, 'combattab', 'Show Combat Tab', true)}
                        ${getCheckboxLabel(24, 'showlimit', 'Show Limit Bar', false, 'sheet-force-limit')}
                        ${getCheckboxLabel(24, 'diceex', 'Include Dice Excellency')}
                        ${getCheckboxLabel(24, 'succex', 'Include Success Excellency')}
                        ${getCheckboxLabel(24, 'canspendmote', 'Can spend Motes')}
                        ${getCheckboxLabel(24, 'usecommitsystem', 'Use Commited List System', true)}
                        ${getCheckboxLabel(24, 'show-charname-in-charms', 'Show Character Name in Charms')}
                        ${getCheckboxLabel(24, 'hide-not-learnt-charms-in-reminders', 'Hide not Learnt Charms in Reminders')}
                        ${getCheckboxLabel(24, 'pain-tolerance', 'MERIT: Pain Tolerance')}
                        ${getCheckboxLabel(24, 'sbv-activated', 'CHARM ENABLED: Saga Beast Virtue', false, 'show-to-mortals-mostly')}
                        <label style="display: none;">
                            <button type="action" name="act_init-charm-img" title="Set Caste Image to Charms">Set Caste Image to Charms</button>
                        </label>
                        <label style="display: none;">
                            <button type="action" name="act_init-sheet-btn" title="Initializing a new Sheet">Initializing a new Sheet</button>
                        </label>
                        <label style="display: none;">
                            <button type="action" name="act_add-spirit-charms-btn" title="Add Generic Spirit Charms">Add Generic Spirit Charms</button>
                        </label>
                        <label style="display: none;">
                            <button type="action" name="act_set-spirit-charms-skill-btn" title="Set Spirit Charms Name">Set Spirit Charms Name</button>
                        </label>
                    </div>
                    <div class="sheet-checklist sheet-col sheet-special">
                        <label>
                            <span>Full Def Bonus</span>
                            <select name="attr_full-def-bonus">
                                ${returnOptions(32, [{val: 0, label: 'None'},{val: 2, label: 'Applied'}])}
                            </select>
                        </label>
                        <label>
                            <span>Cover Def Bonus</span>
                            <select name="attr_cover-def-bonus">
                                ${returnOptions(32, [{val: 0, label: 'None'},{val: 1, label: 'Light'},{val: 2, label: 'Heavy'}])}
                            </select>
                        </label>
                        <label>
                            <span>Grab Def Penalty</span>
                            <select name="attr_grab-def-penalty">
                                ${returnOptions(32, [{val: 0, label: 'None'},{val: 2, label: 'Grabbed'}])}
                            </select>
                        </label>
                        <label>
                            <span>Clash Def Penalty</span>
                            <select name="attr_clash-def-penalty">
                                ${returnOptions(32, [{val: 0, label: 'None'},{val: 2, label: 'Clash Lost'}])}
                            </select>
                        </label>
                        <label>
                            <span>Prone Def Penalty</span>
                            <select name="attr_prone-def-penalty">
                                ${returnOptions(32, [{val: 0, label: 'None'},{val: 1, label: 'Proned'}])}
                            </select>
                        </label>
                        <label>
                            <span>Token Size (%)</span>
                            <input type="number" name="attr_token-size-percent" value="100" min="1">
                        </label>
                        <label class="select-dicecap-type">
                            <span>Dice Cap Type</span>
                            <select name="attr_dicecap-type">
                                <option value="None" selected></option>
                                <option disabled>---Ability Based---</option>
                                ${returnOptions(32, Object.entries(abiDiceCapTypeHash).map(([k,v]) => ({val: v, label: k})), -1)}
                                <option disabled>---Attribute Based---</option>
                                ${returnOptions(32, Object.entries(attrDiceCapTypeHash).map(([k,v]) => ({val: v, label: k})), -1)}
                                <option disabled>---Essence Based / Custom---</option>
                                ${returnOptions(32, Object.entries(essenceDiceCapTypeHash).map(([k,v]) => ({val: v, label: k})), -1)}
                            </select>
                        </label>
                    </div>
                </div>
                <h1><span>Charms list configuration</span></h1>
                <h2 style="text-align: center;"><span class="solar-style">Solar</span> & <span class="db-style">DB</span></h2>
                <div class="sheet-checklist sheet-3colrow">
                    ${getAbiConfigOptionList(20)}
                </div>
                <h2 style="text-align: center;"><span class="lunar-style">Lunar</span></h2>
                <div class="sheet-checklist sheet-2colrow" style="margin:auto;">
                    ${getConfigOptionLabel('universal', 'Universal')}
                    ${getConfigOptionLabel('heartsblood', 'Heart\'s Blood', "color: darkred;")}
                </div>
                <div class="sheet-checklist sheet-3colrow">
                    ${getAttrConfigOptionList(20)}
                </div>
                <h2 style="text-align: center;">Sidereal</h2>
                <div class="sheet-checklist" style="margin:auto;">
                    ${getSidConfigOptionList(20)}
                </div>
                <h2 style="text-align: center;">Martial Arts</h2>
                <div class="sheet-checklist sheet-3colrow">
                    ${getMAConfigOptionList(20)}
                </div>
                <h2 style="text-align: center;">Other</h2>
                <div class="sheet-checklist sheet-2colrow">
                    <div class="sheet-checklist sheet-col">
                        ${getConfigOptionLabel('evocation', 'Evocation', "font-style: italic; color: #00e7ff;")}
                    </div>
                    <div class="sheet-checklist sheet-col">
                        ${getConfigOptionLabel('old', 'other')}
                    </div>
                </div>
                <h1><span>Mote Pool Equations</span></h1>
                <div class="flex-wrap mote-pool-eq">
                    <label>Max Personal Motes<input type="text" name="attr_personal-equation" value="@{essence} * 3 + 10 - @{committedessperso}"><span> </span></label>
                    <label>Max Peripheral Motes<input type="text" name="attr_peripheral-equation" value="@{essence} * 7 + 26 - @{committedesstotal}"><span></span></label>
                </div>
                <h1 class="def-exc-cost"><span>Defense Excellency Cost Multiplier</span></h1>
                <div class="flex-wrap def-exc-cost">
                    <label>Multiplier<input type="number" name="attr_def-exc-cost-multiplier" min=1 title="@{def-exc-cost-multiplier}"><span> </span></label>
                </div>
            </div>

            <!-- 5 ROLLS PAGE -->\n`;

function getRessourceLine(p = 0, rollpenIncluded = true) {
    let ret = /*html*/`<div class="ressource-line flex-wrap">
${pad(p)}    <p class="will-color rounded-box grow-max flex" title="@{willpower} & @{willpower_max}">
${pad(p)}        <label class="grow-normal">Willpower:<input type="number" name="attr_willpower" value="5" min="0" max="15" class="grow-normal"></label>/<input type="number" name="attr_willpower_max" readonly="readonly" tabindex="-1">
${pad(p)}    </p>
${pad(p)}    <input type="hidden" name="attr_personal-equation" class="personal-mote-val">
${pad(p)}    <input type="hidden" name="attr_peripheral-equation" class="peripheral-mote-val">
${pad(p)}    <div class="flex grow-max personal-mote-toggle">
${pad(p)}        <p class="mote-color rounded-box grow-normal flex"><!-- Remove readonly & after in the next line to have manual mote edition -->
${pad(p)}            Personal:<button type="roll" class="btn gm-only add-mote" value="!cmaster --moteAdd,qty:?{How many ?|5},perso:1,setTo:@{character_id}">+</button><input type="number" name="attr_personal-essence" class="grow-normal" readonly tabindex="-1" title="@{personal-essence}">/<input type="number" name="attr_personal-essence_max" value="@{personal-equation}" disabled="disabled" data-formula="@{personal-equation}" title="@{personal-essence_max}">
${pad(p)}        </p>
${pad(p)}        <p class="commited-mote-color rounded-box flex personal-mote-toggle" title="Personal motes Commited">
${pad(p)}            <label>Com.:<input type="number" name="attr_committedessperso" class="grow-normal free-commit"><input type="number" name="attr_committedessperso" class="grow-normal commit-system" readonly tabindex="-1" title="@{committedessperso}${TITLE_BR}Personal Commited"></label>
${pad(p)}        </p>
${pad(p)}    </div>
${pad(p)}    <div class="flex grow-max peripheral-mote-toggle">
${pad(p)}        <p class="mote-color rounded-box grow-normal flex"><!-- Remove readonly & after in the next line to have manual mote edition -->
${pad(p)}            Peripheral:<button type="roll" class="btn gm-only add-mote" value="!cmaster --moteAdd,qty:?{How many ?|5},perso:0,setTo:@{character_id}">+</button><input type="number" name="attr_peripheral-essence" class="grow-normal" readonly tabindex="-1" title="@{peripheral-essence}">/<input type="number" name="attr_peripheral-essence_max" value="@{peripheral-equation}" disabled="disabled" data-formula="@{peripheral-equation}" title="@{peripheral-essence_max}">
${pad(p)}        </p>
${pad(p)}        <p class="commited-mote-color rounded-box" title="Peripheral motes Commited">
${pad(p)}            <label>Com.:<input type="number" name="attr_committedesstotal" class="grow-normal free-commit"><input type="number" name="attr_committedesstotal" class="grow-normal commit-system" readonly tabindex="-1" title="@{committedesstotal}${TITLE_BR}Peripheral Commited"></label>
${pad(p)}        </p>
${pad(p)}    </div>`;
    if (rollpenIncluded) ret += /*html*/`
${pad(p)}    <div class="flex grow-normal rollpen-box">
${pad(p)}        <p class="flex grow-normal rounded-box">
${pad(p)}            RollPen:
${pad(p)}            <input id="rollpen-input-widget" type="number" value="0" title="@{roll-penalty}${TITLE_BR}Roll penalty" name="attr_rollpenalty-input" class="rollpenalty-input grow-normal">
${pad(p)}        </p>
${pad(p)}    </div>`;
    ret += /*html*/`
${pad(p)}</div>`;
    return ret;
}

function getReminderCell(p, spanStr, attr, baseTitle = attr[0] + attr.substring(1)) {
    return /*html*/`<div class="reminder-cell" title="${baseTitle}">
${pad(p)}    <span>${spanStr}</span>
${pad(p)}    <input type="number" class="reminder-val" name="attr_${attr}" readonly tabindex="-1" title="@{${attr}}">
${pad(p)}</div>`;
}

function getReminderCellsFromArray(p, array) {
    let ret = '', i = 0;
    for (const item of array) {
        if (typeof item === 'string') {
            ret += /*html*/`${getReminderCell(p, item.substring(0, 3), item.toLowerCase(), item)}`;
            if (i != array.length - 1) ret += brPad(p);
        }
        i++;
    }
    return ret;
}

function getReminderCellsFromHash(p, hash) {
    const hashArray = Object.entries(hash), len = hashArray.length;
    let ret = '', i = 0;
    for (const [k,v] of hashArray) {
        ret += /*html*/`${getReminderCell(p, v.short, k.substring(2, k.length - 1), v.full)}`;
        if (i++ != len - 1) ret += brPad(p);
    }
    return ret;
}

function getRemindersAttr(p = 0) {
    let ret = /*html*/`<input type="hidden" class="qc-panel-check" name="attr_qc">
${pad(p)}<div class="sheet-box-reminder sheet-attr-reminder qc-toggle-display">
${pad(p)}    <input type="checkbox" class="sheet-unnamed-toggle"><span title="Show Attr" class="sheet-layer6"></span>
${pad(p)}    <div class="sheet-layer5">
${pad(p)}        ${getReminderCellsFromArray(p+8, attributes)}
${pad(p)}    </div>
${pad(p)}</div>`;
    return ret;
}

function getRemindersCharms(p = 0) {
    const getHiddenInput = (attr) => /*html*/`<input type="hidden" name="attr_charm-${attr}" class="check-charm-${attr}">`;
    const getHiddenOption = (attr, val) => /*html*/`<option class="reminder-charm opt-charm-${attr}" value="${val}">${val.replace(' Style', '')}</option>`;
    const getBlockFromArray = (array, addedPadding, fx) => {
        let ret = '', i = 0;
        for (const item of array) {
            ret += fx(item);
            if (i++ != array.length - 1) ret += `${brPad(p+addedPadding)}`;
        }
        return ret;
    };
    let ret = /*html*/`<div class="sheet-box-reminder sheet-charm-reminder">
${pad(p)}    <input type="checkbox" class="sheet-unnamed-toggle"><span title="Show Charms" class="sheet-layer5"></span>
${pad(p)}    <div class="sheet-layer4">
${pad(p)}        ${getBlockFromArray([...solarCharmArray, ...lunarCharmArray, ...maCharmArray], 8, item => getHiddenInput(item.replace('charms-', '')))}
${pad(p)}        <input type="hidden" name="attr_charm-evocation" class="check-charm-evocations">
${pad(p)}        <input type="hidden" name="attr_charm-old" class="check-charm">
${pad(p)}        <select name="attr_charm_sheet" style="flex-grow: 42000;">
${pad(p)}            <option>--- SELECT ONE ---</option>
${pad(p)}            ${getBlockFromArray([...solarCharmArray, ...lunarCharmArray, ...maCharmArray], 12, item => getHiddenOption(item.replace('charms-', ''), hashCharmName[item]))}
${pad(p)}            <option class="reminder-charm opt-charm-evocations" value="Evocation">Evocation</option>
${pad(p)}            <option class="reminder-charm opt-charm" value="Other">Other</option>
${pad(p)}        </select>
${pad(p)}        <div class="toggle-commit-list">
${pad(p)}            <input type="checkbox" class="sheet-unnamed-toggle" name="attr_commit-list-shown" value="1"><span title="Show Commits" class="sheet-layer6"></span>
${pad(p)}        </div>
${pad(p)}        <hr />
${pad(p)}        <div class="reminder-charms-main-div">
${pad(p)}            <input type="hidden" name="attr_charm_sheet" class="reminder-charm-selector-input" />
${pad(p)}            <fieldset class="repeating_charms-all" style="display: none;">
${pad(p)}                <input type="hidden" name="attr_isEvoc" class="sheet-tab-charms-inside-check">
${pad(p)}                <input type="hidden" name="attr_charm-aspect">
${pad(p)}                <input type="hidden" name="attr_charm-balanced">
${pad(p)}                <div class="db-aspect-quickshow">
${pad(p)}                    <input type="hidden" name="attr_charm-can-cycle-aspects" value="0">
${pad(p)}                    <button type="action" name="act_change-aspect" class="quick-change-aspect" title="Change Aspect"></button>
${pad(p)}                    <img class="aspect" />
${pad(p)}                    <img class="balanced" src="https://s3.amazonaws.com/files.d20.io/images/290329500/ecMmiM8rUcJ-ziYHX9d18w/max.png?1655517656" title="Balanced"/>
${pad(p)}                </div>
${pad(p)}                <input type="hidden" name="attr_charm-learnt" class="charm-learnt-check" value="1">
${pad(p)}                <input type="text" name="attr_charm-name" class="sheet-tab-charms-name-check" readonly tabindex="-1">
${pad(p)}                <input type="hidden" name="attr_charm-buttons-isextended" class="charm-buttons-include-check" value="0">
${pad(p)}                <input type="hidden" name="attr_rep-cost-macro">
${pad(p)}                <input type="hidden" name="attr_charm-skill" class="sheet-tab-charms-inside-check">
${pad(p)}                <input type="hidden" name="attr_charm-keywords">
${pad(p)}                <input type="hidden" name="attr_charm-mute">
${pad(p)}                <input type="hidden" name="attr_charm-type">
${pad(p)}                <img class="charm-icon-type"/>
${pad(p)}                <input type="text" name="attr_charm-cost" readonly tabindex="-1">
${pad(p)}                <input type="hidden" name="attr_charm-duration">
${pad(p)}                <input type="hidden" name="attr_charm-description">
${pad(p)}                <input type="hidden" name="attr_charm-effect">
${pad(p)}                <input type="hidden" name="attr_charm-rollexpr">
${pad(p)}                ${generateCastButtons(p+16, charmExpr)}
${pad(p)}                <div class="charm-buttons sheet-grouped-buttons charm-button-learn">
${pad(p)}                    <button type="action" name="act_learn-charm" class="sheet-roll btn ui-draggable" title="Learn !">Learn !</button>
${pad(p)}                </div>
${pad(p)}                <input type="text" name="attr_charm-short-desc" readonly tabindex="-1">
${pad(p)}            </fieldset>
${pad(p)}        </div>
${pad(p)}        <div class="reminder-charms-commited-div">
${pad(p)}            <fieldset class="repeating_commited-list" style="display: none;">
${pad(p)}                <input type="hidden" name="attr_commited-state" value="0">
${pad(p)}                <input type="hidden" name="attr_commited-pool-type" value="1">
${pad(p)}                <div class="inner-div">
${pad(p)}                    <input type="text" name="attr_commited-name" placeholder="Excellent Solar Larceny">
${pad(p)}                    <label>Personal<input type="text" name="attr_commited-cost-perso" value="0"></label>
${pad(p)}                    <label>Peripheral<input type="text" name="attr_commited-cost-peri" value="0"></label>
${pad(p)}                    <label>Commited<input type="checkbox" name="attr_commited-state" value="1"></label>
${pad(p)}                </div>
${pad(p)}            </fieldset>
${pad(p)}        </div>
${pad(p)}    </div>
${pad(p)}</div>`;
    return ret;
}

function getRemindersAbi(p = 0, includeHiddenQc = true) {
    let ret = '';
    if (includeHiddenQc) ret += /*html*/`<input type="hidden" class="qc-panel-check" name="attr_qc">${brPad(p)}`;
    ret += /*html*/`<div class="sheet-box-reminder sheet-abi-reminder qc-toggle-display">
${pad(p)}    <input type="checkbox" class="sheet-unnamed-toggle"><span title="Show Abi" class="sheet-layer7"></span>
${pad(p)}    <div class="sheet-layer6">
${pad(p)}        <div class="main-abi">
${pad(p)}            ${getReminderCellsFromArray(p+12, filteredAbilities)}
${pad(p)}        </div>
${pad(p)}        <input type="hidden" class="rep-enabled-check" name="attr_rep-abi-enabled" />
${pad(p)}        <div class="rep-toggle">
${pad(p)}            <hr />
${pad(p)}            <fieldset class="repeating_abilities" style="display: none;">
${pad(p)}                <div class="reminder-cell">
${pad(p)}                    <input type="text" name="attr_repabilityname" readonly tabindex="-1">
${pad(p)}                    <input type="number" class="reminder-val" name="attr_repability" readonly tabindex="-1">
${pad(p)}                </div>
${pad(p)}            </fieldset>
${pad(p)}        </div>
${pad(p)}        <h1><span>Specialties</span></h1>
${pad(p)}        <fieldset class="repeating_specialty" style="display: none;">
${pad(p)}            <div class="reminder-cell">
${pad(p)}                <input type="text" name="attr_repspecialty" readonly tabindex="-1">
${pad(p)}                <input type="text" class="reminder-val" name="attr_repspecialtyability" readonly tabindex="-1">
${pad(p)}            </div>
${pad(p)}        </fieldset>
${pad(p)}    </div>
${pad(p)}</div>`;
    return ret;
}

function getRemindersCraft(p = 0) {
    let ret = /*html*/`<div class="sheet-box-reminder sheet-craft-reminder qc-toggle-display">
${pad(p)}    <input type="checkbox" class="sheet-unnamed-toggle"><span title="Show Craft" class="sheet-layer6"></span>
${pad(p)}    <div class="sheet-layer5">
${pad(p)}        ${getReminderCellsFromHash(p+8, craftAbilitiesHash)}
${pad(p)}        <input type="hidden" class="rep-enabled-check" name="attr_rep-crafts-enabled" />
${pad(p)}        <div class="rep-toggle">
${pad(p)}            <hr />
${pad(p)}            <fieldset class="repeating_crafts" style="display: none;">
${pad(p)}                <div class="reminder-cell">
${pad(p)}                    <input type="text" name="attr_repcraftsname" readonly tabindex="-1">
${pad(p)}                    <input type="number" class="reminder-val" name="attr_repcrafts" readonly tabindex="-1">
${pad(p)}                </div>
${pad(p)}            </fieldset>
${pad(p)}        </div>
${pad(p)}    </div>
${pad(p)}</div>`;
return ret;
}

const maHashShort = {
    'ma-spsitv': 'SPS',
    'ma-whitereaper': 'WR',
    'ma-ebonshadow': 'ES',
    'ma-silvervoice': 'SVN',
    'ma-righteousdevil': 'RD',
    'ma-blackclaw': 'BC',
    'ma-dreamingpearl': 'DPC',
    'ma-steeldevil': 'SDS',
    'ma-swayinggrass': 'SGD',
    'ma-whiteveil': 'WV'
};
const maAbilitiesHash = {};
for (const ma of maAttrsArray) {
    maAbilitiesHash[`@{${ma}}`] = {full: hashCharmName[`charms-${ma}`]};
    if (Object.keys(maHashShort).includes(ma)) {
        maAbilitiesHash[`@{${ma}}`].short = maHashShort[ma];
    } else {
        maAbilitiesHash[`@{${ma}}`].short = hashCharmName[`charms-${ma}`].substring(0, 3);
    }
}


function getRemindersMA(p = 0) {
    let ret = /*html*/`<div class="sheet-box-reminder sheet-ma-reminder qc-toggle-display">
${pad(p)}    <input type="checkbox" class="sheet-unnamed-toggle"><span title="Show M-A" class="sheet-layer5"></span>
${pad(p)}    <div class="sheet-layer4">
${pad(p)}        ${getReminderCellsFromHash(p+8, maAbilitiesHash)}
${pad(p)}        <input type="hidden" class="rep-enabled-check" name="attr_rep-ma-enabled" />
${pad(p)}        <div class="rep-toggle">
${pad(p)}            <hr />
${pad(p)}            <fieldset class="repeating_martialarts" style="display: none;">
${pad(p)}                <div class="reminder-cell">
${pad(p)}                    <input type="text" name="attr_repmartialartsname" readonly tabindex="-1">
${pad(p)}                    <input type="number" class="reminder-val" name="attr_repmartialarts" readonly tabindex="-1">
${pad(p)}                </div>
${pad(p)}            </fieldset>
${pad(p)}        </div>
${pad(p)}    </div>
${pad(p)}</div>`;
return ret;
}

function getRemindersQC(p = 0) {
    const getReminderQCCell = (spanStr, attr, baseTitle, inputType = 'text', excIncluded = true) => /*html*/`<div class="reminder-cell" title="${baseTitle}">
${pad(p+12)}    <span>${spanStr}</span>
${pad(p+12)}    <span>
${pad(p+12)}        <input type="number" class="reminder-val" name="attr_${attr}" readonly tabindex="-1">
${pad(p+12)}        <input type="${inputType}" class="reminder-val ${!excIncluded ? `not-visible ` : ''}qc-have-exc"${excIncluded ? ` name="attr_${attr}-exc" readonly tabindex="-1"` : ''}>
${pad(p+12)}    </span>
${pad(p+12)}</div>`;
    let ret = /*html*/`<div class="sheet-box-reminder sheet-qcattr-reminder qc-toggle-display-inv">
${pad(p)}    <input type="checkbox" class="sheet-unnamed-toggle"><span title="QCAttrs" class="sheet-layer6"></span>
${pad(p)}    <div class="sheet-layer5">
${pad(p)}        <div class="flex flex-wrap">
${pad(p)}            ${getReminderQCCell('RI','qc-read-intentions', 'Read Intentions')}
${pad(p)}            ${getReminderQCCell('SI','qc-social-influence', 'Social Influence')}
${pad(p)}            ${getReminderQCCell('S/L','qc-stealth-larc', 'Stealth/Larceny')}
${pad(p)}            ${getReminderQCCell('Sen','qc-senses', 'Senses')}
${pad(p)}            ${getReminderQCCell('FoS','qc-fos-pool', 'Feats of Strength')}
${pad(p)}            <hr />
${pad(p)}            ${getReminderQCCell('JB','qc-join-battle', 'Join Battle')}
${pad(p)}            ${getReminderQCCell('Mvt','qc-move', 'Combat Movement')}
${pad(p)}            ${getReminderQCCell('Gra','qc-grapple', 'Grapple')}
${pad(p)}            ${getReminderQCCell('GrC','qc-grapple-control', 'Grapple Control')}
${pad(p)}            <input type="hidden" class="hideous-check" name="attr_qc-hideous" value="0">
${pad(p)}            ${getReminderQCCell('App','appearance', 'Appearance', 'number', false)}
${pad(p)}            <hr />
${pad(p)}        </div>
${pad(p)}        <fieldset class="repeating_qcactions" style="display: none;">
${pad(p)}            <div class="reminder-cell">
${pad(p)}                <input type="text" name="attr_repqcactionname" readonly tabindex="-1">
${pad(p)}                <span>
${pad(p)}                    <input type="number" class="reminder-val" name="attr_repqcactiondice" readonly tabindex="-1">
${pad(p)}                    <input type="text" class="reminder-val qc-have-exc" name="attr_repqcactiondice-exc" readonly tabindex="-1">
${pad(p)}                </span>
${pad(p)}            </div>
${pad(p)}        </fieldset>
${pad(p)}    </div>
${pad(p)}</div>`;
    return ret;
}

const ATTR_STR_ID = 0, ATTR_DEX_ID = 1, ATTR_WITS_ID = 8, ABI_AWARENESS_ID = 2, ABI_BRAWL_ID = 3;
function getAttrOptions(p, includePrompts = false, selected = -1, rawCount = includePrompts ? 11 : 21) {
    let ret =`${returnOptions(p, attributes.map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), selected, 'qc-hide')}${brPad(p)}`;
    if (includePrompts)
        ret +=  /*html*/`<option class="qc-hide" disabled>-------ATTRIBUTES PROMPTS------</option>
${pad(p)}<option value="${buildPrompt('Physical Attribute ?', {...getHashMapFromArray([attributes[0], attributes[1], attributes[2]])})}" class="qc-hide">Physical Prompt</option>
${pad(p)}<option value="${buildPrompt('Social Attribute ?', {...getHashMapFromArray([attributes[3], attributes[4], attributes[5]])})}" class="qc-hide">Social Prompt</option>
${pad(p)}<option value="${buildPrompt('Mental Attribute ?', {...getHashMapFromArray([attributes[6], attributes[7], attributes[8]])})}" class="qc-hide">Mental Prompt</option>
${pad(p)}<option value="${buildPrompt('Full Attribute ?', getHashMapFromArray(attributes))}" class="qc-hide">Full Prompt</option>
${pad(p)}<option value="?{Custom Attribute}[Custom]" class="qc-hide">Simple Prompt</option>${brPad(p)}`;
    ret += /*html*/`<option disabled>-------RAW------</option>
${pad(p)}${returnOptions(p, [...Array(rawCount).keys()].map(i => ({val: i + '[RAW]', label: i})), -1)}`;
    return ret;
}

function getAbiOptions(p, includePrompts = false, selected = -1, rawCount = includePrompts ? 11 : 21) {
    let ret =`${returnOptions(p, filteredAbilities.filter(i => typeof i === 'string').map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), selected, 'qc-hide')}${brPad(p)}`;
    if (includePrompts) {
        ret += /*html*/`<option class="qc-hide" disabled>-------ABILITIES PROMPTS------</option>
${pad(p)}<option value="${buildPrompt('Craft', craftAbilities.subSections, '?{Enter the number of Craft dots&amp;#124;0&amp;#125;[Other-Craft]')}" class="qc-hide">Craft Prompt</option>
${pad(p)}<option value="${buildPrompt('Martial Arts', maAbilities.subSections, '?{Enter the number of M.A. dots of this style&amp;#124;0&amp;#125;[Other-MA]')}" class="qc-hide">Martial Arts Prompt</option>
${pad(p)}<option value="${buildAbilityPrompt(p)}" class="qc-hide">Full Ability Prompt</option>
${pad(p)}<option value="?{Custom Ability}" class="qc-hide">Simple Prompt</option>${brPad(p)}`;
    } else {
        ret += /*html*/`<option class="qc-hide" disabled>------CRAFTS-----</option>
${pad(p)}${returnOptions(p, Object.entries(craftAbilities.subSections).map(([k,v]) => ({val: `${v}[${k}]`, label: k})), -1, 'qc-hide')}
${pad(p)}<option class="qc-hide" disabled>-------M-A------</option>
${pad(p)}${returnOptions(p, Object.entries(maAbilities.subSections).map(([k,v]) => ({val: `${v}[${k}]`, label: k})), -1, 'qc-hide')}${brPad(p)}`;
    }
    ret += /*html*/`<option class="qc-hide" disabled>-------ATTRIBUTES------</option>
${pad(p)}${returnOptions(p, attributes.map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), -1, 'qc-hide')}${brPad(p)}`;
    if (includePrompts) {
    ret += /*html*/`<option class="qc-hide" disabled>-------ATTRIBUTES PROMPTS------</option>
${pad(p)}<option value="${buildPrompt('Physical Attribute 2 ?', {...getHashMapFromArray([attributes[0], attributes[1], attributes[2]])})}" class="qc-hide">Physical Prompt</option>
${pad(p)}<option value="${buildPrompt('Social Attribute 2 ?', {...getHashMapFromArray([attributes[3], attributes[4], attributes[5]])})}" class="qc-hide">Social Prompt</option>
${pad(p)}<option value="${buildPrompt('Mental Attribute 2 ?', {...getHashMapFromArray([attributes[6], attributes[7], attributes[8]])})}" class="qc-hide">Mental Prompt</option>
${pad(p)}<option value="${buildPrompt('Full Attribute 2 ?', getHashMapFromArray(attributes))}" class="qc-hide">Full Attribute Prompt</option>${brPad(p)}`;
    }
    ret += /*html*/`<option disabled>-------RAW------</option>
${pad(p)}${returnOptions(p, [...Array(rawCount).keys()].map(i => ({val: i + '[RAW]', label: i})), -1)}`;
    return ret;
}

const getFinalMacroName = (name) => `@{${name}-final-macro-replaced}`;
function generateDirectRollAndInteractiveRollButtons(p, startName, endName, rollStr, endStr) {
    const replaceEndStr = (gmTest) => `${endStr ? `${endStr.charAt(0) === '\\' ? '' : ' '}${gmTest ? endStr.replace('/r ', '/gr ') : endStr}` : ''}`;
    let ret = ``;
    for (const section of [{baseClass: 'interactive', rollType: 'action', baseName: 'act'},{baseClass: 'companion', rollType: 'roll', baseName: 'roll'}]) {
        ret += /*html*/`<div class="${section.baseClass}-roll">${brPad(p)}`;
        for (const line of [{baseClass: 'default', addedName: 'cast', endVal: '', str: 'Cast'},{baseClass: 'gm', addedName: 'gmcast', endVal: ' -gm', str: 'to GM'}])
            ret += `    ${getDefaultRollButton(line.str, section.rollType, `${line.baseClass}-whisper cost-trigger`, `${section.baseName}_${startName}-${line.addedName}${endName}`, `${rollStr}${line.endVal}${replaceEndStr(line.baseClass === 'gm')}`)}${brPad(p)}`;
        ret += /*html*/`</div>`;
        if (section.baseClass !== 'companion') ret += brPad(p);
    }
    return ret;
}

outHtml += /*html*/`
            <div class="sheet-body sheet-tab-content sheet-tab-rolls-sheet">
                <h1><span>Rolls</span></h1>
                ${getRessourceLine(16, true)}
                <div class="rolls-area">
                    <div class="left-column-rolls">
                        <input type="hidden" name="attr_roll-type-toggler" class="roll-type-check">
                        <div class="sheet-exroll-div">
                            <div class="roll-type-toggler" title="Toggle">
                                <input type="checkbox" name="attr_roll-type-toggler" class="roll-type-check" value="1" title="Toggle"><span class="roll-type-check" title="Toggle"></span>
                            </div>
                            <div class="sheet-reminders">
                                ${getRemindersAttr(32)}
                                ${getRemindersCharms(32)}
                            </div>
                            <input type="hidden" class="qc-panel-check" name="attr_qc">
                            <div class="sheet-exroll-container qc-toggle-display">
                                ${getExRolls(false, 32)}
                            </div>
                            <div class="sheet-exroll-container qc-toggle-display-inv">
                                ${getExRolls(true, 32)}
                            </div>
                            <div class="sheet-reminders">
                                ${getRemindersAbi(32)}
                                ${getRemindersCraft(32)}
                                ${getRemindersMA(32)}
                                ${getRemindersQC(32)}
                            </div>
                        </div>
                        <!-- 5.2 ROLLS WIDGET -->
                        <div class="sheet-rolls-div-widget sheet-rolls-div">
                            <fieldset class="repeating_rolls-widget">
                                <input type="hidden" name="attr_reprolls-separator-mode" class="rolls-separator-check" value="0">
                                <input type="hidden" name="attr_reprolls-pool-starting" class="pool-starting-check" value="1">
                                <input type="hidden" name="attr_roll-penalty" class="roll-penalty-check" value="0">
                                <div class="sheet-rolls">
                                    <input type="hidden" name="attr_reprolls-toggle-edit" class="sheet-rolls-toggle-edit-val" value="0">
                                    <div class="first-line flex-wrap">
                                        <div class="grow-max" style="display: flex; align-items: center;">
                                            <p style="flex-shrink: 0">
                                                <button type="roll" name="roll_rolls-cast-fluff" value="&amp;{template:exalted3e_combatcast} {{name=@{reprolls-name}}} {{description=@{reprolls-desc}}}" class="stealth-btn" title="Cast Name+Desc for Fluff on click">ROLL</button>
                                            </p>
                                            <input type="text" name="attr_reprolls-name" class="sheet-rolls-name" title="Name of Roll">
                                            <div class="desc-toggle" title="Toggle Description">
                                                <input type="checkbox" name="attr_reprolls-toggle-desc" class="sheet-rolls-toggle-desc" value="1">
                                                <span title="&lt;"></span>
                                            </div>
                                        </div>
                                        <div class="flex-wrap grow-normal">
                                            <div class="cost-section grow-normal flex">
                                                <p class="mote-color-down mote-color-border-solid rounded-box grow-double flex caste-have-exc-toggle">
                                                    Motes:
                                                    <span class="rounded-box grow-normal inline-flex">
                                                        <span class="rounded-box grow-normal inline-flex mote-color-border-dashed" title="Added Cost as Atome of Essence 1:1">
                                                            +/-<input type="number" name="attr_rep-cost-mote-offset" class="sheet-cost-mote grow-normal mote-hint mote-hint-one inverted-color" value="0">
                                                        </span>
                                                        <span class="rounded-box grow-normal inline-flex mote-total" title="Total Cost as Atome of Essence">
                                                            <input type="hidden" name="attr_rep-cost-total-taint" class="sheet-cost-mote-total-taint">
                                                            =<input type="number" name="attr_rep-cost-total" class="sheet-cost-mote sheet-cost-mote-total grow-normal mote-hint" readonly>
                                                        </span>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex roll-section">
                                        <div class="inner-section">
                                            <div class="flex grow-normal dice-area inverted-color">
                                                <div class="flex flex-wrap grow-normal dice-area-details">
                                                    <div class="flex grow-normal basis-100">
                                                        <select name="attr_reprolls-attr" title="Attribute for the Roll" class="grow-normal solar-hint lunar-hint architect-hint hearteater-hint umbral-hint">
                                                            ${getAttrOptions(60)}
                                                        </select>+
                                                        <select name="attr_reprolls-abi" title="Ability for the Roll" class="grow-normal solar-hint db-hint liminal-hint dreamsouled-hint">
                                                            ${getAbiOptions(60)}
                                                        </select>+
                                                    </div>
                                                    <div class="flex grow-normal basis-100">
                                                        <div class="inline-flex grow-normal">
                                                            <input type="hidden" name="attr_reprolls-stunt-dices" class="stunt-dices-check" value="0">
                                                            <select name="attr_reprolls-stunt-dices" class="sheet-rolls-stunt-dices grow-normal" title="Bonus dices for the Roll awarded by the Stunt">
                                                                ${returnOptions(64, [{val: 0, label: '(0) Std Stunt'},{val: 2, label: '(2) Stunt 1+'}])}
                                                            </select>+
                                                            <span class="specialty-box db-hint puppeteer-hint">
                                                                <input type="checkbox" name="attr_reprolls-specialty" class="sheet-rolls-specialty" title="Toggle Specialty" value="1">
                                                                <span class="sheet-spelleffect" title="Spe"></span>
                                                            </span>+
                                                        </div>
                                                        <div class="inline-flex grow-normal excellency-box reset-hint" title="Excellency Box">
                                                            <input type="number" name="attr_reprolls-ycharm-dices" class="sheet-rolls-ycharm-dices grow-normal mote-hint mote-hint-one" title="Charm dices for the Roll${TITLE_BR}Cost motes of Essence 1:1" value="0" placeholder="5" min="0">+
                                                            <input type="number" name="attr_reprolls-ycharm-paid-dices" class="sheet-rolls-ycharm-dices grow-normal" title="Charm dices for the Roll${TITLE_BR}Cost already paid" value="0" placeholder="0" min="0">+
                                                        </div>
                                                        <div class="inline-flex grow-normal">
                                                            <input type="number" name="attr_reprolls-ncharm-dices" class="sheet-rolls-ncharm-dices grow-normal" title="Non Charm dices for the Roll${TITLE_BR}Doesn't cost motes of Essence" value="0" placeholder="0">-
                                                            <label for="rollpen-input-widget"><span name="attr_roll-penalty" title="Roll penalty, applied to attacks & all standard rolls, not to damage ones." class="rollpenalty not-inverted"></span></label>-
                                                            <input type="number" name="attr_woundpenalty2" title="Wound penalty, applied to attacks & all standard rolls, not to damage ones." class="woundpenalty not-inverted" readonly>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex dice-area-total">
                                                    <span class="separator-box-mode">
                                                        <input type="checkbox" name="attr_reprolls-separator-mode" class="sheet-rolls-separator-hidden-checkbox" title="Toggle Separator Mode" value="1">
                                                        <span class="sheet-spelleffect" title="Toggle"></span>
                                                    </span>
                                                    =<input type="number" name="attr_reprolls-dice-total-calc" class="dice-total" readonly>D
                                                </div>
                                            </div>
                                            <div class="flex grow-normal success-area">
                                                <div class="flex grow-normal success-area-details">
                                                    <div class="inline-flex grow-normal">
                                                        <input type="hidden" name="attr_reprolls-willpower-toggle" class="willpower-toggle-check" value="0">
                                                        <select name="attr_reprolls-willpower-toggle" class="sheet-rolls-wp-toggle grow-normal" title="Include a Success using 1 Willpower">
                                                            ${returnOptions(60, [{val: 0, label: '(0) No'},{val: 1, label: '(1) Yes'}])}
                                                        </select>+
                                                    </div>
                                                    <div class="inline-flex grow-normal excellency-box reset-hint" title="Excellency Box">
                                                        <input type="number" name="attr_reprolls-ycharm-successes" class="sheet-rolls-ycharm-successes grow-normal mote-hint mote-hint-two inverted-color" title="Charm successes for the roll${TITLE_BR}Cost motes of Essence 2:1 success" value="0" placeholder="1" min="0">+
                                                        <input type="number" name="attr_reprolls-ycharm-paid-successes" class="sheet-rolls-ycharm-successes grow-normal" title="Charm successes for the roll${TITLE_BR}Cost already paid" value="0" placeholder="1" min="0">+
                                                    </div>
                                                    <div class="inline-flex grow-normal">
                                                        <input type="number" name="attr_reprolls-ncharm-successes" class="sheet-rolls-ncharm-successes grow-normal" title="Non Charm successes for the roll${TITLE_BR}Doesn't cost motes of Essence" value="0" placeholder="0" min="0">
                                                    </div>
                                                </div>
                                                <div class="flex success-area-total">
                                                    =<input type="number" name="attr_reprolls-successes-total-calc" class="success-total" readonly>S
                                                </div>
                                            </div>
                                            <div class="flex grow-normal">
                                                <select name="attr_reprolls-pool-starting" class="sheet-rolls-pool-starting" title="Bonus dices for the Roll awarded by the Stunt">
                                                    ${returnOptions(52, [{val: 1, label: 'Peripheral'},{val: 0, label: 'Personal'}])}
                                                </select>
                                                <input type="text" name="attr_reprolls-final-macro-options" class="sheet-rolls-macro-options grow-normal" title="Macro options for the Roll. Type '!exr -help' in chat to learn more" placeholder="-d 8,9 -R 1 -rl2 2,3">
                                                <input type="hidden" name="attr_reprolls-final-macro-replaced" class="sheet-rolls-final-macro-replaced">
                                                <input type="hidden" name="attr_rep-cost-macro">
                                                <div class="sheet-grouped-buttons end interactive-roll" title="Cast Custom Roll">
                                                    ${generateDirectRollAndInteractiveRollButtons(52, 'roll-widget', '', `!exr ${getFinalMacroName('reprolls')}`, '@{rep-cost-macro}')}
                                                </div>
                                            </div>
                                        </div>`;

function getExcellencyCap(p, sectionName, totalTitleEnd, appendTopFx, appendBeforeTotalFx) {
    let ret = `<div class="${sectionName}-type-excellency">\n`;
    ret += `${pad(p+4)}<button type="action" name="act_reset-roll-cap" class="stealth-btn" title="Reset Dice and Successes invested in Dice Cap"><img class="caste-img"></button>\n`;
    ret += `${pad(p+4)}CAP\n`;
    if (appendTopFx)
        ret += `${pad(p+4)}${appendTopFx(p+4)}\n`;
    ret += /*html*/`${pad(p+4)}<input type="hidden" name="attr_reprolls-exc-${sectionName}-diff-sign-calc" class="excellency-cap-sign" readonly>
${pad(p+4)}<input type="number" name="attr_reprolls-exc-${sectionName}-sum-calc" class="exc-sum" title="Actual use of Excellency Cap" readonly tabindex="-1">
${pad(p+4)}<hr />\n`;
    if (appendBeforeTotalFx)
        ret += `${pad(p+4)}${appendBeforeTotalFx(p+4)}\n`;
    ret += /*html*/`${pad(p+4)}<input type="number" name="attr_reprolls-exc-${sectionName}-total-calc" class="exc-total" readonly title="Total limit of Excellency Cap${TITLE_BR}${totalTitleEnd}" tabindex="-1">\n`;
    ret += `${pad(p)}</div>`;
    return ret;
}

const makeSelectTop = (p, attr, title, addedClass, arrayOptions, arraySelected, hintClass, resetHint) => /*html*/`<select name="attr_reprolls-${attr}" title="${title}" class="${addedClass} grow-normal${hintClass ? ` ${hintClass}` : ''}${resetHint ? ` reset-hint` : ''}">
${pad(p+4)}${returnOptions(p+4, arrayOptions, arraySelected)}
${pad(p)}</select>`;
const makeCheckboxTop = (p, attr, title, value, hintClass, resetHint) => /*html*/`<div class="scope-here dicecap-checkbox ${attr}-box-mode${hintClass ? ` ${hintClass}` : ''}${resetHint ? ` reset-hint` : ''}">
${pad(p+4)}<input type="checkbox" name="attr_reprolls-${attr}" class="sheet-rolls-${attr}-checkbox" title="${title}" value="${value}">
${pad(p+4)}<span class="sheet-spelleffect" title="Toggle"></span>
${pad(p)}</div>`;
const getLunarTop = (p) => makeSelectTop(p, 'attr-lunar-exc', '2nd Attribute for the Excellency', 'lunar-attr-excellency', [{val: '0', label: '---'}, ...attributes.map(i => ({val: `@{${i.toLowerCase()}}`, label: i.toLowerCase().substr(0, 3)}))], 0, 'lunar-hint', true);
const getLiminalTop = (p) => makeCheckboxTop(p, 'anima-flare', 'Toggle Aura Flare', '@{essence}', 'liminal-hint');
const getArchitectTop = (p) => makeCheckboxTop(p, 'inside-city', 'Toggle Inside City', '@{essence}', 'architect-hint');
const getPuppeteerTop = (p) => makeSelectTop(p, 'attr-puppeteer-exc', 'Type of Action for the Excellency', 'puppeteer-attr-excellency', [{val: '0', label: '---'}, {val: '@{dexterity}', label: 'Phy'}, {val: '@{manipulation}', label: 'Soc'}, {val: '@{wits}', label: 'Men'}], 0, 'puppeteer-hint', true);
const getSovereignTop = (p) => makeSelectTop(p, 'anima-sovereign', 'Anima Level for the Excellency', 'sovereign-anima-excellency', [{val: '0', label: 'Dim'}, {val: '1', label: 'Glo'}, {val: '2', label: 'Bur'}, {val: '3', label: 'Bon'}], 0, 'sovereign-hint');
const getDreamSouledTop = (p) => makeCheckboxTop(p, 'uphold-ideal', 'Toggle Uphold Ideal', '@{essence}', 'dreamsouled-hint', true);
const getHearteaterTop = (p) => makeSelectTop(p, 'intimacy-hearteater', 'Intimacy Level for the Excellency', 'hearteater-anima-excellency', [{val: '0', label: '---'}, {val: '2', label: 'Min'}, {val: '3', label: 'Maj'}, {val: '4', label: 'Def'}], 0, 'hearteater-hint', true);

const getAutoCalcMax = (a, b) => `(((${a} + ${b}) + abs(${a} - ${b})) / 2)`;
const getAutoCalcMin = (a, b) => `(((${a} + ${b}) - abs(${a} - ${b})) / 2)`;

const getSiderealEnd = () => /*html*/`<input type="hidden" name="attr_reprolls-exc-sidereal-total-calc-max" value="${getAutoCalcMax('@{essence}', 3)}" disabled>`;

outHtml += /*html*/`
                                        <div class="excellency-cap-section" title="Limit Detail for the Excellency">
                                            ${getExcellencyCap(44, 'solar', 'Solar=>ATTR+ABI')}
                                            ${getExcellencyCap(44, 'lunar', 'Lunar=>ATTR, +ATTR2 if Stunted accordingly', getLunarTop)}
                                            ${getExcellencyCap(44, 'db', 'DB=>ABI+SPE')}
                                            ${getExcellencyCap(44, 'liminal', 'Liminal=>ABI, +ESSENCE if Anima Flare', getLiminalTop)}
                                            ${getExcellencyCap(44, 'sidereal', 'Sidereal=> Based on ESSENCE, min 3, max 5')}
                                            ${getExcellencyCap(44, 'architect', 'Architect=>ATTR, +ESSENCE if Inside a City', getArchitectTop)}
                                            ${getExcellencyCap(44, 'puppeteer', 'Puppeteer=>[Dex, Manip, Wits](depending on action type)+SPE', getPuppeteerTop)}
                                            ${getExcellencyCap(44, 'sovereign', 'Sovereign=> 4, +ANIMA Level', getSovereignTop)}
                                            ${getExcellencyCap(44, 'dreamsouled', 'Dream-Souled=>ABI, +ESSENCE if Uphold their Ideal', getDreamSouledTop)}
                                            ${getExcellencyCap(44, 'hearteater', 'Hearteater=>ATTR+1, +INTIMACY Level', getHearteaterTop)}
                                            ${getExcellencyCap(44, 'umbral', 'Umbral=>ATTR+PENUMBRA(Limit)')}
                                        </div>
                                    </div>
                                </div>
                                <input type="hidden" name="attr_reprolls-toggle-desc" class="sheet-rolls-toggle-desc-val" value="0">
                                <textarea name="attr_reprolls-desc" class="rolls-textarea"></textarea>
                                <div class="sheet-rolls-separator">
                                    <input type="text" name="attr_reprolls-name" class="sheet-rolls-name" title="Name of Roll">
                                    <span>
                                        <input type="checkbox" name="attr_reprolls-separator-mode" class="sheet-rolls-separator-hidden-checkbox" title="Toggle Separator Mode" value="1">
                                        <span class="sheet-spelleffect" title="Toggle"></span>
                                    </span>
                                </div>
                            </fieldset>
                        </div>
                        <!-- 5.1 ROLLS CUSTOM (OLD) -->
                        <div class="sheet-rolls-div-custom sheet-rolls-div">
                            <fieldset class="repeating_rolls">
                                <div class="sheet-rolls">
                                    <input type="hidden" name="attr_reprolls-toggle-edit" class="sheet-rolls-toggle-edit-val" value="0">
                                    <div class="first-line flex-wrap">
                                        <div class="grow-normal" style="display: flex; align-items: center;">
                                            <p style="flex-shrink: 0">
                                                <button type="roll" name="roll_rolls-cast-fluff" value="&amp;{template:exalted3e_combatcast} {{name=@{reprolls-name}}} {{description=@{reprolls-desc}}}" class="stealth-btn" title="Cast Name+Desc for Fluff on click">ROLL NAME : </button>
                                            </p>
                                            <input type="text" name="attr_reprolls-name" class="sheet-rolls-name" title="Name of Roll">
                                            <div class="desc-toggle" title="Toggle Description">
                                                <input type="checkbox" name="attr_reprolls-toggle-desc" class="sheet-rolls-toggle-desc" value="1">
                                                <span title="&lt;"></span>
                                            </div>
                                        </div>
                                        <div class="grow-normal flex-wrap hide-on-edit">
                                            <div class="cost-section grow-normal flex">
                                                ${getCostRows(48)}
                                            </div>
                                        </div>
                                    </div>
                                    <input type="hidden" name="attr_reprolls-toggle-desc" class="sheet-rolls-toggle-desc-val" value="0">
                                    <textarea name="attr_reprolls-desc" class="rolls-textarea"></textarea>
                                    <div class="flex roll-section show-on-edit">
                                        <div class="header-section" title="Configurable Roll${TITLE_BR}TOGGLE EDIT MODE ON CLICK">
                                            <div class="edit-toggle">
                                                <input type="checkbox" name="attr_reprolls-toggle-edit" class="sheet-rolls-toggle-edit" value="1">
                                                <span title="Roll:"></span>
                                            </div>
                                        </div>
                                        <div class="inner-section">
                                            <div class="flex grow-normal">
                                                <div class="flex grow-normal">
                                                    (<select name="attr_reprolls-attr" title="Attribute for the Roll" class="grow-normal">
                                                        ${getAttrOptions(56, true)}
                                                    </select>+
                                                    <select name="attr_reprolls-abi" title="Ability for the Roll" class="grow-normal">
                                                        ${getAbiOptions(56, true)}
                                                    </select>
                                                </div>
                                                <div class="flex grow-max">
                                                    <button type="action" name="act_default-macro-d" class="stealth-btn" title="Override/Set additional dice Default Macro">+</button>
                                                    <input type="text" name="attr_reprolls-bonus-dices" class="sheet-rolls-bonus-dices grow-normal" title="Bonus dices for the Roll (Stunt for example, ...)${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations" placeholder="2+?{Added Dices ?|0}">-
                                                    <input type="number" value="@{roll-penalty}" disabled="disabled" title="Roll penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_rollpenalty2" class="rollpenalty" data-formula="@{roll-penalty}">-
                                                    <input type="number" value="@{wound-penalty}" disabled="disabled" title="Wound penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_woundpenalty2" class="woundpenalty" data-formula="@{wound-penalty}">d)
                                                </div>
                                            </div>
                                            <div class="flex grow-normal">
                                                <button type="action" name="act_default-macro-s" class="stealth-btn" title="Override/Set additional success Default Macro">+</button>
                                                <input type="text" name="attr_reprolls-bonus-successes" class="sheet-rolls-bonus-successes grow-normal" title="Bonus successes for the roll (Willpower for example, ...)${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations" placeholder="?{Bonus success ?|0}">s
                                                <input type="hidden" name="attr_reprolls-final-macro-replaced" class="sheet-rolls-final-macro-replaced">
                                                <input type="hidden" name="attr_rep-cost-macro">
                                                <input type="text" name="attr_reprolls-final-macro-options" class="sheet-rolls-macro-options grow-normal" title="Macro options for the Roll. Type '!exr -help' in chat to learn more" placeholder="-d 8,9 -R 1 -rl2 2,3">
                                                <div class="sheet-grouped-buttons end interactive-roll" title="Cast Custom Roll">
                                                    ${generateDirectRollAndInteractiveRollButtons(52, 'roll', '', `!exr ${getFinalMacroName('reprolls')}`, '@{rep-cost-macro}')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex roll-section hide-on-edit">
                                        <div class="header-section" title="Configurable Roll${TITLE_BR}TOGGLE EDIT MODE ON CLICK">
                                            <div class="edit-toggle">
                                                <input type="checkbox" name="attr_reprolls-toggle-edit" class="sheet-rolls-toggle-edit" value="1">
                                                <span title="Roll:"></span>
                                            </div>
                                        </div>
                                        <div class="inner-section flex">
                                            <input type="hidden" name="attr_reprolls-final-macro-replaced">
                                            <input type="hidden" name="attr_rep-cost-macro">
                                            <div class="sheet-grouped-buttons end interactive-roll" title="Cast Custom Roll">
                                                ${generateDirectRollAndInteractiveRollButtons(48, 'roll', '', `!exr ${getFinalMacroName('reprolls')}`, '@{rep-cost-macro}')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div class="right-column-notepads">
                        <div class="rollpad">
                            <textarea name="attr_rollpad" class="rollpad-textarea" placeholder="Infos & Details about charm combos."></textarea>
                        </div>
                        <div class="commandlist">
                            <fieldset class="repeating_roll-commands">
                                <div>
                                    <input class="command-mem" type="text" name="attr_reprolls-cmdname" placeholder="-d 9">
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 6 SOCIAL PAGE -->\n`;

function getSocialHeadline(p = 0, includeExc = false) {
    let ret = /*html*/`<div class="head-line flex flex-wrap">`;
    if (includeExc) ret += /*html*/`
${pad(p+4)}${getRemindersCharms(p+4)}`;
    ret += /*html*/`
${pad(p)}    <div class="flex">
${pad(p)}        <div class="sheet-table-cell sheet-text-right" title="(Wits + Integrity)/2"><span>Resolve</span>:</div>
${pad(p)}        <div class="sheet-table-cell">
${pad(p)}            <input type="hidden" class="qc-panel-check" name="attr_qc">
${pad(p)}            <input type="number" value="(ceil((@{wits} + @{integrity}) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="resolve-without-specialty" title="@{resolve}${TITLE_BR}Resolve without specialty" name="attr_resolve" class="wound-taint"><input type="number" value="(ceil(((@{wits} + @{integrity}) + 1) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="resolve-with-specialty" title="@{resolve-specialty}${TITLE_BR}Resolve with specialty" name="attr_resolve-specialty" class="wound-taint qc-toggle-display last-visible"><input type="text" name="attr_qc-resolve-exc" class="qc-have-exc qc-toggle-display-inv" title="Excellency cap" readonly tabindex="-1">
${pad(p)}        </div>
${pad(p)}    </div>
${pad(p)}    <div class="flex">
${pad(p)}        <div class="sheet-table-cell sheet-text-right" title="(Manipulation + Socialize)/2"><span>Guile</span>:</div>
${pad(p)}        <div class="sheet-table-cell">
${pad(p)}            <input type="hidden" class="qc-panel-check" name="attr_qc">
${pad(p)}            <input type="number" value="(ceil((@{manipulation} + @{socialize}) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="guile-without-specialty" title="@{guile}${TITLE_BR}Guile without specialty" name="attr_guile" class="wound-taint"><input type="number" value="(ceil(((@{manipulation} + @{socialize}) + 1) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="guile-with-specialty" title="@{guile-specialty}${TITLE_BR}Guile with specialty" name="attr_guile-specialty" class="wound-taint qc-toggle-display last-visible"><input type="text" name="attr_qc-guile-exc" class="qc-have-exc qc-toggle-display-inv" title="Excellency cap" readonly tabindex="-1">
${pad(p)}        </div>
${pad(p)}    </div>`;
    if (includeExc)
        ret += `${brPad(p+4)}${getDefExcDiv(p+4)}`;
    ret += /*html*/`
${pad(p)}    <div class="flex">
${pad(p)}        <div class="sheet-table-cell sheet-text-right"><span>Already included wound penalty</span>:</div>
${pad(p)}        <div class="sheet-table-cell">
${pad(p)}            <input type="hidden" class="wound-penalty-check" name="attr_wound-penalty">
${pad(p)}            <input type="number" value="-@{wound-penalty}" disabled="disabled" style="width: 27px ; margin-right: 2px" title="-@{wound-penalty}${TITLE_BR}Wound penalty" name="attr_woundpenalty2" class="woundpenalty-input" data-formula="-@{wound-penalty}">
${pad(p)}        </div>
${pad(p)}    </div>
${pad(p)}</div>`;
    return ret;
}

function getSocialStatCol(p = 0) {
    const getStatBlock = (attr, qcToggle = true) => /*html*/`<div class="sheet-table-row${qcToggle ?' qc-toggle-display' : ''}">
${pad(p)}            <div class="sheet-table-cell"><span>${attr}</span>:</div><div class="sheet-table-cell"><input type="number" name="attr_${attr.toLowerCase()}" style="width: 27px ; margin-right: 3px" title="@{${attr.toLowerCase()}}${TITLE_BR}${attr}" readonly tabindex="-1"></div>
${pad(p)}        </div>`;
    return /*html*/`<div class="sheet-col stat-col">
${pad(p)}    <input type="hidden" class="qc-panel-check" name="attr_qc">
${pad(p)}    <h1><span>Attributes</span></h1>
${pad(p)}    <div class="sheet-table">
${pad(p)}        <input type="hidden" class="qc-panel-check" name="attr_qc">
${pad(p)}        ${getStatBlock('Perception')}
${pad(p)}        ${getStatBlock('Charisma')}
${pad(p)}        ${getStatBlock('Manipulation')}
${pad(p)}        <div class="sheet-table-row qc-toggle-display-inv">
${pad(p)}            <div class="sheet-table-cell flex" style="flex-grow: 1;">
${pad(p)}                <span>S.Inf.</span>:<input type="text" name="attr_qc-social-influence-type" class="sheet-qc-social-influence-type-display grow-normal" readonly tabindex="-1">
${pad(p)}            </div>
${pad(p)}            <div class="sheet-table-cell">
${pad(p)}                <input type="number" name="attr_qc-social-influence" style="width: 27px ; margin-right: 3px" title="QC Social Influence" readonly tabindex="-1">
${pad(p)}            </div>
${pad(p)}        </div>
${pad(p)}        ${getStatBlock('Appearance',false)}
${pad(p)}        ${getStatBlock('Wits')}
${pad(p)}    </div>
${pad(p)}    <h1 class="qc-toggle-display"><span>Abilities</span></h1>
${pad(p)}    <div class="sheet-table qc-toggle-display">
${pad(p)}        ${getStatBlock('Socialize',false)}
${pad(p)}        ${getStatBlock('Survival',false)}
${pad(p)}        ${getStatBlock('Presence',false)}
${pad(p)}        ${getStatBlock('Performance',false)}
${pad(p)}        ${getStatBlock('Integrity',false)}
${pad(p)}    </div>
${pad(p)}</div>`;
}

outHtml += /*html*/`
            <div class="sheet-body sheet-tab-content sheet-tab-intimacies-sheet">
                <h1><span>Social attributes and abilities</span></h1>
                ${getRessourceLine(16, false, true)}
                ${getSocialHeadline(16, true)}
                <div class="sheet-3colrow">
                    ${getSocialStatCol(20)}
                    <div class="sheet-3col inti-col">
                        <h1><span>Intimacies</span></h1>
                        <div class="intimacy-qol-button">
                            <button type="action" name="act_add-default-intimacy-categories" class="btn" title="Add a line for Principles, Ties, Inspire and one sub category for example">Add Usefull Lines</button>
                        </div>
                        <input type="hidden" value="0" name="attr_init-intimacies">
                        <div class="sheet-table" style="table-layout: fixed;">
                            <div class="sheet-table-header">
                                <div class="sheet-table-row">
                                    <div class="sheet-table-cell" style="width: 2.0em; text-align: center;">XP</div>
                                    <div class="sheet-table-cell" style="width: 1em;">Tainted</div>
                                    <div class="sheet-table-cell" style="text-align: center;">Intimacy</div>
                                    <div class="sheet-table-cell" style="width: 6em;">Intensity</div>
                                </div>
                            </div>
                            <fieldset class="repeating_intimacies sheet-table-body" style="display: none;">
                                <input type="hidden" name="attr_intimacyrepeatingtaint" class="intimacy-taint-check" value="0">
                                <input type="hidden" name="attr_intimacyrepeatingxpspent" class="intimacy-xp-check">
                                <input type="hidden" name="attr_intimacyrepeatingtype" class="intimacy-val-check" value="Minor">
                                <div class="sheet-table-cell">
                                    <label><input type="number" name="attr_intimacyrepeatingxpspent" min="1" max="999"><span></span></label>
                                </div>
                                <div class="sheet-table-cell">
                                    <label><input type="checkbox" name="attr_intimacyrepeatingtaint" value="1"><span></span></label>
                                </div>
                                <div class="sheet-table-cell intimacy-taint"><input type="text" name="attr_intimacyrepeatingname" placeholder="Winter Plum (Grief)"></div>
                                <div class="sheet-table-cell intimacy-taint">
                                    <select name="attr_intimacyrepeatingtype" class="sheet-intimacyrepeating" required="">
                                        ${returnOptions(40, [{val: 'none', label: 'None'}, ...['Minor','Major','Defining'].map(i => ({val: i, label: i}))],1)}
                                    </select>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
                <h1><span>Notepad</span></h1>
                <textarea name="attr_social-notepad"></textarea>
            </div>

            <!-- 6.1 ANTI SOCIAL PAGE -->

            <div class="sheet-body sheet-tab-content sheet-tab-antisocial-sheet">
                <h1><span>Social attributes and abilities</span></h1>
                ${getSocialHeadline(16)}
                <div class="sheet-3colrow">
                    ${getSocialStatCol(20)}
                    <div class="sheet-3col inti-col">
                        <h1><span>Intimacies Read</span></h1>
                        <input type="hidden" value="0" name="attr_init-intimacies">
                        <div class="sheet-table" style="table-layout: fixed;">
                            <div class="sheet-table-header">
                                <div class="sheet-table-row">
                                    <div class="sheet-table-cell" style="width: 2.8em;">Mark</div>
                                    <div class="sheet-table-cell">Intimacy</div>
                                    <div class="sheet-table-cell" style="width: 6em;">Intensity</div>
                                </div>
                            </div>
                            <fieldset class="repeating_intimacies-read sheet-table-body" style="display: none;">
                                <input type="hidden" name="attr_intimacyrepeatingtaint" class="intimacy-taint-check" value="0">
                                <input type="hidden" name="attr_intimacyrepeatingtype" class="intimacy-val-check" value="none">
                                <div class="sheet-table-cell">
                                    <label style="margin-left: 0.9em;"><input type="checkbox" name="attr_intimacyrepeatingtaint" value="1"><span></span></label>
                                </div>
                                <div class="sheet-table-cell intimacy-taint"><input type="text" name="attr_intimacyrepeatingname" placeholder="Winter Plum (Grief)"></div>
                                <div class="sheet-table-cell intimacy-taint">
                                    <select name="attr_intimacyrepeatingtype" class="sheet-intimacyrepeating" required="">
                                        ${returnOptions(40, [{val: 'none', label: 'None'}, ...['Minor','Minor+','Major','Major+','Defining'].map(i => ({val: i, label: i}))])}
                                    </select>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
                <h1><span>Notepad</span></h1>
                <textarea name="attr_social-notepad"></textarea>
            </div>

            <!-- 7 COMBAT PAGE -->\n`;

function getCombatDisablePenAndCrippling(p = 0) {
    return /*html*/`<div class="flex flex-wrap flex-col">
${pad(p)}    <div class="crippling-box"><!-- DISABLE BOX -->
${pad(p)}        <input type="checkbox" name="attr_combat-disable-pen" class="sheet-crippling-pen sheet-disable-pen" value="1">
${pad(p)}        <span class="sheet-spelleffect" title="NoPen:"></span>
${pad(p)}    </div>
${pad(p)}    <div class="crippling-box"><!-- CRIPPLING BOX -->
${pad(p)}        <input type="checkbox" name="attr_combat-crippling-pen" class="sheet-crippling-pen" value="1">
${pad(p)}        <span class="sheet-spelleffect" title="Crippling:"></span>
${pad(p)}    </div>
${pad(p)}    <div class="wound-pen"><!-- WOUND PEN -->
${pad(p)}        <input type="hidden" class="wound-penalty-check" name="attr_wound-penalty">
${pad(p)}        <input type="number" value="@{wound-penalty}" disabled="disabled" title="@{wound-penalty}${TITLE_BR}Wound penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_woundpenalty2" class="woundpenalty-input" data-formula="@{wound-penalty}">
${pad(p)}        <input type="number" value="0" title="Wound penalty Additional" name="attr_woundpenalty-add" class="woundpenalty-add-input">
${pad(p)}        <input type="number" value="0" title="@{roll-penalty}${TITLE_BR}Roll penalty" name="attr_rollpenalty-input" class="rollpenalty-input">
${pad(p)}    </div>
${pad(p)}</div>`;
}

outHtml += /*html*/`
            <div class="sheet-body sheet-tab-content sheet-tab-combat-sheet">
                <h1><span>Combat</span></h1>
                <div class="combat-header">
                    <div class="weapon-line"><!-- WEAPONS -->
                        ${getWeaponsLine(24)}
                    </div>
                    <div class="defense-line"><!-- DEFENSES -->
                        ${getDefenseLine(24)}
                    </div>
                    <div class="health-line flex sheet-bg-hide"><!-- HEALTH -->
                        <div class="sheet-health-header sheet-text-center sheet-txt-lg"><strong>HL</strong></div>
                        <div class="sheet-health-track grow-normal"><!-- Health Levels -->
                            ${getHealthLine(28)}
                        </div>
                        ${getCombatDisablePenAndCrippling(24)}
                    </div>
                    <div class="health-line flex sheet-bg-show"><!-- HEALTH BG -->
                        <div class="sheet-health-track grow-normal">
                            <p class="flex grow-normal" title="@{battlegroup-magnitude} & @{battlegroup-magnitude_max}${TITLE_BR}Represent a BG 'health'.">Magnitude:
                                <input type="number" name="attr_battlegroup-magnitude" value="8" class="grow-normal">/
                                <input type="number" name="attr_battlegroup-magnitude_max" readonly="readonly">
                            </p>
                            <p class="flex grow-normal" title="@{battlegroup-size} & @{battlegroup-size_max}">Size:
                                <input type="number" name="attr_battlegroup-size" value="0" class="grow-normal">/
                                <input type="number" name="attr_battlegroup-size_max" value="1">
                            </p>
                        </div>
                        ${getCombatDisablePenAndCrippling(24)}
                    </div>
                    <div class="reminder-line flex-wrap sheet-reminders">
                        ${getRemindersAttr(24)}
                        ${getRemindersCharms(24)}
                        ${getRemindersAbi(24, false)}
                        ${getRemindersCraft(24)}
                        ${getRemindersMA(24)}
                        ${getRemindersQC(24)}
                    </div>
                    ${getRessourceLine(20, false)}
                </div>
                <div class="combat-init">
                    <input type="checkbox" name="attr_combat-init-display" class="sheet-initeffect" value="1"><span class="sheet-spelleffect" title="Show Initiative Rolls"></span>
                    <div class="sheet-init-div">
                        <fieldset class="repeating_combat-init">
                            <div class="sheet-combat-init flex-wrap">
                                <div class="first-line flex-wrap">
                                    <p style="flex-shrink: 0">
                                        <button type="roll" name="roll_init-cast-fluff" value="&amp;{template:exalted3e_combatcast} {{name=@{repinit-name}}} {{description=@{repcombat-desc}}}" class="stealth-btn" title="Cast Name+Desc for Fluff on click">INIT NAME : </button>
                                    </p>
                                    <input type="text" name="attr_repinit-name" class="sheet-atk-name grow-double" title="Name of Initiative roll">
                                    <div class="desc-toggle" title="Toggle Description">
                                        <input type="checkbox" name="attr_combat-toggle-desc" class="sheet-combat-toggle-desc" value="1">
                                        <span class="sheet-combatdesc" title="&lt;"></span>
                                    </div>
                                    <div class="cost-section grow-normal flex" style="display: inline-flex; min-width: 16.7em;">
                                        ${getCostRows(40, false, true)}
                                    </div>
                                </div>
                                <input type="hidden" name="attr_combat-toggle-desc" class="sheet-combat-toggle-desc-val" value="0">
                                <textarea name="attr_repcombat-desc" class="combat-textarea"></textarea>
                                <div class="init-section second-line grow-normal flex">
                                    <div class="flex grow-normal">
                                        (<select name="attr_repinit-attr" title="Attribute for the Roll" class="grow-normal">
                                            ${getAttrOptions(44, true, ATTR_WITS_ID)}
                                        </select>+
                                        <select name="attr_repinit-abi" title="Ability for the Roll" class="grow-normal">
                                            ${getAbiOptions(44, true, ABI_AWARENESS_ID)}
                                        </select>
                                    </div>
                                    <div class="flex grow-max">
                                        <button type="action" name="act_default-macro-d" class="stealth-btn" title="Override/Set additional dice Default Macro">+</button>
                                        <input type="text" name="attr_repinit-bonus-dices" class="sheet-init-bonus-dices grow-normal" title="Bonus dices for the Roll (Stunt for example, ...)${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations" value="${defaultRoll20AddedDicePrompt}">-
                                        <input type="number" value="@{roll-penalty}" disabled="disabled" title="Roll penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_rollpenalty2" class="rollpenalty" data-formula="@{roll-penalty}">-
                                        <input type="number" value="@{wound-penalty}" disabled="disabled" title="Wound penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_woundpenalty2" class="woundpenalty" data-formula="@{wound-penalty}">d)
                                    </div>
                                </div>
                                <div class="init-section third-line grow-normal flex">
                                    <div class="flex grow-max">
                                        <button type="action" name="act_default-macro-s" class="stealth-btn" title="Override/Set additional success Default Macro">+</button>
                                        <input type="text" name="attr_repinit-bonus-successes" class="sheet-init-bonus-successes grow-double" value="${baseInit}${defaultRoll20AddedSuccPrompt}" title="Bonus successes for the roll (Willpower for example, ...)${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations">s
                                        <input type="hidden" name="attr_repinit-final-macro-replaced">
                                        <input type="hidden" name="attr_rep-cost-macro" value="${moteCostBase}${fullWpPrompt}">
                                        <input type="text" name="attr_repinit-final-macro-options" class="sheet-init-macro-options grow-normal" title="Macro options for the Roll. Type '!exr -help' in chat to learn more" placeholder="-d 8,9 -R 1 -rl2 2,3">
                                    </div>
                                    <div class="sheet-grouped-buttons" title="Cast INIT Rolls (Remember to select you token to set INIT correctly)">
                                        ${generateDirectRollAndInteractiveRollButtons(40, 'init', '', `!exr ${getFinalMacroName('repinit')} -turn`, '@{rep-cost-macro}')}
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
                <div class="combat-attacks">
                    <fieldset class="repeating_combat-attack">
                        <div class="sheet-combat-attack">
                            <input type="hidden" name="attr_combat-toggle-edit" class="sheet-combat-toggle-edit-val" value="0">
                            <div class="first-line flex-wrap">
                                <div class="grow-normal" style="display: flex; align-items: center;">
                                    <p style="flex-shrink: 0">
                                        <button type="roll" name="roll_attack-cast-fluff" value="&amp;{template:exalted3e_combatcast} {{name=@{repcombat-name}}} {{description=@{repcombat-desc}}}" class="stealth-btn" title="Cast Name+Desc for Fluff on click">ATTACK NAME : </button>
                                    </p>
                                    <input type="text" name="attr_repcombat-name" class="sheet-atk-name" title="Name of Attack roll">
                                    <div class="desc-toggle" title="Toggle Description">
                                        <input type="checkbox" name="attr_combat-toggle-desc" class="sheet-combat-toggle-desc" value="1">
                                        <span title="&lt;"></span>
                                    </div>
                                </div>
                                <div class="grow-double flex-wrap hide-on-edit">
                                    <div class="cost-section grow-max flex">
                                        ${getCostRows(40)}
                                    </div>
                                    <div class="weapon-section grow-normal flex">
                                        <p class="accu-color rounded-box grow-normal flex">
                                            <label>Acc:<input type="number" name="attr_repcombat-weap-atk" class="sheet-weap-atk grow-normal" value="4" title="Accuracy of the Weapon used${TITLE_BR}Used in Withering Attacks as is (refer to color)${TITLE_BR}Use the withering attack bonus dice field for varying accuracy value"></label>
                                        </p>
                                        <p class="dmg-color rounded-box grow-normal flex">
                                            <label>Dmg:<input type="number" name="attr_repcombat-weap-dmg" class="sheet-weap-dmg grow-normal" value="7" title="Damage of the Weapon used${TITLE_BR}Used in Withering Damage as is (refer to color)${TITLE_BR}Use the withering damage bonus dice field for varying damage value"></label>
                                        </p>
                                        <p class="ovw-color rounded-box grow-normal flex">
                                            <label>Ovw:<input type="number" name="attr_repcombat-weap-ovw" class="sheet-weap-ovw grow-normal" value="1" title="Overwhelming of the Weapon used${TITLE_BR}Used in Withering Damage to set the minimum dice to be rolled in any case${TITLE_BR}Set before each attach if multiple Overwhelming values"></label>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" name="attr_combat-toggle-desc" class="sheet-combat-toggle-desc-val" value="0">
                            <textarea name="attr_repcombat-desc" class="combat-textarea"></textarea>
                            <div class="attack-section withering-section show-on-edit">
                                <div class="header-section" title="An Attack vs An Opponent with mostly narrative damage but build momentum (Initiative)${TITLE_BR}TOGGLE EDIT MODE ON CLICK">
                                    <div class="edit-toggle">
                                        <input type="checkbox" name="attr_combat-toggle-edit" class="sheet-combat-toggle-edit" value="1">
                                        <span title="Withering:"></span>
                                    </div>
                                </div>
                                <div class="inner-section">
                                    <div class="atk-section flex-wrap">
                                        <div class="flex grow-normal">
                                            <div class="flex grow-normal">
                                                <p class="head" title="Trying to Hit an opponent with mostly narrative damage but build momentum (Initiative)">ATK</p>
                                                (<select name="attr_repcombat-watk-attr" title="Attribute for the Roll" class="grow-normal">
                                                    ${getAttrOptions(52, true, ATTR_DEX_ID)}
                                                </select>+
                                                <select name="attr_repcombat-watk-abi" title="Ability for the Roll" class="grow-normal">
                                                    ${getAbiOptions(52, true, ABI_BRAWL_ID)}
                                                </select>+
                                                <input type="number" name="attr_repcombat-weap-atk" class="sheet-weap-atk accu-color" readonly="readonly" title="Accuracy of the Weapon used${TITLE_BR}Auto Filled, edit the field above">
                                            </div>
                                            <div class="flex grow-max">
                                                <button type="action" name="act_default-macro-watk-d" class="stealth-btn" title="Override/Set additional dice Default Macro depending on ability${TITLE_BR}(Special for Archery & Thrown)">+</button>
                                                <input type="text" name="attr_repcombat-watk-bonus-dices" class="sheet-watk-bonus-dices grow-normal" title="Bonus dices for the Roll (Stunt for example, ...)${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations" placeholder="2+?{Added Dices ?|0}">
                                                <p class="sheet-bg-show">+<input type="number" value="@{battlegroup-size}+@{battlegroup-acc-boost}" disabled="disabled" name="attr_total-bg-dice" data-formula="@{battlegroup-size}+@{battlegroup-acc-boost}"></p>
                                                -<input type="number" value="@{roll-penalty}" disabled="disabled" title="Roll penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_rollpenalty2" class="rollpenalty" data-formula="@{roll-penalty}">-
                                                <input type="number" value="@{wound-penalty}" disabled="disabled" title="Wound penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_woundpenalty2" class="woundpenalty" data-formula="@{wound-penalty}">d)
                                            </div>
                                        </div>
                                        <div class="flex grow-normal">
                                            <button type="action" name="act_default-macro-watk-s" class="stealth-btn" title="Override/Set additional success Default Macro">+</button>
                                            <input type="text" name="attr_repcombat-watk-bonus-successes" class="sheet-watk-bonus-successes grow-double" title="Bonus successes for the roll (Willpower for example, ...)${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations" placeholder="?{Bonus success ?|0}">s
                                            <input type="hidden" name="attr_repcombat-watk-final-macro-replaced">
                                            <input type="hidden" name="attr_rep-cost-macro">
                                            <input type="text" name="attr_repcombat-watk-final-macro-options" class="sheet-init-macro-options grow-normal" title="Macro options for the Roll. Type '!exr -help' in chat to learn more" placeholder="-d 8,9 -R 1 -rl2 2,3">
                                            <div class="sheet-grouped-buttons end" title="Cast Withering Attack => Trying to Hit with Accuracy included">
                                                ${generateDirectRollAndInteractiveRollButtons(48, 'cbt-watk', '', `!exr ${getFinalMacroName('repcombat-watk')}`, '@{rep-cost-macro} ==atk==')}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="dmg-section flex-wrap">
                                        <div class="flex grow-normal">
                                            <div class="flex grow-normal">
                                                <p class="head" title="Hit is confirmed => how much momentum (Initiative) you steal to you opponent${TITLE_BR}Add 1 more Initiative to you (so you gain at least 1 initiative)">DMG</p>
                                                (<select name="attr_repcombat-wdmg-attr" title="Attribute for the Roll" class="grow-normal">
                                                    ${getAttrOptions(52, true, ATTR_STR_ID)}
                                                </select>+
                                                <input type="number" name="attr_repcombat-weap-dmg" class="sheet-weap-dmg dark-dmg-color" readonly="readonly" title="Damage of the Weapon used${TITLE_BR}Auto Filled, edit the field above">+
                                            </div>
                                            <div class="flex grow-max">
                                                <input type="text" name="attr_repcombat-wdmg-bonus-dices" class="sheet-wdmg-bonus-dices grow-normal" title="Bonus dices for the Roll (Threshold & Soak already included)${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations">
                                                <p class="sheet-bg-show">+<input type="number" value="@{battlegroup-size}+@{battlegroup-dmg-boost}" disabled="disabled" name="attr_total-bg-dice" data-formula="@{battlegroup-size}+@{battlegroup-dmg-boost}"></p>d)
                                            </div>
                                        </div>
                                        <div class="flex grow-normal">
                                            +
                                            <input type="text" name="attr_repcombat-wdmg-bonus-successes" class="sheet-wdmg-bonus-successes grow-double" title="Bonus successes for the roll${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations">s
                                            <input type="hidden" name="attr_repcombat-wdmg-final-macro-replaced">
                                            <input type="hidden" name="attr_repcombat-weap-ovw" class="sheet-weap-ovw">
                                            <input type="text" name="attr_repcombat-wdmg-final-macro-options" class="sheet-init-macro-options grow-normal" title="Macro options for the Roll. Type '!exr -help' in chat to learn more" placeholder="-d 8,9 -R 1 -rl2 2,3">
                                            <div class="sheet-grouped-buttons end" title="Cast Withering Damage (You will be prompt to select you target for Soak value)">
                                                ${generateDirectRollAndInteractiveRollButtons(48, 'cbt-wdmg', '', `!exr ${getFinalMacroName('repcombat-wdmg')} -NB`)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="attack-section decisive-section show-on-edit">
                                <div class="header-section" title="An Attack vs An Opponent with real damage based on built momentum (Initiative)${TITLE_BR}TOGGLE EDIT MODE ON CLICK">
                                    <div class="edit-toggle">
                                        <input type="checkbox" name="attr_combat-toggle-edit" class="sheet-combat-toggle-edit" value="1">
                                        <span title="Decisive:"></span>
                                    </div>
                                </div>
                                <div class="inner-section">
                                    <div class="atk-section flex-wrap sheet-bg-hide">
                                        <div class="flex grow-normal">
                                            <div class="flex grow-normal">
                                                <p class="head" title="Trying to Hit an opponent with real damage based on built momentum (Initiative)">ATK</p>
                                                (<select name="attr_repcombat-datk-attr" title="Attribute for the Roll" class="grow-normal">
                                                    ${getAttrOptions(52, true, ATTR_DEX_ID)}
                                                </select>+
                                                <select name="attr_repcombat-datk-abi" title="Ability for the Roll" class="grow-normal">
                                                    ${getAbiOptions(52, true, ABI_BRAWL_ID)}
                                                </select>
                                            </div>
                                            <div class="flex grow-max">
                                                <button type="action" name="act_default-macro-datk-d" class="stealth-btn" title="Override/Set additional dice Default Macro">+</button>
                                                <input type="text" name="attr_repcombat-datk-bonus-dices" class="sheet-watk-bonus-dices grow-normal" title="Bonus dices for the Roll (Stunt for example, ...)${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations" placeholder="2+?{Added Dices ?|0}">
                                                <p class="sheet-bg-show">+<input type="number" value="@{battlegroup-size}" disabled="disabled" name="attr_total-bg-dice" data-formula="@{battlegroup-size}"></p>
                                                -<input type="number" value="@{roll-penalty}" disabled="disabled" title="Roll penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_rollpenalty2" class="rollpenalty" data-formula="@{roll-penalty}">-
                                                <input type="number" value="@{wound-penalty}" disabled="disabled" title="Wound penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_woundpenalty2" class="woundpenalty" data-formula="@{wound-penalty}">d)
                                            </div>
                                        </div>
                                        <div class="flex grow-normal">
                                            <button type="action" name="act_default-macro-datk-s" class="stealth-btn" title="Override/Set additional success Default Macro">+</button>
                                            <input type="text" name="attr_repcombat-datk-bonus-successes" class="sheet-watk-bonus-successes grow-double" title="Bonus successes for the roll (Willpower for example, ...)${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations" placeholder="?{Bonus success ?|0}">s
                                            <input type="hidden" name="attr_repcombat-datk-final-macro-replaced">
                                            <input type="hidden" name="attr_rep-cost-macro">
                                            <input type="text" name="attr_repcombat-datk-final-macro-options" class="sheet-init-macro-options grow-normal" title="Macro options for the Roll. Type '!exr -help' in chat to learn more" placeholder="-d 8,9 -R 1 -rl2 2,3">
                                            <div class="sheet-grouped-buttons end" title="Cast Decisive Attack => Trying to Hit">
                                                ${generateDirectRollAndInteractiveRollButtons(48, 'cbt-datk', '', `!exr ${getFinalMacroName('repcombat-datk')}`, '@{rep-cost-macro} ==atk==')}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="dmg-section flex-wrap">
                                        <div class="flex grow-normal">
                                            <button type="action" name="act_default-macro-datk-set-name" class="head stealth-btn" title="Hit is confirmed => how much damage you deal to you opponent as Health Levels or magnitude (for BattleGroups)${TITLE_BR}By default, uses momentum built in combat (Initiative) as damage pool, without 10s rule${TITLE_BR}CLICK to set default token name as character sheet name">DMG</button>
                                            (<input type="text" name="attr_repcombat-ddmg-dices" class="sheet-ddmg-bonus-dices grow-normal" value="@{tracker|YOUR_TOKEN_NAME_HERE}" title="Number of dice to be rolled${TITLE_BR}Already included a macro that target a token initiative value${TITLE_BR}You only need to copy paste the exact token name instead of the placeholder${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations">d)
                                        </div>
                                        <div class="flex-wrap grow-normal">
                                            <input type="hidden" name="attr_repcombat-ddmg-final-macro-replaced">
                                            <div class="flex grow-normal">
                                                +
                                                <input type="text" name="attr_repcombat-ddmg-bonus-successes" class="sheet-ddmg-bonus-successes grow-normal" title="Bonus successes for the roll${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations">s
                                                <input type="text" name="attr_repcombat-ddmg-final-macro-options" class="sheet-init-macro-options grow-normal" value="-D" title="Macro options for the Roll. Type '!exr -help' in chat to learn more${TITLE_BR}Default macro included is no 10 doubled as it's the default rule used for Decisive">
                                            </div>
                                            <div class="flex grow-normal">
                                                <input type="hidden" name="attr_repcombat-ddmg-init-to-set" class="sheet-atk-decisive-init-to-reset-val" value="">
                                                <p class="dark-init-color rounded-box flex grow-normal">
                                                    <label title="Fill this field to reset your initiative, leave blank to not reset${TITLE_BR}Gambits use this blank for example${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations">RESET INIT TO:<input type="text" name="attr_repcombat-ddmg-init-to-set" class="sheet-atk-decisive-init-to-reset grow-normal" placeholder="3" value=""></label>
                                                </p>
                                                <input type="hidden" name="attr_repcombat-ddmg-init-to-set-final-macro-replaced">
                                                <div class="sheet-grouped-buttons end reset-init" title="Reset Initiative (Remember to select you token to set INIT correctly)">
                                                    ${generateDirectRollAndInteractiveRollButtons(52, 'cbt-ddmg', '-rst', `!exr ${getFinalMacroName('repcombat-ddmg')} -NB`, `\\n/r @{repcombat-ddmg-init-to-set-final-macro-replaced} &{tracker}`)}
                                                </div>
                                                <div class="sheet-grouped-buttons end noreset-init" title="Do not Reset Initiative (Gambits Usually)">
                                                    ${generateDirectRollAndInteractiveRollButtons(52, 'cbt-ddmg', '-std', `!exr ${getFinalMacroName('repcombat-ddmg')} -NB`)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex-wrap">
                                <div class="attack-section withering-section hide-on-edit grow-normal">
                                    <div class="header-section" title="An Attack vs An Opponent with mostly narrative damage but build momentum (Initiative)${TITLE_BR}TOGGLE EDIT MODE ON CLICK">
                                        <div class="edit-toggle">
                                            <input type="checkbox" name="attr_combat-toggle-edit" class="sheet-combat-toggle-edit" value="1">
                                            <span title="Withering:"></span>
                                        </div>
                                    </div>
                                    <div class="inner-section">
                                        <div class="atk-section flex">
                                            <p class="head" title="Trying to Hit an opponent with mostly narrative damage but build momentum (Initiative)">ATK</p>
                                            <input type="hidden" name="attr_repcombat-watk-final-macro-replaced">
                                            <input type="hidden" name="attr_rep-cost-macro">
                                            <div class="sheet-grouped-buttons end" title="Cast Withering Attack => Trying to Hit with Accuracy included">
                                                ${generateDirectRollAndInteractiveRollButtons(48, 'cbt-watk', '', `!exr ${getFinalMacroName('repcombat-watk')}`, '@{rep-cost-macro} ==atk==')}
                                            </div>
                                        </div>
                                        <div class="dmg-section flex">
                                            <p class="head" title="Hit is confirmed => how much momentum (Initiative) you steal to you opponent${TITLE_BR}Add 1 more Initiative to you (so you gain at least 1 initiative)">DMG</p>
                                            <input type="hidden" name="attr_repcombat-wdmg-final-macro-replaced">
                                            <div class="sheet-grouped-buttons end" title="Cast Withering Damage (You will be prompt to select you target for Soak value)">
                                                ${generateDirectRollAndInteractiveRollButtons(48, 'cbt-wdmg', '', `!exr ${getFinalMacroName('repcombat-wdmg')} -NB`)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="attack-section decisive-section hide-on-edit grow-max">
                                    <div class="header-section" title="An Attack vs An Opponent with real damage based on built momentum (Initiative)${TITLE_BR}TOGGLE EDIT MODE ON CLICK">
                                        <div class="edit-toggle">
                                            <input type="checkbox" name="attr_combat-toggle-edit" class="sheet-combat-toggle-edit" value="1">
                                            <span title="Decisive:"></span>
                                        </div>
                                    </div>
                                    <div class="inner-section">
                                        <div class="atk-section flex sheet-bg-hide">
                                            <p class="head" title="Trying to Hit an opponent with real damage based on built momentum (Initiative)">ATK</p>
                                            <input type="hidden" name="attr_repcombat-datk-final-macro-replaced">
                                            <input type="hidden" name="attr_rep-cost-macro">
                                            <div class="sheet-grouped-buttons end" title="Cast Decisive Attack => Trying to Hit">
                                                ${generateDirectRollAndInteractiveRollButtons(48, 'cbt-datk', '', `!exr ${getFinalMacroName('repcombat-datk')}`, '@{rep-cost-macro} ==atk==')}
                                            </div>
                                        </div>
                                        <div class="dmg-section flex grow-normal">
                                            <p class="head" title="Hit is confirmed => how much damage you deal to you opponent as Health Levels or magnitude (for BattleGroups)${TITLE_BR}By default, uses momentum built in combat (Initiative) as damage pool, without 10s rule">DMG</p>
                                            <input type="hidden" name="attr_repcombat-ddmg-final-macro-replaced">
                                            <input type="hidden" name="attr_repcombat-ddmg-init-to-set" class="sheet-atk-decisive-init-to-reset-val" value="">
                                            <p class="dark-init-color rounded-box flex grow-normal">
                                                <label title="Fill this field to reset your initiative, leave blank to not reset${TITLE_BR}Gambits use this blank for example${TITLE_BR}You can include roll20 syntax like @{essence} or [[]] for complex configurations">R.INIT:<input type="text" name="attr_repcombat-ddmg-init-to-set" class="sheet-atk-decisive-init-to-reset grow-normal" placeholder="3" value=""></label>
                                            </p>
                                            <input type="hidden" name="attr_repcombat-ddmg-init-to-set-final-macro-replaced">
                                            <div class="sheet-grouped-buttons end reset-init" title="Reset Initiative (Remember to select you token to set INIT correctly)">
                                                ${generateDirectRollAndInteractiveRollButtons(48, 'cbt-ddmg', '-rst', `!exr ${getFinalMacroName('repcombat-ddmg')} -NB`, `\\n/r @{repcombat-ddmg-init-to-set-final-macro-replaced} &{tracker}`)}
                                            </div>
                                            <div class="sheet-grouped-buttons end noreset-init" title="Do not Reset Initiative (Gambits Usually)">
                                                ${generateDirectRollAndInteractiveRollButtons(48, 'cbt-ddmg', '-std', `!exr ${getFinalMacroName('repcombat-ddmg')} -NB`)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </div>
    </div>

    <!-- FOOTER -->

    <div class="sheet-footer">
        <button type="roll" value="/w &quot;@{character_name}&quot; &amp;{template:default} {{name=Ex3 Character Sheet}} {{Version:=2.3}} {{Wiki Article:=[Click for info](https://wiki.roll20.net/Ex3 Character Sheet)}}" class="btn ui-draggable"><span>Version</span> 2.3 – <span>More Information</span></button>
    </div>
</div><!-- /sheet-content -->

<rolltemplate class="sheet-rolltemplate-exalted3e_cast">
    <span class="hidden" title={{aspect}}></span>
    <div class="flex">
        {{#charm-name}}
        <div class="flex-row title-line">
            <div class="flex-cell charm-name" title="Charm Name">
                {{charm-name}}
            </div>
        </div>
        {{/charm-name}}
        {{#spell-name}}
        <div class="flex-row title-line" title={{is-shaping-ritual}}>
            <div class="flex-cell spell-name" title="Spell Name">
                {{spell-name}}
            </div>
        </div>
        {{/spell-name}}
        <div class="flex-row aspect-name-line">
            {{#show-character-name}}
            <div class="flex-cell subheader">
                {{character-name}}
            </div>
            {{/show-character-name}}
            <div class="flex-cell">
                <span title={{balanced}}><img src="https://s3.amazonaws.com/files.d20.io/images/290329500/ecMmiM8rUcJ-ziYHX9d18w/max.png?1655517656" title="Balanced"/></span>
                <span class="aspect"><img title={{aspect}} /></span>
            </div>
        </div>
        <div class="flex-row skill-type-line">
            {{#type}}
            <div class="flex-cell subheader">
                <span title={{mute}}><img title={{type}} /></span>
            </div>
            {{/type}}
            {{#skill}}
            <div class="flex-cell subheader">
                {{skill}}
                <span class="skill shaping-ritual" title={{is-shaping-ritual}}>:&nbsp;</span><span class="skill shaping-ritual" title={{is-shaping-ritual}}>Shaping Ritual</span>
            </div>
            {{/skill}}
        </div>
        {{#keywords}}
        <div class="flex-row keyword-line" title={{is-shaping-ritual}}>
            <div class="flex-cell subheader flex hide-on-sr" style="padding-top: 0px;" title={{keywords}}>
                Keywords (Hover)
            </div>
            <div class="flex-cell subheader flex show-on-sr" style="padding-top: 0px;" title="Origin">
                {{keywords}}
            </div>
        </div>
        {{/keywords}}
        <div class="flex-row final-line hide-on-sr" title={{is-shaping-ritual}}>
            {{#circle}}
            <div class="flex-cell info"><div>
                <span>Circle : </span>{{circle}}
            </div></div>
            {{/circle}}
            <div class="flex-cell info hide-on-sr"><div>
                <span>Cost : </span>{{cost}}
            </div></div>
            <div class="flex-cell info hide-on-sr"><div>
                <span>Duration : </span>{{duration}}
            </div></div>
        </div>
        {{#description}}
        <div class="flex-row">
            <div class="flex-cell desc">
                <div>
                    <span style="padding-left: 10px;">Description</span><br>{{description}}
                </div>
            </div>
        </div>
        {{/description}}
        {{#effect}}
        <div class="flex-row">
            <div class="flex-cell effect">
                <div>
                    <span style="padding-left: 10px;">Effect</span><br><span class="effect-data">{{effect}}</span>
                </div>
            </div>
        </div>
        {{/effect}}
    </div>
</rolltemplate>

<rolltemplate class="sheet-rolltemplate-exalted3e_combatcast">
    <table>
        {{#name}}
        <tr>
            <td class="charm-name" colspan="3">
                {{name}}
            </td>
        </tr>
        {{/name}}
        {{#description}}
        <tr>
            <td class="desc" colspan="3">
                <div class="desc">
                    <span style="padding-left: 10px;">Description</span><br>{{description}}
                </div>
            </td>
        </tr>
        {{/description}}
    </table>
</rolltemplate>`;
console.log(outHtml);