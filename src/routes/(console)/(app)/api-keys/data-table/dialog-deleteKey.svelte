<script lang="ts">
	//////
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { enhance } from '$app/forms';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { LoaderCircle } from 'lucide-svelte';

	import { messages } from '$lib/stores';

	//////
	export let open = false;
	export let keyId: string;
	export let key: string;
	export let name: string;
	let submitted = false;
</script>

<Dialog.Root
	bind:open
	onOpenChange={() => {
		dispatch('close');
	}}
>
	<Dialog.Content class="max-w-[450px]">
		<Dialog.Header>
			<Dialog.Title>Delete Key</Dialog.Title>
		</Dialog.Header>
		<div class="!leading-[1.6rem] text-[0.925rem] text-muted-foreground">
			<p>
				Are you sure you want to delete <span class="font-medium text-foreground/80">{name}</span>?
			</p>
			<p>This action cannot be undone.</p>
		</div>
		<form
			method="POST"
			action="?/deleteKey"
			use:enhance={() => {
				submitted = true;
				return async ({ result }) => {
					if (result.type === 'failure') {
						submitted = false;
						toast.error($messages.error);
					} else {
						toast.success('API Key successfully deleted.');
						dispatch('deleted');
					}
				};
			}}
		>
			<input type="hidden" value={keyId} name="id" />
			<Input disabled={true} value={key} class="!opacity-90" />
			<Dialog.Footer class="pt-1">
				<Button
					on:click={() => {
						dispatch('close');
					}}
					type="button"
					variant="secondary">Cancel</Button
				>
				<Button class="w-[6.65rem]" type="submit" disabled={submitted}>
					{#if submitted}
						<LoaderCircle class="size-4 animate-spin" />
					{:else}
						Delete Key
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
