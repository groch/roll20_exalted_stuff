var fs = require('fs');

const sheetWorkerStr = fs.readFileSync('sheet_worker.js');
const commonInc = fs.readFileSync('node_roll20_common_include.js');

eval(sheetWorkerStr+commonInc);

let outHtml = /*css*/
`@font-face {
    font-family: Cimiez;
    src: local('Cimiez Roman PDF.ttf'),
         url('https://imgsrv.roll20.net/?src=http%3A//lithl.info/cimiez.ttf') format('truetype');
}

/* --- Quick fix removing input showing +/- on Firefox --- */
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
}







/* TRANSITIONS */
.ui-dialog,
.nav > li > a,
input[type="radio"].sheet-tab,
input[type="radio"].sheet-tab::before,
div.sheet-table-cell,
div.sheet-table-cell input,
span,
h1 span,
.sheet-dots,
.sheet-dots-full,
.sheet-damage-box,
.crippling-box > span::before,
.ressource-line p,
.ressource-line p input,
.woundpenalty,
.desc-toggle > span::before,
input[type="text"],
input[type="number"] {
    transition: color 1s, background-color 1s;
}







/* --- Warning header for people not using browser supporting :has() --- */
.charsheet .sheet-warning-header {
    display: none;
}
@supports not (selector(:has(+ *))) {
    .charsheet {
        height: calc(100% - 10.3em);
    }
    .charsheet .sheet-warning-header {
        display: block;
    }
    .charsheet .sheet-warning-header .sheet-message-firefox {
        display: none;
    }
    @-moz-document url-prefix() {
        .charsheet .sheet-warning-header .sheet-message-generic {
            display: none;
        }
        .charsheet .sheet-warning-header .sheet-message-firefox {
            display: block;
        }
    }

    .charsheet .sheet-warning-header h1,
    .charsheet .sheet-warning-header h2 {
        text-decoration: none;
    }
    .charsheet .sheet-warning-header h1 a,
    .charsheet .sheet-warning-header h2 a {
        text-decoration: underline;
    }
    .charsheet .sheet-warning-header h1 {
        background-image: none;
        color: red;
    }
    .charsheet .sheet-warning-header h2 {
        text-align: center;
        color: orange;
    }
}







/* FOCUS/HOVER VISIBILITY */
.qc-appearance-trait .onslaught-checkbox:hover + span::before,
.qc-appearance-trait .onslaught-checkbox:focus + span::before {
    outline: 2px red solid;
}

input.onslaught-checkbox[type=checkbox][name="attr_apply-onslaught"]:hover + span::before,
input.onslaught-checkbox[type=checkbox][name="attr_apply-onslaught"]:focus + span::before {
    outline: 2px var(--onslaught-color) solid;
}
.charsheet .roll-type-toggler input[type=checkbox]:hover + span::before,
.charsheet input[type=checkbox].sheet-unnamed-toggle:not(.btn):hover + span::before,
.sheet-combat-attack:has(textarea.combat-textarea:hover) .desc-toggle input + span:before,
.sheet-combat-attack:has(textarea.combat-textarea:focus) .desc-toggle input + span:before,
.sheet-combat-init:has(textarea.combat-textarea:hover) .desc-toggle input + span:before,
.sheet-combat-init:has(textarea.combat-textarea:focus) .desc-toggle input + span:before,
.sheet-rolls-div .repitem:has(textarea:hover) .sheet-rolls .desc-toggle input + span:before,
.sheet-rolls-div .repitem:has(textarea:focus) .sheet-rolls .desc-toggle input + span:before,
.flex.control input[type=checkbox][name="attr_repspell-control"]:hover + span::before,
.flex.control input[type=checkbox][name="attr_repspell-control"]:focus + span::before,
.charsheet input.sheet-tab:focus::before,
.sheet-tab-settings-sheet input[type=checkbox]:hover + span::before,
.sheet-tab-settings-sheet input[type=checkbox]:focus + span::before,
.health-line .crippling-box input[type=checkbox]:hover + span::before,
.health-line .crippling-box input[type=checkbox]:focus + span::before,
.charsheet input.sheet-initeffect:hover + span::before,
.charsheet input.sheet-initeffect:focus + span::before,
.charsheet input.sheet-charmeffect:hover + span::before,
.charsheet input.sheet-charmeffect:focus + span::before,
.charsheet input.sheet-spelleffect:hover + span::before,
.charsheet input.sheet-spelleffect:focus + span::before,
.sheet-tab-antisocial-sheet input[type=checkbox]:hover + span::before,
.sheet-tab-antisocial-sheet input[type=checkbox]:focus + span::before,
.sheet-tab-intimacies-sheet input[type=checkbox]:hover + span::before,
.sheet-tab-intimacies-sheet input[type=checkbox]:focus + span::before,
input.sheet-rolls-separator-hidden-checkbox[type=checkbox]:hover + span::before,
input.sheet-rolls-separator-hidden-checkbox[type=checkbox]:focus + span::before,
.sheet-dots:has(> input[type="radio"]:hover),
.sheet-dots:has(> input[type="radio"]:focus),
.sheet-dots-full:has(> input[type="radio"]:hover),
.sheet-dots-full:has(> input[type="radio"]:focus),
.sheet-trait label input:hover + span:before,
.sheet-trait label input:focus + span:before,
.excellency-cap-section > div > select:hover,
.excellency-cap-section > div > select:focus,
.excellency-cap-section > div > div.dicecap-checkbox input[type=checkbox]:hover + span::before,
.excellency-cap-section > div > div.dicecap-checkbox input[type=checkbox]:focus + span::before,
.charsheet .sheet-rolls-div-widget .specialty-box input[type=checkbox]:hover + span::before,
.charsheet .sheet-rolls-div-widget .specialty-box input[type=checkbox]:focus + span::before,
.sheet-damage-box:has(input:hover),
.sheet-damage-box:has(input:focus) {
    outline: 2px gold solid;
}
input.onslaught-checkbox[type=checkbox][name="attr_apply-onslaught"]:hover + span::before,
input.onslaught-checkbox[type=checkbox][name="attr_apply-onslaught"]:focus + span::before,
.qc-appearance-trait .onslaught-checkbox:hover + span::before,
.qc-appearance-trait .onslaught-checkbox:focus + span::before,
.flex.control input[type=checkbox][name="attr_repspell-control"]:hover + span::before,
.flex.control input[type=checkbox][name="attr_repspell-control"]:focus + span::before,
.sheet-tab-settings-sheet input[type=checkbox]:hover + span::before,
.sheet-tab-settings-sheet input[type=checkbox]:focus + span::before,
.charsheet input.sheet-initeffect:hover + span::before,
.charsheet input.sheet-initeffect:focus + span::before,
.sheet-tab-antisocial-sheet input[type=checkbox]:hover + span::before,
.sheet-tab-antisocial-sheet input[type=checkbox]:focus + span::before,
.sheet-tab-intimacies-sheet input[type=checkbox]:hover + span::before,
.sheet-tab-intimacies-sheet input[type=checkbox]:focus + span::before,
input.sheet-rolls-separator-hidden-checkbox[type=checkbox]:hover + span::before,
input.sheet-rolls-separator-hidden-checkbox[type=checkbox]:focus + span::before,
.sheet-trait label input:hover + span:before,
.sheet-trait label input:focus + span:before {
    outline-offset: -2px;
    border-radius: 3px;
}
.charsheet .sheet-box-reminder input[type=checkbox].sheet-unnamed-toggle:not(.btn):hover + span::before {
    outline-offset: -2px;
}

.sheet-tab-settings-sheet label:has(input:focus),
.sheet-trait label:has(input:focus) {
    text-shadow: 0px 0px 0 gold;
}

.charsheet select.sheet-rolls-pool-starting:focus {
    background-color: #80808040;
}







/**
 * MAIN SHEET STYLES
 */
:root {
    --goldish-color: 255, 218, 18;
    --init-color: 32, 139, 253;
    --dark-init-color: 31, 85, 142;
    --accuracy-color: 0, 255, 0;
    --dark-accuracy-color: 0, 128, 0;
    --damage-color: 255, 0, 0;
    --dark-damage-color: 76, 25, 25;
    --willpower-color: 255, 255, 255;
    --dark-willpower-color: 128, 128, 128;
    --mote-color: 255, 215, 0;
    --dark-mote-color: 100, 75, 0;
    --commited-mote-color: 255, 128, 0;
    --stunt-color: 128, 128, 128;
    --dice-color: 0, 0, 0;
    --dark-dice-color: 255, 255, 255;

    --onslaught-color: rgb(234, 0, 255);

    --bs-default-poffset: 1px;
    --bs-default-noffset: -1px;
    --bs-default-poffsetbig: 3px;
    --bs-default-noffsetbig: -3px;
    --bs-default-poffsetbigger: 5px;
    --bs-default-noffsetbigger: -5px;
    --bs-default-poffsetbiggest: 7px;
    --bs-default-noffsetbiggest: -7px;
    --bs-default-blur: 5px;
    --bs-default-blurbig: 12px;

    --bs-light-cover-color: gray;
    --bs-heavy-cover-color: gold;
    --bs-grab-color: red;
    --bs-prone-color: green;
    --bs-prone-color-dark: lime;
    --bs-clash-color: cyan;
    --bs-rolls-color: gray;
    --bs-spell-color: purple;
    --bs-background-spell-color: #80008040;
    --bs-charm-color: gold;
    --bs-charm-reset-color: orange;
    --bs-charm-disabled-color: gray;
    --bs-charm-warning-color: red;
    --bs-charm-warning-color-dark: darkred;
    --bs-charm-color-dark: rgba(255, 217, 0, 0.5);
    --bs-header-color: #0b0;
    --bs-init-color: rgb(255, 204, 0);
    --bs-combat-color: red;
}

.charsheet p {
    margin: 0 0 5px;
}

.charsheet button.stealth-btn {
    color: #333;
    display: inline-block;
    background: none;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    line-height: 18px;
    text-shadow: none;
    box-shadow: none;
    transition: color 1s, text-shadow 1s;
}
.sheet-darkmode .charsheet button.stealth-btn {
    color: var(--dark-secondarytext);
}

.charsheet button.stealth-btn:hover {
    color: gold;
    transition: color .1s, text-shadow .1s;
    text-shadow: 1px 1px 0 red, -1px 1px 0 red, -1px -1px 0 red, 1px -1px 0 red;
    cursor: pointer;
}

.charsheet {
    --sheet-bg-col: white;
    position: absolute;
    left: 0;
    padding: 0 0 0 0 !important;
    height: -webkit-fill-available;
    width: calc(100% - 1px);
}
@-moz-document url-prefix() {
    .charsheet {
        height: calc(100% - 4.7em);
    }
}

.sheet-darkmode .charsheet {
    --sheet-bg-col: var(--dark-surface1);
}

body.sheet-darkmode {
    color: var(--dark-secondarytext);
}

.sheet-darkmode input, .sheet-darkmode textarea, .sheet-darkmode select, .sheet-darkmode .uneditable-input {
    color: var(--dark-primarytext);
}

.charsheet .sheet-content > div.sheet-main-content {
    flex: 1 1 auto;
    overflow: visible;
    padding-left: 10px;
    height: calc(100% - 2em);
}

.charsheet .sheet-content {
    height: 100%;
    min-height: 5em;
    display: flex;
    flex-direction: column;
}

.charsheet .sheet-body {
    display: block;
    padding: 5px 0 5px 0;
    overflow-x: visible;
    overflow-y: visible;
    position: relative;
    flex: 1 1 auto;
}

.charsheet .sheet-body .sheet-body {
    padding: 0;
}

.charsheet .sheet-body.flex.flex-col > .flex.flex-wrap {
    width: 100%;
}

.charsheet .sheet-body::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 8px;
    height: 8px;
}

.charsheet .sheet-body::-webkit-scrollbar-thumb {
    border-radius: 4px;
    border: 2px solid transparent;
    background-color: rgba(0, 0, 0, .5);
}

.ui-dialog::-webkit-scrollbar-thumb:hover {
    background-color: #7a8991;
}

.charsheet .sheet-footer {
    padding-top: 3px;
    text-align: right;
    background: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/R0FTYGB.jpg') white no-repeat;
    flex: 0 0 auto;
}

.charsheet .sheet-footer button[type=roll] {
    background: transparent;
    border: 2px solid gray;
}

.charsheet .sheet-txt-lg { font-size: 150%; }
.charsheet .sheet-100pct { width: 100% !important; }
.charsheet .sheet-text-right { text-align: right; }
.charsheet .sheet-text-center { text-align: center; }

.charsheet button[type=roll]::before { content: "" !important; }
.charsheet .reminder-charms-main-div button[type=action].btn,
.charsheet button[type=roll].btn {
    font-size: 13px;
    line-height: 13px;
}

.btn,
.btn.btn-default,
.btn:hover {
	background: linear-gradient(#ffffff, #e6e6e6) padding-box, linear-gradient(42deg, #ffda12, #C0C0C0,#fdda12) border-box;
	border: 2px solid transparent;
    padding: 2px 10px;
    transition: color .2s;
}
.sheet-darkmode .btn,
.sheet-darkmode .btn.btn-default {
	background: linear-gradient(rgb(128, 128, 128), rgb(128, 128, 128)) padding-box, linear-gradient(42deg, #ffda12, #C0C0C0,#fdda12) border-box;
}

.btn:hover {
    color: darkred;
}
.sheet-darkmode .btn:hover {
    color: white;
}

.charsheet .sheet-grouped-buttons .btn:hover {
    border-color: black;
}

.charsheet .sheet-grouped-buttons .btn:focus-visible {
    outline: none;
}

.charsheet .sheet-layer7,.charsheet .sheet-layer7::before { z-index: 7; }
.charsheet .sheet-layer6,.charsheet .sheet-layer6::before { z-index: 6; }
.charsheet .sheet-layer5,.charsheet .sheet-layer5::before { z-index: 5; }
.charsheet .sheet-layer4,.charsheet .sheet-layer4::before { z-index: 4; }
.charsheet .sheet-layer3,.charsheet .sheet-layer3::before { z-index: 3; }

.charsheet .sheet-layer7 .sheet-trait,
.charsheet .sheet-layer6 .sheet-trait,
.charsheet .sheet-layer5 .sheet-trait,
.charsheet .sheet-layer4 .sheet-trait,
.charsheet .sheet-layer3 .sheet-trait { padding-bottom: 2px;}

.charsheet .sheet-fixedwidth { display: inline-block; }

.charsheet input[disabled]:not([title]) {
    cursor: not-allowed;
}

.charsheet select[title]:not([readonly]):not([disabled]) {
    cursor: pointer;
}

.charsheet input[title]:not([readonly]):not([disabled]):not([type="radio"]):not([type="checkbox"]),
.charsheet .woundpenalty-add-input[title],
.charsheet .rollpenalty-input[title] {
    cursor: text;
}

.charsheet .sheet-content .sheet-tab-content .woundpenalty-add-input[title],
.charsheet .sheet-content .sheet-tab-content input[type=number][disabled].woundpenalty-input,
.charsheet .sheet-content .sheet-tab-content .rollpenalty-input[title] {
    width: 27px;
}

.charsheet .not-visible {
    visibility: hidden;
}

.charsheet div.rep-toggle {
    display: none;
}

.charsheet .rep-enabled-check[value="1"] ~ .rep-toggle {
    display: block;
}

.charsheet .flex.main-page .show-to-mortals-mostly {
    display: none;
}
.charsheet .caste-check[value="Mortal"]  ~ .flex.main-page .show-to-mortals-mostly,
.charsheet .caste-check[value="Custom"]  ~ .flex.main-page .show-to-mortals-mostly {
    display: block;
}

.charsheet .charm-whisper-gm-check[value="1"] ~ .flex.main-page .default-whisper,
.charsheet .charm-whisper-gm-check[value="0"] ~ .flex.main-page .gm-whisper,
.charsheet .sheet-tab-charm-sheet .sheet-charm-effect .show-to-db-only {
    display: none;
}
.charsheet .exalt-type-check[value="DB"]  ~ .flex.main-page .sheet-tab-charm-sheet .sheet-charm-effect .show-to-db-only {
    display: inline;
}

.charsheet .charm-whisper-gm-check[value="0"]   ~ .flex.main-page .default-whisper,
.charsheet .charm-whisper-gm-check[value="1"]   ~ .flex.main-page .gm-whisper,
.charsheet .charm-whisper-both-check[value="1"] ~ .flex.main-page .sheet-roll.default-whisper,
.charsheet .charm-whisper-both-check[value="1"] ~ .flex.main-page .sheet-roll.gm-whisper {
    display: inline-block;
}

.charsheet table td,
.charsheet table th {
    font-size: 13px;
    font-weight: bolder;
    font-family: "arial";
    text-align: left;
    width: 0%;
    border: 0px #000000;
    padding: 2px;
    vertical-align: middle;
    color: #000000;
    margin:0px 0px;
}

.charsheet .sheet-table {
    display: table;
    width: 100%;
    position: relative;
}
.charsheet .sheet-table-header { display: table-header-group; }
.charsheet div.sheet-table-body,
.charsheet fieldset.sheet-table-body + .repcontainer { display: table-row-group; }
.charsheet .sheet-table-row,
.charsheet .sheet-table .repcontrol,
.charsheet .sheet-table-body + .repcontainer .repitem { display: table-row; }
.charsheet .sheet-table-cell { display: table-cell; }
.charsheet [data-groupname=repeating_weapon] .sheet-table-cell select.select-abi {
    height: 24px;
    width: 100%;
}
.charsheet .sheet-table-header .sheet-table-cell { font-weight: bold; }
.charsheet .sheet-table-cell:not(:last-child) { padding-right: 3px; }
.charsheet .sheet-table .repcontrol { width: 100%; }
.charsheet .sheet-table .repcontainer + .repcontrol .repcontrol_edit {
    position: absolute;
    right: 0;
}
.charsheet .sheet-table .editmode + .repcontrol .repcontrol_edit {
    right: 41px;
    left: initial;
}
.charsheet .sheet-table [data-groupname=repeating_intimacies-read].editmode + .repcontrol .repcontrol_edit,
.charsheet .sheet-table [data-groupname=repeating_intimacies].editmode + .repcontrol .repcontrol_edit,
.charsheet .sheet-table [data-groupname=repeating_charms].editmode + .repcontrol .repcontrol_edit,
.charsheet .sheet-table [data-groupname=repeating_spells].editmode + .repcontrol .repcontrol_edit { right: 0; }

.charsheet [data-groupname=repeating_weapon].editmode .repitem .itemcontrol,
.charsheet [data-groupname=repeating_armor].editmode .repitem .itemcontrol,
.charsheet [data-groupname=repeating_intimacies-read].editmode .repitem .itemcontrol,
.charsheet [data-groupname=repeating_intimacies].editmode .repitem .itemcontrol,
.charsheet [data-groupname=repeating_spells].editmode .repitem .itemcontrol { height: 28px; }
.charsheet [data-groupname=repeating_weapon].editmode .repitem .itemcontrol { width: calc(100% - 41px); }
.charsheet [data-groupname=repeating_armor].editmode .repitem .itemcontrol { width: calc(100% - 30px); }
.charsheet [data-groupname=repeating_weapon].editmode .sheet-table-cell,
.charsheet [data-groupname=repeating_armor].editmode .sheet-table-cell { position: relative; }
.charsheet [data-groupname=repeating_weapon].editmode .sheet-table-cell { left: -41px; }
.charsheet [data-groupname=repeating_armor].editmode .sheet-table-cell { left: -30px; }

.charsheet .sheet-flexbox-h > label > label,
.charsheet .sheet-flexbox-h > label,
.charsheet .sheet-flexbox0 {
    line-height: 28px;
    margin-bottom: 0;

    display: -webkit-flex;
    display:         flex;

    -webkit-flex-direction: row;
            flex-direction: row;

    flex-grow: 1;
    flex-basis: 10em;
    white-space: nowrap;
}

.charsheet .sheet-flexbox-h.sheet-flexbox-inline > label {
    flex-wrap: wrap;
    flex-basis: 20em;
}

.charsheet .sheet-flexbox-inline {
    display: flex;
    flex-wrap: wrap;
}

.charsheet .sheet-flexbox-inline > label > span {
    white-space: nowrap;
    font-size: 89%;
}

.charsheet .sheet-flexbox-h input[type=text],
.charsheet .sheet-flexbox-h input[type=number],
.charsheet .sheet-flexbox-h select {
    -webkit-flex: 1 1 40%;
            flex: 1 1 40%;
    margin-left: 5px;
}

.charsheet .flex,
.charsheet .flex-col,
.charsheet .flex-wrap {
    display: flex;
    align-items: center;
}

.charsheet .inline-flex {
    display: inline-flex;
}

.charsheet .flex-col {
    flex-flow: column;
    padding: 0;
}

.charsheet .flex-wrap {
    flex-wrap: wrap;
}

.charsheet .flex > * {
    flex-shrink: 0;
}

.charsheet .flex .grow-normal,
.charsheet .inline-flex .grow-normal,
.charsheet .flex-wrap .grow-normal {
    flex-grow: 1;
}

.charsheet .flex .grow-double,
.charsheet .inline-flex .grow-double,
.charsheet .flex-wrap .grow-double {
    flex-grow: 2;
}

.charsheet .flex .grow-max,
.charsheet .inline-flex .grow-max,
.charsheet .flex-wrap .grow-max {
    flex-grow: 42000;
}

.charsheet .flex .basis-33,
.charsheet .inline-flex .basis-33,
.charsheet .flex-wrap .basis-33 {
    flex-basis: 33%;
}

.charsheet .flex .basis-100,
.charsheet .inline-flex .basis-100,
.charsheet .flex-wrap .basis-100 {
    flex-basis: 100%;
}

div.scope-here {
    transform: scale(1);
}

.charsheet .sheet-2col {
    display: inline-block;
    vertical-align: top;
}

.charsheet .sheet-3colrow .sheet-2col:last-child { margin-right: 0; }

.charsheet .sheet-3colrow .sheet-2col:last-child,
.charsheet .sheet-tab-content .sheet-col {
    display: grid;
    align-items: start;
    grid-template-columns: repeat(1, 1fr );
}

.charsheet .sheet-tab-content .sheet-2colrow,
.charsheet .sheet-tab-content .sheet-3colrow {
    display: grid;
    align-items: start;
    gap: 0 1em;
}

.charsheet .sheet-tab-content .sheet-2colrow {
    grid-template-columns: repeat(2, 1fr );
}

.charsheet .sheet-tab-content .sheet-3colrow {
    grid-template-columns: repeat(3, 1fr );
}

.charsheet .sheet-3colrow .sheet-2col:last-child > div,
.charsheet .sheet-tab-content .sheet-2colrow > .sheet-col,
.charsheet .sheet-tab-content .sheet-3colrow > .sheet-col {
    display: grid;
    width: 100%;
    margin-right: auto;
}

.charsheet .sheet-tab-content .sheet-3colrow.sheet-centerblock {
    grid-template-areas: "a b b";
}

.charsheet .sheet-tab-content .sheet-3colrow.sheet-centerblock .sheet-col.sheet-abilities {
    grid-area: a;
}

.charsheet .sheet-tab-content .sheet-3colrow .sheet-2col {
    grid-area: b;
}

.charsheet .sheet-content .sheet-tab-antisocial-sheet .sheet-3colrow,
.charsheet .sheet-content .sheet-tab-intimacies-sheet .sheet-3colrow {
    grid-template-columns: min-content calc(100% - 1em);
}

.charsheet .sheet-content .sheet-tab-antisocial-sheet .sheet-3colrow .sheet-3col.inti-col,
.charsheet .sheet-content .sheet-tab-intimacies-sheet .sheet-3colrow .sheet-3col.inti-col {
    transform: scale(1);
}

.charsheet [title] input[disabled],
.charsheet button[title]:not([type="action"], [name="act_defexc"]),
.charsheet button[title],
.charsheet [title] {
    cursor: help;
}

.charsheet .sheet-dotted { border-bottom: 1px dotted black; }

.charsheet input[type=text],
.charsheet input[type=number] {
    display: inline-block;
    width: 165px;
    font-size: 12pt;
    height: 25px;
    border: 0px;
    background-color: transparent;
    border-bottom: 1px solid black;
}
.sheet-darkmode .charsheet input[type=text],
.sheet-darkmode .charsheet input[type=number],
.sheet-darkmode .charsheet select {
    border-bottom: 1px solid var(--dark-primarytext);
}

.sheet-darkmode .charsheet select:focus {
    background: var(--sheet-bg-col);
}

.charsheet textarea {
    resize: none;
    width: 96%;
    background-color: transparent;
}

.charsheet select {
    width: 45px;
    margin-bottom: 0;
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid black;
    border-radius: 0;
}

.charsheet input[type=number] { text-align: center; }

.charsheet input[type=number][disabled],
.charsheet input[type=number][readonly],
.charsheet select[disabled] {
    background-color: rgba(128, 128, 128, 0.25);
}

.charsheet input[type=text]:not(:focus),
.charsheet input[type=number]:not(:focus),
.charsheet [readonly]:focus {
       -moz-box-shadow: 0 0 0 #000;
    -webkit-box-shadow: 0 0 0 #000;
            box-shadow: 0 0 0 #000;
}

.charsheet input[type=number]::-webkit-inner-spin-button,
.charsheet input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.charsheet input[type=number] {
    --moz-appearance: textfield;
}

.charsheet input[type=checkbox] {
    position: absolute;
    opacity: 0.0;
    width: 15px;
    cursor: pointer;
    z-index: 10;
    margin-top: 5px;
}

.charsheet input[type=checkbox] + span::before {
    border: solid 1px #000000;
    line-height: 11px;
    text-align: center;
    display: inline-block;
    vertical-align: middle;

       -moz-box-shadow: 0 0 0 #000;
    -webkit-box-shadow: 0 0 0 #000;
            box-shadow: 0 0 0 #000;

    background:         #000000;
    background:    -moz-radial-gradient(#f6f6f6, #dfdfdf);
    background: -webkit-radial-gradient(#f6f6f6, #dfdfdf);
    background:     -ms-radial-gradient(#f6f6f6, #dfdfdf);
    background:      -o-radial-gradient(#f6f6f6, #dfdfdf);
    background:         radial-gradient(#f6f6f6, #dfdfdf);

    position: relative;
    content: "";
    opacity: 1.0;
    width: 10px;
    height: 10px;
    font-size: 12px;

       -moz-border-radius: 1px;
    -webkit-border-radius: 1px;
            border-radius: 1px;
}

.charsheet input[type=checkbox]:checked + span::before {
    content: "✓";
    color: #a00;
    font-weight: bold;

       -moz-box-shadow: 0 0 2px transparent;
    -webkit-box-shadow: 0 0 2px transparent;
            box-shadow: 0 0 2px transparent;
}

.charsheet input[type=checkbox].sheet-unnamed-toggle {
    width: 100%;
    height: 100%;
    margin: 0;
    z-index: 5;
}

.charsheet input[type=checkbox].sheet-unnamed-toggle + span::before {
    --padding-top-size: 1px;
    width: 100%;
    height: calc(100% - var(--padding-top-size));
    padding-top: var(--padding-top-size);
    content: attr(title);
    text-align: center;
    line-height: 100%;
    font-size: 18px;
    overflow: hidden;
    z-index: 4;
    border-radius: 4px;
}

.sheet-darkmode .charsheet input[type=checkbox].sheet-unnamed-toggle:not(.btn) + span::before {
    background: #420000;
}

/* fucked up em in companion */
.charsheet input[type=number] {
    width: 56px;
}
.ui-dialog .charsheet input[type=number] {
    width: 3.5em;
}

.charsheet h1,
.charsheet hr {
    background-image:    url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/TwZ84rO.jpg');
    background-position: left 50%;
    background-repeat:   repeat-x;
    background-size:     auto 10px;

    text-align: center;
    width: 100%;
}

.charsheet hr { height: 10px; }

.charsheet label {
    font-size: 16px;
    display: inline;
    cursor: pointer;
    padding-right: 0;
}

.characterviewer label {
    margin-bottom: 5px;
}

.charsheet h1 span {
    background: var(--sheet-bg-col);
    padding: 0 5px;
    font-variant: small-caps;
}
.sheet-darkmode .charsheet h1 span {
	color: var(--dark-primarytext);
}

.sheet-darkmode h1,
.sheet-darkmode h2,
.sheet-darkmode h3,
.sheet-darkmode h4,
.sheet-darkmode h5,
.sheet-darkmode h6 {
    color: var(--dark-primarytext);
}

.charsheet *,
.charsheet .sheet-printed { font-family: Cimiez, Arial, sans-serif; }
.charsheet input,
.charsheet select,
.charsheet option,
.charsheet optgroup,
.charsheet textarea,
.charsheet .btn:not([type=roll]) { font-family: Arial, sans-serif; }
.charsheet .btn.pictos { font-family: Pictos; }

.charsheet *,
.charsheet .sheet-grouped-buttons .btn:not([type=roll]) { font-variant: small-caps; }

.charsheet input,
.charsheet select,
.charsheet option,
.charsheet optgroup,
.charsheet textarea,
.charsheet .sheet-normal-caps,
.charsheet .btn:not([type=roll]) {
	font-variant: normal;
}

.charsheet ::-webkit-input-placeholder { font-style: italic; }
.charsheet :-moz-placeholder { font-style: italic; }
.charsheet ::-moz-placeholder { font-style: italic; }
.charsheet :-ms-input-placeholder { font-style: italic; }

.charsheet input,
.charsheet select,
.charsheet option,
.charsheet optgroup,
.charsheet textarea,
.charsheet .btn:not([type=roll]) {
    font-family: Cimiez, Arial, sans-serif;
}

.charsheet button.sheet-roll {
    height:30px;
    width:42px;
    font-family: Cimiez, Arial, sans-serif;
    font-size:18px !important;
    font-weight:bold;
    padding: 2px 3px;
    margin: 0 3px 0 3px;
}

.charsheet button.sheet-roll.gm-whisper {
    width:55px;
}

.charsheet .caste-check[value="Mortal"] ~ .flex.main-page .sheet-tab-content .def-exc {
    display: none;
}

.charsheet .def-exc button.sheet-roll {
    width: 4em;
    height: 2em;
    cursor: pointer;
}

.charsheet div button[type="action"]:not(.stealth-btn, .cost-trigger):focus,
.charsheet div button[type="roll"]:not(.stealth-btn):focus,
.charsheet div .sheet-grouped-buttons button[type="action"]:not(.cost-trigger):focus,
.charsheet div .sheet-grouped-buttons button[type="roll"]:focus {
    background: linear-gradient(rgb(163, 163, 163), rgb(128, 128, 128)) padding-box, linear-gradient(42deg, #ffda12, #C0C0C0,#fdda12) border-box;
}

.charsheet div button.cost-trigger[type="action"]:focus,
.charsheet div .sheet-grouped-buttons button.cost-trigger[type="action"]:focus {
    outline: 3px solid white;
    outline-offset: -3px;
    border-radius: 6px;
}

.charsheet div .sheet-grouped-buttons button[type="action"],
.charsheet div .sheet-grouped-buttons button[type="roll"] {
	margin: 0;
	border-radius: 0;
	border: 0;
	background: none;
	padding: 0 2px;
	height: 1.3em;
    border-right: 1px solid;
}

.charsheet div .sheet-grouped-buttons button[type="action"]:last-child,
.charsheet div .sheet-grouped-buttons button[type="roll"]:last-child {
    border-right: 0;
}

.charsheet div .sheet-grouped-buttons {
	display: inline-flex;
	background: linear-gradient(rgb(128, 128, 128), rgb(128, 128, 128)) padding-box, linear-gradient(42deg, #ffda12, #C0C0C0,#fdda12) border-box;
	border: 2px solid transparent;
	border-radius: 4px;
	font-size: 0;
    transition: box-shadow 1s;
    /* WTF THIS BREAK JS BINDING ON CLICKS ????? */
    /* position: relative; */
}

textarea {
    cursor: auto;
}

textarea {
    scrollbar-width: thin;
    scrollbar-color: #90A4AE #CFD8DC;
}

textarea::-webkit-scrollbar {
    width: 9px;
}

textarea::-webkit-scrollbar-thumb {
    background-color: #90A4AE;
    border-radius: 5px;
    border: 1px solid #CFD8DC;
}

textarea::-webkit-scrollbar-thumb:hover {
    background-color: #7a8991;
}

textarea::-webkit-scrollbar-track {
    background: #CFD8DC;
}

/* DOTS radio Style */
.charsheet div.sheet-dots,
.charsheet div.sheet-dots input[class^=sheet-dots],
.charsheet div.sheet-dots input[class^=sheet-dots] + span {
    width: 100px;
    height: 20px;
}

.charsheet div.sheet-damage-box { margin-left: 2px; }
.charsheet div.sheet-damage-box,
.charsheet div.sheet-damage-box input[class^=sheet-dots],
.charsheet div.sheet-damage-box input[class^=sheet-dots] + span {
    width: 20px;
    height: 20px;
}

.charsheet div.sheet-dots-full,
.charsheet div.sheet-dots-full input[class^=sheet-dots],
.charsheet div.sheet-dots-full input[class^=sheet-dots] + span {
    width: 251px;
    height: 20px;
}

.sheet-darkmode .charsheet div.sheet-dots-full,
.sheet-darkmode .charsheet div.sheet-damage-box,
.sheet-darkmode .charsheet div.sheet-dots {
    background-color: dimgray;
}

.charsheet input[class^=sheet-dots],
.charsheet input[class^=sheet-dots] + span,
.charsheet input[class^=sheet-dots] + span::before {
    position: absolute;
    top: 0;
    left: 0;
}

.charsheet div.sheet-dots {
    display: inline-block;
    position: relative;
    padding: 0;
}

.charsheet div.sheet-dots-full,
.charsheet div.sheet-damage-box {
    margin: auto;
    position: relative;
}

.charsheet div.sheet-dots-full,
.charsheet div.sheet-dots {
    border-radius: 10px;
}
.charsheet div.sheet-damage-box {
    border-radius: 2px;
}

.charsheet input[class^=sheet-dots] + span {
    display: inline-block;
    z-index: 0;
}

.charsheet input[class^=sheet-dots] {
    opacity: 0;
    z-index: 1;
}

.charsheet input.sheet-dots0 { z-index: 2; }
.charsheet .sheet-layer4 input.sheet-dots0 { z-index: 6; }
.charsheet .sheet-layer6 input.sheet-dots0 { z-index: 8; }

${[...Array(10).keys()].map(i => /*css*/`.charsheet input.sheet-dots${i}:checked ~ input.sheet-dots${i+1}`).join(',\n')} { z-index: 3; }
${[...Array(10).keys()].map(i => /*css*/`.charsheet .sheet-layer4 input.sheet-dots${i}:checked ~ input.sheet-dots${i+1}`).join(',\n')} { z-index: 6; }
${[...Array(10).keys()].map(i => /*css*/`.charsheet .sheet-layer6 input.sheet-dots${i}:checked ~ input.sheet-dots${i+1}`).join(',\n')} { z-index: 8; }

/* 5dot box */
.charsheet div.sheet-dots input.sheet-dots0:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/brHawNF.png'); }
.charsheet div.sheet-dots input.sheet-dots1:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/FxaE1ej.png'); }
.charsheet div.sheet-dots input.sheet-dots2:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/mmaaeuA.png'); }
.charsheet div.sheet-dots input.sheet-dots3:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/XzoEKTo.png'); }
.charsheet div.sheet-dots input.sheet-dots4:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/7Km42YB.png'); }
.charsheet div.sheet-dots input.sheet-dots5:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/fQOCs6f.png'); }

.charsheet div.sheet-dots input.sheet-dots6:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/WKzdUXT.png'); }
.charsheet div.sheet-dots input.sheet-dots7:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/s2SiCHt.png'); }
.charsheet div.sheet-dots input.sheet-dots8:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/xFhuyPk.png'); }
.charsheet div.sheet-dots input.sheet-dots9:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/Pp4lKMB.png'); }
.charsheet div.sheet-dots input.sheet-dots10:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/GqD4DW9.png'); }

/* 10dot box */
.charsheet div.sheet-dots-full input.sheet-dots0:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/aoLkPUD.png'); }
.charsheet div.sheet-dots-full input.sheet-dots1:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/yuMkIYx.png'); }
.charsheet div.sheet-dots-full input.sheet-dots2:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/v8N22sh.png'); }
.charsheet div.sheet-dots-full input.sheet-dots3:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/f4los8X.png'); }
.charsheet div.sheet-dots-full input.sheet-dots4:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/JcMtOks.png'); }
.charsheet div.sheet-dots-full input.sheet-dots5:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/b5t5pWv.png'); }
.charsheet div.sheet-dots-full input.sheet-dots6:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/DrkRvoQ.png'); }
.charsheet div.sheet-dots-full input.sheet-dots7:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/P8edx1p.png'); }
.charsheet div.sheet-dots-full input.sheet-dots8:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/lJPrvey.png'); }
.charsheet div.sheet-dots-full input.sheet-dots9:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/updBVIp.png'); }
.charsheet div.sheet-dots-full input.sheet-dots10:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/1ymfexj.png'); }

.charsheet div.sheet-damage-box input.sheet-dots0:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/HAiWBJU.png'); }
.charsheet div.sheet-damage-box input.sheet-dots1:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/ZA7t2og.png'); }
.charsheet div.sheet-damage-box input.sheet-dots2:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/Skkftsx.png'); }
.charsheet div.sheet-damage-box input.sheet-dots3:checked + span::before { content: url('https://imgsrv.roll20.net/?src=http%3A//i.imgur.com/WwEsO6c.png'); }

.charsheet input.sheet-dots0,
.charsheet input[class^=sheet-dots]:checked + span + input { cursor: pointer; }







/**
 * CHARACTER TAB
 */
/* --- ATTR, Abilities & Columns --- */
.charsheet .sheet-checklist > label,
.charsheet .repcontainer[data-groupname="repeating_abilities"] .repitem {
    display: block;
}

.charsheet .sheet-trait > * {
    vertical-align: middle;
}

.charsheet .sheet-trait > label {
    width: fit-content;
    white-space: nowrap;
}

.charsheet .sheet-trait {
    position: relative;
    display: grid;
    grid-template-columns: auto calc((1.75em + 2px) * 3);
    align-items: start;
}

.charsheet .repcontainer[data-groupname="repeating_qcactions"] .sheet-trait > input {
    width: 100%;
}

.charsheet .repcontainer[data-groupname="repeating_qcattacks"] .sheet-trait {
    grid-template-columns: auto calc(3em + 2px + (1.75em + 2px) * 2);
}

.charsheet .caste-have-exc-check[value="1"] ~ .flex.main-page .sheet-tab-content .sheet-trait.four-cell {
    grid-template-columns: auto calc((1.75em + 2px) * 4);
}

.charsheet .caste-have-exc-check[value="1"] ~ .flex.main-page .sheet-tab-content .repcontainer[data-groupname="repeating_qcattacks"] .sheet-trait.four-cell {
    grid-template-columns: auto calc(3em + 2px + (1.75em + 2px) * 3);
}

.charsheet .sheet-trait > div.sheet-dots {
    justify-self: end;
}
.charsheet .sheet-trait > span:last-child,
.charsheet .sheet-trait > input:last-child {
    display: flex;
    position: absolute;
    right: 0;
    bottom: 0;
}

.charsheet .sheet-tab-content .sheet-attributes.sheet-3colrow {
    grid-template-rows: repeat(3, 1fr);
    grid-auto-flow: column;
}

.charsheet input[type=checkbox].sheet-unnamed-toggle:checked + span:not([title="Show Commits"])::before {
    border-bottom: 0;
}

.charsheet input[type=checkbox].sheet-unnamed-toggle:not(:checked) + span + div { display: none; }
.charsheet input[type=checkbox].sheet-unnamed-toggle:checked + span + div {
    display: block;
    position: relative;
    top: -1px;
    left: -142px;
    border: 1px solid black;
    padding: 5px;
	border: 3px solid transparent;
    border-radius: 13px;
    width: 250px;
    background: linear-gradient(#f6f6f6, #f6f6f6) padding-box, linear-gradient(-42deg, #ffda12, #C0C0C0,#fdda12) border-box;
}
.sheet-darkmode input[type=checkbox].sheet-unnamed-toggle:checked + span + div {
    background: linear-gradient(#1F1F1F, #1F1F1F) padding-box, linear-gradient(-42deg, #ffda12, #C0C0C0,#fdda12) border-box;
}

.charsheet input[type=checkbox].sheet-unnamed-toggle:checked + span[title="Show styles"] + div {
    width: 355px;
}

.charsheet input[type=checkbox].sheet-unnamed-toggle + span::before {
    background: #fff8aa;
}

.charsheet .sheet-max-ma-val[value="0"] ~ input[type=checkbox].sheet-unnamed-toggle + span::before,
.charsheet .sheet-max-craft-val[value="0"] ~ input[type=checkbox].sheet-unnamed-toggle + span::before {
    background: radial-gradient(#f6f6f6, #dfdfdf);
}
.sheet-darkmode .charsheet .sheet-max-ma-val[value="0"] ~ input[type=checkbox].sheet-unnamed-toggle + span::before,
.sheet-darkmode .charsheet .sheet-max-craft-val[value="0"] ~ input[type=checkbox].sheet-unnamed-toggle + span::before {
    background: dimgray;
}

.charsheet .sheet-unnamed-toggle + span + div > .sheet-trait > label,
.charsheet [data-groupname=repeating_crafts] input,
.charsheet [data-groupname=repeating_ma] input { width: 130px; height: 20px; }

.charsheet .sheet-unnamed-toggle + span + div > .sheet-trait > label,
.charsheet .sheet-unnamed-toggle + span + div > .sheet-trait > label > label {
    width: 100px;
    padding-left: 5px;
}

.charsheet .sheet-6rows {
    height: calc(4em + 30px);
}

.charsheet .sheet-temp-will { padding-left: 12px; }
.charsheet .sheet-temp-will input,
.charsheet .sheet-temp-will input + span {
    margin-right: 9.75px;
}
.charsheet .sheet-temp-will input:last-child,
.charsheet .sheet-temp-will input:last-child + span {
    margin: 0;
}

.charsheet .sheet-motes,
.charsheet .sheet-battle-group-row {
    clear: right;
    position: relative;
    padding-left: 30px;
}
.charsheet .sheet-motes:first-child,
.charsheet .sheet-battle-group-row {
    margin-top: 10px;
}
.charsheet .sheet-motes {
    line-height: 25px;
}
.charsheet button.gm-only.add-mote:before {
    vertical-align: middle;
}

.charsheet button.gm-only {
    display: none;
}

.charsheet .main-page .sheet-trait input[type="number"],
.charsheet .main-page .sheet-trait span input[type="text"]:not(.sheet-qc-social-influence-type, .sheet-qc-attack-pool),
.charsheet .main-page .sheet-motes input[type=number],
.charsheet .main-page .sheet-motes input[type=text],
.charsheet .main-page .sheet-battle-group-row input[type=number] {
    width: 1.75em;
    font-size: 14px;
}

.charsheet .sheet-battle-group-row:last-child input[type=number],
.charsheet .sheet-battle-group-row select {
    width: 71px;
}

/* EXRolls */
.charsheet .sheet-exroll-container {
    display: block;
}

.charsheet .sheet-exroll {
    display: none;
}

.charsheet .roll-diceex-check[value="0"] + .roll-succex-check[value="0"] ~ .flex.main-page .sheet-tab-character-sheet .sheet-exroll.exroll-vanilla,
.charsheet .roll-diceex-check[value="1"] + .roll-succex-check[value="0"] ~ .flex.main-page .sheet-tab-character-sheet .sheet-exroll.exroll-diceex,
.charsheet .roll-diceex-check[value="0"] + .roll-succex-check[value="1"] ~ .flex.main-page .sheet-tab-character-sheet .sheet-exroll.exroll-succex,
.charsheet .roll-diceex-check[value="1"] + .roll-succex-check[value="1"] ~ .flex.main-page .sheet-tab-character-sheet .sheet-exroll.exroll-full,
.charsheet .roll-diceex-check[value="0"] + .roll-succex-check[value="0"] ~ .flex.main-page .sheet-tab-rolls-sheet .sheet-exroll.exroll-vanilla,
.charsheet .roll-diceex-check[value="1"] + .roll-succex-check[value="0"] ~ .flex.main-page .sheet-tab-rolls-sheet .sheet-exroll.exroll-diceex,
.charsheet .roll-diceex-check[value="0"] + .roll-succex-check[value="1"] ~ .flex.main-page .sheet-tab-rolls-sheet .sheet-exroll.exroll-succex,
.charsheet .roll-diceex-check[value="1"] + .roll-succex-check[value="1"] ~ .flex.main-page .sheet-tab-rolls-sheet .sheet-exroll.exroll-full {
    display: flex;
    justify-content: center;
}

.charsheet .sheet-exroll-div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-bottom: 1em;
    margin-bottom: 1em;
    border-bottom: gold 3px solid;
    border-radius: 2px;
    align-items: center;
}

/* --- Merits block --- */
.charsheet input.merits-length-check[value="1"] ~ .repcontainer[data-groupname="repeating_merits"] {
    height: 24em;
    overflow: auto;
    resize: vertical;
    scrollbar-width: thin;
    scrollbar-color: #90A4AE #CFD8DC;
}

.charsheet input.merits-length-check[value="1"] ~ .repcontainer[data-groupname="repeating_merits"]::-webkit-scrollbar {
    width: 9px;
    cursor: pointer;
}

.charsheet input.merits-length-check[value="1"] ~ .repcontainer[data-groupname="repeating_merits"]::-webkit-scrollbar-thumb {
    background-color: #90A4AE;
    border-radius: 5px;
    border: 1px solid #CFD8DC;
}

.charsheet input.merits-length-check[value="1"] ~ .repcontainer[data-groupname="repeating_merits"]::-webkit-scrollbar-thumb:hover {
    background-color: #7a8991;
}

.charsheet input.merits-length-check[value="1"] ~ .repcontainer[data-groupname="repeating_merits"]::-webkit-scrollbar-track {
    background: #CFD8DC;
}

.charsheet .sheet-short-merit-section {
    display: inline-block;
    width: calc(50% - 20px);
    margin-right: 20px;
    position: relative;
	display:none;
}

.charsheet .sheet-long-merit-section {
    display: inline-block;
    width: calc(100% - 20px);
    margin-right: 20px;
    position: relative;
	display:none;
}

.charsheet .repcontainer[data-groupname="repeating_merits"] .repitem {
    display: flex;
    width: 100%;
    margin-bottom: 2px;
}

.charsheet .repcontainer[data-groupname="repeating_merits"] .repitem .merit-input-area {
    width: calc(100% - 100px - 60px);
}

.charsheet .repcontainer[data-groupname="repeating_merits"] .repitem .merits-toggle-desc[value="on"] ~ .merit-input-area {
    flex: 1 1 100%;
}

.charsheet [data-groupname=repeating_merits] input[type=text],
.charsheet [data-groupname=repeating_merits] .inline-merits-desc,
.charsheet .inline-merits-name {
    width: 100%;
}

.charsheet [data-groupname=repeating_merits] textarea.merit-textarea {
    width: 97%;
    height: 3em;
    margin-bottom: -5px;
    resize: vertical;
}

.charsheet .repcontainer[data-groupname="repeating_merits"] .repitem .merits-dots {
    position: relative;
    right: 0px;
}

.charsheet .repcontainer[data-groupname="repeating_merits"] .repitem .merits-div-checkbox {
    height: fit-content;
    width: 50px;
}

.charsheet .repcontainer[data-groupname="repeating_merits"] .merit-dot-toggle-wrapper {
    display: flex;
    align-content: space-between;
    flex: 1 1 min-content;
    flex-flow: wrap-reverse;
    justify-content: flex-end;
}

.charsheet .repcontainer[data-groupname="repeating_merits"] .repitem .merits-div-cast label {
    margin: 0;
    height: fit-content;
    width: fit-content;
}

.charsheet .repcontainer[data-groupname="repeating_merits"] .repitem .merits-div-cast label,
.charsheet .repcontainer[data-groupname="repeating_merits"] .repitem .merits-div-cast label button {
    height: 18px;
    width: fit-content;
}

.charsheet .merits-toggle-desc[value="on"] ~ .merit-dot-toggle-wrapper > .merits-div-cast {
    display: block;
    width: 43px;
}

.charsheet .merits-toggle-desc[value="0"] ~ .merit-dot-toggle-wrapper > .merits-div-cast {
    display: none;
}

.charsheet .merits-div-checkbox {
    --merit-button-border-color: #D0D0D0;
    margin-left: 4px;
    background-color:#EFEFEF;
    border-radius:4px;
    border:1px solid var(--merit-button-border-color);
}
.charsheet .merits-div-checkbox:has(> label:hover),
.charsheet .merits-div-checkbox:has(input:focus) {
    --merit-button-border-color: gold;
    outline: 1px solid var(--merit-button-border-color);
}
.charsheet .merits-div-checkbox:has(> label:hover):has(input:focus) {
    --merit-button-border-color: rgb(255, 174, 0);
}

.charsheet .merits-div-checkbox input + strong:before {
    text-align:center;
    padding:3px 0px;
    display:block;
    content: 'NOM';
}
.sheet-darkmode .merits-div-checkbox input + strong:before{
    background: dimgray;
    color: #e6e6e6;
}

.charsheet .merits-div-checkbox label input {
    position:absolute;
    top:8px;
}

.charsheet .merits-div-checkbox input:checked + strong:before {
    background-color:#911;
    color:#fff;
    content: 'DESC';
}

.charsheet .merits-toggle-desc[value="0"] ~ .inline-merits-name,
.charsheet .merits-toggle-desc[value="on"] ~ .inline-merits-desc {
    display: inline-block;
}

.charsheet .merits-toggle-desc[value="on"] ~ .inline-merits-name,
.charsheet .merits-toggle-desc[value="0"] ~ .inline-merits-desc {
    display: none;
}

/* --- BATTLEGROUP, MOTES, LIMIT & SUPERNAL --- */
.charsheet .sheet-motes span,
.charsheet .sheet-battle-group-row span {
    display: inline-block;
}

.charsheet .sheet-motes span:last-child,
.charsheet .sheet-battle-group-row span:last-child {
    position: absolute;
    right: 40px;
    font-size: 20px;
}
.charsheet .sheet-motes span:last-child {
    top: -2px;
}

.charsheet .sheet-battle-group-row select:last-child {
    position: absolute;
    right: 40px;
}

.charsheet input.show-anima[value="1"] ~ div.anima-box,
.charsheet input.show-sup[value="1"] ~ div.supernal-box,
.charsheet input.show-limit[value="1"] ~ div.sheet-2colrow div.sheet-col div.limit-box {
	visibility: visible;
}
.charsheet input.show-anima[value="0"] ~ div.anima-box,
.charsheet input.show-sup[value="0"] ~ div.supernal-box,
.charsheet input.show-limit[value="0"] ~ div.sheet-2colrow div.sheet-col div.limit-box {
    display: none;
}

/* --- QC Hide/show divs --- */
.charsheet .sheet-col.stat-col .qc-panel-check[value="1"] ~ .qc-toggle-display,
.charsheet .qc-panel-check[value="1"] ~ .qc-toggle-display {
    display: none;
}

.charsheet .caste-have-exc-check[value="1"] ~ .flex.main-page .head-line .flex .qc-panel-check[value="1"] ~ .qc-toggle-display-inv.qc-have-exc {
    display: inline-flex;
    width: 27px;
}

.charsheet .sheet-defenses .flex-col .qc-panel-check[value="1"] ~ .qc-toggle-display-inv,
.charsheet .sheet-col.stat-col .qc-panel-check[value="1"] ~ .qc-toggle-display-inv {
    display: flex;
}

.charsheet .qc-panel-check[value="1"] ~ .qc-toggle-display-inv {
    display: table-row;
}

.charsheet .sheet-qc-pools .sheet-qc-social-influence-type {
    width: 6em;
}

.charsheet .sheet-qc-defenses > .sheet-trait,
.charsheet .sheet-qc-pools > .sheet-trait {
    height: 25px;
}

.charsheet .sheet-tab-content input[type="text"].qc-toggle-display-inv.qc-have-exc,
.charsheet .sheet-col.stat-col div.qc-toggle-display-inv,
.charsheet div.qc-toggle-display-inv {
    display: none;
}

.charsheet .qc-panel-check[value="1"] ~ .qc-toggle-visibility {
    visibility: hidden;
}

.charsheet .caste-have-exc-check[value="0"] ~ .flex.main-page .sheet-tab-content .sheet-defenses .flex-col .qc-have-exc,
.charsheet .caste-have-exc-check[value="0"] ~ .flex.main-page .sheet-tab-content .qc-have-exc {
    display: none;
}

.charsheet .sheet-tab-content .qc-have-exc {
    background: #ffd70080;
    text-align: center;
}

.charsheet .hideous-check[value="1"] ~ .reminder-cell[title="Appearance"],
.charsheet div.sheet-qc-defenses .hideous-check[value="1"] ~ .sheet-trait.qc-appearance-trait {
    background: linear-gradient(180deg, transparent, darkred, transparent);
}

.charsheet .main-page [data-groupname=repeating_qcattacks] .sheet-trait span input[type="text"].sheet-qc-attack-pool {
    font-size: 14px;
    width: 3em;
}

.charsheet [data-groupname=repeating_qcattacks] .sheet-trait span input[type="text"]:not(.qc-have-exc) {
    text-align: right;
}

.charsheet [data-groupname=repeating_qcattacks] .sheet-trait > input[type="text"] {
    width: 100%;
}
.charsheet .sheet-quick-character[value="0"] ~ .flex.main-page div.sheet-tab-character-sheet .sheet-qc-pools,
.charsheet .sheet-quick-character[value="0"] ~ .flex.main-page div.sheet-tab-character-sheet .sheet-qc-defenses {
    display: none;
}

.charsheet .sheet-quick-character[value="1"] ~ .flex.main-page div.sheet-tab-character-sheet > .sheet-attributes,
.charsheet .sheet-quick-character[value="1"] ~ .flex.main-page div.sheet-tab-character-sheet .sheet-abilities,
.charsheet .sheet-quick-character[value="1"] ~ .flex.main-page div.sheet-tab-character-sheet .sheet-limit,
.charsheet .sheet-quick-character[value="1"] ~ .flex.main-page div.sheet-tab-character-sheet .sheet-experience,
.charsheet .sheet-quick-character[value="1"] ~ .flex.main-page div.sheet-tab-character-sheet .sheet-gear {
    display: none;
}

/* --- BG Hide/show divs --- */
.charsheet .sheet-battle-group[value="0"] ~ .flex.main-page div.sheet-tab-character-sheet .sheet-battle-group-header,
.charsheet .sheet-battle-group[value="0"] ~ .flex.main-page div.sheet-tab-character-sheet .sheet-battle-group-body {
    display: none;
}

.charsheet .sheet-battle-group[value="1"] ~ .flex.main-page div.sheet-tab-character-sheet > .sheet-health-track,
.charsheet .sheet-battle-group[value="1"] ~ .flex.main-page div.sheet-tab-character-sheet > .sheet-health-header,
.charsheet .sheet-battle-group[value="1"] ~ .flex.main-page div.sheet-tab-character-sheet h1.sheet-qc-health {
    display: none;
}

.charsheet .caste-check[value="Mortal"] ~ .flex.main-page div.sheet-hide-to-mortal {
    display: none;
}

.charsheet .show-limit[value="0"] ~ div.sheet-2colrow.sheet-resize-to-mortal {
    grid-template-columns: none;
}

.charsheet [data-groupname=repeating_abilities] input[type=text] { width: 120px; }
.charsheet [data-groupname=repeating_specialties] input,
.charsheet .sheet-crafting-projects input {
	margin-top: 3px;
}

.charsheet .sheet-armor input[type=text],
.charsheet .sheet-armor input[type=number],
.charsheet [data-groupname=repeating_weapon] input[type=text],
.charsheet [data-groupname=repeating_weapon] input[type=number] { width: 100%; }

.charsheet [data-groupname=repeating_intimacies-read] input[type=text],
.charsheet [data-groupname=repeating_intimacies] input[type=text],
.charsheet [data-groupname=repeating_charms] input,
.charsheet [data-groupname=repeating_spells] input[type=text],
.charsheet [data-groupname=repeating_spells] input[type=number],
.charsheet .sheet-tab-content div.repcontainer .sheet-table.sheet-body > div:nth-child(2) input[type=text],
.charsheet .sheet-tab-content div.repcontainer .sheet-table.sheet-body > div:nth-child(2) input[type=number] {
    width: 80px;
    margin-top: 3px;
}

.charsheet [data-groupname=repeating_intimacies-read] select,
.charsheet [data-groupname=repeating_intimacies-read] input[type=text],
.charsheet [data-groupname=repeating_intimacies] select,
.charsheet [data-groupname=repeating_intimacies] input[type=text] { width: 100%; }

.charsheet [data-groupname=repeating_weapon] input,
.charsheet [data-groupname=repeating_armor] input,
.charsheet [data-groupname=repeating_intimacies-read] select,
.charsheet [data-groupname=repeating_intimacies-read] input[type=text],
.charsheet [data-groupname=repeating_intimacies] select,
.charsheet [data-groupname=repeating_intimacies] input[type=text],
.charsheet [data-groupname=repeating_charms] select,
.charsheet [data-groupname=repeating_charms] input[type=text],
.charsheet [data-groupname=repeating_charms] input[type=number],
.charsheet [data-groupname=repeating_spells] select,
.charsheet [data-groupname=repeating_spells] input[type=text],
.charsheet [data-groupname=repeating_spells] input[type=number] { margin-bottom: 3px; }

.charsheet .sheet-unnamed-toggle + span + div > .sheet-trait > label {
    display: inline-block;
    margin: 0;
}

.charsheet .repcontrol_del,
.charsheet .repcontrol_move {
    z-index: 11;
    position: absolute;
}
.charsheet .repcontrol_del { right: 0; }

.charsheet .editmode + .repcontrol .repcontrol_edit {
    float: none !important;
    position: relative;
    left: calc(100% - 52px);
}

.charsheet .repcontainer { margin-bottom: 5px; }

/**
 * Color Code Display for Status & Wound Pen
 * used in weapons, defense and woundpen inputs
 */
.charsheet .wound-penalty-check[value="0"] ~ .flex.main-page .onslaught-taint.wound-taint,
.charsheet .onslaught-taint {
    background-color: #bc69c4;
    font-weight: bold;
    background-image: linear-gradient(-45deg, var(--onslaught-color), transparent, transparent);
}
 
.charsheet .flex.main-page .apply-onslaught-check[value="0"] ~ .onslaught-taint.wound-taint,
.charsheet .flex.main-page .onslaught-check[value="0"] ~ .onslaught-taint.wound-taint {
    background-image: none;
}
 
 /* Simple status Colors + variables */
.charsheet .cover-bonus-check:not([value="0"]) ~ .flex.main-page .cover-taint {
    box-shadow: inset var(--bs-default-poffsetbig) var(--bs-default-poffsetbig) var(--loc-cover-color),
                inset var(--bs-default-noffsetbig) var(--bs-default-poffsetbig) var(--loc-cover-color);
}
.charsheet .cover-bonus-check[value="1"] ~ .flex.main-page .cover-taint {
    --loc-cover-color: var(--bs-light-cover-color);
}
.charsheet .cover-bonus-check[value="2"] ~ .flex.main-page .cover-taint {
    --loc-cover-color: var(--bs-heavy-cover-color);
}

.charsheet .clash-penalty-check[value="2"] ~ .flex.main-page .clash-taint {
    outline: 2px solid var(--bs-clash-color);
}
 
.charsheet .full-def-bonus-check[value="2"] ~ .flex.main-page .cover-taint {
    --ts-offset: 2px;
    --ts-blur: 1px;
    --ts-color: #0070ff;
    text-shadow: var(--ts-offset)            var(--ts-offset)            var(--ts-blur) var(--ts-color),
                calc(-1 * var(--ts-offset)) var(--ts-offset)            var(--ts-blur) var(--ts-color),
                var(--ts-offset)            calc(-1 * var(--ts-offset)) var(--ts-blur) var(--ts-color),
                calc(-1 * var(--ts-offset)) calc(-1 * var(--ts-offset)) var(--ts-blur) var(--ts-color);
}

.charsheet .grab-penalty-check[value="2"] ~ .flex.main-page .grab-taint {
    box-shadow: var(--bs-default-poffsetbiggest) 0 var(--bs-default-blurbig) var(--bs-grab-color),
                var(--bs-default-noffsetbiggest) 0 var(--bs-default-blurbig) var(--bs-grab-color);
}

.charsheet .prone-penalty-check[value="1"] ~ .flex.main-page .prone-taint,
.charsheet .prone-penalty-check[value="1"] ~ .flex.main-page .prone-taint-doubled {
    box-shadow: 0 var(--loc-prone-size) var(--bs-default-blur) var(--loc-prone-color);
    --loc-prone-size: var(--bs-default-poffsetbigger);
    --loc-prone-color: var(--bs-prone-color);
}
.charsheet .prone-penalty-check[value="1"] ~ .flex.main-page .prone-taint-doubled {
    --loc-prone-size: var(--bs-default-poffsetbiggest);
}
.sheet-darkmode .charsheet .prone-penalty-check[value="1"] ~ .flex.main-page .prone-taint,
.sheet-darkmode .charsheet .prone-penalty-check[value="1"] ~ .flex.main-page .prone-taint-doubled {
    --loc-prone-color: var(--bs-prone-color-dark);
}

/* Double status Colors */
.charsheet .cover-bonus-check:not([value="0"]) ~ .grab-penalty-check[value="2"] ~ .flex.main-page .grab-taint.cover-taint {
    box-shadow: inset var(--bs-default-poffsetbig) var(--bs-default-poffsetbig) var(--loc-cover-color),
                inset var(--bs-default-noffsetbig) var(--bs-default-poffsetbig) var(--loc-cover-color),
                var(--bs-default-poffsetbiggest) 0 var(--bs-default-blurbig) var(--bs-grab-color),
                var(--bs-default-noffsetbiggest) 0 var(--bs-default-blurbig) var(--bs-grab-color);
}

.charsheet .cover-bonus-check:not([value="0"]) ~ .prone-penalty-check[value="1"] ~ .flex.main-page .prone-taint.cover-taint,
.charsheet .cover-bonus-check:not([value="0"]) ~ .prone-penalty-check[value="1"] ~ .flex.main-page .prone-taint-doubled.cover-taint {
    box-shadow: inset var(--bs-default-poffsetbig) var(--bs-default-poffsetbig) var(--loc-cover-color),
                inset var(--bs-default-noffsetbig) var(--bs-default-poffsetbig) var(--loc-cover-color),
                0 var(--loc-prone-size) var(--bs-default-blur) var(--loc-prone-color);
}

.charsheet .grab-penalty-check[value="2"] ~ .prone-penalty-check[value="1"] ~ .flex.main-page .prone-taint.grab-taint,
.charsheet .grab-penalty-check[value="2"] ~ .prone-penalty-check[value="1"] ~ .flex.main-page .prone-taint-doubled.grab-taint {
    box-shadow: var(--bs-default-poffsetbiggest) 0 var(--bs-default-blurbig) var(--bs-grab-color),
                var(--bs-default-noffsetbiggest) 0 var(--bs-default-blurbig) var(--bs-grab-color),
                0 var(--loc-prone-size) var(--bs-default-blur) var(--loc-prone-color);
}

/* Triple status Colors */
.charsheet .cover-bonus-check:not([value="0"]) ~ .grab-penalty-check[value="2"] ~ .prone-penalty-check[value="1"] ~ .flex.main-page .prone-taint.grab-taint.cover-taint,
.charsheet .cover-bonus-check:not([value="0"]) ~ .grab-penalty-check[value="2"] ~ .prone-penalty-check[value="1"] ~ .flex.main-page .prone-taint-doubled.grab-taint.cover-taint {
        box-shadow: inset var(--bs-default-poffsetbig) var(--bs-default-poffsetbig) var(--loc-cover-color),
                inset var(--bs-default-noffsetbig) var(--bs-default-poffsetbig) var(--loc-cover-color),
                var(--bs-default-poffsetbiggest) 0 var(--bs-default-blurbig) var(--bs-grab-color),
                var(--bs-default-noffsetbiggest) 0 var(--bs-default-blurbig) var(--bs-grab-color),
                0 var(--loc-prone-size) var(--bs-default-blur) var(--loc-prone-color);
}

.charsheet .wound-penalty-check[value="0"] ~ .flex.main-page .apply-onslaught-check[value="0"] ~ .onslaught-taint.wound-taint,
.charsheet .wound-penalty-check[value="0"] ~ .flex.main-page .onslaught-check[value="0"] ~ .onslaught-taint.wound-taint,
.charsheet .wound-penalty-check[value="0"] ~ .flex.main-page .wound-taint {
    --loc-wound-color: rgba(128, 128, 128, 0.25);
    background-color: var(--loc-wound-color);
    font-weight: normal;
}

/* Woundpen Colors */
.charsheet .wound-penalty-check:not([value="0"]) ~ .flex.main-page .wound-taint {
    background-color: var(--loc-wound-color) !important;
    font-weight: bold;
}

.charsheet .wound-penalty-check[value="1"] ~ .flex.main-page .wound-taint {
    --loc-wound-color: yellow;
}
.sheet-darkmode .charsheet .wound-penalty-check[value="1"] ~ .flex.main-page .wound-taint {
    --loc-wound-color: #d5d500;
    color: var(--sheet-bg-col);
}

.charsheet .wound-penalty-check[value="2"] ~ .flex.main-page .wound-taint {
    --loc-wound-color: orange;
}
.sheet-darkmode .charsheet .wound-penalty-check[value="2"] ~ .flex.main-page .wound-taint {
    --loc-wound-color: #ab6f00;
}

.charsheet .wound-penalty-check[value="3"] ~ .flex.main-page .wound-taint {
    --loc-wound-color: orangered;
}
.sheet-darkmode .charsheet .wound-penalty-check[value="3"] ~ .flex.main-page .wound-taint {
    --loc-wound-color: #9f2c01;
}

.charsheet .wound-penalty-check[value="4"] ~ .flex.main-page .wound-taint {
    --loc-wound-color: red;
}
.sheet-darkmode .charsheet .wound-penalty-check[value="4"] ~ .flex.main-page .wound-taint {
    --loc-wound-color: darkred;
}

.charsheet input[type=number].onslaught-input {
    --loc-wound-color: var(--onslaught-color);
    background-color: var(--loc-wound-color);
    font-weight: bold;
}

.charsheet .flex.main-page .apply-onslaught-check[value="0"] ~ input[type=number].onslaught-input,
.charsheet .flex.main-page .onslaught-check[value="0"] ~ input[type=number].onslaught-input {
    --loc-wound-color: rgba(128, 128, 128, 0.25);
}

.charsheet .flex.main-page .onslaught-check[value="0"] ~ input[type=number].onslaught-input {
    font-weight: normal;
}

${[...Array(11).keys()].map(i => i + 5).map(i => /*css*/`.charsheet .wound-penalty-check[value="${i}"] ~ .flex.main-page .wound-taint`).join(',\n')} {
    --loc-wound-color: black;
}

.sheet-darkmode .charsheet input[type=number][disabled].rollpenalty,
.sheet-darkmode .charsheet input[type=number][disabled].woundpenalty,
.sheet-darkmode .charsheet input[type=number][disabled].woundpenalty-input {
    background-color: darkred;
}

/* -- DEFENSE -- */
.charsheet .sheet-defenses .flex-col {
    flex-basis: 128px;
    align-items: end;
}

.charsheet .sheet-defenses .flex-col.def-exc,
.charsheet .sheet-defenses .flex-col:nth-of-type(1) {
    align-items: center;
}

@media only screen and (max-width: 448px) {
    .sheet-tab-combat-sheet .sheet-defenses .flex-col.def-exc {
        order: 1;
    }

    .sheet-tab-combat-sheet .sheet-defenses .flex-col:nth-of-type(2),
    .sheet-tab-combat-sheet .sheet-defenses .flex-col:nth-of-type(3),
    .sheet-tab-combat-sheet .sheet-defenses .flex-col:nth-of-type(5),
    .sheet-tab-combat-sheet .sheet-defenses .flex-col:nth-of-type(6) {
        order: 2;
    }
}

@media only screen and (max-width: 412px) {
    .sheet-tab-character-sheet .sheet-defenses .flex-col.def-exc {
        order: 1;
    }

    .sheet-tab-character-sheet .sheet-defenses .flex-col:nth-of-type(2),
    .sheet-tab-character-sheet .sheet-defenses .flex-col:nth-of-type(3),
    .sheet-tab-character-sheet .sheet-defenses .flex-col:nth-of-type(5),
    .sheet-tab-character-sheet .sheet-defenses .flex-col:nth-of-type(6) {
        order: 2;
    }
}

.charsheet .sheet-tab-combat-sheet .combat-header .defense-line .sheet-table {
    width: 100%;
}

.charsheet .sheet-defenses.flex-wrap {
    justify-content: space-between;
}

.sheet-tab-intimacies-sheet .head-line .sheet-table-cell input[type="number"][disabled],
.sheet-tab-antisocial-sheet .head-line .sheet-table-cell input[type="number"][disabled],
.sheet-table-body .sheet-table-row .sheet-table-cell input[type="number"][disabled],
.sheet-defenses .flex-col .flex:last-child input[type="number"][disabled].wound-taint,
.sheet-defenses .flex-col .flex:last-child input[type="text"].qc-have-exc {
    width: 27px;
    flex-grow: 1;
    margin-right:2px;
}

.charsheet .caste-have-exc-check[value="0"] ~ .flex.main-page .sheet-tab-content .sheet-defenses .flex-col .qc-have-exc {
    display: none;
}

.sheet-defenses .flex-col .flex:last-child input[type="hidden"].qc-panel-check[value="1"] + input[type="number"][disabled].wound-taint,
.sheet-defenses .flex-col .flex:first-child input[type="number"] {
    width: 56px;
    flex-grow: 1;
}

.charsheet .caste-have-exc-check[value="1"] ~ .flex.main-page .sheet-defenses .flex-col .flex:last-child input[type="hidden"].qc-panel-check[value="1"] + input[type="number"][disabled].wound-taint {
    width: 27px;
}

.sheet-defenses .flex-col .flex:last-child input[type="text"].qc-have-exc {
    margin-left: 2px;
}

.sheet-table-body .sheet-table-row .sheet-table-cell input[type="number"][disabled].wound-taint:last-child,
.sheet-defenses .flex-col .flex:last-child input[type="number"][disabled].last-visible,
.sheet-defenses .flex-col .flex:last-child input[type="hidden"].qc-panel-check[value="1"] + input[type="number"][disabled],
.sheet-defenses .flex-col .flex:last-child input[type="hidden"].qc-panel-check[value="1"] ~ input[type="text"].qc-have-exc {
    margin-right:0;
}

/* --- HEALTH LINE --- */
.charsheet .sheet-health-track {
    text-align: center;
    font-size: 0;
    justify-content: center;
}

.charsheet .flex > .sheet-health-track {
    flex-shrink: 1;
}

.charsheet .sheet-health-track .sheet-health-level {
    display: inline-block;
    width: 23.6px;
}

.charsheet [data-groupname=repeating_health] {
    display: inline-flex;
    flex-wrap: wrap;
}

.charsheet [data-groupname=repeating_health] .repitem {
    display: inline-block;
    font-size: 13px;
    padding-right: 0.1em;
}

.charsheet [data-groupname=repeating_health] .repitem .itemcontrol .repcontrol_move {
    display: none;
}

.charsheet .heal-hl-div {
    display: inline-block;
    vertical-align: text-bottom;
}

.charsheet .add-multiple-div {
    width: calc(7rem + 24px);
    position: relative;
}

.charsheet .add-multiple-div input[type=checkbox].sheet-unnamed-toggle:checked + span + div {
    position: absolute;
    top: unset;
    left: unset;
    right: 12px;
}

.charsheet .add-multiple-div input[type=checkbox].sheet-unnamed-toggle:checked + span::before {
    border-bottom: 2px solid transparent;
}

.charsheet .add-multiple-div .add-multiple-qty {
    height: 28px;
}

.charsheet [data-groupname=repeating_health].repcontrol,
.charsheet .add-multiple-div {
    display: inline-block;
    vertical-align: text-bottom;
}

.charsheet .repitem .itemcontrol,
.charsheet .repitem .itemcontrol .pictos {
    font-family: Pictos;
}

.charsheet [data-groupname=repeating_health] .repitem .itemcontrol button {
    padding: 0 0;
    width: calc(100% - 4px);
    margin-top: calc(50% - 2.5em);
}

@media screen and (-webkit-min-device-pixel-ratio:0)
and (min-resolution:.001dpcm) {
    .charsheet .sheet-health-level select {
        text-indent: 4px;
    }
}

@-moz-document url-prefix() {
    .charsheet .sheet-health-level select {
        text-indent: 0px;
    }
}

.charsheet .sheet-health-level select {
    width: 23px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    text-overflow: '';
    cursor: pointer;
    font-weight: bolder;
    font-family: Cimiez, Arial, sans-serif;
    color: #d00;
    height: 23px;
    padding: 0;
    font-size: 13px;
}

.charsheet .sheet-health-level select::-ms-expand { display: none; }

.charsheet .add-multiple-div input[type=checkbox].sheet-unnamed-toggle + span::before {
    width: 7rem;
}

.charsheet input[type=checkbox].sheet-unnamed-toggle.add-multiple + span::before {
    background: linear-gradient(rgb(128, 128, 128), rgb(128, 128, 128)) padding-box, linear-gradient(42deg, #ffda12, #C0C0C0,#fdda12) border-box;
    border: 2px solid transparent;
    padding: 2px 10px;
    font-family: Cimiez, Arial, sans-serif;
    font-variant: normal;
    font-size: 13px;
    line-height: 18px;
    color: #333333;
    text-align: center;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
    border-radius: 4px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
    cursor: pointer;
}

.charsheet input[type=checkbox].sheet-unnamed-toggle.add-multiple {
    width: 100%;
    height: calc(100% + 1px);
}

.charsheet .roll-type-toggler input[type=checkbox]:focus + span::before,
.charsheet input[type=checkbox].sheet-unnamed-toggle:focus + span::before {
    outline: thin dotted #333;
    outline: 5px auto -webkit-focus-ring-color;
    outline-offset: -2px;
}
.charsheet input[type=checkbox].sheet-unnamed-toggle.add-multiple:focus + span::before {
    background: linear-gradient(rgb(163, 163, 163), rgb(128, 128, 128)) padding-box, linear-gradient(42deg, #ffda12, #C0C0C0,#fdda12) border-box;
}

.charsheet input[type=checkbox].sheet-unnamed-toggle.add-multiple:checked + span + div {
    width: 150px;
}

.charsheet .add-multiple-div > div > * {
    vertical-align: top;
}







/**
 * COMMON STYLE FOR MOST TABS
 */
.charsheet div.sheet-tab-content {
    display: none;
    margin-top: 2px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: visible;
    scrollbar-width: thin;
    scrollbar-color: #90A4AE #CFD8DC;
}
.charsheet div.sheet-tab-content .charm-sheet-all {
    display: flex;
    flex-direction: column;
}

.charsheet .rolls-area .sheet-rolls-div::-webkit-scrollbar,
.charsheet div.sheet-tab-content::-webkit-scrollbar {
    width: 9px;
    cursor: pointer;
}

.charsheet .rolls-area .sheet-rolls-div::-webkit-scrollbar-thumb,
.charsheet div.sheet-tab-content::-webkit-scrollbar-thumb {
    background-color: #90A4AE;
    border-radius: 2px;
    border: 1px solid #CFD8DC;
}

.charsheet .rolls-area .sheet-rolls-div::-webkit-scrollbar-thumb:hover,
.charsheet div.sheet-tab-content::-webkit-scrollbar-thumb:hover {
    background-color: #7a8991;
}

.charsheet .rolls-area .sheet-rolls-div::-webkit-scrollbar-track,
.charsheet div.sheet-tab-content::-webkit-scrollbar-track {
    background: #CFD8DC;
}

.charsheet > .sheet-content > div > div.flex.main-page {
    overflow: visible;
    height: calc(100% - 2.4em);
}

@media only screen and (max-width: 563px) {
    .charsheet > .sheet-content > div > div.flex.main-page {
        height: calc(100% - 4.6em);
    }
}

.charsheet > .sheet-content > div > div.flex.main-page > div.sheet-tab-content {
    padding: 0px 9px 0 0;
    width: calc(100% - 9px);
}

.charsheet input.sheet-tab {
   height: 30px;
   -webkit-appearance:none;
   -moz-appearance:none;
   appearance:none;
   border:none;
   border-radius: 0 0 10px 10px;
   outline:none;
   position: relative;
   cursor: pointer;
   z-index: 1;
}

/* --- Tab color system --- */
.charsheet input.sheet-tab::before {
   content: attr(title);
   padding: 0 4px;
   border: 1px solid;
   border-top:0;
   border-radius:0 0 10px 10px;
   display: block;
   line-height: 30px;
   font-size: 16px;
   text-align:center;
   --tab-color: #444;
   color: var(--tab-color);
   border-color: var(--tab-color);
   background: var(--sheet-bg-col);
}
.sheet-darkmode .charsheet input.sheet-tab::before {
    background: gray;
    --tab-color: var(--dark-primarytext);
}

.charsheet input.sheet-tab-charms::before,
.charsheet input.sheet-tab-charms {
    min-width: 40px;
    flex-grow: 1;
}

.charsheet input.sheet-tab:active,
.charsheet input.sheet-tab:focus {
   outline:none;
}

.charsheet .sheet-content input.sheet-tab[title]:hover::before,
.charsheet .sheet-content input.sheet-tab[title]:checked::before,
.charsheet .sheet-content input.sheet-tab[title]:checked:hover::before {
   background:#840000;
   color: #FFDF00;
}

.charsheet input.sheet-tab:checked::before,
.charsheet input.sheet-tab:checked:hover::before {
   font-weight:bold;
}

.charsheet input.sheet-tab[title="Rolls"]::before {
    --tab-color: blue;
}
.sheet-darkmode .charsheet input.sheet-tab[title="Rolls"]::before {
    background: lightgray;
}
.charsheet input.sheet-tab[title="Social"]::before,
.charsheet input.sheet-tab[title="Tu perds ton Sang froid !"]::before {
    --tab-color: cyan;
}
.charsheet input.sheet-tab[title="Charms"]::before {
    --tab-color: gold;
}
.charsheet input.sheet-tab[title="Sorceries"]::before {
    --tab-color: mediumpurple;
}
.sheet-darkmode .charsheet input.sheet-tab[title="Sorceries"]::before {
    --tab-color: #612278;
}
.charsheet input.sheet-tab[title="Combat"]::before {
    --tab-color: red;
    font-weight:bold;
}

.charsheet input.sheet-tab-settings::before,
.charsheet input.sheet-tab-settings {
    width: 30px;
    font-family:Pictos;
}







/**
 * SHOW/HIDE OF MANY THINGS IN THE SHEET
 */
/* --- SHOW/HIDE TAB ON SELECTED/CHECKED --- */
${[...allCharmArray.slice(0, -1).map(i => i.replace('charms', 'charm-sheet')), 'charm-sheet-old'].map(i => /*css*/`.charsheet input.sheet-tab-${i}:checked${' '.repeat(30-i.length)} ~ div.sheet-body.sheet-tab-content .sheet-tab-${i}`).join(',\n')} {
   display: block;
}
.charsheet input.sheet-tab-character-sheet:checked				        ~ .flex.main-page div.sheet-tab-character-sheet,
.charsheet input.sheet-tab-spell-sheet:checked					        ~ .flex.main-page div.sheet-tab-spell-sheet,
.charsheet input.sheet-tab-charm-sheet:checked					        ~ .flex.main-page div.sheet-tab-charm-sheet,
.charsheet input.sheet-tab-settings-sheet:checked				        ~ .flex.main-page div.sheet-tab-settings-sheet,
.charsheet input.sheet-tab-intimacies-sheet:checked				        ~ .flex.main-page div.sheet-tab-intimacies-sheet,
.charsheet input.sheet-tab-combat-sheet:checked				            ~ .flex.main-page div.sheet-tab-combat-sheet,
.charsheet input.sheet-tab-antisocial-sheet:checked			            ~ .flex.main-page div.sheet-tab-antisocial-sheet,
.charsheet .charm-tab-list .sheet-body.sheet-tab-content {
   display: flex;
   flex-direction: column;
}

/* --- HIDE TAB IF NOT CHECKED IN OPTIONS TAB --- */
.charsheet .flex.main-page div.sheet-tab-charm-sheet h1,
${allCharmArray.slice(0, -1).map(i => i.replace('charms', 'charm')).map(i => /*css*/`.charsheet .sheet-${i}[value="0"]${' '.repeat(24-i.length)} ~ .flex.main-page div.sheet-tab-charm-sheet .sheet-tab-${i}`).join(',\n')},
.charsheet .sheet-charm-old[value="0"]				  ~ .flex.main-page div.sheet-tab-charm-sheet .sheet-tab-charm-old {
	display: none;
}

/* --- CHARMS TAB ITEMS SHOW/HIDE TRICKS --- */
.charsheet .sheet-tab-charms-check:not([value="Other"]) ~ .charm-sheet-all .repitem:not(.ui-sortable-placeholder) {
    display: none;
}

.charsheet .charm-sheet-all .trait-div,
.charsheet .charm-sheet-all .trait-div .artifact-trait {
    display: none;
}
.charsheet .sheet-tab-charms-check[value="Evocation"]                                   ~ .charm-sheet-all .trait-div,
.charsheet .sheet-tab-charms-check[value="Evocation"]                                   ~ .charm-sheet-all .trait-div .artifact-trait,
.charsheet .sheet-tab-charms-check[value="Other"]                                       ~ .charm-sheet-all .trait-div {
    display: flex;
}
.charsheet .sheet-tab-charms-check[value="Evocation"]                                   ~ .charm-sheet-all .trait-div .default-trait {
    display: none;
}

${allCharmArray.slice(0, -1).map(i => /*css*/`.charsheet .sheet-tab-charms-check[value="${hashCharmName[i]}"]${' '.repeat(43-hashCharmName[i].length)} ~ .charm-sheet-all .repitem:has(.sheet-tab-charms-inside-check[value="${hashCharmName[i]}"])`).join(',\n')} {
	display: block;
}

${allCharmArray.slice(0, -1).map(i => /*css*/`.charsheet .sheet-tab-charms-check[value="Other"] ~ .charm-sheet-all .repitem:has(.sheet-tab-charms-inside-check[value="${hashCharmName[i]}"])`).join(',\n')} {
	display: none;
}

/* --- REMINDERS CHARMS ITEMS CSS SHOW/HIDE TRICKS --- */
.charsheet .reminder-charm-selector-input:not([value="Other"]) ~ .repcontainer .repitem {
    display: none;
}

${allCharmArray.slice(0, -1).map(i => /*css*/`.charsheet .reminder-charm-selector-input[value="${hashCharmName[i]}"]${' '.repeat(40-hashCharmName[i].length)} ~ .repcontainer .repitem:has(.sheet-tab-charms-inside-check[value="${hashCharmName[i]}"])`).join(',\n')} {
	display: flex;
}

${allCharmArray.slice(0, -1).map(i => /*css*/`.charsheet .reminder-charm-selector-input[value="Other"] ~ .repcontainer .repitem:has(.sheet-tab-charms-inside-check[value="${hashCharmName[i]}"])`).join(',\n')} {
	display: none;
}

.charsheet .charm-sheet-all .repcontainer[data-groupname="repeating_charms-all"] .repitem:has(.sheet-tab-charms-name-check[value="FORCE_REFRESH"]),
.charsheet .reminder-charms-main-div .repcontainer[data-groupname="repeating_charms-all"] .repitem:has(.sheet-tab-charms-name-check[value="FORCE_REFRESH"]) {
	display: none;
}

.ui-dialog .charsheet .charm-sheet-all .repcontainer[data-groupname="repeating_charms-all"] .repitem.repitembroken {
    border: 4px solid transparent !important;
}
.ui-dialog .charsheet .reminder-charms-main-div .repcontainer[data-groupname="repeating_charms-all"] .repitem.repitembroken {
    border: unset !important;
}

/* --- REMINDER SELECT SHOW/HIDE OPTION TRICKS --- */
.charsheet .sheet-charm-reminder select option.reminder-charm {
    display: none;
}

${allCharmArrayCss.map(i => i.replace('charms', 'charm')).map(i => /*css*/`.charsheet .sheet-charm-reminder input.check-${i}[value="1"] ~ select option.opt-${i}`).join(',\n')},
.charsheet .sheet-charm-reminder input.check-charm[value="1"] ~ select option.opt-charm {
    display: revert;
}

/* --- SELECT FOR ADDING TEMPLATE CHARMS --- */
.charsheet .flex.main-page .sheet-tab-charm-sheet .sheet-tab-charms-check[value="Evocation"] ~ .charm-sheet-all .charm-special-add-div .select-add-template-charms,
.charsheet .flex.main-page .sheet-tab-charm-sheet .sheet-tab-charms-check[value="Other"] ~ .charm-sheet-all .charm-special-add-div .select-add-template-charms,
${maCharmArray.map(i => /*css*/`.charsheet .flex.main-page .sheet-tab-charm-sheet .sheet-tab-charms-check[value="${hashCharmName[i]}"] ~ .charm-sheet-all .charm-special-add-div .select-add-template-charms`).join(',\n')},
.charm-special-add-div .select-add-template-charms {
    display: none;
}
.charsheet .exalt-type-check[value="Solar"]    ~ .flex.main-page .sheet-tab-charm-sheet .charm-special-add-div .select-add-template-charms,
.charsheet .exalt-type-check[value="Abyssal"]  ~ .flex.main-page .sheet-tab-charm-sheet .charm-special-add-div .select-add-template-charms,
.charsheet .exalt-type-check[value="DB"]       ~ .flex.main-page .sheet-tab-charm-sheet .charm-special-add-div .select-add-template-charms,
.charsheet .exalt-type-check[value="Lunar"]    ~ .flex.main-page .sheet-tab-charm-sheet .charm-special-add-div .select-add-template-charms,
.charsheet .exalt-type-check[value="Sidereal"] ~ .flex.main-page .sheet-tab-charm-sheet .charm-special-add-div .select-add-template-charms {
    display: inline-flex;
    width: calc(100% - 4em);
    height: 26px;
}
.charm-special-add-div .select-add-template-charms select {
    width: auto;
    max-width: calc(103vw - 20em);
    height: 26px;
    flex-shrink: 1;
}
.charm-special-add-div .select-add-template-charms button {
    margin-top: 1px;
    height: 18px;
}
.charm-special-add-div .select-add-template-charms .template-charm-name-selected-check[value=""] ~ button {
    display: none;
}\n`

function getTemplateCharmsOptions() {
    let ret = ``, i = 0;
    for (const exalt of Object.keys(charmCompendiumPerExalt)) {
        for (const abi of Object.keys(charmCompendiumPerExalt[exalt])) {
            ret += `${i++ > 0 ? ',\n' : ''}.charsheet .exalt-type-check[value="${exalt}"] ~ .flex.main-page .sheet-tab-charms-check[value="${abi}"] ~ .charm-sheet-all .select-add-template-charms option.${exalt}-charm[title="${abi}"]`;
        }
    }
    return ret;
}

outHtml += /*css*/`
/* hiding options in select by default */
.charm-special-add-div .select-add-template-charms select option {
    display: none;
}
${getTemplateCharmsOptions()},
.charm-special-add-div .select-add-template-charms select option[value=""] {
    display: block;
}





/**
 * REMINDERS (Used in Rolls, Social and Combat Tab)
 */
.charsheet .sheet-reminders {
    display: flex;
    flex-wrap: wrap;
    flex-basis: 8em;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    gap: 2px;
}

.charsheet .sheet-reminders:last-child {
    justify-content: flex-end;
}

.charsheet .sheet-box-reminder .repcontainer {
    margin-bottom: 0;
}

.charsheet .sheet-box-reminder,
.charsheet .sheet-box-reminder input[type="checkbox"].sheet-unnamed-toggle {
    width: 8.5em;
    height: 1.5em;
}

.charsheet .sheet-box-reminder hr {
    height: 2px;
    margin-top: 0.4em;
    margin-bottom: 0.4em;
}

.charsheet .sheet-box-reminder .reminder-cell {
    display: inline-flex;
    width: 3.6em;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
}

.charsheet .sheet-attr-reminder .reminder-cell {
    flex-basis: 33%;
}

.charsheet .sheet-box-reminder .reminder-cell > span {
    display: flex;
}

.charsheet .sheet-box-reminder .reminder-cell > input[type="number"],
.charsheet .sheet-box-reminder .reminder-cell > span > input[type="text"],
.charsheet .sheet-box-reminder .reminder-cell > span > input[type="number"] {
    width: 1em;
    padding: 0;
}

.charsheet .sheet-box-reminder .repcontrol {
    display: none;
}

.charsheet .sheet-box-reminder .repcontainer .repitem .reminder-cell > input[type="text"][readonly] {
    width: 6.71em;
}

.charsheet .sheet-box-reminder .repcontainer .repitem .reminder-cell > input[type="text"][readonly],
.charsheet .sheet-charm-reminder .reminder-charms-main-div .repcontainer .repitem > input[type="text"][readonly] {
    border-bottom: none;
    margin: 0;
}

.charsheet .sheet-charm-reminder .reminder-charms-main-div .repcontainer .repitem > .charm-buttons > button.sheet-roll {
    height: 2rem;
}

.charsheet .sheet-box-reminder .repcontainer .repitem {
    display: inline-flex;
}

.charsheet .reminder-charms-main-div button[type=action].btn {
    line-height: 22px;
}

.charsheet .sheet-charm-reminder .reminder-charms-commited-div,
.charsheet .sheet-charm-reminder .reminder-charms-main-div,
.charsheet .sheet-charm-reminder .repcontainer,
.charsheet .sheet-charm-reminder .repcontainer .repitem {
    width: 100%;
}

.charsheet .sheet-charm-reminder .reminder-charms-main-div .repcontainer .repitem input[name="attr_charm-name"][readonly] {
    width: 8em;
    color: #0095c6;
    font-weight: bold;
    flex-grow: 2;
}

.charsheet .sheet-charm-reminder .reminder-charms-main-div .repcontainer .repitem .charm-learnt-check[value="0"] ~ input[name="attr_charm-name"][readonly] {
    color: #aeaeae;
    font-weight: normal;
}

.charsheet .sheet-charm-reminder .reminder-charms-main-div .repcontainer .repitem input[name="attr_charm-cost"][readonly] {
    width: 3em;
    flex-grow: 1;
}

.charsheet .sheet-charm-reminder .reminder-charms-main-div .repcontainer .repitem .charm-buttons {
    flex-shrink: 0;
    align-items: center;
    height: 2rem;
}

.charsheet .sheet-charm-reminder .reminder-charms-main-div .repcontainer .repitem .charm-button-learn,
.charsheet .sheet-charm-reminder .reminder-charms-main-div .repcontainer .repitem .charm-learnt-check[value="0"] ~ .sheet-grouped-buttons .default-whisper,
.charsheet .sheet-charm-reminder .reminder-charms-main-div .repcontainer .repitem .charm-learnt-check[value="0"] ~ .sheet-grouped-buttons .gm-whisper {
    display: none;
}
.charsheet .sheet-charm-reminder .reminder-charms-main-div .repcontainer .repitem .charm-learnt-check[value="0"] ~ .charm-button-learn {
    display: flex;
}

.charsheet .sheet-charm-reminder .charm-buttons.charm-button-learn {
    margin-left: 2px;
}
.charsheet .sheet-charm-reminder .charm-buttons button[name="act_learn-charm"] {
    width: unset;
    background-color: green;
    cursor: pointer;
}

.charsheet .sheet-charm-reminder .reminder-charms-main-div .repcontainer .repitem input[name="attr_charm-short-desc"][readonly] {
    width: 2em;
    flex-grow: 10;
}

.charsheet .sheet-box-reminder .reminder-charms-commited-div .repcontrol {
    display: block;
    width: 100%;
}

.charsheet input.use-commit-system[value="0"] ~ div.main-page .toggle-commit-list,
.charsheet input.use-commit-system[value="1"] ~ div.main-page .free-commit,
.charsheet input.use-commit-system[value="0"] ~ div.main-page .commit-system {
    display: none;
}

.charsheet .sheet-charm-reminder .sheet-layer4:has(.toggle-commit-list input:checked) select,
.charsheet .sheet-charm-reminder .sheet-layer4:has(.toggle-commit-list input:checked) .reminder-charms-main-div,
.charsheet .sheet-charm-reminder .sheet-layer4 .reminder-charms-commited-div {
    display: none;
}
.charsheet .sheet-charm-reminder .sheet-layer4:has(.toggle-commit-list input:checked) .reminder-charms-commited-div {
    display: flex;
    flex-wrap: wrap;
}

.charsheet .sheet-charm-reminder .sheet-layer4 .toggle-commit-list {
    transform: scale(1);
    flex-grow: 1;
    width: 9em;
    height: 28px;
}

.charsheet .sheet-charm-reminder .sheet-layer4 input[type="checkbox"].sheet-unnamed-toggle {
    height: 100%;
}
.charsheet .sheet-charm-reminder .sheet-layer4 input[type="checkbox"].sheet-unnamed-toggle,
.charsheet .sheet-charm-reminder .sheet-layer4 input[type="checkbox"].sheet-unnamed-toggle + span::before {
    width: 100%;
    --padding-top-size: 5px;
}

.charsheet .reminder-charms-commited-div .repcontainer[data-groupname="repeating_commited-list"],
.charsheet .reminder-charms-commited-div .repcontainer[data-groupname="repeating_commited-list"] .repitem,
.charsheet .reminder-charms-commited-div .repcontainer[data-groupname="repeating_commited-list"] .repitem .inner-div {
    width: 100%;
    align-items: baseline;
}
.charsheet .reminder-charms-commited-div .inner-div {
    display: flex;
    border-radius: 5px;
}

.charsheet .reminder-charms-commited-div .repitem input[name="attr_commited-state"][value="1"] ~ input[name="attr_commited-pool-type"][value="0"] ~ .inner-div {
    background: #80808040;
}
.charsheet .reminder-charms-commited-div .repitem input[name="attr_commited-state"][value="1"] ~ input[name="attr_commited-pool-type"][value="mixed"] ~ .inner-div {
    background: #ffa50040;
}
.charsheet .reminder-charms-commited-div .repitem input[name="attr_commited-state"][value="1"] ~ input[name="attr_commited-pool-type"][value="1"] ~ .inner-div {
    background: #ffd70040;
}

.charsheet .reminder-charms-commited-div input[type="checkbox"] {
    position: unset;
    opacity: 1;
    margin: 0;
}

.charsheet .reminder-charms-commited-div input[name="attr_commited-name"] {
    color: #0095c6;
    font-weight: bold;
}

.charsheet .reminder-charms-commited-div input[type="text"] {
    flex-grow: 1;
    text-shadow: 0 0 5px var(--sheet-bg-col);
}

.charsheet .reminder-charms-commited-div label input[type="text"] {
    flex-basis: 3em;
    width: 1em;
}

.charsheet .reminder-charms-commited-div label {
    display: contents;
    text-shadow: 0 0 5px var(--sheet-bg-col);
}

.charsheet .sheet-box-reminder .repcontainer .repitem .reminder-cell {
    width: unset;
}

.charsheet .sheet-abi-reminder .repcontainer[data-groupname="repeating_specialty"] {
    display: inline-grid;
}

.charsheet .sheet-abi-reminder .repcontainer[data-groupname="repeating_specialty"] input[name="attr_repspecialty"] {
    flex-grow: 1;
}

.charsheet .sheet-abi-reminder .repcontainer[data-groupname="repeating_specialty"] .repitem .reminder-cell > .reminder-val[readonly] {
    width: 5.5em;
}

.charsheet .sheet-attr-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div,
.charsheet .sheet-charm-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div,
.charsheet .sheet-abi-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div,
.charsheet .sheet-abi-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div > div.main-abi {
    display: flex;
    flex-wrap: wrap;
}

.charsheet .sheet-attr-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div,
.charsheet .sheet-charm-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div {
    left: 0px;
}

.charsheet .sheet-attr-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div,
.charsheet .sheet-abi-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div,
.charsheet .sheet-abi-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div > div.main-abi {
    flex-direction: column;
    align-content: space-between;
}

.charsheet .sheet-attr-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div {
    height: 7em;
    width: 12em;
}

.charsheet .sheet-charm-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div {
    width: 500px;
    resize: horizontal;
    overflow: hidden;
    min-width: 29em;
}

.charsheet .sheet-tab-intimacies-sheet .sheet-charm-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div {
    position: absolute;
    top: 8.4em;
}
@media only screen and (max-width: 606px) {
    .charsheet .sheet-tab-intimacies-sheet .sheet-charm-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div {
        top: 11.1em;
    }
}
@media only screen and (max-width: 381px) {
    .charsheet .sheet-tab-intimacies-sheet .sheet-charm-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div {
        top: 13.7em;
    }
}
@media only screen and (max-width: 365px) {
    .charsheet .sheet-tab-intimacies-sheet .sheet-charm-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div {
        top: 16.4em;
    }
}

.charsheet .sheet-abi-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div > div.main-abi {
    max-height: 13em;
}

.charsheet .reminder-charms-main-div .repcontainer {
    width: 100%;
    margin-bottom: 0;
}

.charsheet .flex.main-page .sheet-charm-reminder > div > select {
    font-size: large;
}

.charsheet .flex.main-page .reminder-charms-main-div .repcontainer {
    display: flex;
    flex-flow: column;
}

.charsheet .flex.main-page .reminder-charms-main-div .db-aspect-quickshow {
    display: none;
    font-size: 0;
}

.charsheet .flex.main-page .reminder-charms-main-div .db-aspect-quickshow button.quick-change-aspect {
    position: absolute;
    opacity: 0;
    height: 2.5rem;
    width: 3rem;
    border: 0;
    padding: 0;
    cursor: pointer;
    z-index: 42;
}

.reminder-charms-main-div .db-aspect-quickshow button.quick-change-aspect:hover + img,
.reminder-charms-main-div .db-aspect-quickshow button.quick-change-aspect:focus + img {
    border-radius: 11px;
    outline: 2px gold solid;
}

.charsheet .flex.main-page .reminder-charms-main-div .db-aspect-quickshow img {
    height: 2.5rem;
}

.charsheet .flex.main-page .reminder-charms-main-div .db-aspect-quickshow img.balanced {
    margin-left: auto;
}

.charsheet .exalt-type-check[value="DB"]         ~ .flex.main-page .reminder-charms-main-div .db-aspect-quickshow {
    display: inline-flex;
    width: 5.5rem;
    height: 2.5rem;
}

.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-aspect"][value="water"] ~ .db-aspect-quickshow > img.aspect {
    content: url('https://s3.amazonaws.com/files.d20.io/images/290329797/Xy9MXwjo9o9brGuChOFbpQ/max.png?1655517794');
}
.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-aspect"][value="earth"] ~ .db-aspect-quickshow > img.aspect {
    content: url('https://s3.amazonaws.com/files.d20.io/images/290329796/D3dl9vUlnpW6-62YBxOlYA/max.png?1655517794');
}
.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-aspect"][value="air"] ~ .db-aspect-quickshow > img.aspect {
    content: url('https://s3.amazonaws.com/files.d20.io/images/290329795/wYZAcE0p3HGpld-My69TLw/max.png?1655517794');
}
.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-aspect"][value="wood"] ~ .db-aspect-quickshow > img.aspect {
    content: url('https://s3.amazonaws.com/files.d20.io/images/290329794/2UyfCRr3dIkh5kZNObDbqw/max.png?1655517794');
}
.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-aspect"][value="fire"] ~ .db-aspect-quickshow > img.aspect {
    content: url('https://s3.amazonaws.com/files.d20.io/images/290329793/hlr3nMlOBHTIb-v2-2kjtQ/max.png?1655517794');
}

.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-balanced"][value="0"] ~ .db-aspect-quickshow > img.balanced {
    visibility: hidden;
}

.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-can-cycle-aspects"][value="0"] ~ button {
    display: none;
}

.charsheet .reminder-charms-main-div .repitem img.charm-icon-type {
    width: 2.5rem;
    height: 2.5rem;
    content: url('https://s3.amazonaws.com/files.d20.io/images/359012802/7ef8SWFGP-TYoswJoUFUIQ/max.png?1694746149');
}

.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-type"][value="Simple"] ~ img.charm-icon-type {
    content: url('https://s3.amazonaws.com/files.d20.io/images/359011059/a4fo8e44XvIevADyteUKhg/max.png?1694745120');
}
.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-type"][value="Supplemental"] ~ img.charm-icon-type {
    content: url('https://s3.amazonaws.com/files.d20.io/images/359011060/98hIHQxYC88jYNbDbL5mZQ/max.png?1694745120');
}
.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-type"][value="Reflexive"] ~ img.charm-icon-type {
    content: url('https://s3.amazonaws.com/files.d20.io/images/359011063/D7CF4yHatd4YL_Wmw5Iqbw/max.png?1694745120');
}
.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-type"][value="Double"] ~ img.charm-icon-type {
    content: url('https://s3.amazonaws.com/files.d20.io/images/359011062/YrCkeJaY8nTRIVj9l6eYvQ/max.png?1694745120');
}
.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-type"][value="Permanent"] ~ img.charm-icon-type {
    content: url('https://s3.amazonaws.com/files.d20.io/images/359011061/H3Wgg-mSkPCYfo4W9M28Vw/max.png?1694745120');
}

.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-mute"][value="1"] ~ input[name="attr_charm-type"][value="Simple"] ~ img.charm-icon-type {
    content: url('https://s3.amazonaws.com/files.d20.io/images/359063713/xkxlqiUcYByBTBOVCHBNNQ/max.png?1694793441');
}
.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-mute"][value="1"] ~ input[name="attr_charm-type"][value="Supplemental"] ~ img.charm-icon-type {
    content: url('https://s3.amazonaws.com/files.d20.io/images/359063716/z5dwUJoYiHzpKH6ineZ-4w/max.png?1694793441');
}
.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-mute"][value="1"] ~ input[name="attr_charm-type"][value="Reflexive"] ~ img.charm-icon-type {
    content: url('https://s3.amazonaws.com/files.d20.io/images/359063714/Olizcv_E_oC4rkTyDFDQUQ/max.png?1694793441');
}
.charsheet .reminder-charms-main-div .repitem input[name="attr_charm-mute"][value="1"] ~ input[name="attr_charm-type"][value="Double"] ~ img.charm-icon-type {
    content: url('https://s3.amazonaws.com/files.d20.io/images/359063715/tP6EKHI1_qbLyoVoAdHqwQ/max.png?1694793441');
}

.charsheet input[name="attr_hide-not-learnt-charms-in-reminders"][value="1"] ~ div.flex.main-page .reminder-charms-main-div .repitem:has(input.charm-learnt-check[value="0"]) {
    display: none;
}

.charsheet .caste-have-exc-check[value="1"] ~ .flex.main-page .sheet-tab-content .sheet-qcattr-reminder input[type="checkbox"].sheet-unnamed-toggle:checked + span + div {
    width: 300px;
    left: -192px;
}







/**
 * ROLLS TAB (WIDGET + OLD)
 */
/* -- RESSOURCE LINE -- */
.charsheet .sheet-tab-rolls-sheet .personal-mote-val[value="@{essence} * 0 - @{committedessperso}"] ~ div.personal-mote-toggle,
.charsheet .sheet-tab-rolls-sheet .peripheral-mote-val[value="@{essence} * 0 - @{committedesstotal}"] ~ div.peripheral-mote-toggle,
.charsheet .sheet-tab-combat-sheet .personal-mote-val[value="@{essence} * 0 - @{committedessperso}"] ~ div.personal-mote-toggle,
.charsheet .sheet-tab-combat-sheet .peripheral-mote-val[value="@{essence} * 0 - @{committedesstotal}"] ~ div.peripheral-mote-toggle,
.charsheet .sheet-tab-rolls-sheet .personal-mote-val[value="0"] ~ div.personal-mote-toggle,
.charsheet .sheet-tab-rolls-sheet .peripheral-mote-val[value="0"] ~ div.peripheral-mote-toggle,
.charsheet .sheet-tab-combat-sheet .personal-mote-val[value="0"] ~ div.personal-mote-toggle,
.charsheet .sheet-tab-combat-sheet .peripheral-mote-val[value="0"] ~ div.peripheral-mote-toggle,
.charsheet .roll-can-spend-motes[value="0"] ~ .caste-have-exc-check[value="0"] ~ .flex.main-page .sheet-tab-content .caste-have-exc-toggle {
    display: none;
}

.ressource-line p {
    margin: 0;
}

.sheet-darkmode .ressource-line {
    color: white;
}

.ui-dialog .ressource-line p label {
    color: black;
}

.sheet-darkmode .ressource-line p label {
    color: white;
}

.ressource-line p label {
    flex-basis: 16px;
}
.ui-dialog .ressource-line p label {
    flex-basis: 1em;
}

.ressource-line p label,
.sheet-tab-combat-sheet .cost-section p label,
.sheet-tab-rolls-sheet .cost-section p label,
.weapon-section p label,
.dmg-section p.dark-init-color label {
    display: flex;
}

.ressource-line p label,
.cost-section p label,
.weapon-section p label,
.dmg-section p.dark-init-color label {
    font-size: 13px;
    font-weight: normal;
    align-items: center;
    margin-bottom: 0;
}

.charsheet .sheet-tab-content .ressource-line input[type="number"] {
    width: 2em;
}

.charsheet .sheet-tab-rolls-sheet .ressource-line p,
.charsheet .sheet-tab-intimacies-sheet .ressource-line p {
    border: 5px solid transparent;
}

.charsheet .sheet-tab-rolls-sheet .ressource-line p.will-color,
.charsheet .sheet-tab-intimacies-sheet .ressource-line p.will-color {
    border: 1px solid;
    padding: 4px;
}

/* ROLLS TAB */
 .charsheet .sheet-tab-rolls-sheet .roll-section input[type="text"] {
    width: 4em;
}

.charsheet .sheet-tab-rolls-sheet .sheet-rolls-div .first-line .sheet-rolls-name {
    flex-grow: 1;
}

.charsheet .sheet-rolls {
    display: flex;
    flex-flow: column;
    flex-grow: 1;
}

.charsheet .sheet-rolls .roll-section.show-on-edit .inner-section.flex-wrap {
    flex-grow: 1;
    flex-flow: wrap;
    max-width: calc(100% - 1.9em);
    align-items: stretch;
}

.charsheet .sheet-tab-rolls-sheet .roll-section.hide-on-edit .inner-section {
    width: unset;
}

.charsheet .sheet-tab-rolls-sheet .roll-section .inner-section {
    display: flex;
    flex-flow: column;
}

.charsheet .sheet-rolls-div-custom .roll-section .inner-section {
    width: calc(100% - 2em);
}

.charsheet .sheet-rolls-div-widget .roll-section {
    flex-direction: row-reverse;
}

.charsheet .sheet-rolls-div-widget .roll-section .inner-section {
    width: calc(100% - 2.6rem - 1px);
}

.charsheet .left-column-rolls .sheet-rolls .first-line .stealth-btn {
    padding-left: 0;
    margin-left: 0;
  }

.charsheet .roll-section.hide-on-edit {
    justify-content: space-between;
}

.charsheet input.sheet-tab-rolls-sheet:checked ~ .flex.main-page div.sheet-tab-rolls-sheet {
    display: flex;
}

.charsheet .sheet-tab-rolls-sheet {
    height: calc(100% - 5em);
    flex-flow: column;
}

.charsheet .rolls-area {
    display: flex;
    padding-top: 1em;
    height: calc(100% - 6.5em);
    overflow: hidden;
}

.sheet-rolls-div-widget .rolls-area {
    height: calc(100% - 7.3em);
}

.charsheet .rolls-area .sheet-rolls-div {
    overflow: auto;
    padding-right: 2px;
}

.charsheet .rolls-area .rollpad textarea {
    height: calc(100% - 2px);
    width: 100%;
    padding: 0;
    margin: 0;
}

.charsheet .rolls-area input.sheet-rollseffect + span::before {
    height: 1em;
}

.charsheet .rolls-area .rollpad,
.charsheet .rolls-area .commandlist {
    display: inline-block;
}

.charsheet .rolls-area .rollpad {
    width: 100%;
}

.charsheet .rolls-area .commandlist {
    width: 5.95rem;
    margin-left: 0.5em;
    flex-shrink: 0;
}

.charsheet .left-column-rolls {
    display: flex;
    flex-flow: column;
    width: 69%;
}

.charsheet .sheet-rolls-div-custom .sheet-rolls-macro-options {
    border-top: 1px solid rgb(255, 204, 0);
    border-left: 1px solid rgb(255, 204, 0);
    background-color: rgba(255,204,0,0.25);
    border-top-left-radius: 10px;
    margin-left: 2px;
}

.charsheet .sheet-rolls-div-widget .sheet-rolls-macro-options {
    border-top: 1px solid rgb(140, 0, 255);
    border-left: 1px solid rgb(140, 0, 255);
    background-color: rgba(140, 0, 255,0.25);
}

.charsheet .right-column-notepads {
    display: flex;
    flex-grow: 1;
    margin-left: 1em;
}

div[data-groupname="repeating_roll-commands"] div.repitem input {
    width: 100%;
}

div[data-groupname="repeating_roll-commands"] div.repitem .itemcontrol .repcontrol_del,
div[data-groupname="repeating_roll-commands"] div.repitem .itemcontrol .repcontrol_move {
    padding: 2px 1px;
}

div[data-groupname="repeating_roll-commands"] button.repcontrol_add {
    width: calc(5.95rem - 24px);
}

.sheet-rolltemplate-exalted3e_cast.sheet-rolltemplate-darkmode,
.sheet-rolltemplate-exalted3e_combatcast.sheet-rolltemplate-darkmode {
    color: black;
}

/**
 * Roll Widget Area
 */

/* --- INVERT COLOR Class --- */
.inverted-color,
.inverted-color input:not(.not-inverted),
.inverted-color textarea:not(.not-inverted),
.inverted-color select:not(.not-inverted),
.inverted-color .uneditable-input:not(.not-inverted) {
    color: white;
}
.inverted-color select:not(.not-inverted) option {
    color: black;
}

.sheet-darkmode .inverted-color input:not(.not-inverted),
.sheet-darkmode .inverted-color textarea:not(.not-inverted),
.sheet-darkmode .inverted-color select:not(.not-inverted),
.sheet-darkmode .inverted-color .uneditable-input:not(.not-inverted) {
    color: unset;
}
.sheet-darkmode .inverted-color select:not(.not-inverted) option {
    color: white;
}

.sheet-darkmode .inverted-color {
    color: black;
}

.sheet-darkmode .charsheet .inverted-color span.rollpenalty,
.sheet-darkmode .charsheet .inverted-color input[type=text],
.sheet-darkmode .charsheet .inverted-color input[type=number],
.sheet-darkmode .charsheet .inverted-color select {
    border-bottom: 1px solid;
}

/* rollpen + inverted rollpen */
.charsheet .sheet-tab-rolls-sheet .rollpen-box p,
.charsheet .sheet-tab-rolls-sheet .rollpenalty-input[title],
.charsheet .sheet-tab-intimacies-sheet .rollpen-box p,
.charsheet .sheet-tab-intimacies-sheet .rollpenalty-input[title] {
    background-color: rgb(255, 128, 128);
}

.sheet-darkmode .charsheet .sheet-tab-rolls-sheet .rollpen-box p,
.sheet-darkmode .charsheet .sheet-tab-rolls-sheet .rollpenalty-input[title],
.sheet-darkmode .charsheet .sheet-tab-intimacies-sheet .rollpen-box p,
.sheet-darkmode .charsheet .sheet-tab-intimacies-sheet .rollpenalty-input[title] {
    background-color: darkred;
}

.charsheet .rollpenalty-input[title] {
    background-color: yellow;
}

.sheet-darkmode .charsheet .rollpenalty-input[title] {
    background-color: darkgoldenrod;
}

.charsheet span.rollpenalty {
    text-align: center;
    font-size: 16px;
    line-height: 23px;
    border-bottom: 1px solid black;
    border-radius: 3px;
    cursor: pointer;
}

.charsheet .rollpenalty,
.charsheet .woundpenalty,
.charsheet .woundpenalty-input {
    background-color: rgb(255, 128, 128);
    font-weight: bold;
}
.sheet-darkmode .charsheet .rollpenalty,
.sheet-darkmode .charsheet .woundpenalty,
.sheet-darkmode .charsheet .woundpenalty-input {
    background-color: darkred;
}

.charsheet .wound-penalty-check[value="0"] ~ .flex.main-page .woundpenalty,
.charsheet .roll-penalty-check[value="0"] ~ .flex.main-page .rollpenalty,
.charsheet .wound-penalty-check[value="0"] ~ .flex.main-page input[type=number][disabled].woundpenalty-input {
    background-color: rgba(128, 128, 128, 0.25);
    font-weight: normal;
}

.charsheet .sheet-rolls-div-widget .inverted-color .rollpenalty.not-inverted,
.charsheet .sheet-rolls-div-widget .inverted-color .woundpenalty.not-inverted {
    color: white;
}

.sheet-darkmode .charsheet .sheet-rolls-div-widget .inverted-color .rollpenalty.not-inverted {
    border-color: black;
}

.sheet-darkmode .charsheet .roll-penalty-check[value="0"] ~ .flex.main-page .inverted-color .rollpenalty.not-inverted,
.sheet-darkmode .charsheet .wound-penalty-check[value="0"] ~ .flex.main-page .inverted-color .woundpenalty.not-inverted {
    color: black;
}

.charsheet .sheet-rolls-div-custom,
.charsheet .rolls-area .left-column-rolls .roll-type-check[value="1"] ~ .sheet-rolls-div-widget {
    display: none;
}

.charsheet .rolls-area .left-column-rolls .roll-type-check[value="1"] ~ .sheet-rolls-div-custom {
    display: block;
}

.charsheet .roll-type-toggler {
    position: absolute;
    top: 0.8rem;
    left: 1rem;
}

.charsheet .roll-type-toggler input[type=checkbox] {
    width: 8.5em;
}

.charsheet .roll-type-toggler input[type=checkbox] + span::before {
    content: "Toggle Rolls Type";
    width: 9em;
    height: 13px;
    line-height: 13px;
    border-radius: 10px;
}

.charsheet .sheet-rolls-div-widget .repcontainer[data-groupname="repeating_rolls-widget"] {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 0.5em;
}

.charsheet .sheet-rolls-div-widget .repcontainer[data-groupname="repeating_rolls-widget"] .repitem {
    display: flex;
    border: 1px solid;
    border-radius: 5px;
    overflow: hidden;
}

.charsheet .sheet-rolls-div-widget .sheet-rolls {
    width: 22.5em;
    resize: horizontal;
    overflow: hidden;
    min-width: 281px;
}

.charsheet .sheet-rolls-div-widget .sheet-rolls-name {
    width: 2em;
}

.charsheet .sheet-rolls-div-widget .cost-section .mote-total {
    color: rgb(var(--mote-color));
    align-items: center;
    font-size: large;
    font-weight: bolder;
}

.charsheet .sheet-rolls-div-widget .cost-section .sheet-cost-mote-total {
    border: 3px outset rgb(var(--mote-color));
    border-radius: 10px;
    color: rgb(var(--mote-color));
    background-color: rgba(128, 128, 128, 0.65);
    text-shadow: black 0 0 2px;
    font-size: 20px;
    padding-top: 6px;
}

.charsheet .sheet-rolls-div-widget .cost-section .sheet-cost-mote-total-taint[value="1"] ~ .sheet-cost-mote-total {
    color: black;
    background-color: red;
}
.sheet-darkmode .charsheet .sheet-rolls-div-widget .cost-section .sheet-cost-mote-total-taint[value="1"] ~ .sheet-cost-mote-total {
    background-color: rgb(255 129 0 / 86%);
}

.mote-color-border-solid {
    border: 1px solid rgb(var(--mote-color));
}

.charsheet input.mote-hint-one {
    background: radial-gradient(circle, #ffd70080 0.4em ,#00000054,transparent 60%);
}
.charsheet input.mote-hint-two {
    background: radial-gradient(circle, #ffd700ba 30%, transparent, #ffd700ba ,transparent 80%);
}

.charsheet input.mote-hint-one,
.charsheet input.mote-hint-two,
.sheet-darkmode .charsheet input.mote-hint-one,
.sheet-darkmode .charsheet input.mote-hint-two {
    text-shadow: black 0 0 2px;
}

.mote-color-border-dashed {
    border: 1px dashed rgb(var(--mote-color));
}

.charsheet .roll-section .flex.grow-normal > .flex.grow-normal div.inline-flex.grow-normal:first-child {
    flex-basis: 40%;
}

.charsheet .roll-section .flex.grow-normal > .flex.grow-normal div.inline-flex.grow-normal:nth-child(2) {
    flex-basis: 29%;
    border: 1px solid;
    border-radius: 10px;
}

.charsheet .roll-section .flex.grow-normal > .flex.grow-normal div.inline-flex.grow-normal:last-child {
    flex-basis: 30%;
}

.charsheet .sheet-rolls-div-widget .specialty-box {
    width: 1em;
}

.charsheet .sheet-rolls-div-widget .specialty-box > input[type="checkbox"].sheet-rolls-specialty {
    margin-top: 0;
    height: 27px;
}

.charsheet .sheet-rolls-div-widget .specialty-box input[type=checkbox] + span::before {
    color: #a00;
    content: "SPE";
    height: 24px;
    padding-right: 2px;
    border: 1px solid;
    border-radius: 5px;
    font-weight: bold;
    writing-mode: vertical-lr;
    font-size: unset;
    transform: rotate(-180deg);
    background: transparent;
}

.charsheet .sheet-rolls-div-widget .specialty-box input[type=checkbox]:hover + span::before,
.charsheet .sheet-rolls-div-widget .specialty-box input[type=checkbox]:focus + span::before {
    background-color: white;
}

.charsheet .sheet-rolls-div-widget .specialty-box input[type=checkbox]:checked + span::before {
    color: #0a0;
    content: "1";
    height: 16px;
    padding-top: 6px;
    padding-right: 0;
    border-width: 2px;
    writing-mode: initial;
    font-size: large;
    transform: none;
}

.charsheet .sheet-rolls-div-widget .sheet-rolls-stunt-dices {
    background-color: rgba(var(--stunt-color), 0.65);
}

.charsheet .sheet-rolls-div-widget .sheet-rolls-wp-toggle {
    background-color: rgba(var(--willpower-color), 0.1);
}

.charsheet .sheet-rolls-div-widget .dice-area,
.charsheet .sheet-rolls-div-widget .dice-total,
.charsheet .sheet-rolls-div-widget .success-area,
.charsheet .sheet-rolls-div-widget .success-total {
    border-radius: 8px;
}

.charsheet .sheet-rolls-div-widget .dice-area {
    background-color: rgba(var(--dice-color), 0.35);
}
.sheet-darkmode .charsheet .sheet-rolls-div-widget .dice-area {
    background-color: rgba(var(--dark-dice-color), 0.80);
}

/* .charsheet .sheet-rolls-div-widget .success-area {
    background-color: rgba(var(--success-color), 0.00);
} */

.charsheet .sheet-rolls-div-widget select.sheet-rolls-pool-starting {
    width: 5.8em;
}

.charsheet .sheet-rolls-div-widget select.sheet-rolls-stunt-dices:has(option[value="2"]:checked),
.charsheet .sheet-rolls-div-widget select.sheet-rolls-wp-toggle:has(option[value="1"]:checked),
.charsheet .sheet-rolls-div-widget select.sheet-rolls-pool-starting:has(option[value="1"]:checked) {
    outline: 3px solid;
}

.charsheet .sheet-rolls-div-widget select.sheet-rolls-pool-starting:has(option[value="1"]:checked) {
    outline-color: rgb(var(--mote-color));
    outline-offset: -3px;
}

.dice-area-details,
.success-area-details {
    border: 1px solid;
    border-radius: 10px;
}

.success-area-details *:last-child {
    border-bottom-right-radius: 6px;
}

.charsheet .dice-area .flex.dice-area-total,
.charsheet .success-area .flex.success-area-total {
    flex-basis: 3.0em;
    align-items: center;
    padding-left: 0.2em;
}

/* used to scope the checkbox that has position:absolute */
.charsheet .dice-area .flex.dice-area-total {
    transform: scale(1);
}

.charsheet .flex.dice-area .flex.flex-wrap.dice-area-details {
    flex-shrink: 1;
}

.charsheet .sheet-tab-rolls-sheet input[type="number"] {
    width: 2em;
}

.charsheet .sheet-rolls-div-widget .sheet-rolls-ycharm-dices input[type="number"],
.charsheet .sheet-rolls-div-widget .sheet-rolls-ncharm-dices input[type="number"] {
    width: 1em;
}

/* --- HOVER HINTS --- */
.charsheet .sheet-tab-rolls-sheet:has(span[name="attr_roll-penalty"]:hover) .ressource-line .rollpen-box p {
    border: 2px solid;
    padding: 3px;
}

.charsheet .sheet-tab-rolls-sheet:has(.sheet-rolls-div-widget .willpower-toggle-check[value="1"]) .ressource-line input[name="attr_willpower"],
.charsheet .sheet-tab-rolls-sheet:has(.sheet-rolls-wp-toggle:hover) .ressource-line input[name="attr_willpower"] {
    outline: 5px solid;
}

.charsheet .sheet-tab-rolls-sheet:has(.pool-starting-check[value="0"] ~ .sheet-rolls .mote-hint:hover) .ressource-line input[name="attr_personal-essence"],
.charsheet .sheet-tab-rolls-sheet:has(.pool-starting-check[value="1"] ~ .sheet-rolls .mote-hint:hover) .ressource-line input[name="attr_peripheral-essence"],
.roll-section:has(.exc-sum:hover) .inner-section .excellency-box,
.roll-section:has(.solar-type-excellency .exc-total:hover) .inner-section .solar-hint,
.sheet-rolls:has(.lunar-type-excellency .exc-total:hover) .roll-section .lunar-hint,
.roll-section:has(.db-type-excellency .exc-total:hover) .inner-section .db-hint,
${dicecapArray.slice(4).map(i => /*css*/`.sheet-rolls:has(.${i.excellency}-type-excellency .exc-total:hover) .roll-section .${i.excellency}-hint`).join(',\n')},
.roll-section .sidereal-type-excellency .exc-total:hover {
    box-shadow: var(--bs-default-poffsetbig) var(--bs-default-poffsetbig) var(--bs-default-blurbig) var(--bs-charm-color),
                var(--bs-default-noffsetbig) var(--bs-default-poffsetbig) var(--bs-default-blurbig) var(--bs-charm-color),
                var(--bs-default-poffsetbig) var(--bs-default-noffsetbig) var(--bs-default-blurbig) var(--bs-charm-color),
                var(--bs-default-noffsetbig) var(--bs-default-noffsetbig) var(--bs-default-blurbig) var(--bs-charm-color);
}

.charsheet .roll-section .excellency-cap-section .stealth-btn:focus,
.charsheet .roll-section:has(.excellency-cap-section .stealth-btn:hover) .reset-hint {
    box-shadow: var(--bs-default-poffset) var(--bs-default-poffset) var(--bs-default-blur) var(--bs-charm-reset-color),
                var(--bs-default-noffset) var(--bs-default-poffset) var(--bs-default-blur) var(--bs-charm-reset-color),
                var(--bs-default-poffset) var(--bs-default-noffset) var(--bs-default-blur) var(--bs-charm-reset-color),
                var(--bs-default-noffset) var(--bs-default-noffset) var(--bs-default-blur) var(--bs-charm-reset-color);
}

/* --- SEPARATOR MODE --- */
.charsheet .sheet-rolls-div-widget .dice-area-total .separator-box-mode {
    position: absolute;
    top: -1.4em;
    right: 0.1em;
}

.charsheet .sheet-rolls-div-widget .sheet-rolls-separator {
    display: none;
    background-color: darkred;
    justify-content: center;
    width: 420em;
}

.charsheet .sheet-rolls-div-widget .sheet-rolls-separator .sheet-rolls-name {
    color: white;
    border: none;
    text-align: center;
    font-weight: bolder;
    font-size: large;
    flex-grow: 1;
}

.charsheet .sheet-rolls-div-widget .repcontainer[data-groupname="repeating_rolls-widget"] .repitem .rolls-separator-check[value="1"] ~ .sheet-rolls {
    display: none;
}

.charsheet .sheet-rolls-div-widget .repcontainer[data-groupname="repeating_rolls-widget"] .repitem .rolls-separator-check[value="1"] ~ .sheet-rolls-separator {
    display: flex;
}

.charsheet .sheet-rolls-div-widget .roll-section .dice-area .dice-area-total input[type="number"]:not(.rollpenalty,.woundpenalty),
.charsheet .sheet-rolls-div-widget .roll-section .success-area .success-area-total input[type="number"]:not(.rollpenalty,.woundpenalty) {
    width: 1.5em;
    font-weight: bold;
}

.charsheet .sheet-rolls-div-widget .roll-section .inner-section input[type="number"]:not(.rollpenalty,.woundpenalty) {
    width: 1.2em;
}

/* hide kirby on reminder opened */
.charsheet .sheet-tab-rolls-sheet .rolls-area:has(.sheet-box-reminder > input.sheet-unnamed-toggle[type="checkbox"]:checked) .sheet-rolls-div input.sheet-rolls-separator-hidden-checkbox,
.charsheet .sheet-tab-rolls-sheet .rolls-area:has(.sheet-box-reminder > input.sheet-unnamed-toggle[type="checkbox"]:checked) .sheet-rolls-div input.sheet-rolls-toggle-desc,
.charsheet .sheet-tab-combat-sheet:has(.sheet-box-reminder > input.sheet-unnamed-toggle[type="checkbox"]:checked) .combat-init input.sheet-initeffect,
.charsheet .sheet-tab-combat-sheet:has(.sheet-box-reminder > input.sheet-unnamed-toggle[type="checkbox"]:checked) .combat-init input.sheet-combat-toggle-desc,
.charsheet .sheet-tab-combat-sheet:has(.sheet-box-reminder > input.sheet-unnamed-toggle[type="checkbox"]:checked) .combat-attacks input.sheet-combat-toggle-desc {
    display: none;
}

/* --- EXCELLENCY CAP SECTION --- */
.charsheet .sheet-rolls-div-widget .excellency-cap-section {
    display: flex;
    flex-flow: column;
    border-right: 1px solid;
    text-align: center;
    text-decoration: underline;
    font-weight: bold;
}

/* Show corresponding Cap section */
.charsheet .sheet-rolls-div-widget .excellency-cap-section > div {
    display: none;
}

${dicecapArray.map(i => /*css*/`.charsheet .sheet-rolls-div-widget .excellency-cap-section input.dicecap-type-check[value="${i.dicecap}"]${' '.repeat(13-i.dicecap.length)} ~ div.${i.excellency}-type-excellency`).join(',\n')} {
    display: block;
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section input.exc-total {
    font-weight: bold;
}

/* Warn over cap */
.charsheet .sheet-rolls-div-widget .excellency-cap-section > div input[name="attr_sign"][value^="-"] ~ input.exc-sum {
    background-color: var(--bs-charm-warning-color-dark);
}

${dicecapArray.map(i => /*css*/`.charsheet .dicecap-type-check[value="${i.dicecap}"]${' '.repeat(11-i.dicecap.length)} ~ .flex.main-page .roll-section:has(.${i.excellency}-type-excellency input[name="attr_sign"][value^="-"]) .excellency-box:after`).join(',\n')} {
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
}

.excellency-box {
    position: relative;
}

.excellency-box:after {
    content: '';
    pointer-events: none;
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    box-shadow: var(--bs-default-poffsetbig) var(--bs-default-poffsetbig) var(--bs-default-blurbig) var(--bs-charm-warning-color),
                var(--bs-default-noffsetbig) var(--bs-default-poffsetbig) var(--bs-default-blurbig) var(--bs-charm-warning-color),
                var(--bs-default-poffsetbig) var(--bs-default-noffsetbig) var(--bs-default-blurbig) var(--bs-charm-warning-color),
                var(--bs-default-noffsetbig) var(--bs-default-noffsetbig) var(--bs-default-blurbig) var(--bs-charm-warning-color);
    opacity: 0;
    transition: opacity 1s ease-in-out;
}

${dicecapArray.map(i => /*css*/`.charsheet .dicecap-type-check[value="${i.dicecap}"]${' '.repeat(11-i.dicecap.length)} ~ .flex.main-page .roll-section:has(.${i.excellency}-type-excellency input[name="attr_sign"][value^="-"]) .sheet-grouped-buttons`).join(',\n')} {
    background: linear-gradient(var(--bs-charm-warning-color), var(--bs-charm-warning-color)) padding-box, linear-gradient(42deg, #ffda12, #C0C0C0,#fdda12) border-box;
    box-shadow: var(--bs-default-poffsetbig) var(--bs-default-poffsetbig) var(--bs-default-blurbig) var(--bs-charm-warning-color),
                var(--bs-default-noffsetbig) var(--bs-default-poffsetbig) var(--bs-default-blurbig) var(--bs-charm-warning-color),
                var(--bs-default-poffsetbig) var(--bs-default-noffsetbig) var(--bs-default-blurbig) var(--bs-charm-warning-color),
                var(--bs-default-noffsetbig) var(--bs-default-noffsetbig) var(--bs-default-blurbig) var(--bs-charm-warning-color);
    transition: box-shadow 0.3s;
}

${dicecapArray.map(i => /*css*/`.sheet-darkmode .charsheet .dicecap-type-check[value="${i.dicecap}"]${' '.repeat(11-i.dicecap.length)} ~ .flex.main-page .roll-section:has(.${i.excellency}-type-excellency input[name="attr_sign"][value^="-"]) .sheet-grouped-buttons`).join(',\n')} {
    background: linear-gradient(var(--bs-charm-warning-color-dark), var(--bs-charm-warning-color-dark)) padding-box, linear-gradient(42deg, #ffda12, #C0C0C0,#fdda12) border-box;
}

${dicecapArray.map(i => /*css*/`.charsheet .dicecap-type-check[value="${i.dicecap}"]${' '.repeat(11-i.dicecap.length)} ~ .flex.main-page .roll-section:has(.${i.excellency}-type-excellency input[name="attr_sign"][value^="-"]) .sheet-grouped-buttons button`).join(',\n')} {
    cursor: not-allowed;
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section > div input.exc-sum {
    background-color: transparent;
    border-radius: 14px 14px 0 0;
    border-top: 1px solid;
    border-bottom: 0;
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section > div input.exc-total {
    background-color: rgba(128, 128, 128, 0.5);
    border-radius: 0 0 14px 14px;
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section,
.charsheet .sheet-rolls-div-widget .excellency-cap-section > div input,
.charsheet .sheet-rolls-div-widget .excellency-cap-section > div select {
    width: 2.6rem;
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section > div.liminal-type-excellency input,
.charsheet .sheet-rolls-div-widget .excellency-cap-section > div.lunar-type-excellency input {
    height: 1.3em;
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section > div.liminal-type-excellency > .anima-flare-box-mode > input[type="checkbox"] {
    margin: 0;
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section > div input {
    height: 2em;
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section > div select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    text-indent: 0.01px;
    text-overflow: '';
    padding: 0px;
    height: unset;
    border-top: 1px solid;
    padding-bottom: 1px;
    border-style: dashed;
}
.excellency-cap-section hr {
    margin: 0;
    height: 1px;
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section > div input[type="checkbox"] + span::before {
    background: transparent;
    height: 1em;
    border: 1px solid;
    border-radius: 5px;
    font-weight: bold;
    font-size: unset;
    width: 100%;
}

/* Exigent Specials */
.charsheet .sheet-rolls-div-widget .excellency-cap-section > div.liminal-type-excellency input[type="checkbox"] + span::before {
    color: #a00;
    content: "Dim";
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section > div.liminal-type-excellency input[type="checkbox"]:checked + span::before {
    color: #aa0;
    content: "Flare";
    font-size: small;
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section > div.architect-type-excellency input[type="checkbox"] + span::before {
    color: #a00;
    content: "Out";
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section > div.architect-type-excellency input[type="checkbox"]:checked + span::before {
    color: #0f0;
    content: "Inside";
    font-size: small;
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section > div.dreamsouled-type-excellency input[type="checkbox"] + span::before {
    color: #a00;
    content: "No";
}

.charsheet .sheet-rolls-div-widget .excellency-cap-section > div.dreamsouled-type-excellency input[type="checkbox"]:checked + span::before {
    color: #0f0;
    content: "Yes";
}

/* Hide Excellencies & Cap */
.charsheet .roll-can-spend-motes[value="0"] ~ .caste-have-exc-check[value="0"] ~ .flex.main-page .sheet-rolls-div-widget .first-line > .flex-wrap.grow-normal,
.charsheet .caste-have-exc-check[value="0"] ~ .flex.main-page .sheet-rolls-div-widget .roll-section .flex.grow-normal > .flex.grow-normal div.inline-flex.grow-normal:nth-child(2) {
    display: none;
}

.charsheet .caste-have-exc-check[value="0"] ~ .flex.main-page .sheet-rolls-div-widget .roll-section .flex.grow-normal > .flex.grow-normal div.inline-flex.grow-normal:first-child,
.charsheet .caste-have-exc-check[value="0"] ~ .flex.main-page .sheet-rolls-div-widget .roll-section .flex.grow-normal > .flex.grow-normal div.inline-flex.grow-normal:last-child {
    flex-basis: 50%;
}

.charsheet .dicecap-type-check[value="None"]  ~ .flex.main-page .sheet-rolls-div-widget .roll-section .inner-section,
${sheetCasteTree.OTHER.slice(1, -1).map(i => /*css*/`.charsheet .caste-check[value="${i}"]${' '.repeat(12-i.length)} ~ .flex.main-page .sheet-rolls-div-widget .roll-section .inner-section`).join(',\n')} {
    width: 100%;
}

/* set Caste image to Dice Cap */
.excellency-cap-section > div button.stealth-btn {
    margin-top: 0.2em;
}
.excellency-cap-section > div button.stealth-btn,
.excellency-cap-section > div img.caste-img {
    border-radius: 10px;
}
.excellency-cap-section > div img.caste-img {
    width: 80%;
}

.excellency-cap-section > input.sheet-rolls-caste-val[value="Zenith"] ~ div img.caste-img          { content: url('https://s3.amazonaws.com/files.d20.io/images/287863297/KJXoJYat_oCa2WPUJTJx7Q/max.png?1654114629'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Dawn"] ~ div img.caste-img            { content: url('https://s3.amazonaws.com/files.d20.io/images/289224722/2PTxxCqN9PnIFP-08ji-HA/max.png?1654898555'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Twilight"] ~ div img.caste-img        { content: url('https://s3.amazonaws.com/files.d20.io/images/289224750/VSxk0-pVumQRb6qKoF326g/max.png?1654898564'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Night"] ~ div img.caste-img           { content: url('https://s3.amazonaws.com/files.d20.io/images/287863296/-NW0u39GAfwM8nKKKWXXmA/max.png?1654114629'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Eclipse"] ~ div img.caste-img         { content: url('https://s3.amazonaws.com/files.d20.io/images/289224731/niPD_rJh1vhKZqa92svF3A/max.png?1654898557'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Casteless"] ~ div img.caste-img       { content: url('https://s3.amazonaws.com/files.d20.io/images/286517312/wloZbCUcbMz64zExGUq96w/max.png?1653337673'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Changing Moon"] ~ div img.caste-img   { content: url('https://s3.amazonaws.com/files.d20.io/images/289224815/tI6Q_xSvE9VLnjB0PI30Fg/max.png?1654898590'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Full Moon"] ~ div img.caste-img       { content: url('https://s3.amazonaws.com/files.d20.io/images/289224824/ZDe2d2ovY7UeicCk6tEOvQ/max.png?1654898594'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="No Moon"] ~ div img.caste-img         { content: url('https://s3.amazonaws.com/files.d20.io/images/289025253/nUEsxTKOrZBu8AxUXw8f9Q/max.png?1654783243'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Endings"] ~ div img.caste-img         { content: url('https://s3.amazonaws.com/files.d20.io/images/297567476/qGNapVpjgvKcY0sjX_4q2A/max.png?1659403697'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Battles"] ~ div img.caste-img         { content: url('https://s3.amazonaws.com/files.d20.io/images/297567475/WjcPl0cTNIWFVwlSAJsoDw/max.png?1659403697'); border-radius: 0; }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Secrets"] ~ div img.caste-img         { content: url('https://s3.amazonaws.com/files.d20.io/images/297567474/lzH22iV-4A29MOdwYEjIXQ/max.png?1659403697'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Serenity"] ~ div img.caste-img        { content: url('https://s3.amazonaws.com/files.d20.io/images/297567477/1WaIxdJPZXUo3FisSpDqUA/max.png?1659403697'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Journeys"] ~ div img.caste-img        { content: url('https://s3.amazonaws.com/files.d20.io/images/297567473/lKtXtQG23FvN9qW00gwTAg/max.png?1659403697'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Water"] ~ div img.caste-img           { content: url('https://s3.amazonaws.com/files.d20.io/images/290329797/Xy9MXwjo9o9brGuChOFbpQ/max.png?1655517794'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Earth"] ~ div img.caste-img           { content: url('https://s3.amazonaws.com/files.d20.io/images/290329796/D3dl9vUlnpW6-62YBxOlYA/max.png?1655517794'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Air"] ~ div img.caste-img             { content: url('https://s3.amazonaws.com/files.d20.io/images/290329795/wYZAcE0p3HGpld-My69TLw/max.png?1655517794'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Wood"] ~ div img.caste-img            { content: url('https://s3.amazonaws.com/files.d20.io/images/290329794/2UyfCRr3dIkh5kZNObDbqw/max.png?1655517794'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Fire"] ~ div img.caste-img            { content: url('https://s3.amazonaws.com/files.d20.io/images/290329793/hlr3nMlOBHTIb-v2-2kjtQ/max.png?1655517794'); }

.excellency-cap-section > input.sheet-rolls-caste-val[value="Adamant"] ~ div img.caste-img         { content: url('https://s3.amazonaws.com/files.d20.io/images/290355484/ECiPyO0Uh9HBNru94e2jJQ/max.png?1655534509'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Jade"] ~ div img.caste-img            { content: url('https://s3.amazonaws.com/files.d20.io/images/290355486/76VFhvLhjVCZSQ-KLlsXkw/max.png?1655534509'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Moonsilver"] ~ div img.caste-img      { content: url('https://s3.amazonaws.com/files.d20.io/images/290355483/tXC0-EryOTOCP0GplhICCw/max.png?1655534509'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Orichalcum"] ~ div img.caste-img      { content: url('https://s3.amazonaws.com/files.d20.io/images/290355485/RTnMnr-wT7MCgK9y09A7QQ/max.png?1655534509'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Soulsteel"] ~ div img.caste-img       { content: url('https://s3.amazonaws.com/files.d20.io/images/290355487/hG7WKJbWMjZtXnuQdgs0RA/max.png?1655534509'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Starmetal"] ~ div img.caste-img       { content: url('https://s3.amazonaws.com/files.d20.io/images/290355488/nMrXIRQfzoxosVhL7-vqmw/max.png?1655534509'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Daybreak"] ~ div img.caste-img        { content: url('https://s3.amazonaws.com/files.d20.io/images/290355493/N4amjrZkvnjLmU99IjHQ5w/max.png?1655534516'); background-color: #8b000080; }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Day"] ~ div img.caste-img             { content: url('https://s3.amazonaws.com/files.d20.io/images/290355492/AJtOq2-jkbSP4LGG1kEKyA/max.png?1655534516'); background-color: #8b000080; }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Dusk"] ~ div img.caste-img            { content: url('https://s3.amazonaws.com/files.d20.io/images/290355496/fpMl8yYhjVmWtWNa7ra3pw/max.png?1655534516'); background-color: #8b000080; }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Midnight"] ~ div img.caste-img        { content: url('https://s3.amazonaws.com/files.d20.io/images/290355495/Y0LKm5XpoyjGVb9BwZRZ1A/max.png?1655534516'); background-color: #8b000080; }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Moonshadow"] ~ div img.caste-img      { content: url('https://s3.amazonaws.com/files.d20.io/images/290355494/ByEJc864bB1dQkcC5cDFRw/max.png?1655534516'); background-color: #8b000080; }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Defiler"] ~ div img.caste-img         { content: url('https://s3.amazonaws.com/files.d20.io/images/290355470/xbldGX1-5af-6wrCklSZtg/max.png?1655534499'); background-color: #00640080; }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Fiend"] ~ div img.caste-img           { content: url('https://s3.amazonaws.com/files.d20.io/images/290355471/O2fhv2kqA7EgLD4MyW717g/max.png?1655534499'); background-color: #00640080; }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Malefactor"] ~ div img.caste-img      { content: url('https://s3.amazonaws.com/files.d20.io/images/290355469/Qzg9YYfn5ie3z3bqhVjuTQ/max.png?1655534499'); background-color: #00640080; }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Scourge"] ~ div img.caste-img         { content: url('https://s3.amazonaws.com/files.d20.io/images/290355467/Te60NdSOWjf2DE9l6Y3jgg/max.png?1655534499'); background-color: #00640080; }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Slayer"] ~ div img.caste-img          { content: url('https://s3.amazonaws.com/files.d20.io/images/290355468/Yc98p0D9aXwi8trR_3MQbA/max.png?1655534499'); background-color: #00640080; }

.excellency-cap-section > input.sheet-rolls-caste-val[value="Blood"] ~ div img.caste-img           { content: url('https://s3.amazonaws.com/files.d20.io/images/290361592/-rdnufdzliozAjQTWsnSGA/max.png?1655540279'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Breath"] ~ div img.caste-img          { content: url('https://s3.amazonaws.com/files.d20.io/images/290361592/-rdnufdzliozAjQTWsnSGA/max.png?1655540279'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Flesh"] ~ div img.caste-img           { content: url('https://s3.amazonaws.com/files.d20.io/images/290361592/-rdnufdzliozAjQTWsnSGA/max.png?1655540279'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Marrow"] ~ div img.caste-img          { content: url('https://s3.amazonaws.com/files.d20.io/images/290361592/-rdnufdzliozAjQTWsnSGA/max.png?1655540279'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Soil"] ~ div img.caste-img            { content: url('https://s3.amazonaws.com/files.d20.io/images/290361592/-rdnufdzliozAjQTWsnSGA/max.png?1655540279'); }

.excellency-cap-section > input.sheet-rolls-caste-val[value="Exigent"] ~ div img.caste-img         { content: url('https://s3.amazonaws.com/files.d20.io/images/290361592/-rdnufdzliozAjQTWsnSGA/max.png?1655540279'); }
.excellency-cap-section > input.sheet-rolls-caste-val[value="Custom"] ~ div img.caste-img          { content: url('https://s3.amazonaws.com/files.d20.io/images/290361592/-rdnufdzliozAjQTWsnSGA/max.png?1655540279'); }







/**
 * COST (USED IN CHARMS, SORCERY & COMBAT TABS)
 */

.rounded-box {
    border-radius: 5px;
}

.rounded-box > label:last-child *:last-child,
.rounded-box > *:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

.init-color-down {
    background: linear-gradient(transparent, rgba(var(--init-color), 0.5));
}

.will-color {
    background: rgba(var(--willpower-color), 0.5);
}

.will-color-down {
    background: linear-gradient(var(--sheet-bg-col), rgba(var(--willpower-color), 0.5));
}
.sheet-darkmode .will-color-down {
    background: linear-gradient(var(--sheet-bg-col), rgb(var(--dark-willpower-color)));
}

.mote-color {
    background: rgba(var(--mote-color), 0.5);
}

.commited-mote-color {
    background: rgba(var(--commited-mote-color), 0.5);
}

.mote-color-down {
    background: linear-gradient(var(--sheet-bg-col), rgba(var(--mote-color), 0.5))
}
.sheet-darkmode .mote-color-down {
    background: linear-gradient(var(--sheet-bg-col), rgb(var(--dark-mote-color)));
}

.cost-section input[type="text"] {
    text-align: center;
}

/* fucked up em in companion */
.cost-section input[type="text"] {
    width: 80px;
}
.ui-dialog .cost-section input[type="text"] {
    width: 5em;
}

/* fucked up em in companion */
.cost-section input[type="text"].sheet-cost-will {
    width: 32px;
}
.ui-dialog .cost-section input[type="text"].sheet-cost-will {
    width: 2em;
}

.charsheet .sheet-tab-spell-sheet .cost-section {
    display: inline-flex;
    width: 5em;
}

.charsheet .sheet-tab-spell-sheet .cost-section p input {
    flex-shrink: 1;
    min-width: 1em;
}

.cost-section p {
    margin: 0;
}

.cost-section select {
    width: 5.5em;
    padding-bottom: 0px;
    height: 25px;
}

.cost-section select option {
    background-color: gray;
    color: white;
}

.cost-section select option[value="1"] {
    background-color: orangered;
    color: white;
}

.cost-section select option[value="0"] {
    background-color: black;
    color: white;
}

.cost-section select:has(option[value="1"]:checked) {
    background-color: rgba(255, 68, 0, 0.5);
}

.cost-section select:has(option[value="0"]:checked) {
    background-color: black;
    color: white;
}







/**
 * CHARMS & SORCERY CSS
 */
.charsheet div.sheet-tab-content.sheet-tab-charm-sheet .charm-tab-list div.sheet-tab-content {
    height: auto;
    margin-top: 0;
}

.charsheet .charm-tab-list {
    display: flex;
    flex-wrap: wrap;
}

/* --- DB SPECIFICS --- */
${maCharmArray.map(i => /*css*/`.charsheet .sheet-tab-charms-check[value="${hashCharmName[i]}"]${' '.repeat(43-hashCharmName[i].length)} ~ .charm-sheet-all .repcontainer .repitem .sheet-charm-effect .show-to-db-only`).join(',\n')} {
    display: none;
}

/* --- COMMON TO BOTH CHARM AND SORCERY --- */
.charsheet .charm-sheet-all .repcontrol {
    width: 5em;
    left: calc(100% - 5em);
    position: absolute;
    bottom: 0;
}
.charsheet .charm-sheet-all .repcontrol .repcontrol_add {
    display: none !important;
}

.charsheet .charm-sheet-all .charm-special-add-div {
    width: calc(100% - 5em);
    height: 2.1em;
    position: absolute;
    bottom: 0;
    white-space: nowrap;
}
.charsheet .charm-sheet-all .charm-sheet-all-footer {
    height: 2em;
}

.charsheet .sheet-tab-charm-sheet .sheet-body.flex.flex-col .sheet-table-row {
    width: 100%;
    padding-top: 5px;
}

.charsheet div.sheet-charm-effect,.charsheet div.sheet-spell-effect {
    display: none;
    padding-top: 5px;
}

.charsheet div.sheet-charm-effect:nth-child(3),
.charsheet div.sheet-spell-effect:nth-child(3) {
    padding-top: 0;
}

.charsheet input.sheet-charmeffect:checked ~ div.sheet-charm-effect,
.charsheet input.sheet-spelleffect:checked ~ div.sheet-spell-effect {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.charsheet .sheet-charm-effect > label > div.flex > input[type="checkbox"],
.charsheet .sheet-charm-effect > div.flex > label > div.flex > input[type="checkbox"],
.charsheet .sheet-charm-effect > div.flex > div.flex > input[type="checkbox"] {
    position: unset;
    width: 2em;
}

.charsheet input.sheet-charmeffect,
.charsheet input.sheet-spelleffect {
    width: 100%;
    background-color: #f6f6f6;
    height: 20px;
    margin: 0;
}

.charsheet input.sheet-charmeffect + span::before,
.charsheet input.sheet-spelleffect + span::before {
    width: 100%;
    height: calc(100% - 3px);
    content: attr(title);
    text-align: center;
    line-height: 100%;
    font-size: 18px;
    border-radius: 0 0 8px 8px;
}

.charsheet input.sheet-charmeffect:checked + span:before,
.charsheet input.sheet-spelleffect:checked + span:before {
    content: attr(title) !important;
    border-radius: 0;
}

.sheet-tab-spell-sheet .sheet-table-row textarea,
.charm-tab-list textarea {
    margin-bottom: 0;
}

.charsheet .sheet-tab-spell-sheet .charm-buttons,
.charsheet .sheet-tab-charm-sheet .charm-buttons {
    display: flex;
}

.charsheet .charm-buttons-include-check[value="1"] ~ div.charm-buttons-show-default,
.charsheet .charm-buttons-include-check[value="0"] ~ div.charm-buttons-show-extended {
    display: none;
}

.charsheet .sheet-tab-spell-sheet .sheet-table-row .sheet-spell-effect .charm-buttons-include-check[value="1"] ~ input[type="text"],
.charsheet .sheet-tab-charm-sheet .sheet-table-row .sheet-charm-effect .charm-buttons-include-check[value="1"] ~ input[type="text"] {
    border: 1px solid darkgreen;
    border-radius: 5px 5px;
    background-color: #00FF0020;
}

.charsheet .sheet-tab-spell-sheet .sheet-table-row .sheet-spell-effect textarea,
.charsheet .sheet-tab-charm-sheet .sheet-table-row .sheet-charm-effect textarea {
    resize: vertical;
}

.charsheet .sheet-tab-spell-sheet .sheet-table-row .sheet-spell-effect textarea.desc,
.charsheet .sheet-tab-charm-sheet .sheet-table-row .sheet-charm-effect textarea.desc {
    width: 100%;
    height: 50px;
}

.charsheet .sheet-tab-spell-sheet .sheet-table-row .sheet-spell-effect textarea.effect,
.charsheet .sheet-tab-charm-sheet .sheet-table-row .sheet-charm-effect textarea.effect {
    width: 100%;
    height: 100px;
}

.charsheet .sheet-tab-spell-sheet .sheet-table-row .sheet-spell-effect > input[name="attr_charm-rollexpr"],
.charsheet .sheet-tab-charm-sheet .sheet-table-row .sheet-charm-effect > input[name="attr_charm-rollexpr"] {
    width: 100%;
    border-radius: 0 0 8px 8px;
}

.roll-section .dice-area-details > div:last-child > div:last-child label,
.sheet-tab-content .flex.flex-col.sheet-body > .flex.flex-wrap label,
.sheet-charm-effect label,
.sheet-charms-spells-trait label {
    display: contents;
    font-weight: normal;
    font-size: 13px;
}

.sheet-tab-spell-sheet .repcontainer,
.sheet-tab-charm-sheet .sheet-tab-content .repcontainer,
.sheet-tab-rolls-sheet .sheet-rolls-div-custom .repcontainer,
.sheet-tab-combat-sheet .combat-init .repcontainer,
.sheet-tab-combat-sheet .combat-attacks .repcontainer {
    gap: 1em;
    display: flex;
    flex-flow: column;
    padding: 0px 4px 0px;
}

.sheet-tab-rolls-sheet .sheet-rolls-div-custom .repcontainer {
    padding: 4px 4px 0px;
}

.sheet-tab-spell-sheet .repcontainer .repitem,
.sheet-tab-charm-sheet .sheet-tab-content .repcontainer .repitem {
    border: 4px solid transparent;
    border-radius: 10px;
}

.sheet-tab-spell-sheet .repcontainer .repitem {
    --bs-section-color: var(--bs-spell-color);
}

.sheet-tab-spell-sheet .repcontainer .repitem:has(.shaping-ritual-check[value="1"]) {
    background-color: var(--bs-background-spell-color);
}

.sheet-tab-charm-sheet .sheet-tab-content .repcontainer .repitem {
    --bs-section-color: var(--bs-charm-color);
}
.sheet-darkmode .sheet-tab-charm-sheet .sheet-tab-content .repcontainer .repitem {
    --bs-section-color: var(--bs-charm-color-dark);
}

.sheet-tab-charm-sheet .sheet-tab-content .repcontainer .repitem:has(.charm-learnt-check[value="0"]),
.sheet-darkmode .sheet-tab-charm-sheet .sheet-tab-content .repcontainer .repitem:has(.charm-learnt-check[value="0"]) {
    --bs-section-color: var(--bs-charm-disabled-color);
    background-color: #575656;
}

.sheet-tab-rolls-sheet .sheet-rolls-div-custom .repcontainer .repitem {
    --bs-section-color: var(--bs-rolls-color);
    padding: 5px;
    border-radius: 5px;
}

.sheet-tab-spell-sheet .repcontainer .repitem,
.sheet-tab-charm-sheet .sheet-tab-content .repcontainer .repitem,
.sheet-tab-rolls-sheet .sheet-rolls-div-custom .repcontainer .repitem,
.charsheet .sheet-tab-combat-sheet .combat-header,
.charsheet .sheet-tab-combat-sheet .combat-init .repitem,
.charsheet .sheet-tab-combat-sheet .combat-attacks .repitem {
    box-shadow: var(--bs-default-poffset) var(--bs-default-poffset) var(--bs-default-blur) var(--bs-section-color),
                var(--bs-default-noffset) var(--bs-default-poffset) var(--bs-default-blur) var(--bs-section-color),
                var(--bs-default-poffset) var(--bs-default-noffset) var(--bs-default-blur) var(--bs-section-color),
                var(--bs-default-noffset) var(--bs-default-noffset) var(--bs-default-blur) var(--bs-section-color);
}

/* --- CHARMS SPECIFICS --- */
.charsheet .sheet-tab-charm-sheet .sheet-charm-effect select[name="attr_charm-aspect"] {
    width: 5em;
}

.charsheet .sheet-tab-charm-sheet .sheet-charm-effect input[type="checkbox"] {
    opacity: 1;
}

/* --- SORCERY SPECIFICS --- */
.charsheet .sheet-charms-spells-trait{
    font-size: 12px;
}

.charsheet input.sheet-charms-spells-trait{
    height:28px;
    font-size: 12px;
    width: 5em;
}

.charsheet input.sheet-charms-spells-trait-name{
    width: 12em;
    height: 28px;
    margin-right: 2px;
    flex-grow: 4;
    color: #0095c6;
    font-weight: bold;
}

.charsheet .charm-learnt-check[value="0"] ~ input.sheet-charms-spells-trait-name {
    color: #aeaeae;
    font-weight: normal;
}

.charsheet input.sheet-charms-spells-trait-cost{
    width: 5em;
    flex-grow: 1;
}

.charsheet input.sheet-charms-spells-trait-short-desc {
    width: 6em;
    flex-grow: 20;
}

.charsheet input.sheet-charms-spells-trait-learnt,
.charsheet input.sheet-charms-spells-trait-shaping-ritual {
    position: unset;
    width: 2em;
    opacity: 1;
    accent-color: var(--bs-section-color);
}

.charsheet .sheet-tab-spell-sheet .sheet-charms-spells-trait .shaping-ritual {
    display: none;
}
.charsheet .sheet-tab-spell-sheet .shaping-ritual-check[value="1"] ~ div.sheet-charms-spells-trait .shaping-ritual {
    display: block;
}

.charsheet .sheet-tab-spell-sheet .shaping-ritual-check[value="1"] ~ div.sheet-charms-spells-trait .not-shaping-ritual {
    display: none;
}

.charsheet .sheet-tab-spell-sheet input.shaping-ritual-check[value="1"] ~ div [name="attr_repspell-circle"],
.charsheet .sheet-tab-spell-sheet input.shaping-ritual-check[value="1"] ~ div .duration,
.charsheet .sheet-tab-spell-sheet input.shaping-ritual-check[value="1"] ~ div .cost,
.charsheet .sheet-tab-spell-sheet input.shaping-ritual-check[value="1"] ~ div .cost-section,
.charsheet .sheet-tab-spell-sheet input.shaping-ritual-check[value="1"] ~ div .control,
.charsheet .sheet-tab-spell-sheet input.shaping-ritual-check[value="1"] ~ div.sheet-charms-spells-keywords {
    display: none !important;
}







/**
 * SOCIAL + ANTI SOCIAL TAB
 */
.charsheet .intimacy-qol-button {
    position: absolute;
    top: 0.8rem;
    left: 5rem;
}
.charsheet .intimacy-qol-button button {
    font-size: 14px;
    padding: 0 4px;
}

.charsheet .sheet-3colrow .sheet-3col.inti-col {
    margin-right: 0;
    display: flex;
    flex-flow: column;
}

.charsheet .sheet-tab-intimacies-sheet .sheet-3colrow,
.charsheet .sheet-tab-antisocial-sheet .sheet-3colrow {
    display: flex;
}

.charsheet .sheet-tab-antisocial-sheet .head-line,
.charsheet .sheet-tab-intimacies-sheet .head-line {
    width: 100%;
    justify-content: space-around;
}
.charsheet .sheet-tab-intimacies-sheet .head-line {
    margin-top: 1em;
}

.charsheet .sheet-tab-antisocial-sheet textarea,
.charsheet .sheet-tab-intimacies-sheet textarea {
    width: calc(100% - 0.8em);
    min-height: 10em;
    resize: vertical;
    flex-grow: 1;
    flex-shrink: 0;
}

.charsheet .sheet-col.stat-col .sheet-table {
    justify-content: space-between;
    display: flex;
    flex-wrap: wrap;
}

.charsheet .sheet-col.stat-col .sheet-table-row {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    flex-basis: 8em;
}

.charsheet .sheet-tab-intimacies-sheet .flex-col.def-exc button.sheet-roll {
    height: 1em;
}

.charsheet .sheet-tab-intimacies-sheet .sheet-qc-social-influence-type-display,
.charsheet .sheet-tab-antisocial-sheet .sheet-qc-social-influence-type-display {
    font-size: small;
    width: 5.5em;
}

.charsheet .sheet-content .sheet-show-antisocial-tab[value="0"] ~ .sheet-tab-antisocial {
    display: none;
}

.charsheet input.sheet-tab-antisocial::before {
    content: 'AntiSocial';
}

/* --- COLOR INTIMACIES -- */
.charsheet .sheet-tab-intimacies-sheet .sheet-3col.inti-col .intimacy-taint-check[value="1"] ~ .intimacy-taint {
    outline: 3px solid red;
    outline-offset: -3px;
    border-radius: 5px;
    background-color: rgb(255 134 134 / 15%);
}
.sheet-darkmode .charsheet .sheet-tab-intimacies-sheet .sheet-3col.inti-col .intimacy-taint-check[value="1"] ~ .intimacy-taint {
    background-color: darkred;
}

.charsheet .sheet-intimacyrepeating option[value="none"] {color: darkorange}
.charsheet .sheet-intimacyrepeating option[value="Defining"]{background: rgba(0, 88, 255, 0.5)}
.charsheet .sheet-intimacyrepeating option[value="Major"]{background: rgba(0, 243, 255, 0.34)}
.charsheet .sheet-intimacyrepeating option[value="Major+"]{background: linear-gradient(rgba(0, 243, 255, 0.34),rgba(0, 88, 255, 0.5))}
.charsheet .sheet-intimacyrepeating option[value="Minor+"]{background: linear-gradient(transparent, rgba(0, 243, 255, 0.34), rgba(0, 88, 255, 0.5))}

.sheet-tab-intimacies-sheet .inti-col .intimacy-val-check[value="none"] ~ div.sheet-table-cell,
.sheet-tab-antisocial-sheet .inti-col .intimacy-taint-check[value="1"] + .intimacy-val-check[value="none"] ~ div.sheet-table-cell {
    background: linear-gradient(180deg, transparent, rgba(255, 215, 0, 0.9), rgba(255, 215, 0, 0.3), transparent, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.9))
}

.inti-col .repitem:has(.intimacy-val-check[value="Minor+"]) {
    background: linear-gradient(0deg, var(--sheet-bg-col) 0%, transparent 50%, var(--sheet-bg-col) 100%), linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.34), rgba(0, 88, 255, 0.5));
}

.inti-col .repitem:has(.intimacy-val-check[value="Major"]) {
    background: linear-gradient(0deg, var(--sheet-bg-col) 0%, transparent 50%, var(--sheet-bg-col) 100%), rgba(0, 243, 255, 0.34);
}

.inti-col .repitem:has(.intimacy-val-check[value="Major+"]) {
    background: linear-gradient(0deg, var(--sheet-bg-col) 0%, transparent 50%, var(--sheet-bg-col) 100%), linear-gradient(90deg, rgba(0, 243, 255, 0.34),rgba(0, 88, 255, 0.5));
}

.inti-col .repitem:has(.intimacy-val-check[value="Defining"]) {
    background: linear-gradient(0deg, var(--sheet-bg-col) 0%, transparent 50%, var(--sheet-bg-col) 100%), rgba(0, 88, 255, 0.5);
}

.charsheet .sheet-3col.inti-col input[name="attr_intimacyrepeatingxpspent"] {
    width: 2em;
    border-bottom: none;
}







/**
 * COMBAT TAB
 */
.charsheet .sheet-content .sheet-show-combat-tab[value="0"] ~ .sheet-tab-combat {
    display: none;
}

.charsheet .sheet-tab-combat-sheet .combat-header,
.charsheet .sheet-tab-combat-sheet .combat-init .repitem,
.charsheet .sheet-tab-combat-sheet .combat-attacks .repitem {
	border: 1px solid var(--bs-section-color);
    border-radius: 5px;
}

.sheet-tab-combat-sheet .combat-init .repcontainer input,
.sheet-tab-combat-sheet .combat-init .repcontainer select,
.sheet-tab-combat-sheet .combat-attacks .repcontainer input,
.sheet-tab-combat-sheet .combat-attacks .repcontainer select {
    color: black;
}
.sheet-darkmode .sheet-tab-combat-sheet .combat-init .repcontainer input,
.sheet-darkmode .sheet-tab-combat-sheet .combat-init .repcontainer select,
.sheet-darkmode .sheet-tab-combat-sheet .combat-attacks .repcontainer input,
.sheet-darkmode .sheet-tab-combat-sheet .combat-attacks .repcontainer select {
    color: var(--dark-primarytext);
}

/* -- HEADER -- */
.charsheet .sheet-tab-combat-sheet .combat-header {
    --bs-section-color: var(--bs-header-color);
    margin: 2px 4px 1em;
}

.charsheet .sheet-tab-combat-sheet .combat-header > div {
    border-bottom: 1px solid var(--bs-section-color);
    box-shadow: 0 var(--bs-default-poffset) var(--bs-default-blur) var(--bs-section-color),
                0 var(--bs-default-noffset) var(--bs-default-blur) var(--bs-section-color);
    padding: 1em;
}

@media only screen and (max-width: 480px) {
    .charsheet .sheet-tab-combat-sheet .combat-header > div:first-child {
        padding: 1em 5px 0;
    }
}

.charsheet .sheet-tab-combat-sheet .combat-header > div:last-child {
    border-bottom: 0;
}

.charsheet .sheet-battle-group[value="0"] ~ .flex.main-page div.sheet-tab-combat-sheet .sheet-bg-show,
.charsheet .sheet-battle-group[value="1"] ~ .flex.main-page div.sheet-tab-combat-sheet .sheet-bg-hide {
    display: none;
}

.charsheet .sheet-battle-group[value="1"] ~ .flex.main-page div.sheet-tab-combat-sheet .attack-section.decisive-section .header-section {
    display: none;
}

.sheet-health-track {
    flex-shrink: 1;
    justify-content: center;
}

.charsheet .sheet-tab-combat-sheet .combat-header .health-line > div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.charsheet .health-line > div.flex.flex-wrap.flex-col {
    width: 8em;
}

.charsheet .sheet-tab-combat-sheet .combat-header .health-line .health-block {
    vertical-align: middle;
    position: relative;
    width: calc(100% - 27px - 8em - 6px);
    display: inline-block;
}

.charsheet .sheet-tab-combat-sheet .combat-header .health-line .health-block .sheet-health-header.sheet-text-center.sheet-txt-lg {
    display: inline-block;
    top: 50%;
    position: absolute;
    transform: translateY(-50%);
}

.charsheet .sheet-tab-combat-sheet .combat-header .health-line .health-block .sheet-health-track {
    margin-left: 4.5vh;
}

.charsheet .sheet-tab-combat-sheet .combat-header .health-line .crippling-box input.sheet-crippling-pen {
    width: 7.55em;
    background-color: #f6f6f6;
    height: 20px;
    margin: 0;
}

.charsheet .sheet-tab-combat-sheet .combat-header .health-line .crippling-box input[type="checkbox"].sheet-crippling-pen:checked + span::before {
	content: attr(title) "ON";
	color: #a00;
	font-weight: normal;
    background: black;
    border: red 1px solid;
}

.charsheet .sheet-tab-combat-sheet .combat-header .health-line .crippling-box input[type="checkbox"].sheet-crippling-pen.sheet-disable-pen:checked + span::before {
    color: #0a0;
    background: lightgreen;
    border: #0a0 1px solid;
}

.charsheet .sheet-tab-combat-sheet .combat-header .health-line .crippling-box input.sheet-crippling-pen.sheet-disable-pen + span::before {
    color: black;
}

.charsheet .sheet-tab-combat-sheet .combat-header .health-line .crippling-box input.sheet-crippling-pen + span::before {
    width: 99%;
    color: #0a0;
    height: calc(100% - 3px);
    content: attr(title) "NO";
    text-align: center;
    line-height: 100%;
    font-size: 18px;
    border-radius: 4px;
}

/* -- COMBAT TAB WEAPON -- */
.charsheet .sheet-tab-combat-sheet .combat-header > div.weapon-line {
    height: 7em;
    min-height: 32px;
    overflow-y: auto;
    resize: vertical;
    scrollbar-width: thin;
    scrollbar-color: #90A4AE #CFD8DC;
}

.charsheet .sheet-tab-combat-sheet .combat-header > div.weapon-line::-webkit-scrollbar {
    width: 9px;
    cursor: pointer;
}

.charsheet .sheet-tab-combat-sheet .combat-header > div.weapon-line::-webkit-scrollbar-thumb {
    background-color: #90A4AE;
    border-radius: 2px;
    border: 1px solid #CFD8DC;
}

.charsheet .sheet-tab-combat-sheet .combat-header > div.weapon-line::-webkit-scrollbar-thumb:hover {
    background-color: #7a8991;
}

.charsheet .sheet-tab-combat-sheet .combat-header > div.weapon-line::-webkit-scrollbar-track {
    background: #CFD8DC;
}

/* -- INIT TOGGLER -- */
.charsheet input.sheet-initeffect + span::before {
    width: calc(100% - 0.15em);
    height: 20px;
    content: attr(title);
    text-align: center;
    line-height: 100%;
    font-size: 18px;
    margin-bottom: 1.5rem;
}

.charsheet input.sheet-initeffect:checked + span:before {
    content: attr(title) !important;
    margin-bottom: 0;
}

.charsheet input.sheet-initeffect {
    width:99%;
    background-color: #f6f6f6;
    height: 20px;
    margin: 0;
}

.charsheet .sheet-tab-combat-sheet .combat-init div.sheet-init-div {
    display: none;
}

.charsheet .sheet-tab-combat-sheet .combat-init input.sheet-initeffect:checked ~ div.sheet-init-div {
    display: block;
    margin-bottom: 1.5rem;
}

/* -- INIT -- */
.sheet-combat-init {
    padding: 0 0.4em;
}

.sheet-combat-init .first-line {
    width: 100%;
}

.sheet-combat-init .first-line .sheet-atk-name {
    color: gold;
    font-weight: bold;
}

.sheet-combat-init .second-line,
.sheet-combat-init .third-line {
    flex-basis: 50%;
}

.charsheet .sheet-tab-combat-sheet .combat-init .repitem {
	--bs-section-color: var(--bs-init-color);
    background: linear-gradient(15.5deg ,transparent,rgba(var(--init-color), 0.10),transparent,rgba(var(--init-color), 0.15), transparent, rgba(var(--init-color), 0.20),transparent,rgba(var(--init-color), 0.25),transparent,rgba(var(--init-color), 0.30), rgba(var(--init-color), 0.35), rgba(var(--init-color), 0.45),rgba(var(--init-color), 0.5));
}

.charsheet .sheet-tab-combat-sheet .combat-init select {
    width: 7.1em;
    text-align: center;
    height: 25px;
    border-radius: 13px;
}

.charsheet .sheet-tab-combat-sheet .combat-init .sheet-init-bonus-successes {
    width: 4em;
}

.charsheet .sheet-tab-combat-sheet .combat-init .sheet-init-bonus-dices {
    width: 6.95em;
}

.charsheet .sheet-tab-combat-sheet .combat-init > div:last-child {
    flex-grow: 42000;
}

.charsheet .sheet-tab-combat-sheet .combat-init .sheet-grouped-buttons .btn:hover {
    color: rgb(var(--init-color));
    border-color: black;
}

.charsheet .sheet-combat-init .sheet-init-macro-options {
    width: 1em;
}

/* -- ATTACKS -- */
.charsheet .sheet-tab-combat-sheet .combat-attacks .repitem {
	--bs-section-color: var(--bs-combat-color);
}

.charsheet .sheet-tab-character-sheet .sheet-rolls-div .first-line .sheet-rolls-name,
.charsheet .sheet-tab-combat-sheet .combat-attacks .first-line .sheet-atk-name {
    width: calc(100% - 5.78em);
    color: red;
    font-weight: bold;
}

@media only screen and (max-width: 352px) {
    .sheet-rolls-div-custom .sheet-rolls-name {
        width: 100px;
    }
}

.charsheet .sheet-tab-character-sheet .sheet-rolls-div p,
.charsheet .sheet-tab-combat-sheet p {
    margin-bottom: 0;
}

.charsheet .sheet-tab-combat-sheet div .sheet-grouped-buttons {
    flex-grow: unset;
    flex-shrink: 0;
}

/* --- COMBAT COLORS --- */
.dark-init-color {
    background: rgb(var(--dark-init-color));
}
.dark-init-color label {
    color: white;
}
.sheet-darkmode .dark-init-color label {
    color: var(--dark-secondarytext);
}
.charsheet .sheet-tab-combat-sheet .combat-attacks .sheet-atk-decisive-init-to-reset-val[value=""] ~ p.dark-init-color {
    background: transparent;
}
.charsheet .sheet-tab-combat-sheet .combat-attacks .sheet-atk-decisive-init-to-reset-val[value=""] ~ p.dark-init-color label {
    color: #333;
}
.sheet-darkmode .charsheet .sheet-tab-combat-sheet .combat-attacks .sheet-atk-decisive-init-to-reset-val[value=""] ~ p.dark-init-color label {
    color: unset;
}

.charsheet .sheet-tab-combat-sheet .combat-attacks .hide-on-edit .sheet-atk-decisive-init-to-reset-val[value=""] ~ p.dark-init-color label {
    text-decoration: underline;
}

.accu-color {
    background: rgba(var(--accuracy-color), 0.2);
}
.charsheet input[type="number"][readonly].accu-color {
    background-color: rgba(var(--accuracy-color), 0.2);
}

.dmg-color {
    background: rgba(var(--damage-color), 0.2);
}
.charsheet input[type="number"][readonly].dark-dmg-color {
    background-color: rgba(var(--damage-color),0.5);
}
.sheet-darkmode .charsheet input[type="number"][readonly].dark-dmg-color {
    background-color: rgb(var(--dark-damage-color));
}

.ovw-color {
    background: rgba(0, 0, 0, 0.2);
}

/* -- desc textarea -- */
.charsheet .desc-toggle {
    display: inline-block;
}

/* KIRBY & Desc area */
.charsheet .sheet-tab-rolls-sheet .first-line .desc-toggle input.sheet-rolls-toggle-desc,
.charsheet .sheet-tab-combat-sheet .first-line .desc-toggle input.sheet-combat-toggle-desc {
    width: 4.3em;
    background-color: transparent;
    height: 20px;
    margin: 0;
}

.charsheet .sheet-tab-rolls-sheet .first-line .desc-toggle input[type="checkbox"].sheet-rolls-toggle-desc:checked + span::before,
.charsheet .sheet-tab-combat-sheet .first-line .desc-toggle input[type="checkbox"].sheet-combat-toggle-desc:checked + span::before {
	/* content: "<('o'<)"; */
	content: attr(title) "('o'" attr(title) ")";
	color: gold;
}

.charsheet .sheet-tab-rolls-sheet .first-line .desc-toggle input.sheet-rolls-toggle-desc + span::before,
.charsheet .sheet-tab-combat-sheet .first-line .desc-toggle input.sheet-combat-toggle-desc + span::before {
    height: calc(100% - 3px);
    width: unset;
    min-width: 3em;
    /* content: "<('-'<)"; */
    content: attr(title) "('-'" attr(title) ")";
    color: white;
    background: black;
    border: white 1px solid;
    border-radius: 4px;
    text-align: center;
    line-height: 100%;
    font-size: 18px;
    font-weight: normal;
}

.charsheet .sheet-tab-rolls-sheet .first-line .desc-toggle input.sheet-rolls-toggle-desc:focus + span::before,
.charsheet .sheet-tab-combat-sheet .first-line .desc-toggle input.sheet-combat-toggle-desc:focus + span::before {
    background: gray;
}

.charsheet .sheet-tab-rolls-sheet .first-line .desc-toggle input.sheet-rolls-toggle-desc:focus:hover + span::before,
.charsheet .sheet-tab-combat-sheet .first-line .desc-toggle input.sheet-combat-toggle-desc:focus:hover + span::before,
.charsheet .sheet-tab-rolls-sheet .first-line .desc-toggle input[type="checkbox"].sheet-rolls-toggle-desc:hover:checked + span::before,
.charsheet .sheet-tab-combat-sheet .first-line .desc-toggle input[type="checkbox"].sheet-combat-toggle-desc:hover:checked + span::before,
.charsheet .sheet-tab-rolls-sheet .first-line .desc-toggle input[type="checkbox"].sheet-rolls-toggle-desc:focus:checked + span::before,
.charsheet .sheet-tab-combat-sheet .first-line .desc-toggle input[type="checkbox"].sheet-combat-toggle-desc:focus:checked + span::before {
    content: attr(title) "(*o*" attr(title) ")";
}

.charsheet .sheet-tab-rolls-sheet .first-line .desc-toggle input[type="checkbox"].sheet-rolls-toggle-desc:focus:hover:checked + span::before,
.charsheet .sheet-tab-combat-sheet .first-line .desc-toggle input[type="checkbox"].sheet-combat-toggle-desc:focus:hover:checked + span::before,
.charsheet .sheet-tab-rolls-sheet .first-line .desc-toggle input.sheet-rolls-toggle-desc:focus + span::before,
.charsheet .sheet-tab-combat-sheet .first-line .desc-toggle input.sheet-combat-toggle-desc:focus + span::before {
    content: attr(title) "(*-*" attr(title) ")";
}

.charsheet .sheet-tab-rolls-sheet .first-line .desc-toggle input.sheet-rolls-toggle-desc:hover + span::before,
.charsheet .sheet-tab-combat-sheet .first-line .desc-toggle input.sheet-combat-toggle-desc:hover + span::before {
    content: attr(title) "(*-*" attr(title) ")";
}

.charsheet .rolls-textarea,
.charsheet .combat-textarea {
    display: none;
    width: calc(100% - 1em);
    margin-bottom: 0.5em;
    margin-left: 1px;
    resize: vertical;
    height: 3em;
    background: transparent;
}

.charsheet .sheet-tab-rolls-sheet .sheet-rolls-div-widget .rolls-textarea {
    min-width: 3em;
    width: 7em;
    height: 95%;
    resize: horizontal;
    margin-bottom: 0;
    margin-right: 1px;
    border: 0;
    border-left: 1px solid;
    padding-bottom: 1px;
}

.charsheet .sheet-rolls-toggle-desc-val[value="1"] ~ .rolls-textarea,
.charsheet .sheet-combat-toggle-desc-val[value="1"] ~ .combat-textarea {
    display: flex;
}

.charsheet .sheet-tab-rolls-sheet .sheet-rolls-div .woundpenalty,
.charsheet .sheet-tab-combat-sheet .combat-init .woundpenalty,
.charsheet .sheet-tab-combat-sheet .combat-attacks .woundpenalty,
.charsheet .sheet-tab-rolls-sheet .sheet-rolls-div .rollpenalty,
.charsheet .sheet-tab-combat-sheet .combat-init .rollpenalty,
.charsheet .sheet-tab-combat-sheet .combat-attacks .rollpenalty {
    padding: 0;
}

.charsheet .sheet-tab-rolls-sheet .sheet-rolls-div .rollpenalty,
.charsheet .sheet-tab-combat-sheet .combat-init .rollpenalty,
.charsheet .sheet-tab-combat-sheet .combat-attacks .rollpenalty {
    width: 0.8em;
}

.charsheet .sheet-tab-rolls-sheet .sheet-rolls-div span.rollpenalty {
    padding-top: 1px;
}

.charsheet .sheet-tab-rolls-sheet .sheet-rolls-div .woundpenalty,
.charsheet .sheet-tab-combat-sheet .combat-init .woundpenalty,
.charsheet .sheet-tab-combat-sheet .combat-attacks .woundpenalty {
    border-radius: 0 13px 13px 0;
    width: 1em;
    padding-right: 2px;
}

/* EDIT mode */
.charsheet .sheet-tab-rolls-sheet .header-section .edit-toggle input.sheet-rolls-toggle-edit,
.charsheet .sheet-tab-combat-sheet .header-section .edit-toggle input.sheet-combat-toggle-edit {
	width: calc(100%);
	background-color: transparent;
	height: calc(100%);
	margin: 0;
}

.charsheet .sheet-tab-rolls-sheet .show-on-edit .header-section .edit-toggle input.sheet-rolls-toggle-edit,
.charsheet .sheet-tab-combat-sheet .show-on-edit .header-section .edit-toggle input.sheet-combat-toggle-edit {
	top: 0px;
	right: 0px;
}

.charsheet .sheet-tab-rolls-sheet .hide-on-edit .header-section .edit-toggle input.sheet-rolls-toggle-edit,
.charsheet .sheet-tab-combat-sheet .hide-on-edit .header-section .edit-toggle input.sheet-combat-toggle-edit {
	width: 5em;
	height: 1.6em;
}

.charsheet .sheet-tab-rolls-sheet .header-section .edit-toggle input[type="checkbox"].sheet-rolls-toggle-edit:checked + span::before,
.charsheet .sheet-tab-combat-sheet .header-section .edit-toggle input[type="checkbox"].sheet-combat-toggle-edit:checked + span::before {
	color: rgb(var(--goldish-color));
    font-weight: normal;
}

.charsheet .sheet-tab-rolls-sheet .header-section .edit-toggle input.sheet-rolls-toggle-edit + span::before,
.charsheet .sheet-tab-combat-sheet .header-section .edit-toggle input.sheet-combat-toggle-edit + span::before {
    height: calc(100%);
    width: 1.12em;
    content: attr(title);
    background: none;
    border: none;
    font-size: 13px;
    text-decoration: underline;
}

.charsheet .sheet-tab-rolls-sheet .hide-on-edit .header-section .edit-toggle input.sheet-rolls-toggle-edit + span::before,
.charsheet .sheet-tab-combat-sheet .hide-on-edit .header-section .edit-toggle input.sheet-combat-toggle-edit + span::before {
    width: 5em;
}

.charsheet .sheet-rolls-div .hide-on-edit .inner-section,
.charsheet .combat-attacks .attack-section.hide-on-edit .inner-section {
    flex-flow: initial;
    justify-content: space-between;
    flex-wrap: wrap;
}

.withering-section.hide-on-edit {
	background: linear-gradient(-5deg, rgba(var(--init-color), 0.45), rgba(var(--init-color), 0.45), rgba(var(--accuracy-color), 0.15), rgba(var(--accuracy-color), 0.15));
}

@media only screen and (max-width: 480px) {
    .charsheet .combat-attacks .attack-section.hide-on-edit .inner-section {
        justify-content: center;
    }

    /* button alignment for pc only */
    .ui-dialog .charsheet .combat-attacks .attack-section.hide-on-edit .inner-section {
        justify-content: space-between;
    }
}

@media only screen and (max-width: 401px) {
    /* button alignment for pc only */
    .ui-dialog .charsheet .combat-attacks .attack-section.hide-on-edit .inner-section {
        justify-content: flex-end;
    }

    .withering-section.hide-on-edit {
        background: linear-gradient(0deg, rgba(var(--init-color), 0.45), rgba(var(--init-color), 0.45), rgba(var(--init-color), 0.45), rgba(var(--accuracy-color), 0.15), rgba(var(--accuracy-color), 0.15));
    }
}

.charsheet .sheet-rolls-div .sheet-rolls-toggle-edit-val[value="1"] ~ .first-line > .hide-on-edit,
.charsheet .sheet-rolls-div .sheet-rolls-toggle-edit-val[value="1"] ~ .roll-section.show-on-edit,
.charsheet .sheet-rolls-div .sheet-rolls-toggle-edit-val[value="0"] ~ .roll-section.hide-on-edit,
.charsheet .combat-attacks .sheet-combat-toggle-edit-val[value="1"] ~ .first-line > .hide-on-edit,
.charsheet .combat-attacks .sheet-combat-toggle-edit-val[value="1"] ~ .attack-section.show-on-edit,
.charsheet .combat-attacks .sheet-combat-toggle-edit-val[value="0"] ~ .flex-wrap > .attack-section.hide-on-edit {
    display: none;
}

.charsheet .sheet-rolls-div .sheet-rolls-toggle-edit-val[value="1"] ~ .roll-section.hide-on-edit,
.charsheet .combat-attacks .sheet-combat-toggle-edit-val[value="1"] ~ .flex-wrap > .attack-section.hide-on-edit {
    display: flex;
}

/* -- with/deci sections -- */
.withering-section {
    background: linear-gradient(0deg, rgba(var(--init-color), 0.45), rgba(var(--init-color), 0.45), rgba(var(--init-color), 0.45), rgba(var(--accuracy-color), 0.15), rgba(var(--accuracy-color), 0.15));
}

.decisive-section {
    background: linear-gradient(-180deg, rgba(var(--damage-color), 0.3),rgba(0, 0, 0, 0.5), rgba(var(--damage-color), 0.3));
}

.charsheet div.sheet-tab-combat-sheet p.sheet-bg-show {
    width: 1.5em;
    display: inline-flex;
    align-items: center;
}

.charsheet div.sheet-tab-combat-sheet .sheet-bg-show > input[type="number"][disabled] {
    padding: 0;
    min-width: 0.5em;
}

.charsheet div.sheet-tab-combat-sheet div.dmg-section .sheet-bg-show > input[type="number"][disabled] {
    border-radius: 0 13px 13px 0;
    padding-right: 2px;
}

.combat-attacks .attack-section.decisive-section .dmg-section > div.flex.grow-normal:first-child {
    min-width: 30.8em;
}

@media only screen and (max-width: 580px) {
    .combat-attacks .attack-section.decisive-section .dmg-section > div.flex.grow-normal:first-child {
        min-width: 20em;
    }
}

@media only screen and (max-width: 335px) {
    .combat-attacks .attack-section.decisive-section .dmg-section > div.flex.grow-normal:first-child {
        min-width: 19em;
    }
}

.charsheet .combat-attacks .attack-section input[type="text"].sheet-wdmg-bonus-dices {
    width: 5.31em;
}

.charsheet .combat-attacks .attack-section input[type="text"].sheet-atk-decisive-init-to-reset {
    width: 3em;
}

@media only screen and (max-width: 390px) {
    .charsheet .combat-attacks .attack-section input[type="text"].sheet-atk-decisive-init-to-reset {
        width: 1em;
    }
}

/* hide damage section on companion because cannot target */
.combat-attacks .attack-section .dmg-section {
    display: none;
}
.ui-dialog .combat-attacks .attack-section .dmg-section {
    display: inline-flex;
}

@media only screen and (max-width: 402px) {
    .charsheet .sheet-tab-rolls-sheet .rolls-area .sheet-rolls-div-custom .sheet-rolls-div .inner-section > div.flex.grow-normal,
    .charsheet .combat-attacks .atk-section.flex-wrap > div.flex.grow-normal,
    .charsheet .combat-attacks .dmg-section.flex-wrap > div.flex.grow-normal {
        flex-wrap: wrap;
    }
}

/* -- COMBAT 1ST LINE -- */
.charsheet .combat-attacks .first-line {
    padding: 0 0.4em;
}

.charsheet .combat-attacks .first-line .rounded-box > input {
    border-radius: 0 0 5px 0;
}

.charsheet .combat-attacks .attack-section {
    border: 1px solid darkred;
    border-radius: 8px;
    display: flex;
    padding: 0 0.2em;
    justify-content: end;
}

.charsheet .combat-attacks .attack-section > div {
    display: inline-block;
}

.charsheet .sheet-tab-character-sheet .sheet-rolls-main .header-section,
.charsheet .sheet-tab-rolls-sheet .left-column-rolls .header-section,
.charsheet .combat-attacks .attack-section .header-section {
    text-decoration: underline;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0.2em 0 0.2em 0.2em;
    margin: 0 0.2em;
    border-radius: 4px;
    color: rgb(var(--goldish-color));
    background-color: rgba(0, 0, 0, 0.4);
}
.sheet-darkmode .charsheet .sheet-tab-character-sheet .sheet-rolls-main .header-section,
.sheet-darkmode .charsheet .sheet-tab-rolls-sheet .left-column-rolls .header-section,
.sheet-darkmode .charsheet .combat-attacks .attack-section .header-section {
    background-color: rgba(255, 255, 255, 0.2);
}

.charsheet .sheet-tab-rolls-sheet .left-column-rolls .show-on-edit .header-section,
.charsheet .combat-attacks .attack-section.show-on-edit .header-section {
    writing-mode: vertical-lr;
    transform: rotate(-180deg);
    min-height: 4.55em;
}

.charsheet .combat-attacks .attack-section .inner-section {
    width: calc(100% - 2em);
    display: flex;
    flex-flow: column;
    justify-content: center;
}

.charsheet .sheet-tab-rolls-sheet .roll-section select,
.charsheet .combat-attacks .attack-section select {
    text-align: center;
    height: 25px;
    border-radius: 13px;
}

.charsheet .sheet-rolls-div-custom .roll-section select,
.charsheet .combat-attacks .attack-section select {
    width: 7.1em;
}

.charsheet .combat-attacks .attack-section input[type="text"] {
    width: 3em;
}

.charsheet .sheet-tab-rolls-sheet .roll-section > div > div .head,
.charsheet .combat-attacks .attack-section > div > div .head {
    width: 2.4em;
    display: inline-block;
}

.charsheet .edit-toggle:has(> input:focus),
.charsheet .roll-section .stealth-btn:focus ~ .sheet-rolls-bonus-dices,
.charsheet .roll-section .stealth-btn:focus ~ .sheet-rolls-bonus-successes,
.charsheet .init-section .stealth-btn:focus ~ .sheet-init-bonus-dices,
.charsheet .init-section .stealth-btn:focus ~ .sheet-init-bonus-successes,
.charsheet .attack-section .stealth-btn:focus ~ .sheet-watk-bonus-dices,
.charsheet .attack-section .stealth-btn:focus ~ .sheet-watk-bonus-successes,
.charsheet .edit-toggle:hover,
.charsheet .roll-section .stealth-btn:hover ~ .sheet-rolls-bonus-dices,
.charsheet .roll-section .stealth-btn:hover ~ .sheet-rolls-bonus-successes,
.charsheet .init-section .stealth-btn:hover ~ .sheet-init-bonus-dices,
.charsheet .init-section .stealth-btn:hover ~ .sheet-init-bonus-successes,
.charsheet .attack-section .stealth-btn:hover ~ .sheet-watk-bonus-dices,
.charsheet .attack-section .stealth-btn:hover ~ .sheet-watk-bonus-successes {
    box-shadow: 1px 1px 2px gold, -1px 1px 2px gold, 1px -1px 2px gold, -1px -1px 2px gold;
}

.charsheet .combat-attacks .attack-section > div > div input[type="number"][readonly].sheet-weap-dmg {
    width: 5.769em;
    border-radius: 13px;
}

.charsheet .combat-attacks .attack-section > div > div input[type="number"][readonly].sheet-weap-atk {
    width: 1.2em;
    border-radius: 13px;
}

.charsheet .sheet-tab-rolls-sheet .roll-section > div > div .sheet-rolls-macro-options,
.charsheet .combat-attacks .attack-section > div > div .sheet-init-macro-options {
    min-width: 1em;
}

.charsheet .combat-attacks .attack-section.withering-section > div > div.atk-section select[name="attr_repcombat-watk-abi"] {
    width: 5.1em;
}

.charsheet .sheet-tab-combat-sheet .combat-attacks .sheet-grouped-buttons.reset-init,
.charsheet .sheet-tab-combat-sheet .combat-attacks .sheet-atk-decisive-init-to-reset-val[value=""] ~ .sheet-grouped-buttons.noreset-init {
    display: inline-flex;
}

.charsheet .sheet-tab-combat-sheet .combat-attacks .sheet-grouped-buttons.noreset-init,
.charsheet .sheet-tab-combat-sheet .combat-attacks .sheet-atk-decisive-init-to-reset-val[value=""] ~ .sheet-grouped-buttons.reset-init {
    display: none;
}

.charsheet .sheet-tab-combat-sheet .combat-attacks .withering-section .atk-section .sheet-grouped-buttons .btn {
    text-shadow: 0 1px 1px rgb(var(--dark-accuracy-color));
}

.charsheet .sheet-tab-combat-sheet .combat-attacks .withering-section .dmg-section .sheet-grouped-buttons {
    background: linear-gradient(rgb(var(--init-color)), rgb(128, 128, 128)) padding-box, linear-gradient(42deg, #ffda12, #C0C0C0,#fdda12) border-box;
}

.charsheet .sheet-tab-combat-sheet .combat-attacks .sheet-grouped-buttons.reset-init {
    background: linear-gradient(rgb(128, 128, 128), rgb(128, 0, 0)) padding-box, linear-gradient(42deg, #ffda12, #C0C0C0,#fdda12) border-box
}

.charsheet .sheet-rolls-div-custom .roll-section .inner-section > .flex-wrap > .flex.grow-normal,
.charsheet .sheet-rolls-div-custom .roll-section .inner-section > .flex-wrap > .flex-wrap.grow-normal,
.charsheet .combat-attacks .attack-section .inner-section > .flex-wrap > .flex.grow-normal,
.charsheet .combat-attacks .attack-section .inner-section > .flex-wrap > .flex-wrap.grow-normal,
.charsheet .combat-init .sheet-combat-init.flex-wrap > .flex:nth-child(2),
.charsheet .combat-init .sheet-combat-init.flex-wrap > .flex:nth-child(3) {
    flex-basis: 50%;
}







/**
 * SETTING/OPTION TAB
 */
.charsheet h2 {
    text-decoration:overline underline;
}

.charsheet .sheet-tab-settings-sheet .hidden-cb {
    position: absolute;
    right: 0;
    bottom: -1.5%;
    display: inline-block;
    width: auto;
}

/* EXALTED SPECIFIC STYLES for Option Tab charms */
.charsheet .solar-style {
    background-color: black;
    color: yellow;
}
.charsheet .lunar-style {
    background-color: black;
    color: #CEC6CE;
}
.charsheet .db-style {
    background-color: #B56808;
    color: yellow;
}

.charsheet .flex.main-page .sheet-tab-settings-sheet .sheet-force-limit {
    display: none;
}
.charsheet .exalt-type-check[value="DB"] ~ .flex.main-page .sheet-tab-settings-sheet .sheet-force-limit,
.charsheet .caste-check[value="Exigent"] ~ .flex.main-page .sheet-tab-settings-sheet .sheet-force-limit,
.charsheet .caste-check[value="Custom"]  ~ .flex.main-page .sheet-tab-settings-sheet .sheet-force-limit {
    display: block;
}

.charsheet .charm-whisper-both-check[value="1"] ~ .flex.main-page .sheet-tab-settings-sheet .sheet-cast-to-gm {
    text-decoration: line-through;
}

.charsheet .sheet-tab-settings-sheet .sheet-2colrow.sheet-checklist {
    white-space: nowrap;
    width: fit-content;
    margin: auto;
}

.charsheet .sheet-tab-settings-sheet .sheet-2colrow.sheet-checklist {
    grid-template-columns: min-content min-content;
}

.charsheet .sheet-tab-settings-sheet .sheet-3colrow.sheet-checklist {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0;
}

.charsheet .sheet-content .sheet-tab-settings-sheet .sheet-3colrow > .sheet-col {
    width: unset;
    margin-right: 0;
}

.charsheet .flex.main-page .sheet-tab-settings-sheet .select-dicecap-type,
.charsheet .flex.main-page .sheet-tab-settings-sheet .def-exc-cost {
    display: none;
}

.charsheet .caste-check[value="Exigent"]       ~ .flex.main-page .sheet-tab-settings-sheet .select-dicecap-type,
.charsheet .caste-check[value="Custom"]        ~ .flex.main-page .sheet-tab-settings-sheet .select-dicecap-type,
.charsheet .caste-check[value="Exigent"]       ~ .flex.main-page .sheet-tab-settings-sheet .def-exc-cost,
.charsheet .caste-check[value="Custom"]        ~ .flex.main-page .sheet-tab-settings-sheet .def-exc-cost {
    display: block;
}

.charsheet .sheet-2colrow.sheet-checklist.sheet-main-config {
    width: 100%;
    justify-content: space-between;
    display: flex;
    flex-wrap: wrap;
}

@media only screen and (max-width: 528px) {
    .charsheet .sheet-2colrow.sheet-checklist.sheet-main-config {
        justify-content: center;
    }
}

.charsheet .sheet-2colrow.sheet-checklist.sheet-main-config > .sheet-checklist.sheet-col {
    width: unset;
    margin-right: 0;
}

.charsheet .sheet-2colrow.sheet-checklist .sheet-checklist.sheet-special > label {
    text-align: end;
}

.charsheet .sheet-2colrow.sheet-checklist .sheet-checklist.sheet-special > label > input[type="number"],
.charsheet .sheet-2colrow.sheet-checklist .sheet-checklist.sheet-special > label > select {
    width: 9rem;
}

.charsheet .mote-pool-eq {
    column-gap: 1em;
}

.charsheet .mote-pool-eq label {
    display: flex;
    width: unset;
    flex-grow: 1;
}

.charsheet .mote-pool-eq label input {
    flex-grow: 1;
}

.charsheet .sheet-3colrow .sheet-col.stat-col {
	width: 145px;
    display: flex;
    flex-flow: column;
    flex-shrink: 0;
    margin-right: 0;
}







/**
 * Global Responsiveness
 */

/* .ui-dialog .charsheet => NOT ON COMPANION !!! */
/* --- MOBILE SHEET PAYSAGE --- */
.sheet-grouped-buttons .interactive-roll {
    display: none;
}

.ui-dialog .sheet-grouped-buttons .interactive-roll {
    display: block;
}

.ui-dialog .sheet-grouped-buttons .companion-roll {
    display: none;
}

@media only screen and (max-width: 854px) {

    .charsheet .sheet-3colrow .sheet-col.stat-col {
        width: 100%;
    }

    .charsheet .sheet-tab-intimacies-sheet .sheet-3colrow,
    .charsheet .sheet-tab-antisocial-sheet .sheet-3colrow {
        flex-flow: column;
    }

    .charsheet .rolls-area {
        flex-flow: column;
        overflow: visible;
    }

    .charsheet .left-column-rolls,
    .charsheet .right-column-notepads {
        width: unset;
        margin-left: 0;
    }

    .charsheet .right-column-notepads {
        margin-top: 1em;
        border-top: 1em solid gold;
        padding-top: 1em;
        border-radius: 10px;
    }

    /* NIGHT MODE FOR MOBILE */
    /* body {
        color: #B3B3B3;
    }

    input, textarea, select, .uneditable-input {
        color: #E6E6E6;
    }

    .charsheet input[type=text], .charsheet input[type=number], .charsheet select {
        border-bottom: 1px solid #E6E6E6;
    }

    .charsheet select:focus, .charsheet h1 span {
        background: #1f1f1f;
        color: #E6E6E6;
    }

    h1, h2, h3, h4, h5, h6 {
        color: #E6E6E6;
    }

    .ressource-line p label {
        color: white;
    }

    .charsheet input.sheet-tab::before {
        color: #E6E6E6;
        background: gray;
    }

    .charsheet div.sheet-dots-full, .charsheet div.sheet-damage-box, .charsheet div.sheet-dots {
        background-color: dimgray;
        border-radius: 10px;
    }

    .charsheet .sheet-3col.inti-col .intimacy-taint-check[value="1"] ~ .intimacy-taint {
        background-color: darkred;
    }

    .charsheet .sheet-defenses .sheet-table-body .wound-penalty-check[value="1"] ~ input[type=number][disabled].wound-taint,
    .charsheet .sheet-defenses .sheet-table-body .flex-col .wound-penalty-check[value="1"] ~ input[type=number][disabled].onslaught-taint.wound-taint,
    .charsheet .sheet-defenses .sheet-table-body .flex-col .wound-penalty-check[value="1"] ~ input[type=number][readonly].onslaught-taint.wound-taint,
    .charsheet .sheet-gear .repcontainer[data-groupname="repeating_weapon"] .repitem .wound-penalty-check[value="1"] ~ input[type=number][readonly].onslaught-taint.wound-taint {
        background-color: #d5d500;
        color: #B3B3B3;
    }

    .charsheet .sheet-defenses .sheet-table-body .wound-penalty-check[value="2"] ~ input[type=number][disabled].wound-taint,
    .charsheet .sheet-defenses .sheet-table-body .flex-col .wound-penalty-check[value="2"] ~ input[type=number][disabled].onslaught-taint.wound-taint,
    .charsheet .sheet-defenses .sheet-table-body .flex-col .wound-penalty-check[value="2"] ~ input[type=number][readonly].onslaught-taint.wound-taint,
    .charsheet .sheet-gear .repcontainer[data-groupname="repeating_weapon"] .repitem .wound-penalty-check[value="2"] ~ input[type=number][readonly].onslaught-taint.wound-taint {
        background-color: #ab6f00;
        font-weight: bold;
    }

    .charsheet .sheet-defenses .sheet-table-body .wound-penalty-check[value="3"] ~ input[type=number][disabled].wound-taint,
    .charsheet .sheet-defenses .sheet-table-body .flex-col .wound-penalty-check[value="3"] ~ input[type=number][disabled].onslaught-taint.wound-taint,
    .charsheet .sheet-defenses .sheet-table-body .flex-col .wound-penalty-check[value="3"] ~ input[type=number][readonly].onslaught-taint.wound-taint,
    .charsheet .sheet-gear .repcontainer[data-groupname="repeating_weapon"] .repitem .wound-penalty-check[value="3"] ~ input[type=number][readonly].onslaught-taint.wound-taint {
        background-color: #9f2c01;
        font-weight: bold;
    }

    .charsheet .sheet-defenses .sheet-table-body .wound-penalty-check[value="4"] ~ input[type=number][disabled].wound-taint,
    .charsheet .sheet-defenses .sheet-table-body .flex-col .wound-penalty-check[value="4"] ~ input[type=number][disabled].onslaught-taint.wound-taint,
    .charsheet .sheet-defenses .sheet-table-body .flex-col .wound-penalty-check[value="4"] ~ input[type=number][readonly].onslaught-taint.wound-taint,
    .charsheet .sheet-gear .repcontainer[data-groupname="repeating_weapon"] .repitem .wound-penalty-check[value="4"] ~ input[type=number][readonly].onslaught-taint.wound-taint {
        background-color: darkred;
        font-weight: bold;
    }

    .charsheet input[type=number][disabled].woundpenalty-input {
        background-color: darkred;
    }

    .btn, .btn.btn-default {
        background: linear-gradient(rgb(128, 128, 128), rgb(128, 128, 128)) padding-box, linear-gradient(42deg, #ffda12, #C0C0C0,#fdda12) border-box;
        border: 2px solid transparent;
        padding: 2px 10px;
        transition: color .2s;
    }

    .btn:hover {
        color: white;
    }

    // input[type=checkbox].sheet-unnamed-toggle + span::before,
    .merits-div-checkbox input + strong:before{
        background: dimgray;
        color: #e6e6e6;
    }

    input[type=checkbox].sheet-unnamed-toggle:checked + span + div {
        background: linear-gradient(#1F1F1F, #1F1F1F) padding-box, linear-gradient(-42deg, #ffda12, #C0C0C0,#fdda12) border-box;
        border: 3px solid transparent;
        border-radius: 13px;
    }

    .charsheet input[type=checkbox].sheet-unnamed-toggle + span::before {
        background: #420000;
    }

    .charsheet .sheet-max-ma-val[value="0"] ~ input[type=checkbox].sheet-unnamed-toggle + span::before,
    .charsheet .sheet-max-craft-val[value="0"] ~ input[type=checkbox].sheet-unnamed-toggle + span::before {
        background: dimgray;
    } */
}

/* --- MOBILE SHEET PORTRAIT --- */
@media only screen and (max-width: 828px) {
    .charsheet .sheet-tab-character-sheet > div.sheet-3colrow.sheet-centerblock > div.sheet-2col > div:nth-child(3) > div {
        grid-template-columns: 100%;
    }
}

@media only screen and (max-width: 630px) {

    .charsheet .sheet-tab-content div.sheet-2colrow,
    .charsheet .sheet-tab-content div.sheet-3colrow {
        grid-template-columns: 100%;
    }

    .charsheet .sheet-tab-content div.sheet-3colrow.sheet-centerblock {
        grid-template-areas: none;
        grid-template-columns: 100%;
    }

    .charsheet .sheet-tab-content .sheet-3colrow.sheet-centerblock .sheet-col.sheet-abilities,
    .charsheet .sheet-tab-content .sheet-3colrow .sheet-2col {
        grid-area: unset;
    }

    .charsheet .sheet-tab-content .sheet-3colrow.sheet-centerblock > .sheet-2col {
        display: flex;
        flex-flow: column;
    }

    .charsheet .sheet-tab-content .sheet-3colrow.sheet-centerblock > .sheet-2col > div {
        flex-shrink: 1;
    }

    .charsheet .sheet-tab-content .sheet-attributes.sheet-3colrow {
        grid-template-columns: repeat(1, 1fr);
        grid-auto-flow: unset;
    }

    .charsheet .sheet-table.sheet-defenses.sheet-txt-lg.sheet-center-table.sheet-80pct {
        display: grid;
        width: 100%;
        margin-right: auto;
        grid-template-columns: 100%;
    }
}

@media only screen and (max-width: 480px) {
    .sheet-content {
        min-width: 320px;
    }

/* halo layout */

    .sheet-editPane {
         width: 80%;
     }

    input[name="attr_Portrait"][value="PC0"]  {
        border: 1px solid #cccc00;
        text-align: center;
        background-color: rgba(255, 128, 0, 0.05);
    }

    h1.sheet-hide {
        visibility: visible !important;
        display: block;
    }

    input[name="attr_Portrait"]:not([value="PC0"]) ~ .sheet-physical,
    input[name="attr_Portrait"]:not([value="PC0"]) ~ .sheet-mental,
    input[name="attr_Portrait"]:not([value="PC0"]) ~ .sheet-social {
        position: static;
        border: 1px dashed #ffcb2b;
        border-top: 6px solid #ffcb2b;
        padding: 5px;
    }

    input[name="attr_Portrait"]:not([value="PC0"]) + .sheet-action {
        display: block;
        visibility: visible;
    }

    .charsheet button[type="action"].sheet-blank-roll-button + span,
    .charsheet button[type="roll"].sheet-blank-roll-button + span {
        display: none !important;
        visibility: hidden !important;
        /* visibility: visible !important; */
    }
}

@media only screen and (max-width: 446px) {
    .charsheet .sheet-col.stat-col .sheet-table-row {
        flex-grow: 0;
    }
}

@media only screen and (max-width: 420px) {
    .sheet-combat-init .second-line {
        flex-wrap: wrap;
    }
}







/* --- ROLLTEMPLATES --- */
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden {
    display: none;
}

.sheet-rolltemplate-exalted3e_combatcast table,
.sheet-rolltemplate-exalted3e_cast > div.sheet-flex {
    text-align:center;
    background-color: var(--bs-section-color);
    width:100%;
    font-size:12px;
    border-collapse:separate;
}

/* Solar box-shadow */
${sheetCasteTree.SOLARS.map(i => /*css*/`.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex`).join(',\n')} {          --bs-section-color: #fff9d6; }
/* Specific background for solars */
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="zenith"] ~ div.sheet-flex {           background: linear-gradient(0deg, white, var(--bs-section-color), white); }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="dawn"] ~ div.sheet-flex {             background: linear-gradient(0deg, var(--bs-section-color), #fdf294); }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="twilight"] ~ div.sheet-flex {         background: linear-gradient(0deg, #fdf294, var(--bs-section-color)); }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="night"] ~ div.sheet-flex {            background: radial-gradient(var(--bs-section-color) 40%, #7a6700 55%, var(--bs-section-color) 70%); }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="eclipse"] ~ div.sheet-flex {          background: radial-gradient(#fff1a4 25%, var(--bs-section-color) 42%, #fff1a4 55%, var(--bs-section-color) 70%); }
/* Lunar box-shadow */
${sheetCasteTree.LUNARS.map(i => /*css*/`.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex`).join(',\n')} {          --bs-section-color: #c5c5c5; }
/* Specific background for lunars */
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="casteless"] ~ div.sheet-flex {        background: radial-gradient(white 25%, var(--bs-section-color) 42%, white 55%, var(--bs-section-color) 70%); }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="changing moon"] ~ div.sheet-flex {
    background-size: 100% 500%;
    background-image: linear-gradient(150deg, var(--bs-section-color) 30%, white, white, var(--bs-section-color) 70%);
    -webkit-animation: AnimateBG 10s ease infinite;
    animation: AnimateBG 10s ease infinite;
}
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="full moon"] ~ div.sheet-flex {        background: radial-gradient(white 40%, var(--bs-section-color) 65%); }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="no moon"] ~ div.sheet-flex {          background: radial-gradient(var(--bs-section-color) 40%, white 55%, var(--bs-section-color) 70%); }

@-webkit-keyframes AnimateBG {
  0% {
    background-position: 0% 100%;
  }
  50% {
    background-position: 50% 50%;
  }
  100% {
    background-position: 100% 100%;
  }
}

@keyframes AnimateBG {
  0% {
    background-position: 0% 100%;
  }
  50% {
    background-position: 50% 50%;
  }
  100% {
    background-position: 100% 100%;
  }
}
/* DB box-shadow */
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="air"] ~ div.sheet-flex {              --bs-section-color: #c8ffff; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="earth"] ~ div.sheet-flex {            --bs-section-color: #d1af8c; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="fire"] ~ div.sheet-flex {             --bs-section-color: #ffc8c8; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="water"] ~ div.sheet-flex {            --bs-section-color: #312d68; color: white; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="wood"] ~ div.sheet-flex {             --bs-section-color: #a8ffa8; }
/* Sidereal star pattern */
${sheetCasteTree.SIDEREALS.map(i => /*css*/`.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex`).join(',\n')} {
    background:
        linear-gradient(324deg, white 4%,   transparent 4%) -35px 21px,
        linear-gradient( 36deg, white 4%,   transparent 4%) 15px 21px,
        linear-gradient( 72deg, var(--bs-aspect-color) 8.5%, transparent 8.5%) 15px 21px,
        linear-gradient(288deg, var(--bs-aspect-color) 8.5%, transparent 8.5%) -35px 21px,
        linear-gradient(216deg, var(--bs-aspect-color) 7.5%, transparent 7.5%) -35px 11px,
        linear-gradient(144deg, var(--bs-aspect-color) 7.5%, transparent 7.5%) 15px 11px,
        linear-gradient(324deg, white 4%,   transparent 4%) -10px 46px,
        linear-gradient( 36deg, white 4%,   transparent 4%) 40px 46px,
        linear-gradient( 72deg, var(--bs-aspect-color) 8.5%, transparent 8.5%) 40px 46px,
        linear-gradient(288deg, var(--bs-aspect-color) 8.5%, transparent 8.5%) -10px 46px,
        linear-gradient(216deg, var(--bs-aspect-color) 7.5%, transparent 7.5%) -10px 36px,
        linear-gradient(144deg, var(--bs-aspect-color) 7.5%, transparent 7.5%) 40px 36px;
    background-color: white;
    background-size: 50px 50px;
}
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="endings"] ~ div.sheet-flex {          --bs-aspect-color: #8000800a; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="battles"] ~ div.sheet-flex {          --bs-aspect-color: #ff00000f; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="secrets"] ~ div.sheet-flex {          --bs-aspect-color: #0080000f; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="serenity"] ~ div.sheet-flex {         --bs-aspect-color: #0000ff0a; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="journeys"] ~ div.sheet-flex {         --bs-aspect-color: #ffff0033; }
/* Infernal box-shadow + Circle pattern */
${sheetCasteTree.INFERNALS.map(i => /*css*/`.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex`).join(',\n')} {
    --bs-section-color: #667D39;
    --other-green: #C6C77730;
    --back-green: var(--bs-section-color);
    background:
	repeating-radial-gradient(
		circle at 50% 25%,
		var(--other-green),
		var(--other-green) .25em,
		transparent 1em,
		transparent 2em
	),
	repeating-radial-gradient(
		circle at 25% 50%,
		var(--other-green),
		var(--other-green) .25em,
		transparent 1em,
		transparent 2em
	),
	repeating-radial-gradient(
		circle at 75% 50%,
		var(--other-green),
		var(--other-green) .25em,
		transparent 1em,
		transparent 2em
	), var(--back-green);

    background-blend-mode: overlay;
}
/* Abyssal box-shadow + text color */
${sheetCasteTree.ABYSSALS.map(i => /*css*/
    `.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex`).join(',\n')} {       --bs-section-color: black; color: white; }
/* Specific background for Abyssals */
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="midnight"] ~ div.sheet-flex {         background: linear-gradient(0deg, var(--bs-section-color), #7a0000, var(--bs-section-color)); }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="daybreak"] ~ div.sheet-flex {         background: linear-gradient(0deg, var(--bs-section-color), #7a0000); }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="dusk"] ~ div.sheet-flex {             background: linear-gradient(0deg, #7a0000, var(--bs-section-color)); }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="day"] ~ div.sheet-flex {              background: radial-gradient(#383838 40%, #ad7171 55%, var(--bs-section-color) 70%); }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="moonshadow"] ~ div.sheet-flex {       background: radial-gradient(#7a0000 25%, var(--bs-section-color) 42%, #7a0000 55%, var(--bs-section-color) 70%); }
/* Liminal box-shadow + text color */
${sheetCasteTree.LIMINALS.map(i => /*css*/`.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex`).join(',\n')} {
    --bs-section-color: #323131;
    --bs-section-color2: #afa8a8;
    color: white;
    background:
    linear-gradient(0deg, var(--bs-section-color), var(--bs-section-color2), var(--bs-section-color)),
    linear-gradient(90deg, var(--bs-section-color), var(--bs-section-color2), var(--bs-section-color));
    background-blend-mode: darken;
}

.sheet-rolltemplate-exalted3e_combatcast table {
    border-radius: 10px 10px 0 0;
    border:1px solid black;
    --bs-section-color: white;
}

.sheet-rolltemplate-exalted3e_cast > div.sheet-flex {
    border-radius:10px;
    display: flex;
    flex-direction: column;
    box-shadow: var(--bs-rolltemplate-poffset) var(--bs-rolltemplate-poffset) var(--bs-rolltemplate-blur) var(--bs-section-color),
                var(--bs-rolltemplate-noffset) var(--bs-rolltemplate-poffset) var(--bs-rolltemplate-blur) var(--bs-section-color),
                var(--bs-rolltemplate-poffset) var(--bs-rolltemplate-noffset) var(--bs-rolltemplate-blur) var(--bs-section-color),
                var(--bs-rolltemplate-noffset) var(--bs-rolltemplate-noffset) var(--bs-rolltemplate-blur) var(--bs-section-color);
    --bs-rolltemplate-poffset: 0;
    --bs-rolltemplate-noffset: 0;
    --bs-rolltemplate-blur: 9px;
    --bs-section-color: white;
}

.sheet-rolltemplate-exalted3e_cast > div.sheet-flex:has(.sheet-spell-name) {
    --bs-section-color: #dfb6ff;
    background-color: #dfb6ff;
}
.sheet-rolltemplate-exalted3e_cast > div.sheet-flex:has(.sheet-title-line[title="1"] .sheet-spell-name) {
    --bs-section-color: #ae67ff;
    background-color: #ae67ff;
}

.sheet-rolltemplate-exalted3e_cast > div.sheet-flex div.sheet-flex-row {
    display: flex;
}

.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row div.sheet-flex-cell {
    display: flex;
    justify-content: center;
}

.sheet-rolltemplate-exalted3e_cast > div.sheet-flex div.sheet-flex-row div.sheet-flex-grow-2 {
    flex-grow: 2;
}
.sheet-rolltemplate-exalted3e_cast > div.sheet-flex div.sheet-flex-row div.sheet-flex-grow-3 {
    flex-grow: 3;
}

.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row:last-child div.sheet-flex-cell {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

.sheet-rolltemplate-exalted3e_combatcast td {
    padding-left: 5px;
    padding-right: 5px;
}

.sheet-rolltemplate-exalted3e_combatcast table tbody tr:first-child,
.sheet-rolltemplate-exalted3e_combatcast table tbody tr:first-child td,
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row:first-child,
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row:first-child div.sheet-flex-cell {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
/* spell/charm title text shadow */
.sheet-rolltemplate-exalted3e_combatcast table tbody tr:first-child td,
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row:first-child div.sheet-flex-cell {
    padding-top: 5px;
    --bs-section-color: #ffd70080;
    text-shadow: var(--bs-rolltemplate-poffset) var(--bs-rolltemplate-poffset) var(--bs-rolltemplate-blur) var(--bs-section-color),
                 var(--bs-rolltemplate-noffset) var(--bs-rolltemplate-poffset) var(--bs-rolltemplate-blur) var(--bs-section-color),
                 var(--bs-rolltemplate-poffset) var(--bs-rolltemplate-noffset) var(--bs-rolltemplate-blur) var(--bs-section-color),
                 var(--bs-rolltemplate-noffset) var(--bs-rolltemplate-noffset) var(--bs-rolltemplate-blur) var(--bs-section-color);
}
/* Solar specific */
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="zenith"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell,
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="twilight"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell {      --bs-section-color: #ffcc0060; color: gold; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="dawn"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell,
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="eclipse"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell {       --bs-section-color: white; color: gold; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="night"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell{          --bs-section-color: black; color: gold; }
/* Lunar specific */
${sheetCasteTree.LUNARS.map(i => /*css*/
    `.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell`).join(',\n')} {       --bs-section-color: rgba(128, 128, 128, 0.5); color: gray; }
/* DB specific */
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="air"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell {           --bs-section-color: cyan; color: blue; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="earth"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell {         --bs-section-color: #6a3c01; color: white; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="fire"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell {          --bs-section-color: orangered; color: red; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="water"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell {         --bs-section-color: black; color: blue; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="wood"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell {          --bs-section-color: lime; color: #6a3c01; }
/* Sidereals specific */
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="endings"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell {       --bs-section-color: purple; color: purple; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="battles"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell {       --bs-section-color: orangered; color: red; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="secrets"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell {       --bs-section-color: green; color: green; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="serenity"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell {      --bs-section-color: blue; color: pink; }
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="journeys"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell {      --bs-section-color: orange; color: yellow; }
/* Infernals specific */
${sheetCasteTree.INFERNALS.map(i => /*css*/
    `.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell`).join(',\n')} {        --bs-section-color: green; color: lime; }
/* Abyssals specific */
${sheetCasteTree.ABYSSALS.map(i => /*css*/
    `.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell`).join(',\n')} {    --bs-section-color: darkred; color: red; }
/* Liminals specific */
${sheetCasteTree.LIMINALS.map(i => /*css*/
    `.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex div.sheet-flex-row:first-child div.sheet-flex-cell`).join(',\n')} {          --bs-section-color: white; color: black; }
/* default title */
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row.sheet-title-line {
    color:#0095c6;
    font-size:20px;
    font-weight:bold;
    justify-content: center;
}
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row.sheet-title-line > div.sheet-flex-cell {
    flex-grow: 1;
}

.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row.sheet-aspect-name-line,
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row.sheet-skill-type-line {
    align-items: center;
}
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row.sheet-aspect-name-line .sheet-subheader,
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row.sheet-skill-type-line .sheet-subheader {
    font-size:16px;
    text-transform: capitalize;
}
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row.sheet-aspect-name-line div:nth-child(2) {
    align-items: center;
}
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row.sheet-aspect-name-line {
    justify-content: right;
    margin-top: -5px;
    margin-right: 5px;
}
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row.sheet-skill-type-line {
    justify-content: center;
    margin-top: -10px;
}

.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row.sheet-keyword-line {
    justify-content: center;
}
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row.sheet-keyword-line .sheet-subheader {
    font-size:12px;
}

.sheet-rolltemplate-exalted3e_cast div.sheet-flex-row.sheet-final-line > div.sheet-flex-cell {
    flex-basis: 33%;
    flex-grow: 1;
}

.sheet-rolltemplate-exalted3e_combatcast .sheet-charm-name,
.sheet-rolltemplate-exalted3e_cast .sheet-charm-name{
    color:#0095c6;
    font-size:20px;
    font-family: Cimiez;
    src: local('Cimiez Roman PDF.ttf'),
         url('https://imgsrv.roll20.net/?src=http%3A//lithl.info/cimiez.ttf') format('truetype');
    font-weight:bold;
}

.sheet-rolltemplate-exalted3e_cast .sheet-spell-name{
    color:purple;
    font-size:20px;
    font-family: Cimiez;
    src: local('Cimiez Roman PDF.ttf'),
         url('https://imgsrv.roll20.net/?src=http%3A//lithl.info/cimiez.ttf') format('truetype');
    font-weight:bold;
}

.sheet-rolltemplate-exalted3e_cast .sheet-skill-type-line .sheet-subheader span.sheet-skill.sheet-shaping-ritual{
    display: none;
}
.sheet-rolltemplate-exalted3e_cast .sheet-skill-type-line .sheet-subheader span.sheet-skill.sheet-shaping-ritual[title="1"]{
    display: block;
}
.sheet-rolltemplate-exalted3e_cast .sheet-skill-type-line .sheet-subheader span.sheet-skill.sheet-shaping-ritual[title="1"]:last-child{
    font-size: larger;
    outline: 1px black solid;
    border-radius: 5px;
    background-color: mediumpurple;
}

.sheet-rolltemplate-exalted3e_cast > div.sheet-flex .sheet-keyword-line[title="1"] .sheet-hide-on-sr,
.sheet-rolltemplate-exalted3e_cast > div.sheet-flex .sheet-keyword-line .sheet-show-on-sr,
.sheet-rolltemplate-exalted3e_cast > div.sheet-flex .sheet-final-line.sheet-hide-on-sr[title="1"] {
    display: none;
}
.sheet-rolltemplate-exalted3e_cast > div.sheet-flex .sheet-keyword-line[title="1"] .sheet-show-on-sr {
    display: block;
}

.sheet-rolltemplate-exalted3e_cast .sheet-subheader {
    font-family: Cimiez;
    src: local('Cimiez Roman PDF.ttf'),
         url('https://imgsrv.roll20.net/?src=http%3A//lithl.info/cimiez.ttf') format('truetype');
    font-size:18px;
    padding-top:5px;
}

.sheet-rolltemplate-exalted3e_cast .sheet-info{
    width:33%;
}

.sheet-rolltemplate-exalted3e_cast .sheet-info:not(:first-child){
    border-left: solid 1px #D3D3D3;
}

.sheet-rolltemplate-exalted3e_combatcast td.sheet-desc,
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-cell.sheet-desc,
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-cell.sheet-effect{
    padding: 0px;
    width: 100%;
}

.sheet-rolltemplate-exalted3e_combatcast div.sheet-desc,
.sheet-rolltemplate-exalted3e_cast div.sheet-desc {
    overflow-y: auto;
    resize: vertical;
}
.sheet-rolltemplate-exalted3e_combatcast div.sheet-desc,
.sheet-rolltemplate-exalted3e_cast div.sheet-desc,
.sheet-rolltemplate-exalted3e_cast div.sheet-effect{
    padding-left: 5px;
    padding-top: 5px;
    text-align:left;
}
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-cell.sheet-info > div,
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-cell.sheet-desc > div,
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-cell.sheet-effect > div {
    width: 100%;
}

.sheet-rolltemplate-exalted3e_cast div.sheet-flex-cell.sheet-effect > div > span.sheet-effect-data {
    display: none;
}
.sheet-rolltemplate-exalted3e_cast div.sheet-flex-cell.sheet-effect:hover > div > span.sheet-effect-data {
    display: block;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
}

.sheet-rolltemplate-exalted3e_combatcast *,
.sheet-rolltemplate-exalted3e_cast * {
    scrollbar-width: thin;
    scrollbar-color: #90A4AE #CFD8DC;
}

.sheet-rolltemplate-exalted3e_combatcast *::-webkit-scrollbar,
.sheet-rolltemplate-exalted3e_cast *::-webkit-scrollbar {
    width: 9px;
    cursor: pointer;
}

.sheet-rolltemplate-exalted3e_combatcast *::-webkit-scrollbar-thumb,
.sheet-rolltemplate-exalted3e_cast *::-webkit-scrollbar-thumb {
    background-color: #90A4AE;
    border-radius: 2px;
    border: 1px solid #CFD8DC;
}

.sheet-rolltemplate-exalted3e_combatcast *::-webkit-scrollbar-thumb:hover,
.sheet-rolltemplate-exalted3e_cast *::-webkit-scrollbar-thumb:hover {
    background-color: #7a8991;
}

.sheet-rolltemplate-exalted3e_combatcast *::-webkit-scrollbar-track,
.sheet-rolltemplate-exalted3e_cast *::-webkit-scrollbar-track {
    background: #CFD8DC;
}

.sheet-rolltemplate-exalted3e_combatcast div.sheet-desc,
.sheet-rolltemplate-exalted3e_cast div.sheet-desc{
    height: 38px;
    font-style: italic;
    background-color: #ffffff20;
}

.sheet-rolltemplate-exalted3e_cast div.sheet-effect{
    background-color:#00000030;
}

.sheet-rolltemplate-exalted3e_combatcast span,
.sheet-rolltemplate-exalted3e_cast span{
    font-style:normal;
    font-weight:bold;
    font-size:15px;
}

.sheet-rolltemplate-exalted3e_cast .sheet-aspect-name-line span[title="0"]{
    display: none;
}

.sheet-rolltemplate-exalted3e_cast .sheet-aspect-name-line span:last-child > img,
.sheet-rolltemplate-exalted3e_cast .sheet-skill-type-line span > img {
    outline: 1px black solid;
    background-color: #00000060;
}
/* Aspect outline area specifics */
.sheet-rolltemplate-exalted3e_cast .sheet-aspect-name-line span:last-child > img {
    border-radius: 15px;
}
${[...sheetCasteTree.INFERNALS, ...sheetCasteTree.SIDEREALS].map(i => /*css*/
    `.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img`).join(',\n')} {
    border-radius: unset;
}
${sheetCasteTree.SIDEREALS.map(i => /*css*/
    `.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img`).join(',\n')} {
    background-color: #00000040;
}
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="battles"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img {
    border-top-left-radius: 15px;
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 11px;
}
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="endings"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img {
    border-top-right-radius: 15px;
    border-top-left-radius: 10px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 15px;
}
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="secrets"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img {
    border-top-right-radius: 15px;
    border-top-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 15px;
}
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="serenity"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img,
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="journeys"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img {
    border-radius: 12px;
}
${sheetCasteTree.INFERNALS.map(i => /*css*/
    `.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img`).join(',\n')} {
    background-color: #00ff0040;
}
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="defiler"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img {
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
}
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="malefactor"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img {
    border-radius: 10px;
}
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="fiend"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img,
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="scourge"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img {
    border-radius: 15px;
}
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="slayer"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img {
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
}
${sheetCasteTree.ABYSSALS.map(i => /*css*/
    `.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img`).join(',\n')} {
    background-color: #ff000040;
}
${sheetCasteTree.ALCHEMICALS.map(i => /*css*/
    `.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="${i.toLowerCase()}"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img`).join(',\n')} {
    background-color: #00000020;
}
.sheet-rolltemplate-exalted3e_cast > span.sheet-hidden[title="sorceries"] ~ div.sheet-flex .sheet-aspect-name-line span:last-child > img {
    outline: unset;
    background-color: unset;
    border-radius: unset;
}

.sheet-rolltemplate-exalted3e_cast .sheet-skill-type-line span > img {
    border-radius: 5px;
}

.sheet-rolltemplate-exalted3e_cast span > img{
    width: 1.5em;
    height: 1.5em;
}

.sheet-rolltemplate-exalted3e_cast span.sheet-aspect > img {
    width: 2em;
    height: 2em;
}

.sheet-rolltemplate-exalted3e_cast span.sheet-type > img[title="none"],
.sheet-rolltemplate-exalted3e_cast span.sheet-aspect > img[title="none"] {
    width: 0;
    height: 0;
}

.sheet-rolltemplate-exalted3e_cast img[title="Simple"]                          { content: url('https://s3.amazonaws.com/files.d20.io/images/359011059/a4fo8e44XvIevADyteUKhg/max.png?1694745120'); }
.sheet-rolltemplate-exalted3e_cast span[title="1"] img[title="Simple"]          { content: url('https://s3.amazonaws.com/files.d20.io/images/359063713/xkxlqiUcYByBTBOVCHBNNQ/max.png?1694793441'); }
.sheet-rolltemplate-exalted3e_cast img[title="Supplemental"]                    { content: url('https://s3.amazonaws.com/files.d20.io/images/359011060/98hIHQxYC88jYNbDbL5mZQ/max.png?1694745120'); }
.sheet-rolltemplate-exalted3e_cast span[title="1"] img[title="Supplemental"]    { content: url('https://s3.amazonaws.com/files.d20.io/images/359063716/z5dwUJoYiHzpKH6ineZ-4w/max.png?1694793441'); }
.sheet-rolltemplate-exalted3e_cast img[title="Reflexive"]                       { content: url('https://s3.amazonaws.com/files.d20.io/images/359011063/D7CF4yHatd4YL_Wmw5Iqbw/max.png?1694745120'); }
.sheet-rolltemplate-exalted3e_cast span[title="1"] img[title="Reflexive"]       { content: url('https://s3.amazonaws.com/files.d20.io/images/359063714/Olizcv_E_oC4rkTyDFDQUQ/max.png?1694793441'); }
.sheet-rolltemplate-exalted3e_cast img[title="Double"]                          { content: url('https://s3.amazonaws.com/files.d20.io/images/359011062/YrCkeJaY8nTRIVj9l6eYvQ/max.png?1694745120'); }
.sheet-rolltemplate-exalted3e_cast span[title="1"] img[title="Double"]          { content: url('https://s3.amazonaws.com/files.d20.io/images/359063715/tP6EKHI1_qbLyoVoAdHqwQ/max.png?1694793441'); }
.sheet-rolltemplate-exalted3e_cast img[title="Permanent"]                       { content: url('https://s3.amazonaws.com/files.d20.io/images/359011061/H3Wgg-mSkPCYfo4W9M28Vw/max.png?1694745120'); }

.sheet-rolltemplate-exalted3e_cast img[title="zenith"]          { content: url('https://s3.amazonaws.com/files.d20.io/images/287863297/KJXoJYat_oCa2WPUJTJx7Q/max.png?1654114629'); }
.sheet-rolltemplate-exalted3e_cast img[title="dawn"]            { content: url('https://s3.amazonaws.com/files.d20.io/images/289224722/2PTxxCqN9PnIFP-08ji-HA/max.png?1654898555'); }
.sheet-rolltemplate-exalted3e_cast img[title="twilight"]        { content: url('https://s3.amazonaws.com/files.d20.io/images/289224750/VSxk0-pVumQRb6qKoF326g/max.png?1654898564'); }
.sheet-rolltemplate-exalted3e_cast img[title="night"]           { content: url('https://s3.amazonaws.com/files.d20.io/images/287863296/-NW0u39GAfwM8nKKKWXXmA/max.png?1654114629'); }
.sheet-rolltemplate-exalted3e_cast img[title="eclipse"]         { content: url('https://s3.amazonaws.com/files.d20.io/images/289224731/niPD_rJh1vhKZqa92svF3A/max.png?1654898557'); }
.sheet-rolltemplate-exalted3e_cast img[title="casteless"]       { content: url('https://s3.amazonaws.com/files.d20.io/images/286517312/wloZbCUcbMz64zExGUq96w/max.png?1653337673'); }
.sheet-rolltemplate-exalted3e_cast img[title="changing moon"]   { content: url('https://s3.amazonaws.com/files.d20.io/images/289224815/tI6Q_xSvE9VLnjB0PI30Fg/max.png?1654898590'); }
.sheet-rolltemplate-exalted3e_cast img[title="full moon"]       { content: url('https://s3.amazonaws.com/files.d20.io/images/289224824/ZDe2d2ovY7UeicCk6tEOvQ/max.png?1654898594'); }
.sheet-rolltemplate-exalted3e_cast img[title="no moon"]         { content: url('https://s3.amazonaws.com/files.d20.io/images/289025253/nUEsxTKOrZBu8AxUXw8f9Q/max.png?1654783243'); }
.sheet-rolltemplate-exalted3e_cast img[title="endings"]         { content: url('https://s3.amazonaws.com/files.d20.io/images/297567476/qGNapVpjgvKcY0sjX_4q2A/max.png?1659403697'); }
.sheet-rolltemplate-exalted3e_cast img[title="battles"]         { content: url('https://s3.amazonaws.com/files.d20.io/images/297567475/WjcPl0cTNIWFVwlSAJsoDw/max.png?1659403697'); }
.sheet-rolltemplate-exalted3e_cast img[title="secrets"]         { content: url('https://s3.amazonaws.com/files.d20.io/images/297567474/lzH22iV-4A29MOdwYEjIXQ/max.png?1659403697'); }
.sheet-rolltemplate-exalted3e_cast img[title="serenity"]        { content: url('https://s3.amazonaws.com/files.d20.io/images/297567477/1WaIxdJPZXUo3FisSpDqUA/max.png?1659403697'); }
.sheet-rolltemplate-exalted3e_cast img[title="journeys"]        { content: url('https://s3.amazonaws.com/files.d20.io/images/297567473/lKtXtQG23FvN9qW00gwTAg/max.png?1659403697'); }
.sheet-rolltemplate-exalted3e_cast img[title="air"]             { content: url('https://s3.amazonaws.com/files.d20.io/images/290329795/wYZAcE0p3HGpld-My69TLw/max.png?1655517794'); }
.sheet-rolltemplate-exalted3e_cast img[title="earth"]           { content: url('https://s3.amazonaws.com/files.d20.io/images/290329796/D3dl9vUlnpW6-62YBxOlYA/max.png?1655517794'); }
.sheet-rolltemplate-exalted3e_cast img[title="fire"]            { content: url('https://s3.amazonaws.com/files.d20.io/images/290329793/hlr3nMlOBHTIb-v2-2kjtQ/max.png?1655517794'); }
.sheet-rolltemplate-exalted3e_cast img[title="water"]           { content: url('https://s3.amazonaws.com/files.d20.io/images/290329797/Xy9MXwjo9o9brGuChOFbpQ/max.png?1655517794'); }
.sheet-rolltemplate-exalted3e_cast img[title="wood"]            { content: url('https://s3.amazonaws.com/files.d20.io/images/290329794/2UyfCRr3dIkh5kZNObDbqw/max.png?1655517794'); }

.sheet-rolltemplate-exalted3e_cast img[title="adamant"]         { content: url('https://s3.amazonaws.com/files.d20.io/images/290355484/ECiPyO0Uh9HBNru94e2jJQ/max.png?1655534509'); }
.sheet-rolltemplate-exalted3e_cast img[title="jade"]            { content: url('https://s3.amazonaws.com/files.d20.io/images/290355486/76VFhvLhjVCZSQ-KLlsXkw/max.png?1655534509'); }
.sheet-rolltemplate-exalted3e_cast img[title="moonsilver"]      { content: url('https://s3.amazonaws.com/files.d20.io/images/290355483/tXC0-EryOTOCP0GplhICCw/max.png?1655534509'); }
.sheet-rolltemplate-exalted3e_cast img[title="orichalcum"]      { content: url('https://s3.amazonaws.com/files.d20.io/images/290355485/RTnMnr-wT7MCgK9y09A7QQ/max.png?1655534509'); }
.sheet-rolltemplate-exalted3e_cast img[title="soulsteel"]       { content: url('https://s3.amazonaws.com/files.d20.io/images/290355487/hG7WKJbWMjZtXnuQdgs0RA/max.png?1655534509'); }
.sheet-rolltemplate-exalted3e_cast img[title="starmetal"]       { content: url('https://s3.amazonaws.com/files.d20.io/images/290355488/nMrXIRQfzoxosVhL7-vqmw/max.png?1655534509'); }
.sheet-rolltemplate-exalted3e_cast img[title="daybreak"]        { content: url('https://s3.amazonaws.com/files.d20.io/images/290355493/N4amjrZkvnjLmU99IjHQ5w/max.png?1655534516'); }
.sheet-rolltemplate-exalted3e_cast img[title="day"]             { content: url('https://s3.amazonaws.com/files.d20.io/images/290355492/AJtOq2-jkbSP4LGG1kEKyA/max.png?1655534516'); }
.sheet-rolltemplate-exalted3e_cast img[title="dusk"]            { content: url('https://s3.amazonaws.com/files.d20.io/images/290355496/fpMl8yYhjVmWtWNa7ra3pw/max.png?1655534516'); }
.sheet-rolltemplate-exalted3e_cast img[title="midnight"]        { content: url('https://s3.amazonaws.com/files.d20.io/images/290355495/Y0LKm5XpoyjGVb9BwZRZ1A/max.png?1655534516'); }
.sheet-rolltemplate-exalted3e_cast img[title="moonshadow"]      { content: url('https://s3.amazonaws.com/files.d20.io/images/290355494/ByEJc864bB1dQkcC5cDFRw/max.png?1655534516'); }
.sheet-rolltemplate-exalted3e_cast img[title="defiler"]         { content: url('https://s3.amazonaws.com/files.d20.io/images/290355470/xbldGX1-5af-6wrCklSZtg/max.png?1655534499'); }
.sheet-rolltemplate-exalted3e_cast img[title="fiend"]           { content: url('https://s3.amazonaws.com/files.d20.io/images/290355471/O2fhv2kqA7EgLD4MyW717g/max.png?1655534499'); }
.sheet-rolltemplate-exalted3e_cast img[title="malefactor"]      { content: url('https://s3.amazonaws.com/files.d20.io/images/290355469/Qzg9YYfn5ie3z3bqhVjuTQ/max.png?1655534499'); }
.sheet-rolltemplate-exalted3e_cast img[title="scourge"]         { content: url('https://s3.amazonaws.com/files.d20.io/images/290355467/Te60NdSOWjf2DE9l6Y3jgg/max.png?1655534499'); }
.sheet-rolltemplate-exalted3e_cast img[title="slayer"]          { content: url('https://s3.amazonaws.com/files.d20.io/images/290355468/Yc98p0D9aXwi8trR_3MQbA/max.png?1655534499'); }

.sheet-rolltemplate-exalted3e_cast img[title="blood"]           { content: url('https://s3.amazonaws.com/files.d20.io/images/290361592/-rdnufdzliozAjQTWsnSGA/max.png?1655540279'); }
.sheet-rolltemplate-exalted3e_cast img[title="breath"]          { content: url('https://s3.amazonaws.com/files.d20.io/images/290361592/-rdnufdzliozAjQTWsnSGA/max.png?1655540279'); }
.sheet-rolltemplate-exalted3e_cast img[title="flesh"]           { content: url('https://s3.amazonaws.com/files.d20.io/images/290361592/-rdnufdzliozAjQTWsnSGA/max.png?1655540279'); }
.sheet-rolltemplate-exalted3e_cast img[title="marrow"]          { content: url('https://s3.amazonaws.com/files.d20.io/images/290361592/-rdnufdzliozAjQTWsnSGA/max.png?1655540279'); }
.sheet-rolltemplate-exalted3e_cast img[title="soil"]            { content: url('https://s3.amazonaws.com/files.d20.io/images/290361592/-rdnufdzliozAjQTWsnSGA/max.png?1655540279'); }

.sheet-rolltemplate-exalted3e_cast img[title="unknown"]         { content: url('https://s3.amazonaws.com/files.d20.io/images/290361592/-rdnufdzliozAjQTWsnSGA/max.png?1655540279'); }
.sheet-rolltemplate-exalted3e_cast img[title="none"]            { content: none; }

.sheet-rolltemplate-exalted3e_cast img[title="sorceries"]       { content: url('https://s3.amazonaws.com/files.d20.io/images/290361561/SB_IxeE7B6beH6LTt6R6fQ/max.png?1655540239'); }

.sheet-rolltemplate-exalted3e_cast table .inlinerollresult {
    background-color: #d09ee9;
}`;

console.log(outHtml);