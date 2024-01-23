var fs = require('fs');

var args = process.argv.slice(2);
const file_in1 = args[0];
const file_in2 = args[1];
const file_out = args[2];

const list1 = JSON.parse(fs.readFileSync(file_in1));
const abi_list1 = Object.keys(list1);
const list2 = JSON.parse(fs.readFileSync(file_in2));
const abi_list2 = Object.keys(list2);
const finalObj = {};

for (const abi of abi_list1) {
    finalObj[abi] = list1[abi];
    if (list2[abi])
        finalObj[abi].push(...list2[abi]);
}

for (const abi of abi_list2) {
    if (!finalObj[abi])
        finalObj[abi] = list2[abi];
}

try {
    fs.writeFileSync(`${file_out}`, JSON.stringify(finalObj));
} catch (err) {
    console.error(err);
}