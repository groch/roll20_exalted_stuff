node .\node_roll20_character_sheet_css_assembler.js > .\roll20_character_sheet.test.css

$allOutput = & compare-object -CaseSensitive (get-content .\roll20_character_sheet.css) (get-content .\roll20_character_sheet.test.css)
$stdout = $allOutput | ?{ $_ -isnot [System.Management.Automation.ErrorRecord] }

if ($stdout -eq "" -or $stdout -eq $null) {
    echo "Files are Identical !"
    rm .\roll20_character_sheet.test.css
} else {
    echo "Files are different !"
    compare-object -CaseSensitive (get-content .\roll20_character_sheet.css) (get-content .\roll20_character_sheet.test.css)
}