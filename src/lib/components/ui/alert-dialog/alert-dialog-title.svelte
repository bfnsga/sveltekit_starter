<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/shadcn.js';

	type $$Props = AlertDialogPrimitive.TitleProps;

	let className: $$Props['class'] = undefined;
	export let level: $$Props['level'] = 'h3';
	export { className as class };
</script>

<AlertDialogPrimitive.Title
	class={cn('text-lg font-semibold -mb-0.5 -mt-1', className)}
	{level}
	{...$$restProps}
>
	<slot />
</AlertDialogPrimitive.Title>
