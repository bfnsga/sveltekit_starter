<script lang="ts">
	// Import(s)
	///////////////////////////////////////////////
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { codeSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { PinInput } from '$lib/components/ui/pin-input';
	import { messages } from '$lib/stores';
	import { toast } from 'svelte-sonner';

	// Data
	///////////////////////////////////////////////
	export let data;

	// Form
	///////////////////////////////////////////////
	const form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(codeSchema),
		onError: () => {
			toast.error($messages.error);
		}
	});

	const { form: formData, submitting, enhance } = form;

	$: {
		const code = $formData.code.join('');
		if (code.length === 6) {
			form.submit();
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title tag="h2">Verify</Card.Title>
		<Card.Description>Enter the code from your verification email</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:enhance class="grid gap-2.5">
			<Form.Field {form} name="code" class="mx-auto">
				<Form.Control let:attrs>
					<PinInput bind:value={$formData.code} name={attrs.name} disabled={$submitting} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button disabled={$submitting} class="w-full">
				{#if $submitting}
					<LoaderCircle class="size-4 animate-spin" />
				{:else}
					Verify
				{/if}
			</Form.Button>
		</form>
	</Card.Content>
	<Card.Footer class="justify-center">
		<div class="flex items-center space-x-1 text-[0.875rem] text-muted-foreground">
			<p>Didn't receive an email?</p>
			<button
				on:click={() => {
					history.back();
				}}
				class="font-medium underline underline-offset-2 text-foreground"
			>
				Try again
			</button>
			.
		</div>
	</Card.Footer>
</Card.Root>
