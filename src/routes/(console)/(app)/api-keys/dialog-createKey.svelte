<script lang="ts">
	//////
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { LoaderCircle } from 'lucide-svelte';

	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { apiKeys } from '$lib/schema';
	import { toast } from 'svelte-sonner';

	import { messages } from '$lib/stores';

	//////
	export let open = false;
	let keyCreated = false;
	let apiKey = '';
	let copied = false;

	//////
	const form = superForm(defaults(zod(apiKeys.create)), {
		SPA: true,
		validators: zod(apiKeys.create),
		onUpdate: async ({ form, cancel }) => {
			if (form.valid) {
				const response = await fetch('/api/api_keys', {
					method: 'POST',
					body: JSON.stringify(form.data)
				});

				if (!response.ok) {
					toast.error($messages.error);
					return;
				}

				const { data } = await response.json();
				apiKey = data;
				keyCreated = true;
				cancel();
			}
		}
	});
	const { form: formData, submitting, enhance } = form;

	//////
	async function copyText() {
		copied = true;
		await navigator.clipboard.writeText(apiKey);
		toast.success('API Key copied!');
		setTimeout(() => {
			copied = false;
		}, 100);
	}

	function closeDialog(action: 'close' | 'done' = 'close') {
		form.reset();
		dispatch(action);
	}
</script>

<Dialog.Root
	bind:open
	closeOnOutsideClick={true}
	onOpenChange={() => {
		closeDialog();
	}}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				{#if !keyCreated}
					Create New Key
				{:else}
					Save Key
				{/if}
			</Dialog.Title>
		</Dialog.Header>
		<Dialog.Separator />
		{#if !keyCreated}
			<form method="POST" use:enhance>
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} type="text" />
					</Form.Control>
					<Form.FieldErrors />
					<Form.Description class="leading-[1.375rem] pt-1 pb-2">
						Create a new API key to securely connect your applications with our services.
					</Form.Description>
				</Form.Field>
				<Dialog.Footer>
					<Button
						variant="secondary"
						type="button"
						on:click={() => {
							closeDialog();
						}}>Cancel</Button
					>
					<Button class="w-20" type="submit" disabled={$submitting}>
						{#if $submitting}
							<LoaderCircle class="size-4 animate-spin" />
						{:else}
							Button
						{/if}
					</Button>
				</Dialog.Footer>
			</form>
		{:else}
			<div class="flex items-end gap-1">
				<div class="space-y-1 w-full">
					<Label>API Key</Label>
					<Input value={apiKey} disabled={true} class="!opacity-90" />
				</div>
				<Button variant="secondary" class="h-[2.9rem] w-18" disabled={copied} on:click={copyText}>
					Copy
				</Button>
			</div>
			<p class="text-[0.875rem] text-muted-foreground leading-6">
				Please save this secret key somewhere safe and accessible. For security reasons, you won't
				be able to view it again. If you lose this secret key, you'll need to generate a new one.
			</p>
			<Dialog.Footer>
				<Button
					on:click={() => {
						closeDialog('done');
					}}
				>
					Done
				</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
