<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/shadcn.js';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div
	class={cn('md:-mt-1 flex flex-col space-y-1.5 text-left md:pb-0.5', className)}
	{...$$restProps}
>
	<slot />
</div>
