node .\json_reprocessor.js .\DB.json "DB Core" && node .\json_reprocessor.js .\DB_add.json "DB : Heirs to the Shogunate" && node .\json_merger.js '.\DB.out.json' '.\DB_add.out.json' 'DB_full.json'
