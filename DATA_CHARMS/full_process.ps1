cp .\INPUT\* .
rm .\PROCESSED\*
.\repro_and_merge_solar.ps1 && mv .\Solaire.json .\PROCESSED\ && mv .\Solaire.out.json .\PROCESSED\ && mv .\Solaire_add.json .\PROCESSED\ && mv .\Solaire_add.out.json .\PROCESSED\ && mv .\Solaire_full.json .\DONE+EDITED\ -force
.\repro_and_merge_db.ps1 && mv .\DB.json .\PROCESSED\ && mv .\DB.out.json .\PROCESSED\ && mv .\DB_add.json .\PROCESSED\ && mv .\DB_add.out.json .\PROCESSED\ && mv .\DB_full.json .\DONE+EDITED\ -force
node .\json_reprocessor.js .\Lunaire.json "Lunars" && mv .\Lunaire.json .\PROCESSED\ && mv .\Lunaire.out.json .\DONE+EDITED\ -force
node .\json_reprocessor.js .\Siderals.json "Sidereals" && mv .\Siderals.json .\PROCESSED\ && mv .\Siderals.out.json .\DONE+EDITED\ -force
node .\json_reprocessor.js .\Abyssal.json && mv .\Abyssal.json .\PROCESSED\ && mv .\Abyssal.out.json .\DONE+EDITED\ -force
