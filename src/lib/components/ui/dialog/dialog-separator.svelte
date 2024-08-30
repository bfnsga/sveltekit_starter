<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/shadcn.js';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<Separator class={cn('-mx-4.5 md:-mx-6 !w-auto', className)} />
