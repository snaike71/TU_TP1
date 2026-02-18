import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['src/**/*.{js,jsx}'],
        plugins: {
            react,
            'react-hooks': reactHooks
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true }
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node
            }
        },
        settings: {
            react: { version: 'detect' }
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
            'react/jsx-uses-vars': 'error',
            'react/prop-types': 'warn',
            'no-unused-vars': ['warn', { varsIgnorePattern: '^React$' }],
            'no-console': 'warn',
            'no-useless-escape': 'warn'
        }
    },
    {
        files: ['src/**/*.test.{js,jsx}'],
        languageOptions: {
            globals: {
                ...globals.jest,
                ...globals.node
            }
        }
    },
    {
        ignores: ['docs/', 'coverage/', 'node_modules/', 'cypress/']
    }
];
