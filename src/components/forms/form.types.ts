import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form'

export interface IHookForm<T extends FieldValues> {
	form: UseFormReturn<T>
	isPending: boolean
	onSubmit: SubmitHandler<T>
}
