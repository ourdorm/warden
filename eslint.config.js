// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
    {
        ignores: ['src-tauri/**', 'dist/**', 'node_modules/**'],
    },
    {
        files: ['**/*.ts'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic
        ],
        rules: {
            'indent': ['error', 4], // vanilla JS indentation
        },
    }
);
