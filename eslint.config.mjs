import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	prettierRecommended,
	globalIgnores([
		'.next/**',
		'out/**',
		'build/**',
		'coverage/**',
		'next-env.d.ts',
		'node_modules/**',
		'__mocks__/*.js'
	]),
	{
		rules: {
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ vars: 'all', args: 'after-used', ignoreRestSiblings: true }
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-empty-function': 'off',
			'import/no-anonymous-default-export': 'off',
			'react-hooks/exhaustive-deps': 'off',
			'prefer-const': 'warn',
			'prettier/prettier': ['warn', { endOfLine: 'auto', printWidth: 100 }]
		}
	}
])

export default eslintConfig
