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
            'indent': ['error', 4],
            'import/extensions': ['error', 'ignorePackages', {
                ts: 'never',
                js: 'never'
            }]
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json'
                }
            }
        }
    }
);
