node .\node_roll20_character_sheet_html_assembler.js > .\roll20_character_sheet.test.html

$allOutput = & compare-object -CaseSensitive (get-content .\roll20_character_sheet.html) (get-content .\roll20_character_sheet.test.html)
$stdout = $allOutput | ?{ $_ -isnot [System.Management.Automation.ErrorRecord] }

if ($stdout -eq "" -or $stdout -eq $null) {
    echo "Files are Identical !"
    rm .\roll20_character_sheet.test.html
} else {
    echo "Files are different !"
    compare-object -CaseSensitive (get-content .\roll20_character_sheet.html) (get-content .\roll20_character_sheet.test.html)
}