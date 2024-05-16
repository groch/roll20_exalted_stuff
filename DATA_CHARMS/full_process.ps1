cp .\INPUT\Exalt_Charms\* .
rm .\PROCESSED\*
.\repro_and_merge_solar.ps1 && mv .\Solaire.json .\PROCESSED\ && mv .\Solaire.out.json .\PROCESSED\ && mv .\Solaire_add.json .\PROCESSED\ && mv .\Solaire_add.out.json .\PROCESSED\ && mv .\Solaire_full.json .\DONE\ -force
.\repro_and_merge_db.ps1 && mv .\DB.json .\PROCESSED\ && mv .\DB.out.json .\PROCESSED\ && mv .\DB_add.json .\PROCESSED\ && mv .\DB_add.out.json .\PROCESSED\ && mv .\DB_full.json .\DONE\ -force
.\repro_and_merge_lunar.ps1 && mv .\Lunaire.json .\PROCESSED\ && mv .\Lunaire.out.json .\PROCESSED\ && mv .\Lunaire_add.json .\PROCESSED\ && mv .\Lunaire_add.out.json .\PROCESSED\ && mv .\Lunaire_full.json .\DONE\ -force
node .\json_reprocessor.js .\Siderals.json "Sidereals" && mv .\Siderals.json .\PROCESSED\ && mv .\Siderals.out.json .\DONE\ -force
node .\json_reprocessor.js .\Abyssal.json && mv .\Abyssal.json .\PROCESSED\ && mv .\Abyssal.out.json .\DONE\ -force
