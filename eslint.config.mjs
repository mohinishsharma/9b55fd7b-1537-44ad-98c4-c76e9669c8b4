import tslint from 'typescript-eslint'
import eslintjs from '@eslint/js'

export default tslint.config(
    {
        ignores: ['eslint.config.ts'],
    },
    {
    },
    {
        rules: {
            ...eslintjs.configs.recommended.rules,
        }
    },
    ...tslint.configs.recommended,
    {
        files: ['src/**/*.ts'],
        rules: {
            'no-console': 'error',
        }
    }
)