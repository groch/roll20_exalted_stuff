export default {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "no-unused-vars": ["error", { "args": "none" }],
        "no-fallthrough": ["error", { "commentPattern": "break[\\s\\w]*omitted" }]
    }
}
