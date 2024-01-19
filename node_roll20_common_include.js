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

var dicecapArray = [
    {dicecap:'Ability', excellency:'solar'},
    {dicecap:'DB', excellency:'db'},
    {dicecap:'Attribute', excellency:'lunar'},
    {dicecap:'Sidereal', excellency:'sidereal'},
    {dicecap:'Liminal', excellency:'liminal'},
    {dicecap:'Architect', excellency:'architect'},
    {dicecap:'Puppeteer', excellency:'puppeteer'},
    {dicecap:'Sovereign', excellency:'sovereign'},
    {dicecap:'DreamSouled', excellency:'dreamsouled'},
    {dicecap:'Hearteater', excellency:'hearteater'},
    {dicecap:'Umbral', excellency:'umbral'}
];

var solarCharmArray = charmSolarRepeatableSectionArray;
var lunarCharmArray = charmLunarRepeatableSectionArray;
var maCharmArray = charmMaRepeatableSectionArray;

var hashCharmName = correspondingCharmSectionValue;

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

var maHash = {};
for (const key of maAttrsArray) {
    maHash[hashCharmName[`charms-${key}`]] = `@{${key}}`;
}
function objectFlipFullNameAndKey(obj) {
    const ret = {};
    Object.keys(obj).forEach(key => ret[obj[key].full] = key);
    return ret;
}
var craftAbilities = {
    name:'Craft',
    toggleStr:'Show crafts',
    placeholderStr:'Fate',
    shortName:'craft',
    customPrompt:'Enter the number of Craft dots',
    sheetLayer: 6,
    subSections: objectFlipFullNameAndKey(craftAbilitiesHash)
};
var maAbilities = {
    name:'Martial Arts',
    toggleStr:'Show styles',
    placeholderStr:'Celestial Monkey Style',
    shortName:'ma',
    customPrompt:'Enter the number of M.A. dots of this style',
    sheetLayer: 4,
    subSections: maHash
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

var allCharmArray = [
    ...solarCharmArray, ...lunarCharmArray, ...maCharmArray,
    'charms-evocation', 'old'
], allCharmArrayCss = [
    ...solarCharmArray, ...lunarCharmArray, ...maCharmArray,
    'charms-evocations'
];

var hashCharmTitle = {
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
    'charms-heartsblood': 'Heart\'s Blood',
    'charms-str-offense': 'STR - Offense',
    'charms-str-mobility': 'STR - Mobility',
    'charms-str-fos': 'STR - FoS',
    'charms-dex-offensive': 'DEX - Offensive',
    'charms-dex-defense': 'DEX - Defense',
    'charms-dex-subterfuge': 'DEX - Subterfuge',
    'charms-dex-mobility': 'DEX - Mobility',
    'charms-dex-swarm': 'DEX - Swarm',
    'charms-sta-defense': 'STA - Defense',
    'charms-sta-endurance': 'STA - Endurance',
    'charms-sta-berserker': 'STA - Berserker',
    'charms-cha-influence': 'CHA - Influence',
    'charms-cha-territory': 'CHA - Territory',
    'charms-cha-warfare': 'CHA - Warfare',
    'charms-man-influence': 'MAN - Influence',
    'charms-man-subterfuge': 'MAN - Subterfuge',
    'charms-man-guile': 'MAN - Guile',
    'charms-app-influence': 'APP - Influence',
    'charms-app-subterfuge': 'APP - Subterfuge',
    'charms-app-warfare': 'APP - Warfare',
    'charms-per-senses': 'PER - Senses',
    'charms-per-scrutiny': 'PER - Scrutiny',
    'charms-per-mysticism': 'PER - Mysticism',
    'charms-int-knowledge': 'INT - Knowledge',
    'charms-int-mysticism': 'INT - Mysticism',
    'charms-int-crafting': 'INT - Crafting',
    'charms-int-warfare': 'INT - Warfare',
    'charms-int-sorcery': 'INT - Sorcery',
    'charms-wit-resolve': 'WIT - Resolve',
    'charms-wit-animalken': 'WIT - Animal Ken',
    'charms-wit-navigation': 'WIT - Navigation',
    'charms-wit-cache': 'WIT - Cache',
    'charms-wit-territory': 'WIT - Territory',
    'charms-ma-snake': 'MA - Snake',
    'charms-ma-tiger': 'MA - Tiger',
    'charms-ma-spsitv': 'MA - Single P.',
    'charms-ma-whitereaper': 'MA - White Reaper',
    'charms-ma-ebonshadow': 'MA - Ebon Shadow',
    'charms-ma-crane': 'MA - Crane',
    'charms-ma-silvervoice': 'MA - Silver V.',
    'charms-ma-righteousdevil': 'MA - Righteous D.',
    'charms-ma-blackclaw': 'MA - Black Claw',
    'charms-ma-dreamingpearl': 'MA - Dreaming P.',
    'charms-ma-steeldevil': 'MA - Steel Devil',
    'charms-ma-centipede': 'MA - Centipede',
    'charms-ma-falcon': 'MA - Falcon',
    'charms-ma-laughingmonster': 'MA - Laughing M.',
    'charms-ma-swayinggrass': 'MA - Swaying G.',
    'charms-ma-airdragon': 'MA - Air Dragon',
    'charms-ma-earthdragon': 'MA - Earth Dragon',
    'charms-ma-firedragon': 'MA - Fire Dragon',
    'charms-ma-waterdragon': 'MA - Water Dragon',
    'charms-ma-wooddragon': 'MA - Wood Dragon',
    'charms-ma-goldenjanissary': 'MA - Golden J.',
    'charms-ma-mantis': 'MA - Mantis',
    'charms-ma-whiteveil': 'MA - White Veil',
    'charms-ma-other': 'MA - other',
    'charms-evocation': 'Evocation',
    'charms-old': 'Other'
};

var abiDiceCapTypeHash = {
    'Ability Based':'Ability',
    'Dragon-Blooded Variant':'DB',
}, attrDiceCapTypeHash = {
    'Attribute Based':'Attribute',
    'Architect Variant':'Architect',
}, essenceDiceCapTypeHash = {
    'Sidereal':'Sidereal',
    'Liminal':'Liminal',
    'Puppeteer':'Puppeteer',
    'Sovereign':'Sovereign',
    'Dream-Souled':'DreamSouled',
    'Hearteater':'Hearteater',
    'Umbral':'Umbral',
};