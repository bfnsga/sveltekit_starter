<script lang="ts">
	//////
	import { cn } from '$lib/shadcn.js';

	//////
	export let header = 'Page Header';
	export let description = '';
	let className = '';
	export { className as class };
</script>

<div class={cn('grid gap-8', className)}>
	<div class="flex items-start justify-between">
		<div class="grid gap-1.5">
			<h1 class="text-2xl font-bold md:text-3xl tracking-tight">{header}</h1>
			<p class="text-muted-foreground text-[0.95rem]">{description}</p>
		</div>
		<slot name="headerAction" />
	</div>
	<slot />
</div>
