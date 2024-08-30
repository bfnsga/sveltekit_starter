<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { PinInput } from 'bits-ui';

	// type $$Props = HTMLInputAttributes;
	export let value: string[] | undefined = [];
	export let name: string;
	export let disabled: boolean = false;
</script>

<PinInput.Root
	bind:value
	class="flex items-center justify-center gap-2 !font-mono"
	type="text"
	placeholder=""
>
	<PinInput.Input
		{disabled}
		class="flex text-center h-[3.25rem] w-12 rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
	/>
	<PinInput.Input
		{disabled}
		class="flex text-center h-[3.25rem] w-12 rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
	/>
	<PinInput.Input
		{disabled}
		class="flex text-center h-[3.25rem] w-12 rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
	/>
	<PinInput.Input
		{disabled}
		class="flex text-center h-[3.25rem] w-12 rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
	/>
	<PinInput.Input
		{disabled}
		class="flex text-center h-[3.25rem] w-12 rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
	/>
	<PinInput.Input
		{disabled}
		class="flex text-center h-[3.25rem] w-12 rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
	/>
	<PinInput.HiddenInput {name} />
</PinInput.Root>
