<script lang="ts">
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import * as FormPrimitive from 'formsnap';
	import { cn } from '$lib/shadcn.js';

	type $$Props = FormPrimitive.FieldErrorsProps & {
		errorClasses?: string | undefined | null;
	};

	let className: $$Props['class'] = undefined;
	export { className as class };
	export let errorClasses: $$Props['class'] = undefined;
</script>

<FormPrimitive.FieldErrors
	class={cn('text-[0.85rem] text-destructive', className)}
	{...$$restProps}
	let:errors
	let:fieldErrorsAttrs
	let:errorAttrs
>
	<slot {errors} {fieldErrorsAttrs} {errorAttrs}>
		{#each errors as error}
			<div {...errorAttrs} class={cn('flex items-start', errorClasses)}>
				<TriangleAlert class="mr-[0.425rem] mt-[0.27rem] size-[0.725rem] flex-shrink-0" />
				{error}
			</div>
		{/each}
	</slot>
</FormPrimitive.FieldErrors>
