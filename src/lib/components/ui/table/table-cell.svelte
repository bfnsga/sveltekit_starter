<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { cn } from '$lib/shadcn.js';

	type $$Props = HTMLTdAttributes;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<td
	class={cn('px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0', className)}
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</td>
