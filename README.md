# roll20_exalted_stuff

I've started to work on an exalted campain on Roll20 which, for conveniency, i've decided to improve QoL on sheet, and overall

So here you can find included :
- `node_roll20_character_sheet_html_assembler.js`: the file used to produce the sheet html
- `node_roll20_character_sheet_css_assembler.js`: the file used to produce the sheet css
- `node_roll20_common_include.js`: the common code used in both assembler files above, mostly data structures/fx/config for the sheet
- `sheet_worker.js`: the js part of the sheet html called **sheetworker** by Roll20
- `roll20_character_sheet.html`: the sheet html
- `roll20_character_sheet.css`: the sheet css
- `combat_master.js`: the "Combat Master" **roll20 script** that i modified heavily to fit the exalted 3e playstyle
- `ex3_dice_roller.js`: a dice roller **roll20 script** for Ex3
- `DoorKnocker.js`: a tweaked version of the **roll20 script** "DoorKnocker" *(might be outdated)*
- `ping_buddy_fork.js`: a **roll20 script** i use to focus the vision on the group and for each player to help find his token
- `roll20_macros.txt`: some Roll20 Macros i use in my own game
- `node_dice_roller.js`: a way to roll on your own computer and do some statistical analysis of the rolls

---
## Dice Roller on Desktop & Statistical anaysis

The script `node_dice_roller.js` can be used to do some statistical analysis of some rolls with almost same syntax as the one used in the dice roller.\
Example: `node .\node_dice_roller.js "!exr 20#+2 -d 9 -E 10" 4200` which will roll 4200 times the expression `!exr 20#+2 -d 9 -E 10` and display it

---
## Assemble the HTML sheet file yourself

To have UTF8 encoding in powershell console paste this in the console *(for current session)* or in the profile file\
`$OutputEncoding = [Console]::InputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding`

Then to be sure to have the last version of the HTML file, you can type this command *(i should update the sheet here each time but in case you need it ...)*\
`node .\node_roll20_character_sheet_assembler.js > .\roll20_character_sheet.html`