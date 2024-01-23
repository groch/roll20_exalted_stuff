var fs = require('fs');

var args = process.argv.slice(2);
const file_in = args[0] || 'DB_add.json';
const book = args[1]?.replace('.\\', '') || file_in.substring(0, file_in.length -5).replace('.\\', '');

const orig_list = JSON.parse(fs.readFileSync(file_in));
const abi_list = Object.keys(orig_list);
const finalObj = {};

for (const abi of abi_list) {
    const finalAbiName = abi.indexOf('—') !== -1 ? abi.substring(0, abi.indexOf(' ')) : abi; // sidereal special
    //console.log(`${finalAbiName}: `, orig_list[abi].map(i => i.Title));
    finalObj[finalAbiName] = orig_list[abi].map(i => forgeCharm(abi, i));
}

function forgeCharm(abi, item) {
    if (item.Cost[item.Cost.length - 2] === ';') item.Cost = item.Cost.substring(0, item.Cost.length - 2);
    if (item.Cost[item.Cost.length - 1] === ';') item.Cost = item.Cost.substring(0, item.Cost.length - 1);
    const costSplit = item.Cost.split(',').map(i => i.trim());
    let mote = 0, will = 0, init = 0;
    for (const i of costSplit) {
        // if (item.Title === 'Soaring Zephyr Flight')
        //     console.log(i);
        if (i.match(/or (?:\d+m|\di per dot)/)) {
        } else if (i.match(/successes per dot/)) {
        } else if (i.match(/\dwp \+\dm per turn/)) {
        } else if (i.match(/\dm per mote/)) {
        } else if (i.match(/\dm per \dwp/)) {
        } else if (i.match(/^\d+m per point of penalty(\/die)?$/)) {
        } else if (i.match(/plus \dm per language/)) {
        } else if (i.match(/\d+m \+ \dm per 1xp/)) {
        } else if (i.match(/^\d+wp or \d+i/)) {
        } else if (i.match(/^\dlhl per \dm/)) {
        } else if (i.match(/^\dm per -0 health level/)) {
        } else if (i.match(/^\dhl per three successes/)) {
        } else if (i.match(/^\dhl per three levels$/)) {
        } else if (i.match(/^\dhls per \dhul/)) {
        } else if (i.match(/\(\+?\di per round\)/)) {
        } else if (i.match(/^\d+m per turn/)) {
        } else if (i.match(/^\d+wp and \d+m per damage die$/)) {
        } else if (i.match(/^\dwp \(\+\dm per round\)$/)) {
        } else if (i.match(/^\dwp \(\dm per round\/hour\)$/)) {
        } else if (i.match(/^\dm \(\+\di per die\)$/)) {
        } else if (i.match(/^(\d+)m \(\+\1m per 3 range bands\)$/)) {
        } else if (i.match(/^\dwp \(\di per turn\)$/)) {
        } else if (i.match(/^\dwp \(\dm per turn\/hour\)$/)) {
        } else if (i.match(/^\dwp \(\dm or \di per turn\)$/)) {
        } else if (i.match(/^\dm \(\dm or \di per round\/minute\)$/)) {
        } else if (i.match(/^—\(\+(\d)lhl or \1wp\)$/)) {
        } else if (i.match(/^—\(\+(\d)m or \1i\)$/)) {
        } else if (i.match(/^—\(\dm per turn\)$/)) {
        } else if (i.match(/^—\(\dm per language\)$/)) {
        } else if (i.match(/^—\(\+\dm per familiar\)$/)) {
        } else if (i.match(/^—\(\+\dm or \+\dm\)$/)) {
        } else if (i.match(/^—\(\+\dgxp per dot\)$/)) {
        } else if (i.match(/^—\(\dm per ghost$/)) {
        } else if (i.match(/^\d(?:s|g|w)xp per dot$/)) {
        } else if (i.match(/expend/)) {
        } else if (i.match(/^\dwp \+ \di per turn$/)) {
        } else if (i.match(/^(\d)m or \1i$/)) {
        } else if (i.match(/^\d+wp or \d+a$/)) {
        } else if (i.match(/^(\d)i per 1wp$/)) {
        } else if (i.match(/^\+(\d)i per die or (\d)i per \+1$/)) {
        } else if (i.match(/^2m per success or \+1 Guile$/) && item.Keyword.match(/Excellency/)) {
        } else if (i.match(/per (?:Evocation|round|point of soak|interval|level|wraith|character|mutation dot|dot of mutation|dot|die or success|die removed|die|success|interval\)|Charm\)|Charm|round of control|round preserved|two motes|battle group|duplicate|exchange|cap increase|-1|damage removed|health level|disguise|work|damage die removed|Intimacy|anima level|level of anima|\+1 Evasion or success|\+1 Resolve or success|level of damage|\+?1 Evasion)$/)) {
        } else if (item.Title === 'Living Bonds Unburdened') {
        } else if (i.match(/per|or/)) {
            throw new Error(`New Cost Prompt to Handle:"${i}"`);
        }
        let ret, subret;
        if ((ret = i.match(/^(\d+)m/))) {
            if ((subret = i.match(/^(\d+)m or (\d+)m/))) {
                mote = `?{Cost ?|${Number(subret[1])}|${Number(subret[2])}}`;
            } else if (i.match(/^(\d+)m per die or success/)) {
                mote = `[[ ?{Number of Die/Success ? (${Number(ret[1])}m : 1 die or success)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per battle group/)) {
                mote = `[[ ?{Number of BattleGroups ? (${Number(ret[1])}m : 1 BG)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per duplicate/)) {
                mote = `[[ ?{Number of Duplicates ? (${Number(ret[1])}m : 1 Duplicate)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per -1/)) {
                mote = `[[ ?{Penalty applied ? (${Number(ret[1])}m : -1 penalty)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per round preserved/)) {
                mote = `[[ ?{Round Preserved ? (${Number(ret[1])}m : round preserved)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per round$/)) {
                mote = `[[ ?{Round of silence ? (${Number(ret[1])}m : round of silence)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per round of control/)) {
                mote = `[[ ?{Round of control Preserved ? (${Number(ret[1])}m : round of control)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per damage removed/)) {
                mote = `[[ ?{Damage Removed ? (${Number(ret[1])}m : damage removed)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per level$/)) {
                mote = `[[ ?{Damage Removed ? (${Number(ret[1])}m : damage removed)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per health level/)) {
                mote = `[[ ?{Health Levels affected ? (${Number(ret[1])}m : health level)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per damage die removed/)) {
                mote = `[[ ?{Damage Die Removed ? (${Number(ret[1])}m : damage die removed)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per -0 health level/)) {
                mote = `[[ ?{Health Levels affected ? (${Number(ret[1])}m : health level)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per Intimacy/)) {
                mote = `[[ ?{Intimacy affected ? (${Number(ret[1])}m : intimacy)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per anima level/)) {
                mote = `[[ ?{Anima Level consumed ? (${Number(ret[1])}m : anima level)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per level of anima/)) {
                mote = `[[ ?{Anima Level transfered ? (${Number(ret[1])}m : anima level)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per turn/)) {
                mote = `[[ ?{Turns of Effect ? (${Number(ret[1])}m : turn)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per (?:dot of mutation|mutation dot)/)) {
                mote = `[[ ?{Dots of Mutations ? (${Number(ret[1])}m : dot of mutation)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per dot$/)) {
                mote = `[[ ?{Dots of Strength ? (${Number(ret[1])}m : dot of strength)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per point of penalty\/die$/)) {
                mote = `[[ ?{Point of Penalty/Die ? (${Number(ret[1])}m : 1)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per point of penalty$/)) {
                mote = `[[ ?{Point of Penalty negated ? (${Number(ret[1])}m : 1 point of penalty)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per point of soak$/)) {
                mote = `[[ ?{Point of Soak ? (${Number(ret[1])}m : 1 point of soak)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per character$/)) {
                mote = `[[ ?{Total Character affected ? (${Number(ret[1])}m : character)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m per wraith$/)) {
                mote = `[[ ?{Wraith Created ? (${Number(ret[1])}m : wraith)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)m \(\+\1m per 3 range bands\)$/)) {
                mote = `[[ ${Number(ret[1])} + ?{Number of 3RangeBand over 3 (1 for 3-5rb, 2for 6-8rb, ...) ? (${Number(ret[1])}m : 3rangeband added)} * ${Number(ret[1])} ]]`;
            } else if ((subret = i.match(/^(\d+)m \+ (\d)m per 1xp/))) {
                mote = `[[ ${Number(subret[1])} + ?{XP Cost to be paid as mote ? (${Number(ret[2])}m : 1xp)} * ${Number(ret[2])} ]]`;
            } else if ((subret = i.match(/^(\d+)m per (\d)wp/))) {
                mote = `[[ ?{Willpower paid ? (${Number(subret[1])}m : ${Number(subret[2])}wp)} * ${Number(subret[1])} ]]`;
            } else if (i.match(/^(\d+)m or \1i per dot/)) {
                mote = `[[ ?{Cost as Motes ? (${Number(ret[1])}m : 1 dot)} * ${Number(ret[1])} ]]`;
                init = `[[ ?{Cost as Initiative ? (${Number(ret[1])}i : 1 dot)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d)m or \1i$/)) {
                const prompt = `?{Ressource Spent Type ?|Motes,1|Initiative,2}`;
                mote = `[[ (${prompt} % 2) * ${Number(ret[1])} ]]`; //option 1
                init = `[[ (ceil(${prompt} / 2) % 2) * ${Number(ret[1])} ]]`; //option 2
            } else {
                mote = Number(ret[1]);
            }
        } else if ((ret = i.match(/^(\d+)i/))) {
            if (i.match(/^(\d+)i per level of damage/)) {
                init = `[[ ?{Levels of damage ? (${Number(ret[1])}i : 1 level)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d+)i per \+?1 Evasion/)) {
                init = `[[ ?{Bonus Evasion ? (${Number(ret[1])}i : 1 Evasion)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d)i per two motes\)/)) {
                init = `?{Init Spent ? (${Number(ret[1])}i : 2 motes gained)}`;
            } else if (i.match(/^(\d)i per die removed\)/)) {
                init = `[[ ?{Dices Removed count ? (${Number(ret[1])}i : 1 die removed)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d)i per 1wp\)/)) {
                init = `[[ ?{Willpower paid ? (${Number(ret[1])}i : 1wp)} * ${Number(ret[1])} ]]`;
            } else if (i.match(/^(\d)i per hl\)/) && item.Title === 'Living Bonds Unburdened') {
            } else {
                init = Number(ret[1]);
            }
        } else if ((ret = i.match(/^(\d+)wp/))) {
            if ((subret = i.match(/^(\d+)wp or (\d+)i/))) {
                mote = `?{Cost as Willpower ?|0|${Number(subret[1])}`;
                init = `?{Cost as Initiative ?|0|${Number(subret[2])}`;
            } else if ((subret = i.match(/^(\d+)wp and (\d+)m per damage die/))) {
                will = Number(subret[1])
                mote = `[[ ${mote} + ?{Added Damage Dice ?} * ${Number(subret[2])} ]]`;
            } else if ((subret = i.match(/^(\d+)wp or (\d+)a$/))) {
                const prompt = `?{Ressource Spent Type ?|Willpower,1|Anima,2}`;
                will = `[[ (${prompt} % 2) * ${Number(ret[1])} ]]`; //option 1
            } else if ((subret = i.match(/^(\d+)wp\)$/))) {
            } else {
                will = Number(ret[1]);
            }
        }
        // if (item.Title === 'Soaring Zephyr Flight')
        //     console.log(will);
        if ((ret = i.match(/\((\d)m per (?:Charm|turn)\)/))) {
            mote = `?{Cost ?|${mote}|${Number(ret[1])}}`;
        } else if ((ret = i.match(/\((\d)lhl per (\d)m\)/))) {
            mote = `[[ ?{Number of Lethal Health Life ? (${Number(ret[2])}m : 1 lhl)} * ${Number(ret[2])} ]]`;
        } else if ((ret = i.match(/\(\+(\d)m per round\)/))) {
            mote = `[[ ${mote} + ?{Added rounds ?} * ${Number(ret[1])} ]]`;
        } else if ((ret = i.match(/^—\((\d)m per language\)/))) {
            mote = `[[ ?{Number of Languages ?} * ${Number(ret[1])} ]]`;
        } else if ((ret = i.match(/^—\(\+(\d)m per familiar\)$/))) {
            mote = `[[ ?{Number of Familiar ?} * ${Number(ret[1])} ]]`;
        } else if ((ret = i.match(/^—\(\+(\d)m or \1i\)$/))) {
            const prompt = `?{Ressource Spent Type ?|Motes,1|Initiative,2}`;
            mote = `[[ (${prompt} % 2) * ${Number(ret[1])} ]]`; //option 1
            init = `[[ (ceil(${prompt} / 2) % 2) * ${Number(ret[1])} ]]`; //option 2
        }
        if ((ret = i.match(/\(\+(\d)wp\)/))) {
            will = `?{Willpower Cost ?|${will}|${Number(ret[1])}}`;
        } else if ((ret = i.match(/^—\(\+(\d)lhl or \1wp\)$/))) {
            will = `?{Willpower Cost ?|${will}|${Number(ret[1])}}`;
        }
        if ((ret = i.match(/\(\+(\d)i per round\)/))) {
            init = `[[ ?{Round count ? (${Number(ret[1])}i : round)|${init}|${Number(ret[1])}} * ${Number(ret[1])} ]]`;
        } else if ((ret = i.match(/\(\+(\d)i per die\)/))) {
            init = `[[ ?{Dices rerolled ? (${Number(ret[1])}i : die)|${init}|${Number(ret[1])}} * ${Number(ret[1])} ]]`;
        } else if ((ret = i.match(/\+(\d)i per die or (\d)i per \+1/))) {
            init = `[[ ?{Dices added ? (${Number(ret[1])}i : die)} * ${Number(ret[1])} + ?{Static value added ? (${Number(ret[2])}i : +1)} * ${Number(ret[2])} ]]`;
        }
    }
    if ((ret = item.Cost.trim().match(/^—\((\d+)m, (\d+)wp\)$/))) {
        // console.log(`Charm Name:${item.Title}, BEEP`);
        const prompt = `?{Additionnal cost ? (${Number(ret[1])}m + ${Number(ret[2])}wp)|No,0|Yes,1}`;
        mote = `[[ ${prompt} * ${Number(ret[1])} ]]`; //option 1
        will = `[[ ${prompt} * ${Number(ret[2])} ]]`; //option 2
    } else if ((ret = item.Cost.trim().match(/^—\((\d+)m per ghost, (\d+)wp\)$/))) {
        // console.log(`Charm Name:${item.Title}, BEEP`);
        mote = `[[ ?{Number of Ghosts ? (${Number(ret[1])}m : ghost)} * ${Number(ret[1])} ]]`;
        will = Number(ret[2]);
    } else if ((ret = item.Cost.trim().match(/^(\d+)m, \1i \+(\d+)m, \2i per hl$/))) {
        // console.log(`Charm Name:${item.Title}, BEEP1`);
        mote = Number(ret[1]);
        will = Number(ret[1]);
    } else if ((ret = item.Cost.trim().match(/^(\d+)m, (\d+)wp, plus (\d+)m per language$/))) {
        // console.log(`Charm Name:${item.Title}, BEEP2`);
        mote = `[[ ${Number(ret[1])} + ?{Number of Additional Languages ? (${Number(ret[3])}m : language)} * ${Number(ret[3])} ]]`;
        will = Number(ret[2]);
    }
    const keywordSplit = item.Keyword.split(',').map(i => i.trim());
    const finalKeywordArray = [];
    let canCycle = 0, aspect = '', mute = '', balanced = '';
    for (const i of keywordSplit) {
        if (i.match(/None/)) {
            continue;
        } else if (i.match(/Balanced/)) {
            balanced = 'on';
        } else if (i.match(/Mute/)) {
            mute = 1;
        } else if ((ret = i.match(/(Air|Water|Earth|Fire|Wood)(\/(Air|Water|Earth|Fire|Wood))+/))) {
            aspect = ret[1].toLowerCase();
            canCycle = 'on';
            finalKeywordArray.push(i);
        } else if ((ret = i.match(/(Air|Water|Earth|Fire|Wood)/))) {
            aspect = ret[1].toLowerCase();
        } else {
            finalKeywordArray.push(i);
        }
    }
    let type = item.Type.trim();
    if (type.substring(0,2) === ': ') type = type.substring(2, type.length);
    if (type === 'Supplemental or Reflexive') type = 'Double';
    else if (!['Simple','Supplemental','Reflexive','Permanent','Supplemental or Reflexive','','',''].includes(type)) throw new Error(`Type Unknown: ${type}`);
    const finalCharmObj = {
        'attr-mins': {},
        'prereq': item.Prerequisite.split(',').map(i => i.trim()).filter(i => i !== 'None').filter(i => i),

        'charm-skill': abi,

        'charm-name': item.Title.trim(),
        'charm-type': type,
        'charm-duration': item.Duration.trim(),
        'charm-cost': item.Cost.trim(),
        'rep-cost-mote': mote,
        // 'rep-cost-mote-commit': mote,
        // 'rep-cost-mote-pool': mote ? '?{Spend Peripheral First ?|Yes,1|No,0}' : '',
        'rep-cost-will': will,
        'rep-cost-init': init,
        // 'rep-cost-macro': getCostMacro(),
        'charm-short-desc': '',
        // 'charm-learnt': 1,
        'charm-book': book,
        'charm-aspect': aspect,
        'charm-mute': mute,
        'charm-balanced': balanced,
        'charm-can-cycle-aspects': canCycle,
        'charm-keywords': finalKeywordArray.join(', '),
        'charm-description': '',
        'charm-effect': item.Description.trim(),
        'charm-rollexpr': '',
        // 'charm-buttons-isextended': 0,
    }

    const abilityList = ['archery','athletics','awareness','brawl','bureaucracy','craft','dodge','integrity','investigation','larceny','linguistics','lore','medicine','melee','occult','performance','presence','resistance','ride','sail','socialize','stealth','survival','thrown','war'];
    const attributeList = ['strength','dexterity','stamina','charisma','manipulation','appearance','perception','intelligence','wits'];

    const siderealHouses = {
        'Journeys': ['Resistance','Ride','Sail','Survival','Thrown'],
        'Serenity': ['Craft','Dodge','Linguistics','Performance','Socialize'],
        'Battles': ['Archery','Brawl','Melee','Presence','War'],
        'Secrets': ['Investigation','Larceny','Lore','Occult','Stealth'],
        'Endings': ['Athletics','Awareness','Bureaucracy','Integrity','Medicine'],
    };

    let minsArray = item.Mins.split(',').map(i => i.trim());
    for (const i of minsArray) {
        if ((ret = i.match(/Essence ?(\d)/))) {
            finalCharmObj['attr-mins']['essence'] = Number(ret[1]);
        } else if ((ret = i.match(/([a-zA-Z]+):?\s?(\d)/))) {
            if ((subret = i.match(/Any ([a-zA-Z]+) Ability (\d)/))) {
                // for (const abi of siderealHouses[subret[1]])
                //     finalCharmObj['attr-mins'][abi.toLowerCase()] = Number(ret[2]);
            } else {
                if (![...abilityList,...attributeList].includes(ret[1].toLowerCase())) throw new Error(`Charm Name:${item.Title}, Min not configured:"${ret[1]}"`);
                finalCharmObj['attr-mins'][ret[1].toLowerCase()] = Number(ret[2]);
            }
        } else if (i === "") {
        } else {
            throw new Error(`Charm Name:${item.Title}, Min no Match:"${i}"`);
        }
    }
    return finalCharmObj;
}

// console.log(finalObj);
// console.log(JSON.stringify(finalObj));

try {
    fs.writeFileSync(`${file_in.substring(0, file_in.length -5)}.out.json`, JSON.stringify(finalObj));
} catch (err) {
    console.error(err);
}