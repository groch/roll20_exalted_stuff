var fs = require('fs');

const sheetWorkerStr = fs.readFileSync('sheet_worker.js');

eval(sheetWorkerStr+/*javascript*/`
    function initTAS() {
        TAS = TAS || {debugMode: () => {}, _fn: () => {}};
    };

    function on(triggerTxt, ...args) {}

    // Special variable used in node sheet assembler to produce the full sheet
    var sheetCasteTree = {
        SOLARS: casteTree.Solar,
        ABYSSALS: casteTree.Abyssal,
        'DRAGON BLOODED': casteTree.DB,
        LUNARS: casteTree.Lunar,
        SIDEREALS: casteTree.Sidereal,
        LIMINALS: casteTree.Liminal,
        INFERNALS: casteTree.Infernal,
        ALCHEMICALS: casteTree.Alchemical,
        OTHER: ['Exigent','Getimian','God','God-Blooded','Elemental','Demon','Undead','Mortal','Custom'],
    };

    var attributes = [
        'Strength',
        'Dexterity',
        'Stamina',
        'Charisma',
        'Manipulation',
        'Appearance',
        'Perception',
        'Intelligence',
        'Wits'
    ];
    var craftAbilities = {
        name:'Craft',
        toggleStr:'Show crafts',
        placeholderStr:'Fate',
        shortName:'craft',
        customPrompt:'Enter the number of Craft dots',
        sheetLayer: 6,
        subSections: {
            'Armoring': 'craft-armoring',
            'Artifact': 'craft-artifact',
            'Cooking': 'craft-cooking',
            'First Age Artifice': 'craft-artifice',
            'Gemcutting': 'craft-gemcutting',
            'Geomancy': 'craft-geomancy',
            'Jewelry': 'craft-jewelry',
            'Tailoring': 'craft-tailoring',
            'Weapon Forging': 'craft-forging',
        }
    };
    var maAbilities = {
        name:'Martial Arts',
        toggleStr:'Show styles',
        placeholderStr:'Celestial Monkey Style',
        shortName:'ma',
        customPrompt:'Enter the number of M.A. dots of this style',
        sheetLayer: 4,
        subSections: {
            'Snake Style': 'ma-snake',
            'Tiger Style': 'ma-tiger',
            'Single Point Shining Into The Void Style': 'ma-void',
            'White Reaper Style': 'ma-reaper',
            'Ebon Shadow Style': 'ma-ebon',
            'Crane Style': 'ma-crane',
            'Silver-Voiced Nightingale Style': 'ma-nightingale',
            'Righteous Devil Style': 'ma-devil',
            'Black Claw Style': 'ma-claw',
            'Dreaming Pearl Courtesan Style': 'ma-pearl',
            'Steel Devil Style': 'ma-steel',
        }
    };
    var abilities = [
        'Archery',
        'Athletics',
        'Awareness',
        'Brawl',
        'Bureaucracy',
        craftAbilities,
        'Dodge',
        'Integrity',
        'Investigation',
        'Larceny',
        'Linguistics',
        'Lore',
        maAbilities,
        'Medicine',
        'Melee',
        'Occult',
        'Performance',
        'Presence',
        'Resistance',
        'Ride',
        'Sail',
        'Socialize',
        'Stealth',
        'Survival',
        'Thrown',
        'War',
    ];

    var solarCharmArray = charmSolarRepeatableSectionArray;
    var lunarCharmArray = charmLunarRepeatableSectionArray;
    var maCharmArray = charmMaRepeatableSectionArray;
`);

let outHtml = /*html*/
`<script type="text/worker">\n${sheetWorkerStr}\n</script>\n
<div class="sheet-content">
    <div>
        <input type="hidden" name="attr_token-size" value="1">
        <input type="hidden" name="attr_pain-tolerance" value="0">
        <input class="roll-diceex-check" name="attr_diceex" type="hidden" value="0">
        <input class="roll-succex-check" name="attr_succex" type="hidden" value="0">
        <input name="attr_show-charname-in-charms" type="hidden" value="1">
        <input name="attr_show_character_name" type="hidden">
        <input name="attr_hide-not-learnt-charms-in-reminders" type="hidden">

        <input class="sheet-show-combat-tab" type="hidden" name="attr_combattab" value="1">
        <input class="sheet-show-antisocial-tab" type="hidden" name="attr_antisocialtab" value="0">
        <input checked="checked" class="sheet-tab sheet-tab-character-sheet" name="sheet" title="Character Sheet" type="radio" value="1">
        <input class="sheet-tab sheet-tab-rolls sheet-tab-rolls-sheet" name="sheet" title="Rolls" type="radio" value="9">
        <input class="sheet-tab sheet-tab-intimacies sheet-tab-intimacies-sheet" name="sheet" title="Social" type="radio" value="5">
        <input class="sheet-tab sheet-tab-antisocial sheet-tab-antisocial-sheet" name="sheet" title="Tu perds ton Sang froid !" type="radio" value="7">
        <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet" name="sheet" title="Charms" type="radio" value="2">
        <input class="sheet-tab sheet-tab-spells sheet-tab-spell-sheet" name="sheet" title="Sorceries" type="radio" value="3">
        <input class="sheet-tab sheet-tab-combat sheet-tab-combat-sheet" name="sheet" title="Combat" type="radio" value="6">
        <input class="sheet-tab sheet-tab-settings sheet-tab-settings-sheet" name="sheet" title="y" type="radio" value="4">\n\n`;

for (const charmSection of solarCharmArray) {
    const outStr = charmSection.replace('charms-','charm-').toLowerCase();
    outHtml += `${" ".repeat(8)}<input class="sheet-${outStr}" name="attr_${outStr}" type="hidden" value="0">\n`;
}

outHtml += '\n';
for (const charmSection of lunarCharmArray) {
    const outStr = charmSection.replace('charms-','charm-').toLowerCase();
    outHtml += `${" ".repeat(8)}<input class="sheet-${outStr}" name="attr_${outStr}" type="hidden" value="0">\n`;
}

outHtml += '\n';
for (const charmSection of maCharmArray) {
    const outStr = charmSection.replace('charms-','charm-').toLowerCase();
    outHtml += `${" ".repeat(8)}<input class="sheet-${outStr}" name="attr_${outStr}" type="hidden" value="0">\n`;
}

outHtml += /*html*/`
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

                    <!-- 1.1 Header -->

                    <div class="sheet-col"><!-- 1.1.1 1st column (Name, Player, SELECT Caste) -->
                        <div class="sheet-flexbox-h"><label>Name: <input type="text" name="attr_character_name" placeholder="Karal Fire Orchid"></label></div>
                        <div class="sheet-flexbox-h"><label>Player: <input type="text" name="attr_player-name" placeholder="John Smith"></label></div>
                        <div class="sheet-flexbox-h">
                            <label>Caste/Aspect:
                            <select class="player-caste" name="attr_caste">
                                <option value=""></option>\n`;

for (const sectionHeader of Object.keys(sheetCasteTree)) {
    outHtml += `\n${" ".repeat(32)}<option value="${sectionHeader.toLowerCase()}" disabled>--- ${sectionHeader} ---</option>\n`;
    for (const line of sheetCasteTree[sectionHeader]) {
        outHtml += `${" ".repeat(32)}<option value="${line}"${line === 'Mortal' ? ' selected="selected"' : ''}>${line}</option>\n`;
    }
}

outHtml += /*html*/
`                            </select></label>
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
                                <option value="" selected="selected"></option>\n\n`;

for (const ability of abilities) {
    let abiStr = typeof ability !== 'string' ? ability.name : ability;
    outHtml += `${" ".repeat(32)}<option value="${abiStr}">${abiStr}</option>\n`;
}

outHtml += /*html*/`
                                <option disabled>-------OTHER------</option>
                                <option value="Custom">Custom</option>
                            </select></label>
                        </div>
                    </div>
                </div>

                <!-- 1.2 1st BLOCK = ATTRIBUTES -->

                <h1 class="sheet-attributes"><span>Attributes</span></h1>
                <div class="sheet-attributes sheet-3colrow"><!-- Attributes -->\n`;

function returnDotsRadio(padding, name, checked = 0, count = 10) {
    const getRadio = (name, val, checked) => `<input type="radio" class="sheet-dots${val}" name="${name}" value="${val}"${checked ? ' checked="checked"' : ''}><span></span>`;
    let retStr = '';
    for (let i = 0; i <= count; i++) {
        retStr += getRadio(name, i, i === checked);
        if (i + 1 <= count) retStr += `\n${" ".repeat(padding)}`;
    }
    return retStr;
}

for (const attribute of attributes) {
    outHtml += /*html*/`${" ".repeat(20)}<div class="sheet-trait" title="@{${attribute.toLowerCase()}}">
                        <label>
                            <input type="checkbox" name="attr_${attribute.toLowerCase()}fav" value="1"><span></span>
                            <span>${attribute}</span>
                        </label>
                        <div class="sheet-dots">
                            ${returnDotsRadio(28, `attr_${attribute.toLowerCase()}`, 1)}
                        </div>
                    </div>\n`;
}

outHtml += /*html*/`                </div>

                <!-- 1.3 SPLIT -->

                <div class="sheet-3colrow sheet-centerblock">
                    <div class="sheet-abilities sheet-col"><!-- 1.3.1 LEFT COLUMN -->
                        <h1><span>Abilities</span></h1>\n`;

for (const ability of abilities) {
    if (typeof ability === 'string') {
        outHtml += /*html*/`${" ".repeat(24)}<div class="sheet-trait" title="@{${ability.toLowerCase()}}">
                            <label>
                                <input type="checkbox" name="attr_${ability.toLowerCase()}fav" value="1"><span></span>
                                <span>${ability}</span>
                            </label>
                            <div class="sheet-dots">
                                ${returnDotsRadio(32, `attr_${ability.toLowerCase()}`)}
                            </div>
                        </div>\n`;
    } else {
        let favName = ability.name.replace(' ','').toLowerCase();
        outHtml += /*html*/`${" ".repeat(24)}<div class="sheet-trait">
                            <label>
                                <input type="checkbox" name="attr_${favName}fav" value="1"><span></span>
                                <span>${ability.name}</span>
                            </label>
                            <div class="sheet-dots">
                                <input class="sheet-max-${ability.shortName}-val" name="attr_max-${ability.shortName}" type="hidden" value="0">
                                <input type="checkbox" class="sheet-unnamed-toggle"><span title="${ability.toggleStr}" class="sheet-layer${ability.sheetLayer+1}"></span>
                                <div class="sheet-layer${ability.sheetLayer}">\n`;
        for (const [k,v] of Object.entries(ability.subSections)) {
            outHtml += /*html*/`${" ".repeat(36)}<div class="sheet-trait" title="@{${v}}">
                                        <label>${k}</label>
                                        <div class="sheet-dots">
                                            ${returnDotsRadio(44, `attr_${v}`)}
                                        </div>
                                    </div>\n`;
        }
        let repeatingSectionName = ability.name.replace(' ','').toLowerCase();
        if (repeatingSectionName.charAt(repeatingSectionName.length - 1) !== 's') repeatingSectionName += 's';
        outHtml += /*html*/`${" ".repeat(36)}<fieldset class="repeating_${repeatingSectionName}" style="display: none;">
                                        <div class="sheet-trait">
                                            <input type="text" name="attr_rep${repeatingSectionName}name" placeholder="${ability.placeholderStr}">
                                            <div class="sheet-dots">
                                                ${returnDotsRadio(48, `attr_rep${repeatingSectionName}`)}
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>\n`;
    }
}

outHtml += /*html*/`${" ".repeat(24)}<fieldset class="repeating_abilities" style="display: none;">
                            <div class="sheet-trait">
                                <label>
                                    <input type="checkbox" name="attr_repabilityfav" value="1"><span></span>
                                    <input type="text" name="attr_repabilityname" placeholder="Astrology">
                                </label>
                                <div class="sheet-dots">
                                    ${returnDotsRadio(36, `attr_repability`)}
                                </div>
                            </div>
                        </fieldset>

                        <h1><span>Specialties</span></h1>
                        <fieldset class="repeating_specialty" style="display: none;">
                            <div class="sheet-flexbox-h sheet-flexbox0">
                                <input type="text" name="attr_repspecialty" style="margin-top: 3px" placeholder="Pirate Tactics">
                                <select name="attr_repspecialtyability">
                                    <option value=""></option>\n\n`;

for (const ability of abilities) {
    let abiStr = typeof ability !== 'string' ? ability.name : ability;
    outHtml += `${" ".repeat(40)}<option value="${abiStr}">${abiStr}</option>\n`;
}

outHtml += /*html*/`
                                        <option disabled>-------OTHER------</option>
                                        <option value="Custom">Custom</option>

                                        <option disabled>----ATTRIBUTES---</option>\n`;

for (const attribute of attributes) {
    outHtml += /*html*/`${" ".repeat(40)}<option value="${attribute}">${attribute}</option>\n`;
}

outHtml += /*html*/`
                                </select>
                            </div>
                        </fieldset>\n`;

const attributePrompt = `?{Attribute|${attributes.map(i => `${i} (@{${i.toLowerCase()}}), @{${i.toLowerCase()}}[${i}]`).join('|')}}`;
const abilityPromptBASE = `?{Ability|\n`;
function buildAbilityPrompt(padding = 36) {
    let retStr = `${abilityPromptBASE}`;
    for (const ability of abilities) {
        if (typeof ability === 'string') {
            retStr += `${" ".repeat(padding+4)}${ability} (@{${ability.toLowerCase()}}),@{${ability.toLowerCase()}}[${ability}]|\n`;
        } else {
            retStr += `${" ".repeat(padding+4)}${ability.name} (...),?{${ability.name}&amp;#124;\n`;
            for (const [k, v] of Object.entries(ability.subSections)) {
                retStr += `${" ".repeat(padding+8)}${k} (@{${v}})&amp;#44;@{${v}}[${k}]&amp;#124;\n`;
            }
            const roll20CommentName = ability.shortName.length === 2 ? ability.shortName.toUpperCase() : ability.shortName.charAt(0).toUpperCase() + ability.shortName.slice(1);
            retStr += `${" ".repeat(padding+8)}Other&amp;#44;?{${ability.customPrompt}&amp;amp;#124;0&amp;amp;#125;[Other-${roll20CommentName}]&amp;#125;|\n`;
        }
    }
    retStr += `${" ".repeat(padding+4)}Other,?{Enter the number of dots of this attribute&amp;#124;0&amp;#125;[Other]\n`;
    retStr += `${" ".repeat(padding)}}`;
    return retStr;
}
function buildBigExRollPromptDiceBase(padding = 36) {
    return `${attributePrompt} +${buildAbilityPrompt(padding)} +${defaultRoll20AddedDicePrompt}`;
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

function getExRoll(diceEx, succEx, gm = false, padding = 36) {
    let retStr = `!exr (${buildBigExRollPromptDiceBase(padding)}${diceEx ? ` ${diceExAddedPrompt}` : ''}${bigExRollPromptDiceEnd})#`;
    retStr += `${bigExRollPromptSuccBase}${succEx ? succExAddedPrompt : ''}${bigExRollPromptSuccEnd}${gm ? ' -gm' : ''}`;
    retStr += `\\n!exr ${moteCostBase}${getAllMoteCost(diceEx, succEx)}${fullWpPrompt}`;
    return retStr;
}

function getQCRoll(diceEx, succEx, gm = false) {
    let retStr = `!exr (?{Pool}[QCPool] +${defaultRoll20AddedDicePrompt}${diceEx ? ` ${diceExAddedPrompt}` : ''}${bigExRollPromptDiceEnd})#`;
    retStr += `${bigExRollPromptSuccBase}${succEx ? succExAddedPrompt : ''}${bigExRollPromptSuccEnd}${gm ? ' -gm' : ''}`;
    retStr += `\\n!exr ${moteCostBase}${getAllMoteCost(diceEx, succEx)}${fullWpPrompt}`;
    return retStr;
}

function getExRolls(qc = false, padding = 28) {
    const bonusDiceStr = '+DiceExcellency', bonusSuccStr = '+SuccessExcellency';
    const getTitle = (diceEx, succEx) => `Generic Roll with prompts for ${qc ? 'Pool' : 'Attribute+Ability'}+BonusDices${diceEx ? bonusDiceStr : ''} and BonusSucces${succEx ? bonusSuccStr : ''}, and finally an optionnal Custom Macro`;
    const classArray = ['vanilla','diceex','succex','full'], nameArray = ['','-diceex','-succex','-fullex'];
    const finalName = (i, gm) => `roll_${qc ? 'QCRoll' : 'ExRoll'}${gm ? '-GM' : ''}${nameArray[i]}`;
    const fx = qc ? getQCRoll : getExRoll;
    let retStr = '';
    for (let i = 0; i < 4; i++) {
        const diceEx = i % 2, succEx = Math.floor(i / 2);
        retStr += `<div class="sheet-exroll exroll-${classArray[i]}">\n`;
        retStr += `${" ".repeat(padding+4)}<div class="header-section" title="${getTitle(diceEx, succEx)}">ExRoll</div>\n`;
        retStr += `${" ".repeat(padding+4)}<div class="sheet-grouped-buttons end" title="Cast Generic Roll">\n`;
        retStr += `${" ".repeat(padding+8)}<button type="roll" class="sheet-roll btn ui-draggable default-whisper" name="${finalName(i)}" value="${fx(diceEx, succEx, false, padding+8)}">Cast</button>\n`;
        retStr += `${" ".repeat(padding+8)}<button type="roll" class="sheet-roll btn ui-draggable gm-whisper" name="${finalName(i, true)}" value="${fx(diceEx, succEx, true, padding+8)}">to GM</button>\n`;
        retStr += `${" ".repeat(padding+4)}</div>\n`;
        retStr += `${" ".repeat(padding)}</div>`;
        if (i < 3) retStr += `\n${" ".repeat(padding)}`;
    }
    return retStr;
}

function returnOptions(padding, array, checked = 0) {
    const getOption = (item, selected) => `<option value="${item.val}"${selected ? ' selected' : ''}>${item.label}</option>`;
    let retStr = '';
    let i = 0;
    for (const item of array) {
        retStr += getOption(item, i === checked);
        if (i++ <= array.length - 2) retStr += `\n${" ".repeat(padding)}`;
    }
    return retStr;
}

outHtml += /*html*/`
                        <div class="sheet-rolls-main"><!-- 1.3.1.1 ROLLS LEFT COLUMN -->
                            <h1><span>Quick Roll</span></h1>
                            ${getExRolls()}
                        </div>
                    </div>
                    <div class="sheet-qc-pools sheet-col"><!-- 1.3.2 QUICK CHAR LEFT COLUMN -->
                        <h1><span>Actions</span></h1>
                        <div class="sheet-trait">
                            <span>Read Intentions</span>
                            <span>
                                <input type="number" name="attr_qc-read-intentions" title="Dice Pool">
                                <input type="text" name="attr_qc-read-intentions-exc" class="qc-have-exc" title="Excellency cap">
                            </span>
                        </div>
                        <div class="sheet-trait">
                            <span class="flex">
                                <span>S. Infl. :</span>
                                <input type="text" name="attr_qc-social-influence-type" placeholder="Threaten" class="sheet-qc-soc-influence-type grow-normal" title="Type of Social Influence">
                            </span>
                            <span>
                                <input type="number" name="attr_qc-social-influence" title="Dice Pool">
                                <input type="text" name="attr_qc-social-influence-exc" class="qc-have-exc" title="Excellency cap">
                            </span>
                        </div>
                        <div class="sheet-trait">
                            <span>Stealth/Larceny</span>
                            <span>
                                <input type="number" name="attr_qc-stealth-larc" title="Dice Pool">
                                <input type="text" name="attr_qc-stealth-larc-exc" class="qc-have-exc" title="Excellency cap">
                            </span>
                        </div>
                        <div class="sheet-trait">
                            <span>Senses</span>
                            <span>
                                <input type="number" name="attr_qc-senses" title="Dice Pool">
                                <input type="text" name="attr_qc-senses-exc" class="qc-have-exc" title="Excellency cap">
                            </span>
                        </div>
                        <div class="sheet-trait">
                            <span>Feats of Strength</span>
                            <span>
                                <input type="number" name="attr_strength" title="Strength Cap for FoS">
                                <input type="number" name="attr_qc-fos-pool" title="FoS Dice Pool">
                                <input type="text" name="attr_qc-fos-pool-exc" class="qc-have-exc" title="FoS Excellency cap">
                            </span>
                        </div>
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
                        <div class="sheet-trait">
                            <span>Join Battle</span>
                            <span>
                                <input type="number" name="attr_qc-join-battle" title="Join Battle Dice Pool">
                                <input type="text" name="attr_qc-join-battle-exc" class="qc-have-exc" title="Excellency cap">
                            </span>
                        </div>
                        <div class="sheet-trait">
                            <span>Combat Movement</span>
                            <span>
                                <input type="number" name="attr_qc-move" title="Dice Pool">
                                <input type="text" name="attr_qc-move-exc" class="qc-have-exc" title="Excellency cap">
                            </span>
                        </div>
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
                                    <div class="sheet-battle-group-row" title="@{battlegroup-drill}&#013;&#010;Represent how much training the BG have.&#013;&#010;Give bonus to Defenses">
                                        <span>Drill</span>:
                                        <select name="attr_battlegroup-drill">
                                            ${returnOptions(44, ['Poor', 'Average', 'Elite'].map(i => ({val: i, label: i})), 0)}
                                        </select>
                                    </div>
                                    <div class="sheet-battle-group-row" title="@{battlegroup-might}&#013;&#010;Represent how much supernatural features the BG is composed of.&#013;&#010;Give bonus to Defenses and Attacks&Damage">
                                        <span>Might</span>:
                                        <select name="attr_battlegroup-might">
                                            ${returnOptions(44, [...Array(4).keys()].map(i => ({val: i, label: i})), 0)}
                                        </select>
                                    </div>
                                    <div class="sheet-battle-group-row" title="@{battlegroup-perfect-morale}&#013;&#010;Represent a BG trained to never surrender.&#013;&#010;Give bonus Magnitude & Prevent Rout">
                                        <label>
                                            <input type="checkbox" name="attr_battlegroup-perfect-morale" value="1"><span></span>
                                            <span>Perfect Morale</span>
                                            <span></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="sheet-col">
                                    <div class="sheet-battle-group-row" title="@{battlegroup-magnitude} & @{battlegroup-magnitude_max}&#013;&#010;Represent a BG 'health'.">
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
                                    <div class="sheet-battle-group-row" title="@{battlegroup-health-levels}&#013;&#010;Represent the health levels of a single unit before transforming into a BG.">
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
                                        ${returnDotsRadio(40, `attr_repmerits`)}
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
                        </div>
                        <div><!-- 1.3.3.3 WILLPOWER & ESSENCE & LIMIT AREA; OR QC RIGHT COLUMN -->
                            <input type="hidden" name="attr_showlimit_final" class="show-limit" value="(@{showlimit}+@{qc})" disabled="disabled" data-formula="(@{showlimit}+@{qc})">
                            <div class="sheet-2colrow sheet-resize-to-mortal">
                                <div class="sheet-col"><!-- 1.3.3.3.1 WILLPOWER & ESSENCE -->
                                    <h1><span>Willpower</span></h1>
                                    <div style="padding: 0 6px 6px 6px;" title="@{willpower}&#013;&#010;Actual Willpower">
                                        <input type="number" name="attr_willpower" value="5" min="0" max="15" style="width: 100%;">
                                    </div>
                                    <div style="padding-left: 6px" title="@{willpower_max}&#013;&#010;Max Willpower">
                                        <div class="sheet-dots-full">
                                            ${returnDotsRadio(44, `attr_willpower_max`, 5)}
                                        </div>
                                    </div>
                                    <h1><span>Essence</span></h1>
                                    <div style="padding-left: 6px" title="@{essence}">
                                        <div class="sheet-dots-full">
                                            ${returnDotsRadio(44, `attr_essence`, 1)}
                                        </div>
                                    </div>
                                    <div class="sheet-hide-to-mortal">
                                        <div class="sheet-motes">
                                            <span>Personal<button type="roll" class="btn gm-only add-mote" value="!cmaster --moteAdd,qty:?{How many ?|5},perso:1,setTo:@{character_id}">+</button></span>
                                            <span><!-- Remove readonly & after in the next line to have manual mote edition -->
                                                <input type="number" name="attr_personal-essence" readonly tabindex="-1" title="@{personal-essence}"> /
                                                <input type="number" name="attr_personal-essence_max" value="@{personal-equation}" disabled="disabled" data-formula="@{personal-equation}" title="@{personal-essence_max}"> C:
                                                <input type="number" name="attr_committedessperso" title="@{committedessperso}&#013;&#010;Personal Commited" class="free-commit"><input type="number" name="attr_committedessperso" title="@{committedessperso}&#013;&#010;Personal Commited" class="commit-system" readonly tabindex="-1">
                                            </span>
                                        </div>
                                        <div class="sheet-motes">
                                            <span>Peripheral<button type="roll" class="btn gm-only add-mote" value="!cmaster --moteAdd,qty:?{How many ?|5},perso:0,setTo:@{character_id}">+</button></span>
                                            <span><!-- Remove readonly & after in the next line to have manual mote edition -->
                                                <input type="number" name="attr_peripheral-essence" readonly tabindex="-1" title="@{peripheral-essence}"> /
                                                <input type="number" name="attr_peripheral-essence_max" value="@{peripheral-equation}" disabled="disabled" data-formula="@{peripheral-equation}" title="@{peripheral-essence_max}"> C:
                                                <input type="number" name="attr_committedesstotal" title="@{committedesstotal}&#013;&#010;Peripheral Commited" class="free-commit"><input type="number" name="attr_committedesstotal" title="@{committedesstotal}&#013;&#010;Peripheral Commited" class="commit-system" readonly tabindex="-1">
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="sheet-col"><!-- 1.3.3.3.2 LIMIT BREAK & TRIGGER; OR QC RIGHT COLUMN -->
                                    <!-- 1.3.3.3.2.1 LIMIT BREAK & TRIGGER -->
                                    <div class="limit-box">
                                        <h1 class="sheet-limit"><span>Limit Break</span></h1>
                                        <div class="sheet-limit" style="padding-left: 6px ; margin: 9px 0 9px 0" title="@{limit}">
                                            <div class="sheet-dots-full">
                                                ${returnDotsRadio(48, `attr_limit`)}
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
                                        <div class="sheet-trait">
                                            <span>Resolve</span>
                                            <span>
                                                <input type="number" name="attr_qc-resolve">
                                                <input type="text" name="attr_qc-resolve-exc" class="qc-have-exc" title="Excellency cap">
                                            </span>
                                        </div>
                                        <div class="sheet-trait">
                                            <span>Guile</span>
                                            <span>
                                                <input type="number" name="attr_qc-guile">
                                                <input type="text" name="attr_qc-guile-exc" class="qc-have-exc" title="Excellency cap">
                                            </span>
                                        </div>
                                        <div class="sheet-trait">
                                            <span>Evasion</span>
                                            <span>
                                                <input type="number" name="attr_qc-evasion">
                                                <input type="text" name="attr_qc-evasion-exc" class="qc-have-exc" title="Excellency cap">
                                            </span>
                                        </div>
                                        <div class="sheet-trait">
                                            <span>Parry</span>
                                            <span>
                                                <input type="number" name="attr_qc-parry">
                                                <input type="text" name="attr_qc-parry-exc" class="qc-have-exc" title="Excellency cap">
                                            </span>
                                        </div>
                                        <div class="sheet-trait">
                                            <span>Soak</span>
                                            <span>
                                                <input type="number" name="attr_qc-soak">
                                                <input type="number" class="not-visible qc-have-exc">
                                            </span>
                                        </div>
                                        <div class="sheet-trait">
                                            <span>Hardness</span>
                                            <span>
                                                <input type="number" name="attr_hardness">
                                                <input type="number" class="not-visible qc-have-exc">
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div><!-- 1.3.3.4 EXPERIENCE & CRAFTING -->
                            <h1><span class="sheet-experience">Experience &amp; Crafting</span></h1>
                            <div class="sheet-experience sheet-flexbox-h sheet-flexbox-inline">
                                <label>
                                    <label>
                                        <span>Spent XP:</span>
                                        <input type="number" name="attr_xp">
                                    </label>
                                    <label>
                                        <span>Total XP:</span>
                                        <input type="number" name="attr_xp_max">
                                    </label>
                                </label>
                                <label>
                                    <label>
                                        <span>Spent Role XP:</span>
                                        <input type="number" name="attr_rxp">
                                    </label>
                                    <label>
                                        <span>Total Role XP:</span>
                                        <input type="number" name="attr_rxp_max">
                                    </label>
                                </label>
                            </div>
                            <div class="sheet-experience sheet-2colrow">
                                <div class="sheet-col sheet-flexbox-h">
                                    <label>
                                        <span>Silver XP</span>:
                                        <input type="number" name="attr_silver-xp">
                                    </label>
                                    <label>
                                        <span>Gold XP</span>:
                                        <input type="number" name="attr_gold-xp">
                                    </label>
                                    <label>
                                        <span>White XP</span>:
                                        <input type="number" name="attr_white-xp">
                                    </label>
                                </div>
                                <div class="sheet-crafting-projects sheet-col">
                                    <div class="sheet-flexbox-h sheet-flexbox0">
                                        <input type="text" name="attr_major-project1-name" placeholder="Longsword">
                                        <select disabled="disabled"><option>Major</option></select>
                                    </div>
                                    <div class="sheet-flexbox-h sheet-flexbox0">
                                        <input type="text" name="attr_major-project2-name" placeholder="Longsword">
                                        <select disabled="disabled"><option>Major</option></select>
                                    </div>
                                    <div class="sheet-flexbox-h sheet-flexbox0">
                                        <input type="text" name="attr_major-project3-name" placeholder="Longsword">
                                        <select disabled="disabled"><option>Major</option></select>
                                    </div>
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

function getWeaponsLine(padding = 0) {
    return /*html*/`<div class="sheet-gear sheet-table">
${" ".repeat(padding)}    <input type="hidden" name="attr_wound-penalty" value="-4">
${" ".repeat(padding)}    <div class="sheet-table-header">
${" ".repeat(padding)}        <div class="sheet-table-row">
${" ".repeat(padding)}            <div class="sheet-table-cell" style="width: 25%;">Weapon Name</div>
${" ".repeat(padding)}            <div class="sheet-table-cell" style="width: 2em;" title="Accuracy"><span class="sheet-dotted">Acc</span></div>
${" ".repeat(padding)}            <div class="sheet-table-cell" style="width: 2em;" title="Damage"><span class="sheet-dotted">Dmg</span></div>
${" ".repeat(padding)}            <div class="sheet-table-cell" style="width: 2em;" title="Defense"><span class="sheet-dotted">Def</span></div>
${" ".repeat(padding)}            <div class="sheet-table-cell" style="width: 4em;" title="Ability"><span class="sheet-dotted">Ability</span></div>
${" ".repeat(padding)}            <div class="sheet-table-cell" style="width: 3em;" title="Parry including Defense"><span class="sheet-dotted">Par</span></div>
${" ".repeat(padding)}            <div class="sheet-table-cell" style="width: 3em;" title="Parry with specialty including Defense"><span class="sheet-dotted">ParS</span></div>
${" ".repeat(padding)}            <div class="sheet-table-cell" style="width: 2em;" title="Overwhelming"><span class="sheet-dotted">Over.</span></div>
${" ".repeat(padding)}            <div class="sheet-table-cell" style="width: 2em;" title="Attune"><span class="sheet-dotted">Att.</span></div>
${" ".repeat(padding)}            <div class="sheet-table-cell">Tags</div>
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}    <fieldset class="repeating_weapon sheet-table-body" style="display: none;">
${" ".repeat(padding)}        <div class="sheet-table-cell"><input type="text" name="attr_repweaponname" placeholder="Unarmed"></div>
${" ".repeat(padding)}        <div class="sheet-table-cell"><input type="number" name="attr_repweaponacc" value="4"></div>
${" ".repeat(padding)}        <div class="sheet-table-cell"><input type="number" name="attr_repweapondam" value="7"></div>
${" ".repeat(padding)}        <div class="sheet-table-cell"><input type="number" name="attr_repweapondef" value="0"></div>
${" ".repeat(padding)}        <div class="sheet-table-cell">
${" ".repeat(padding)}            <select name="attr_repweaponabi" class="select-abi">
${" ".repeat(padding)}                <option value="brawl" selected>Brawl</option>
${" ".repeat(padding)}                <option value="melee">Melee</option>
${" ".repeat(padding)}                <option value="snake">Snake Style</option>
${" ".repeat(padding)}                <option value="tiger">Tiger Style</option>
${" ".repeat(padding)}                <option value="void">Single Point Shining Into the Void Style</option>
${" ".repeat(padding)}                <option value="reaper">White Reaper Style</option>
${" ".repeat(padding)}                <option value="ebon">Ebon Shadow Style</option>
${" ".repeat(padding)}                <option value="crane">Crane Style</option>
${" ".repeat(padding)}                <option value="nightingale">Silver-Voiced Nightingale Style</option>
${" ".repeat(padding)}                <option value="devil">Righteous Devil Style</option>
${" ".repeat(padding)}                <option value="claw">Black Claw Style</option>
${" ".repeat(padding)}                <option value="pearl">Dreaming Pearl Courtesan Style</option>
${" ".repeat(padding)}                <option disabled>-------RAW------</option>
${" ".repeat(padding)}                ${returnOptions(padding+16, [...Array(11).keys()].map(i => ({val: i, label: i})), -1)}
${" ".repeat(padding)}                <option disabled>-------SPECIAL------</option>
${" ".repeat(padding)}                <option value="noParry">Can't Parry with this weapon</option>
${" ".repeat(padding)}            </select>
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="sheet-table-cell">
${" ".repeat(padding)}            <input type="hidden" name="attr_onslaught-applied" value="(@{onslaught} * @{apply-onslaught})" class="apply-onslaught-check" disabled>
${" ".repeat(padding)}            <input type="hidden" name="attr_wound-penalty" class="wound-penalty-check" value="@{wound-penalty}" disabled="disabled">
${" ".repeat(padding)}            <input type="number" value="(@{repweaponparry} + @{battlegroup-def-boost} - (@{apply-onslaught} * @{onslaught}) - @{grab-def-penalty} - @{prone-def-penalty} + @{cover-def-bonus} - @{clash-def-penalty})" name="attr_repweaponparryfinal" title="Parry without specialty" disabled="disabled" class="wound-taint onslaught-taint cover-taint grab-taint prone-taint clash-taint">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="sheet-table-cell">
${" ".repeat(padding)}            <input type="hidden" name="attr_onslaught-applied" value="(@{onslaught} * @{apply-onslaught})" class="apply-onslaught-check" disabled>
${" ".repeat(padding)}            <input type="hidden" name="attr_wound-penalty" class="wound-penalty-check" value="@{wound-penalty}" disabled="disabled">
${" ".repeat(padding)}            <input type="number" value="(@{repweaponparryspe} + @{battlegroup-def-boost} - (@{apply-onslaught} * @{onslaught}) - @{grab-def-penalty} - @{prone-def-penalty} + @{cover-def-bonus} - @{clash-def-penalty})" name="attr_repweaponparryspefinal" title="Parry with specialty" disabled="disabled" class="wound-taint onslaught-taint cover-taint grab-taint prone-taint clash-taint">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="sheet-table-cell"><input type="number" name="attr_repweaponov" value="1" min="1"></div>
${" ".repeat(padding)}        <div class="sheet-table-cell"><input type="number" name="attr_repweaponatt" value="0"></div>
${" ".repeat(padding)}        <div class="sheet-table-cell"><input type="text" name="attr_repweapontags" placeholder="Bashing, Brawl, Grappling, Natural"></div>
${" ".repeat(padding)}    </fieldset>
${" ".repeat(padding)}</div>`;
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 1.4 JOINED AGAIN = HEALTH & DEFENSE -->
\n`;

function getDefenseLine(padding = 0) {
    return /*html*/`<div class="sheet-defenses flex-wrap">
${" ".repeat(padding)}    <div class="flex-col">
${" ".repeat(padding)}        <div class="flex grow-normal" style="margin-left: 1em;">
${" ".repeat(padding)}            <span title="Onslaught is by default penalty to defenses which reset at your turn, you get 1 each time you get hit">Onslaught</span>:
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="flex grow-normal">
${" ".repeat(padding)}            <div style="display: inline-block;"><input type="checkbox" value="1" class="onslaught-checkbox" name="attr_apply-onslaught"><span></span></div>
${" ".repeat(padding)}            <input type="hidden" name="attr_onslaught" class="onslaught-check">
${" ".repeat(padding)}            <input type="hidden" name="attr_onslaught-applied" value="(@{onslaught} * @{apply-onslaught})" class="apply-onslaught-check" disabled>
${" ".repeat(padding)}            <input type="number" value="0" class="onslaught-input" name="attr_onslaught" style="width: 70px; cursor: text;" title="@{onslaught-applied}&#013;&#010;Onslaught is by default penalty to defenses which reset at your turn, you get 1 each time you get hit">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}    <div class="flex-col">
${" ".repeat(padding)}        <div class="flex">
${" ".repeat(padding)}            <span title="Natural Soak (Stamina + manual Modifier)">Nat. Soak</span>:
${" ".repeat(padding)}            <span name="attr_stamina" style="margin-left: 7px; margin-right: 3px; width: 1.55em; text-align: center;" title="Stamina">3</span>+<input type="number" value="0" name="attr_naturalsoak" style="width: 28px" title="Natural Soak Additional">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="flex">
${" ".repeat(padding)}            <span title="Unarmed Parry= (Dex + Brawl)/2">UnA. Parry</span>:
${" ".repeat(padding)}            <input type="hidden" name="attr_onslaught-applied" value="(@{onslaught} * @{apply-onslaught})" class="apply-onslaught-check" disabled>
${" ".repeat(padding)}            <input type="hidden" class="onslaught-check" name="attr_onslaught">
${" ".repeat(padding)}            <input type="hidden" class="qc-panel-check" name="attr_qc">
${" ".repeat(padding)}            <input type="number" value="(@{parry} + @{battlegroup-def-boost} - (@{apply-onslaught} * @{onslaught}) - @{grab-def-penalty} - @{prone-def-penalty} + @{cover-def-bonus} + @{full-def-bonus} - @{clash-def-penalty})" disabled="disabled" name="attr_parryfinal" data-i18n-title="parry-without-specialty" title="@{parryfinal}&#013;&#010;Parry without specialty" class="wound-taint onslaught-taint cover-taint grab-taint prone-taint clash-taint"><input type="number" value="(@{parry-specialty} + @{battlegroup-def-boost} - (@{apply-onslaught} * @{onslaught}) - @{grab-def-penalty} - @{prone-def-penalty} + @{cover-def-bonus} + @{full-def-bonus} - @{clash-def-penalty})" disabled="disabled" name="attr_parryfinal-specialty" data-i18n-title="parry-with-specialty" title="@{parryfinal-specialty}&#013;&#010;Parry with specialty" class="wound-taint onslaught-taint cover-taint grab-taint prone-taint clash-taint qc-toggle-display last-visible"><input type="text" name="attr_qc-parry-exc" class="qc-have-exc qc-toggle-display-inv" title="Excellency cap" readonly tabindex="-1">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}    <div class="flex-col">
${" ".repeat(padding)}        <input type="hidden" class="qc-panel-check" name="attr_qc">
${" ".repeat(padding)}        <div class="flex qc-toggle-visibility">
${" ".repeat(padding)}            <span title="Armored Soak, come from your armor">Ar. Soak</span>:
${" ".repeat(padding)}            <input type="number" readonly tabindex="-1" name="attr_armorsoak" title="Come from your armor">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="flex">
${" ".repeat(padding)}            <span title="Dexterity + Dodge">Evasion</span>:
${" ".repeat(padding)}            <input type="hidden" name="attr_onslaught-applied" value="(@{onslaught} * @{apply-onslaught})" class="apply-onslaught-check" disabled>
${" ".repeat(padding)}            <input type="hidden" class="qc-panel-check" name="attr_qc">
${" ".repeat(padding)}            <input type="number" value="(ceil((@{dexterity} + @{dodge}) / 2) - abs(@{armor-mobility}) - abs(@{wound-penalty}) - (@{apply-onslaught} * @{onslaught}) + @{battlegroup-def-boost} - @{grab-def-penalty} - (@{prone-def-penalty} * 2) + @{cover-def-bonus} + @{full-def-bonus} - @{clash-def-penalty})" disabled="disabled" data-i18n-title="evasion-without-specialty" title="@{evasion}&#013;&#010;Evasion without specialty" name="attr_evasion" class="wound-taint onslaught-taint cover-taint grab-taint prone-taint-doubled clash-taint"><input type="number" value="(ceil(((@{dexterity} + @{dodge}) + 1) / 2) - abs(@{armor-mobility}) - abs(@{wound-penalty}) - (@{apply-onslaught} * @{onslaught}) + @{battlegroup-def-boost} - @{grab-def-penalty} - (@{prone-def-penalty} * 2) + @{cover-def-bonus} + @{full-def-bonus} - @{clash-def-penalty})" disabled="disabled" data-i18n-title="evasion-with-specialty" title="@{evasion-specialty}&#013;&#010;Evasion with specialty" name="attr_evasion-specialty" class="wound-taint onslaught-taint cover-taint grab-taint prone-taint-doubled clash-taint qc-toggle-display last-visible"><input type="text" name="attr_qc-evasion-exc" class="qc-have-exc qc-toggle-display-inv" title="Excellency cap" readonly tabindex="-1">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}    <div class="flex-col def-exc">
${" ".repeat(padding)}        <button type="roll" class="sheet-roll btn ui-draggable default-whisper" name="act_defexc" title="quick access to Generic Defense Excellency (!NOT the one editable in Other!)" value="&amp;{template:exalted3e_cast} {{charm-name=Generic Defense Excellency}} {{character-name=@{character_name}}} {{aspect=@{caste-low}}} {{balanced=0}} {{type=Supplemental}} {{cost=[[?{Defense Added ?|1} * 2]]}} {{duration=Instant}} {{description=The Exalt infuse her essence inside her defenses to appear impenetrable.}} {{effect=The Exalt add [[?{Defense Added ?|1}]] to the static value of the related defense.}}\\n!exr ${moteCostBase}${moteCostPromptBase}[[?{Defense Added ?|1} * 2]]">Def Exc</button>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}    <div class="flex-col">
${" ".repeat(padding)}        <div class="flex">
${" ".repeat(padding)}            <strong><span title="Your capacity to reduce withering damage to you">Total Soak</span>:</strong>
${" ".repeat(padding)}            <input type="number" value="@{stamina}+@{naturalsoak}+@{armorsoak}+@{battlegroup-size}" disabled="disabled" name="attr_totalsoak" data-formula="@{stamina}+@{naturalsoak}+@{armorsoak}+@{battlegroup-size}" title="@{totalsoak}&#013;&#010;Represent the capacity to reduce withering damage.">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="flex">
${" ".repeat(padding)}            <span title="Wits + Integrity">Resolve</span>:
${" ".repeat(padding)}            <input type="hidden" class="qc-panel-check" name="attr_qc">
${" ".repeat(padding)}            <input type="number" value="(ceil((@{wits} + @{integrity}) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="resolve-without-specialty" title="@{resolve}&#013;&#010;Resolve without specialty" name="attr_resolve" class="wound-taint"><input type="number" value="(ceil(((@{wits} + @{integrity}) + 1) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="resolve-with-specialty" title="@{resolve-specialty}&#013;&#010;Resolve with specialty" name="attr_resolve-specialty" class="wound-taint qc-toggle-display last-visible"><input type="text" name="attr_qc-resolve-exc" class="qc-have-exc qc-toggle-display-inv" title="Excellency cap" readonly tabindex="-1">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}    <div class="flex-col">
${" ".repeat(padding)}        <div class="flex">
${" ".repeat(padding)}            <span title="The minimum damage dice the enemy need to roll to do Decisive Damage to you (not substracted though)">Hardness</span>:
${" ".repeat(padding)}            <input type="number" readonly tabindex="-1" name="attr_hardness" title="@{hardness}&#013;&#010;Come from your armor">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="flex">
${" ".repeat(padding)}            <span title="Manipulation + Socialize">Guile</span>:
${" ".repeat(padding)}            <input type="hidden" class="qc-panel-check" name="attr_qc">
${" ".repeat(padding)}            <input type="number" value="(ceil((@{manipulation} + @{socialize}) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="guile-without-specialty" title="@{guile}&#013;&#010;Guile without specialty" name="attr_guile" class="wound-taint"><input type="number" value="(ceil(((@{manipulation} + @{socialize}) + 1) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="guile-with-specialty" title="@{guile-specialty}&#013;&#010;Guile with specialty" name="attr_guile-specialty" class="wound-taint qc-toggle-display last-visible"><input type="text" name="attr_qc-guile-exc" class="qc-have-exc qc-toggle-display-inv" title="Excellency cap" readonly tabindex="-1">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}</div>`;
}

function getHealthLine(padding = 0) {
    return /*html*/`<input type="hidden" name="attr_wound-penalty" value="-4">
${" ".repeat(padding)}<fieldset class="repeating_health">
${" ".repeat(padding)}    <div class="sheet-health-level">
${" ".repeat(padding)}        <div class="sheet-damage-box">
${" ".repeat(padding)}            <input type="radio" name="attr_hl-damage" value="healthy" class="sheet-dots0" checked="checked"><span>&nbsp;</span>
${" ".repeat(padding)}            <input type="radio" name="attr_hl-damage" value="bashing" class="sheet-dots1"><span>&nbsp;</span>
${" ".repeat(padding)}            <input type="radio" name="attr_hl-damage" value="lethal" class="sheet-dots2"><span>&nbsp;</span>
${" ".repeat(padding)}            <input type="radio" name="attr_hl-damage" value="aggravated" class="sheet-dots3"><span>&nbsp;</span>
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <select class="sheet-wound-penalty" name="attr_hl-penalty">
${" ".repeat(padding)}            ${returnOptions(padding+12, [{val: '', label: ''}, ...[0,-1,-2,-4].map(i => ({val: i, label: `-${Math.abs(i)}`})),{val: 'I', label: 'Incapacitated'}], 0)}
${" ".repeat(padding)}        </select>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}</fieldset>`;
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

const getCostLine = (item, defaultWill, double = false) => /*html*/`<label>${item.name}:<input type="text" name="attr_rep-cost-${item.name.toLowerCase()}" class="sheet-cost-${item.name.toLowerCase()} grow-${double ? 'double' : 'normal'}" title="Cost as ${item.titleBase}&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations"${defaultWill ? ' value="?{Willpower ?|No,0|Yes,1}"' : ''}></label>`;

function getIndexCostRows(index, padding = 0, defaultWill = false) {
    return /*html*/`<p class="${costArray[index].name.toLowerCase()}-color-down rounded-box grow-${index === 'Mote' ? 'double' : 'normal'} flex${index === 'Mote' ? ' caste-have-exc-toggle' : ''}">
${" ".repeat(padding)}    ${getCostLine(costArray[index], defaultWill, false)}
${" ".repeat(padding)}</p>`;
}

function getCostRows(padding = 0, includeInit = true, defaultWill = false) {
    let ret = `${getIndexCostRows('Mote', padding)}
${" ".repeat(padding)}${getIndexCostRows('Will', padding, defaultWill)}`;
    if (includeInit) ret += `\n${" ".repeat(padding)}${getIndexCostRows('Init', padding)}`;
    return ret;
}

outHtml += /*html*/`
            <div class="sheet-tab-content sheet-tab-charm-sheet">
                <h1><span>Charms &amp; Evocations</span></h1>

                <div class="charm-tab-list">
                    <input class="sheet-tab-charms-check" name="attr_charm_sheet" type="hidden">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-archery sheet-tab-charm-archery" name="attr_charm_sheet" title="Archery" type="radio" value="Archery">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-athletics sheet-tab-charm-athletics" name="attr_charm_sheet" title="Athletics" type="radio" value="Athletics">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-awareness sheet-tab-charm-awareness" name="attr_charm_sheet" title="Awareness" type="radio" value="Awareness">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-brawl sheet-tab-charm-brawl" name="attr_charm_sheet" title="Brawl" type="radio" value="Brawl">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-bureaucracy sheet-tab-charm-bureaucracy" name="attr_charm_sheet" title="Bureaucracy" type="radio" value="Bureaucracy">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-craft sheet-tab-charm-craft" name="attr_charm_sheet" title="Craft" type="radio" value="Craft">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-dodge sheet-tab-charm-dodge" name="attr_charm_sheet" title="Dodge" type="radio" value="Dodge">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-integrity sheet-tab-charm-integrity" name="attr_charm_sheet" title="Integrity" type="radio" value="Integrity">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-investigation sheet-tab-charm-investigation" name="attr_charm_sheet" title="Investigation" type="radio" value="Investigation">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-larceny sheet-tab-charm-larceny" name="attr_charm_sheet" title="Larceny" type="radio" value="Larceny">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-linguistics sheet-tab-charm-linguistics" name="attr_charm_sheet" title="Linguistics" type="radio" value="Linguistics">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-lore sheet-tab-charm-lore" name="attr_charm_sheet" title="Lore" type="radio" value="Lore">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-medicine sheet-tab-charm-medicine" name="attr_charm_sheet" title="Medicine" type="radio" value="Medicine">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-melee sheet-tab-charm-melee" name="attr_charm_sheet" title="Melee" type="radio" value="Melee">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-occult sheet-tab-charm-occult" name="attr_charm_sheet" title="Occult" type="radio" value="Occult">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-performance sheet-tab-charm-performance" name="attr_charm_sheet" title="Performance" type="radio" value="Performance">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-presence sheet-tab-charm-presence" name="attr_charm_sheet" title="Presence" type="radio" value="Presence">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-resistance sheet-tab-charm-resistance" name="attr_charm_sheet" title="Resistance" type="radio" value="Resistance">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ride sheet-tab-charm-ride" name="attr_charm_sheet" title="Ride" type="radio" value="Ride">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-sail sheet-tab-charm-sail" name="attr_charm_sheet" title="Sail" type="radio" value="Sail">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-socialize sheet-tab-charm-socialize" name="attr_charm_sheet" title="Socialize" type="radio" value="Socialize">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-stealth sheet-tab-charm-stealth" name="attr_charm_sheet" title="Stealth" type="radio" value="Stealth">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-survival sheet-tab-charm-survival" name="attr_charm_sheet" title="Survival" type="radio" value="Survival">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-thrown sheet-tab-charm-thrown" name="attr_charm_sheet" title="Thrown" type="radio" value="Thrown">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-war sheet-tab-charm-war" name="attr_charm_sheet" title="War" type="radio" value="War">

                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-universal sheet-tab-charm-universal" name="attr_charm_sheet" title="Universal" type="radio" value="Universal">

                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-str-offense sheet-tab-charm-str-offense" name="attr_charm_sheet" title="STR - Offense" type="radio" value="Strength - Offense">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-str-mobility sheet-tab-charm-str-mobility" name="attr_charm_sheet" title="STR - Mobility" type="radio" value="Strength - Mobility">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-str-fos sheet-tab-charm-str-fos" name="attr_charm_sheet" title="STR - FoS" type="radio" value="Strength - Feats of Strength">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-dex-offensive sheet-tab-charm-dex-offensive" name="attr_charm_sheet" title="DEX - Offensive" type="radio" value="Dexterity - Offensive">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-dex-defense sheet-tab-charm-dex-defense" name="attr_charm_sheet" title="DEX - Defense" type="radio" value="Dexterity - Defense">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-dex-subterfuge sheet-tab-charm-dex-subterfuge" name="attr_charm_sheet" title="DEX - Subterfuge" type="radio" value="Dexterity - Subterfuge">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-dex-mobility sheet-tab-charm-dex-mobility" name="attr_charm_sheet" title="DEX - Mobility" type="radio" value="Dexterity - Mobility">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-dex-swarm sheet-tab-charm-dex-swarm" name="attr_charm_sheet" title="DEX - Swarm" type="radio" value="Dexterity - Swarm">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-sta-defense sheet-tab-charm-sta-defense" name="attr_charm_sheet" title="STA - Defense" type="radio" value="Stamina - Defense">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-sta-endurance sheet-tab-charm-sta-endurance" name="attr_charm_sheet" title="STA - Endurance" type="radio" value="Stamina - Endurance">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-sta-berserker sheet-tab-charm-sta-berserker" name="attr_charm_sheet" title="STA - Berserker" type="radio" value="Stamina - Berserker">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-cha-influence sheet-tab-charm-cha-influence" name="attr_charm_sheet" title="CHA - Influence" type="radio" value="Charisma - Influence">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-cha-territory sheet-tab-charm-cha-territory" name="attr_charm_sheet" title="CHA - Territory" type="radio" value="Charisma - Territory">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-cha-warfare sheet-tab-charm-cha-warfare" name="attr_charm_sheet" title="CHA - Warfare" type="radio" value="Charisma - Warfare">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-man-influence sheet-tab-charm-man-influence" name="attr_charm_sheet" title="MAN - Influence" type="radio" value="Manipulation - Influence">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-man-subterfuge sheet-tab-charm-man-subterfuge" name="attr_charm_sheet" title="MAN - Subterfuge" type="radio" value="Manipulation - Subterfuge">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-man-guile sheet-tab-charm-man-guile" name="attr_charm_sheet" title="MAN - Guile" type="radio" value="Manipulation - Guile">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-app-influence sheet-tab-charm-app-influence" name="attr_charm_sheet" title="APP - Influence" type="radio" value="Appearance - Influence">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-app-subterfuge sheet-tab-charm-app-subterfuge" name="attr_charm_sheet" title="APP - Subterfuge" type="radio" value="Appearance - Subterfuge">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-app-warfare sheet-tab-charm-app-warfare" name="attr_charm_sheet" title="APP - Warfare" type="radio" value="Appearance - Warfare">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-per-senses sheet-tab-charm-per-senses" name="attr_charm_sheet" title="PER - Senses" type="radio" value="Perception - Senses">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-per-scrutiny sheet-tab-charm-per-scrutiny" name="attr_charm_sheet" title="PER - Scrutiny" type="radio" value="Perception - Scrutiny">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-per-mysticism sheet-tab-charm-per-mysticism" name="attr_charm_sheet" title="PER - Mysticism" type="radio" value="Perception - Mysticism">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-int-knowledge sheet-tab-charm-int-knowledge" name="attr_charm_sheet" title="INT - Knowledge" type="radio" value="Intelligence - Knowledge">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-int-mysticism sheet-tab-charm-int-mysticism" name="attr_charm_sheet" title="INT - Mysticism" type="radio" value="Intelligence - Mysticism">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-int-crafting sheet-tab-charm-int-crafting" name="attr_charm_sheet" title="INT - Crafting" type="radio" value="Intelligence - Crafting">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-int-warfare sheet-tab-charm-int-warfare" name="attr_charm_sheet" title="INT - Warfare" type="radio" value="Intelligence - Warfare">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-int-sorcery sheet-tab-charm-int-sorcery" name="attr_charm_sheet" title="INT - Sorcery" type="radio" value="Intelligence - Sorcery">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-wit-resolve sheet-tab-charm-wit-resolve" name="attr_charm_sheet" title="WIT - Resolve" type="radio" value="Wits - Resolve">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-wit-animalken sheet-tab-charm-wit-animalken" name="attr_charm_sheet" title="WIT - Animal Ken" type="radio" value="Wits - Animal Ken">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-wit-navigation sheet-tab-charm-wit-navigation" name="attr_charm_sheet" title="WIT - Navigation" type="radio" value="Wits - Navigation">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-wit-cache sheet-tab-charm-wit-cache" name="attr_charm_sheet" title="WIT - Cache" type="radio" value="Wits - Cache">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-wit-territory sheet-tab-charm-wit-territory" name="attr_charm_sheet" title="WIT - Territory" type="radio" value="Wits - Territory">

                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-snake sheet-tab-charm-ma-snake" name="attr_charm_sheet" title="MA - Snake" type="radio" value="Snake Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-tiger sheet-tab-charm-ma-tiger" name="attr_charm_sheet" title="MA - Tiger" type="radio" value="Tiger Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-spsitv sheet-tab-charm-ma-spsitv" name="attr_charm_sheet" title="MA - Single P." type="radio" value="Single Point Shining Into The Void Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-whitereaper sheet-tab-charm-ma-whitereaper" name="attr_charm_sheet" title="MA - White Reaper" type="radio" value="White Reaper Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-ebonshadow sheet-tab-charm-ma-ebonshadow" name="attr_charm_sheet" title="MA - Ebon Shadow" type="radio" value="Ebon Shadow Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-crane sheet-tab-charm-ma-crane" name="attr_charm_sheet" title="MA - Crane" type="radio" value="Crane Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-silvervoice sheet-tab-charm-ma-silvervoice" name="attr_charm_sheet" title="MA - Silver V." type="radio" value="Silver-Voiced Nightingale Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-righteousdevil sheet-tab-charm-ma-righteousdevil" name="attr_charm_sheet" title="MA - Righteous D." type="radio" value="Righteous Devil Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-blackclaw sheet-tab-charm-ma-blackclaw" name="attr_charm_sheet" title="MA - Black Claw" type="radio" value="Black Claw Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-dreamingpearl sheet-tab-charm-ma-dreamingpearl" name="attr_charm_sheet" title="MA - Dreaming P." type="radio" value="Dreaming Pearl Courtesan Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-steeldevil sheet-tab-charm-ma-steeldevil" name="attr_charm_sheet" title="MA - Steel Devil" type="radio" value="Steel Devil Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-centipede sheet-tab-charm-ma-centipede" name="attr_charm_sheet" title="MA - Centipede" type="radio" value="Centipede Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-falcon sheet-tab-charm-ma-falcon" name="attr_charm_sheet" title="MA - Falcon" type="radio" value="Falcon Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-laughingmonster sheet-tab-charm-ma-laughingmonster" name="attr_charm_sheet" title="MA - Laughing M." type="radio" value="Laughing Monster Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-swayinggrass sheet-tab-charm-ma-swayinggrass" name="attr_charm_sheet" title="MA - Swaying G." type="radio" value="Swaying Grass Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-airdragon sheet-tab-charm-ma-airdragon" name="attr_charm_sheet" title="MA - Air Dragon" type="radio" value="Air Dragon Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-earthdragon sheet-tab-charm-ma-earthdragon" name="attr_charm_sheet" title="MA - Earth Dragon" type="radio" value="Earth Dragon Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-firedragon sheet-tab-charm-ma-firedragon" name="attr_charm_sheet" title="MA - Fire Dragon" type="radio" value="Fire Dragon Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-waterdragon sheet-tab-charm-ma-waterdragon" name="attr_charm_sheet" title="MA - Water Dragon" type="radio" value="Water Dragon Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-wooddragon sheet-tab-charm-ma-wooddragon" name="attr_charm_sheet" title="MA - Wood Dragon" type="radio" value="Wood Dragon Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-goldenjanissary sheet-tab-charm-ma-goldenjanissary" name="attr_charm_sheet" title="MA - Golden J." type="radio" value="Golden Janissary Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-mantis sheet-tab-charm-ma-mantis" name="attr_charm_sheet" title="MA - Mantis" type="radio" value="Mantis Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-whiteveil sheet-tab-charm-ma-whiteveil" name="attr_charm_sheet" title="MA - White Veil" type="radio" value="White Veil Style">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-ma-other sheet-tab-charm-ma-other" name="attr_charm_sheet" title="MA - other" type="radio" value="MA - Other">

                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-evocation sheet-tab-charm-evocation" name="attr_charm_sheet" title="Evocation" type="radio" value="Evocation">
                    <input class="sheet-tab sheet-tab-charms sheet-tab-charm-sheet-old sheet-tab-charm-old" name="attr_charm_sheet" title="Autre" type="radio" value="other">

                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-archery">
                        <h1><span>Archery</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-athletics">
                        <h1><span>Athletics</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-awareness">
                        <h1><span>Awareness</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-brawl">
                        <h1><span>Brawl</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-bureaucracy">
                        <h1><span>Bureaucracy</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-craft">
                        <h1><span>Craft</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-dodge">
                        <h1><span>Dodge</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-integrity">
                        <h1><span>Integrity</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-investigation">
                        <h1><span>Investigation</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-larceny">
                        <h1><span>Larceny</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-linguistics">
                        <h1><span>Linguistics</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-lore">
                        <h1><span>Lore</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-medicine">
                        <h1><span>Medicine</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-melee">
                        <h1><span>Melee</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-occult">
                        <h1><span>Occult</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-performance">
                        <h1><span>Performance</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-presence">
                        <h1><span>Presence</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-resistance">
                        <h1><span>Resistance</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ride">
                        <h1><span>Ride</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-sail">
                        <h1><span>Sail</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-socialize">
                        <h1><span>Socialize</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-stealth">
                        <h1><span>Stealth</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-survival">
                        <h1><span>Survival</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-thrown">
                        <h1><span>Thrown</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-war">
                        <h1><span>War</span></h1>
                    </div>

                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-universal">
                        <h1><span>Universal</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-str-offense">
                        <h1><span>Strength - Offense</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-str-mobility">
                        <h1><span>Strength - Mobility</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-str-fos">
                        <h1><span>Strength - Feats of Strength</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-dex-offensive">
                        <h1><span>Dexterity - Offensive</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-dex-defense">
                        <h1><span>Dexterity - Defense</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-dex-subterfuge">
                        <h1><span>Dexterity - Subterfuge</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-dex-mobility">
                        <h1><span>Dexterity - Mobility</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-dex-swarm">
                        <h1><span>Dexterity - Swarm</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-sta-defense">
                        <h1><span>Stamina - Defense</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-sta-endurance">
                        <h1><span>Stamina - Endurance</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-sta-berserker">
                        <h1><span>Stamina - Berserker</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-cha-influence">
                        <h1><span>Charisma - Influence</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-cha-territory">
                        <h1><span>Charisma - Territory</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-cha-warfare">
                        <h1><span>Charisma - Warfare</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-man-influence">
                        <h1><span>Manipulation - Influence</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-man-subterfuge">
                        <h1><span>Manipulation - Subterfuge</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-man-guile">
                        <h1><span>Manipulation - Guile</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-app-influence">
                        <h1><span>Appearance - Influence</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-app-subterfuge">
                        <h1><span>Appearance - Subterfuge</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-app-warfare">
                        <h1><span>Appearance - Warfare</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-per-senses">
                        <h1><span>Perception - Senses</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-per-scrutiny">
                        <h1><span>Perception - Scrutiny</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-per-mysticism">
                        <h1><span>Perception - Mysticism</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-int-knowledge">
                        <h1><span>Intelligence - Knowledge</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-int-mysticism">
                        <h1><span>Intelligence - Mysticism</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-int-crafting">
                        <h1><span>Intelligence - Crafting</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-int-warfare">
                        <h1><span>Intelligence - Warfare</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-int-sorcery">
                        <h1><span>Intelligence - Sorcery</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-wit-resolve">
                        <h1><span>Wits - Resolve</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-wit-animalken">
                        <h1><span>Wits - Animal Ken</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-wit-navigation">
                        <h1><span>Wits - Navigation</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-wit-cache">
                        <h1><span>Wits - Cache</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-wit-territory">
                        <h1><span>Wits - Territory</span></h1>
                    </div>

                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-snake">
                        <h1><span>Snake Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-tiger">
                        <h1><span>Tiger Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-spsitv">
                        <h1><span>Single Point Shining Into The Void Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-whitereaper">
                        <h1><span>White Reaper Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-ebonshadow">
                        <h1><span>Ebon Shadow Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-crane">
                        <h1><span>Crane Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-silvervoice">
                        <h1><span>Silver-Voiced Nightingale Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-righteousdevil">
                        <h1><span>Righteous Devil Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-blackclaw">
                        <h1><span>Black Claw Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-dreamingpearl">
                        <h1><span>Dreaming Pearl Courtesan Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-steeldevil">
                        <h1><span>Steel Devil Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-centipede">
                        <h1><span>Centipede Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-falcon">
                        <h1><span>Falcon Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-laughingmonster">
                        <h1><span>Laughing Monster Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-swayinggrass">
                        <h1><span>Swaying Grass Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-airdragon">
                        <h1><span>Air Dragon Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-earthdragon">
                        <h1><span>Earth Dragon Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-firedragon">
                        <h1><span>Fire Dragon Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-waterdragon">
                        <h1><span>Water Dragon Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-wooddragon">
                        <h1><span>Wood Dragon Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-goldenjanissary">
                        <h1><span>Golden Janissary Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-mantis">
                        <h1><span>Mantis Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-whiteveil">
                        <h1><span>White Veil Style</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-ma-other">
                        <h1><span>MA - Other</span></h1>
                    </div>

                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-evocation">
                        <h1><span>Evocation</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-old">
                        <h1><span>Other</span></h1>
                    </div>
                    <div class="sheet-body sheet-tab-content sheet-tab-charm-sheet-all">
                        <h1><span>All</span></h1>
                    </div>

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
                                    <input type="hidden" name="attr_rep-cost-macro" class="sheet-cost-macro">
                                    <div class="charm-buttons charm-buttons-show-default sheet-grouped-buttons">
                                        <button type="roll" class="sheet-roll btn ui-draggable default-whisper" name="act_charmcast" value="&amp;{template:exalted3e_cast} {{charm-name=@{charm-name}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=@{charm-skill}}} {{keywords=@{charm-keywords}}} {{type=@{charm-type}}} {{cost=@{charm-cost}}} {{duration=@{charm-duration}}} {{description=@{charm-description}}} {{effect=@{charm-effect}}} {{mute=@{charm-mute}}}\\n!exr @{rep-cost-macro}">Cast</button>
                                        <button type="roll" class="sheet-roll btn ui-draggable gm-whisper" name="act_charmcast-gm" value="/w gm &amp;{template:exalted3e_cast} {{charm-name=@{charm-name}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=@{charm-skill}}} {{keywords=@{charm-keywords}}} {{type=@{charm-type}}} {{cost=@{charm-cost}}} {{duration=@{charm-duration}}} {{description=@{charm-description}}} {{effect=@{charm-effect}}} {{mute=@{charm-mute}}}\\n!exr @{rep-cost-macro}">to GM</button>
                                        <button type="roll" class="sheet-roll btn ui-draggable" name="act_charmcast-show" value="&amp;{template:exalted3e_cast} {{charm-name=@{charm-name}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=@{charm-skill}}} {{keywords=@{charm-keywords}}} {{type=@{charm-type}}} {{cost=@{charm-cost}}} {{duration=@{charm-duration}}} {{description=@{charm-description}}} {{effect=@{charm-effect}}} {{mute=@{charm-mute}}}" title="Cast the Charm without the cost nor the macro">Show</button>
                                    </div>
                                    <div class="charm-buttons charm-buttons-show-extended sheet-grouped-buttons">
                                        <button type="roll" class="sheet-roll btn ui-draggable default-whisper" name="act_charmcast-ex" value="&amp;{template:exalted3e_cast} {{charm-name=@{charm-name}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=@{charm-skill}}} {{keywords=@{charm-keywords}}} {{type=@{charm-type}}} {{cost=@{charm-cost}}} {{duration=@{charm-duration}}} {{description=@{charm-description}}} {{effect=@{charm-effect}}} {{mute=@{charm-mute}}}\\n@{charm-rollexpr} @{rep-cost-macro}">Cast</button>
                                        <button type="roll" class="sheet-roll btn ui-draggable gm-whisper" name="act_charmcast-ex-gm" value="/w gm &amp;{template:exalted3e_cast} {{charm-name=@{charm-name}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=@{charm-skill}}} {{keywords=@{charm-keywords}}} {{type=@{charm-type}}} {{cost=@{charm-cost}}} {{duration=@{charm-duration}}} {{description=@{charm-description}}} {{effect=@{charm-effect}}} {{mute=@{charm-mute}}}\\n@{charm-rollexpr} -gm @{rep-cost-macro}">to GM</button>
                                        <button type="roll" class="sheet-roll btn ui-draggable" name="act_charmcast-show" value="&amp;{template:exalted3e_cast} {{charm-name=@{charm-name}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=@{charm-skill}}} {{keywords=@{charm-keywords}}} {{type=@{charm-type}}} {{cost=@{charm-cost}}} {{duration=@{charm-duration}}} {{description=@{charm-description}}} {{effect=@{charm-effect}}} {{mute=@{charm-mute}}}" title="Cast the Charm without the cost nor the macro">Show</button>
                                    </div>
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
                            <input type="hidden" name="attr_rep-cost-macro" class="sheet-cost-macro">
                            <div class="charm-buttons charm-buttons-show-default sheet-grouped-buttons">
                                <button type="roll" class="sheet-roll btn ui-draggable default-whisper" name="act_charmcast" value="&amp;{template:exalted3e_cast} {{spell-name=@{repspell-name}}} {{is-shaping-ritual=@{charm-shaping-ritual}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=Sorcery}} {{keywords=@{spell-keywords}}} {{circle=@{repspell-circle}}} {{cost=@{repspell-cost}}} {{duration=@{repspell-dur}}} {{description=@{spell-description}}} {{effect=@{repspell-effect}}}\\n!exr @{rep-cost-macro}">Cast</button>
                                <button type="roll" class="sheet-roll btn ui-draggable gm-whisper" name="act_charmcast" value="/w gm &amp;{template:exalted3e_cast} {{spell-name=@{repspell-name}}} {{is-shaping-ritual=@{charm-shaping-ritual}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=Sorcery}} {{keywords=@{spell-keywords}}} {{circle=@{repspell-circle}}} {{cost=@{repspell-cost}}} {{duration=@{repspell-dur}}} {{description=@{spell-description}}} {{effect=@{repspell-effect}}}\\n!exr @{rep-cost-macro}">to GM</button>
                            </div>
                            <div class="charm-buttons charm-buttons-show-extended sheet-grouped-buttons">
                                <button type="roll" class="sheet-roll btn ui-draggable default-whisper" name="act_charmcast" value="&amp;{template:exalted3e_cast} {{spell-name=@{repspell-name}}} {{is-shaping-ritual=@{charm-shaping-ritual}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=Sorcery}} {{keywords=@{spell-keywords}}} {{circle=@{repspell-circle}}} {{cost=@{repspell-cost}}} {{duration=@{repspell-dur}}} {{description=@{spell-description}}} {{effect=@{repspell-effect}}}\\n@{charm-rollexpr} @{rep-cost-macro}">Cast</button>
                                <button type="roll" class="sheet-roll btn ui-draggable gm-whisper" name="act_charmcast" value="/w gm &amp;{template:exalted3e_cast} {{spell-name=@{repspell-name}}} {{is-shaping-ritual=@{charm-shaping-ritual}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=Sorcery}} {{keywords=@{spell-keywords}}} {{circle=@{repspell-circle}}} {{cost=@{repspell-cost}}} {{duration=@{repspell-dur}}} {{description=@{spell-description}}} {{effect=@{repspell-effect}}}\\n@{charm-rollexpr} -gm @{rep-cost-macro}">to GM</button>
                            </div>
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

            <!-- 4 CONFIG PAGE -->

            <div class="sheet-body sheet-tab-content sheet-tab-settings-sheet">
                <h1><span>Character Type</span></h1>
                <div class="sheet-checklist sheet-2colrow sheet-main-config">
                    <div class="sheet-checklist sheet-col">
                        <label>
                            <input type="checkbox" name="attr_qc" value="1"><span></span>
                            <span>Quick Character</span>
                        </label>
                        <label>
                            <input type="checkbox" name="attr_battlegroup" value="1"><span></span>
                            <span>Battle Group</span>
                        </label>
                        <label class="sheet-cast-to-gm">
                            <input type="checkbox" name="attr_charmwhispergm" value="1"><span></span>
                            <span>Whisper to GM instead of CAST in charm tab</span>
                        </label>
                        <label>
                            <input type="checkbox" name="attr_charmwhisperboth" value="1"><span></span>
                            <span>Show both buttons in Charm Tab</span>
                        </label>
                        <label>
                            <input type="checkbox" name="attr_antisocialtab" value="1"><span></span>
                            <span>Show 2nd Social Tab</span>
                        </label>
                        <label>
                            <input type="checkbox" name="attr_combattab" value="1" checked><span></span>
                            <span>Show Combat Tab</span>
                        </label>
                        <label>
                            <input type="checkbox" name="attr_diceex" value="1"><span></span>
                            <span>Include Dice Excellency</span>
                        </label>
                        <label>
                            <input type="checkbox" name="attr_succex" value="1"><span></span>
                            <span>Include Success Excellency</span>
                        </label>
                        <label>
                            <input type="checkbox" name="attr_canspendmote" value="1"><span></span>
                            <span>Can spend Motes</span>
                        </label>
                        <label>
                            <input type="checkbox" name="attr_usecommitsystem" value="1" checked><span></span>
                            <span>Use Commited List System</span>
                        </label>
                        <label>
                            <input type="checkbox" name="attr_show-charname-in-charms" value="1"><span></span>
                            <span>Show Character Name in Charms</span>
                        </label>
                        <label title="Only work if browser have CSS selector 'has' enabled (Firefox doesnt by default)">
                            <input type="checkbox" name="attr_hide-not-learnt-charms-in-reminders" value="1"><span></span>
                            <span>Hide not Learnt Charms in Reminders</span>
                        </label>
                        <label>
                            <input type="checkbox" name="attr_pain-tolerance" value="1"><span></span>
                            <span>MERIT: Pain Tolerance</span>
                        </label>
                        <label class="show-to-mortals-mostly">
                            <input type="checkbox" name="attr_sbv-activated" value="1"><span></span>
                            <span>CHARM ENABLED: Saga Beast Virtue</span>
                        </label>
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
                    </div>
                </div>
                <h1><span>Charms list configuration</span></h1>
                <h2 style="text-align: center;"><span class="solar-style">Solar</span> & <span class="db-style">DB</span></h2>
                <div class="sheet-checklist sheet-3colrow">
                    <div class="sheet-checklist sheet-col">
                        <label><input type="checkbox" name="attr_charm-archery" value="1"><span> Archery</span></label>
                        <label><input type="checkbox" name="attr_charm-athletics" value="1"><span> Athletics</span></label>
                        <label><input type="checkbox" name="attr_charm-awareness" value="1"><span> Awareness</span></label>
                        <label><input type="checkbox" name="attr_charm-brawl" value="1"><span> Brawl</span></label>
                        <label><input type="checkbox" name="attr_charm-bureaucracy" value="1"><span> Bureaucracy</span></label>
                        <label><input type="checkbox" name="attr_charm-craft" value="1"><span> Craft</span></label>
                        <label><input type="checkbox" name="attr_charm-dodge" value="1"><span> Dodge</span></label>
                        <label><input type="checkbox" name="attr_charm-integrity" value="1"><span> Integrity</span></label>
                        <label><input type="checkbox" name="attr_charm-investigation" value="1"><span> Investigation</span></label>
                    </div>
                    <div class="sheet-checklist sheet-col">
                        <label><input type="checkbox" name="attr_charm-larceny" value="1"><span> Larceny</span></label>
                        <label><input type="checkbox" name="attr_charm-linguistics" value="1"><span> Linguistics</span></label>
                        <label><input type="checkbox" name="attr_charm-lore" value="1"><span> Lore</span></label>
                        <label><input type="checkbox" name="attr_charm-medicine" value="1"><span> Medicine</span></label>
                        <label><input type="checkbox" name="attr_charm-melee" value="1"><span> Melee</span></label>
                        <label><input type="checkbox" name="attr_charm-occult" value="1"><span> Occult</span></label>
                        <label><input type="checkbox" name="attr_charm-performance" value="1"><span> Performance</span></label>
                        <label><input type="checkbox" name="attr_charm-presence" value="1"><span> Presence</span></label>
                    </div>
                    <div class="sheet-checklist sheet-col">
                        <label><input type="checkbox" name="attr_charm-resistance" value="1"><span> Resistance</span></label>
                        <label><input type="checkbox" name="attr_charm-ride" value="1"><span> Ride</span></label>
                        <label><input type="checkbox" name="attr_charm-sail" value="1"><span> Sail</span></label>
                        <label><input type="checkbox" name="attr_charm-socialize" value="1"><span> Socialize</span></label>
                        <label><input type="checkbox" name="attr_charm-stealth" value="1"><span> Stealth</span></label>
                        <label><input type="checkbox" name="attr_charm-survival" value="1"><span> Survival</span></label>
                        <label><input type="checkbox" name="attr_charm-thrown" value="1"><span> Thrown</span></label>
                        <label><input type="checkbox" name="attr_charm-war" value="1"><span> War</span></label>
                    </div>
                </div>
                <h2 style="text-align: center;"><span class="lunar-style">Lunar</span></h2>
                <div class="sheet-checklist" style="margin:auto; width: 90px;"><label><input type="checkbox" name="attr_charm-universal" value="1"><span> Universal</span></label></div>
                <div class="sheet-checklist sheet-3colrow">
                    <div class="sheet-checklist sheet-col">
                        <label><input type="checkbox" name="attr_charm-str-offense" value="1"><span> Strength - Offense</span></label>
                        <label><input type="checkbox" name="attr_charm-str-mobility" value="1"><span> Strength - Mobility</span></label>
                        <label><input type="checkbox" name="attr_charm-str-fos" value="1"><span> Strength - Feats of Strength</span></label>
                        <label><input type="checkbox" name="attr_charm-dex-offensive" value="1"><span> Dexterity - Offensive</span></label>
                        <label><input type="checkbox" name="attr_charm-dex-defense" value="1"><span> Dexterity - Defense</span></label>
                        <label><input type="checkbox" name="attr_charm-dex-subterfuge" value="1"><span> Dexterity - Subterfuge</span></label>
                        <label><input type="checkbox" name="attr_charm-dex-mobility" value="1"><span> Dexterity - Mobility</span></label>
                        <label><input type="checkbox" name="attr_charm-dex-swarm" value="1"><span> Dexterity - Swarm</span></label>
                        <label><input type="checkbox" name="attr_charm-sta-defense" value="1"><span> Stamina - Defense</span></label>
                        <label><input type="checkbox" name="attr_charm-sta-endurance" value="1"><span> Stamina - Endurance</span></label>
                        <label><input type="checkbox" name="attr_charm-sta-berserker" value="1"><span> Stamina - Berserker</span></label>
                    </div>
                    <div class="sheet-checklist sheet-col">
                        <label><input type="checkbox" name="attr_charm-cha-influence" value="1"><span> Charisma - Influence</span></label>
                        <label><input type="checkbox" name="attr_charm-cha-territory" value="1"><span> Charisma - Territory</span></label>
                        <label><input type="checkbox" name="attr_charm-cha-warfare" value="1"><span> Charisma - Warfare</span></label>
                        <label><input type="checkbox" name="attr_charm-man-influence" value="1"><span> Manipulation - Influence</span></label>
                        <label><input type="checkbox" name="attr_charm-man-subterfuge" value="1"><span> Manipulation - Subterfuge</span></label>
                        <label><input type="checkbox" name="attr_charm-man-guile" value="1"><span> Manipulation - Guile</span></label>
                        <label><input type="checkbox" name="attr_charm-app-influence" value="1"><span> Appearance - Influence</span></label>
                        <label><input type="checkbox" name="attr_charm-app-subterfuge" value="1"><span> Appearance - Subterfuge</span></label>
                        <label><input type="checkbox" name="attr_charm-app-warfare" value="1"><span> Appearance - Warfare</span></label>
                    </div>
                    <div class="sheet-checklist sheet-col">
                        <label><input type="checkbox" name="attr_charm-per-senses" value="1"><span> Perception - Senses</span></label>
                        <label><input type="checkbox" name="attr_charm-per-scrutiny" value="1"><span> Perception - Scrutiny</span></label>
                        <label><input type="checkbox" name="attr_charm-per-mysticism" value="1"><span> Perception - Mysticism</span></label>
                        <label><input type="checkbox" name="attr_charm-int-knowledge" value="1"><span> Intelligence - Knowledge</span></label>
                        <label><input type="checkbox" name="attr_charm-int-mysticism" value="1"><span> Intelligence - Mysticism</span></label>
                        <label><input type="checkbox" name="attr_charm-int-crafting" value="1"><span> Intelligence - Crafting</span></label>
                        <label><input type="checkbox" name="attr_charm-int-warfare" value="1"><span> Intelligence - Warfare</span></label>
                        <label><input type="checkbox" name="attr_charm-int-sorcery" value="1"><span> Intelligence - Sorcery</span></label>
                        <label><input type="checkbox" name="attr_charm-wit-resolve" value="1"><span> Wits - Resolve</span></label>
                        <label><input type="checkbox" name="attr_charm-wit-animalken" value="1"><span> Wits - Animal Ken</span></label>
                        <label><input type="checkbox" name="attr_charm-wit-navigation" value="1"><span> Wits - Navigation</span></label>
                        <label><input type="checkbox" name="attr_charm-wit-cache" value="1"><span> Wits - Cache</span></label>
                        <label><input type="checkbox" name="attr_charm-wit-territory" value="1"><span> Wits - Territory</span></label>
                    </div>
                </div>
                <h2 style="text-align: center;">Martial Arts</h2>
                <div class="sheet-checklist sheet-3colrow">
                    <div class="sheet-checklist sheet-col">
                        <label><input type="checkbox" name="attr_charm-ma-snake" value="1"><span> Snake</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-tiger" value="1"><span> Tiger</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-spsitv" value="1"><span> Single Point Shining Into The Void</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-whitereaper" value="1"><span> White Reaper</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-ebonshadow" value="1"><span> Ebon Shadow</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-crane" value="1"><span> Crane</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-silvervoice" value="1"><span> Silver-Voiced Nightningale</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-righteousdevil" value="1"><span> Righteous Devil</span></label>
                    </div>
                    <div class="sheet-checklist sheet-col">
                        <label><input type="checkbox" name="attr_charm-ma-blackclaw" value="1"><span> Black Claw</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-dreamingpearl" value="1"><span> Dreaming Pearl Courtesan</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-steeldevil" value="1"><span> Steel Devil</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-centipede" value="1"><span> Centipede</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-falcon" value="1"><span> Falcon</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-laughingmonster" value="1"><span> Laughing Monster</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-swayinggrass" value="1"><span> Swaying Grass Dance</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-airdragon" value="1"><span> Air Dragon</span></label>
                    </div>
                    <div class="sheet-checklist sheet-col">
                        <label><input type="checkbox" name="attr_charm-ma-earthdragon" value="1"><span> Earth Dragon</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-firedragon" value="1"><span> Fire Dragon</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-waterdragon" value="1"><span> Water Dragon</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-wooddragon" value="1"><span> Wood Dragon</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-goldenjanissary" value="1"><span> Golden Janissary</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-mantis" value="1"><span> Mantis</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-whiteveil" value="1"><span> White Veil</span></label>
                        <label><input type="checkbox" name="attr_charm-ma-other" value="1"><span> Other</span></label>
                    </div>
                </div>
                <h2 style="text-align: center;">Other</h2>
                <div class="sheet-checklist sheet-2colrow">
                    <div class="sheet-checklist sheet-col">
                        <label><input type="checkbox" name="attr_charm-evocation" value="1"><span style="font-style: italic; color: #00e7ff;"> Evocation</span></label>
                    </div>
                    <div class="sheet-checklist sheet-col">
                        <label><input type="checkbox" name="attr_charm-old" value="1"><span> other</span></label>
                    </div>
                </div>
                <h1><span>Mote Pool Equations</span></h1>
                <div class="flex-wrap mote-pool-eq">
                    <label>Max Personal Motes<input type="text" name="attr_personal-equation" value="@{essence} * 3 + 10 - @{committedessperso}"><span> </span></label>
                    <label>Max Peripheral Motes<input type="text" name="attr_peripheral-equation" value="@{essence} * 7 + 26 - @{committedesstotal}"><span></span></label>
                </div>
            </div>

            <!-- 5 ROLLS PAGE -->\n`;

function getRessourceLine(padding = 0, rollpenIncluded = true) {
    let ret = /*html*/`<div class="ressource-line flex-wrap">
${" ".repeat(padding)}    <p class="will-color rounded-box grow-max flex" title="@{willpower} & @{willpower_max}">
${" ".repeat(padding)}        <label class="grow-normal">Willpower:<input type="number" name="attr_willpower" value="5" min="0" max="15" class="grow-normal"></label>/<input type="number" name="attr_willpower_max" readonly="readonly" tabindex="-1">
${" ".repeat(padding)}    </p>
${" ".repeat(padding)}    <input type="hidden" name="attr_personal-equation" class="personal-mote-val">
${" ".repeat(padding)}    <input type="hidden" name="attr_peripheral-equation" class="peripheral-mote-val">
${" ".repeat(padding)}    <div class="flex grow-max personal-mote-toggle">
${" ".repeat(padding)}        <p class="mote-color rounded-box grow-normal flex"><!-- Remove readonly & after in the next line to have manual mote edition -->
${" ".repeat(padding)}            Personal:<button type="roll" class="btn gm-only add-mote" value="!cmaster --moteAdd,qty:?{How many ?|5},perso:1,setTo:@{character_id}">+</button><input type="number" name="attr_personal-essence" class="grow-normal" readonly tabindex="-1" title="@{personal-essence}">/<input type="number" name="attr_personal-essence_max" value="@{personal-equation}" disabled="disabled" data-formula="@{personal-equation}" title="@{personal-essence_max}">
${" ".repeat(padding)}        </p>
${" ".repeat(padding)}        <p class="commited-mote-color rounded-box flex personal-mote-toggle" title="Personal motes Commited">
${" ".repeat(padding)}            <label>Com.:<input type="number" name="attr_committedessperso" class="grow-normal free-commit"><input type="number" name="attr_committedessperso" class="grow-normal commit-system" readonly tabindex="-1" title="@{committedessperso}&#013;&#010;Personal Commited"></label>
${" ".repeat(padding)}        </p>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}    <div class="flex grow-max peripheral-mote-toggle">
${" ".repeat(padding)}        <p class="mote-color rounded-box grow-normal flex"><!-- Remove readonly & after in the next line to have manual mote edition -->
${" ".repeat(padding)}            Peripheral:<button type="roll" class="btn gm-only add-mote" value="!cmaster --moteAdd,qty:?{How many ?|5},perso:0,setTo:@{character_id}">+</button><input type="number" name="attr_peripheral-essence" class="grow-normal" readonly tabindex="-1" title="@{peripheral-essence}">/<input type="number" name="attr_peripheral-essence_max" value="@{peripheral-equation}" disabled="disabled" data-formula="@{peripheral-equation}" title="@{peripheral-essence_max}">
${" ".repeat(padding)}        </p>
${" ".repeat(padding)}        <p class="commited-mote-color rounded-box" title="Peripheral motes Commited">
${" ".repeat(padding)}            <label>Com.:<input type="number" name="attr_committedesstotal" class="grow-normal free-commit"><input type="number" name="attr_committedesstotal" class="grow-normal commit-system" readonly tabindex="-1" title="@{committedesstotal}&#013;&#010;Peripheral Commited"></label>
${" ".repeat(padding)}        </p>
${" ".repeat(padding)}    </div>`;
    if (rollpenIncluded) ret += /*html*/`
${" ".repeat(padding)}    <div class="flex grow-normal rollpen-box">
${" ".repeat(padding)}        <p class="flex grow-normal rounded-box">
${" ".repeat(padding)}            RollPen:
${" ".repeat(padding)}            <input id="rollpen-input-widget" type="number" value="0" title="@{roll-penalty}&#013;&#010;Roll penalty" name="attr_rollpenalty-input" class="rollpenalty-input grow-normal">
${" ".repeat(padding)}        </p>
${" ".repeat(padding)}    </div>`;
    ret += /*html*/`
${" ".repeat(padding)}</div>`;
    return ret;
}

function getRemindersAttr(padding = 0) {
    let ret = /*html*/`<input type="hidden" class="qc-panel-check" name="attr_qc">
${" ".repeat(padding)}<div class="sheet-box-reminder sheet-attr-reminder qc-toggle-display">
${" ".repeat(padding)}    <input type="checkbox" class="sheet-unnamed-toggle"><span title="Show Attr" class="sheet-layer6"></span>
${" ".repeat(padding)}    <div class="sheet-layer5">
${" ".repeat(padding)}        <div class="reminder-cell" title="Strength">
${" ".repeat(padding)}            <span>Str</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_strength" readonly tabindex="-1" title="@{strength}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Dexterity">
${" ".repeat(padding)}            <span>Dex</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_dexterity" readonly tabindex="-1" title="@{dexterity}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Stamina">
${" ".repeat(padding)}            <span>Sta</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_stamina" readonly tabindex="-1" title="@{stamina}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Charisma">
${" ".repeat(padding)}            <span>Cha</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_charisma" readonly tabindex="-1" title="@{charisma}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Manipulation">
${" ".repeat(padding)}            <span>Man</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_manipulation" readonly tabindex="-1" title="@{manipulation}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Appearance">
${" ".repeat(padding)}            <span>App</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_appearance" readonly tabindex="-1" title="@{appearance}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Perception">
${" ".repeat(padding)}            <span>Per</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_perception" readonly tabindex="-1" title="@{perception}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Intelligence">
${" ".repeat(padding)}            <span>Int</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_intelligence" readonly tabindex="-1" title="@{intelligence}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Wits">
${" ".repeat(padding)}            <span>Wit</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_wits" readonly tabindex="-1" title="@{wits}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}</div>`;
    return ret;
}

function getRemindersCharms(padding = 0) {
    let ret = /*html*/`<div class="sheet-box-reminder sheet-charm-reminder">
${" ".repeat(padding)}    <input type="checkbox" class="sheet-unnamed-toggle"><span title="Show Charms" class="sheet-layer5"></span>
${" ".repeat(padding)}    <div class="sheet-layer4">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-archery" class="check-charm-archery">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-athletics" class="check-charm-athletics">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-awareness" class="check-charm-awareness">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-brawl" class="check-charm-brawl">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-bureaucracy" class="check-charm-bureaucracy">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-craft" class="check-charm-craft">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-dodge" class="check-charm-dodge">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-integrity" class="check-charm-integrity">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-investigation" class="check-charm-investigation">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-larceny" class="check-charm-larceny">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-linguistics" class="check-charm-linguistics">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-lore" class="check-charm-lore">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-medicine" class="check-charm-medicine">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-melee" class="check-charm-melee">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-occult" class="check-charm-occult">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-performance" class="check-charm-performance">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-presence" class="check-charm-presence">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-resistance" class="check-charm-resistance">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ride" class="check-charm-ride">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-sail" class="check-charm-sail">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-socialize" class="check-charm-socialize">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-stealth" class="check-charm-stealth">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-survival" class="check-charm-survival">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-thrown" class="check-charm-thrown">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-war" class="check-charm-war">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-universal" class="check-charm-universal">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-str-offense" class="check-charm-str-offense">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-str-mobility" class="check-charm-str-mobility">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-str-fos" class="check-charm-str-fos">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-dex-offensive" class="check-charm-dex-offensive">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-dex-defense" class="check-charm-dex-defense">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-dex-subterfuge" class="check-charm-dex-subterfuge">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-dex-mobility" class="check-charm-dex-mobility">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-dex-swarm" class="check-charm-dex-swarm">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-sta-defense" class="check-charm-sta-defense">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-sta-endurance" class="check-charm-sta-endurance">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-sta-berserker" class="check-charm-sta-berserker">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-cha-influence" class="check-charm-cha-influence">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-cha-territory" class="check-charm-cha-territory">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-cha-warfare" class="check-charm-cha-warfare">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-man-influence" class="check-charm-man-influence">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-man-subterfuge" class="check-charm-man-subterfugr">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-man-guile" class="check-charm-man-guile">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-app-influence" class="check-charm-app-influence">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-app-subterfuge" class="check-charm-app-subterfuge">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-app-warfare" class="check-charm-app-warfare">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-per-senses" class="check-charm-per-senses">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-per-scrutiny" class="check-charm-per-scrutiny">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-per-mysticism" class="check-charm-per-mysticism">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-int-knowledge" class="check-charm-int-knowledge">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-int-mysticism" class="check-charm-int-mysticism">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-int-crafting" class="check-charm-int-crafting">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-int-warfare" class="check-charm-int-warfare">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-int-sorcery" class="check-charm-int-sorcery">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-wit-resolve" class="check-charm-wit-resolve">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-wit-animalken" class="check-charm-wit-animalken">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-wit-navigation" class="check-charm-wit-navigation">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-wit-cache" class="check-charm-wit-cache">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-wit-territory" class="check-charm-wit-territory">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-snake" class="check-charm-ma-snake">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-tiger" class="check-charm-ma-tiger">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-spsitv" class="check-charm-ma-spsitv">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-whitereaper" class="check-charm-ma-whitereaper">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-ebonshadow" class="check-charm-ma-ebonshadow">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-crane" class="check-charm-ma-crane">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-silvervoice" class="check-charm-ma-silvervoice">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-righteousdevil" class="check-charm-ma-righteousdevil">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-blackclaw" class="check-charm-ma-blackclaw">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-dreamingpearl" class="check-charm-ma-dreamingpearl">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-steeldevil" class="check-charm-ma-steeldevil">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-centipede" class="check-charm-ma-centipede">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-falcon" class="check-charm-ma-falcon">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-laughingmonster" class="check-charm-ma-laughingmonster">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-swayinggrass" class="check-charm-ma-swayinggrass">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-airdragon" class="check-charm-ma-airdragon">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-earthdragon" class="check-charm-ma-earthdragon">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-firedragon" class="check-charm-ma-firedragon">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-waterdragon" class="check-charm-ma-waterdragon">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-wooddragon" class="check-charm-ma-wooddragon">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-goldenjanissary" class="check-charm-ma-goldenjanissary">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-mantis" class="check-charm-ma-mantis">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-whiteveil" class="check-charm-ma-whiteveil">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-ma-other" class="check-charm-ma-other">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-evocation" class="check-charm-evocations">
${" ".repeat(padding)}        <input type="hidden" name="attr_charm-old" class="check-charm">
${" ".repeat(padding)}        <select name="attr_charm_sheet" style="flex-grow: 42000;">
${" ".repeat(padding)}            <option>--- SELECT ONE ---</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-archery" value="Archery">Archery</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-athletics" value="Athletics">Athletics</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-awareness" value="Awareness">Awareness</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-brawl" value="Brawl">Brawl</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-bureaucracy" value="Bureaucracy">Bureaucracy</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-craft" value="Craft">Craft</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-dodge" value="Dodge">Dodge</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-integrity" value="Integrity">Integrity</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-investigation" value="Investigation">Investigation</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-larceny" value="Larceny">Larceny</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-linguistics" value="Linguistics">Linguistics</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-lore" value="Lore">Lore</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-medicine" value="Medicine">Medicine</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-melee" value="Melee">Melee</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-occult" value="Occult">Occult</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-performance" value="Performance">Performance</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-presence" value="Presence">Presence</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-resistance" value="Resistance">Resistance</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ride" value="Ride">Ride</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-sail" value="Sail">Sail</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-socialize" value="Socialize">Socialize</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-stealth" value="Stealth">Stealth</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-survival" value="Survival">Survival</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-thrown" value="Thrown">Thrown</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-war" value="War">War</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-universal" value="Universal">Universal</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-str-offense" value="Strength - Offense">Strength - Offense</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-str-mobility" value="Strength - Mobility">Strength - Mobility</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-str-fos" value="Strength - Feats of Strength">Strength - Feats of Strength</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-dex-offensive" value="Dexterity - Offensive">Dexterity - Offensive</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-dex-defense" value="Dexterity - Defense">Dexterity - Defense</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-dex-subterfuge" value="Dexterity - Subterfuge">Dexterity - Subterfuge</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-dex-mobility" value="Dexterity - Mobility">Dexterity - Mobility</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-dex-swarm" value="Dexterity - Swarm">Dexterity - Swarm</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-sta-defense" value="Stamina - Defense">Stamina - Defense</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-sta-endurance" value="Stamina - Endurance">Stamina - Endurance</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-sta-berserker" value="Stamina - Berserker">Stamina - Berserker</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-cha-influence" value="Charisma - Influence">Charisma - Influence</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-cha-territory" value="Charisma - Territory">Charisma - Territory</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-cha-warfare" value="Charisma - Warfare">Charisma - Warfare</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-man-influence" value="Manipulation - Influence">Manipulation - Influence</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-man-subterfugr" value="Manipulation - Subterfuge">Manipulation - Subterfuge</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-man-guile" value="Manipulation - Guile">Manipulation - Guile</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-app-influence" value="Appearance - Influence">Appearance - Influence</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-app-subterfuge" value="Appearance - Subterfuge">Appearance - Subterfuge</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-app-warfare" value="Appearance - Warfare">Appearance - Warfare</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-per-senses" value="Perception - Senses">Perception - Senses</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-per-scrutiny" value="Perception - Scrutiny">Perception - Scrutiny</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-per-mysticism" value="Perception - Mysticism">Perception - Mysticism</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-int-knowledge" value="Intelligence - Knowledge">Intelligence - Knowledge</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-int-mysticism" value="Intelligence - Mysticism">Intelligence - Mysticism</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-int-crafting" value="Intelligence - Crafting">Intelligence - Crafting</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-int-warfare" value="Intelligence - Warfare">Intelligence - Warfare</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-int-sorcery" value="Intelligence - Sorcery">Intelligence - Sorcery</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-wit-resolve" value="Wits - Resolve">Wits - Resolve</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-wit-animalken" value="Wits - Animal Ken">Wits - Animal Ken</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-wit-navigation" value="Wits - Navigation">Wits - Navigation</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-wit-cache" value="Wits - Cache">Wits - Cache</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-wit-territory" value="Wits - Territory">Wits - Territory</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-snake" value="Snake Style">Snake</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-tiger" value="Tiger Style">Tiger</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-spsitv" value="Single Point Shining Into The Void Style">Single Point Shining Into The Void</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-whitereaper" value="White Reaper Style">White Reaper</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-ebonshadow" value="Ebon Shadow Style">Ebon Shadow</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-crane" value="Crane Style">Crane</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-silvervoice" value="Silver-Voiced Nightingale Style">Silver-Voiced Nightningale</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-righteousdevil" value="Righteous Devil Style">Righteous Devil</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-blackclaw" value="Black Claw Style">Black Claw</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-dreamingpearl" value="Dreaming Pearl Courtesan Style">Dreaming Pearl Courtesan</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-steeldevil" value="Steel Devil Style">Steel Devil</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-centipede" value="Centipede Style">Centipede</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-falcon" value="Falcon Style">Falcon</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-laughingmonster" value="Laughing Monster Style">Laughing Monster</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-swayinggrass" value="Swaying Grass Style">Swaying Grass Dance</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-airdragon" value="Air Dragon Style">Air Dragon</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-earthdragon" value="Earth Dragon Style">Earth Dragon</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-firedragon" value="Fire Dragon Style">Fire Dragon</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-waterdragon" value="Water Dragon Style">Water Dragon</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-wooddragon" value="Wood Dragon Style">Wood Dragon</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-goldenjanissary" value="Golden Janissary Style">Golden Janissary</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-mantis" value="Mantis Style">Mantis</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-whiteveil" value="White Veil Style">White Veil</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-ma-other" value="MA - Other">Ma-Other</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm-evocations" value="Evocation">Evocation</option>
${" ".repeat(padding)}            <option class="reminder-charm opt-charm" value="other">Other</option>
${" ".repeat(padding)}        </select>
${" ".repeat(padding)}        <div class="toggle-commit-list">
${" ".repeat(padding)}            <input type="checkbox" class="sheet-unnamed-toggle" name="attr_commit-list-shown" value="1"><span title="Show Commits" class="sheet-layer6"></span>
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <hr />
${" ".repeat(padding)}        <div class="reminder-charms-main-div">
${" ".repeat(padding)}            <input type="hidden" name="attr_charm_sheet" class="reminder-charm-selector-input" />
${" ".repeat(padding)}            <fieldset class="repeating_charms-all" style="display: none;">
${" ".repeat(padding)}                <input type="hidden" name="attr_isEvoc" class="sheet-tab-charms-inside-check">
${" ".repeat(padding)}                <input type="hidden" name="attr_charm-name" class="sheet-tab-charms-name-check">
${" ".repeat(padding)}                <input type="hidden" name="attr_charm-aspect">
${" ".repeat(padding)}                <input type="hidden" name="attr_charm-balanced">
${" ".repeat(padding)}                <div class="db-aspect-quickshow">
${" ".repeat(padding)}                    <input type="hidden" name="attr_charm-can-cycle-aspects" value="0">
${" ".repeat(padding)}                    <button type="action" name="act_change-aspect" class="quick-change-aspect" title="Change Aspect"></button>
${" ".repeat(padding)}                    <img class="aspect" />
${" ".repeat(padding)}                    <img class="balanced" src="https://s3.amazonaws.com/files.d20.io/images/290329500/ecMmiM8rUcJ-ziYHX9d18w/max.png?1655517656" title="Balanced"/>
${" ".repeat(padding)}                </div>
${" ".repeat(padding)}                <input type="hidden" name="attr_charm-learnt" class="charm-learnt-check" value="1">
${" ".repeat(padding)}                <input type="text" name="attr_charm-name" readonly tabindex="-1">
${" ".repeat(padding)}                <input type="hidden" name="attr_charm-buttons-isextended" class="charm-buttons-include-check" value="0">
${" ".repeat(padding)}                <input type="hidden" name="attr_rep-cost-macro" class="sheet-cost-macro">
${" ".repeat(padding)}                <input type="hidden" name="attr_charm-skill" class="sheet-tab-charms-inside-check">
${" ".repeat(padding)}                <input type="hidden" name="attr_charm-keywords">
${" ".repeat(padding)}                <input type="hidden" name="attr_charm-mute">
${" ".repeat(padding)}                <input type="hidden" name="attr_charm-type">
${" ".repeat(padding)}                <img class="charm-icon-type"/>
${" ".repeat(padding)}                <input type="text" name="attr_charm-cost" readonly tabindex="-1">
${" ".repeat(padding)}                <input type="hidden" name="attr_charm-duration">
${" ".repeat(padding)}                <input type="hidden" name="attr_charm-description">
${" ".repeat(padding)}                <input type="hidden" name="attr_charm-effect">
${" ".repeat(padding)}                <input type="hidden" name="attr_charm-rollexpr">
${" ".repeat(padding)}                <div class="charm-buttons charm-buttons-show-default sheet-grouped-buttons">
${" ".repeat(padding)}                    <button type="roll" class="sheet-roll btn ui-draggable default-whisper" name="act_charmcast" value="&amp;{template:exalted3e_cast} {{charm-name=@{charm-name}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=@{charm-skill}}} {{keywords=@{charm-keywords}}} {{type=@{charm-type}}} {{cost=@{charm-cost}}} {{duration=@{charm-duration}}} {{description=@{charm-description}}} {{effect=@{charm-effect}}} {{mute=@{charm-mute}}}\\n!exr @{rep-cost-macro}">Cast</button>
${" ".repeat(padding)}                    <button type="roll" class="sheet-roll btn ui-draggable gm-whisper" name="act_charmcast-gm" value="/w gm &amp;{template:exalted3e_cast} {{charm-name=@{charm-name}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=@{charm-skill}}} {{keywords=@{charm-keywords}}} {{type=@{charm-type}}} {{cost=@{charm-cost}}} {{duration=@{charm-duration}}} {{description=@{charm-description}}} {{effect=@{charm-effect}}} {{mute=@{charm-mute}}}\\n!exr @{rep-cost-macro}">to GM</button>
${" ".repeat(padding)}                    <button type="roll" class="sheet-roll btn ui-draggable" name="act_charmcast-show" value="&amp;{template:exalted3e_cast} {{charm-name=@{charm-name}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=@{charm-skill}}} {{keywords=@{charm-keywords}}} {{type=@{charm-type}}} {{cost=@{charm-cost}}} {{duration=@{charm-duration}}} {{description=@{charm-description}}} {{effect=@{charm-effect}}} {{mute=@{charm-mute}}}" title="Cast the Charm without the cost nor the macro">Show</button>
${" ".repeat(padding)}                </div>
${" ".repeat(padding)}                <div class="charm-buttons charm-buttons-show-extended sheet-grouped-buttons">
${" ".repeat(padding)}                    <button type="roll" class="sheet-roll btn ui-draggable default-whisper" name="act_charmcast-ex" value="&amp;{template:exalted3e_cast} {{charm-name=@{charm-name}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=@{charm-skill}}} {{keywords=@{charm-keywords}}} {{type=@{charm-type}}} {{cost=@{charm-cost}}} {{duration=@{charm-duration}}} {{description=@{charm-description}}} {{effect=@{charm-effect}}} {{mute=@{charm-mute}}}\\n@{charm-rollexpr} @{rep-cost-macro}">Cast</button>
${" ".repeat(padding)}                    <button type="roll" class="sheet-roll btn ui-draggable gm-whisper" name="act_charmcast-ex-gm" value="/w gm &amp;{template:exalted3e_cast} {{charm-name=@{charm-name}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=@{charm-skill}}} {{keywords=@{charm-keywords}}} {{type=@{charm-type}}} {{cost=@{charm-cost}}} {{duration=@{charm-duration}}} {{description=@{charm-description}}} {{effect=@{charm-effect}}} {{mute=@{charm-mute}}}\\n@{charm-rollexpr} -gm @{rep-cost-macro}">to GM</button>
${" ".repeat(padding)}                    <button type="roll" class="sheet-roll btn ui-draggable" name="act_charmcast-show" value="&amp;{template:exalted3e_cast} {{charm-name=@{charm-name}}} {{show-character-name=@{show_character_name}}} {{character-name=@{character_name}}} {{aspect=@{charm-aspect}}} {{balanced=@{charm-balanced}}} {{skill=@{charm-skill}}} {{keywords=@{charm-keywords}}} {{type=@{charm-type}}} {{cost=@{charm-cost}}} {{duration=@{charm-duration}}} {{description=@{charm-description}}} {{effect=@{charm-effect}}} {{mute=@{charm-mute}}}" title="Cast the Charm without the cost nor the macro">Show</button>
${" ".repeat(padding)}                </div>
${" ".repeat(padding)}                <div class="charm-buttons sheet-grouped-buttons charm-button-learn">
${" ".repeat(padding)}                    <button type="action" name="act_learn-charm" class="sheet-roll btn ui-draggable" title="Learn !">Learn !</button>
${" ".repeat(padding)}                </div>
${" ".repeat(padding)}                <input type="text" name="attr_charm-short-desc" readonly tabindex="-1">
${" ".repeat(padding)}            </fieldset>
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-charms-commited-div">
${" ".repeat(padding)}            <fieldset class="repeating_commited-list" style="display: none;">
${" ".repeat(padding)}                <input type="hidden" name="attr_commited-state" value="0">
${" ".repeat(padding)}                <input type="hidden" name="attr_commited-pool-type" value="1">
${" ".repeat(padding)}                <div class="inner-div">
${" ".repeat(padding)}                    <input type="text" name="attr_commited-name" placeholder="Excellent Solar Larceny">
${" ".repeat(padding)}                    <label>Personal<input type="text" name="attr_commited-cost-perso" value="0"></label>
${" ".repeat(padding)}                    <label>Peripheral<input type="text" name="attr_commited-cost-peri" value="0"></label>
${" ".repeat(padding)}                    <label>Commited<input type="checkbox" name="attr_commited-state" value="1"></label>
${" ".repeat(padding)}                </div>
${" ".repeat(padding)}            </fieldset>
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}</div>`;
    return ret;
}

function getRemindersAbi(padding = 0, includeHiddenQc = true) {
    let ret = '';
    if (includeHiddenQc) ret += /*html*/`<input type="hidden" class="qc-panel-check" name="attr_qc">\n${" ".repeat(padding)}`;
    ret += /*html*/`<div class="sheet-box-reminder sheet-abi-reminder qc-toggle-display">
${" ".repeat(padding)}    <input type="checkbox" class="sheet-unnamed-toggle"><span title="Show Abi" class="sheet-layer7"></span>
${" ".repeat(padding)}    <div class="sheet-layer6">
${" ".repeat(padding)}        <div class="main-abi">
${" ".repeat(padding)}            <div class="reminder-cell" title="Archery">
${" ".repeat(padding)}                <span>Arc</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_archery" readonly tabindex="-1" title="@{archery}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Athletics">
${" ".repeat(padding)}                <span>Ath</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_athletics" readonly tabindex="-1" title="@{athletics}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Awareness">
${" ".repeat(padding)}                <span>Awa</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_awareness" readonly tabindex="-1" title="@{awareness}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Brawl">
${" ".repeat(padding)}                <span>Bra</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_brawl" readonly tabindex="-1" title="@{brawl}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Bureaucracy">
${" ".repeat(padding)}                <span>Bur</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_bureaucracy" readonly tabindex="-1" title="@{bureaucracy}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Dodge">
${" ".repeat(padding)}                <span>Dod</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_dodge" readonly tabindex="-1" title="@{dodge}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Integrity">
${" ".repeat(padding)}                <span>Int</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_integrity" readonly tabindex="-1" title="@{integrity}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Investigation">
${" ".repeat(padding)}                <span>Inv</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_investigation" readonly tabindex="-1" title="@{investigation}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Larceny">
${" ".repeat(padding)}                <span>Lar</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_larceny" readonly tabindex="-1" title="@{larceny}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Linguistics">
${" ".repeat(padding)}                <span>Lin</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_linguistics" readonly tabindex="-1" title="@{linguistics}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Lore">
${" ".repeat(padding)}                <span>Lor</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_lore" readonly tabindex="-1" title="@{lore}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Medicine">
${" ".repeat(padding)}                <span>Med</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_medicine" readonly tabindex="-1" title="@{medicine}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Melee">
${" ".repeat(padding)}                <span>Mel</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_melee" readonly tabindex="-1" title="@{melee}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Occult">
${" ".repeat(padding)}                <span>Occ</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_occult" readonly tabindex="-1" title="@{occult}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Performance">
${" ".repeat(padding)}                <span>Per</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_performance" readonly tabindex="-1" title="@{performance}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Presence">
${" ".repeat(padding)}                <span>Pre</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_presence" readonly tabindex="-1" title="@{presence}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Resistance">
${" ".repeat(padding)}                <span>Res</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_resistance" readonly tabindex="-1" title="@{resistance}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Ride">
${" ".repeat(padding)}                <span>Rid</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_ride" readonly tabindex="-1" title="@{ride}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Sail">
${" ".repeat(padding)}                <span>Sai</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_sail" readonly tabindex="-1" title="@{sail}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Socialize">
${" ".repeat(padding)}                <span>Soc</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_socialize" readonly tabindex="-1" title="@{socialize}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Stealth">
${" ".repeat(padding)}                <span>Ste</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_stealth" readonly tabindex="-1" title="@{stealth}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Survival">
${" ".repeat(padding)}                <span>Sur</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_survival" readonly tabindex="-1" title="@{survival}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Thrown">
${" ".repeat(padding)}                <span>Thr</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_thrown" readonly tabindex="-1" title="@{thrown}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="War">
${" ".repeat(padding)}                <span>War</span>
${" ".repeat(padding)}                <input type="number" class="reminder-val" name="attr_war" readonly tabindex="-1" title="@{war}">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <input type="hidden" class="rep-enabled-check" name="attr_rep-abi-enabled" />
${" ".repeat(padding)}        <div class="rep-toggle">
${" ".repeat(padding)}            <hr />
${" ".repeat(padding)}            <fieldset class="repeating_abilities" style="display: none;">
${" ".repeat(padding)}                <div class="reminder-cell">
${" ".repeat(padding)}                    <input type="text" name="attr_repabilityname" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_repability" readonly tabindex="-1">
${" ".repeat(padding)}                </div>
${" ".repeat(padding)}            </fieldset>
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <h1><span>Specialties</span></h1>
${" ".repeat(padding)}        <fieldset class="repeating_specialty" style="display: none;">
${" ".repeat(padding)}            <div class="reminder-cell">
${" ".repeat(padding)}                <input type="text" name="attr_repspecialty" readonly tabindex="-1">
${" ".repeat(padding)}                <input type="text" class="reminder-val" name="attr_repspecialtyability" readonly tabindex="-1">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}        </fieldset>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}</div>`;
    return ret;
}

function getRemindersCraft(padding = 0) {
    let ret = /*html*/`<div class="sheet-box-reminder sheet-craft-reminder qc-toggle-display">
${" ".repeat(padding)}    <input type="checkbox" class="sheet-unnamed-toggle"><span title="Show Craft" class="sheet-layer6"></span>
${" ".repeat(padding)}    <div class="sheet-layer5">
${" ".repeat(padding)}        <div class="reminder-cell" title="Armoring">
${" ".repeat(padding)}            <span>Arm</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_craft-armoring" readonly tabindex="-1" title="@{craft-armoring}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Artifact">
${" ".repeat(padding)}            <span>Art</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_craft-artifact" readonly tabindex="-1" title="@{craft-artifact}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Cooking">
${" ".repeat(padding)}            <span>Coo</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_craft-cooking" readonly tabindex="-1" title="@{craft-cooking}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="First Age Artifice">
${" ".repeat(padding)}            <span>FAA</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_craft-artifice" readonly tabindex="-1" title="@{craft-artifice}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Gemcutting">
${" ".repeat(padding)}            <span>Gem</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_craft-gemcutting" readonly tabindex="-1" title="@{craft-gemcutting}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Geomancy">
${" ".repeat(padding)}            <span>Geo</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_craft-geomancy" readonly tabindex="-1" title="@{craft-geomancy}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Jewelry">
${" ".repeat(padding)}            <span>Jew</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_craft-jewelry" readonly tabindex="-1" title="@{craft-jewelry}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Tailoring">
${" ".repeat(padding)}            <span>Tai</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_craft-tailoring" readonly tabindex="-1" title="@{craft-tailoring}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Weapon Forging">
${" ".repeat(padding)}            <span>Wea</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_craft-forging" readonly tabindex="-1" title="@{craft-forging}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <input type="hidden" class="rep-enabled-check" name="attr_rep-crafts-enabled" />
${" ".repeat(padding)}        <div class="rep-toggle">
${" ".repeat(padding)}            <hr />
${" ".repeat(padding)}            <fieldset class="repeating_crafts" style="display: none;">
${" ".repeat(padding)}                <div class="reminder-cell">
${" ".repeat(padding)}                    <input type="text" name="attr_repcraftsname" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_repcrafts" readonly tabindex="-1">
${" ".repeat(padding)}                </div>
${" ".repeat(padding)}            </fieldset>
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}</div>`;
return ret;
}

function getRemindersMA(padding = 0) {
    let ret = /*html*/`<div class="sheet-box-reminder sheet-ma-reminder qc-toggle-display">
${" ".repeat(padding)}    <input type="checkbox" class="sheet-unnamed-toggle"><span title="Show M-A" class="sheet-layer5"></span>
${" ".repeat(padding)}    <div class="sheet-layer4">
${" ".repeat(padding)}        <div class="reminder-cell" title="Snake Style">
${" ".repeat(padding)}            <span>Sna</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_ma-snake" readonly tabindex="-1" title="@{ma-snake}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Tiger Style">
${" ".repeat(padding)}            <span>Tig</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_ma-tiger" readonly tabindex="-1" title="@{ma-tiger}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Single Point Shining Into the Void Style">
${" ".repeat(padding)}            <span>SPS</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_ma-void" readonly tabindex="-1" title="@{ma-void}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="White Reaper Style">
${" ".repeat(padding)}            <span>WR</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_ma-reaper" readonly tabindex="-1" title="@{ma-reaper}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Ebon Shadow Style">
${" ".repeat(padding)}            <span>ES</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_ma-ebon" readonly tabindex="-1" title="@{ma-ebon}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Crane Style">
${" ".repeat(padding)}            <span>Cra</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_ma-crane" readonly tabindex="-1" title="@{ma-crane}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Silver-Voiced Nightingale Style">
${" ".repeat(padding)}            <span>SVN</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_ma-nightingale" readonly tabindex="-1" title="@{ma-nightingale}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Righteous Devil Style">
${" ".repeat(padding)}            <span>RD</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_ma-devil" readonly tabindex="-1" title="@{ma-devil}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Black Claw Style">
${" ".repeat(padding)}            <span>BC</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_ma-claw" readonly tabindex="-1" title="@{ma-claw}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Dreaming Pearl Courtesan Style">
${" ".repeat(padding)}            <span>DPC</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_ma-pearl" readonly tabindex="-1" title="@{ma-pearl}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <div class="reminder-cell" title="Steel Devil Style">
${" ".repeat(padding)}            <span>SDS</span>
${" ".repeat(padding)}            <input type="number" class="reminder-val" name="attr_ma-steel" readonly tabindex="-1" title="@{ma-steel}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <input type="hidden" class="rep-enabled-check" name="attr_rep-ma-enabled" />
${" ".repeat(padding)}        <div class="rep-toggle">
${" ".repeat(padding)}            <hr />
${" ".repeat(padding)}            <fieldset class="repeating_martialarts" style="display: none;">
${" ".repeat(padding)}                <div class="reminder-cell">
${" ".repeat(padding)}                    <input type="text" name="attr_repmartialartsname" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_repmartialarts" readonly tabindex="-1">
${" ".repeat(padding)}                </div>
${" ".repeat(padding)}            </fieldset>
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}</div>`;
return ret;
}

function getRemindersQC(padding = 0) {
    let ret = /*html*/`<div class="sheet-box-reminder sheet-qcattr-reminder qc-toggle-display-inv">
${" ".repeat(padding)}    <input type="checkbox" class="sheet-unnamed-toggle"><span title="QCAttrs" class="sheet-layer6"></span>
${" ".repeat(padding)}    <div class="sheet-layer5">
${" ".repeat(padding)}        <div class="flex flex-wrap">
${" ".repeat(padding)}            <div class="reminder-cell" title="Read Intentions">
${" ".repeat(padding)}                <span>RI</span>
${" ".repeat(padding)}                <span>
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_qc-read-intentions" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="text" class="reminder-val qc-have-exc" name="attr_qc-read-intentions-exc" readonly tabindex="-1">
${" ".repeat(padding)}                </span>
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Social Influence">
${" ".repeat(padding)}                <span>SI</span>
${" ".repeat(padding)}                <span>
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_qc-social-influence" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="text" class="reminder-val qc-have-exc" name="attr_qc-social-influence-exc" readonly tabindex="-1">
${" ".repeat(padding)}                </span>
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Stealth/Larceny">
${" ".repeat(padding)}                <span>S/L</span>
${" ".repeat(padding)}                <span>
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_qc-stealth-larc" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="text" class="reminder-val qc-have-exc" name="attr_qc-stealth-larc-exc" readonly tabindex="-1">
${" ".repeat(padding)}                </span>
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Senses">
${" ".repeat(padding)}                <span>Sen</span>
${" ".repeat(padding)}                <span>
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_qc-senses" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="text" class="reminder-val qc-have-exc" name="attr_qc-senses-exc" readonly tabindex="-1">
${" ".repeat(padding)}                </span>
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Feats of Strength">
${" ".repeat(padding)}                <span>FoS</span>
${" ".repeat(padding)}                <span>
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_qc-fos-pool" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="text" class="reminder-val qc-have-exc" name="attr_qc-fos-pool-exc" readonly tabindex="-1">
${" ".repeat(padding)}                </span>
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <hr />
${" ".repeat(padding)}            <div class="reminder-cell" title="Join Battle">
${" ".repeat(padding)}                <span>JB</span>
${" ".repeat(padding)}                <span>
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_qc-join-battle" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="text" class="reminder-val qc-have-exc" name="attr_qc-join-battle-exc" readonly tabindex="-1">
${" ".repeat(padding)}                </span>
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Combat Movement">
${" ".repeat(padding)}                <span>Mvt</span>
${" ".repeat(padding)}                <span>
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_qc-move" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="text" class="reminder-val qc-have-exc" name="attr_qc-move-exc" readonly tabindex="-1">
${" ".repeat(padding)}                </span>
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Grapple">
${" ".repeat(padding)}                <span>Gra</span>
${" ".repeat(padding)}                <span>
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_qc-grapple" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="text" class="reminder-val qc-have-exc" name="attr_qc-grapple-exc" readonly tabindex="-1">
${" ".repeat(padding)}                </span>
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="reminder-cell" title="Grapple Control">
${" ".repeat(padding)}                <span>GrC</span>
${" ".repeat(padding)}                <span>
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_qc-grapple-control" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="text" class="reminder-val qc-have-exc" name="attr_qc-grapple-control-exc" readonly tabindex="-1">
${" ".repeat(padding)}                </span>
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <input type="hidden" class="hideous-check" name="attr_qc-hideous" value="0">
${" ".repeat(padding)}            <div class="reminder-cell" title="Appearance">
${" ".repeat(padding)}                <span>App</span>
${" ".repeat(padding)}                <span>
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_appearance" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="number" class="reminder-val not-visible qc-have-exc">
${" ".repeat(padding)}                </span>
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <hr />
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        <fieldset class="repeating_qcactions" style="display: none;">
${" ".repeat(padding)}            <div class="reminder-cell">
${" ".repeat(padding)}                <input type="text" name="attr_repqcactionname" readonly tabindex="-1">
${" ".repeat(padding)}                <span>
${" ".repeat(padding)}                    <input type="number" class="reminder-val" name="attr_repqcactiondice" readonly tabindex="-1">
${" ".repeat(padding)}                    <input type="text" class="reminder-val qc-have-exc" name="attr_repqcactiondice-exc" readonly tabindex="-1">
${" ".repeat(padding)}                </span>
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}        </fieldset>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}</div>`;
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
                                                            <input type="hidden" name="attr_rep-cost-total-base" value="(@{reprolls-ycharm-dices}+@{reprolls-ycharm-successes}*2+@{rep-cost-mote-offset})" disabled data-formula="(@{reprolls-ycharm-dices}+@{reprolls-ycharm-successes}*2+@{rep-cost-mote-offset})">
                                                            =<input type="number" name="attr_rep-cost-total" class="sheet-cost-mote sheet-cost-mote-total grow-normal mote-hint" value="(((@{rep-cost-total-base}) + abs(@{rep-cost-total-base})) / 2)" disabled data-formula="(((@{rep-cost-total-base}) + abs(@{rep-cost-total-base})) / 2)">
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
                                                        <select name="attr_reprolls-attr" title="Attribute for the Roll" class="grow-normal solar-hint lunar-hint">
                                                            ${returnOptions(60, attributes.map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), -1)}
                                                            <option disabled>-------RAW------</option>
                                                            ${returnOptions(60, [...Array(21).keys()].map(i => ({val: i + '[RAW]', label: i})), -1)}
                                                        </select>+
                                                        <select name="attr_reprolls-abi" title="Ability for the Roll" class="grow-normal solar-hint db-hint liminal-hint">
                                                            ${returnOptions(60, abilities.filter(i => typeof i === 'string').map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), -1)}
                                                            <option disabled>------CRAFTS-----</option>
                                                            ${returnOptions(60, Object.entries(craftAbilities.subSections).map(([k,v]) => ({val: `@{${v}}[${k}]`, label: k})), -1)}
                                                            <option disabled>-------M-A------</option>
                                                            ${returnOptions(60, Object.entries(maAbilities.subSections).map(([k,v]) => ({val: `@{${v}}[${k}]`, label: k})), -1)}
                                                            <option disabled>----ATTRIBUTES---</option>
                                                            ${returnOptions(60, attributes.map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), -1)}
                                                            <option disabled>-------RAW------</option>
                                                            ${returnOptions(60, [...Array(21).keys()].map(i => ({val: i + '[RAW]', label: i})), -1)}
                                                        </select>+
                                                    </div>
                                                    <div class="flex grow-normal basis-100">
                                                        <div class="inline-flex grow-normal">
                                                            <input type="hidden" name="attr_reprolls-stunt-dices" class="stunt-dices-check" value="0">
                                                            <select name="attr_reprolls-stunt-dices" class="sheet-rolls-stunt-dices grow-normal" title="Bonus dices for the Roll awarded by the Stunt">
                                                                ${returnOptions(64, [{val: 0, label: '(0) Std Stunt'},{val: 2, label: '(2) Stunt 1+'}])}
                                                            </select>+
                                                            <span class="specialty-box db-hint">
                                                                <input type="checkbox" name="attr_reprolls-specialty" class="sheet-rolls-specialty" title="Toggle Specialty" value="1">
                                                                <span class="sheet-spelleffect" title="Spé"></span>
                                                            </span>+
                                                        </div>
                                                        <div class="inline-flex grow-normal excellency-box" title="Excellency Box">
                                                            <input type="number" name="attr_reprolls-ycharm-dices" class="sheet-rolls-ycharm-dices grow-normal mote-hint mote-hint-one" title="Charm dices for the Roll&#013;&#010;Cost motes of Essence 1:1" value="0" placeholder="5" min="0">+
                                                            <input type="number" name="attr_reprolls-ycharm-paid-dices" class="sheet-rolls-ycharm-dices grow-normal" title="Charm dices for the Roll&#013;&#010;Cost already paid" value="0" placeholder="0" min="0">+
                                                        </div>
                                                        <div class="inline-flex grow-normal">
                                                            <input type="number" name="attr_reprolls-ncharm-dices" class="sheet-rolls-ncharm-dices grow-normal" title="Non Charm dices for the Roll&#013;&#010;Doesn't cost motes of Essence" value="0" placeholder="0">-
                                                            <label for="rollpen-input-widget"><span name="attr_roll-penalty" title="Roll penalty, applied to attacks & all standard rolls, not to damage ones." class="rollpenalty not-inverted"></span></label>-
                                                            <input type="number" value="@{wound-penalty}" disabled="disabled" title="Wound penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_woundpenalty2" class="woundpenalty not-inverted" data-formula="@{wound-penalty}">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex dice-area-total">
                                                    <span class="separator-box-mode">
                                                        <input type="checkbox" name="attr_reprolls-separator-mode" class="sheet-rolls-separator-hidden-checkbox" title="Toggle Separator Mode" value="1">
                                                        <span class="sheet-spelleffect" title="Toggle"></span>
                                                    </span>
                                                    <input type="hidden" name="attr_reprolls-dice-total-calc-base" value="(@{reprolls-attr}+@{reprolls-abi}+@{reprolls-stunt-dices}+@{reprolls-specialty}+@{reprolls-ycharm-dices}+@{reprolls-ycharm-paid-dices}+@{reprolls-ncharm-dices}-@{roll-penalty}-@{wound-penalty})" disabled data-formula="(@{reprolls-attr}+@{reprolls-abi}+@{reprolls-stunt-dices}+@{reprolls-specialty}+@{reprolls-ycharm-dices}+@{reprolls-ncharm-dices}-@{roll-penalty}-@{wound-penalty})">
                                                    =<input type="number" name="attr_reprolls-dice-total-calc" class="dice-total" value="(((@{reprolls-dice-total-calc-base}) + abs(@{reprolls-dice-total-calc-base})) / 2)" disabled data-formula="(((@{reprolls-dice-total-calc-base}) + abs(@{reprolls-dice-total-calc-base})) / 2)">D
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
                                                    <div class="inline-flex grow-normal excellency-box" title="Excellency Box">
                                                        <input type="number" name="attr_reprolls-ycharm-successes" class="sheet-rolls-ycharm-successes grow-normal mote-hint mote-hint-two inverted-color" title="Charm successes for the roll&#013;&#010;Cost motes of Essence 2:1 success" value="0" placeholder="1" min="0">+
                                                        <input type="number" name="attr_reprolls-ycharm-paid-successes" class="sheet-rolls-ycharm-successes grow-normal" title="Charm successes for the roll&#013;&#010;Cost already paid" value="0" placeholder="1" min="0">+
                                                    </div>
                                                    <div class="inline-flex grow-normal">
                                                        <input type="number" name="attr_reprolls-ncharm-successes" class="sheet-rolls-ncharm-successes grow-normal" title="Non Charm successes for the roll&#013;&#010;Doesn't cost motes of Essence" value="0" placeholder="0" min="0">
                                                    </div>
                                                </div>
                                                <div class="flex success-area-total">
                                                    =<input type="number" name="attr_reprolls-successes-total-calc" class="success-total" value="(@{reprolls-willpower-toggle}+@{reprolls-ycharm-successes}+@{reprolls-ycharm-paid-successes}+@{reprolls-ncharm-successes})" disabled data-formula="(@{reprolls-willpower-toggle}+@{reprolls-ycharm-successes}+@{reprolls-ncharm-successes})">S
                                                </div>
                                            </div>
                                            <div class="flex grow-normal">
                                                <select name="attr_reprolls-pool-starting" class="sheet-rolls-pool-starting" title="Bonus dices for the Roll awarded by the Stunt">
                                                    ${returnOptions(52, [{val: 1, label: 'Peripheral'},{val: 0, label: 'Personal'}])}
                                                </select>
                                                <input type="text" name="attr_reprolls-final-macro-options" class="sheet-rolls-macro-options grow-normal" title="Macro options for the Roll. Type '!exr -help' in chat to learn more" placeholder="-d 8,9 -R 1 -rl2 2,3">
                                                <input type="hidden" name="attr_reprolls-final-macro-replaced" class="sheet-rolls-final-macro-replaced">
                                                <input type="hidden" name="attr_rep-cost-macro" class="sheet-cost-macro">
                                                <div class="sheet-grouped-buttons end interactive-roll" title="Cast Custom Roll">
                                                    <div class="interactive-roll">
                                                        <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_roll-widget-cast" value="!exr @{reprolls-final-macro-replaced} @{rep-cost-macro}">Cast</button>
                                                        <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_roll-widget-gmcast" value="!exr @{reprolls-final-macro-replaced} -gm @{rep-cost-macro}">to GM</button>
                                                    </div>
                                                    <div class="companion-roll">
                                                        <button type="roll" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="roll_roll-widget-cast" value="!exr @{reprolls-final-macro-replaced} @{rep-cost-macro}">Cast</button>
                                                        <button type="roll" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="roll_roll-widget-gmcast" value="!exr @{reprolls-final-macro-replaced} -gm @{rep-cost-macro}">to GM</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="excellency-cap-section" title="Limit Detail for the Excellency">
                                            <input type="hidden" name="attr_reprolls-caste" class="sheet-rolls-caste-val" disabled value="@{caste}">
                                            <div class="solar-type-excellency">
                                                <img class="caste-img">
                                                CAP
                                                <input type="hidden" name="attr_sign" value="(@{reprolls-exc-solar-total-calc} - @{reprolls-exc-solar-sum-calc})" disabled>
                                                <input type="number" name="attr_reprolls-exc-solar-sum-calc" class="exc-sum" value="(@{reprolls-ycharm-dices}+@{reprolls-ycharm-paid-dices}+(@{reprolls-ycharm-successes}+@{reprolls-ycharm-paid-successes})*2)" disabled title="Actual use of Excellency Cap">
                                                <hr />
                                                <input type="number" name="attr_reprolls-exc-solar-total-calc" class="exc-total" value="(@{reprolls-attr}+@{reprolls-abi})" disabled title="Total limit of Excellency Cap&#013;&#010;Solar=>ATTR+ABI">
                                            </div>
                                            <div class="lunar-type-excellency">
                                                <img class="caste-img">
                                                CAP
                                                <select name="attr_reprolls-attr-lunar-exc" title="2nd Attribute for the Excellency" class="lunar-attr-excellency grow-normal lunar-hint">
                                                    ${returnOptions(52, [{val: '0', label: '---'}, ...attributes.map(i => ({val: `@{${i.toLowerCase()}}`, label: i.toLowerCase().substr(0, 3)}))], 0)}
                                                </select>
                                                <input type="hidden" name="attr_sign" value="(@{reprolls-exc-lunar-total-calc} - @{reprolls-exc-lunar-sum-calc})" disabled>
                                                <input type="number" name="attr_reprolls-exc-lunar-sum-calc" class="exc-sum" value="(@{reprolls-ycharm-dices}+@{reprolls-ycharm-paid-dices}+(@{reprolls-ycharm-successes}+@{reprolls-ycharm-paid-successes})*2)" disabled title="Actual use of Excellency Cap">
                                                <hr />
                                                <input type="number" name="attr_reprolls-exc-lunar-total-calc" class="exc-total" value="(@{reprolls-attr}+@{reprolls-attr-lunar-exc})" disabled title="Total limit of Excellency Cap&#013;&#010;Lunar=>ATTR, +ATTR2 if Stunted accordingly">
                                            </div>
                                            <div class="db-type-excellency">
                                                <img class="caste-img">
                                                CAP
                                                <input type="hidden" name="attr_sign" value="(@{reprolls-exc-db-total-calc} - @{reprolls-exc-db-sum-calc})" disabled>
                                                <input type="number" name="attr_reprolls-exc-db-sum-calc" class="exc-sum" value="(@{reprolls-ycharm-dices}+@{reprolls-ycharm-paid-dices}+(@{reprolls-ycharm-successes}+@{reprolls-ycharm-paid-successes})*2)" disabled title="Actual use of Excellency Cap">
                                                <hr />
                                                <input type="number" name="attr_reprolls-exc-db-total-calc" class="exc-total" value="(@{reprolls-abi}+@{reprolls-specialty})" disabled title="Total limit of Excellency Cap&#013;&#010;DB=>ABI+SPE">
                                            </div>
                                            <div class="liminal-type-excellency">
                                                <img class="caste-img">
                                                CAP
                                                <div class="anima-flare-box-mode liminal-hint">
                                                    <input type="checkbox" name="attr_reprolls-anima-flare" class="sheet-rolls-anima-flare-checkbox" title="Toggle Aura Flare" value="@{essence}">
                                                    <span class="sheet-spelleffect" title="Toggle"></span>
                                                </div>
                                                <input type="hidden" name="attr_sign" value="(@{reprolls-exc-liminal-total-calc} - @{reprolls-exc-liminal-sum-calc})" disabled>
                                                <input type="number" name="attr_reprolls-exc-liminal-sum-calc" class="exc-sum" value="(@{reprolls-ycharm-dices}+@{reprolls-ycharm-paid-dices}+(@{reprolls-ycharm-successes}+@{reprolls-ycharm-paid-successes})*2)" disabled title="Actual use of Excellency Cap">
                                                <hr />
                                                <input type="number" name="attr_reprolls-exc-liminal-total-calc" class="exc-total" value="(@{reprolls-abi}+@{reprolls-anima-flare})" disabled title="Total limit of Excellency Cap&#013;&#010;Liminal=>ABI, +ESSENCE if Anima Flare">
                                            </div>
                                            <div class="sidereal-type-excellency">
                                                <img class="caste-img">
                                                CAP
                                                <input type="hidden" name="attr_sign" value="(@{reprolls-exc-sidereal-total-calc} - @{reprolls-exc-sidereal-sum-calc})" disabled>
                                                <input type="number" name="attr_reprolls-exc-sidereal-sum-calc" class="exc-sum" value="(@{reprolls-ycharm-dices}+@{reprolls-ycharm-paid-dices}+(@{reprolls-ycharm-successes}+@{reprolls-ycharm-paid-successes})*2)" disabled title="Actual use of Excellency Cap">
                                                <hr />
                                                <input type="hidden" name="attr_reprolls-exc-sidereal-total-calc-max" value="(((@{essence} + 3) + abs(@{essence} - 3)) / 2)" disabled>
                                                <input type="number" name="attr_reprolls-exc-sidereal-total-calc" class="exc-total" value="(((@{reprolls-exc-sidereal-total-calc-max} + 5) - abs(@{reprolls-exc-sidereal-total-calc-max} - 5)) / 2)" disabled title="Total limit of Excellency Cap&#013;&#010;Sidereal=> Based on ESSENCE, min 3, max 5">
                                            </div>
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
                                        <div class="header-section" title="Configurable Roll&#013;&#010;TOGGLE EDIT MODE ON CLICK">
                                            <div class="edit-toggle">
                                                <input type="checkbox" name="attr_reprolls-toggle-edit" class="sheet-rolls-toggle-edit" value="1">
                                                <span title="Roll:"></span>
                                            </div>
                                        </div>
                                        <div class="inner-section">
                                            <div class="flex grow-normal">
                                                <div class="flex grow-normal">
                                                    (<select name="attr_reprolls-attr" title="Attribute for the Roll" class="grow-normal">
                                                        ${returnOptions(56, attributes.map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), -1)}
                                                        <option disabled>-------ATTRIBUTES PROMPTS------</option>
                                                        <option value="?{Physical Attribute ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]}">Physical Prompt</option>
                                                        <option value="?{Social Attribute ?|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]}">Social Prompt</option>
                                                        <option value="?{Mental Attribute ?|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Mental Prompt</option>
                                                        <option value="?{Full Attribute ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Full Prompt</option>
                                                        <option value="?{Custom Attribute}[Custom]">Simple Prompt</option>
                                                        <option disabled>-------RAW------</option>
                                                        ${returnOptions(56, [...Array(11).keys()].map(i => ({val: i + '[RAW]', label: i})), -1)}
                                                    </select>+
                                                    <select name="attr_reprolls-abi" title="Ability for the Roll" class="grow-normal">
                                                        ${returnOptions(56, abilities.filter(i => typeof i === 'string').map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), -1)}
                                                        <option disabled>-------ABILITIES PROMPTS------</option>
                                                        <option value="?{Craft|Armoring (@{craft-armoring}),@{craft-armoring}[Armoring]|Artifact (@{craft-artifact}),@{craft-artifact}[Artifact]|Cooking (@{craft-cooking}),@{craft-cooking}[Cooking]|First Age Artifice (@{craft-artifice}),@{craft-artifice}[First Age Artifice]|Gemcutting (@{craft-gemcutting}),@{craft-gemcutting}[Gemcutting]|Geomancy (@{craft-geomancy}),@{craft-geomancy}[Geomancy]|Jewelry (@{craft-jewelry}),@{craft-jewelry}[Jewelry]|Tailoring (@{craft-tailoring}),@{craft-tailoring}[Tailoring]|Weapon Forging (@{craft-forging}),@{craft-forging}[Weapon Forging]|Other,?{Enter the number of Craft dots&amp;#124;0&amp;#125;[Other-Craft]}">Craft Prompt</option>
                                                        <option value="?{Martial Arts|Snake Style (@{ma-snake}),@{ma-snake}[Snake Style]|Tiger Style (@{ma-tiger}),@{ma-tiger}[Tiger Style]|Single Point Shining Into The Void Style (@{ma-void}),@{ma-void}[Single Point Shining Into The Void Style]|White Reaper Style (@{ma-reaper}),@{ma-reaper}[White Reaper Style]|Ebon Shadow Style (@{ma-ebon}),@{ma-ebon}[Ebon Shadow Style]|Crane Style (@{ma-crane}),@{ma-crane}[Crane Style]|Silver-voiced Nightingale Style (@{ma-nightingale}),@{ma-nightingale}[Silver-voiced Nightingale Style]|Righteous Devil Style (@{ma-devil}),@{ma-devil}[Righteous Devil Style]|Black Claw Style (@{ma-claw}),@{ma-claw}[Black Claw Style]|Dreaming Pearl Courtesan Style (@{ma-pearl}),@{ma-pearl}[Dreaming Pearl Courtesan Style]|Steel Devil Style (@{ma-steel}),@{ma-steel}[Steel Devil Style]|Other,?{Enter the number of M.A. dots of this style&amp;#124;0&amp;#125;[Other-MA]}">Martial Arts Prompt</option>
                                                        <option value="${buildAbilityPrompt(56)}">Full Ability Prompt</option>
                                                        <option value="?{Custom Ability}">Simple Prompt</option>
                                                        <option disabled>----ATTRIBUTES---</option>
                                                        ${returnOptions(56, attributes.map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), -1)}
                                                        <option disabled>-------ATTRIBUTES PROMPTS------</option>
                                                        <option value="?{Physical Attribute 2 ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]}">Physical Prompt</option>
                                                        <option value="?{Social Attribute 2 ?|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]}">Social Prompt</option>
                                                        <option value="?{Mental Attribute 2 ?|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Mental Prompt</option>
                                                        <option value="?{Full Attribute 2 ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Full Attribute Prompt</option>
                                                        <option disabled>-------RAW------</option>
                                                        ${returnOptions(56, [...Array(11).keys()].map(i => ({val: i + '[RAW]', label: i})), -1)}
                                                    </select>
                                                </div>
                                                <div class="flex grow-max">
                                                    <button type="action" name="act_default-macro-d" class="stealth-btn" title="Override/Set additional dice Default Macro">+</button>
                                                    <input type="text" name="attr_reprolls-bonus-dices" class="sheet-rolls-bonus-dices grow-normal" title="Bonus dices for the Roll (Stunt for example, ...)&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations" placeholder="2+?{Added Dices ?|0}">-
                                                    <input type="number" value="@{roll-penalty}" disabled="disabled" title="Roll penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_rollpenalty2" class="rollpenalty" data-formula="@{roll-penalty}">-
                                                    <input type="number" value="@{wound-penalty}" disabled="disabled" title="Wound penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_woundpenalty2" class="woundpenalty" data-formula="@{wound-penalty}">d)
                                                </div>
                                            </div>
                                            <div class="flex grow-normal">
                                                <button type="action" name="act_default-macro-s" class="stealth-btn" title="Override/Set additional success Default Macro">+</button>
                                                <input type="text" name="attr_reprolls-bonus-successes" class="sheet-rolls-bonus-successes grow-normal" title="Bonus successes for the roll (Willpower for example, ...)&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations" placeholder="?{Bonus succès ?|0}">s
                                                <input type="hidden" name="attr_reprolls-final-macro-replaced" class="sheet-rolls-final-macro-replaced">
                                                <input type="hidden" name="attr_rep-cost-macro" class="sheet-cost-macro">
                                                <input type="text" name="attr_reprolls-final-macro-options" class="sheet-rolls-macro-options grow-normal" title="Macro options for the Roll. Type '!exr -help' in chat to learn more" placeholder="-d 8,9 -R 1 -rl2 2,3">
                                                <div class="sheet-grouped-buttons end interactive-roll" title="Cast Custom Roll">
                                                    <div class="interactive-roll">
                                                        <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_roll-cast" value="!exr @{reprolls-final-macro-replaced} @{rep-cost-macro}">Cast</button>
                                                        <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_roll-gmcast" value="!exr @{reprolls-final-macro-replaced} -gm @{rep-cost-macro}">to GM</button>
                                                    </div>
                                                    <div class="companion-roll">
                                                        <button type="roll" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="roll_roll-cast" value="!exr @{reprolls-final-macro-replaced} @{rep-cost-macro}">Cast</button>
                                                        <button type="roll" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="roll_roll-gmcast" value="!exr @{reprolls-final-macro-replaced} -gm @{rep-cost-macro}">to GM</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex roll-section hide-on-edit">
                                        <div class="header-section" title="Configurable Roll&#013;&#010;TOGGLE EDIT MODE ON CLICK">
                                            <div class="edit-toggle">
                                                <input type="checkbox" name="attr_reprolls-toggle-edit" class="sheet-rolls-toggle-edit" value="1">
                                                <span title="Roll:"></span>
                                            </div>
                                        </div>
                                        <div class="inner-section flex">
                                            <input type="hidden" name="attr_reprolls-final-macro-replaced" class="sheet-init-final-macro-replaced">
                                            <input type="hidden" name="attr_rep-cost-macro" class="sheet-cost-macro">
                                            <div class="sheet-grouped-buttons end interactive-roll" title="Cast Custom Roll">
                                                <div class="interactive-roll">
                                                    <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_roll-cast" value="!exr @{reprolls-final-macro-replaced} @{rep-cost-macro}">Cast</button>
                                                    <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_roll-gmcast" value="!exr @{reprolls-final-macro-replaced} -gm @{rep-cost-macro}">to GM</button>
                                                </div>
                                                <div class="companion-roll">
                                                    <button type="roll" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="roll_roll-cast" value="!exr @{reprolls-final-macro-replaced} @{rep-cost-macro}">Cast</button>
                                                    <button type="roll" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="roll_roll-gmcast" value="!exr @{reprolls-final-macro-replaced} -gm @{rep-cost-macro}">to GM</button>
                                                </div>
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

function getSocialHeadline(padding = 0, includeExc = false) {
    let ret = /*html*/`<div class="head-line flex flex-wrap">`;
    if (includeExc) ret += /*html*/`
${" ".repeat(padding+4)}${getRemindersCharms(padding+4)}`;
    ret += /*html*/`
${" ".repeat(padding)}    <div class="flex">
${" ".repeat(padding)}        <div class="sheet-table-cell sheet-text-right" title="(Wits + Integrity)/2"><span>Resolve</span>:</div>
${" ".repeat(padding)}        <div class="sheet-table-cell">
${" ".repeat(padding)}            <input type="hidden" class="qc-panel-check" name="attr_qc">
${" ".repeat(padding)}            <input type="number" value="(ceil((@{wits} + @{integrity}) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="resolve-without-specialty" title="@{resolve}&#013;&#010;Resolve without specialty" name="attr_resolve" class="wound-taint"><input type="number" value="(ceil(((@{wits} + @{integrity}) + 1) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="resolve-with-specialty" title="@{resolve-specialty}&#013;&#010;Resolve with specialty" name="attr_resolve-specialty" class="wound-taint qc-toggle-display last-visible"><input type="text" name="attr_qc-resolve-exc" class="qc-have-exc qc-toggle-display-inv" title="Excellency cap" readonly tabindex="-1">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}    <div class="flex">
${" ".repeat(padding)}        <div class="sheet-table-cell sheet-text-right" title="(Manipulation + Socialize)/2"><span>Guile</span>:</div>
${" ".repeat(padding)}        <div class="sheet-table-cell">
${" ".repeat(padding)}            <input type="hidden" class="qc-panel-check" name="attr_qc">
${" ".repeat(padding)}            <input type="number" value="(ceil((@{manipulation} + @{socialize}) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="guile-without-specialty" title="@{guile}&#013;&#010;Guile without specialty" name="attr_guile" class="wound-taint"><input type="number" value="(ceil(((@{manipulation} + @{socialize}) + 1) / 2) - abs(@{wound-penalty}))" disabled="disabled" data-i18n-title="guile-with-specialty" title="@{guile-specialty}&#013;&#010;Guile with specialty" name="attr_guile-specialty" class="wound-taint qc-toggle-display last-visible"><input type="text" name="attr_qc-guile-exc" class="qc-have-exc qc-toggle-display-inv" title="Excellency cap" readonly tabindex="-1">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}    </div>`;
    if (includeExc) {
        ret += /*html*/`
${" ".repeat(padding)}    <div class="sheet-table-cell def-exc">
${" ".repeat(padding)}        <button type="roll" class="sheet-roll btn ui-draggable default-whisper" name="act_defexc" title="quick access to Generic Defense Excellency (!NOT the one editable in Other!)" value="&amp;{template:exalted3e_cast} {{charm-name=Generic Defense Excellency}} {{character-name=@{character_name}}} {{aspect=@{caste-low}}} {{balanced=0}} {{type=Supplemental}} {{cost=[[?{Defense Added ?|1} * 2]]}} {{duration=Instant}} {{description=The Exalt infuse her essence inside her defenses to appear impenetrable.}} {{effect=The Exalt add [[?{Defense Added ?|1}]] to the static value of the related defense.}}\\n!exr ${moteCostBase}${moteCostPromptBase}[[?{Defense Added ?|1} * 2]]">Def Exc</button>
${" ".repeat(padding)}    </div>`;
    }
    ret += /*html*/`
${" ".repeat(padding)}    <div class="flex">
${" ".repeat(padding)}        <div class="sheet-table-cell sheet-text-right"><span>Already included wound penalty</span>:</div>
${" ".repeat(padding)}        <div class="sheet-table-cell">
${" ".repeat(padding)}            <input type="hidden" class="wound-penalty-check" name="attr_wound-penalty">
${" ".repeat(padding)}            <input type="number" value="-@{wound-penalty}" disabled="disabled" style="width: 27px ; margin-right: 2px" title="-@{wound-penalty}&#013;&#010;Wound penalty" name="attr_woundpenalty2" class="woundpenalty-input" data-formula="-@{wound-penalty}">
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}</div>`;
    return ret;
}

function getSocialStatCol(padding = 0) {
    const getStatBlock = (attr, qcToggle = true) => /*html*/`<div class="sheet-table-row${qcToggle ?' qc-toggle-display' : ''}">
${" ".repeat(padding)}            <div class="sheet-table-cell"><span>${attr}</span>:</div><div class="sheet-table-cell"><input type="number" name="attr_${attr.toLowerCase()}" style="width: 27px ; margin-right: 3px" title="@{${attr.toLowerCase()}}&#013;&#010;${attr}" readonly tabindex="-1"></div>
${" ".repeat(padding)}        </div>`;
    return /*html*/`<div class="sheet-col stat-col">
${" ".repeat(padding)}    <input type="hidden" class="qc-panel-check" name="attr_qc">
${" ".repeat(padding)}    <h1><span>Attributes</span></h1>
${" ".repeat(padding)}    <div class="sheet-table">
${" ".repeat(padding)}        <input type="hidden" class="qc-panel-check" name="attr_qc">
${" ".repeat(padding)}        ${getStatBlock('Perception')}
${" ".repeat(padding)}        ${getStatBlock('Charisma')}
${" ".repeat(padding)}        ${getStatBlock('Manipulation')}
${" ".repeat(padding)}        <div class="sheet-table-row qc-toggle-display-inv">
${" ".repeat(padding)}            <div class="sheet-table-cell flex" style="flex-grow: 1;">
${" ".repeat(padding)}                <span>S.Inf.</span>:<input type="text" name="attr_qc-social-influence-type" class="sheet-qc-soc-influence-type-display grow-normal" readonly tabindex="-1">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}            <div class="sheet-table-cell">
${" ".repeat(padding)}                <input type="number" name="attr_qc-social-influence" style="width: 27px ; margin-right: 3px" title="QC Social Influence" readonly tabindex="-1">
${" ".repeat(padding)}            </div>
${" ".repeat(padding)}        </div>
${" ".repeat(padding)}        ${getStatBlock('Appearance',false)}
${" ".repeat(padding)}        ${getStatBlock('Wits')}
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}    <h1 class="qc-toggle-display"><span>Abilities</span></h1>
${" ".repeat(padding)}    <div class="sheet-table qc-toggle-display">
${" ".repeat(padding)}        ${getStatBlock('Socialize',false)}
${" ".repeat(padding)}        ${getStatBlock('Survival',false)}
${" ".repeat(padding)}        ${getStatBlock('Presence',false)}
${" ".repeat(padding)}        ${getStatBlock('Performance',false)}
${" ".repeat(padding)}        ${getStatBlock('Integrity',false)}
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}</div>`;
}

outHtml += /*html*/`
            <div class="sheet-body sheet-tab-content sheet-tab-intimacies-sheet">
                <h1><span>Social attributes and abilities</span></h1>
                ${getRessourceLine(16, false, true)}
                ${getSocialHeadline(16, true)}
                <div class="sheet-3colrow">
                    ${getSocialStatCol(20, true)}
                    <div class="sheet-3col inti-col">
                        <h1><span>Intimacies</span></h1>
                        <div class="intimacy-qol-button">
                            <button type="action" name="act_add-default-intimacy-categories" class="btn" title="Add a line for Principles, Ties, Inspire and one sub category for example">Add Usefull Lines</button>
                        </div>
                        <input type="hidden" value="0" name="attr_init-intimacies">
                        <div class="sheet-table" style="table-layout: fixed;">
                            <div class="sheet-table-header">
                                <div class="sheet-table-row">
                                    <div class="sheet-table-cell" style="width: 1.0em;">XP</div>
                                    <div class="sheet-table-cell" style="width: 2.8em;">Tainted</div>
                                    <div class="sheet-table-cell">Intimacy</div>
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
                                    <label style="margin-left: 0.9em;"><input type="checkbox" name="attr_intimacyrepeatingtaint" value="1"><span></span></label>
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
                    ${getSocialStatCol(20, true)}
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
                                        ${returnOptions(40, [{val: 'none', label: 'None'}, ...['Minor','Major','Defining'].map(i => ({val: i, label: i}))])}
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

function getCombatDisablePenAndCrippling(padding = 0) {
    return /*html*/`<div class="flex flex-wrap flex-col">
${" ".repeat(padding)}    <div class="crippling-box"><!-- DISABLE BOX -->
${" ".repeat(padding)}        <input type="checkbox" name="attr_combat-disable-pen" class="sheet-crippling-pen sheet-disable-pen" value="1">
${" ".repeat(padding)}        <span class="sheet-spelleffect" title="NoPen:"></span>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}    <div class="crippling-box"><!-- CRIPPLING BOX -->
${" ".repeat(padding)}        <input type="checkbox" name="attr_combat-crippling-pen" class="sheet-crippling-pen" value="1">
${" ".repeat(padding)}        <span class="sheet-spelleffect" title="Crippling:"></span>
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}    <div class="wound-pen"><!-- WOUND PEN -->
${" ".repeat(padding)}        <input type="hidden" class="wound-penalty-check" name="attr_wound-penalty">
${" ".repeat(padding)}        <input type="number" value="@{wound-penalty}" disabled="disabled" title="@{wound-penalty}&#013;&#010;Wound penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_woundpenalty2" class="woundpenalty-input" data-formula="@{wound-penalty}">
${" ".repeat(padding)}        <input type="number" value="0" title="Wound penalty Additional" name="attr_woundpenalty-add" class="woundpenalty-add-input">
${" ".repeat(padding)}        <input type="number" value="0" title="@{roll-penalty}&#013;&#010;Roll penalty" name="attr_rollpenalty-input" class="rollpenalty-input">
${" ".repeat(padding)}    </div>
${" ".repeat(padding)}</div>`;
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
                            <p class="flex grow-normal" title="@{battlegroup-magnitude} & @{battlegroup-magnitude_max}&#013;&#010;Represent a BG 'health'.">Magnitude:
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
                                            ${returnOptions(44, attributes.map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), 8)}
                                            <option disabled>-------ATTRIBUTES PROMPTS------</option>
                                            <option value="?{Physical Attribute ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]}">Physical Prompt</option>
                                            <option value="?{Social Attribute ?|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]}">Social Prompt</option>
                                            <option value="?{Mental Attribute ?|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Mental Prompt</option>
                                            <option value="?{Full Attribute ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Full Prompt</option>
                                            <option value="?{Custom Attribute}[Custom]">Simple Prompt</option>
                                            <option disabled>-------RAW------</option>
                                            ${returnOptions(44, [...Array(11).keys()].map(i => ({val: i + '[RAW]', label: i})), -1)}
                                        </select>+
                                        <select name="attr_repinit-abi" title="Ability for the Roll" class="grow-normal">
                                            ${returnOptions(44, abilities.filter(i => typeof i === 'string').map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), 2)}
                                            <option disabled>-------ABILITIES PROMPTS------</option>
                                            <option value="?{Craft|Armoring (@{craft-armoring}),@{craft-armoring}[Armoring]|Artifact (@{craft-artifact}),@{craft-artifact}[Artifact]|Cooking (@{craft-cooking}),@{craft-cooking}[Cooking]|First Age Artifice (@{craft-artifice}),@{craft-artifice}[First Age Artifice]|Gemcutting (@{craft-gemcutting}),@{craft-gemcutting}[Gemcutting]|Geomancy (@{craft-geomancy}),@{craft-geomancy}[Geomancy]|Jewelry (@{craft-jewelry}),@{craft-jewelry}[Jewelry]|Tailoring (@{craft-tailoring}),@{craft-tailoring}[Tailoring]|Weapon Forging (@{craft-forging}),@{craft-forging}[Weapon Forging]|Other,?{Enter the number of Craft dots&amp;#124;0&amp;#125;[Other-Craft]}">Craft Prompt</option>
                                            <option value="?{Martial Arts|Snake Style (@{ma-snake}),@{ma-snake}[Snake Style]|Tiger Style (@{ma-tiger}),@{ma-tiger}[Tiger Style]|Single Point Shining Into The Void Style (@{ma-void}),@{ma-void}[Single Point Shining Into The Void Style]|White Reaper Style (@{ma-reaper}),@{ma-reaper}[White Reaper Style]|Ebon Shadow Style (@{ma-ebon}),@{ma-ebon}[Ebon Shadow Style]|Crane Style (@{ma-crane}),@{ma-crane}[Crane Style]|Silver-voiced Nightingale Style (@{ma-nightingale}),@{ma-nightingale}[Silver-voiced Nightingale Style]|Righteous Devil Style (@{ma-devil}),@{ma-devil}[Righteous Devil Style]|Black Claw Style (@{ma-claw}),@{ma-claw}[Black Claw Style]|Dreaming Pearl Courtesan Style (@{ma-pearl}),@{ma-pearl}[Dreaming Pearl Courtesan Style]|Steel Devil Style (@{ma-steel}),@{ma-steel}[Steel Devil Style]|Other,?{Enter the number of M.A. dots of this style&amp;#124;0&amp;#125;[Other-MA]}">Martial Arts Prompt</option>
                                            <option value="${buildAbilityPrompt(44)}">Full Ability Prompt</option>
                                            <option value="?{Custom Ability}">Simple Prompt</option>
                                            <option disabled>----ATTRIBUTES---</option>
                                            ${returnOptions(44, attributes.map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), -1)}
                                            <option disabled>-------ATTRIBUTES PROMPTS------</option>
                                            <option value="?{Physical Attribute 2 ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]}">Physical Prompt</option>
                                            <option value="?{Social Attribute 2 ?|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]}">Social Prompt</option>
                                            <option value="?{Mental Attribute 2 ?|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Mental Prompt</option>
                                            <option value="?{Full Attribute 2 ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Full Attribute Prompt</option>
                                            <option disabled>-------RAW------</option>
                                            ${returnOptions(44, [...Array(11).keys()].map(i => ({val: i + '[RAW]', label: i})), -1)}
                                        </select>
                                    </div>
                                    <div class="flex grow-max">
                                        <button type="action" name="act_default-macro-d" class="stealth-btn" title="Override/Set additional dice Default Macro">+</button>
                                        <input type="text" name="attr_repinit-bonus-dices" class="sheet-init-bonus-dices grow-normal" title="Bonus dices for the Roll (Stunt for example, ...)&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations" value="${defaultRoll20AddedDicePrompt}">-
                                        <input type="number" value="@{roll-penalty}" disabled="disabled" title="Roll penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_rollpenalty2" class="rollpenalty" data-formula="@{roll-penalty}">-
                                        <input type="number" value="@{wound-penalty}" disabled="disabled" title="Wound penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_woundpenalty2" class="woundpenalty" data-formula="@{wound-penalty}">d)
                                    </div>
                                </div>
                                <div class="init-section third-line grow-normal flex">
                                    <div class="flex grow-max">
                                        <button type="action" name="act_default-macro-s" class="stealth-btn" title="Override/Set additional success Default Macro">+</button>
                                        <input type="text" name="attr_repinit-bonus-successes" class="sheet-init-bonus-successes grow-double" value="${baseInit}${defaultRoll20AddedSuccPrompt}" title="Bonus successes for the roll (Willpower for example, ...)&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations">s
                                        <input type="hidden" name="attr_repinit-final-macro-replaced" class="sheet-init-final-macro-replaced">
                                        <input type="hidden" name="attr_rep-cost-macro" class="sheet-cost-macro" value="${moteCostBase}${fullWpPrompt}">
                                        <input type="text" name="attr_repinit-final-macro-options" class="sheet-init-macro-options grow-normal" title="Macro options for the Roll. Type '!exr -help' in chat to learn more" placeholder="-d 8,9 -R 1 -rl2 2,3">
                                    </div>
                                    <div class="sheet-grouped-buttons" title="Cast INIT Rolls (Remember to select you token to set INIT correctly)">
                                        <div class="interactive-roll">
                                            <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_init-cast" value="!exr @{repinit-final-macro-replaced} -turn @{rep-cost-macro}">Cast</button>
                                            <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_init-gmcast" value="!exr @{repinit-final-macro-replaced} -turn -gm @{rep-cost-macro}">to GM</button>
                                        </div>
                                        <div class="companion-roll">
                                            <button type="roll" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="roll_init-cast" value="!exr @{repinit-final-macro-replaced} -turn @{rep-cost-macro}">Cast</button>
                                            <button type="roll" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="roll_init-gmcast" value="!exr @{repinit-final-macro-replaced} -turn -gm @{rep-cost-macro}">to GM</button>
                                        </div>
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
                                            <label>Acc:<input type="number" name="attr_repcombat-weap-atk" class="sheet-weap-atk grow-normal" value="4" title="Accuracy of the Weapon used&#013;&#010;Used in Withering Attacks as is (refer to color)&#013;&#010;Use the withering attack bonus dice field for varying accuracy value"></label>
                                        </p>
                                        <p class="dmg-color rounded-box grow-normal flex">
                                            <label>Dmg:<input type="number" name="attr_repcombat-weap-dmg" class="sheet-weap-dmg grow-normal" value="7" title="Damage of the Weapon used&#013;&#010;Used in Withering Damage as is (refer to color)&#013;&#010;Use the withering damage bonus dice field for varying damage value"></label>
                                        </p>
                                        <p class="ovw-color rounded-box grow-normal flex">
                                            <label>Ovw:<input type="number" name="attr_repcombat-weap-ovw" class="sheet-weap-ovw grow-normal" value="1" title="Overwhelming of the Weapon used&#013;&#010;Used in Withering Damage to set the minimum dice to be rolled in any case&#013;&#010;Set before each attach if multiple Overwhelming values"></label>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" name="attr_combat-toggle-desc" class="sheet-combat-toggle-desc-val" value="0">
                            <textarea name="attr_repcombat-desc" class="combat-textarea"></textarea>
                            <div class="attack-section withering-section show-on-edit">
                                <div class="header-section" title="An Attack vs An Opponent with mostly narrative damage but build momentum (Initiative)&#013;&#010;TOGGLE EDIT MODE ON CLICK">
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
                                                    ${returnOptions(52, attributes.map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), 1)}
                                                    <option disabled>-------ATTRIBUTES PROMPTS------</option>
                                                    <option value="?{Physical Attribute ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]}">Physical Prompt</option>
                                                    <option value="?{Social Attribute ?|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]}">Social Prompt</option>
                                                    <option value="?{Mental Attribute ?|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Mental Prompt</option>
                                                    <option value="?{Full Attribute ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Full Prompt</option>
                                                    <option value="?{Custom Attribute}[Custom]">Simple Prompt</option>
                                                    <option disabled>-------RAW------</option>
                                                    ${returnOptions(52, [...Array(11).keys()].map(i => ({val: i + '[RAW]', label: i})), -1)}
                                                </select>+
                                                <select name="attr_repcombat-watk-abi" title="Ability for the Roll" class="grow-normal">
                                                    ${returnOptions(52, abilities.filter(i => typeof i === 'string').map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), 3)}
                                                    <option disabled>-------ABILITIES PROMPTS------</option>
                                                    <option value="?{Craft|Armoring (@{craft-armoring}),@{craft-armoring}[Armoring]|Artifact (@{craft-artifact}),@{craft-artifact}[Artifact]|Cooking (@{craft-cooking}),@{craft-cooking}[Cooking]|First Age Artifice (@{craft-artifice}),@{craft-artifice}[First Age Artifice]|Gemcutting (@{craft-gemcutting}),@{craft-gemcutting}[Gemcutting]|Geomancy (@{craft-geomancy}),@{craft-geomancy}[Geomancy]|Jewelry (@{craft-jewelry}),@{craft-jewelry}[Jewelry]|Tailoring (@{craft-tailoring}),@{craft-tailoring}[Tailoring]|Weapon Forging (@{craft-forging}),@{craft-forging}[Weapon Forging]|Other,?{Enter the number of Craft dots&amp;#124;0&amp;#125;[Other-Craft]}">Craft Prompt</option>
                                                    <option value="?{Martial Arts|Snake Style (@{ma-snake}),@{ma-snake}[Snake Style]|Tiger Style (@{ma-tiger}),@{ma-tiger}[Tiger Style]|Single Point Shining Into The Void Style (@{ma-void}),@{ma-void}[Single Point Shining Into The Void Style]|White Reaper Style (@{ma-reaper}),@{ma-reaper}[White Reaper Style]|Ebon Shadow Style (@{ma-ebon}),@{ma-ebon}[Ebon Shadow Style]|Crane Style (@{ma-crane}),@{ma-crane}[Crane Style]|Silver-voiced Nightingale Style (@{ma-nightingale}),@{ma-nightingale}[Silver-voiced Nightingale Style]|Righteous Devil Style (@{ma-devil}),@{ma-devil}[Righteous Devil Style]|Black Claw Style (@{ma-claw}),@{ma-claw}[Black Claw Style]|Dreaming Pearl Courtesan Style (@{ma-pearl}),@{ma-pearl}[Dreaming Pearl Courtesan Style]|Steel Devil Style (@{ma-steel}),@{ma-steel}[Steel Devil Style]|Other,?{Enter the number of M.A. dots of this style&amp;#124;0&amp;#125;[Other-MA]}">Martial Arts Prompt</option>
                                                    <option value="${buildAbilityPrompt(52)}">Full Ability Prompt</option>
                                                    <option value="?{Custom Ability}">Simple Prompt</option>
                                                    <option disabled>----ATTRIBUTES---</option>
                                                    ${returnOptions(52, attributes.map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), -1)}
                                                    <option disabled>-------ATTRIBUTES PROMPTS------</option>
                                                    <option value="?{Physical Attribute 2 ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]}">Physical Prompt</option>
                                                    <option value="?{Social Attribute 2 ?|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]}">Social Prompt</option>
                                                    <option value="?{Mental Attribute 2 ?|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Mental Prompt</option>
                                                    <option value="?{Full Attribute 2 ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Full Attribute Prompt</option>
                                                    <option disabled>-------RAW------</option>
                                                    ${returnOptions(52, [...Array(11).keys()].map(i => ({val: i + '[RAW]', label: i})), -1)}
                                                </select>+
                                                <input type="number" name="attr_repcombat-weap-atk" class="sheet-weap-atk accu-color" readonly="readonly" title="Accuracy of the Weapon used&#013;&#010;Auto Filled, edit the field above">
                                            </div>
                                            <div class="flex grow-max">
                                                <button type="action" name="act_default-macro-watk-d" class="stealth-btn" title="Override/Set additional dice Default Macro depending on ability&#013;&#010;(Special for Archery & Thrown)">+</button>
                                                <input type="text" name="attr_repcombat-watk-bonus-dices" class="sheet-watk-bonus-dices grow-normal" title="Bonus dices for the Roll (Stunt for example, ...)&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations" placeholder="2+?{Added Dices ?|0}">
                                                <p class="sheet-bg-show">+<input type="number" value="@{battlegroup-size}+@{battlegroup-acc-boost}" disabled="disabled" name="attr_total-bg-dice" data-formula="@{battlegroup-size}+@{battlegroup-acc-boost}"></p>
                                                -<input type="number" value="@{roll-penalty}" disabled="disabled" title="Roll penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_rollpenalty2" class="rollpenalty" data-formula="@{roll-penalty}">-
                                                <input type="number" value="@{wound-penalty}" disabled="disabled" title="Wound penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_woundpenalty2" class="woundpenalty" data-formula="@{wound-penalty}">d)
                                            </div>
                                        </div>
                                        <div class="flex grow-normal">
                                            <button type="action" name="act_default-macro-watk-s" class="stealth-btn" title="Override/Set additional success Default Macro">+</button>
                                            <input type="text" name="attr_repcombat-watk-bonus-successes" class="sheet-watk-bonus-successes grow-double" title="Bonus successes for the roll (Willpower for example, ...)&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations" placeholder="?{Bonus succès ?|0}">s
                                            <input type="hidden" name="attr_repcombat-watk-final-macro-replaced" class="sheet-init-final-macro-replaced">
                                            <input type="hidden" name="attr_rep-cost-macro" class="sheet-cost-macro">
                                            <input type="text" name="attr_repcombat-watk-final-macro-options" class="sheet-init-macro-options grow-normal" title="Macro options for the Roll. Type '!exr -help' in chat to learn more" placeholder="-d 8,9 -R 1 -rl2 2,3">
                                            <div class="sheet-grouped-buttons end" title="Cast Withering Attack => Trying to Hit with Accuracy included">
                                                <div class="interactive-roll">
                                                    <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_cbt-watk-cast" value="!exr @{repcombat-watk-final-macro-replaced} @{rep-cost-macro} ==atk==">Cast</button>
                                                    <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_cbt-watk-gmcast" value="!exr @{repcombat-watk-final-macro-replaced} -gm @{rep-cost-macro} ==atk==">to GM</button>
                                                </div>
                                                <div class="companion-roll">
                                                    <button type="roll" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="roll_cbt-watk-cast" value="!exr @{repcombat-watk-final-macro-replaced} @{rep-cost-macro} ==atk==">Cast</button>
                                                    <button type="roll" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="roll_cbt-watk-gmcast" value="!exr @{repcombat-watk-final-macro-replaced} -gm @{rep-cost-macro} ==atk==">to GM</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="dmg-section flex-wrap">
                                        <div class="flex grow-normal">
                                            <div class="flex grow-normal">
                                                <p class="head" title="Hit is confirmed => how much momentum (Initiative) you steal to you opponent&#013;&#010;Add 1 more Initiative to you (so you gain at least 1 initiative)">DMG</p>
                                                (<select name="attr_repcombat-wdmg-attr" title="Attribute for the Roll" class="grow-normal">
                                                    ${returnOptions(52, attributes.map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})))}
                                                    <option disabled>-------ATTRIBUTES PROMPTS------</option>
                                                    <option value="?{Physical Attribute ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]}">Physical Prompt</option>
                                                    <option value="?{Social Attribute ?|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]}">Social Prompt</option>
                                                    <option value="?{Mental Attribute ?|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Mental Prompt</option>
                                                    <option value="?{Full Attribute ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Full Prompt</option>
                                                    <option value="?{Custom Attribute}[Custom]">Simple Prompt</option>
                                                    <option disabled>-------RAW------</option>
                                                    ${returnOptions(52, [...Array(11).keys()].map(i => ({val: i + '[RAW]', label: i})), -1)}
                                                </select>+
                                                <input type="number" name="attr_repcombat-weap-dmg" class="sheet-weap-dmg dark-dmg-color" readonly="readonly" title="Damage of the Weapon used&#013;&#010;Auto Filled, edit the field above">+
                                            </div>
                                            <div class="flex grow-max">
                                                <input type="text" name="attr_repcombat-wdmg-bonus-dices" class="sheet-wdmg-bonus-dices grow-normal" title="Bonus dices for the Roll (Threshold & Soak already included)&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations">
                                                <p class="sheet-bg-show">+<input type="number" value="@{battlegroup-size}+@{battlegroup-dmg-boost}" disabled="disabled" name="attr_total-bg-dice" data-formula="@{battlegroup-size}+@{battlegroup-dmg-boost}"></p>d)
                                            </div>
                                        </div>
                                        <div class="flex grow-normal">
                                            +
                                            <input type="text" name="attr_repcombat-wdmg-bonus-successes" class="sheet-wdmg-bonus-successes grow-double" title="Bonus successes for the roll&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations">s
                                            <input type="hidden" name="attr_repcombat-wdmg-final-macro-replaced" class="sheet-init-final-macro-replaced">
                                            <input type="hidden" name="attr_repcombat-weap-ovw" class="sheet-weap-ovw">
                                            <input type="text" name="attr_repcombat-wdmg-final-macro-options" class="sheet-init-macro-options grow-normal" title="Macro options for the Roll. Type '!exr -help' in chat to learn more" placeholder="-d 8,9 -R 1 -rl2 2,3">
                                            <div class="sheet-grouped-buttons end" title="Cast Withering Damage (You will be prompt to select you target for Soak value)">
                                                <div class="interactive-roll">
                                                    <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_cbt-wdmg-cast" value="!exr @{repcombat-wdmg-final-macro-replaced} -NB">Cast</button>
                                                    <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_cbt-wdmg-gmcast" value="!exr @{repcombat-wdmg-final-macro-replaced} -NB -gm">to GM</button>
                                                </div>
                                                <div class="companion-roll">
                                                    <button type="roll" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="roll_cbt-wdmg-cast" value="!exr @{repcombat-wdmg-final-macro-replaced} -NB">Cast</button>
                                                    <button type="roll" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="roll_cbt-wdmg-gmcast" value="!exr @{repcombat-wdmg-final-macro-replaced} -NB -gm">to GM</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="attack-section decisive-section show-on-edit">
                                <div class="header-section" title="An Attack vs An Opponent with real damage based on built momentum (Initiative)&#013;&#010;TOGGLE EDIT MODE ON CLICK">
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
                                                    ${returnOptions(52, attributes.map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), 1)}
                                                    <option disabled>-------ATTRIBUTES PROMPTS------</option>
                                                    <option value="?{Physical Attribute ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]}">Physical Prompt</option>
                                                    <option value="?{Social Attribute ?|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]}">Social Prompt</option>
                                                    <option value="?{Mental Attribute ?|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Mental Prompt</option>
                                                    <option value="?{Full Attribute ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Full Prompt</option>
                                                    <option value="?{Custom Attribute}[Custom]">Simple Prompt</option>
                                                    <option disabled>-------RAW------</option>
                                                    ${returnOptions(52, [...Array(11).keys()].map(i => ({val: i + '[RAW]', label: i})), -1)}
                                                </select>+
                                                <select name="attr_repcombat-datk-abi" title="Ability for the Roll" class="grow-normal">
                                                    ${returnOptions(52, abilities.filter(i => typeof i === 'string').map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), 3)}
                                                    <option disabled>-------ABILITIES PROMPTS------</option>
                                                    <option value="?{Craft|Armoring (@{craft-armoring}),@{craft-armoring}[Armoring]|Artifact (@{craft-artifact}),@{craft-artifact}[Artifact]|Cooking (@{craft-cooking}),@{craft-cooking}[Cooking]|First Age Artifice (@{craft-artifice}),@{craft-artifice}[First Age Artifice]|Gemcutting (@{craft-gemcutting}),@{craft-gemcutting}[Gemcutting]|Geomancy (@{craft-geomancy}),@{craft-geomancy}[Geomancy]|Jewelry (@{craft-jewelry}),@{craft-jewelry}[Jewelry]|Tailoring (@{craft-tailoring}),@{craft-tailoring}[Tailoring]|Weapon Forging (@{craft-forging}),@{craft-forging}[Weapon Forging]|Other,?{Enter the number of Craft dots&amp;#124;0&amp;#125;[Other]}">Craft Prompt</option>
                                                    <option value="?{Martial Arts|Snake Style (@{ma-snake}),@{ma-snake}[Snake Style]|Tiger Style (@{ma-tiger}),@{ma-tiger}[Tiger Style]|Single Point Shining Into The Void Style (@{ma-void}),@{ma-void}[Single Point Shining Into The Void Style]|White Reaper Style (@{ma-reaper}),@{ma-reaper}[White Reaper Style]|Ebon Shadow Style (@{ma-ebon}),@{ma-ebon}[Ebon Shadow Style]|Crane Style (@{ma-crane}),@{ma-crane}[Crane Style]|Silver-voiced Nightingale Style (@{ma-nightingale}),@{ma-nightingale}[Silver-voiced Nightingale Style]|Righteous Devil Style (@{ma-devil}),@{ma-devil}[Righteous Devil Style]|Black Claw Style (@{ma-claw}),@{ma-claw}[Black Claw Style]|Dreaming Pearl Courtesan Style (@{ma-pearl}),@{ma-pearl}[Dreaming Pearl Courtesan Style]|Steel Devil Style (@{ma-steel}),@{ma-steel}[Steel Devil Style]|Other,?{Enter the number of M.A. dots of this style&amp;#124;0&amp;#125;[Other]}">Martial Arts Prompt</option>
                                                    <option value="${buildAbilityPrompt(52)}">Full Ability Prompt</option>
                                                    <option value="?{Custom Ability}">Simple Prompt</option>
                                                    <option disabled>----ATTRIBUTES---</option>
                                                    ${returnOptions(52, attributes.map(i => ({val: `@{${i.toLowerCase()}}[${i}]`, label: i})), -1)}
                                                    <option disabled>-------ATTRIBUTES PROMPTS------</option>
                                                    <option value="?{Physical Attribute 2 ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]}">Physical Prompt</option>
                                                    <option value="?{Social Attribute 2 ?|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]}">Social Prompt</option>
                                                    <option value="?{Mental Attribute 2 ?|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Mental Prompt</option>
                                                    <option value="?{Full Attribute 2 ?|Strenght (@{strength}),@{strength}[Strength]|Dexterity (@{dexterity}),@{dexterity}[Dexterity]|Stamina (@{stamina}), @{stamina}[Stamina]|Charisma (@{charisma}), @{charisma}[Charisma]|Manipulation (@{manipulation}), @{manipulation}[Manipulation]|Appearance (@{appearance}), @{appearance}[Appearance]|Perception (@{perception}), @{perception}[Perception]|Intelligence (@{intelligence}), @{intelligence}[Intelligence]|Wits (@{wits}), @{wits}[Wits]}">Full Attribute Prompt</option>
                                                    <option disabled>-------RAW------</option>
                                                    ${returnOptions(52, [...Array(11).keys()].map(i => ({val: i + '[RAW]', label: i})), -1)}
                                                </select>
                                            </div>
                                            <div class="flex grow-max">
                                                <button type="action" name="act_default-macro-datk-d" class="stealth-btn" title="Override/Set additional dice Default Macro">+</button>
                                                <input type="text" name="attr_repcombat-datk-bonus-dices" class="sheet-watk-bonus-dices grow-normal" title="Bonus dices for the Roll (Stunt for example, ...)&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations" placeholder="2+?{Added Dices ?|0}">
                                                <p class="sheet-bg-show">+<input type="number" value="@{battlegroup-size}" disabled="disabled" name="attr_total-bg-dice" data-formula="@{battlegroup-size}"></p>
                                                -<input type="number" value="@{roll-penalty}" disabled="disabled" title="Roll penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_rollpenalty2" class="rollpenalty" data-formula="@{roll-penalty}">-
                                                <input type="number" value="@{wound-penalty}" disabled="disabled" title="Wound penalty, applied to attacks & all standard rolls, not to damage ones." name="attr_woundpenalty2" class="woundpenalty" data-formula="@{wound-penalty}">d)
                                            </div>
                                        </div>
                                        <div class="flex grow-normal">
                                            <button type="action" name="act_default-macro-datk-s" class="stealth-btn" title="Override/Set additional success Default Macro">+</button>
                                            <input type="text" name="attr_repcombat-datk-bonus-successes" class="sheet-watk-bonus-successes grow-double" title="Bonus successes for the roll (Willpower for example, ...)&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations" placeholder="?{Bonus succès ?|0}">s
                                            <input type="hidden" name="attr_repcombat-datk-final-macro-replaced" class="sheet-init-final-macro-replaced">
                                            <input type="hidden" name="attr_rep-cost-macro" class="sheet-cost-macro">
                                            <input type="text" name="attr_repcombat-datk-final-macro-options" class="sheet-init-macro-options grow-normal" title="Macro options for the Roll. Type '!exr -help' in chat to learn more" placeholder="-d 8,9 -R 1 -rl2 2,3">
                                            <div class="sheet-grouped-buttons end" title="Cast Decisive Attack => Trying to Hit">
                                                <div class="interactive-roll">
                                                    <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_cbt-datk-cast" value="!exr @{repcombat-datk-final-macro-replaced} @{rep-cost-macro} ==atk==">Cast</button>
                                                    <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_cbt-datk-gmcast" value="!exr @{repcombat-datk-final-macro-replaced} -gm @{rep-cost-macro} ==atk==">to GM</button>
                                                </div>
                                                <div class="companion-roll">
                                                    <button type="roll" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="roll_cbt-datk-cast" value="!exr @{repcombat-datk-final-macro-replaced} @{rep-cost-macro} ==atk==">Cast</button>
                                                    <button type="roll" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="roll_cbt-datk-gmcast" value="!exr @{repcombat-datk-final-macro-replaced} -gm @{rep-cost-macro} ==atk==">to GM</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="dmg-section flex-wrap">
                                        <div class="flex grow-normal">
                                            <!-- <p class="head" title="Hit is confirmed => how much damage you deal to you opponent as Health Levels or magnitude (for BattleGroups)&#013;&#010;By default, uses momentum built in combat (Initiative) as damage pool, without 10s rule">DMG</p> -->
                                            <button type="action" name="act_default-macro-datk-set-name" class="head stealth-btn" title="Hit is confirmed => how much damage you deal to you opponent as Health Levels or magnitude (for BattleGroups)&#013;&#010;By default, uses momentum built in combat (Initiative) as damage pool, without 10s rule&#013;&#010;CLICK to set default token name as character sheet name">DMG</button>
                                            (<input type="text" name="attr_repcombat-ddmg-dices" class="sheet-ddmg-bonus-dices grow-normal" value="@{tracker|YOUR_TOKEN_NAME_HERE}" title="Number of dice to be rolled&#013;&#010;Already included a macro that target a token initiative value&#013;&#010;You only need to copy paste the exact token name instead of the placeholder&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations">d)
                                        </div>
                                        <div class="flex-wrap grow-normal">
                                            <input type="hidden" name="attr_repcombat-ddmg-final-macro-replaced" class="sheet-init-final-macro-replaced">
                                            <div class="flex grow-normal">
                                                +
                                                <input type="text" name="attr_repcombat-ddmg-bonus-successes" class="sheet-ddmg-bonus-successes grow-normal" title="Bonus successes for the roll&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations">s
                                                <input type="text" name="attr_repcombat-ddmg-final-macro-options" class="sheet-init-macro-options grow-normal" value="-D" title="Macro options for the Roll. Type '!exr -help' in chat to learn more&#013;&#010;Default macro included is no 10 doubled as it's the default rule used for Decisive">
                                            </div>
                                            <div class="flex grow-normal">
                                                <input type="hidden" name="attr_repcombat-ddmg-init-to-set" class="sheet-atk-decisive-init-to-reset-val" value="">
                                                <p class="dark-init-color rounded-box flex grow-normal">
                                                    <label title="Fill this field to reset your initiative, leave blank to not reset&#013;&#010;Gambits use this blank for example&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations">RESET INIT TO:<input type="text" name="attr_repcombat-ddmg-init-to-set" class="sheet-atk-decisive-init-to-reset grow-normal" placeholder="3" value=""></label>
                                                </p>
                                                <input type="hidden" name="attr_repcombat-ddmg-init-to-set-final-macro-replaced" class="sheet-init-final-macro-replaced">
                                                <div class="sheet-grouped-buttons end reset-init" title="Reset Initiative (Remember to select you token to set INIT correctly)">
                                                    <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_cbt-ddmg-cast-rst" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB\\n/r @{repcombat-ddmg-init-to-set-final-macro-replaced} &{tracker}">Cast</button>
                                                    <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_cbt-ddmg-gmcast-rst" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB -gm\\n/gr @{repcombat-ddmg-init-to-set-final-macro-replaced} &{tracker}">to GM</button>
                                                </div>
                                                <div class="sheet-grouped-buttons end noreset-init" title="Do not Reset Initiative (Gambits Usually)">
                                                    <div class="interactive-roll">
                                                        <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_cbt-ddmg-cast-std" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB">Cast</button>
                                                        <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_cbt-ddmg-gmcast-std" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB -gm">to GM</button>
                                                    </div>
                                                    <div class="companion-roll">
                                                        <button type="roll" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="roll_cbt-ddmg-cast-std" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB">Cast</button>
                                                        <button type="roll" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="roll_cbt-ddmg-gmcast-std" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB -gm">to GM</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex-wrap">
                                <div class="attack-section withering-section hide-on-edit grow-normal">
                                    <div class="header-section" title="An Attack vs An Opponent with mostly narrative damage but build momentum (Initiative)&#013;&#010;TOGGLE EDIT MODE ON CLICK">
                                        <div class="edit-toggle">
                                            <input type="checkbox" name="attr_combat-toggle-edit" class="sheet-combat-toggle-edit" value="1">
                                            <span title="Withering:"></span>
                                        </div>
                                    </div>
                                    <div class="inner-section">
                                        <div class="atk-section flex">
                                            <p class="head" title="Trying to Hit an opponent with mostly narrative damage but build momentum (Initiative)">ATK</p>
                                            <input type="hidden" name="attr_repcombat-watk-final-macro-replaced" class="sheet-init-final-macro-replaced">
                                            <input type="hidden" name="attr_rep-cost-macro" class="sheet-cost-macro">
                                            <div class="sheet-grouped-buttons end" title="Cast Withering Attack => Trying to Hit with Accuracy included">
                                                <div class="interactive-roll">
                                                    <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_cbt-watk-cast" value="!exr @{repcombat-watk-final-macro-replaced} @{rep-cost-macro} ==atk==">Cast</button>
                                                    <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_cbt-watk-gmcast" value="!exr @{repcombat-watk-final-macro-replaced} -gm @{rep-cost-macro} ==atk==">to GM</button>
                                                </div>
                                                <div class="companion-roll">
                                                    <button type="roll" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="roll_cbt-watk-cast" value="!exr @{repcombat-watk-final-macro-replaced} @{rep-cost-macro} ==atk==">Cast</button>
                                                    <button type="roll" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="roll_cbt-watk-gmcast" value="!exr @{repcombat-watk-final-macro-replaced} -gm @{rep-cost-macro} ==atk==">to GM</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="dmg-section flex">
                                            <p class="head" title="Hit is confirmed => how much momentum (Initiative) you steal to you opponent&#013;&#010;Add 1 more Initiative to you (so you gain at least 1 initiative)">DMG</p>
                                            <input type="hidden" name="attr_repcombat-wdmg-final-macro-replaced" class="sheet-init-final-macro-replaced">
                                            <div class="sheet-grouped-buttons end" title="Cast Withering Damage (You will be prompt to select you target for Soak value)">
                                                <div class="interactive-roll">
                                                    <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_cbt-wdmg-cast" value="!exr @{repcombat-wdmg-final-macro-replaced} -NB">Cast</button>
                                                    <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_cbt-wdmg-gmcast" value="!exr @{repcombat-wdmg-final-macro-replaced} -NB -gm">to GM</button>
                                                </div>
                                                <div class="companion-roll">
                                                    <button type="roll" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="roll_cbt-wdmg-cast" value="!exr @{repcombat-wdmg-final-macro-replaced} -NB">Cast</button>
                                                    <button type="roll" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="roll_cbt-wdmg-gmcast" value="!exr @{repcombat-wdmg-final-macro-replaced} -NB -gm">to GM</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="attack-section decisive-section hide-on-edit grow-max">
                                    <div class="header-section" title="An Attack vs An Opponent with real damage based on built momentum (Initiative)&#013;&#010;TOGGLE EDIT MODE ON CLICK">
                                        <div class="edit-toggle">
                                            <input type="checkbox" name="attr_combat-toggle-edit" class="sheet-combat-toggle-edit" value="1">
                                            <span title="Decisive:"></span>
                                        </div>
                                    </div>
                                    <div class="inner-section">
                                        <div class="atk-section flex sheet-bg-hide">
                                            <p class="head" title="Trying to Hit an opponent with real damage based on built momentum (Initiative)">ATK</p>
                                            <input type="hidden" name="attr_repcombat-datk-final-macro-replaced" class="sheet-init-final-macro-replaced">
                                            <input type="hidden" name="attr_rep-cost-macro" class="sheet-cost-macro">
                                            <div class="sheet-grouped-buttons end" title="Cast Decisive Attack => Trying to Hit">
                                                <div class="interactive-roll">
                                                    <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_cbt-datk-cast" value="!exr @{repcombat-datk-final-macro-replaced} @{rep-cost-macro} ==atk==">Cast</button>
                                                    <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_cbt-datk-gmcast" value="!exr @{repcombat-datk-final-macro-replaced} -gm @{rep-cost-macro} ==atk==">to GM</button>
                                                </div>
                                                <div class="companion-roll">
                                                    <button type="roll" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="roll_cbt-datk-cast" value="!exr @{repcombat-datk-final-macro-replaced} @{rep-cost-macro} ==atk==">Cast</button>
                                                    <button type="roll" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="roll_cbt-datk-gmcast" value="!exr @{repcombat-datk-final-macro-replaced} -gm @{rep-cost-macro} ==atk==">to GM</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="dmg-section flex grow-normal">
                                            <p class="head" title="Hit is confirmed => how much damage you deal to you opponent as Health Levels or magnitude (for BattleGroups)&#013;&#010;By default, uses momentum built in combat (Initiative) as damage pool, without 10s rule">DMG</p>
                                            <input type="hidden" name="attr_repcombat-ddmg-final-macro-replaced" class="sheet-init-final-macro-replaced">
                                            <input type="hidden" name="attr_repcombat-ddmg-init-to-set" class="sheet-atk-decisive-init-to-reset-val" value="">
                                            <p class="dark-init-color rounded-box flex grow-normal">
                                                <label title="Fill this field to reset your initiative, leave blank to not reset&#013;&#010;Gambits use this blank for example&#013;&#010;You can include roll20 syntax like @{essence} or [[]] for complex configurations">R.INIT:<input type="text" name="attr_repcombat-ddmg-init-to-set" class="sheet-atk-decisive-init-to-reset grow-normal" placeholder="3" value=""></label>
                                            </p>
                                            <input type="hidden" name="attr_repcombat-ddmg-init-to-set-final-macro-replaced" class="sheet-init-final-macro-replaced">
                                            <div class="sheet-grouped-buttons end reset-init" title="Reset Initiative (Remember to select you token to set INIT correctly)">
                                                <div class="interactive-roll">
                                                    <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_cbt-ddmg-cast-rst" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB\\n/r @{repcombat-ddmg-init-to-set-final-macro-replaced} &{tracker}">Cast</button>
                                                    <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_cbt-ddmg-gmcast-rst" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB -gm\\n/gr @{repcombat-ddmg-init-to-set-final-macro-replaced} &{tracker}">to GM</button>
                                                </div>
                                                <div class="companion-roll">
                                                    <button type="roll" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="roll_cbt-ddmg-cast-rst" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB\\n/r @{repcombat-ddmg-init-to-set-final-macro-replaced} &{tracker}">Cast</button>
                                                    <button type="roll" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="roll_cbt-ddmg-gmcast-rst" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB -gm\\n/gr @{repcombat-ddmg-init-to-set-final-macro-replaced} &{tracker}">to GM</button>
                                                </div>
                                            </div>
                                            <div class="sheet-grouped-buttons end noreset-init" title="Do not Reset Initiative (Gambits Usually)">
                                                <div class="interactive-roll">
                                                    <button type="action" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="act_cbt-ddmg-cast-std" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB">Cast</button>
                                                    <button type="action" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="act_cbt-ddmg-gmcast-std" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB -gm">to GM</button>
                                                </div>
                                                <div class="companion-roll">
                                                    <button type="roll" class="sheet-roll btn ui-draggable default-whisper cost-trigger" name="roll_cbt-ddmg-cast-std" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB">Cast</button>
                                                    <button type="roll" class="sheet-roll btn ui-draggable gm-whisper cost-trigger" name="roll_cbt-ddmg-gmcast-std" value="!exr @{repcombat-ddmg-final-macro-replaced} -NB -gm">to GM</button>
                                                </div>
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
</rolltemplate>

<!-- --- Turns --- NOT USED -->

<rolltemplate class="sheet-rolltemplate-exalted3e_turn">
    <div class="main-div">
        <div class="condition-div">
            <span class="color-white">Conditions
                <div class="float-right">
                    <div class="condition-item">
                        <a class="condition-link" href="!cmaster --turn&#44;next" title="Done with Round">
                            <span class="color-white condition-span">3</span>
                        </a>
                    </div>
                </div>
                <div class="float-right">
                    <div class="condition-item">
                        <a class="condition-link" href="!cmaster --turn&#44;delay" title="Delay your Turn">
                            <span class="color-white condition-span">}</span>
                        </a>
                    </div>
                </div>
            </span>
        </div>
        <div class="center-div">
            <div class="image">
                <!-- <img src="{{imgSrc}}" width="50px" height="50px"> -->
                {{img}}
            </div>
            <div class="main-content">
                {{turn-message}}
                {{#onslaught}}&nbsp;<b>and reseted his onslaught (was <u>{{onslaught}}</u>) !</b>{{/onslaught}}
            </div>
        </div>
        {{#test}}
        <div class="test-content">
            {{test}}
        </div>
        {{/test}}
    </div>
</rolltemplate>`;
console.log(outHtml);