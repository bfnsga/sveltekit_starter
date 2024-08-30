<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import X from 'lucide-svelte/icons/x';
	import * as Dialog from './index.js';
	import { cn, flyAndScale } from '$lib/shadcn.js';

	type $$Props = DialogPrimitive.ContentProps;

	let className: $$Props['class'] = undefined;
	export let transition: $$Props['transition'] = flyAndScale;
	export let transitionConfig: $$Props['transitionConfig'] = {
		duration: 200
	};
	export { className as class };
</script>

<Dialog.Portal>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		{transition}
		{transitionConfig}
		class={cn(
			'fixed left-[50%] top-[50%] md:top-[45%] z-50 grid w-11/12 max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-4.5 pb-3.5 md:p-6 md:pb-5 shadow-lg rounded-lg md:w-full',
			className
		)}
		{...$$restProps}
	>
		<slot />
		<!-- <DialogPrimitive.Close
			class="absolute right-3.5 top-3.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-muted-foreground"
		>
			<X class="size-5" strokeWidth={1.75} />
			<span class="sr-only">Close</span>
		</DialogPrimitive.Close> -->
	</DialogPrimitive.Content>
</Dialog.Portal>
