module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "no-fallthrough": ["error", { "commentPattern": "break[\\s\\w]*omitted", "allowEmptyCase": "true" }]
    }
}
