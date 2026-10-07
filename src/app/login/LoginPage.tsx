'use client'

import type { FC } from 'react'

import { LoginForm } from 'forms/login/LoginForm'
import { useLogin } from 'forms/login/useLogin'

export const LoginPage: FC = () => {
	const hook = useLogin()

	return (
		<main className='flex min-h-dvh bg-panel'>
			<div className='mx-auto flex w-full max-w-[22rem] flex-col justify-center px-4 py-12'>
				<h1 className='mb-8 text-[26px] leading-8 font-bold tracking-tight'>
					Вход через GREEN-API
				</h1>
				<LoginForm hook={hook} />
			</div>
		</main>
	)
}
