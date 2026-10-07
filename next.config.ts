import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		agentFeedback: true,
		optimizePackageImports: ['lucide-react']
	},
	cacheComponents: true,
	partialPrefetching: true,
	reactCompiler: true,
	reactStrictMode: true,
	poweredByHeader: false,
	logging: {
		fetches: {
			hmrRefreshes: true
		}
	},
	turbopack: {
		rules: {
			'*.css': {
				loaders: ['@tailwindcss/turbopack'],
				as: '*.css'
			}
		}
	}
}

export default nextConfig
